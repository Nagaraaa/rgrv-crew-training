import { createClient } from 'jsr:@supabase/supabase-js@2'
import { FINAL_IDS, OFFICIAL, TRAINING } from './answers.ts'

const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } })
const roundSecret = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const allowedOrigin = (origin: string | null) => new Set(['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:5174', 'http://127.0.0.1:5174']).has(origin ?? '') || /^https:\/\/rgrv-crew-training(?:-[a-z0-9-]+)?\.vercel\.app$/.test(origin ?? '')

function headers(origin: string | null) {
  return { 'Access-Control-Allow-Origin': origin && allowedOrigin(origin) ? origin : 'null', 'Access-Control-Allow-Headers': 'content-type', 'Access-Control-Allow-Methods': 'POST, OPTIONS', Vary: 'Origin', 'Content-Type': 'application/json; charset=utf-8' }
}

function json(body: unknown, origin: string | null, status = 200) { return new Response(JSON.stringify(body), { status, headers: headers(origin) }) }
async function sha256(value: string) { const buffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value)); return [...new Uint8Array(buffer)].map((byte) => byte.toString(16).padStart(2, '0')).join('') }
const roundEncoder = new TextEncoder()
const encodeRound = (value: string | Uint8Array) => btoa(String.fromCharCode(...(typeof value === 'string' ? roundEncoder.encode(value) : value))).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '')
const decodeRound = (value: string) => Uint8Array.from(atob(value.replaceAll('-', '+').replaceAll('_', '/') + '='.repeat((4 - value.length % 4) % 4)), (character) => character.charCodeAt(0))
async function signRound(payload: string) {
  const key = await crypto.subtle.importKey('raw', roundEncoder.encode(roundSecret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  return encodeRound(new Uint8Array(await crypto.subtle.sign('HMAC', key, roundEncoder.encode(payload))))
}
async function createRoundToken(mode: string, questionIds: string[]) {
  const payload = JSON.stringify({ mode, question_ids: questionIds, expires_at: Date.now() + 15 * 60_000 })
  return `${encodeRound(payload)}.${await signRound(payload)}`
}
async function verifyRoundToken(token: unknown, mode: string) {
  if (typeof token !== 'string') return null
  try {
    const [encoded, signature] = token.split('.')
    if (!encoded || !signature) return null
    const payload = new TextDecoder().decode(decodeRound(encoded))
    const expectedSignature = await signRound(payload)
    if (signature.length !== expectedSignature.length || !sameText(signature, expectedSignature)) return null
    const parsed = JSON.parse(payload) as { mode?: string; question_ids?: unknown; expires_at?: number }
    if (parsed.mode !== mode || !Array.isArray(parsed.question_ids) || parsed.question_ids.length !== 10 || (parsed.expires_at ?? 0) < Date.now()) return null
    if (!parsed.question_ids.every((id) => typeof id === 'string')) return null
    return parsed.question_ids as string[]
  } catch {
    return null
  }
}
function sameText(left: string, right: string) {
  if (left.length !== right.length) return false
  let difference = 0
  for (let index = 0; index < left.length; index += 1) difference |= left.charCodeAt(index) ^ right.charCodeAt(index)
  return difference === 0
}

async function authenticate(body: Record<string, unknown>) {
  const id = String(body.profile_id ?? '')
  const token = String(body.token ?? '')
  if (!id || !token) return null
  const tokenHash = await sha256(token)
  const { data } = await db.from('crew_profiles').select('*').eq('id', id).eq('token_hash', tokenHash).maybeSingle()
  return data
}

async function publicProfile(profile: Record<string, unknown>) {
  const { data } = await db.from('user_achievements').select('achievement_code').eq('profile_id', profile.id)
  return { id: profile.id, username: profile.username, role: profile.role ?? 'crew', can_debug_roles: Boolean(profile.can_debug_roles), leaderboard_opt_in: profile.leaderboard_opt_in, xp: profile.xp, level: profile.level, best_official: profile.best_official, best_training: profile.best_training, total_attempts: profile.total_attempts, passed_finals: profile.passed_finals, perfect_runs: profile.perfect_runs, seen_official: profile.seen_official ?? [], ranked_points: profile.ranked_points, ranked_matches: profile.ranked_matches, achievements: (data ?? []).map((achievement) => achievement.achievement_code) }
}

async function awardAchievements(profile: Record<string, any>) {
  const codes: string[] = []
  if (profile.total_attempts >= 1) codes.push('first_quiz')
  if ((profile.seen_official?.length ?? 0) >= 17) codes.push('reader')
  if (profile.best_official >= 80) codes.push('strong_official')
  if (profile.perfect_runs >= 1) codes.push('perfect_quiz')
  if (profile.passed_finals >= 1) codes.push('final_pass')
  for (const achievement_code of codes) await db.from('user_achievements').upsert({ profile_id: profile.id, achievement_code }, { onConflict: 'profile_id,achievement_code', ignoreDuplicates: true })
}

function validateAnswers(mode: string, answers: unknown, expectedIds?: string[]) {
  const expectedCount = mode === 'training_plus' ? 12 : mode === 'final' ? 5 : 10
  const answerList = Array.isArray(answers) ? answers : []
  if (answerList.length !== expectedCount) return null
  const ids = answerList.map((item) => String(item?.id ?? ''))
  if (new Set(ids).size !== ids.length || (mode === 'final' && !FINAL_IDS.every((id) => ids.includes(id))) || (expectedIds && (expectedIds.length !== ids.length || !expectedIds.every((id) => ids.includes(id))))) return null
  const source = mode === 'training_plus' || mode === 'ranked' ? TRAINING : OFFICIAL
  let correct = 0
  for (const answer of answerList) {
    const id = String(answer?.id ?? '')
    if (!(id in source)) return null
    if (source[id] === String(answer?.answer ?? '')) correct += 1
  }
  return { correct, total: expectedCount, score: Math.round((correct / expectedCount) * 100) }
}

async function startRound(body: Record<string, unknown>, origin: string | null) {
  const current = await authenticate(body)
  if (!current) return json({ error: 'Session invalide.' }, origin, 401)
  const mode = String(body.mode ?? '')
  if (!['official', 'ranked'].includes(mode)) return json({ error: 'Mode invalide.' }, origin, 400)
  const source = mode === 'ranked' ? TRAINING : OFFICIAL
  const questionIds = Object.keys(source).sort(() => Math.random() - 0.5).slice(0, 10)
  return json({ round_token: await createRoundToken(mode, questionIds), question_ids: questionIds }, origin)
}

async function profile(body: Record<string, unknown>, origin: string | null) {
  const current = await authenticate(body)
  if (!current) return json({ error: 'Session invalide.' }, origin, 401)
  await awardAchievements(current)
  return json({ profile: await publicProfile(current) }, origin)
}

async function updateProfile(body: Record<string, unknown>, origin: string | null) {
  const current = await authenticate(body)
  if (!current) return json({ error: 'Session invalide.' }, origin, 401)
  const { data, error } = await db.from('crew_profiles').update({ leaderboard_opt_in: Boolean(body.leaderboard_opt_in), updated_at: new Date().toISOString() }).eq('id', current.id).select('*').single()
  if (error || !data) return json({ error: 'Mise à jour impossible.' }, origin, 500)
  return json({ profile: await publicProfile(data) }, origin)
}

async function markSeen(body: Record<string, unknown>, origin: string | null) {
  const current = await authenticate(body)
  if (!current) return json({ error: 'Session invalide.' }, origin, 401)
  const index = Number(body.index)
  if (!Number.isInteger(index) || index < 1 || index > 17) return json({ error: 'Fiche invalide.' }, origin, 400)
  const seen_official = Array.from(new Set([...(current.seen_official ?? []), index])).sort((a, b) => a - b)
  const { data } = await db.from('crew_profiles').update({ seen_official, updated_at: new Date().toISOString() }).eq('id', current.id).select('*').single()
  if (data) await awardAchievements(data)
  return json({ seen_official }, origin)
}

async function submitAttempt(body: Record<string, unknown>, origin: string | null) {
  const current = await authenticate(body)
  if (!current) return json({ error: 'Session invalide.' }, origin, 401)
  const mode = String(body.mode ?? '')
  if (!['official', 'training_plus', 'final', 'ranked'].includes(mode)) return json({ error: 'Mode invalide.' }, origin, 400)
  const expectedIds = ['official', 'ranked'].includes(mode) ? await verifyRoundToken(body.round_token, mode) : undefined
  if (['official', 'ranked'].includes(mode) && !expectedIds) return json({ error: 'Cette partie a expiré. Relance une nouvelle série.' }, origin, 409)
  const result = validateAnswers(mode, body.answers, expectedIds ?? undefined)
  if (!result) return json({ error: 'Tentative invalide.' }, origin, 400)
  const { data: transaction, error: transactionError } = await db.rpc('record_quiz_attempt', {
    p_profile_id: current.id,
    p_mode: mode,
    p_score: result.score,
    p_correct: result.correct,
    p_total: result.total,
  })
  if (transactionError || !transaction?.profile_id) return json({ error: 'Impossible d’enregistrer le résultat.' }, origin, 500)
  const { data, error } = await db.from('crew_profiles').select('*').eq('id', current.id).single()
  if (error || !data) return json({ error: 'Résultat enregistré, profil non récupéré.' }, origin, 500)
  await awardAchievements(data)
  return json({ ...result, passed: transaction.passed, xp_awarded: transaction.xp_awarded, xp_capped: transaction.xp_capped, ...(mode === 'ranked' ? { ranked_delta: transaction.ranked_delta, ranked_points: transaction.ranked_points } : {}), profile: await publicProfile(data) }, origin)
}

async function leaderboard(body: Record<string, unknown>, origin: string | null) {
  const current = await authenticate(body)
  if (!current) return json({ error: 'Session invalide.' }, origin, 401)
  const { data, error } = await db.from('crew_profiles').select('id,username,xp,level,total_attempts,passed_finals,ranked_points,ranked_matches').eq('leaderboard_opt_in', true).gt('ranked_matches', 0).order('ranked_points', { ascending: false }).order('xp', { ascending: false }).limit(50)
  if (error) return json({ error: 'Classement indisponible.' }, origin, 500)
  return json({ leaderboard: (data ?? []).map((row, index) => ({ ...row, rank: index + 1, is_me: row.id === current.id })) }, origin)
}

Deno.serve(async (request) => {
  const origin = request.headers.get('Origin')
  if (!allowedOrigin(origin)) return json({ error: 'Origine non autorisée.' }, origin, 403)
  if (request.method === 'OPTIONS') return new Response('ok', { headers: headers(origin) })
  if (request.method !== 'POST') return json({ error: 'Méthode non autorisée.' }, origin, 405)
  try {
    const body = await request.json() as Record<string, unknown>
    if (body.action === 'profile') return await profile(body, origin)
    if (body.action === 'start_round') return await startRound(body, origin)
    if (body.action === 'update_profile') return await updateProfile(body, origin)
    if (body.action === 'mark_seen') return await markSeen(body, origin)
    if (body.action === 'submit_attempt') return await submitAttempt(body, origin)
    if (body.action === 'leaderboard') return await leaderboard(body, origin)
    return json({ error: 'Action inconnue.' }, origin, 400)
  } catch (error) {
    console.error(error)
    return json({ error: 'Erreur serveur.' }, origin, 500)
  }
})
