export type CrewRole = "crew" | "crew_trainer" | "manager" | "first_assistant" | "store_manager";

export const roleLabel: Record<CrewRole, string> = {
  crew: "Crew",
  crew_trainer: "Crew Trainer",
  manager: "Manager",
  first_assistant: "1er Assistant",
  store_manager: "Store Manager",
};
