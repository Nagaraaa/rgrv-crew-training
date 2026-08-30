type RgrvDestination = "fiches" | "official" | "final" | "training" | "ranked" | "leaderboard";

const modules: { screen: RgrvDestination; eyebrow: string; title: string; detail: string }[] = [
  { screen: "fiches", eyebrow: "Réviser", title: "Fiches", detail: "Les repères à consulter quand tu en as besoin." },
  { screen: "official", eyebrow: "S’entraîner", title: "Quiz officiel", detail: "Une série de questions pour faire le point." },
  { screen: "final", eyebrow: "Se préparer", title: "Test final", detail: "Les questions essentielles dans un format court." },
  { screen: "training", eyebrow: "Varier", title: "Entraînement+", detail: "Des séries renouvelées pour renforcer les réflexes." },
  { screen: "ranked", eyebrow: "Optionnel", title: "Classé", detail: "Un mode de progression personnel et volontaire." },
  { screen: "leaderboard", eyebrow: "Classement", title: "Classement", detail: "Voir les paliers et les meilleurs résultats de l’équipe." },
];

export function RgrvHub({ onNavigate }: { onNavigate: (screen: RgrvDestination) => void }) {
  return (
    <section className="rgrv-hub">
      <header className="rgrv-hub-intro">
        <p className="eyebrow">Module annuel</p>
        <h1>RGRV.</h1>
        <p className="lead">Ce module reste disponible, mais l’espace équipe vit toute l’année autour des tâches et de l’organisation.</p>
      </header>
      <div className="rgrv-module-grid">
        {modules.map((module) => (
          <button type="button" key={module.screen} onClick={() => onNavigate(module.screen)}>
            <span>{module.eyebrow}</span>
            <strong>{module.title}</strong>
            <small>{module.detail}</small>
            <b>Ouvrir →</b>
          </button>
        ))}
      </div>
    </section>
  );
}
