export type LegalPage = "privacy" | "legal" | "contact";

type LegalInfoProps = {
  page: LegalPage;
  onBack: () => void;
};

const contactEmail = "steveherremans@gmail.com";

export function LegalInfo({ page, onBack }: LegalInfoProps) {
  if (page === "contact") {
    return (
      <section className="content-page legal-page">
        <p className="eyebrow">Crew Hub Waterloo</p>
        <h1>Contact.</h1>
        <p className="lead">Une question sur l’accès, le RGRV ou tes données ?</p>
        <section className="legal-panel">
          <h2>Écrire à Steve</h2>
          <p>
            Utilise cette adresse pour une question, un problème de connexion ou
            une demande liée à tes informations personnelles.
          </p>
          <address>
            <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
          </address>
        </section>
        <button className="text-action legal-back" type="button" onClick={onBack}>
          ← Retour
        </button>
      </section>
    );
  }

  if (page === "legal") {
    return (
      <section className="content-page legal-page">
        <p className="eyebrow">Informations</p>
        <h1>Mentions légales.</h1>
        <div className="legal-stack">
          <section className="legal-panel">
            <h2>Édition</h2>
            <p>
              Crew Hub Waterloo est une initiative locale en phase bêta, conçue
              et administrée par Steve Herremans.
            </p>
            <address>
              Contact : <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
            </address>
          </section>
          <section className="legal-panel">
            <h2>Hébergement</h2>
            <p>
              L’interface est hébergée par Vercel. Les données de compte et de
              progression sont hébergées dans Supabase.
            </p>
          </section>
          <section className="legal-panel">
            <h2>Marques et contenu</h2>
            <p>
              Les marques et logos cités dans l’application appartiennent à leurs
              titulaires respectifs. Crew Hub Waterloo n’est pas présenté comme un
              service officiel de McDonald’s.
            </p>
          </section>
          <section className="legal-panel legal-panel--note">
            <h2>Avant une diffusion générale</h2>
            <p>
              Si le restaurant ou la franchise adopte officiellement l’outil, ces
              informations devront être complétées avec son identité, le
              responsable des données et le cadre d’utilisation validé.
            </p>
          </section>
        </div>
        <button className="text-action legal-back" type="button" onClick={onBack}>
          ← Retour
        </button>
      </section>
    );
  }

  return (
    <section className="content-page legal-page">
      <p className="eyebrow">Dernière mise à jour · 31 août 2026</p>
      <h1>Vie privée.</h1>
      <p className="lead">
        Cette information explique simplement les données utilisées par Crew Hub
        Waterloo pendant sa phase bêta RGRV.
      </p>
      <div className="legal-stack">
        <section className="legal-panel">
          <h2>Les données utilisées</h2>
          <p>
            Prénom, nom, profil, progression RGRV, résultats de quiz, XP, points
            classés et préférences de classement. Le code personnel sert à la
            connexion et n’est pas affiché ni conservé en clair.
          </p>
        </section>
        <section className="legal-panel">
          <h2>Pourquoi</h2>
          <p>
            Ces informations servent uniquement à créer l’accès, retrouver la
            progression personnelle et faire fonctionner les modules RGRV et
            l’équipe. Elles ne sont pas destinées à un usage disciplinaire ni à
            l’évaluation individuelle au travail.
          </p>
        </section>
        <section className="legal-panel">
          <h2>Accès et hébergement</h2>
          <p>
            Les données sont accessibles aux administrateurs autorisés de l’outil.
            L’interface est hébergée chez Vercel et la base de données chez
            Supabase.
          </p>
        </section>
        <section className="legal-panel">
          <h2>Durée et tes droits</h2>
          <p>
            Les données sont conservées pendant la phase bêta RGRV. Une durée de
            conservation précise et une procédure de suppression devront être
            validées avec la direction avant une diffusion générale. Tu peux
            demander l’accès, la correction ou la suppression de tes données en
            écrivant à <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
          </p>
        </section>
      </div>
      <button className="text-action legal-back" type="button" onClick={onBack}>
        ← Retour
      </button>
    </section>
  );
}
