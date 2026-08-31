import type { CrewRole } from '../features/operations/roles'

export type CrewProfile = {
  id: string
  username: string
  role: CrewRole
  can_debug_roles: boolean
  xp: number
  level: number
  total_attempts: number
  best_official: number
  best_training: number
  passed_finals: number
  perfect_runs: number
  seen_official: number[]
  leaderboard_opt_in: boolean
  ranked_points: number
  ranked_matches: number
  achievements: string[]
}

type ProgressProfile = Pick<CrewProfile, 'xp' | 'level' | 'total_attempts' | 'best_official' | 'best_training' | 'passed_finals' | 'perfect_runs'>

export type Session = { profileId: string; token: string }

const apiUrl = import.meta.env.VITE_CREW_API_URL as string | undefined
const operationsUrl = apiUrl?.replace(/\/crew-api$/, '/crew-operations')

function session(): Session | null {
  for (const storage of [sessionStorage, localStorage]) {
    const profileId = storage.getItem('rgrv-profile-id')
    const token = storage.getItem('rgrv-token')
    if (profileId && token) return { profileId, token }
  }
  return null
}

async function call<T>(action: string, payload: Record<string, unknown> = {}): Promise<T> {
  if (!apiUrl) throw new Error('Le service de progression n’est pas configuré.')
  const current = session()
  if (!current) throw new Error('Reconnecte-toi pour enregistrer ta progression.')
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, profile_id: current.profileId, token: current.token, ...payload }),
  })
  const data = await response.json().catch(() => ({})) as T & { error?: string }
  if (!response.ok) throw new Error(data.error ?? 'Le service est indisponible.')
  return data
}

async function callOperations<T>(action: string, payload: Record<string, unknown> = {}): Promise<T> {
  if (!operationsUrl) throw new Error('Le service des tâches n’est pas configuré.')
  const current = session()
  if (!current) throw new Error('Reconnecte-toi pour accéder aux tâches.')
  const response = await fetch(operationsUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action, profile_id: current.profileId, token: current.token, ...payload }) })
  const data = await response.json().catch(() => ({})) as T & { error?: string }
  if (!response.ok) throw new Error(data.error ?? 'Le service des tâches est indisponible.')
  return data
}

export const crewApi = {
  profile: () => call<{ profile: CrewProfile }>('profile'),
  markSeen: (index: number) => call<{ seen_official: number[] }>('mark_seen', { index }),
  submitAttempt: (mode: 'official' | 'training_plus' | 'final' | 'ranked', answers: { id: string; answer: string }[]) =>
    call<{ score: number; xp_awarded: number; xp_capped: boolean; ranked_delta?: number; ranked_points?: number; profile: ProgressProfile }>('submit_attempt', { mode, answers }),
  leaderboard: () => call<{ leaderboard: LeaderboardRow[] }>('leaderboard'),
  updateProfile: (leaderboardOptIn: boolean) => call<{ profile: CrewProfile }>('update_profile', { leaderboard_opt_in: leaderboardOptIn }),
  operations: () => callOperations<OperationsFeed>('operations'),
  createTask: (title: string, categoryId: string) => callOperations<OperationsFeed>('create_task', { title, category_id: categoryId }),
  createCategory: (name: string) => callOperations<OperationsFeed>('create_category', { name }),
  transitionTask: (taskId: string, transition: 'approve' | 'reject' | 'take' | 'complete', completionNote?: string) => callOperations<OperationsFeed>('transition_task', { task_id: taskId, transition, completion_note: completionNote }),
  team: () => callOperations<TeamFeed>('team'),
  updateRole: (memberId: string, role: Exclude<CrewRole, 'store_manager'>) => callOperations<TeamFeed>('update_role', { member_id: memberId, role }),
}

export type OperationsFeed = { categories: { id: string; name: string }[]; can_review_proposals: boolean; tasks: { id: string; title: string; category_id: string; createdBy: string; created_at: string; status: 'pending' | 'todo' | 'doing' | 'done' | 'rejected'; takenBy: string | null; completedBy: string | null; completed_at: string | null; completion_note: string | null }[] }
export type TeamFeed = { members: { id: string; username: string; role: CrewRole }[]; can_manage_team: boolean; can_edit_every_role: boolean; role_history: { id: number; actorName: string; memberName: string; nextRole: CrewRole; createdAt: string }[] }

export type LeaderboardRow = {
  rank: number
  username: string
  xp: number
  level: number
  total_attempts: number
  passed_finals: number
  ranked_points: number
  ranked_matches: number
  is_me: boolean
}
