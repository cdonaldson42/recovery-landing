'use client';

import { useState, useEffect, useCallback } from 'react';
import { Task, Settings, GROUPS } from '@/lib/types';
import { loadTasks, saveTasks, loadSettings, saveSettings } from '@/lib/storage';
import { shouldSendReminder, getOverdueTasks, isTaskDone } from '@/lib/reminders';
import GroupSection from '@/components/GroupSection';
import TaskModal from '@/components/TaskModal';
import SettingsDrawer from '@/components/SettingsDrawer';
import Celebration from '@/components/Celebration';

export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [settings, setSettings] = useState<Settings>({ email: '', reminderFrequency: 'weekly' });
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    setTasks(loadTasks());
    setSettings(loadSettings());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    if (shouldSendReminder(settings)) {
      const overdue = getOverdueTasks(tasks);
      if (overdue.length > 0) sendReminder(tasks, settings);
    }
  }, [loaded, settings, tasks]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  async function sendReminder(taskList: Task[], s: Settings) {
    if (!s.email) return;
    try {
      const res = await fetch('/api/send-reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tasks: taskList, email: s.email }),
      });
      if (res.ok) {
        const updated = { ...s, lastReminderSent: new Date().toISOString() };
        setSettings(updated);
        saveSettings(updated);
        showToast('Reminder email sent!');
      }
    } catch { /* silently fail */ }
  }

  function handleSaveTask(task: Task) {
    const existing = tasks.find((t) => t.id === task.id);
    const updated = existing
      ? tasks.map((t) => (t.id === task.id ? task : t))
      : [...tasks, task];
    setTasks(updated);
    saveTasks(updated);
    setShowModal(false);
    setEditingTask(null);
    showToast(existing ? 'Task updated' : 'Task added');
  }

  function handleToggleComplete(id: string) {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    const alreadyDone = isTaskDone(task);
    const updated = tasks.map((t) =>
      t.id === id ? { ...t, lastCompleted: alreadyDone ? undefined : new Date().toISOString() } : t
    );
    setTasks(updated);
    saveTasks(updated);
    if (!alreadyDone) setShowCelebration(true);
  }

  function handleDelete(id: string) {
    setConfirmDelete(id);
  }

  function confirmDeleteTask() {
    if (!confirmDelete) return;
    const updated = tasks.filter((t) => t.id !== confirmDelete);
    setTasks(updated);
    saveTasks(updated);
    setConfirmDelete(null);
    showToast('Task deleted');
  }

  function handleEdit(task: Task) {
    setEditingTask(task);
    setShowModal(true);
  }

  function handleSaveSettings(s: Settings) {
    setSettings(s);
    saveSettings(s);
    showToast('Settings saved');
  }

  // Build group data
  const allGroups = [...GROUPS, ...new Set(tasks.map((t) => t.group).filter((g) => !(GROUPS as readonly string[]).includes(g)))];
  const groupedTasks = allGroups
    .map((g) => ({ group: g, tasks: tasks.filter((t) => t.group === g) }))
    .filter((g) => g.tasks.length > 0);

  const totalDone = tasks.filter((t) => isTaskDone(t)).length;
  const pct = tasks.length > 0 ? Math.round((totalDone / tasks.length) * 100) : 0;

  if (!loaded) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100dvh', color: 'var(--muted)', fontWeight: 700, fontSize: '1.1rem' }}>
        Loading...
      </div>
    );
  }

  return (
    <>
      {/* Dot pattern background */}
      <div className="bg-dots" />

      {/* Header */}
      <header className="app-header">
        <div className="app-header-inner">
          <div className="header-icon">🏠</div>
          <h1 className="header-title">Oompapa&apos;s Place</h1>
          <p className="header-subtitle">
            {totalDone} of {tasks.length} tasks done
          </p>
          <div className="header-progress">
            <div className="progress-track">
              <div
                className={`progress-fill ${pct > 0 && pct < 100 ? 'progress-fill-glow' : ''}`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="progress-label">{pct}%</span>
          </div>
        </div>

        <button
          onClick={() => setShowSettings(true)}
          className="settings-btn"
          aria-label="Settings"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>
      </header>

      {/* Main content */}
      <div className="app-shell" style={{ paddingTop: 20 }}>
        {groupedTasks.map((g, i) => (
          <GroupSection
            key={g.group}
            group={g.group}
            tasks={g.tasks}
            defaultOpen={i === 0}
            onToggleComplete={handleToggleComplete}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}

        {groupedTasks.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🏠</div>
            <p className="empty-title">No tasks yet</p>
            <p className="empty-sub">Tap + to add your first task</p>
          </div>
        )}
      </div>

      {/* Add button */}
      <button className="fab" onClick={() => { setEditingTask(null); setShowModal(true); }}>+</button>

      {/* Modal */}
      {showModal && (
        <TaskModal
          task={editingTask}
          onSave={handleSaveTask}
          onClose={() => { setShowModal(false); setEditingTask(null); }}
        />
      )}

      {/* Settings */}
      {showSettings && (
        <SettingsDrawer
          settings={settings}
          onSave={handleSaveSettings}
          onClose={() => setShowSettings(false)}
          onSendTestReminder={() => sendReminder(tasks, settings)}
        />
      )}

      {/* Celebration */}
      {showCelebration && <Celebration onDone={() => setShowCelebration(false)} />}

      {/* Delete confirmation */}
      {confirmDelete && (
        <>
          <div className="modal-backdrop" onClick={() => setConfirmDelete(null)} />
          <div className="confirm-dialog">
            <h3 className="confirm-title">Delete Task?</h3>
            <p className="confirm-text">
              This will permanently remove this task.
            </p>
            <div className="confirm-actions">
              <button onClick={() => setConfirmDelete(null)} className="confirm-cancel">
                Cancel
              </button>
              <button onClick={confirmDeleteTask} className="confirm-delete">
                Delete
              </button>
            </div>
          </div>
        </>
      )}

      {/* Toast */}
      {toast && <div className="toast">{toast}</div>}
    </>
  );
}
