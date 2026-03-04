'use client';

import { useState } from 'react';
import { Settings } from '@/lib/types';

interface Props {
  settings: Settings;
  onSave: (settings: Settings) => void;
  onClose: () => void;
  onSendTestReminder: () => void;
}

export default function SettingsDrawer({ settings, onSave, onClose, onSendTestReminder }: Props) {
  const [email, setEmail] = useState(settings.email);
  const [frequency, setFrequency] = useState(settings.reminderFrequency);

  function handleSave() {
    onSave({ ...settings, email, reminderFrequency: frequency });
    onClose();
  }

  return (
    <>
      <div className="drawer-backdrop" onClick={onClose} />
      <div className="drawer-content">
        <div style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Settings</h2>
            <button onClick={onClose} className="task-action-btn" style={{ opacity: 1, width: 40, height: 40 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div>
            <label className="form-label">Email for Reminders</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="form-input"
            />
            <p style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: 8, fontWeight: 600 }}>
              Get a summary of tasks that need attention.
            </p>
          </div>

          <div>
            <label className="form-label">Reminder Frequency</label>
            <div style={{ display: 'flex', gap: 10 }}>
              {(['weekly', 'monthly'] as const).map((f) => {
                const selected = frequency === f;
                return (
                  <button
                    key={f}
                    onClick={() => setFrequency(f)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: 14,
                      border: `3px solid ${selected ? 'var(--accent)' : 'var(--border)'}`,
                      background: selected ? 'var(--accent-light)' : 'white',
                      fontWeight: selected ? 800 : 600,
                      fontSize: '0.95rem',
                      cursor: 'pointer',
                      textTransform: 'capitalize',
                      color: 'var(--fg)',
                      minHeight: 48,
                      fontFamily: 'inherit',
                      boxShadow: selected
                        ? '0 4px 0 rgba(26, 107, 82, 0.2)'
                        : '0 3px 0 rgba(0,0,0,0.04)',
                      transition: 'all 0.15s',
                      transform: selected ? 'translateY(-1px)' : 'none',
                    }}
                  >
                    {f}
                  </button>
                );
              })}
            </div>
          </div>

          <button onClick={onSendTestReminder} disabled={!email} className="btn-outline">
            Send Test Reminder
          </button>

          <button onClick={handleSave} className="btn-primary">
            Save Settings
          </button>
        </div>
      </div>
    </>
  );
}
