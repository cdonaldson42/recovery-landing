"use client";

import { useEffect, useState, useRef } from "react";
import { getTodayTheme, getRandomThemeAnimal } from "@/lib/dailyTheme";

const CELEBRATION_ANIMATIONS = [
  "animate-charge-across",
  "animate-fly-across",
  "animate-bounce-jump",
  "animate-cheer-spin",
  "animate-dragon-fire",
  "animate-eagle-soar",
  "animate-chill-waddle",
  "animate-tumble-roll",
  "animate-climb-wave",
  "animate-scuttle-snap",
  "animate-jaw-charge",
  "animate-cute-rappel",
];

function pickRandomAnimation(): string {
  return CELEBRATION_ANIMATIONS[Math.floor(Math.random() * CELEBRATION_ANIMATIONS.length)];
}

interface CelebrationProps {
  fire: boolean;
}

interface AnimalScene {
  emojis: [string, string, string];
  animation: string;
  label: string;
}

export default function Celebration({ fire }: CelebrationProps) {
  const [scene, setScene] = useState<AnimalScene | null>(null);
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number; delay: number; emoji: string }[]>([]);
  const firedRef = useRef(false);

  useEffect(() => {
    if (fire && !firedRef.current) {
      firedRef.current = true;
      const theme = getTodayTheme();
      setScene({
        emojis: [getRandomThemeAnimal(), getRandomThemeAnimal(), getRandomThemeAnimal()],
        animation: pickRandomAnimation(),
        label: `${theme.icon} ${theme.name} celebration!`,
      });

      // Spawn random sparkle emojis
      const celebrationEmojis = ["⭐", "✨", "💫", "🌟", "🎉", "🎊", "💥", "🔥", "❤️", "💜", "💚", "💛", "🧡"];
      const newSparkles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 1.5,
        emoji: celebrationEmojis[Math.floor(Math.random() * celebrationEmojis.length)],
      }));
      setSparkles(newSparkles);

      // Clean up after animation
      setTimeout(() => {
        setScene(null);
        setSparkles([]);
      }, 4000);
    }

    if (!fire) {
      firedRef.current = false;
    }
  }, [fire]);

  if (!scene) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
      {/* Background flash */}
      <div className="absolute inset-0 animate-celebration-flash" />

      {/* Main animal */}
      <div className={`absolute text-[100px] ${scene.animation}`}>
        {scene.emojis[0]}
      </div>

      {/* Second animal trailing behind (slightly smaller) */}
      <div className={`absolute text-[70px] ${scene.animation}`} style={{ animationDelay: "0.3s" }}>
        {scene.emojis[1]}
      </div>

      {/* Third tiny one */}
      <div className={`absolute text-[50px] ${scene.animation}`} style={{ animationDelay: "0.6s" }}>
        {scene.emojis[2]}
      </div>

      {/* Sparkle explosion */}
      {sparkles.map((s) => (
        <div
          key={s.id}
          className="absolute text-3xl animate-sparkle-burst"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            animationDelay: `${s.delay}s`,
          }}
        >
          {s.emoji}
        </div>
      ))}

      {/* Big shaking celebration text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="animate-mega-pop text-center">
          <div className="text-[80px] animate-wiggle-shake">{scene.emojis[0]}</div>
          <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 animate-wiggle-shake mt-2">
            {scene.label}
          </div>
        </div>
      </div>
    </div>
  );
}
