alter table public.crew_profiles
  add column if not exists first_name text,
  add column if not exists last_name text,
  add column if not exists identity_normalized text,
  add column if not exists pin_salt text,
  add column if not exists pin_hash text;

create unique index if not exists crew_profiles_identity_normalized_key
  on public.crew_profiles (identity_normalized)
  where identity_normalized is not null;

create index if not exists user_achievements_achievement_code_idx
  on public.user_achievements (achievement_code);

alter table public.crew_profiles
  drop constraint if exists crew_profiles_first_name_length,
  add constraint crew_profiles_first_name_length
    check (first_name is null or char_length(first_name) between 2 and 40),
  drop constraint if exists crew_profiles_last_name_length,
  add constraint crew_profiles_last_name_length
    check (last_name is null or char_length(last_name) between 2 and 60);
