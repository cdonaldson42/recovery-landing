import { Task, Settings } from './types';

export function isTaskDone(task: Task): boolean {
  if (!task.lastCompleted) return false;
  const d = new Date(task.lastCompleted);
  const now = new Date();
  const daysSince = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
  return daysSince < 90; // consider "done" if completed in last ~3 months
}

export function getOverdueTasks(tasks: Task[]): Task[] {
  return tasks.filter((t) => !isTaskDone(t));
}

export function shouldSendReminder(settings: Settings): boolean {
  if (!settings.email) return false;
  if (!settings.lastReminderSent) return true;
  const last = new Date(settings.lastReminderSent);
  const now = new Date();
  const daysSince = Math.floor((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
  if (settings.reminderFrequency === 'weekly') return daysSince >= 7;
  return daysSince >= 30;
}
