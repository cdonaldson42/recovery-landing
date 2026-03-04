'use client';

import { useState } from 'react';
import { Task, GROUP_ICONS, GROUP_DESCRIPTIONS, GROUP_COLORS } from '@/lib/types';
import { isTaskDone } from '@/lib/reminders';

interface Props {
  group: string;
  tasks: Task[];
  defaultOpen?: boolean;
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function GroupSection({ group, tasks, defaultOpen, onToggleComplete, onEdit, onDelete }: Props) {
  const [open, setOpen] = useState(defaultOpen ?? false);
  const icon = GROUP_ICONS[group] || '📋';
  const desc = GROUP_DESCRIPTIONS[group] || '';
  const colors = GROUP_COLORS[group] || { bg: '#f3f4f6', border: '#9ca3af', accent: '#6b7280', light: '#f9fafb' };
  const doneCount = tasks.filter((t) => isTaskDone(t)).length;
  const totalCount = tasks.length;
  const allDone = doneCount === totalCount;

  const sorted = [...tasks].sort((a, b) => {
    const aDone = isTaskDone(a) ? 1 : 0;
    const bDone = isTaskDone(b) ? 1 : 0;
    return aDone - bDone;
  });

  return (
    <div
      className="group-card"
      style={{
        borderColor: open ? colors.border : undefined,
      }}
    >
      <button className="group-header" onClick={() => setOpen(!open)}>
        <div
          className="group-icon"
          style={{
            background: colors.bg,
            borderColor: colors.border,
          }}
        >
          {icon}
        </div>
        <div className="group-info">
          <div className="group-name">{group}</div>
          {desc && <div className="group-desc">{desc}</div>}
        </div>
        <span
          className={`group-badge ${allDone ? 'group-badge-done' : 'group-badge-pending'}`}
        >
          {doneCount}/{totalCount}
        </span>
        <svg
          className={`group-chevron ${open ? 'group-chevron-open' : ''}`}
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div className="group-body">
          {sorted.map((task) => {
            const done = isTaskDone(task);
            return (
              <div key={task.id} className="task-row">
                <button
                  className={`task-check ${done ? 'task-check-done' : ''}`}
                  onClick={() => onToggleComplete(task.id)}
                  aria-label={`Mark "${task.name}" as ${done ? 'not done' : 'done'}`}
                >
                  {done ? '✓' : ''}
                </button>

                <div className="task-content">
                  <div className={`task-name ${done ? 'task-name-done' : ''}`}>
                    {task.name}
                  </div>
                  {task.notes && <div className="task-note">{task.notes}</div>}
                  {task.lastCompleted && done && (
                    <div className="task-done-date">Done {formatDate(task.lastCompleted)}</div>
                  )}
                </div>

                <div className="task-actions">
                  <button
                    className="task-action-btn"
                    onClick={() => onEdit(task)}
                    aria-label="Edit"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                  <button
                    className="task-action-btn task-action-btn-delete"
                    onClick={() => onDelete(task.id)}
                    aria-label="Delete"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
