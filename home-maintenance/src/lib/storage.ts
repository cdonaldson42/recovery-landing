import { Task, Settings } from './types';
import { DEFAULT_TASKS } from './defaults';

const TASKS_KEY = 'home-maint-v3-tasks';
const SETTINGS_KEY = 'home-maint-v3-settings';

export function loadTasks(): Task[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(TASKS_KEY);
  if (!stored) {
    saveTasks(DEFAULT_TASKS);
    return DEFAULT_TASKS;
  }
  return JSON.parse(stored);
}

export function saveTasks(tasks: Task[]): void {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

export function loadSettings(): Settings {
  if (typeof window === 'undefined') return { email: '', reminderFrequency: 'weekly' };
  const stored = localStorage.getItem(SETTINGS_KEY);
  if (!stored) return { email: '', reminderFrequency: 'weekly' };
  return JSON.parse(stored);
}

export function saveSettings(settings: Settings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
