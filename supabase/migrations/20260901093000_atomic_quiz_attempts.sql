-- Record a quiz attempt and update its profile under one row lock.
-- This prevents concurrent requests from overwriting XP, ranked points,
-- counters, or the daily XP cap.
create or replace function public.record_quiz_attempt(
  p_profile_id uuid,
  p_mode text,
  p_score integer,
  p_correct integer,
  p_total integer
)
returns jsonb
language plpgsql
set search_path = public
as $$
declare
  profile_row public.crew_profiles%rowtype;
  daily_attempts integer;
  v_xp_capped boolean;
  v_max_xp integer;
  v_xp_awarded integer;
  v_passed boolean;
  v_ranked_delta integer := 0;
  v_ranked_points integer;
  v_ranked_matches integer;
  v_xp integer;
begin
  if p_mode not in ('official', 'training_plus', 'final', 'ranked')
     or p_total <= 0
     or p_correct < 0
     or p_correct > p_total
     or p_score < 0
     or p_score > 100 then
    raise exception using message = 'Invalid quiz attempt', errcode = '22023';
  end if;

  select * into profile_row
  from public.crew_profiles
  where id = p_profile_id
  for update;

  if not found then
    raise exception using message = 'Profile not found', errcode = '22023';
  end if;

  select count(*)::integer into daily_attempts
  from public.quiz_attempts
  where profile_id = p_profile_id
    and created_at >= now() - interval '24 hours';

  v_xp_capped := daily_attempts >= 8;
  v_max_xp := case p_mode
    when 'final' then 150
    when 'official' then 120
    else 100
  end;
  v_xp_awarded := case
    when v_xp_capped then 0
    when p_mode = 'ranked' then greatest(5, p_correct * 3)
    else greatest(10, round((p_score / 100.0) * v_max_xp)::integer)
  end;
  v_passed := case
    when p_mode in ('final', 'official') then p_score >= 80
    else p_score >= 60
  end;
  v_ranked_delta := case
    when p_mode = 'ranked' then (p_correct * 2) - ((p_total - p_correct) * 2)
    else 0
  end;
  v_xp := profile_row.xp + v_xp_awarded;
  v_ranked_points := case
    when p_mode = 'ranked' then greatest(0, profile_row.ranked_points + v_ranked_delta)
    else profile_row.ranked_points
  end;
  v_ranked_matches := case
    when p_mode = 'ranked' then profile_row.ranked_matches + 1
    else profile_row.ranked_matches
  end;

  insert into public.quiz_attempts (
    profile_id, mode, score, correct_answers, total_questions, passed, xp_awarded
  ) values (
    p_profile_id, p_mode, p_score, p_correct, p_total, v_passed, v_xp_awarded
  );

  update public.crew_profiles
  set xp = v_xp,
      level = greatest(1, floor(v_xp / 250.0)::integer + 1),
      total_attempts = profile_row.total_attempts + 1,
      best_official = case when p_mode = 'official' then greatest(profile_row.best_official, p_score) else profile_row.best_official end,
      best_training = case when p_mode = 'training_plus' then greatest(profile_row.best_training, p_score) else profile_row.best_training end,
      passed_finals = case when p_mode = 'final' and v_passed then profile_row.passed_finals + 1 else profile_row.passed_finals end,
      perfect_runs = case when p_score = 100 then profile_row.perfect_runs + 1 else profile_row.perfect_runs end,
      ranked_points = v_ranked_points,
      ranked_matches = v_ranked_matches,
      updated_at = now()
  where id = p_profile_id;

  return jsonb_build_object(
    'profile_id', p_profile_id,
    'passed', v_passed,
    'xp_awarded', v_xp_awarded,
    'xp_capped', v_xp_capped,
    'ranked_delta', v_ranked_delta,
    'ranked_points', v_ranked_points
  );
end;
$$;

revoke execute on function public.record_quiz_attempt(uuid, text, integer, integer, integer) from public, anon, authenticated;
grant execute on function public.record_quiz_attempt(uuid, text, integer, integer, integer) to service_role;
