"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useRoutineStore } from "@/hooks/useRoutineStore";
import { RoutineType } from "@/lib/types";
import TaskItem from "@/components/TaskItem";
import ProgressBar from "@/components/ProgressBar";
import Confetti from "@/components/Confetti";
import KidToggle from "@/components/KidToggle";

const ROUTINE_META: Record<RoutineType, { emoji: string; title: string }> = {
  morning: { emoji: "☀️", title: "Morning Routine" },
  bedtime: { emoji: "🌙", title: "Bedtime Routine" },
};

export default function RoutinePage() {
  const params = useParams();
  const routineType = params.type as RoutineType;

  const { state, loaded, todayRecord, toggleTask, toggleDarkMode, setActiveKid, activeKid } =
    useRoutineStore();

  // Apply dark mode
  useEffect(() => {
    if (loaded) {
      document.documentElement.classList.toggle("dark", state.settings.darkMode);
    }
  }, [state.settings.darkMode, loaded]);

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl animate-pulse">Loading...</div>
      </div>
    );
  }

  // Validate route param
  if (routineType !== "morning" && routineType !== "bedtime") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-xl">Routine not found</p>
        <Link href="/" className="text-blue-500 underline">
          Go home
        </Link>
      </div>
    );
  }

  const meta = ROUTINE_META[routineType];
  const tasks = state.routines[routineType];
  const completion = todayRecord[routineType];
  const completedCount = completion.completed.length;
  const allDone = completedCount === tasks.length;

  return (
    <main className="max-w-lg mx-auto px-4 py-6 pb-20">
      <Confetti fire={allDone} />

      {/* Top nav */}
      <div className="flex items-center justify-between mb-4">
        <Link
          href="/"
          className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </Link>
        <button
          onClick={toggleDarkMode}
          className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-lg hover:scale-110 transition-transform cursor-pointer"
          aria-label="Toggle dark mode"
        >
          {state.settings.darkMode ? "☀️" : "🌙"}
        </button>
      </div>

      {/* Kid Toggle */}
      <div className="flex justify-center mb-4">
        <KidToggle activeKid={activeKid} onToggle={setActiveKid} />
      </div>

      {/* Header */}
      <div className="text-center mb-6">
        <span className="text-5xl">{meta.emoji}</span>
        <h1 className="text-2xl font-bold mt-2 dark:text-white">
          {meta.title}
        </h1>
      </div>

      {/* Sticky progress bar */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm py-3 mb-4">
        <ProgressBar completed={completedCount} total={tasks.length} />
      </div>

      {/* Task list */}
      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            isCompleted={completion.completed.includes(task.id)}
            onToggle={() => toggleTask(routineType, task.id)}
          />
        ))}
      </div>

      {/* Completion message */}
      {allDone && (
        <div className="mt-8 text-center animate-pop">
          <div className="text-6xl mb-2">🎉</div>
          <h2 className="text-2xl font-bold text-green-600 dark:text-green-400">
            Amazing job!
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            You finished your {routineType} routine!
          </p>
          <Link
            href="/"
            className="inline-block mt-4 px-6 py-3 bg-green-500 text-white font-bold rounded-full hover:bg-green-600 transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      )}
    </main>
  );
}
