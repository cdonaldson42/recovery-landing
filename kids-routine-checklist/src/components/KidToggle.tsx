"use client";

import { Kid } from "@/lib/types";
import { ANIMALS, THEMES } from "@/lib/constants";

interface KidToggleProps {
  kids: Kid[];
  activeKid: string;
  onToggle: (kidId: string) => void;
}

export default function KidToggle({ kids, activeKid, onToggle }: KidToggleProps) {
  return (
    <div className="flex gap-2 w-fit">
      {kids.map((kid) => {
        const animal = ANIMALS[kid.animal];
        const theme = THEMES[kid.theme];
        const isActive = activeKid === kid.id;
        return (
          <button
            key={kid.id}
            onClick={() => onToggle(kid.id)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all cursor-pointer ${
              isActive
                ? theme.activeClasses
                : `text-gray-500 dark:text-gray-400 border-2 border-transparent ${theme.inactiveHoverColor}`
            }`}
          >
            {animal.emoji} {kid.name}
          </button>
        );
      })}
    </div>
  );
}
