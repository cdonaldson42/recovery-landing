"use client";

import { useEffect } from "react";
import { useRoutineStore } from "@/hooks/useRoutineStore";
import RoutineCard from "@/components/RoutineCard";
import StreakCounter from "@/components/StreakCounter";
import WeeklyDots from "@/components/WeeklyDots";
import KidToggle from "@/components/KidToggle";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function formatDate(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export default function Dashboard() {
  const { state, loaded, todayRecord, getStreak, toggleDarkMode, setActiveKid, activeKid } =
    useRoutineStore();

  // Apply dark mode + kid theme class to html element
  useEffect(() => {
    if (loaded) {
      document.documentElement.classList.toggle("dark", state.settings.darkMode);
    }
  }, [state.settings.darkMode, loaded]);

  useEffect(() => {
    if (loaded) {
      document.documentElement.classList.remove("theme-kid1", "theme-kid2");
      document.documentElement.classList.add(`theme-${activeKid}`);
    }
  }, [activeKid, loaded]);

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl animate-pulse">Loading...</div>
      </div>
    );
  }

  const morningStreak = getStreak("morning");
  const bedtimeStreak = getStreak("bedtime");

  return (
    <main className="max-w-lg mx-auto px-4 py-8 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold dark:text-white">
            {getGreeting()}! 👋
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{formatDate()}</p>
        </div>
        <button
          onClick={toggleDarkMode}
          className="w-10 h-10 rounded-full bg-[var(--surface-dim)] flex items-center justify-center text-xl hover:scale-110 transition-all cursor-pointer"
          aria-label="Toggle dark mode"
        >
          {state.settings.darkMode ? "☀️" : "🌙"}
        </button>
      </div>

      {/* Kid Toggle */}
      <div className="sticky top-0 z-10 bg-[var(--bg-blur)] backdrop-blur-sm py-3 mb-6">
        <KidToggle activeKid={activeKid} onToggle={setActiveKid} />
      </div>

      {/* Streaks */}
      <div className="flex gap-6 mb-8 p-4 bg-[var(--surface)] rounded-2xl shadow-sm transition-colors duration-400">
        <StreakCounter streak={morningStreak} label="Morning streak" />
        <div className="w-px bg-[var(--surface-dim)]" />
        <StreakCounter streak={bedtimeStreak} label="Evening streak" />
      </div>

      {/* Routine Cards */}
      <div className="space-y-4 mb-8">
        <RoutineCard
          type="morning"
          tasks={state.routines.morning}
          completion={todayRecord.morning}
          streak={morningStreak}
        />
        <RoutineCard
          type="bedtime"
          tasks={state.routines.bedtime}
          completion={todayRecord.bedtime}
          streak={bedtimeStreak}
        />
      </div>

      {/* Weekly Progress */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold dark:text-white">This Week</h3>

        <div className="p-4 bg-[var(--surface)] rounded-2xl shadow-sm transition-colors duration-400">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            ☀️ Morning
          </p>
          <WeeklyDots
            history={state.history}
            routineType="morning"
            tasks={state.routines.morning}
            activeKid={activeKid}
          />
        </div>

        <div className="p-4 bg-[var(--surface)] rounded-2xl shadow-sm transition-colors duration-400">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            🌙 Evening
          </p>
          <WeeklyDots
            history={state.history}
            routineType="bedtime"
            tasks={state.routines.bedtime}
            activeKid={activeKid}
          />
        </div>
      </div>
    </main>
  );
}
