import { readFile } from 'node:fs/promises'

const base = 'https://dybzyfdlryzlidmjkrgd.supabase.co/functions/v1'
const suffix = Array.from({ length: 8 }, () => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('')

async function adminSecret() {
  if (process.env.SUPABASE_SECRET_KEY) return process.env.SUPABASE_SECRET_KEY
  try {
    const raw = await readFile(new URL('../.env.admin.local', import.meta.url), 'utf8')
    return raw.match(/^SUPABASE_SECRET_KEY=(.*)$/m)?.[1]?.trim().replace(/^['"]|['"]$/g, '')
  } catch {
    return undefined
  }
}

async function request(url, body) {
  const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'http://localhost:5173' }, body: JSON.stringify(body) })
  const data = await response.json()
  if (!response.ok) throw new Error(data.error ?? `HTTP ${response.status}`)
  return data
}

async function cleanup(profileId) {
  const secret = await adminSecret()
  if (!secret) return false
  const response = await fetch(`${base.replace('/functions/v1', '')}/rest/v1/crew_profiles?id=eq.${encodeURIComponent(profileId)}`, {
    method: 'DELETE',
    headers: { apikey: secret, Authorization: `Bearer ${secret}` },
  })
  return response.ok
}

let profileId
try {
  const identity = await request(`${base}/crew-identity`, { action: 'register', first_name: 'Verification', last_name: `Rgrv${suffix}`, pin: '314159' })
  profileId = identity.profile.id
  const credentials = { profile_id: identity.profile.id, token: identity.token }
  const profile = await request(`${base}/crew-api`, { action: 'profile', ...credentials })
  const seen = await request(`${base}/crew-api`, { action: 'mark_seen', index: 1, ...credentials })
  const answerSource = await readFile(new URL('../supabase/functions/crew-api/answers.ts', import.meta.url), 'utf8')
  const official = JSON.parse(answerSource.match(/export const OFFICIAL = (\{.*?\}) as/)[1])
  const training = JSON.parse(answerSource.match(/export const TRAINING = (\{.*?\}) as/)[1])
  const attempt = await request(`${base}/crew-api`, { action: 'submit_attempt', mode: 'official', answers: Object.entries(official).slice(0, 10).map(([id, answer]) => ({ id, answer })), ...credentials })
  const ranked = await request(`${base}/crew-api`, { action: 'submit_attempt', mode: 'ranked', answers: Object.entries(training).slice(0, 10).map(([id, answer], index) => ({ id, answer: index < 5 ? answer : '' })), ...credentials })

  console.log(JSON.stringify({ identity: Boolean(identity.profile?.id && identity.token), profile: profile.profile?.id === identity.profile.id, seen: seen.seen_official?.includes(1), score: attempt.score, rankedScore: ranked.score, rankedDelta: ranked.ranked_delta, rankedPoints: ranked.ranked_points, attemptRecorded: typeof attempt.score === 'number' }))
} finally {
  if (profileId && !(await cleanup(profileId))) console.error(`Nettoyage impossible pour le profil de vérification ${profileId}. Supprime-le manuellement.`)
}
