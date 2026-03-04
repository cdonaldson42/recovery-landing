"use client";

import { DayRecord, RoutineType, Task } from "@/lib/types";
import { getLast7Days } from "@/lib/storage";

interface WeeklyDotsProps {
  history: Record<string, DayRecord>;
  routineType: RoutineType;
  tasks: Task[];
  activeKid: string;
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function WeeklyDots({ history, routineType, tasks, activeKid }: WeeklyDotsProps) {
  const days = getLast7Days();
  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <div className="flex gap-2 items-end">
      {days.map((day) => {
        const rec = history[day];
        const kidRec = rec?.[activeKid];
        const completed = kidRec ? kidRec[routineType].completed.length : 0;
        const total = tasks.length;
        const allDone = completed === total;
        const partial = completed > 0 && !allDone;
        const isToday = day === todayStr;
        const dayOfWeek = DAY_NAMES[new Date(day + "T12:00:00").getDay()];

        return (
          <div key={day} className="flex flex-col items-center gap-1">
            <div
              className={`
                w-10 h-10 rounded-full flex items-center justify-center text-sm font-black transition-all
                border-[3px]
                ${isToday ? "animate-dot-wiggle" : ""}
                ${
                  allDone
                    ? "bg-green-400 border-green-500 text-white shadow-[0_0_8px_rgba(34,197,94,0.4)]"
                    : partial
                      ? "bg-amber-300 border-amber-400 text-amber-900"
                      : isToday
                        ? "bg-[var(--accent-soft)] border-[var(--accent)] text-[var(--accent)]"
                        : "bg-[var(--surface-dim)] border-transparent text-gray-400 dark:text-gray-500"
                }
              `}
            >
              {allDone ? "⭐" : partial ? completed : "·"}
            </div>
            <span className={`text-xs font-bold ${isToday ? "text-[var(--accent)]" : "text-gray-400 dark:text-gray-500"}`}>
              {dayOfWeek}
            </span>
          </div>
        );
      })}
    </div>
  );
}
