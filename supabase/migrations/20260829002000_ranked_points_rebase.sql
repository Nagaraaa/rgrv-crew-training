-- The former ranked rollout granted a 100-point initial balance. Replay every
-- recorded match from zero so the existing performances are retained under the
-- current Bronze-at-0 rule, including the non-negative floor after each match.
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
), final_points as (
  select distinct on (profile_id) profile_id, ranked_points
  from replayed_points
  order by profile_id, match_number desc
)
update public.crew_profiles as profile
set ranked_points = final_points.ranked_points
from final_points
where profile.id = final_points.profile_id;

update public.crew_profiles
set ranked_points = 0
where ranked_matches = 0;
