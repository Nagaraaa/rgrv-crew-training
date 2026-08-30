import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Course } from "./features/learning/Course";
import { RankedMode } from "./features/ranked/RankedMode";
import { TrainingMode } from "./features/training/TrainingMode";
import { TaskBoard } from "./features/operations/TaskBoard";
import { Team } from "./features/operations/Team";
import { roleLabel, type CrewRole } from "./features/operations/roles";
import { RgrvHub } from "./features/rgrv/RgrvHub";
import { crewApi, type CrewProfile } from "./lib/crewApi";
import "./App.css";
import "./task-composer.css";

type Screen = "home" | "rgrv" | "fiches" | "official" | "final" | "ranked" | "leaderboard" | "training" | "tasks" | "team" | "profile";
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
    role: "crew",
    can_debug_roles: false,
    xp: 0,
    level: 1,
    total_attempts: 0,
    best_official: 0,
    best_training: 0,
    passed_finals: 0,
    perfect_runs: 0,
    seen_official: [],
    leaderboard_opt_in: false,
    ranked_points: 0,
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
  const [previewRole, setPreviewRole] = useState<CrewRole | null>(null);
  const [authMode, setAuthMode] = useState<AuthMode>("register");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [pin, setPin] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const currentRole = profile ? (previewRole ?? profile.role ?? "crew") : "crew";
  const canPreviewRoles = Boolean(profile && (import.meta.env.DEV || profile.can_debug_roles));

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
    setPreviewRole(null);
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
          <span className="brand-copy">
            <strong><b>C</b>rew <b>H</b>ub</strong>
            <small className="brand-location"><b>W</b>aterloo</small>
          </span>
          <i className="brand-divider" aria-hidden="true" />
          <em className="brand-beta">Beta</em>
        </button>
        <nav aria-label="Navigation principale">
          <button className={screen === "home" ? "active" : ""} onClick={() => goTo("home")}>Accueil</button>
          <button className={screen === "tasks" ? "active" : ""} onClick={() => goTo("tasks")}>Tâches</button>
          <button className={screen === "rgrv" || ["fiches", "official", "final", "ranked", "leaderboard", "training"].includes(screen) ? "active" : ""} onClick={() => goTo("rgrv")}>RGRV</button>
          <button className={screen === "team" ? "active" : ""} onClick={() => goTo("team")}>Équipe</button>
          <button
            className={screen === "profile" ? "active" : ""}
            onClick={() => goTo("profile")}
          >
            Mon profil
          </button>
        </nav>
        {profile ? <button className="level" type="button" onClick={() => goTo("profile")}>{["rgrv", "fiches", "official", "final", "ranked", "leaderboard", "training"].includes(screen) ? `${roleLabel[currentRole]} · Niv. ${profile.level}` : `${profile.username} — ${roleLabel[currentRole]}`}</button> : <span className="topbar-spacer" aria-hidden="true" />}
      </header>

      {screen === "home" && (
        <section className="home-page">
          <div className="home-intro">
            {profile ? <><h1>Bon retour, {profile.username.split(" ")[0]}.</h1><p className="lead">L’essentiel de l’équipe, au même endroit.</p></> : <><p className="eyebrow">Crew Hub</p><h1>Un espace simple pour l’équipe.</h1><p className="lead">Tâches du quotidien et module RGRV, sans se perdre dans les menus.</p><button className="primary hero-login" onClick={() => setAuthOpen(true)}>Se connecter <span>→</span></button></>}
          </div>
          {profile && <section className="hub-links">
            <button type="button" onClick={() => goTo("tasks")}><span>Organisation</span><strong>Tâches</strong><small>Voir, prendre et terminer les actions de l’équipe.</small><b>Ouvrir →</b></button>
            <button type="button" onClick={() => goTo("rgrv")}><span>Module annuel</span><strong>RGRV</strong><small>Prépare ton RGRV avec les fiches, quiz et modes d’entraînement.</small><b>Ouvrir →</b></button>
          </section>}
        </section>
      )}

      {screen === "rgrv" && profile && <RgrvHub onNavigate={goTo} />}
      {screen === "tasks" && profile && <TaskBoard actorName={profile.username} role={currentRole} />}
      {screen === "team" && profile && <Team />}

      {(["fiches", "official", "final"] as const).includes(screen as "fiches" | "official" | "final") && profile && (
        <Course key={screen} profile={profile} section={screen as "fiches" | "official" | "final"} onNavigate={goTo} onProfileUpdated={updateProfile} />
      )}
      {screen === "training" && profile && <TrainingMode onProfileUpdated={updateProfile} onOpenFiches={() => goTo("fiches")} />}
      {screen === "ranked" && profile && <RankedMode profile={profile} onProfileUpdated={updateProfile} onOpenLeaderboard={() => goTo("leaderboard")} />}
      {screen === "leaderboard" && profile && <RankedMode profile={profile} onProfileUpdated={updateProfile} view="leaderboard" />}
      {screen === "profile" && profile && (
        <section className="content-page">
          <p className="eyebrow">Mon profil</p>
          <h1>{profile.username}</h1>
          <p className="lead">
            {roleLabel[currentRole]} · Niveau RGRV {profile.level}
          </p>
          <div className="profile-stats">
            <span>
              <b>{profile.xp}</b>
              XP RGRV
            </span>
            <span>
              <b>{profile.passed_finals}</b>
              Test{profile.passed_finals > 1 ? "s" : ""} final
            </span>
            <span>
              <b>{profile.ranked_matches}</b>
              Partie{profile.ranked_matches > 1 ? "s" : ""} classée{profile.ranked_matches > 1 ? "s" : ""}
            </span>
          </div>
          {canPreviewRoles && <section className="role-preview"><p className="eyebrow">Aperçu des droits</p><h2>Voir l’application comme…</h2><div>{(["crew", "crew_trainer", "manager", "first_assistant", "store_manager"] as CrewRole[]).map((role) => <button key={role} className={currentRole === role ? "active" : ""} type="button" onClick={() => setPreviewRole(role)}>{roleLabel[role]}</button>)}</div><small>Réservé au débogage : ce sélecteur ne modifie aucun compte ni droit Supabase.</small></section>}
          <button className="text-action" onClick={logout}>
            Se déconnecter sur cet appareil
          </button>
        </section>
      )}

      <nav className="mobile-nav" aria-label="Navigation mobile">
        <button className={screen === "home" ? "active" : ""} onClick={() => goTo("home")}><span>⌂</span>Accueil</button>
        <button className={screen === "tasks" ? "active" : ""} onClick={() => goTo("tasks")}><span>✓</span>Tâches</button>
        <button className={screen === "rgrv" || ["fiches", "official", "final", "ranked", "leaderboard", "training"].includes(screen) ? "active" : ""} onClick={() => goTo("rgrv")}><span>▤</span>RGRV</button>
        <button className={screen === "team" ? "active" : ""} onClick={() => goTo("team")}><span>♙</span>Équipe</button>
        <button className={screen === "profile" ? "active" : ""} onClick={() => goTo("profile")}><span>◉</span>Profil</button>
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

      {screen === "home" && <footer className="site-footer">Pensé et créé pour l’équipe par <strong>Steve</strong></footer>}
    </main>
  );
}

export default App;
