"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useRoutineStore } from "@/hooks/useRoutineStore";
import { RoutineType } from "@/lib/types";
import { THEME_ORDER } from "@/lib/constants";
import { getTodayTheme } from "@/lib/dailyTheme";
import TaskItem from "@/components/TaskItem";
import ProgressBar from "@/components/ProgressBar";
import Confetti from "@/components/Confetti";
import Celebration from "@/components/Celebration";
import KidToggle from "@/components/KidToggle";

const ROUTINE_META: Record<RoutineType, { emoji: string; title: string }> = {
  morning: { emoji: "☀️", title: "Morning Routine" },
  bedtime: { emoji: "🌙", title: "Evening Routine" },
};

export default function RoutinePage() {
  const params = useParams();
  const router = useRouter();
  const routineType = params.type as RoutineType;

  const { state, loaded, needsOnboarding, todayRecord, toggleTask, toggleDarkMode, setActiveKid, addTask, removeTask, reorderTask, activeKid, kids } =
    useRoutineStore();
  const [newTaskLabel, setNewTaskLabel] = useState("");

  const activeKidObj = kids.find((k) => k.id === activeKid);

  // Apply dark mode
  useEffect(() => {
    if (loaded) {
      document.documentElement.classList.toggle("dark", state.settings.darkMode);
    }
  }, [state.settings.darkMode, loaded]);

  // Apply kid theme
  useEffect(() => {
    if (loaded) {
      for (const t of THEME_ORDER) {
        document.documentElement.classList.remove(`theme-${t}`);
      }
      if (activeKidObj) {
        document.documentElement.classList.add(`theme-${activeKidObj.theme}`);
      }
    }
  }, [activeKid, activeKidObj, loaded]);

  // Redirect to onboarding if no kids set up
  useEffect(() => {
    if (loaded && needsOnboarding) {
      router.replace("/");
    }
  }, [loaded, needsOnboarding, router]);

  if (!loaded || needsOnboarding) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-bold animate-pulse">Loading...</div>
      </div>
    );
  }

  // Validate route param
  if (routineType !== "morning" && routineType !== "bedtime") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-xl font-bold">Routine not found</p>
        <Link href="/" className="text-blue-500 underline font-bold">
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
    <main className="relative max-w-lg mx-auto px-5 py-6 pb-20">
      {/* Background dots */}
      <div className="fixed inset-0 bg-playful-dots pointer-events-none" />

      <Confetti fire={allDone} />
      <Celebration fire={allDone} />

      {/* Top nav */}
      <div className="relative flex items-center justify-between mb-4">
        <Link
          href="/"
          className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors font-bold"
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
          className="w-12 h-12 rounded-2xl bg-[var(--surface-dim)] border-[3px] border-transparent flex items-center justify-center text-lg hover:scale-110 hover:border-[var(--accent)] transition-all cursor-pointer btn-pressed"
          aria-label="Toggle dark mode"
        >
          {state.settings.darkMode ? "☀️" : "🌙"}
        </button>
      </div>

      {/* Sticky KidToggle + ProgressBar */}
      <div className="relative sticky top-0 z-10 bg-[var(--bg-blur)] backdrop-blur-sm py-2 space-y-2 mb-4">
        <div className="flex justify-center">
          <KidToggle kids={kids} activeKid={activeKid} onToggle={setActiveKid} compact />
        </div>
        <ProgressBar completed={completedCount} total={tasks.length} />
      </div>

      {/* Daily theme banner */}
      <div className="relative flex justify-center mb-4">
        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[var(--accent-soft)] text-sm font-black text-[var(--accent)] dark:text-[var(--accent)]">
          {getTodayTheme().icon} {getTodayTheme().name}
        </span>
      </div>

      {/* Header */}
      <div className="relative text-center mb-6">
        <span className="text-7xl">{meta.emoji}</span>
        <h1 className="text-3xl font-black mt-2 dark:text-white">
          {meta.title}
        </h1>
      </div>

      {/* Task list */}
      <div className="relative space-y-4">
        {tasks.map((task, idx) => (
          <TaskItem
            key={task.id}
            task={task}
            isCompleted={completion.completed.includes(task.id)}
            onToggle={() => toggleTask(routineType, task.id)}
            onRemove={() => removeTask(routineType, task.id)}
            onMoveUp={idx > 0 ? () => reorderTask(routineType, task.id, "up") : undefined}
            onMoveDown={idx < tasks.length - 1 ? () => reorderTask(routineType, task.id, "down") : undefined}
          />
        ))}
      </div>

      {/* Add task form */}
      <div className="relative mt-4 flex items-center gap-3">
        <input
          type="text"
          value={newTaskLabel}
          onChange={(e) => setNewTaskLabel(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && newTaskLabel.trim()) {
              addTask(routineType, newTaskLabel);
              setNewTaskLabel("");
            }
          }}
          placeholder="What's next? 🎯"
          className="flex-1 p-5 rounded-[1.5rem] border-[3px] border-dashed border-gray-300 dark:border-gray-600 bg-[var(--surface)] text-gray-900 dark:text-white text-lg font-bold placeholder:text-gray-400 dark:placeholder:text-gray-500 placeholder:font-semibold outline-none focus:border-[var(--accent)] transition-colors"
        />
        <button
          type="button"
          onClick={() => {
            if (newTaskLabel.trim()) {
              addTask(routineType, newTaskLabel);
              setNewTaskLabel("");
            }
          }}
          disabled={!newTaskLabel.trim()}
          className="w-16 h-16 rounded-[1.5rem] border-[3px] border-dashed border-gray-300 dark:border-gray-600 bg-[var(--surface)] text-2xl font-black text-gray-400 dark:text-gray-500 hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer btn-pressed"
        >
          +
        </button>
      </div>

      {/* Completion message */}
      {allDone && (
        <div className="relative mt-8 text-center animate-bounce-in">
          <div className="text-7xl mb-2">🚀</div>
          <h2 className="text-3xl font-black text-green-600 dark:text-green-400">
            Amazing job!
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1 font-bold">
            You finished your {routineType === "bedtime" ? "evening" : routineType} routine!
          </p>
          <Link
            href="/"
            className="inline-block mt-4 px-8 py-4 bg-green-500 text-white font-black text-lg rounded-[2rem] hover:bg-green-600 transition-colors shadow-[0_6px_0_rgba(0,0,0,0.15)] active:translate-y-1 active:shadow-[0_2px_0_rgba(0,0,0,0.15)]"
          >
            Back to Dashboard 🏠
          </Link>
        </div>
      )}
    </main>
  );
}
