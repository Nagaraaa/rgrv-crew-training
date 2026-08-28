import { useMemo, useState } from 'react'
import { crewApi, type CrewProfile } from '../../lib/crewApi'
import type { Question } from './questions'

type QuizMode = 'official' | 'training_plus' | 'final' | 'ranked'

type Props = {
  title: string
  questions: Question[]
  questionCount: number
  mode: QuizMode
  onProfileUpdated: (profile: CrewProfile) => void
}

function shuffle<T>(items: T[]) {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export function Quiz({ title, questions, questionCount, mode, onProfileUpdated }: Props) {
  const [roundQuestions, setRoundQuestions] = useState(() => shuffle(questions).slice(0, questionCount))
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<{ score: number; xp: number; capped: boolean; rankedDelta?: number; rankedPoints?: number } | null>(null)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const current = roundQuestions[index]
  const options = useMemo(() => shuffle([current.correct, ...current.wrong]), [current])

  async function finish() {
    setSubmitting(true)
    try {
      const response = await crewApi.submitAttempt(mode, roundQuestions.map((question) => ({ id: question.id, answer: answers[question.id] })))
      const fresh = await crewApi.profile()
      onProfileUpdated(fresh.profile)
      setResult({ score: response.score, xp: response.xp_awarded, capped: response.xp_capped, rankedDelta: response.ranked_delta, rankedPoints: response.ranked_points })
    } catch (error) {
      window.alert(error instanceof Error ? error.message : 'Résultat impossible à enregistrer.')
    } finally {
      setSubmitting(false)
    }
  }

  function choose(option: string) {
    setSelected(option)
    setAnswers((currentAnswers) => ({ ...currentAnswers, [current.id]: option }))
  }

  function advance() {
    if (!selected) return
    if (index < roundQuestions.length - 1) { setIndex((value) => value + 1); setSelected(null) } else { void finish() }
  }

  function restart() {
    setRoundQuestions(shuffle(questions).slice(0, questionCount))
    setIndex(0); setSelected(null); setAnswers({}); setResult(null)
  }

  if (result) return <section className="result-panel"><p className="eyebrow">{title}</p><div className="score-number">{result.score}%</div><h2>{result.rankedDelta === undefined ? result.score >= 80 ? 'Très solide.' : result.score >= 60 ? 'Bonne base.' : 'Encore un tour.' : result.rankedDelta > 0 ? 'Tu montes.' : result.rankedDelta < 0 ? 'Tu redescends.' : 'Tu restes stable.'}</h2>{result.rankedDelta !== undefined && <p className={result.rankedDelta > 0 ? 'ranked-result up' : result.rankedDelta < 0 ? 'ranked-result down' : 'ranked-result'}><b>{result.rankedDelta > 0 ? `+${result.rankedDelta}` : result.rankedDelta} points classés</b><span>{result.rankedPoints} points au total</span></p>}<p>{result.xp ? `+${result.xp} XP ajoutés à ton profil.` : 'La limite quotidienne d’XP est atteinte.'}{result.capped ? ' La limite quotidienne d’XP est atteinte.' : ''}</p><button className="primary" onClick={restart}>Rejouer <span>→</span></button></section>

  return <section className="quiz-panel">
    <div className="quiz-meta"><span>{title}</span><span>{index + 1} / {roundQuestions.length}</span></div>
    <h2>{current.question}</h2>
    {current.image && <figure className="quiz-location-sign"><img src={current.image} alt="Panneau vert indiquant le point de rassemblement, avec quatre flèches orientées vers un groupe de personnes." /><figcaption>Le point de rassemblement est situé près de ce panneau vert, à côté des bornes de recharge.</figcaption></figure>}
    <div className="options">{options.map((option) => <button className={option === selected ? 'option selected' : 'option'} onClick={() => choose(option)} aria-pressed={option === selected} key={option}>{option === current.correct ? current.correctDisplay ?? option : option}</button>)}</div>
    <button className="primary" disabled={!selected || submitting} onClick={advance}>{submitting ? 'Enregistrement…' : index === roundQuestions.length - 1 ? 'Voir mon résultat' : 'Question suivante'} <span>→</span></button>
  </section>
}
