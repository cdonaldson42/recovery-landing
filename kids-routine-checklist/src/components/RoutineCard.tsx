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
        block p-5 rounded-3xl bg-gradient-to-br ${meta.gradient}
        border-2 ${allDone ? "border-green-400" : "border-transparent"}
        hover:shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]
      `}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-3xl">{meta.emoji}</span>
          <h2 className="text-xl font-bold dark:text-white">{meta.title}</h2>
        </div>
        {streak > 0 && (
          <span className="text-sm font-bold bg-[rgba(255,255,255,0.7)] dark:bg-[rgba(0,0,0,0.3)] px-2 py-1 rounded-full">
            🔥 {streak}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
        <span>
          {completed}/{total} tasks {allDone ? "✅" : ""}
        </span>
        <span className="font-semibold">{pct}%</span>
      </div>

      <div className="w-full h-2.5 bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(0,0,0,0.2)] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </Link>
  );
}
