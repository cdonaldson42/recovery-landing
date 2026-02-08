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

  return (
    <div className="flex gap-2 items-end">
      {days.map((day) => {
        const rec = history[day];
        const kidRec = rec?.[activeKid];
        const completed = kidRec ? kidRec[routineType].completed.length : 0;
        const total = tasks.length;
        const allDone = completed === total;
        const partial = completed > 0 && !allDone;
        const dayOfWeek = DAY_NAMES[new Date(day + "T12:00:00").getDay()];

        return (
          <div key={day} className="flex flex-col items-center gap-1">
            <div
              className={`
                w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all
                ${
                  allDone
                    ? "bg-green-400 text-white scale-110"
                    : partial
                      ? "bg-amber-300 text-amber-900"
                      : "bg-[var(--surface-dim)] text-gray-400 dark:text-gray-500"
                }
              `}
            >
              {allDone ? "✓" : partial ? completed : "·"}
            </div>
            <span className="text-[10px] text-gray-400 dark:text-gray-500">
              {dayOfWeek}
            </span>
          </div>
        );
      })}
    </div>
  );
}
