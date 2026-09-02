-- Rebuild ranked totals from the immutable quiz attempt history.
-- Existing ranked profiles are restored to the visible crew leaderboard.
with recursive ranked_attempts as (
  select
    profile_id,
    row_number() over (partition by profile_id order by created_at, id) as match_number,
    (correct_answers * 2) - ((total_questions - correct_answers) * 2) as points_delta
  from public.quiz_attempts
  where mode = 'ranked'
), replayed_points as (
  select
    profile_id,
    match_number,
    greatest(0, points_delta) as ranked_points
  from ranked_attempts
  where match_number = 1

  union all

  select
    next_attempt.profile_id,
    next_attempt.match_number,
    greatest(0, replayed_points.ranked_points + next_attempt.points_delta) as ranked_points
  from replayed_points
  join ranked_attempts as next_attempt
    on next_attempt.profile_id = replayed_points.profile_id
   and next_attempt.match_number = replayed_points.match_number + 1
), ranked_totals as (
  select distinct on (profile_id)
    profile_id,
    match_number as ranked_matches,
    ranked_points
  from replayed_points
  order by profile_id, match_number desc
)
update public.crew_profiles as profile
set ranked_points = totals.ranked_points,
    ranked_matches = totals.ranked_matches,
    leaderboard_opt_in = true,
    updated_at = now()
from ranked_totals as totals
where profile.id = totals.profile_id;
