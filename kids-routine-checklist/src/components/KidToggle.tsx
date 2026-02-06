"use client";

import { KidId, KID_NAMES } from "@/lib/types";

interface KidToggleProps {
  activeKid: KidId;
  onToggle: (kidId: KidId) => void;
}

const KID_THEMES: Record<KidId, { emoji: string; active: string; inactive: string }> = {
  kid1: {
    emoji: "🐅",
    active:
      "bg-blue-100 dark:bg-[rgba(30,64,175,0.35)] text-blue-700 dark:text-blue-300 border-2 border-blue-400 dark:border-blue-500 shadow-sm",
    inactive:
      "text-gray-500 dark:text-gray-400 border-2 border-transparent hover:text-blue-500 dark:hover:text-blue-400",
  },
  kid2: {
    emoji: "🐊",
    active:
      "bg-emerald-100 dark:bg-[rgba(6,95,70,0.35)] text-emerald-700 dark:text-emerald-300 border-2 border-emerald-400 dark:border-emerald-500 shadow-sm",
    inactive:
      "text-gray-500 dark:text-gray-400 border-2 border-transparent hover:text-emerald-500 dark:hover:text-emerald-400",
  },
};

export default function KidToggle({ activeKid, onToggle }: KidToggleProps) {
  return (
    <div className="flex gap-2 w-fit">
      {(["kid1", "kid2"] as const).map((kid) => {
        const theme = KID_THEMES[kid];
        const isActive = activeKid === kid;
        return (
          <button
            key={kid}
            onClick={() => onToggle(kid)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all cursor-pointer ${
              isActive ? theme.active : theme.inactive
            }`}
          >
            {theme.emoji} {KID_NAMES[kid]}
          </button>
        );
      })}
    </div>
  );
}
