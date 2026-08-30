export function rankedTier(points: number) {
  if (points >= 1000) return '🏆 Challenger'
  if (points >= 650) return '💎 Diamant'
  if (points >= 350) return '🥇 Gold'
  if (points >= 150) return '🥈 Silver'
  return '🥉 Bronze'
}

export const rankedRules = [
  '+2 points par bonne réponse',
  '−2 points par erreur',
  '5 / 10 : classement stable',
]
