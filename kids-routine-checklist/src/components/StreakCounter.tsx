"use client";

interface StreakCounterProps {
  streak: number;
  label: string;
}

export default function StreakCounter({ streak, label }: StreakCounterProps) {
  return (
    <div className="flex flex-col items-center flex-1">
      <span className={`text-4xl ${streak > 0 ? "animate-fire-flicker" : ""}`}>
        {streak > 0 ? "🔥" : "💤"}
      </span>
      <div className="text-5xl font-black dark:text-white leading-tight">
        {streak}
      </div>
      <div className="text-sm font-bold text-gray-500 dark:text-gray-400">
        day{streak !== 1 ? "s" : ""}
      </div>
      <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 mt-0.5">{label}</div>
    </div>
  );
}
