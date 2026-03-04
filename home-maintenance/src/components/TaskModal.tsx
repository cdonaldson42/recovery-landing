'use client';

import { useState } from 'react';
import { Task, GROUPS, GROUP_ICONS, GROUP_COLORS } from '@/lib/types';

interface Props {
  task?: Task | null;
  defaultGroup?: string;
  onSave: (task: Task) => void;
  onClose: () => void;
}

export default function TaskModal({ task, defaultGroup, onSave, onClose }: Props) {
  const isEdit = !!task;
  const [name, setName] = useState(task?.name ?? '');
  const [group, setGroup] = useState(task?.group ?? defaultGroup ?? GROUPS[0]);
  const [notes, setNotes] = useState(task?.notes ?? '');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      id: task?.id ?? String(Date.now()),
      name: name.trim(),
      group,
      notes: notes.trim() || undefined,
      lastCompleted: task?.lastCompleted,
      reminderEnabled: true,
      createdAt: task?.createdAt ?? new Date().toISOString(),
    });
  }

  return (
    <>
      <div className="modal-backdrop" onClick={onClose} />
      <div className="modal-content">
        <form onSubmit={handleSubmit} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>{isEdit ? 'Edit Task' : 'Add a Task'}</h2>
            <button
              type="button"
              onClick={onClose}
              className="task-action-btn"
              style={{ opacity: 1, width: 40, height: 40 }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div>
            <label className="form-label">What needs doing?</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Check furnace filter"
              className="form-input"
              autoFocus
              required
            />
          </div>

          <div>
            <label className="form-label">Where / What?</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {GROUPS.map((g) => {
                const colors = GROUP_COLORS[g] || { bg: '#f3f4f6', border: '#9ca3af', accent: '#6b7280', light: '#f9fafb' };
                const selected = group === g;
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGroup(g)}
                    style={{
                      padding: '12px 14px',
                      borderRadius: 14,
                      border: `3px solid ${selected ? colors.border : 'var(--border)'}`,
                      background: selected ? colors.bg : 'white',
                      color: 'var(--fg)',
                      fontWeight: selected ? 800 : 600,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      textAlign: 'left',
                      minHeight: 48,
                      fontFamily: 'inherit',
                      boxShadow: selected
                        ? `0 4px 0 ${colors.border}40`
                        : '0 3px 0 rgba(0,0,0,0.04)',
                      transition: 'all 0.15s',
                      transform: selected ? 'translateY(-1px)' : 'none',
                    }}
                  >
                    <span style={{ fontSize: '1.2rem' }}>{GROUP_ICONS[g]}</span>
                    {g}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="form-label">Notes (optional)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any helpful details..."
              className="form-input"
            />
          </div>

          <button
            type="submit"
            disabled={!name.trim()}
            className="btn-primary"
          >
            {isEdit ? 'Save Changes' : 'Add Task'}
          </button>
        </form>
      </div>
    </>
  );
}
