import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Course } from "./features/learning/Course";
import { RankedMode } from "./features/ranked/RankedMode";
import { TrainingMode } from "./features/training/TrainingMode";
import { TaskBoard } from "./features/operations/TaskBoard";
import { Team } from "./features/operations/Team";
import { roleLabel, type CrewRole } from "./features/operations/roles";
import { RgrvHub } from "./features/rgrv/RgrvHub";
import { RgrvObjectives } from "./features/rgrv/RgrvObjectives";
import { crewApi, type CrewProfile } from "./lib/crewApi";
import "./App.css";
import "./task-composer.css";
import "./rgrv-objectives.css";
import "./landing-auth.css";

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
const profileKey = "rgrv-profile";
const profileIdKey = "rgrv-profile-id";
const tokenKey = "rgrv-token";
const rgrvTestDate = new Date(2026, 9, 2);

function daysUntilRgrv() {
  return Math.max(0, Math.ceil((rgrvTestDate.getTime() - Date.now()) / 86_400_000));
}

function savedProfile() {
  for (const storage of [sessionStorage, localStorage]) {
    try {
      const saved = storage.getItem(profileKey);
      if (saved) return JSON.parse(saved) as CrewProfile;
    } catch {
      storage.removeItem(profileKey);
    }
  }
  return null;
}

function savedSession() {
  return [sessionStorage, localStorage].some((storage) => Boolean(storage.getItem(profileIdKey) && storage.getItem(tokenKey)));
}

function sessionStorageForProfile() {
  return localStorage.getItem(profileIdKey) && localStorage.getItem(tokenKey) ? localStorage : sessionStorage;
}

function clearStoredSession() {
  for (const storage of [sessionStorage, localStorage]) {
    storage.removeItem(profileKey);
    storage.removeItem(profileIdKey);
    storage.removeItem(tokenKey);
  }
}

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

function RgrvCountdown() {
  const [daysRemaining, setDaysRemaining] = useState(daysUntilRgrv);

  useEffect(() => {
    const timer = window.setInterval(() => setDaysRemaining(daysUntilRgrv()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  return <p className="rgrv-countdown" aria-label={`Test RGRV le 2 octobre : ${daysRemaining === 0 ? "aujourd’hui" : `${daysRemaining} jours restants`}`}><span>Test RGRV</span><strong>{daysRemaining === 0 ? "Aujourd’hui" : `J-${daysRemaining}`}</strong><small>2 octobre</small></p>;
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
  const [screen, setScreen] = useState<Screen>(() => savedProfile() ? "rgrv" : "home");
  const [profile, setProfile] = useState<CrewProfile | null>(savedProfile);
  const [authOpen, setAuthOpen] = useState(false);
  const [previewRole, setPreviewRole] = useState<CrewRole | null>(null);
  const [authMode, setAuthMode] = useState<AuthMode>("register");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [pin, setPin] = useState("");
  const [rememberSession, setRememberSession] = useState(false);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const activeProfile = profile;
  const currentRole = activeProfile ? (previewRole ?? activeProfile.role ?? "crew") : "crew";
  const canPreviewRoles = Boolean(activeProfile && (import.meta.env.DEV || activeProfile.can_debug_roles));

  function updateProfile(next: CrewProfile) {
    sessionStorageForProfile().setItem(profileKey, JSON.stringify(next));
    setProfile(next);
  }

  useEffect(() => {
    if (
      !savedSession()
    )
      return;
    void crewApi
      .profile()
      .then(({ profile: fresh }) => {
        sessionStorageForProfile().setItem(profileKey, JSON.stringify(fresh));
        setProfile(fresh);
      })
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
      clearStoredSession();
      const storage = rememberSession ? localStorage : sessionStorage;
      storage.setItem(profileIdKey, data.profile.id);
      storage.setItem(tokenKey, data.token);
      let next = fallbackProfile(data.profile);
      try {
        next = (await crewApi.profile()).profile;
      } catch {
        /* The identity is still valid; sync is retried on the next action. */
      }
      updateProfile(next);
      setAuthOpen(false);
      setScreen("rgrv");
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
    clearStoredSession();
    setProfile(null);
    setPreviewRole(null);
    setScreen("home");
  }

  return (
    <main className={profile ? "app-shell is-authenticated" : "app-shell"}>
      <header className={profile ? "topbar" : "topbar topbar--guest"}>
        <button
          className="brand"
          type="button"
          onClick={() => setScreen(profile ? "rgrv" : "home")}
        >
          <Arches />
          <span className="brand-copy">
            <strong><b>C</b>rew <b>H</b>ub</strong>
            <small className="brand-location"><b>W</b>aterloo</small>
          </span>
          <i className="brand-divider" aria-hidden="true" />
          <em className="brand-beta">Beta</em>
        </button>
        {profile && <nav aria-label="Navigation principale">
          <button className={screen === "home" || screen === "rgrv" || ["fiches", "official", "final", "ranked", "leaderboard", "training"].includes(screen) ? "active" : ""} onClick={() => goTo("rgrv")}>RGRV</button>
          <button className={screen === "team" ? "active" : ""} onClick={() => goTo("team")}>Équipe</button>
          <button
            className={screen === "profile" ? "active" : ""}
            onClick={() => goTo("profile")}
          >
            Mon profil
          </button>
        </nav>}
        {profile ? <button className="level" type="button" onClick={() => goTo("profile")}>{["rgrv", "fiches", "official", "final", "ranked", "leaderboard", "training"].includes(screen) ? `${roleLabel[currentRole]} · Niv. ${profile.level}` : `${profile.username} — ${roleLabel[currentRole]}`}</button> : screen !== "home" && <button className="topbar-login" type="button" onClick={() => { setAuthMode("login"); setMessage(""); setAuthOpen(true); }}>Se connecter</button>}
      </header>

      {screen === "home" && !authOpen && (
        <section className="home-page landing-page">
          <div className="landing-hero">
            <RgrvCountdown /><h1>TEST RGRV.</h1><p className="lead">Fiches, quiz et test final pour réviser.</p>
            <div className="landing-actions"><button className="primary" onClick={() => { setAuthMode("login"); setMessage(""); setAuthOpen(true); }}>Se connecter <span>→</span></button><button className="landing-register" onClick={() => { setAuthMode("register"); setMessage(""); setAuthOpen(true); }}>Créer mon accès</button></div>
          </div>
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
          <RgrvObjectives profile={profile} />
          {canPreviewRoles && <section className="role-preview"><p className="eyebrow">Aperçu des droits</p><h2>Voir l’application comme…</h2><div>{(["crew", "crew_trainer", "manager", "first_assistant", "store_manager"] as CrewRole[]).map((role) => <button key={role} className={currentRole === role ? "active" : ""} type="button" onClick={() => setPreviewRole(role)}>{roleLabel[role]}</button>)}</div><small>Réservé au débogage : ce sélecteur ne modifie aucun compte ni droit Supabase.</small></section>}
          <button className="text-action" onClick={logout}>
            Se déconnecter sur cet appareil
          </button>
        </section>
      )}

      {profile && <nav className="mobile-nav mobile-nav--three" aria-label="Navigation mobile">
        <button className={screen === "home" || screen === "rgrv" || ["fiches", "official", "final", "ranked", "leaderboard", "training"].includes(screen) ? "active" : ""} onClick={() => goTo("rgrv")}><span>▤</span>RGRV</button>
        <button className={screen === "team" ? "active" : ""} onClick={() => goTo("team")}><span>♙</span>Équipe</button>
        <button className={screen === "profile" ? "active" : ""} onClick={() => goTo("profile")}><span>◉</span>Profil</button>
      </nav>}

      {authOpen && (
        <section className="auth-page" aria-labelledby="identity-title">
          <div className="auth-intro"><h1>Accède au RGRV.</h1><p>Retrouve ta progression sur cet appareil.</p></div>
          <section className="identity-modal auth-card">
            <button className="close" onClick={() => setAuthOpen(false)} aria-label="Retour à l’accueil">×</button>
            <h2 id="identity-title">
              {authMode === "register"
                ? "Créer mon accès."
                : "Se connecter."}
            </h2>
            <p>
              Prénom, nom et code personnel à 6 chiffres.
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
              <label className="remember-session">
                <input className="switch-input" type="checkbox" role="switch" checked={rememberSession} onChange={(event) => setRememberSession(event.target.checked)} />
                <span className="switch-control" aria-hidden="true" />
                <span><strong>Rester connecté sur cet appareil</strong><small>À activer uniquement sur ton téléphone personnel.</small></span>
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
        </section>
      )}

      {screen === "home" && !authOpen && <footer className="site-footer">Pensé et créé pour l’équipe par <strong>Steve</strong></footer>}
    </main>
  );
}

export default App;
