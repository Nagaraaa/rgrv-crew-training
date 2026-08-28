export type CrewProfile = {
  id: string
  username: string
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

function session(): Session | null {
  const profileId = sessionStorage.getItem('rgrv-profile-id')
  const token = sessionStorage.getItem('rgrv-token')
  return profileId && token ? { profileId, token } : null
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

export const crewApi = {
  profile: () => call<{ profile: CrewProfile }>('profile'),
  markSeen: (index: number) => call<{ seen_official: number[] }>('mark_seen', { index }),
  submitAttempt: (mode: 'official' | 'training_plus' | 'final' | 'ranked', answers: { id: string; answer: string }[]) =>
    call<{ score: number; xp_awarded: number; xp_capped: boolean; ranked_delta?: number; ranked_points?: number; profile: ProgressProfile }>('submit_attempt', { mode, answers }),
  leaderboard: () => call<{ leaderboard: LeaderboardRow[] }>('leaderboard'),
  updateProfile: (leaderboardOptIn: boolean) => call<{ profile: CrewProfile }>('update_profile', { leaderboard_opt_in: leaderboardOptIn }),
}

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
