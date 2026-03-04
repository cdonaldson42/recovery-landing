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
    <main className="relative max-w-lg mx-auto px-5 py-12 pb-20">
      {/* Background dots */}
      <div className="fixed inset-0 bg-playful-dots pointer-events-none" />

      {/* Welcome */}
      <div className="relative text-center mb-8">
        <div className="text-8xl mb-4 animate-bounce-in">🌟</div>
        <h1 className="text-4xl font-black dark:text-white mb-2">
          Kids Routine Checklist
        </h1>
        <p className="text-gray-500 dark:text-gray-400 font-semibold">
          Help your kids build great habits! Add your kids below to get started.
        </p>
      </div>

      {/* Added kids list */}
      {kids.length > 0 && (
        <div className="relative space-y-3 mb-6">
          {kids.map((kid) => (
            <div
              key={kid.id}
              className="flex items-center justify-between p-4 rounded-[1.5rem] bg-[var(--surface)] border-[3px] border-[var(--surface-dim)] shadow-[0_4px_0_rgba(0,0,0,0.08)]"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{ANIMALS[kid.animal].emoji}</span>
                <span className="font-bold text-lg dark:text-white">{kid.name}</span>
                <span className={`w-5 h-5 rounded-full ${COLOR_DOT[kid.theme]}`} />
              </div>
              <button
                onClick={() => removeKid(kid.id)}
                className="text-sm font-bold text-red-400 hover:text-red-500 transition-colors cursor-pointer"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add kid form */}
      {kids.length < 5 && (
        <div className="relative space-y-4 p-5 rounded-[2rem] bg-[var(--surface)] border-[3px] border-[var(--surface-dim)] shadow-[0_6px_0_rgba(0,0,0,0.08)] mb-6">
          <p className="text-base font-black dark:text-white">
            {kids.length === 0 ? "Add your first kid" : "Add another kid"}
          </p>

          {/* Name */}
          <div>
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 block">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && name.trim()) addKid(); }}
              maxLength={20}
              placeholder="Enter name..."
              autoFocus
              className="w-full px-4 py-3 rounded-[1rem] border-[3px] border-[var(--surface-dim)] bg-[var(--background)] text-[var(--foreground)] font-bold outline-none focus:border-[var(--accent)] transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-500 placeholder:font-semibold"
            />
          </div>

          {/* Animal picker */}
          <div>
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 block">Pick an animal</label>
            <div className="flex flex-wrap gap-2">
              {ANIMAL_IDS.map((animalId) => (
                <button
                  key={animalId}
                  onClick={() => setAnimal(animalId)}
                  title={ANIMALS[animalId].label}
                  className={`w-12 h-12 rounded-[1rem] flex items-center justify-center text-xl transition-all cursor-pointer border-[3px] ${
                    animal === animalId
                      ? "bg-[var(--accent-soft)] border-[var(--accent)] scale-110 shadow-[0_4px_0_rgba(0,0,0,0.1)]"
                      : "bg-[var(--background)] border-[var(--surface-dim)] hover:border-[var(--accent)] hover:scale-105"
                  }`}
                >
                  {ANIMALS[animalId].emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Theme picker */}
          <div>
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 block">Color theme</label>
            <div className="flex gap-3">
              {THEME_ORDER.map((themeId) => (
                <button
                  key={themeId}
                  onClick={() => setTheme(themeId)}
                  title={THEMES[themeId].label}
                  className={`w-10 h-10 rounded-full ${COLOR_DOT[themeId]} transition-all cursor-pointer border-[3px] ${
                    theme === themeId
                      ? "border-white ring-2 ring-offset-2 ring-[var(--accent)] scale-110 shadow-[0_4px_0_rgba(0,0,0,0.15)]"
                      : "border-transparent opacity-60 hover:opacity-100 hover:scale-105"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Add button */}
          <button
            onClick={addKid}
            disabled={!name.trim()}
            className="w-full py-4 rounded-[1.5rem] font-black text-lg bg-[var(--accent)] text-white hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer btn-pressed"
          >
            {name.trim() ? `Add ${ANIMALS[animal].emoji} ${name.trim()}` : "Enter a name to add"}
          </button>
        </div>
      )}

      {/* Get Started */}
      <button
        onClick={() => onComplete(kids)}
        disabled={kids.length === 0}
        className="relative w-full py-5 rounded-[2rem] font-black text-xl bg-green-500 text-white hover:bg-green-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shadow-[0_6px_0_rgba(0,0,0,0.15)] active:translate-y-1 active:shadow-[0_2px_0_rgba(0,0,0,0.15)]"
      >
        Get Started 🚀
      </button>
    </main>
  );
}
