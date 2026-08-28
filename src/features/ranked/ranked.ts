export function rankedTier(points: number) {
  if (points >= 500) return 'Champion crew'
  if (points >= 300) return 'Référent'
  if (points >= 150) return 'Équipier confirmé'
  return 'Équipier'
}

export const rankedRules = [
  '+2 points par bonne réponse',
  '−2 points par erreur',
  '5 / 10 : classement stable',
]
