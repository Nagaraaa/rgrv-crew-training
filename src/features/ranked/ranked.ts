export function rankedTier(points: number) {
  if (points >= 400) return '🏆 Challenger'
  if (points >= 220) return '💎 Diamant'
  if (points >= 100) return '🥇 Gold'
  if (points >= 40) return '🥈 Silver'
  return '🥉 Bronze'
}

export const rankedRules = [
  '+2 points par bonne réponse',
  '−2 points par erreur',
  '5 / 10 : classement stable',
  'Paliers : 0 · 40 · 100 · 220 · 400 pts',
]
