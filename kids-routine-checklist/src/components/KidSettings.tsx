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

interface KidSettingsProps {
  kids: Kid[];
  onAddKid: (name: string, animal: AnimalId, theme?: ColorTheme) => void;
  onRemoveKid: (kidId: string) => void;
  onUpdateKid: (kidId: string, updates: Partial<Pick<Kid, "name" | "animal" | "theme">>) => void;
  onClose: () => void;
}

function firstUnused<T>(all: T[], used: Set<T>): T {
  return all.find((v) => !used.has(v)) ?? all[0];
}

export default function KidSettings({ kids, onAddKid, onRemoveKid, onUpdateKid, onClose }: KidSettingsProps) {
  const [confirmRemove, setConfirmRemove] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  // Defaults for the add-kid form
  const usedAnimals = new Set(kids.map((k) => k.animal));
  const usedThemes = new Set(kids.map((k) => k.theme));
  const [newName, setNewName] = useState(`Kid ${kids.length + 1}`);
  const [newAnimal, setNewAnimal] = useState<AnimalId>(firstUnused(ANIMAL_IDS, usedAnimals));
  const [newTheme, setNewTheme] = useState<ColorTheme>(firstUnused(THEME_ORDER, usedThemes));

  function openAddForm() {
    const ua = new Set(kids.map((k) => k.animal));
    const ut = new Set(kids.map((k) => k.theme));
    setNewName(`Kid ${kids.length + 1}`);
    setNewAnimal(firstUnused(ANIMAL_IDS, ua));
    setNewTheme(firstUnused(THEME_ORDER, ut));
    setAdding(true);
  }

  function submitAdd() {
    if (!newName.trim()) return;
    onAddKid(newName.trim(), newAnimal, newTheme);
    setAdding(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-[var(--surface)] rounded-2xl shadow-xl w-full max-w-md max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[var(--surface)] p-4 border-b border-[var(--surface-dim)] flex items-center justify-between rounded-t-2xl z-10">
          <h2 className="text-xl font-bold dark:text-white">Kid Settings</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[var(--surface-dim)] flex items-center justify-center text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Kid list */}
        <div className="p-4 space-y-6">
          {kids.map((kid) => (
            <div key={kid.id} className="space-y-3 p-4 rounded-xl bg-[var(--background)] border border-[var(--surface-dim)]">
              {/* Name input */}
              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Name</label>
                <input
                  type="text"
                  value={kid.name}
                  onChange={(e) => onUpdateKid(kid.id, { name: e.target.value })}
                  maxLength={20}
                  className="w-full px-3 py-2 rounded-lg border border-[var(--surface-dim)] bg-[var(--surface)] text-[var(--foreground)] outline-none focus:border-[var(--accent)] transition-colors"
                />
              </div>

              {/* Animal picker */}
              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Animal</label>
                <div className="flex flex-wrap gap-1.5">
                  {ANIMAL_IDS.map((animalId) => (
                    <button
                      key={animalId}
                      onClick={() => onUpdateKid(kid.id, { animal: animalId })}
                      title={ANIMALS[animalId].label}
                      className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg transition-all cursor-pointer ${
                        kid.animal === animalId
                          ? "bg-[var(--accent-soft)] border-2 border-[var(--accent)] scale-110"
                          : "bg-[var(--surface)] border border-[var(--surface-dim)] hover:border-[var(--accent)] hover:scale-105"
                      }`}
                    >
                      {ANIMALS[animalId].emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme picker */}
              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Color Theme</label>
                <div className="flex gap-2">
                  {THEME_ORDER.map((themeId) => (
                    <button
                      key={themeId}
                      onClick={() => onUpdateKid(kid.id, { theme: themeId })}
                      title={THEMES[themeId].label}
                      className={`w-8 h-8 rounded-full ${COLOR_DOT[themeId]} transition-all cursor-pointer ${
                        kid.theme === themeId
                          ? "ring-2 ring-offset-2 ring-[var(--accent)] scale-110"
                          : "opacity-60 hover:opacity-100 hover:scale-105"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Remove button */}
              <div className="pt-1">
                {confirmRemove === kid.id ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-red-500">Remove {kid.name}?</span>
                    <button
                      onClick={() => { onRemoveKid(kid.id); setConfirmRemove(null); }}
                      className="px-3 py-1 text-sm font-medium bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors cursor-pointer"
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setConfirmRemove(null)}
                      className="px-3 py-1 text-sm font-medium bg-[var(--surface-dim)] text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmRemove(kid.id)}
                    disabled={kids.length <= 1}
                    className="text-sm text-red-400 hover:text-red-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Inline add-kid form */}
          {adding && (
            <div className="space-y-3 p-4 rounded-xl border-2 border-dashed border-[var(--accent)] bg-[var(--accent-soft)]">
              <p className="text-sm font-semibold dark:text-white">New Kid</p>

              {/* Name */}
              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  maxLength={20}
                  autoFocus
                  className="w-full px-3 py-2 rounded-lg border border-[var(--surface-dim)] bg-[var(--surface)] text-[var(--foreground)] outline-none focus:border-[var(--accent)] transition-colors"
                />
              </div>

              {/* Animal */}
              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Animal</label>
                <div className="flex flex-wrap gap-1.5">
                  {ANIMAL_IDS.map((animalId) => (
                    <button
                      key={animalId}
                      onClick={() => setNewAnimal(animalId)}
                      title={ANIMALS[animalId].label}
                      className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg transition-all cursor-pointer ${
                        newAnimal === animalId
                          ? "bg-[var(--accent-soft)] border-2 border-[var(--accent)] scale-110"
                          : "bg-[var(--surface)] border border-[var(--surface-dim)] hover:border-[var(--accent)] hover:scale-105"
                      }`}
                    >
                      {ANIMALS[animalId].emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme */}
              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Color Theme</label>
                <div className="flex gap-2">
                  {THEME_ORDER.map((themeId) => (
                    <button
                      key={themeId}
                      onClick={() => setNewTheme(themeId)}
                      title={THEMES[themeId].label}
                      className={`w-8 h-8 rounded-full ${COLOR_DOT[themeId]} transition-all cursor-pointer ${
                        newTheme === themeId
                          ? "ring-2 ring-offset-2 ring-[var(--accent)] scale-110"
                          : "opacity-60 hover:opacity-100 hover:scale-105"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={submitAdd}
                  disabled={!newName.trim()}
                  className="px-4 py-2 text-sm font-semibold bg-[var(--accent)] text-white rounded-lg hover:opacity-90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Add {ANIMALS[newAnimal].emoji} {newName.trim() || "Kid"}
                </button>
                <button
                  onClick={() => setAdding(false)}
                  className="px-4 py-2 text-sm font-medium bg-[var(--surface-dim)] text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Add kid button */}
        {!adding && (
          <div className="p-4 border-t border-[var(--surface-dim)]">
            <button
              onClick={openAddForm}
              disabled={kids.length >= 5}
              className="w-full py-3 rounded-xl border-2 border-dashed border-[var(--surface-dim)] text-gray-500 dark:text-gray-400 font-medium hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              + Add Kid
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
