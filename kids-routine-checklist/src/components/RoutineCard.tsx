"use client";

import Link from "next/link";
import { RoutineType, Task, RoutineCompletion } from "@/lib/types";

interface RoutineCardProps {
  type: RoutineType;
  tasks: Task[];
  completion: RoutineCompletion;
  streak: number;
}

const ROUTINE_META: Record<RoutineType, { emoji: string; title: string; gradient: string }> = {
  morning: {
    emoji: "☀️",
    title: "Morning Routine",
    gradient: "from-amber-100 to-orange-100 dark:from-[rgba(69,26,3,0.4)] dark:to-[rgba(67,20,7,0.4)]",
  },
  bedtime: {
    emoji: "🌙",
    title: "Evening Routine",
    gradient: "from-indigo-100 to-purple-100 dark:from-[rgba(30,26,77,0.4)] dark:to-[rgba(60,3,102,0.4)]",
  },
};

export default function RoutineCard({ type, tasks, completion, streak }: RoutineCardProps) {
  const meta = ROUTINE_META[type];
  const completed = completion.completed.length;
  const total = tasks.length;
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);
  const allDone = completed === total;

  const barColor =
    pct < 40
      ? "bg-amber-400"
      : pct < 70
        ? "bg-yellow-400"
        : pct < 100
          ? "bg-lime-400"
          : "bg-green-400";

  return (
    <Link
      href={`/routine/${type}`}
      className={`
        group block p-6 rounded-[2rem] bg-gradient-to-br ${meta.gradient}
        border-4 ${allDone ? "border-green-400" : "border-[color-mix(in_srgb,var(--accent)_30%,transparent)]"}
        shadow-[0_6px_0_rgba(0,0,0,0.12)] hover:shadow-[0_6px_0_rgba(0,0,0,0.18)]
        active:translate-y-1 active:shadow-[0_2px_0_rgba(0,0,0,0.12)]
        transition-all duration-200 hover:scale-[1.02]
      `}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-5xl group-hover:animate-wobble">{meta.emoji}</span>
          <h2 className="text-2xl font-extrabold dark:text-white">{meta.title}</h2>
        </div>
        {streak > 0 && (
          <span className="text-sm font-black bg-[rgba(255,255,255,0.7)] dark:bg-[rgba(0,0,0,0.3)] px-3 py-1.5 rounded-full">
            🔥 {streak}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between text-sm font-bold text-gray-600 dark:text-gray-300 mb-2">
        <span>
          {completed}/{total} tasks {allDone ? "✅" : ""}
        </span>
        <span className="font-extrabold">{pct}%</span>
      </div>

      <div className="w-full h-4 bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(0,0,0,0.2)] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </Link>
  );
}
