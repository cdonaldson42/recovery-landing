'use client';

import { useEffect, useState } from 'react';

const MESSAGES = [
  'Nice job, Oompapa!',
  'Way to go, Oompapa!',
  'Oompapa gets it done!',
  "Lookin' good, Oompapa!",
  "That's how it's done!",
  'Another one checked off!',
  'The house thanks you!',
  "Oompapa's on a roll!",
];

const FALL_EMOJIS = ['🏠', '🔧', '🛠️', '✅', '💪', '⭐', '🎉', '👏', '🏆', '🌲', '🛻', '🚙'];

const SPARKLE_EMOJIS = ['✨', '⭐', '🌟', '💫', '🔥', '💪', '🎯', '🏅'];

interface Props {
  onDone: () => void;
}

export default function Celebration({ onDone }: Props) {
  const [message] = useState(() => MESSAGES[Math.floor(Math.random() * MESSAGES.length)]);

  const [particles] = useState(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      emoji: FALL_EMOJIS[Math.floor(Math.random() * FALL_EMOJIS.length)],
      left: Math.random() * 100,
      delay: Math.random() * 0.5,
      size: 22 + Math.random() * 18,
      drift: -40 + Math.random() * 80,
    }))
  );

  const [sparkles] = useState(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      emoji: SPARKLE_EMOJIS[Math.floor(Math.random() * SPARKLE_EMOJIS.length)],
      left: 10 + Math.random() * 80,
      top: 10 + Math.random() * 80,
      delay: 0.2 + Math.random() * 0.8,
      size: 24 + Math.random() * 14,
    }))
  );

  useEffect(() => {
    const timer = setTimeout(onDone, 3200);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="celebration-overlay" onClick={onDone}>
      {/* Falling emoji particles */}
      {particles.map((p) => (
        <span
          key={p.id}
          className="celebration-particle"
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            fontSize: `${p.size}px`,
            '--drift': `${p.drift}px`,
          } as React.CSSProperties}
        >
          {p.emoji}
        </span>
      ))}

      {/* Sparkle bursts */}
      {sparkles.map((s) => (
        <span
          key={`sparkle-${s.id}`}
          className="sparkle-emoji"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            animationDelay: `${s.delay}s`,
            fontSize: `${s.size}px`,
          }}
        >
          {s.emoji}
        </span>
      ))}

      {/* Message */}
      <div className="celebration-message">
        <div className="celebration-check">✓</div>
        <h2 className="celebration-text">{message}</h2>
        <p className="celebration-sub">Tap anywhere to continue</p>
      </div>
    </div>
  );
}
