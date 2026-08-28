import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Course } from "./features/learning/Course";
import { RankedMode } from "./features/ranked/RankedMode";
import { TrainingMode } from "./features/training/TrainingMode";
import { crewApi, type CrewProfile } from "./lib/crewApi";
import "./App.css";

type Screen = "home" | "fiches" | "official" | "final" | "ranked" | "training" | "profile";
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
    achievements: [],
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
  const achievementCodes = profile?.achievements ?? [];
  const achievements = profile
    ? [
        { code: "first_quiz", title: "Premier pas", detail: "Termine un quiz.", unlocked: achievementCodes.includes("first_quiz") },
        { code: "reader", title: "Tout lu", detail: "Ouvre les 17 fiches officielles.", unlocked: achievementCodes.includes("reader") },
        { code: "strong_official", title: "Bien préparé", detail: "Atteins 80 % au quiz officiel.", unlocked: achievementCodes.includes("strong_official") },
        { code: "perfect_quiz", title: "Sans faute", detail: "Obtiens 100 % sur un quiz.", unlocked: achievementCodes.includes("perfect_quiz") },
        { code: "final_pass", title: "Validé", detail: "Réussis le test final.", unlocked: achievementCodes.includes("final_pass") },
      ]
    : [];
  const nextStep = !profile
    ? { screen: "fiches" as const, eyebrow: "Pour commencer", title: "Lis les fiches officielles.", detail: "17 situations concrètes avant de passer aux quiz.", action: "Découvrir les fiches" }
    : profile.seen_official.length < 17
      ? { screen: "fiches" as const, eyebrow: "Ta prochaine étape", title: "Continue les fiches officielles.", detail: `${profile.seen_official.length} sur 17 déjà consultée${profile.seen_official.length > 1 ? "s" : ""}.`, action: "Continuer les fiches" }
      : profile.best_official < 80
        ? { screen: "official" as const, eyebrow: "Ta prochaine étape", title: "Passe le quiz officiel.", detail: "10 questions pour vérifier que les repères sont acquis.", action: "Lancer le quiz" }
        : profile.passed_finals < 1
          ? { screen: "final" as const, eyebrow: "Ta prochaine étape", title: "Tente le test final.", detail: "5 questions essentielles pour valider tes acquis.", action: "Ouvrir le test final" }
          : { screen: "training" as const, eyebrow: "Continue à progresser", title: "Change de situation avec Entraînement+.", detail: "12 situations aléatoires, sans risque pour ton classement.", action: "Lancer Entraînement+" };

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
  function goTo(destination: Screen) {
    if (destination === "home") setScreen(destination);
    else requireProfile(destination);
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
          <button className={screen === "home" ? "active" : ""} onClick={() => goTo("home")}>Accueil</button>
          <button className={screen === "fiches" ? "active" : ""} onClick={() => goTo("fiches")}>Fiches</button>
          <button className={screen === "official" ? "active" : ""} onClick={() => goTo("official")}>Quiz officiel</button>
          <button className={screen === "final" ? "active" : ""} onClick={() => goTo("final")}>Test final</button>
          <button
            className={screen === "ranked" ? "active" : ""}
            onClick={() => goTo("ranked")}
          >
            Classé
          </button>
          <button
            className={screen === "training" ? "active" : ""}
            onClick={() => goTo("training")}
          >
            Entraînement+
          </button>
          <button
            className={screen === "profile" ? "active" : ""}
            onClick={() => goTo("profile")}
          >
            Mon profil
          </button>
        </nav>
        {profile ? <button className="level" type="button" onClick={() => goTo("profile")}>Profil · Niv. {profile.level}</button> : <span className="topbar-spacer" aria-hidden="true" />}
      </header>

      {screen === "home" && (
        <section className="home-page">
          <div className="home-intro">
            {profile ? <><p className="eyebrow">RGRV Crew Training</p><h1>{welcome}</h1><p className="lead">Poursuis ta préparation, un point à la fois.</p></> : <><p className="eyebrow">Test RGRV · vendredi</p><h1>Sois prêt pour le RGRV.</h1><p className="lead">Révise l’essentiel et entraîne-toi avant le test.</p><button className="primary hero-login" onClick={() => setAuthOpen(true)}>Se connecter <span>→</span></button></>}
          </div>
          {profile && <section className="next-activity">
            <div><p className="eyebrow">{nextStep.eyebrow}</p><h2>{nextStep.title}</h2><p>{nextStep.detail}</p></div>
            <button className="primary" onClick={() => goTo(nextStep.screen)}>{nextStep.action} <span>→</span></button>
          </section>}
          {profile && <section className="crew-challenges">
            <div className="challenge-heading"><div><p className="eyebrow">Défis du crew</p><h2>Quelques objectifs qui comptent.</h2></div><span>{achievements.filter((achievement) => achievement.unlocked).length} / {achievements.length} validés</span></div>
            <div className="achievement-list">{achievements.map((achievement) => <article className={achievement.unlocked ? "achievement unlocked" : "achievement"} key={achievement.code}><b>{achievement.unlocked ? "✓" : "○"}</b><div><strong>{achievement.title}</strong><p>{achievement.detail}</p></div>{achievement.unlocked && <small>Validé</small>}</article>)}</div>
          </section>}
        </section>
      )}

      {(["fiches", "official", "final"] as const).includes(screen as "fiches" | "official" | "final") && profile && (
        <Course key={screen} profile={profile} section={screen as "fiches" | "official" | "final"} onNavigate={goTo} onProfileUpdated={updateProfile} />
      )}
      {screen === "training" && profile && <TrainingMode onProfileUpdated={updateProfile} onOpenFiches={() => goTo("fiches")} />}
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
          <button className="primary" onClick={() => goTo("fiches")}>
            Ouvrir les fiches <span>→</span>
          </button>
          <button className="text-action" onClick={logout}>
            Se déconnecter sur cet appareil
          </button>
        </section>
      )}

      <nav className="mobile-nav" aria-label="Navigation mobile">
        <button className={screen === "home" ? "active" : ""} onClick={() => goTo("home")}><span>⌂</span>Accueil</button>
        <button className={screen === "fiches" ? "active" : ""} onClick={() => goTo("fiches")}><span>▤</span>Fiches</button>
        <button className={screen === "official" ? "active" : ""} onClick={() => goTo("official")}><span>✓</span>Quiz</button>
        <button className={screen === "training" ? "active" : ""} onClick={() => goTo("training")}><span>↻</span>Training+</button>
        <button className={screen === "ranked" ? "active" : ""} onClick={() => goTo("ranked")}><span>★</span>Classé</button>
      </nav>

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

      <footer className="site-footer">Pensé et créé pour l’équipe par <strong>Steve</strong></footer>
    </main>
  );
}

export default App;
