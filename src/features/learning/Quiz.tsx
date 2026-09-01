import { useCallback, useEffect, useMemo, useState } from 'react'
import { crewApi, type CrewProfile } from '../../lib/crewApi'
import type { Question } from './questions'

type QuizMode = 'official' | 'training_plus' | 'final' | 'ranked'

type Props = {
  title: string
  questions: Question[]
  questionCount: number
  mode: QuizMode
  onProfileUpdated: (profile: CrewProfile) => void
  onOpenLeaderboard?: () => void
}

function shuffle<T>(items: T[]) {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export function Quiz({ title, questions, questionCount, mode, onProfileUpdated, onOpenLeaderboard }: Props) {
  const requiresServerRound = mode === 'official' || mode === 'ranked'
  const [roundQuestions, setRoundQuestions] = useState<Question[]>(() => requiresServerRound ? [] : shuffle(questions).slice(0, questionCount))
  const [roundToken, setRoundToken] = useState<string | null>(null)
  const [roundLoading, setRoundLoading] = useState(requiresServerRound)
  const [roundError, setRoundError] = useState('')
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<{ score: number; xp: number; capped: boolean; rankedDelta?: number; rankedPoints?: number } | null>(null)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const current = roundQuestions[index]
  const options = useMemo(() => current ? shuffle([current.correct, ...current.wrong]) : [], [current])

  const loadRound = useCallback(async () => {
    if (!requiresServerRound) {
      setRoundQuestions(shuffle(questions).slice(0, questionCount))
      setRoundToken(null)
      setRoundLoading(false)
      return
    }
    setRoundLoading(true)
    setRoundError('')
    try {
      const response = await crewApi.startRound(mode)
      const questionById = new Map(questions.map((question) => [question.id, question]))
      const selectedQuestions = response.question_ids.map((id) => questionById.get(id))
      if (selectedQuestions.length !== questionCount || selectedQuestions.some((question) => !question)) throw new Error('La série de questions est indisponible.')
      setRoundQuestions(selectedQuestions as Question[])
      setRoundToken(response.round_token)
      setIndex(0)
      setSelected(null)
      setAnswers({})
    } catch (error) {
      setRoundError(error instanceof Error ? error.message : 'Impossible de préparer la partie.')
    } finally {
      setRoundLoading(false)
    }
  }, [mode, questions, questionCount, requiresServerRound])

  useEffect(() => {
    if (!requiresServerRound) return
    const timer = window.setTimeout(() => { void loadRound() }, 0)
    return () => window.clearTimeout(timer)
  }, [loadRound, requiresServerRound])

  async function finish() {
    setSubmitting(true)
    try {
      const response = await crewApi.submitAttempt(mode, roundQuestions.map((question) => ({ id: question.id, answer: answers[question.id] })), roundToken ?? undefined)
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
    setResult(null)
    void loadRound()
  }

  if (result) return <section className="result-panel"><p className="eyebrow">{title}</p><div className="score-number">{result.score}%</div><h2>{result.rankedDelta === undefined ? result.score >= 80 ? 'Très solide.' : result.score >= 60 ? 'Bonne base.' : 'Encore un tour.' : result.rankedDelta > 0 ? 'Tu montes.' : result.rankedDelta < 0 ? 'Tu redescends.' : 'Tu restes stable.'}</h2>{result.rankedDelta !== undefined && <p className={result.rankedDelta > 0 ? 'ranked-result up' : result.rankedDelta < 0 ? 'ranked-result down' : 'ranked-result'}><b>{result.rankedDelta > 0 ? `+${result.rankedDelta}` : result.rankedDelta} points classés</b><span>{result.rankedPoints} points au total</span></p>}<p>{result.capped ? 'La limite quotidienne d’XP est atteinte.' : result.xp ? `+${result.xp} XP ajoutés à ton profil.` : 'Aucune XP ajoutée pour cette partie.'}</p><div className="result-actions"><button className="primary" onClick={restart}>Rejouer <span>→</span></button>{result.rankedDelta !== undefined && onOpenLeaderboard && <button className="text-action" type="button" onClick={onOpenLeaderboard}>Voir le classement →</button>}</div></section>

  if (roundLoading || !current) return <section className="quiz-panel"><p className="eyebrow">{title}</p><h2>{roundError || 'Préparation de la partie…'}</h2>{roundError && <button className="primary" type="button" onClick={() => void loadRound()}>Réessayer <span>→</span></button>}</section>

  return <section className="quiz-panel">
    <div className="quiz-meta"><span>{title}</span><span>{index + 1} / {roundQuestions.length}</span></div>
    <h2>{current.question}</h2>
    {current.image && <figure className="quiz-location-sign"><img src={current.image} alt="Panneau vert indiquant le point de rassemblement, avec quatre flèches orientées vers un groupe de personnes." /><figcaption>Le point de rassemblement est situé près de ce panneau vert, à côté des bornes de recharge.</figcaption></figure>}
    <div className="options">{options.map((option) => <button className={option === selected ? 'option selected' : 'option'} onClick={() => choose(option)} aria-pressed={option === selected} key={option}>{option === current.correct ? current.correctDisplay ?? option : option}</button>)}</div>
    <button className="primary" disabled={!selected || submitting} onClick={advance}>{submitting ? 'Enregistrement…' : index === roundQuestions.length - 1 ? 'Voir mon résultat' : 'Question suivante'} <span>→</span></button>
  </section>
}
