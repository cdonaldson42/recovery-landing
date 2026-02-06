"use client";

import { KidId } from "@/lib/types";

interface KidToggleProps {
  activeKid: KidId;
  onToggle: (kidId: KidId) => void;
}

export default function KidToggle({ activeKid, onToggle }: KidToggleProps) {
  return (
    <div className="flex bg-gray-200 dark:bg-gray-700 rounded-full p-1 w-fit">
      <button
        onClick={() => onToggle("kid1")}
        className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all cursor-pointer ${
          activeKid === "kid1"
            ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm"
            : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
        }`}
      >
        Kid 1
      </button>
      <button
        onClick={() => onToggle("kid2")}
        className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all cursor-pointer ${
          activeKid === "kid2"
            ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm"
            : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
        }`}
      >
        Kid 2
      </button>
    </div>
  );
}
