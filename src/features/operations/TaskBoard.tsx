import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import type { CrewRole } from "./roles";
import { crewApi, type OperationsFeed } from "../../lib/crewApi";

type TaskStatus = "pending" | "todo" | "doing" | "done" | "rejected";
type TaskCategory = { id: string; name: string; createdByPrivate: string };
type Task = {
  id: string;
  title: string;
  categoryId: string;
  createdBy: string;
  createdAt: string;
  status: TaskStatus;
  takenBy?: string;
  completedBy?: string;
  completedAt?: string;
  completionNote?: string;
};

function localDate() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 10);
}

const today = localDate();

const initialCategories: TaskCategory[] = [
  { id: "cleaning", name: "Nettoyage", createdByPrivate: "Système" },
  { id: "monitoring", name: "Surveillance", createdByPrivate: "Système" },
  { id: "maintenance", name: "Maintenance", createdByPrivate: "Système" },
  { id: "organisation", name: "Organisation", createdByPrivate: "Système" },
];

// Les tâches viennent exclusivement de Supabase : aucune donnée de maquette ne doit
// apparaître pendant le chargement ni en cas d'indisponibilité du service.
const initialTasks: Task[] = [];

const tabCopy: Record<TaskStatus, string> = {
  pending: "À valider",
  todo: "À faire",
  doing: "En cours",
  done: "Terminées",
  rejected: "Refusées",
};

const taskStatuses: TaskStatus[] = ["pending", "todo", "doing", "done", "rejected"];

function formatTaskTime(value: string) {
  return new Intl.DateTimeFormat("fr-BE", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function TaskBoard({ actorName, role }: { actorName: string; role: CrewRole }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [categories, setCategories] = useState<TaskCategory[]>(initialCategories);
  const [tab, setTab] = useState<TaskStatus>("todo");
  const [formOpen, setFormOpen] = useState(false);
  const [finishTask, setFinishTask] = useState<Task | null>(null);
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState(initialCategories[0].id);
  const [newCategoryOpen, setNewCategoryOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [completionNote, setCompletionNote] = useState("");
  const [thankYou, setThankYou] = useState<string | null>(null);
  const [syncError, setSyncError] = useState("");
  const [formError, setFormError] = useState("");
  const [savingTask, setSavingTask] = useState(false);
  const [savingCategory, setSavingCategory] = useState(false);
  const [canReviewProposals, setCanReviewProposals] = useState(false);
  const titleInput = useRef<HTMLInputElement>(null);
  const thankYouTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const canManage = role === "manager" || role === "first_assistant" || role === "store_manager";
  const canReview = canManage || canReviewProposals;

  useEffect(() => () => {
    if (thankYouTimeout.current) clearTimeout(thankYouTimeout.current);
  }, []);

  useEffect(() => {
    if (!formOpen) return;
    const focusTitle = window.setTimeout(() => {
      titleInput.current?.focus({ preventScroll: true });
      titleInput.current?.scrollIntoView({ block: "center", inline: "nearest" });
    }, 120);
    return () => window.clearTimeout(focusTitle);
  }, [formOpen]);

  function applyFeed(feed: OperationsFeed) {
    setCategories(feed.categories.map((category) => ({ ...category, createdByPrivate: "Supabase" })));
    setTasks(feed.tasks.map((task) => ({ id: task.id, title: task.title, categoryId: task.category_id, createdBy: task.createdBy, createdAt: task.created_at, status: task.status, takenBy: task.takenBy ?? undefined, completedBy: task.completedBy ?? undefined, completedAt: task.completed_at ?? undefined, completionNote: task.completion_note ?? undefined })));
    setCanReviewProposals(feed.can_review_proposals);
  }

  useEffect(() => { void crewApi.operations().then(applyFeed).catch((error) => setSyncError(error instanceof Error ? error.message : "Synchronisation indisponible.")); }, []);

  const visibleTasks = useMemo(() => tasks.filter((task) => task.status === tab && (!["pending", "rejected"].includes(task.status) || canReview || task.createdBy === actorName)), [actorName, canReview, tab, tasks]);
  const availableStatuses = taskStatuses.filter((status) => !["pending", "rejected"].includes(status) || canReview || tasks.some((task) => task.status === status && task.createdBy === actorName));
  const completedToday = tasks.filter(
    (task) => task.status === "done" && task.completedAt?.slice(0, 10) === today,
  ).length;

  function categoryName(id: string) {
    return categories.find((category) => category.id === id)?.name ?? "Sans catégorie";
  }

  function resetCreateForm() {
    setTitle("");
    setCategoryId(categories[0]?.id ?? "");
    setNewCategoryOpen(false);
    setNewCategory("");
    setFormError("");
  }

  async function createCategory() {
    const name = newCategory.trim();
    if (!name) return;
    setSavingCategory(true);
    setFormError("");
    try {
      const feed = await crewApi.createCategory(name);
      applyFeed(feed);
      const category = feed.categories.find((item) => item.name === name);
      if (!category) throw new Error("La catégorie n’a pas été retrouvée après sa création.");
      setCategoryId(category.id);
      setNewCategory("");
      setNewCategoryOpen(false);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Catégorie impossible à créer.");
    } finally {
      setSavingCategory(false);
    }
  }

  async function createTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle || !categoryId) return;
    setSavingTask(true);
    setFormError("");
    try {
      applyFeed(await crewApi.createTask(cleanTitle, categoryId));
      setTab(canManage ? "todo" : "pending");
      setFormOpen(false);
      resetCreateForm();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Création impossible.");
    } finally {
      setSavingTask(false);
    }
  }

  async function takeTask(taskId: string) {
    try { applyFeed(await crewApi.transitionTask(taskId, "take")); setTab("doing"); } catch (error) { setSyncError(error instanceof Error ? error.message : "Mise à jour impossible."); }
  }

  async function approveTask(taskId: string) {
    try { applyFeed(await crewApi.transitionTask(taskId, "approve")); setTab("todo"); } catch (error) { setSyncError(error instanceof Error ? error.message : "Validation impossible."); }
  }

  async function rejectTask(taskId: string) {
    try { applyFeed(await crewApi.transitionTask(taskId, "reject")); setTab("rejected"); } catch (error) { setSyncError(error instanceof Error ? error.message : "Refus impossible."); }
  }

  async function completeTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!finishTask) return;
    try { applyFeed(await crewApi.transitionTask(finishTask.id, "complete", completionNote)); setTab("done"); setFinishTask(null); setCompletionNote(""); setThankYou(finishTask.title); if (thankYouTimeout.current) clearTimeout(thankYouTimeout.current); thankYouTimeout.current = setTimeout(() => setThankYou(null), 3200); } catch (error) { setSyncError(error instanceof Error ? error.message : "Finalisation impossible."); }
  }

  return (
    <section className="operations-page">
      <header className="operations-heading">
        <div>
          <p className="eyebrow">Organisation équipe</p>
          <h1>Tâches du jour.</h1>
        </div>
        <button className="primary" type="button" onClick={() => setFormOpen(true)}>
          {canManage ? "Créer une tâche" : "Proposer une tâche"} <span>+</span>
        </button>
      </header>

      <section className="task-progress" aria-label="Progression des tâches">
        <strong>{completedToday}</strong>
        <span>tâche{completedToday > 1 ? "s" : ""} terminée{completedToday > 1 ? "s" : ""} aujourd’hui</span>
      </section>

      <div className="task-tabs" role="tablist" aria-label="Statut des tâches">
        {availableStatuses.map((status) => (
          <button
            key={status}
            type="button"
            role="tab"
            aria-selected={tab === status}
            className={tab === status ? "active" : ""}
            onClick={() => setTab(status)}
          >
            <span>{tabCopy[status]}</span><small>{tasks.filter((task) => task.status === status && (!["pending", "rejected"].includes(status) || canReview || task.createdBy === actorName)).length}</small>
          </button>
        ))}
      </div>

      <div className="task-list">
        {syncError && <p className="error" role="alert">{syncError}</p>}
        {visibleTasks.length === 0 ? (
          <p className="task-empty">Aucune tâche dans cette section.</p>
        ) : (
          visibleTasks.map((task) => (
            <article className="task-card" key={task.id}>
              <div className="task-card-top">
                <span className="task-category">{categoryName(task.categoryId)}</span>
                {task.status === "done" && task.completedAt && <time dateTime={task.completedAt}>Terminée le {formatTaskTime(task.completedAt)}</time>}
              </div>
              <h2>{task.title}</h2>
              <p>Créée par {task.createdBy} le {formatTaskTime(task.createdAt)}</p>
              <footer>
                <span className={`task-state ${task.status}`}>{task.status === "pending" ? "En attente de validation" : task.status === "rejected" ? "Proposition refusée" : task.status === "todo" ? "À faire" : task.status === "doing" ? `Prise par ${task.takenBy}` : `Terminée par ${task.completedBy}`}</span>
                {task.status === "pending" && canReview && <span className="task-review-actions"><button type="button" className="task-action take" onClick={() => void approveTask(task.id)}>Accepter</button><button type="button" className="task-action reject" onClick={() => void rejectTask(task.id)}>Refuser</button></span>}
                {task.status === "todo" && <button type="button" className="task-action take" onClick={() => void takeTask(task.id)}>Je m’en charge</button>}
                {task.status === "doing" && task.takenBy === actorName && <button type="button" className="task-action finish" onClick={() => setFinishTask(task)}>Terminer</button>}
              </footer>
              {task.status === "done" && task.completionNote && <p className="task-note">{task.completionNote}</p>}
            </article>
          ))
        )}
      </div>

      {formOpen && (
        <div className="operations-layer" role="presentation">
          <form className="task-sheet" onSubmit={createTask}>
            <button className="close" type="button" aria-label="Fermer" onClick={() => { setFormOpen(false); resetCreateForm(); }}>×</button>
            <p className="eyebrow">{canManage ? "Nouvelle tâche" : "Nouvelle proposition"}</p>
            <h2>{canManage ? "Créer une tâche." : "Proposer une tâche."}</h2>
            <label>Titre<input ref={titleInput} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Ex. : nettoyer la zone de tri" required /></label>
            <label>Catégorie<select value={categoryId} onChange={(event) => setCategoryId(event.target.value)}>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
            {canManage && <><button className="category-add" type="button" onClick={() => { setNewCategoryOpen((open) => !open); setFormError(""); }}>Ajouter une catégorie +</button>{newCategoryOpen && <div className="category-create"><input value={newCategory} onChange={(event) => setNewCategory(event.target.value)} placeholder="Nom de la catégorie" /><button type="button" disabled={savingCategory || !newCategory.trim()} onClick={() => void createCategory()}>{savingCategory ? "Ajout…" : "Ajouter"}</button></div>}</>}
            {formError && <p className="error" role="alert">{formError}</p>}
            <button className="primary full" type="submit" disabled={savingTask || savingCategory}>{savingTask ? "Enregistrement…" : canManage ? "Créer la tâche" : "Envoyer la proposition"} <span>→</span></button>
          </form>
        </div>
      )}

      {finishTask && (
        <div className="operations-layer" role="presentation">
          <form className="task-sheet" onSubmit={completeTask}>
            <button className="close" type="button" aria-label="Fermer" onClick={() => { setFinishTask(null); setCompletionNote(""); }}>×</button>
            <p className="eyebrow">Clôturer la tâche</p>
            <h2>{finishTask.title}</h2>
            <label>Note de fin <small>facultative</small><textarea value={completionNote} onChange={(event) => setCompletionNote(event.target.value)} placeholder="Ex. : vérifié, rien à signaler." /></label>
            <button className="primary full" type="submit">Valider la tâche <span>✓</span></button>
          </form>
        </div>
      )}

      {thankYou && <aside className="task-thanks" role="status" aria-live="polite"><b aria-hidden="true">✓</b><span><strong>Merci {actorName.split(" ")[0]} !</strong><small>« {thankYou} » est terminée.</small></span></aside>}
    </section>
  );
}
