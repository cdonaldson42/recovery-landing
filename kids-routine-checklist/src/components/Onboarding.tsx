"use client";

import { useState } from "react";
import { Kid, AnimalId, ColorTheme } from "@/lib/types";
import { ANIMALS, THEMES, THEME_ORDER } from "@/lib/constants";

const ANIMAL_IDS = Object.keys(ANIMALS) as AnimalId[];

const COLOR_DOT: Record<ColorTheme, string> = {
  blue: "bg-blue-500",
  green: "bg-emerald-500",
  purple: "bg-violet-500",
  orange: "bg-orange-500",
  pink: "bg-pink-500",
};

function firstUnused<T>(all: T[], used: Set<T>): T {
  return all.find((v) => !used.has(v)) ?? all[0];
}

interface OnboardingProps {
  onComplete: (kids: Kid[]) => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [kids, setKids] = useState<Kid[]>([]);
  const [name, setName] = useState("");
  const [animal, setAnimal] = useState<AnimalId>("tiger");
  const [theme, setTheme] = useState<ColorTheme>("blue");

  function resetForm(currentKids: Kid[]) {
    const usedAnimals = new Set(currentKids.map((k) => k.animal));
    const usedThemes = new Set(currentKids.map((k) => k.theme));
    setName("");
    setAnimal(firstUnused(ANIMAL_IDS, usedAnimals));
    setTheme(firstUnused(THEME_ORDER, usedThemes));
  }

  function addKid() {
    const trimmed = name.trim();
    if (!trimmed || kids.length >= 5) return;
    const newKid: Kid = {
      id: `kid-${Date.now()}`,
      name: trimmed,
      animal,
      theme,
    };
    const updated = [...kids, newKid];
    setKids(updated);
    resetForm(updated);
  }

  function removeKid(kidId: string) {
    setKids((prev) => prev.filter((k) => k.id !== kidId));
  }

  return (
    <main className="max-w-lg mx-auto px-4 py-12 pb-20">
      {/* Welcome */}
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">🌟</div>
        <h1 className="text-3xl font-bold dark:text-white mb-2">
          Kids Routine Checklist
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Help your kids build great habits! Add your kids below to get started.
        </p>
      </div>

      {/* Added kids list */}
      {kids.length > 0 && (
        <div className="space-y-2 mb-6">
          {kids.map((kid) => (
            <div
              key={kid.id}
              className="flex items-center justify-between p-3 rounded-xl bg-[var(--surface)] border border-[var(--surface-dim)]"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{ANIMALS[kid.animal].emoji}</span>
                <span className="font-medium dark:text-white">{kid.name}</span>
                <span className={`w-4 h-4 rounded-full ${COLOR_DOT[kid.theme]}`} />
              </div>
              <button
                onClick={() => removeKid(kid.id)}
                className="text-sm text-red-400 hover:text-red-500 transition-colors cursor-pointer"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add kid form */}
      {kids.length < 5 && (
        <div className="space-y-4 p-4 rounded-2xl bg-[var(--surface)] border border-[var(--surface-dim)] mb-6">
          <p className="text-sm font-semibold dark:text-white">
            {kids.length === 0 ? "Add your first kid" : "Add another kid"}
          </p>

          {/* Name */}
          <div>
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && name.trim()) addKid(); }}
              maxLength={20}
              placeholder="Enter name..."
              autoFocus
              className="w-full px-3 py-2 rounded-lg border border-[var(--surface-dim)] bg-[var(--background)] text-[var(--foreground)] outline-none focus:border-[var(--accent)] transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-500"
            />
          </div>

          {/* Animal picker */}
          <div>
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Pick an animal</label>
            <div className="flex flex-wrap gap-1.5">
              {ANIMAL_IDS.map((animalId) => (
                <button
                  key={animalId}
                  onClick={() => setAnimal(animalId)}
                  title={ANIMALS[animalId].label}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg transition-all cursor-pointer ${
                    animal === animalId
                      ? "bg-[var(--accent-soft)] border-2 border-[var(--accent)] scale-110"
                      : "bg-[var(--background)] border border-[var(--surface-dim)] hover:border-[var(--accent)] hover:scale-105"
                  }`}
                >
                  {ANIMALS[animalId].emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Theme picker */}
          <div>
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Color theme</label>
            <div className="flex gap-2">
              {THEME_ORDER.map((themeId) => (
                <button
                  key={themeId}
                  onClick={() => setTheme(themeId)}
                  title={THEMES[themeId].label}
                  className={`w-8 h-8 rounded-full ${COLOR_DOT[themeId]} transition-all cursor-pointer ${
                    theme === themeId
                      ? "ring-2 ring-offset-2 ring-[var(--accent)] scale-110"
                      : "opacity-60 hover:opacity-100 hover:scale-105"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Add button */}
          <button
            onClick={addKid}
            disabled={!name.trim()}
            className="w-full py-3 rounded-xl font-semibold bg-[var(--accent)] text-white hover:opacity-90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            {name.trim() ? `Add ${ANIMALS[animal].emoji} ${name.trim()}` : "Enter a name to add"}
          </button>
        </div>
      )}

      {/* Get Started */}
      <button
        onClick={() => onComplete(kids)}
        disabled={kids.length === 0}
        className="w-full py-4 rounded-2xl font-bold text-lg bg-green-500 text-white hover:bg-green-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
      >
        Get Started
      </button>
    </main>
  );
}
