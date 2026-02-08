import { Task, AppState } from "./types";
import { DEFAULT_KIDS } from "./constants";

export const DEFAULT_MORNING_TASKS: Task[] = [
  { id: "morning-1", label: "Get Dressed", order: 1 },
  { id: "morning-2", label: "Eat Breakfast", order: 2 },
  { id: "morning-3", label: "Feed Fish", order: 3 },
  { id: "morning-4", label: "Pack backpack", order: 4 },
  { id: "morning-5", label: "Put on shoes and coat", order: 5 },
];

export const DEFAULT_BEDTIME_TASKS: Task[] = [
  { id: "bedtime-1", label: "Do Homework", order: 1 },
  { id: "bedtime-2", label: "Practice Piano", order: 2 },
  { id: "bedtime-3", label: "Put on Pajamas", order: 3 },
  { id: "bedtime-4", label: "Go to Bathroom", order: 4 },
  { id: "bedtime-5", label: "Brush Teeth", order: 5 },
  { id: "bedtime-6", label: "Read Books", order: 6 },
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
  kids: DEFAULT_KIDS,
};
