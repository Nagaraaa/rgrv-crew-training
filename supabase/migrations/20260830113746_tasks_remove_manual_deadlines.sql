-- Une tâche opérationnelle n'a pas d'échéance arbitraire : sa chronologie
-- repose sur sa création et, une fois clôturée, sur sa finalisation.
alter table public.crew_tasks
  alter column due_at drop not null;

drop index if exists public.crew_tasks_status_due_at_idx;
create index if not exists crew_tasks_status_created_at_idx
  on public.crew_tasks(status, created_at desc);
