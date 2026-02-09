export type ColorTheme = "blue" | "green" | "purple" | "orange" | "pink";

export type AnimalId =
  | "tiger" | "unicorn" | "hamster" | "chameleon" | "dragon"
  | "rhino" | "eagle" | "capybara" | "panda" | "koala"
  | "scorpion" | "crocodile" | "spider"
  | "crab" | "shark" | "chipmunk" | "squirrel";

export interface Kid {
  id: string;
  name: string;
  animal: AnimalId;
  theme: ColorTheme;
}

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

export type DayRecord = Record<string, KidDayRecord>;

export interface Settings {
  darkMode: boolean;
  activeKid: string;
}

export interface AppState {
  routines: {
    morning: Task[];
    bedtime: Task[];
  };
  history: Record<string, DayRecord>;
  settings: Settings;
  kids: Kid[];
}

export type RoutineType = "morning" | "bedtime";
