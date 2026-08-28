import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Course } from "./features/learning/Course";
import { RankedMode } from "./features/ranked/RankedMode";
import { TrainingMode } from "./features/training/TrainingMode";
import { crewApi, type CrewProfile } from "./lib/crewApi";
import "./App.css";

type Screen = "home" | "course" | "ranked" | "training" | "profile";
type AuthMode = "register" | "login";
type IdentityProfile = {
  id: string;
  first_name: string;
  last_name: string;
  display_name: string;
};

const identityUrl = import.meta.env.VITE_CREW_IDENTITY_URL as
  | string
  | undefined;

function Arches() {
  return (
    <svg
      className="arches"
      viewBox="0 0 272.7 238.5"
      role="img"
      aria-label="McDonald's"
    >
      <path
        fill="currentColor"
        d="m195.8 17.933c23.3 0 42.2 98.3 42.2 219.7h34c0-130.7-34.3-236.5-76.3-236.5-24 0-45.2 31.7-59.2 81.5-14-49.8-35.2-81.5-59-81.5-42 0-76.2 105.7-76.2 236.4h34c0-121.4 18.7-219.6 42-219.6s42.2 90.8 42.2 202.8h33.8c0-112 19-202.8 42.3-202.8"
      />
    </svg>
  );
}

function fallbackProfile(identity: IdentityProfile): CrewProfile {
  return {
    id: identity.id,
    username: identity.display_name,
    xp: 0,
    level: 1,
    total_attempts: 0,
    best_official: 0,
    best_training: 0,
    passed_finals: 0,
    perfect_runs: 0,
    seen_official: [],
    leaderboard_opt_in: false,
    ranked_points: 100,
    ranked_matches: 0,
  };
}

function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [profile, setProfile] = useState<CrewProfile | null>(() => {
    try {
      const saved = sessionStorage.getItem("rgrv-profile");
      return saved ? (JSON.parse(saved) as CrewProfile) : null;
    } catch {
      return null;
    }
  });
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("register");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [pin, setPin] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const welcome = useMemo(
    () =>
      profile
        ? `Ravi de te revoir, ${profile.username.split(" ")[0]}.`
        : "Apprends les bons réflexes, dans le bon ordre.",
    [profile],
  );

  function updateProfile(next: CrewProfile) {
    sessionStorage.setItem("rgrv-profile", JSON.stringify(next));
    setProfile(next);
  }

  useEffect(() => {
    if (
      !sessionStorage.getItem("rgrv-profile-id") ||
      !sessionStorage.getItem("rgrv-token")
    )
      return;
    void crewApi
      .profile()
      .then(({ profile: fresh }) => updateProfile(fresh))
      .catch(() => undefined);
  }, []);

  async function submitIdentity(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!identityUrl) {
      setMessage("La connexion n’est pas encore configurée.");
      return;
    }
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch(identityUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: authMode,
          first_name: firstName,
          last_name: lastName,
          pin,
        }),
      });
      const data = (await response.json()) as {
        error?: string;
        token?: string;
        profile?: IdentityProfile;
      };
      if (!response.ok || !data.profile || !data.token)
        throw new Error(data.error ?? "Connexion impossible.");
      sessionStorage.setItem("rgrv-profile-id", data.profile.id);
      sessionStorage.setItem("rgrv-token", data.token);
      let next = fallbackProfile(data.profile);
      try {
        next = (await crewApi.profile()).profile;
      } catch {
        /* The identity is still valid; sync is retried on the next action. */
      }
      updateProfile(next);
      setAuthOpen(false);
      setScreen("home");
      setPin("");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Connexion impossible.",
      );
    } finally {
      setBusy(false);
    }
  }

  function requireProfile(destination: Screen) {
    if (profile) setScreen(destination);
    else setAuthOpen(true);
  }
  function logout() {
    sessionStorage.removeItem("rgrv-profile");
    sessionStorage.removeItem("rgrv-profile-id");
    sessionStorage.removeItem("rgrv-token");
    setProfile(null);
    setScreen("home");
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <button
          className="brand"
          type="button"
          onClick={() => setScreen("home")}
        >
          <Arches />
          <span>
            <strong>RGRV Crew Training</strong>
            <small>Formation & révision</small>
          </span>
        </button>
        <nav aria-label="Navigation principale">
          <button
            className={screen === "home" ? "active" : ""}
            onClick={() => setScreen("home")}
          >
            Mon parcours
          </button>
          <button
            className={screen === "ranked" ? "active" : ""}
            onClick={() => requireProfile("ranked")}
          >
            Défi classé
          </button>
          <button
            className={screen === "training" ? "active" : ""}
            onClick={() => requireProfile("training")}
          >
            Entraînement+
          </button>
          <button
            className={screen === "profile" ? "active" : ""}
            onClick={() => requireProfile("profile")}
          >
            Mon profil
          </button>
        </nav>
        <button
          className="level"
          type="button"
          onClick={() => requireProfile("profile")}
        >
          {profile ? `Niv. ${profile.level}` : "Se connecter"}
        </button>
      </header>

      {screen === "home" && (
        <section className="home-page">
          <div className="hero-grid">
            <div>
              <p className="eyebrow">
                {profile ? "Ton parcours continue" : "Formation crew"}
              </p>
              <h1>{welcome}</h1>
              <p className="lead">
                Commence par les fiches officielles. Le quiz et le test final
                permettent ensuite de vérifier que tout est acquis.
              </p>
              <button
                className="primary"
                onClick={() => requireProfile("course")}
              >
                {profile
                  ? "Reprendre mon parcours"
                  : "Entrer dans mon parcours"}{" "}
                <span>→</span>
              </button>
            </div>
            <aside className="next-step">
              <small>Ta prochaine étape</small>
              <h2>
                {profile && profile.seen_official.length
                  ? "02 — Continuer les fiches"
                  : "01 — Lire les fiches"}
              </h2>
              <p>
                {profile
                  ? `${profile.seen_official.length} fiche${profile.seen_official.length > 1 ? "s" : ""} consultée${profile.seen_official.length > 1 ? "s" : ""} sur 17.`
                  : "17 repères essentiels avant de passer au quiz officiel."}
              </p>
            </aside>
          </div>
          <section className="featured-fiches">
            <div>
              <p className="eyebrow">À lire avant les quiz</p>
              <h2>Les 17 fiches officielles.</h2>
              <p>
                Des situations concrètes, une réponse attendue et les repères
                utiles du restaurant. C’est la base du parcours.
              </p>
            </div>
            <div className="featured-fiches-action">
              <span>{profile ? `${profile.seen_official.length} / 17 lues` : "17 à découvrir"}</span>
              <button className="primary" onClick={() => requireProfile("course")}>
                Lire les fiches <span>→</span>
              </button>
            </div>
          </section>
          <section className="ranked-strip">
            <div>
              <p className="eyebrow">Défi classé · toujours disponible</p>
              <h2>
                {profile
                  ? "Rejoue pour monter dans le classement."
                  : "Une raison de revenir et de progresser."}
              </h2>
            </div>
            <button
              className="ranked-action"
              onClick={() => requireProfile("ranked")}
            >
              <small>Classement crew</small>
              <strong>{profile ? "Voir mon défi →" : "Découvrir →"}</strong>
            </button>
          </section>
          <div className="section-heading">
            <h2>Ton parcours RGRV</h2>
            <span>
              {profile
                ? `${profile.xp} XP · niveau ${profile.level}`
                : "4 étapes, un parcours clair"}
            </span>
          </div>
          <div className="path">
            <article className="path-step current">
              <b>01</b>
              <h3>Fiches officielles</h3>
              <p>17 situations à connaître.</p>
            </article>
            <article className="path-step">
              <b>02</b>
              <h3>Quiz officiel</h3>
              <p>10 questions à chaque passage.</p>
            </article>
            <article className="path-step">
              <b>03</b>
              <h3>Test final</h3>
              <p>Valide tes acquis.</p>
            </article>
            <article className="path-step">
              <b>04</b>
              <h3>Entraînement+</h3>
              <p>36 questions, 12 à chaque tour.</p>
            </article>
          </div>
        </section>
      )}

      {screen === "course" && profile && (
        <Course profile={profile} onProfileUpdated={updateProfile} />
      )}
      {screen === "training" && profile && <TrainingMode onProfileUpdated={updateProfile} onOpenFiches={() => setScreen("course")} />}
      {screen === "ranked" && profile && <RankedMode profile={profile} onProfileUpdated={updateProfile} />}
      {screen === "profile" && profile && (
        <section className="content-page">
          <p className="eyebrow">Mon profil</p>
          <h1>{profile.username}</h1>
          <p className="lead">
            Niveau {profile.level} · {profile.xp} XP · {profile.total_attempts}{" "}
            quiz terminé{profile.total_attempts > 1 ? "s" : ""}
          </p>
          <div className="profile-stats">
            <span>
              <b>
                {profile.best_official || "—"}
                {profile.best_official ? "%" : ""}
              </b>
              Meilleur officiel
            </span>
            <span>
              <b>
                {profile.best_training || "—"}
                {profile.best_training ? "%" : ""}
              </b>
              Meilleur Training+
            </span>
            <span>
              <b>{profile.passed_finals}</b>Test
              {profile.passed_finals > 1 ? "s" : ""} final
            </span>
          </div>
          <button className="primary" onClick={() => setScreen("course")}>
            Continuer le parcours <span>→</span>
          </button>
          <button className="text-action" onClick={logout}>
            Se déconnecter sur cet appareil
          </button>
        </section>
      )}

      {authOpen && (
        <div className="modal-layer" role="presentation">
          <section
            className="identity-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="identity-title"
          >
            <button
              className="close"
              onClick={() => setAuthOpen(false)}
              aria-label="Fermer"
            >
              ×
            </button>
            <Arches />
            <p className="eyebrow">
              {authMode === "register"
                ? "Premier passage"
                : "Content de te revoir"}
            </p>
            <h2 id="identity-title">
              {authMode === "register"
                ? "Crée ton accès crew."
                : "Ouvre ton parcours."}
            </h2>
            <p>
              Prénom et nom identifient ton profil. Ton code à six chiffres est
              personnel.
            </p>
            <form onSubmit={submitIdentity}>
              <label>
                Prénom
                <input
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  autoComplete="given-name"
                  required
                />
              </label>
              <label>
                Nom
                <input
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  autoComplete="family-name"
                  required
                />
              </label>
              <label>
                Code personnel
                <input
                  value={pin}
                  onChange={(event) =>
                    setPin(event.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  autoComplete={
                    authMode === "login" ? "current-password" : "new-password"
                  }
                  placeholder="6 chiffres"
                  required
                />
              </label>
              {message && (
                <p className="error" role="alert">
                  {message}
                </p>
              )}
              <button className="primary full" disabled={busy}>
                {busy
                  ? "Un instant…"
                  : authMode === "register"
                    ? "Créer mon accès"
                    : "Se connecter"}
              </button>
            </form>
            <button
              className="switch-mode"
              onClick={() => {
                setAuthMode(authMode === "register" ? "login" : "register");
                setMessage("");
              }}
            >
              {authMode === "register"
                ? "J’ai déjà un profil"
                : "Créer mon premier profil"}
            </button>
          </section>
        </div>
      )}
    </main>
  );
}

export default App;
