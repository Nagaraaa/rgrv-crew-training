-- New accounts start in Bronze at 0 points.
alter table public.crew_profiles
  alter column ranked_points set default 0;

-- Profiles that have never played ranked are moved from the old 100-point
-- starting value to the new zero-point starting value. Existing ranked
-- results remain untouched.
update public.crew_profiles
set ranked_points = 0
where ranked_matches = 0;
