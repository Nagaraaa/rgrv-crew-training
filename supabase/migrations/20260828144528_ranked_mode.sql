alter table public.crew_profiles
  add column if not exists ranked_points integer not null default 100,
  add column if not exists ranked_matches integer not null default 0,
  add constraint crew_profiles_ranked_points_check check (ranked_points >= 0),
  add constraint crew_profiles_ranked_matches_check check (ranked_matches >= 0);

alter table public.quiz_attempts
  drop constraint if exists quiz_attempts_mode_check,
  add constraint quiz_attempts_mode_check
    check (mode = any (array['official'::text, 'training_plus'::text, 'final'::text, 'ranked'::text]));

create index if not exists crew_profiles_ranked_points_idx
  on public.crew_profiles (ranked_points desc)
  where ranked_matches > 0;
