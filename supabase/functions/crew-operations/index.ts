import { createClient } from 'jsr:@supabase/supabase-js@2'

type TeamRole = 'crew' | 'crew_trainer' | 'manager' | 'first_assistant' | 'store_manager'
type CurrentProfile = { id: string; username: string; role: TeamRole; can_review_task_proposals: boolean }

const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } })
const allowedOrigin = (origin: string | null) => new Set(['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:5174', 'http://127.0.0.1:5174']).has(origin ?? '') || /^https:\/\/rgrv-crew-training(?:-[a-z0-9-]+)?\.vercel\.app$/.test(origin ?? '')
const taskManagers = new Set<TeamRole>(['manager', 'first_assistant', 'store_manager'])
const manageableRoles = new Set<TeamRole>(['crew', 'crew_trainer', 'manager', 'first_assistant'])
const canManageTasks = (current: CurrentProfile) => taskManagers.has(current.role)
const canReviewProposals = (current: CurrentProfile) => canManageTasks(current) || current.can_review_task_proposals
const headers = (origin: string | null) => ({ 'Access-Control-Allow-Origin': origin && allowedOrigin(origin) ? origin : 'null', 'Access-Control-Allow-Headers': 'content-type', 'Access-Control-Allow-Methods': 'POST, OPTIONS', Vary: 'Origin', 'Content-Type': 'application/json; charset=utf-8' })
const json = (body: unknown, origin: string | null, status = 200) => new Response(JSON.stringify(body), { status, headers: headers(origin) })

async function hash(value: string) {
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))
  return [...new Uint8Array(bytes)].map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

async function actor(body: Record<string, unknown>): Promise<CurrentProfile | null> {
  const id = String(body.profile_id ?? '')
  const token = String(body.token ?? '')
  if (!id || !token) return null
  const { data } = await db.from('crew_profiles').select('id,username,role,can_review_task_proposals').eq('id', id).eq('token_hash', await hash(token)).maybeSingle()
  return data as CurrentProfile | null
}

async function feed(current: CurrentProfile, origin: string | null) {
  const [{ data: categories }, { data: tasks, error }, { data: profiles }] = await Promise.all([
    db.from('task_categories').select('id,name').order('name'),
    db.from('crew_tasks').select('*').order('created_at', { ascending: false }),
    db.from('crew_profiles').select('id,username'),
  ])
  if (error) return json({ error: 'Tâches indisponibles.' }, origin, 500)
  const names = new Map((profiles ?? []).map((profile) => [profile.id, profile.username]))
  const visible = (tasks ?? [])
    .filter((task) => !['pending', 'rejected'].includes(task.status) || canReviewProposals(current) || task.created_by === current.id)
    .map((task) => ({ ...task, createdBy: names.get(task.created_by) ?? 'Équipe', takenBy: task.taken_by ? names.get(task.taken_by) : null, completedBy: task.completed_by ? names.get(task.completed_by) : null }))
  return json({ categories: categories ?? [], tasks: visible, can_review_proposals: canReviewProposals(current) }, origin)
}

async function createTask(body: Record<string, unknown>, current: CurrentProfile, origin: string | null) {
  const title = String(body.title ?? '').trim()
  const categoryId = String(body.category_id ?? '')
  if (title.length < 3 || title.length > 180 || !categoryId) return json({ error: 'Tâche invalide.' }, origin, 400)
  const status = canManageTasks(current) ? 'todo' : 'pending'
  const { data, error } = await db.from('crew_tasks').insert({ title, category_id: categoryId, created_by: current.id, status }).select('id').single()
  if (error?.code === '23503') return json({ error: 'Cette catégorie n’existe plus. Actualise la page puis réessaie.' }, origin, 409)
  if (error || !data) return json({ error: 'Création impossible.' }, origin, 500)
  await db.from('task_events').insert({ task_id: data.id, actor_id: current.id, action: 'created', details: { status } })
  return feed(current, origin)
}

async function createCategory(body: Record<string, unknown>, current: CurrentProfile, origin: string | null) {
  if (!canManageTasks(current)) return json({ error: 'Seul un manager peut ajouter une catégorie.' }, origin, 403)
  const name = String(body.name ?? '').trim().replace(/\s+/g, ' ')
  if (name.length < 2 || name.length > 60) return json({ error: 'Nom de catégorie invalide.' }, origin, 400)
  const { data, error } = await db.from('task_categories').insert({ name, created_by: current.id }).select('id').single()
  if (error?.code === '23505') return json({ error: 'Cette catégorie existe déjà.' }, origin, 409)
  if (error || !data) return json({ error: 'Catégorie impossible à créer.' }, origin, 500)
  await db.from('task_events').insert({ task_id: null, actor_id: current.id, action: 'category_created', details: { category_id: data.id, name } })
  return feed(current, origin)
}

async function transition(body: Record<string, unknown>, current: CurrentProfile, origin: string | null) {
  const taskId = String(body.task_id ?? '')
  const action = String(body.transition ?? '')
  const now = new Date().toISOString()
  let query
  let event: 'approved' | 'rejected' | 'taken' | 'completed'

  if (action === 'approve' || action === 'reject') {
    if (!canReviewProposals(current)) return json({ error: 'Action non autorisée.' }, origin, 403)
    const patch = action === 'approve' ? { status: 'todo', approved_by: current.id, approved_at: now } : { status: 'rejected', rejected_by: current.id, rejected_at: now }
    event = action === 'approve' ? 'approved' : 'rejected'
    query = db.from('crew_tasks').update({ ...patch, updated_at: now }).eq('id', taskId).eq('status', 'pending')
  } else if (action === 'take') {
    event = 'taken'
    query = db.from('crew_tasks').update({ status: 'doing', taken_by: current.id, updated_at: now }).eq('id', taskId).eq('status', 'todo').is('taken_by', null)
  } else if (action === 'complete') {
    event = 'completed'
    query = db.from('crew_tasks').update({ status: 'done', completed_by: current.id, completed_at: now, completion_note: String(body.completion_note ?? '').trim() || null, updated_at: now }).eq('id', taskId).eq('status', 'doing').eq('taken_by', current.id)
  } else {
    return json({ error: 'Action inconnue.' }, origin, 400)
  }

  const { data, error } = await query.select('id').maybeSingle()
  if (error) return json({ error: 'Mise à jour impossible.' }, origin, 500)
  if (!data) return json({ error: 'Cette tâche vient déjà d’être modifiée par un autre membre.' }, origin, 409)
  await db.from('task_events').insert({ task_id: taskId, actor_id: current.id, action: event })
  return feed(current, origin)
}

async function team(current: CurrentProfile, origin: string | null) {
  const [{ data: members, error }, { data: events }] = await Promise.all([
    db.from('crew_profiles').select('id,username,role').order('username'),
    db.from('task_events').select('id,actor_id,details,created_at').eq('action', 'role_changed').order('created_at', { ascending: false }).limit(12),
  ])
  if (error) return json({ error: 'Équipe indisponible.' }, origin, 500)
  const names = new Map((members ?? []).map((member) => [member.id, member.username]))
  const roleHistory = (events ?? []).map((event) => {
    const details = event.details as { member_name?: string; to?: TeamRole }
    return { id: event.id, actorName: names.get(event.actor_id) ?? 'Équipe', memberName: details.member_name ?? 'un membre', nextRole: details.to ?? 'crew', createdAt: event.created_at }
  })
  return json({ members: members ?? [], can_manage_team: current.role === 'store_manager' || current.role === 'first_assistant', can_edit_every_role: current.role === 'store_manager', role_history: roleHistory }, origin)
}

async function updateRole(body: Record<string, unknown>, current: CurrentProfile, origin: string | null) {
  const memberId = String(body.member_id ?? '')
  const nextRole = String(body.role ?? '') as TeamRole
  if (!manageableRoles.has(nextRole)) return json({ error: 'Rôle invalide.' }, origin, 400)
  const { data: member } = await db.from('crew_profiles').select('id,username,role').eq('id', memberId).maybeSingle()
  if (!member) return json({ error: 'Profil introuvable.' }, origin, 404)
  const storeManager = current.role === 'store_manager'
  const assistantPromotesManager = current.role === 'first_assistant' && member.role === 'crew' && nextRole === 'manager'
  if ((!storeManager && !assistantPromotesManager) || member.role === 'store_manager' || member.role === nextRole) return json({ error: 'Action non autorisée.' }, origin, 403)
  const { data, error } = await db.from('crew_profiles').update({ role: nextRole, updated_at: new Date().toISOString() }).eq('id', member.id).neq('role', 'store_manager').select('id').maybeSingle()
  if (error) return json({ error: 'Modification impossible.' }, origin, 500)
  if (!data) return json({ error: 'Ce rôle vient déjà d’être modifié.' }, origin, 409)
  await db.from('task_events').insert({ task_id: null, actor_id: current.id, action: 'role_changed', details: { member_id: member.id, member_name: member.username, from: member.role, to: nextRole } })
  return team(current, origin)
}

Deno.serve(async (request) => {
  const origin = request.headers.get('Origin')
  if (!allowedOrigin(origin)) return json({ error: 'Origine non autorisée.' }, origin, 403)
  if (request.method === 'OPTIONS') return new Response('ok', { headers: headers(origin) })
  if (request.method !== 'POST') return json({ error: 'Méthode non autorisée.' }, origin, 405)
  try {
    const body = await request.json() as Record<string, unknown>
    const current = await actor(body)
    if (!current) return json({ error: 'Session invalide.' }, origin, 401)
    if (body.action === 'operations') return feed(current, origin)
    if (body.action === 'create_task') return createTask(body, current, origin)
    if (body.action === 'create_category') return createCategory(body, current, origin)
    if (body.action === 'transition_task') return transition(body, current, origin)
    if (body.action === 'team') return team(current, origin)
    if (body.action === 'update_role') return updateRole(body, current, origin)
    return json({ error: 'Action inconnue.' }, origin, 400)
  } catch {
    return json({ error: 'Erreur serveur.' }, origin, 500)
  }
})
