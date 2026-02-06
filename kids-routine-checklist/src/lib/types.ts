export type KidId = "kid1" | "kid2";

export const KID_NAMES: Record<KidId, string> = {
  kid1: "Abram",
  kid2: "Ezra",
};

export interface Task {
  id: string;
  label: string;
  order: number;
}

export interface RoutineCompletion {
  completed: string[];
  completedAt?: string;
}

export interface KidDayRecord {
  morning: RoutineCompletion;
  bedtime: RoutineCompletion;
}

export interface DayRecord {
  kid1: KidDayRecord;
  kid2: KidDayRecord;
}

export interface Settings {
  darkMode: boolean;
  activeKid: KidId;
}

export interface AppState {
  routines: {
    morning: Task[];
    bedtime: Task[];
  };
  history: Record<string, DayRecord>;
  settings: Settings;
}

export type RoutineType = "morning" | "bedtime";
