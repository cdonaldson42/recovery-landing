import { Task, AppState } from "./types";

export const DEFAULT_MORNING_TASKS: Task[] = [
  { id: "morning-1", label: "Get Dressed", order: 1 },
  { id: "morning-2", label: "Eat Breakfast", order: 2 },
  { id: "morning-3", label: "Brush Teeth", order: 3 },
  { id: "morning-4", label: "Pack Backpack", order: 4 },
  { id: "morning-5", label: "Put on Shoes", order: 5 },
];

export const DEFAULT_BEDTIME_TASKS: Task[] = [
  { id: "bedtime-1", label: "Put on Pajamas", order: 1 },
  { id: "bedtime-2", label: "Go to Bathroom", order: 2 },
  { id: "bedtime-3", label: "Brush Teeth", order: 3 },
  { id: "bedtime-4", label: "Read Books", order: 4 },
];

export const DEFAULT_STATE: AppState = {
  routines: {
    morning: DEFAULT_MORNING_TASKS,
    bedtime: DEFAULT_BEDTIME_TASKS,
  },
  history: {},
  settings: {
    darkMode: false,
    activeKid: "kid1",
  },
  kids: [],
};
