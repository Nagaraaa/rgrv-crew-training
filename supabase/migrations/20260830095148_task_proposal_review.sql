-- Proposal review stays reserved for management roles. The one Crew exception
-- is a temporary, explicit test flag and is not inferred from a display name.
alter table public.crew_profiles
  add column if not exists can_review_task_proposals boolean not null default false;

update public.crew_profiles
set can_review_task_proposals = true
where id = '4dc311ad-d9fd-48c5-973c-1a7adfd50432';

alter table public.crew_tasks
  add column if not exists rejected_by uuid references public.crew_profiles(id) on delete set null,
  add column if not exists rejected_at timestamptz;

alter table public.crew_tasks
  drop constraint if exists crew_tasks_status_check,
  add constraint crew_tasks_status_check
    check (status in ('pending', 'todo', 'doing', 'done', 'rejected'));

alter table public.task_events
  drop constraint if exists task_events_action_check,
  add constraint task_events_action_check
    check (action in ('created', 'approved', 'rejected', 'taken', 'completed', 'role_changed', 'category_created'));
