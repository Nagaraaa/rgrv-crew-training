import type { CrewProfile } from "../../lib/crewApi";

export function RgrvObjectives({ profile }: { profile: CrewProfile }) {
  const seenFiches = profile.seen_official.length;
  const objectives = [
    { title: "Découvrir les fiches", detail: `${Math.min(seenFiches, 5)} / 5 fiches`, complete: seenFiches >= 5 },
    { title: "Boucler les fiches", detail: `${seenFiches} / 17 fiches`, complete: seenFiches >= 17 },
    { title: "Faire le Quiz officiel", detail: profile.best_official > 0 ? `Meilleur résultat : ${profile.best_official}%` : "À lancer", complete: profile.best_official > 0 },
    { title: "Valider le Test final", detail: profile.passed_finals > 0 ? "Test validé" : "80 % requis", complete: profile.passed_finals > 0 },
    { title: "Faire Entraînement+", detail: profile.best_training > 0 ? "Une série terminée" : "À lancer", complete: profile.best_training > 0 },
  ];
  const completedObjectives = objectives.filter((objective) => objective.complete).length;

  return <section className="rgrv-objectives" aria-label="Objectifs RGRV">
    <header><div><p className="eyebrow">Objectif RGRV</p><h2>Ton parcours.</h2></div><strong>{completedObjectives} / {objectives.length}</strong></header>
    <ul>{objectives.map((objective) => <li key={objective.title} className={objective.complete ? "complete" : ""}><b aria-hidden="true">{objective.complete ? "✓" : "○"}</b><span><strong>{objective.title}</strong><small>{objective.detail}</small></span></li>)}</ul>
    <p className="rgrv-optional">☆ Le mode classé reste facultatif : un bonus pour te challenger, pas un objectif à remplir.</p>
  </section>;
}
