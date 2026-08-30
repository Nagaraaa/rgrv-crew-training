-- Debug access is an explicit server-side flag, never inferred from a name.
alter table public.crew_profiles
  add column if not exists can_debug_roles boolean not null default false;

update public.crew_profiles
set can_debug_roles = true
where id = '4dc311ad-d9fd-48c5-973c-1a7adfd50432';

-- Cover the task relations used by the operations history and future filters.
create index if not exists crew_tasks_created_by_idx on public.crew_tasks(created_by);
create index if not exists crew_tasks_taken_by_idx on public.crew_tasks(taken_by);
create index if not exists crew_tasks_approved_by_idx on public.crew_tasks(approved_by);
create index if not exists crew_tasks_completed_by_idx on public.crew_tasks(completed_by);
create index if not exists crew_tasks_rejected_by_idx on public.crew_tasks(rejected_by);
create index if not exists crew_tasks_category_id_idx on public.crew_tasks(category_id);
create index if not exists task_categories_created_by_idx on public.task_categories(created_by);
create index if not exists task_events_actor_id_idx on public.task_events(actor_id);
