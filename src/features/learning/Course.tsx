import { useState } from 'react'
import { crewApi, type CrewProfile } from '../../lib/crewApi'
import { finalOfficialIds, officialQuestions } from './questions'
import { Quiz } from './Quiz'

type Tab = 'fiches' | 'official' | 'final'

export function Course({ profile, onProfileUpdated }: { profile: CrewProfile; onProfileUpdated: (profile: CrewProfile) => void }) {
  const [tab, setTab] = useState<Tab>('fiches')
  const [quizActive, setQuizActive] = useState(false)
  const seen = new Set(profile.seen_official ?? [])

  function selectTab(next: Tab) { setTab(next); setQuizActive(false) }
  async function markSeen(index: number) {
    if (seen.has(index)) return
    try { const result = await crewApi.markSeen(index); onProfileUpdated({ ...profile, seen_official: result.seen_official }) } catch { /* Saving a viewed fiche is non-blocking. */ }
  }

  const config = tab === 'official'
    ? { title: 'Quiz officiel', questions: officialQuestions, questionCount: 10, mode: 'official' as const }
    : { title: 'Test final', questions: finalOfficialIds.map((index) => officialQuestions[index]), questionCount: 5, mode: 'final' as const }

  return <section className="course-page">
    <div className="page-intro"><p className="eyebrow">Parcours RGRV</p><h1>Apprendre, vérifier, recommencer.</h1><p className="lead">Les fiches et les évaluations officielles sont rassemblées ici. Entraînement+ est un mode à part entière.</p></div>
    <div className="course-tabs" role="tablist"><button className={tab === 'fiches' ? 'active' : ''} onClick={() => selectTab('fiches')}>Fiches <small>{seen.size}/17</small></button><button className={tab === 'official' ? 'active' : ''} onClick={() => selectTab('official')}>Quiz officiel</button><button className={tab === 'final' ? 'active' : ''} onClick={() => selectTab('final')}>Test final</button></div>
    {tab === 'fiches' ? <div className="fiches-section"><div className="fiches-heading"><div><p className="eyebrow">Fiches officielles</p><h2>Ouvre une situation, découvre le bon réflexe.</h2></div><span>{seen.size} / 17 lues</span></div><div className="fiche-list">{officialQuestions.map((question, index) => <details className="fiche-card" key={question.id} onToggle={(event) => { if (event.currentTarget.open) void markSeen(index + 1) }}><summary><span><b>{String(index + 1).padStart(2, '0')}</b>{question.question}</span><i><span className="fiche-closed">Voir la réponse</span><span className="fiche-open">Réponse ouverte</span><em>↘</em></i></summary><div className="fiche-answer"><p className="eyebrow">Réponse attendue</p><p>{question.correct}</p>{question.image && <figure className="location-sign"><img src={question.image} alt="Panneau vert indiquant le point de rassemblement, avec quatre flèches orientées vers un groupe de personnes." /><figcaption>Repère visuel du point de rassemblement.</figcaption></figure>}</div></details>)}</div></div> : quizActive ? <Quiz {...config} onProfileUpdated={onProfileUpdated} /> : <section className="quiz-intro"><p className="eyebrow">{config.title}</p><h2>{tab === 'official' ? '10 questions fidèles au questionnaire.' : '5 situations à connaître froid.'}</h2><p>{tab === 'final' ? 'Un test court centré sur les réflexes essentiels : 80 % ou plus pour le réussir.' : 'L’ordre des questions et des réponses change à chaque tentative.'}</p><button className="primary" onClick={() => setQuizActive(true)}>Lancer <span>→</span></button></section>}
  </section>
}
