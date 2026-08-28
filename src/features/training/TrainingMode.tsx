import { useState } from 'react'
import { Quiz } from '../learning/Quiz'
import { trainingQuestions } from '../learning/questions'
import type { CrewProfile } from '../../lib/crewApi'

export function TrainingMode({ onProfileUpdated, onOpenFiches }: { onProfileUpdated: (profile: CrewProfile) => void; onOpenFiches: () => void }) {
  const [playing, setPlaying] = useState(false)

  return <section className="content-page training-page">
    <p className="eyebrow">Entraînement+</p><h1>Travaille tes réflexes, sans pression.</h1><p className="lead">Ce mode est différent du parcours officiel : il pioche 12 situations parmi 36, mélange les réponses et te laisse recommencer autant de fois que tu veux.</p>
    {playing ? <Quiz title="Entraînement+" questions={trainingQuestions} questionCount={12} mode="training_plus" onProfileUpdated={onProfileUpdated} /> : <section className="training-intro"><div><p className="eyebrow">Mode révision</p><h2>12 situations. Un nouveau mélange à chaque partie.</h2><p>Tu gagnes de l’XP pour ton profil, mais aucun point classé n’est en jeu ici.</p></div><div className="training-facts"><span><b>36</b> questions</span><span><b>12</b> par partie</span><span><b>+ XP</b> à gagner</span></div><button className="primary" onClick={() => setPlaying(true)}>Lancer Entraînement+ <span>→</span></button></section>}
    <section className="fiches-callout"><div><p className="eyebrow">Besoin de revoir une procédure ?</p><h2>Les fiches officielles sont dans ton parcours.</h2><p>Consulte-les tranquillement, puis reviens ici pour mettre tes réflexes à l’épreuve.</p></div><button className="text-action" onClick={onOpenFiches}>Ouvrir les fiches →</button></section>
  </section>
}
