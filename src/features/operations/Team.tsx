import { useEffect, useState } from "react";
import { crewApi, type TeamFeed } from "../../lib/crewApi";
import { roleLabel, type CrewRole } from "./roles";

type TeamMember = { id: string; name: string; role: CrewRole };
type ManagedRole = "manager" | "first_assistant" | "crew_trainer";

function formatChangeTime(createdAt: string) {
  return new Intl.DateTimeFormat("fr-BE", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(createdAt));
}

function RoleSection({ title, members, addLabel, onAdd, onEdit, emptyLabel }: {
  title: string;
  members: TeamMember[];
  addLabel?: string;
  onAdd?: () => void;
  onEdit?: (member: TeamMember) => void;
  emptyLabel: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = `team-role-${title.toLowerCase().replaceAll(" ", "-")}`;

  return (
    <section className={`team-role-section${isOpen ? " is-open" : ""}`}>
      <header>
        <button className="team-role-toggle" type="button" aria-expanded={isOpen} aria-controls={panelId} onClick={() => setIsOpen((current) => !current)}>
          <span><p className="eyebrow">{title}</p><h2>{members.length} personne{members.length > 1 ? "s" : ""}</h2></span>
          <b>{isOpen ? "Masquer" : "Voir"}</b>
        </button>
        {isOpen && addLabel && onAdd && <button type="button" onClick={onAdd}>+ {addLabel}</button>}
      </header>
      {isOpen && <div id={panelId}>{members.length === 0 ? <p className="team-empty">{emptyLabel}</p> : <div className="team-role-members">{members.map((member) => <div className="team-role-member" key={member.id}><strong>{member.name}</strong>{onEdit && <button type="button" onClick={() => onEdit(member)}>Gérer</button>}</div>)}</div>}</div>}
    </section>
  );
}

export function Team() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [history, setHistory] = useState<TeamFeed["role_history"]>([]);
  const [canManageTeam, setCanManageTeam] = useState(false);
  const [canEditEveryRole, setCanEditEveryRole] = useState(false);
  const [addRole, setAddRole] = useState<ManagedRole | null>(null);
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [editedRole, setEditedRole] = useState<Exclude<CrewRole, "store_manager">>("crew");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const crewMembers = members.filter((member) => member.role === "crew");

  function applyFeed(feed: TeamFeed) {
    setMembers(feed.members.map((member) => ({ id: member.id, name: member.username, role: member.role })));
    setHistory(feed.role_history);
    setCanManageTeam(feed.can_manage_team);
    setCanEditEveryRole(feed.can_edit_every_role);
  }

  useEffect(() => { void crewApi.team().then(applyFeed).catch((error) => setMessage(error instanceof Error ? error.message : "Équipe indisponible.")); }, []);

  function openAdd(nextRole: ManagedRole) {
    if (!canEditEveryRole && nextRole !== "manager") return;
    setMessage("");
    setAddRole(nextRole);
    setSelectedMemberId(crewMembers[0]?.id ?? "");
  }

  function openEditor(member: TeamMember) {
    setMessage("");
    setEditingMember(member);
    setEditedRole(member.role as Exclude<CrewRole, "store_manager">);
  }

  async function assignRole(memberId: string, nextRole: Exclude<CrewRole, "store_manager">) {
    setSaving(true);
    setMessage("");
    try {
      applyFeed(await crewApi.updateRole(memberId, nextRole));
      setAddRole(null);
      setSelectedMemberId("");
      setEditingMember(null);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Modification impossible.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="operations-page team-page">
      <header className="operations-heading">
        <div><p className="eyebrow">Rôles et accès</p><h1>Équipe.</h1></div>
      </header>

      {message && <p className="error" role="alert">{message}</p>}
      {addRole && <section className="team-add-panel"><div><p className="eyebrow">Ajouter un rôle</p><h2>Ajouter un {roleLabel[addRole]}.</h2><p>Choisis un profil Crew déjà inscrit.</p></div><label>Profil<select value={selectedMemberId} onChange={(event) => setSelectedMemberId(event.target.value)}>{crewMembers.map((member) => <option value={member.id} key={member.id}>{member.name}</option>)}</select></label><div className="team-panel-actions"><button className="primary" type="button" disabled={!selectedMemberId || saving} onClick={() => void assignRole(selectedMemberId, addRole)}>{saving ? "Enregistrement…" : "Ajouter"} <span>→</span></button><button type="button" disabled={saving} onClick={() => setAddRole(null)}>Annuler</button></div></section>}

      <div className="team-sections">
        <RoleSection title="Store Manager" members={members.filter((member) => member.role === "store_manager")} emptyLabel="Aucun Store Manager défini." />
        <RoleSection title="1er Assistant" members={members.filter((member) => member.role === "first_assistant")} addLabel={canEditEveryRole ? "Ajouter" : undefined} onAdd={() => openAdd("first_assistant")} onEdit={canEditEveryRole ? openEditor : undefined} emptyLabel="Aucun 1er Assistant pour le moment." />
        <RoleSection title="Managers" members={members.filter((member) => member.role === "manager")} addLabel={canManageTeam ? "Ajouter" : undefined} onAdd={canManageTeam ? () => openAdd("manager") : undefined} onEdit={canEditEveryRole ? openEditor : undefined} emptyLabel="Aucun Manager pour le moment." />
        <RoleSection title="Crew Trainers" members={members.filter((member) => member.role === "crew_trainer")} addLabel={canEditEveryRole ? "Ajouter" : undefined} onAdd={() => openAdd("crew_trainer")} onEdit={canEditEveryRole ? openEditor : undefined} emptyLabel="Aucun Crew Trainer pour le moment." />
        <RoleSection title="Crew" members={crewMembers} onEdit={canEditEveryRole ? openEditor : undefined} emptyLabel="Aucun profil Crew inscrit." />
      </div>

      {editingMember && <div className="operations-layer" role="presentation"><form className="task-sheet team-sheet" onSubmit={(event) => { event.preventDefault(); void assignRole(editingMember.id, editedRole); }}><button className="close" type="button" aria-label="Fermer" disabled={saving} onClick={() => setEditingMember(null)}>×</button><p className="eyebrow">Modifier le rôle</p><h2>{editingMember.name}</h2><label>Rôle<select value={editedRole} onChange={(event) => setEditedRole(event.target.value as Exclude<CrewRole, "store_manager">)}><option value="crew">Crew</option><option value="crew_trainer">Crew Trainer</option><option value="manager">Manager</option><option value="first_assistant">1er Assistant</option></select></label><div className="team-panel-actions"><button className="primary" type="submit" disabled={saving}>{saving ? "Enregistrement…" : "Enregistrer"} <span>→</span></button><button type="button" disabled={saving} onClick={() => setEditingMember(null)}>Annuler</button></div></form></div>}

      {history.length > 0 && <section className="role-history"><p className="eyebrow">Dernière activité</p><h2>Changements de rôle.</h2><ul>{history.map((change) => <li key={change.id}><span>{change.actorName} a défini {roleLabel[change.nextRole]} pour {change.memberName}.</span><small>{formatChangeTime(change.createdAt)}</small></li>)}</ul></section>}
    </section>
  );
}
