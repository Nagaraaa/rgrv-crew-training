import { useEffect, useState } from "react";
import { Quiz } from "../learning/Quiz";
import { trainingQuestions } from "../learning/questions";
import { crewApi, type CrewProfile, type LeaderboardRow } from "../../lib/crewApi";
import { rankedRules, rankedTier } from "./ranked";

type RankedView = "play" | "leaderboard";

function Leaderboard({ leaderboard, message, onRefresh }: { leaderboard: LeaderboardRow[]; message: string; onRefresh: () => void }) {
  return <div className="leaderboard"><div className="leaderboard-head"><h2>Classement crew</h2><button type="button" onClick={onRefresh}>Actualiser</button></div>{message ? <p className="muted">{message}</p> : leaderboard.map((row) => <div className={row.is_me ? "rank-row mine" : "rank-row"} key={`${row.rank}-${row.username}`}><b>{String(row.rank).padStart(2, "0")}</b><span><strong>{row.username}</strong><small>{rankedTier(row.ranked_points)} · {row.ranked_matches} partie{row.ranked_matches > 1 ? "s" : ""}</small></span><em>{row.ranked_points}<small> pts</small></em></div>)}</div>;
}

export function RankedMode({ profile, onProfileUpdated, view = "play", onOpenLeaderboard }: { profile: CrewProfile; onProfileUpdated: (profile: CrewProfile) => void; view?: RankedView; onOpenLeaderboard?: () => void }) {
  const [playing, setPlaying] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardRow[]>([]);
  const [message, setMessage] = useState("");
  const points = profile.ranked_points ?? 0;
  const matches = profile.ranked_matches ?? 0;

  async function loadLeaderboard() {
    setMessage("");
    try {
      const response = await crewApi.leaderboard();
      setLeaderboard(response.leaderboard);
      if (!response.leaderboard.length) setMessage("Le premier score classé ouvrira le classement.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Classement indisponible."); }
  }

  useEffect(() => {
    if (view !== "leaderboard") return;
    const timer = window.setTimeout(() => { void loadLeaderboard(); }, 0);
    return () => window.clearTimeout(timer);
  }, [view]);

  function handleProfileUpdated(next: CrewProfile) {
    onProfileUpdated(next);
  }

  if (view === "leaderboard") return <section className="content-page ranked-page"><p className="eyebrow">Classement</p><h1>Le classement crew.</h1><p className="lead">Les meilleurs résultats classés de l’équipe, actualisés ici.</p><Leaderboard leaderboard={leaderboard} message={message} onRefresh={() => void loadLeaderboard()} /></section>;

  return <section className="content-page ranked-page">
    <p className="eyebrow">Mode classé</p><h1>Monte, reste stable ou recule.</h1><p className="lead">Une partie contient 10 situations. Ton score classé dépend uniquement de cette partie ; l’XP reste un bonus de progression.</p>
    <section className="rank-overview"><div><small>Ton palier</small><b>{rankedTier(points)}</b><p>{matches} partie{matches > 1 ? "s" : ""} classée{matches > 1 ? "s" : ""}</p></div><strong>{points}<small> points</small></strong></section>
    {playing ? <Quiz title="Mode classé" questions={trainingQuestions} questionCount={10} mode="ranked" onProfileUpdated={handleProfileUpdated} onOpenLeaderboard={onOpenLeaderboard} /> : <section className="ranked-intro"><p className="eyebrow">Règles de la partie</p><h2>Chaque réponse compte.</h2><div className="ranked-rules">{rankedRules.map((rule) => <span key={rule}>{rule}</span>)}</div><p>Une partie à 5/10 donne +10 points pour les bonnes réponses et −10 pour les erreurs : le classement ne bouge pas. En dessous, tu redescends ; au-dessus, tu montes.</p><button className="primary" type="button" onClick={() => setPlaying(true)}>Lancer une partie classée <span>→</span></button></section>}
  </section>;
}
