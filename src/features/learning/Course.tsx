import { useState } from 'react'
import { crewApi, type CrewProfile } from '../../lib/crewApi'
import { finalOfficialIds, officialQuestions } from './questions'
import { Quiz } from './Quiz'

type CourseSection = 'fiches' | 'official' | 'final'

type Props = {
  profile: CrewProfile
  section: CourseSection
  onNavigate: (section: CourseSection) => void
  onProfileUpdated: (profile: CrewProfile) => void
}

export function Course({ profile, section, onNavigate, onProfileUpdated }: Props) {
  const [quizActive, setQuizActive] = useState(false)
  const seen = new Set(profile.seen_official ?? [])

  async function markSeen(index: number) {
    if (seen.has(index)) return
    try {
      const result = await crewApi.markSeen(index)
      onProfileUpdated({ ...profile, seen_official: result.seen_official })
    } catch {
      /* Saving a viewed fiche is non-blocking. */
    }
  }

  const config = section === 'official'
    ? { title: 'Quiz officiel', questions: officialQuestions, questionCount: 10, mode: 'official' as const }
    : { title: 'Test final', questions: finalOfficialIds.map((index) => officialQuestions[index]), questionCount: 5, mode: 'final' as const }

  if (section === 'fiches') {
    return <section className="course-page fiches-page">
      <header className="fiche-toolbar">
        <div><p className="eyebrow">Fiches officielles</p><h1>17 fiches</h1></div>
        <span>{seen.size} / 17 lues</span>
      </header>
      <div className="fiche-list">
        {officialQuestions.map((question, index) => <details className="fiche-card" key={question.id} onToggle={(event) => { if (event.currentTarget.open) void markSeen(index + 1) }}>
          <summary>
            <span><b>{String(index + 1).padStart(2, '0')}</b>{question.question}</span>
            <i><span className="fiche-closed">Réponse</span><span className="fiche-open">Ouverte</span><em>↘</em></i>
          </summary>
          <div className="fiche-answer">
            <p>{question.correct}</p>
            {question.image && <figure className="location-sign"><img src={question.image} alt="Panneau vert indiquant le point de rassemblement, avec quatre flèches orientées vers un groupe de personnes." /><figcaption>Point de rassemblement.</figcaption></figure>}
          </div>
        </details>)}
      </div>
    </section>
  }

  if (quizActive) return <section className="course-page"><Quiz {...config} onProfileUpdated={onProfileUpdated} /></section>

  return <section className="course-page">
    <div className="page-intro"><p className="eyebrow">{config.title}</p><h1>{section === 'official' ? 'Vérifie tes repères.' : 'Le dernier passage.'}</h1><p className="lead">{section === 'official' ? 'Une session indépendante de 10 questions, avec un ordre renouvelé à chaque passage.' : 'Un test court centré sur les réflexes essentiels : 80 % ou plus pour le réussir.'}</p></div>
    <section className="quiz-intro"><p className="eyebrow">{config.title}</p><h2>{section === 'official' ? '10 questions fidèles au questionnaire.' : '5 situations à connaître froid.'}</h2><p>{section === 'official' ? 'L’ordre des questions et des réponses change à chaque tentative.' : 'Tu peux recommencer à tout moment pour consolider tes acquis.'}</p><button className="primary" onClick={() => setQuizActive(true)}>Lancer <span>→</span></button>{section === 'official' ? <button className="text-action quiz-switch" onClick={() => onNavigate('final')}>Le test final est une section à part →</button> : <button className="text-action quiz-switch" onClick={() => onNavigate('official')}>Revenir au quiz officiel →</button>}</section>
  </section>
}
