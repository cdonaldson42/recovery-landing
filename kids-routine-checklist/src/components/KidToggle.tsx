"use client";

import { Kid } from "@/lib/types";
import { ANIMALS, THEMES } from "@/lib/constants";

interface KidToggleProps {
  kids: Kid[];
  activeKid: string;
  onToggle: (kidId: string) => void;
  compact?: boolean;
}

export default function KidToggle({ kids, activeKid, onToggle, compact }: KidToggleProps) {
  const activeKidObj = kids.find((k) => k.id === activeKid);

  // Compact: just pill-shaped toggle buttons, no hero
  if (compact) {
    return (
      <div className="flex gap-1.5 justify-center">
        {kids.map((kid) => {
          const animal = ANIMALS[kid.animal];
          const isActive = activeKid === kid.id;
          return (
            <button
              key={kid.id}
              onClick={() => onToggle(kid.id)}
              className={`
                flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer
                ${
                  isActive
                    ? "bg-[var(--accent-soft)] text-[var(--accent)] border-2 border-[var(--accent)]"
                    : "bg-[var(--surface-dim)] text-gray-500 dark:text-gray-400 border-2 border-transparent hover:border-[var(--accent)]"
                }
              `}
            >
              <span className="text-base">{animal.emoji}</span>
              <span>{kid.name}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // Full: hero avatar only (no toggle buttons — those live in the sticky compact version)
  return (
    <div className="flex flex-col items-center">
      {activeKidObj && (
        <div className="flex flex-col items-center animate-bounce-in" key={activeKidObj.id}>
          <span className="text-[80px] leading-none">{ANIMALS[activeKidObj.animal].emoji}</span>
          <span className="text-2xl font-black dark:text-white mt-1">{activeKidObj.name}</span>
        </div>
      )}
    </div>
  );
}
