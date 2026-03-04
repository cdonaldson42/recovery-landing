"use client";

import { useEffect, useState } from "react";
import { useRoutineStore } from "@/hooks/useRoutineStore";
import RoutineCard from "@/components/RoutineCard";
import StreakCounter from "@/components/StreakCounter";
import WeeklyDots from "@/components/WeeklyDots";
import KidToggle from "@/components/KidToggle";
import KidSettings from "@/components/KidSettings";
import Onboarding from "@/components/Onboarding";
import { THEME_ORDER } from "@/lib/constants";
import { getTodayTheme } from "@/lib/dailyTheme";

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
  const { state, loaded, needsOnboarding, completeOnboarding, todayRecord, getStreak, toggleDarkMode, setActiveKid, activeKid, kids, addKid, removeKid, updateKid } =
    useRoutineStore();
  const [showSettings, setShowSettings] = useState(false);

  // Apply dark mode
  useEffect(() => {
    if (loaded) {
      document.documentElement.classList.toggle("dark", state.settings.darkMode);
    }
  }, [state.settings.darkMode, loaded]);

  // Apply kid theme class
  useEffect(() => {
    if (loaded) {
      for (const t of THEME_ORDER) {
        document.documentElement.classList.remove(`theme-${t}`);
      }
      const activeKidObj = kids.find((k) => k.id === activeKid);
      if (activeKidObj) {
        document.documentElement.classList.add(`theme-${activeKidObj.theme}`);
      }
    }
  }, [activeKid, kids, loaded]);

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-bold animate-pulse">Loading...</div>
      </div>
    );
  }

  if (needsOnboarding) {
    return <Onboarding onComplete={completeOnboarding} />;
  }

  const morningStreak = getStreak("morning");
  const bedtimeStreak = getStreak("bedtime");

  return (
    <main className="relative max-w-lg mx-auto px-5 py-10 pb-20">
      {/* Background dots */}
      <div className="fixed inset-0 bg-playful-dots pointer-events-none" />

      {/* Header */}
      <div className="relative flex items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl font-black dark:text-white">
            {getGreeting()}! 👋
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 font-semibold">{formatDate()}</p>
          <span className="inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-full bg-[var(--accent-soft)] text-xs font-black text-[var(--accent)]">
            {getTodayTheme().icon} {getTodayTheme().name}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSettings(true)}
            className="w-12 h-12 rounded-2xl bg-[var(--surface-dim)] border-[3px] border-transparent flex items-center justify-center text-xl hover:scale-110 hover:border-[var(--accent)] transition-all cursor-pointer btn-pressed"
            aria-label="Kid settings"
          >
            ⚙️
          </button>
          <button
            onClick={toggleDarkMode}
            className="w-12 h-12 rounded-2xl bg-[var(--surface-dim)] border-[3px] border-transparent flex items-center justify-center text-xl hover:scale-110 hover:border-[var(--accent)] transition-all cursor-pointer btn-pressed"
            aria-label="Toggle dark mode"
          >
            {state.settings.darkMode ? "☀️" : "🌙"}
          </button>
        </div>
      </div>

      {/* Hero Avatar */}
      <div className="relative mb-2">
        <KidToggle kids={kids} activeKid={activeKid} onToggle={setActiveKid} />
      </div>

      {/* Sticky kid switcher (compact) — only for multi-kid */}
      {kids.length > 1 && (
        <div className="relative sticky top-0 z-10 bg-[var(--bg-blur)] backdrop-blur-sm py-2 mb-6">
          <KidToggle kids={kids} activeKid={activeKid} onToggle={setActiveKid} compact />
        </div>
      )}

      {/* Streaks */}
      <div className="relative flex gap-6 mb-8 p-6 bg-[var(--surface)] rounded-[2rem] border-[3px] border-[var(--surface-dim)] shadow-[0_6px_0_rgba(0,0,0,0.08)] transition-colors duration-400">
        <StreakCounter streak={morningStreak} label="Morning streak" />
        <div className="w-px bg-[var(--surface-dim)]" />
        <StreakCounter streak={bedtimeStreak} label="Evening streak" />
      </div>

      {/* Routine Cards */}
      <div className="relative space-y-5 mb-8">
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
      <div className="relative space-y-4">
        <h3 className="text-xl font-black dark:text-white">This Week</h3>

        <div className="p-6 bg-[var(--surface)] rounded-[2rem] border-[3px] border-[var(--surface-dim)] shadow-[0_6px_0_rgba(0,0,0,0.08)] transition-colors duration-400">
          <p className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-3">
            ☀️ Morning
          </p>
          <WeeklyDots
            history={state.history}
            routineType="morning"
            tasks={state.routines.morning}
            activeKid={activeKid}
          />
        </div>

        <div className="p-6 bg-[var(--surface)] rounded-[2rem] border-[3px] border-[var(--surface-dim)] shadow-[0_6px_0_rgba(0,0,0,0.08)] transition-colors duration-400">
          <p className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-3">
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

      {/* Kid Settings Modal */}
      {showSettings && (
        <KidSettings
          kids={kids}
          onAddKid={addKid}
          onRemoveKid={removeKid}
          onUpdateKid={updateKid}
          onClose={() => setShowSettings(false)}
        />
      )}
    </main>
  );
}
