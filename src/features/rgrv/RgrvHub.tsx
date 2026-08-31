type RgrvDestination = "fiches" | "official" | "final" | "training" | "ranked" | "leaderboard";

const modules: { screen: RgrvDestination; eyebrow: string; title: string; detail: string; action: string }[] = [
  { screen: "fiches", eyebrow: "Commencer ici", title: "Fiches", detail: "Les 17 repères à connaître pour le RGRV.", action: "Consulter les fiches →" },
  { screen: "official", eyebrow: "S’entraîner", title: "Quiz officiel", detail: "Une série de questions pour faire le point.", action: "Lancer le quiz →" },
  { screen: "final", eyebrow: "Se préparer", title: "Test final", detail: "Les questions essentielles dans un format court.", action: "Passer le test →" },
  { screen: "training", eyebrow: "Varier", title: "Entraînement+", detail: "Des séries renouvelées pour renforcer les réflexes.", action: "S’entraîner →" },
  { screen: "ranked", eyebrow: "Optionnel", title: "Classé", detail: "Un mode de progression personnel et volontaire.", action: "Jouer en classé →" },
  { screen: "leaderboard", eyebrow: "Classement", title: "Classement", detail: "Voir les paliers et les meilleurs résultats de l’équipe.", action: "Voir le classement →" },
];

export function RgrvHub({ onNavigate }: { onNavigate: (screen: RgrvDestination) => void }) {
  return (
    <section className="rgrv-hub">
      <header className="rgrv-hub-intro">
        <p className="eyebrow">Module annuel</p>
        <h1>RGRV.</h1>
        <p className="lead">Fiches, quiz, entraînements et test final : retrouve ici tout le parcours pour préparer ton RGRV.</p>
      </header>
      <div className="rgrv-module-grid">
        {modules.map((module, index) => (
          <button className={index === 0 ? "is-featured" : ""} type="button" key={module.screen} onClick={() => onNavigate(module.screen)}>
            <span>{module.eyebrow}</span>
            <strong>{module.title}</strong>
            <small>{module.detail}</small>
            <b>{module.action}</b>
          </button>
        ))}
      </div>
    </section>
  );
}
