"use client";

import { useState, useEffect, useCallback } from "react";
import { AppState, RoutineType, KidDayRecord, Kid, AnimalId, ColorTheme, Task } from "@/lib/types";
import { DEFAULT_STATE } from "@/lib/defaults";
import { DEFAULT_KIDS, THEME_ORDER } from "@/lib/constants";
import { loadState, saveState, getToday } from "@/lib/storage";

const EMPTY_KID_DAY: KidDayRecord = {
  morning: { completed: [] },
  bedtime: { completed: [] },
};

function emptyDayForKids(kids: Kid[]): Record<string, KidDayRecord> {
  const day: Record<string, KidDayRecord> = {};
  for (const kid of kids) {
    day[kid.id] = { morning: { completed: [] }, bedtime: { completed: [] } };
  }
  return day;
}

function migrateState(state: AppState): AppState {
  let s = { ...state };

  // 1. Inject kids if missing
  if (!s.kids || s.kids.length === 0) {
    s = { ...s, kids: DEFAULT_KIDS };
  }

  // 2. Migrate flat history records and ensure all kids have entries
  let historyChanged = false;
  const history = { ...s.history };
  for (const key of Object.keys(history)) {
    const rec = history[key] as unknown as Record<string, unknown>;

    // Flat format: has "morning"/"bedtime" at top level (no kid keys)
    if ("morning" in rec && !s.kids.some((k) => k.id in rec)) {
      historyChanged = true;
      const oldMorning = (rec["morning"] as KidDayRecord["morning"]) ?? { completed: [] };
      const oldBedtime = (rec["bedtime"] as KidDayRecord["bedtime"]) ?? { completed: [] };
      const newRec: Record<string, KidDayRecord> = {};
      for (let i = 0; i < s.kids.length; i++) {
        newRec[s.kids[i].id] = i === 0
          ? { morning: oldMorning, bedtime: oldBedtime }
          : { morning: { completed: [] }, bedtime: { completed: [] } };
      }
      history[key] = newRec;
    } else {
      // Ensure all current kids have entries in this day
      let dayChanged = false;
      const dayRec = { ...history[key] } as Record<string, KidDayRecord>;
      for (const kid of s.kids) {
        if (!(kid.id in dayRec)) {
          dayChanged = true;
          dayRec[kid.id] = { morning: { completed: [] }, bedtime: { completed: [] } };
        }
      }
      if (dayChanged) {
        historyChanged = true;
        history[key] = dayRec;
      }
    }
  }
  if (historyChanged) {
    s = { ...s, history };
  }

  // 3. Validate activeKid
  if (!s.kids.some((k) => k.id === s.settings.activeKid)) {
    s = { ...s, settings: { ...s.settings, activeKid: s.kids[0].id } };
  }

  return s;
}

function pruneStaleCompletions(state: AppState): AppState {
  const morningIds = new Set(state.routines.morning.map((t) => t.id));
  const bedtimeIds = new Set(state.routines.bedtime.map((t) => t.id));
  let changed = false;
  const history = { ...state.history };

  for (const key of Object.keys(history)) {
    const dayRec = history[key];
    for (const kid of state.kids) {
      const kidRec = dayRec[kid.id];
      if (!kidRec) continue;
      const cleanMorning = kidRec.morning.completed.filter((id) => morningIds.has(id));
      const cleanBedtime = kidRec.bedtime.completed.filter((id) => bedtimeIds.has(id));
      if (cleanMorning.length !== kidRec.morning.completed.length || cleanBedtime.length !== kidRec.bedtime.completed.length) {
        changed = true;
        history[key] = {
          ...dayRec,
          [kid.id]: {
            morning: { ...kidRec.morning, completed: cleanMorning },
            bedtime: { ...kidRec.bedtime, completed: cleanBedtime },
          },
        };
      }
    }
  }
  return changed ? { ...state, history } : state;
}

function ensureToday(state: AppState): AppState {
  const today = getToday();
  const existing = state.history[today];
  if (existing) {
    // Patch in any newly-added kids missing from today's record
    let patched = false;
    const dayRec = { ...existing };
    for (const kid of state.kids) {
      if (!(kid.id in dayRec)) {
        patched = true;
        dayRec[kid.id] = { morning: { completed: [] }, bedtime: { completed: [] } };
      }
    }
    if (!patched) return state;
    return { ...state, history: { ...state.history, [today]: dayRec } };
  }
  return {
    ...state,
    history: {
      ...state.history,
      [today]: emptyDayForKids(state.kids),
    },
  };
}

export function useRoutineStore() {
  const [state, setState] = useState<AppState>(DEFAULT_STATE);
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const raw = loadState();
    const withRoutines = {
      ...raw,
      routines: raw.routines?.morning?.length ? raw.routines : DEFAULT_STATE.routines,
    };
    const migrated = migrateState(withRoutines);
    const cleaned = pruneStaleCompletions(migrated);
    const s = ensureToday(cleaned);
    setState(s);
    setLoaded(true);
  }, []);

  // Persist on every change (after initial load)
  useEffect(() => {
    if (loaded) saveState(state);
  }, [state, loaded]);

  const today = getToday();
  const activeKid = state.settings.activeKid;
  const kids = state.kids;

  const todayRecord: KidDayRecord = state.history[today]?.[activeKid] ?? EMPTY_KID_DAY;

  const toggleTask = useCallback(
    (routineType: RoutineType, taskId: string) => {
      setState((prev) => {
        const s = ensureToday(prev);
        const kid = s.settings.activeKid;
        const dayRec = s.history[today] ?? emptyDayForKids(s.kids);
        const kidRec = dayRec[kid] ?? EMPTY_KID_DAY;
        const routine = kidRec[routineType];
        const isCompleted = routine.completed.includes(taskId);

        const newCompleted = isCompleted
          ? routine.completed.filter((id) => id !== taskId)
          : [...routine.completed, taskId];

        const allTasks = s.routines[routineType];
        const allDone = newCompleted.length === allTasks.length;

        const newRoutine = {
          completed: newCompleted,
          completedAt: allDone ? new Date().toISOString() : undefined,
        };

        return {
          ...s,
          history: {
            ...s.history,
            [today]: {
              ...dayRec,
              [kid]: {
                ...kidRec,
                [routineType]: newRoutine,
              },
            },
          },
        };
      });
    },
    [today]
  );

  const toggleDarkMode = useCallback(() => {
    setState((prev) => ({
      ...prev,
      settings: { ...prev.settings, darkMode: !prev.settings.darkMode },
    }));
  }, []);

  const setActiveKid = useCallback((kidId: string) => {
    setState((prev) => ({
      ...prev,
      settings: { ...prev.settings, activeKid: kidId },
    }));
  }, []);

  const addTask = useCallback((routineType: RoutineType, label: string) => {
    const trimmed = label.trim();
    if (!trimmed) return;
    setState((prev) => {
      const tasks = prev.routines[routineType];
      const newTask: Task = {
        id: `${routineType}-${Date.now()}`,
        label: trimmed,
        order: tasks.length + 1,
      };
      return {
        ...prev,
        routines: {
          ...prev.routines,
          [routineType]: [...tasks, newTask],
        },
      };
    });
  }, []);

  const removeTask = useCallback((routineType: RoutineType, taskId: string) => {
    setState((prev) => {
      const tasks = prev.routines[routineType]
        .filter((t) => t.id !== taskId)
        .map((t, i) => ({ ...t, order: i + 1 }));
      return pruneStaleCompletions({
        ...prev,
        routines: { ...prev.routines, [routineType]: tasks },
      });
    });
  }, []);

  const reorderTask = useCallback((routineType: RoutineType, taskId: string, direction: "up" | "down") => {
    setState((prev) => {
      const tasks = [...prev.routines[routineType]];
      const idx = tasks.findIndex((t) => t.id === taskId);
      if (idx < 0) return prev;
      const swapIdx = direction === "up" ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= tasks.length) return prev;
      [tasks[idx], tasks[swapIdx]] = [tasks[swapIdx], tasks[idx]];
      const renumbered = tasks.map((t, i) => ({ ...t, order: i + 1 }));
      return {
        ...prev,
        routines: { ...prev.routines, [routineType]: renumbered },
      };
    });
  }, []);

  const addKid = useCallback((name: string, animal: AnimalId, chosenTheme?: ColorTheme) => {
    setState((prev) => {
      if (prev.kids.length >= 5) return prev;
      const usedThemes = new Set(prev.kids.map((k) => k.theme));
      const theme = chosenTheme ?? THEME_ORDER.find((t) => !usedThemes.has(t)) ?? THEME_ORDER[0];
      const newKid: Kid = {
        id: `kid-${Date.now()}`,
        name,
        animal,
        theme,
      };
      const newKids = [...prev.kids, newKid];

      // Add empty records to all history days
      const history = { ...prev.history };
      for (const key of Object.keys(history)) {
        history[key] = {
          ...history[key],
          [newKid.id]: { morning: { completed: [] }, bedtime: { completed: [] } },
        };
      }

      return { ...prev, kids: newKids, history };
    });
  }, []);

  const removeKid = useCallback((kidId: string) => {
    setState((prev) => {
      if (prev.kids.length <= 1) return prev;
      const newKids = prev.kids.filter((k) => k.id !== kidId);

      // Clean history
      const history = { ...prev.history };
      for (const key of Object.keys(history)) {
        const dayRec = { ...history[key] };
        delete dayRec[kidId];
        history[key] = dayRec;
      }

      // Switch activeKid if removed
      const activeKid = prev.settings.activeKid === kidId ? newKids[0].id : prev.settings.activeKid;

      return {
        ...prev,
        kids: newKids,
        history,
        settings: { ...prev.settings, activeKid },
      };
    });
  }, []);

  const updateKid = useCallback((kidId: string, updates: Partial<Pick<Kid, "name" | "animal" | "theme">>) => {
    setState((prev) => ({
      ...prev,
      kids: prev.kids.map((k) => (k.id === kidId ? { ...k, ...updates } : k)),
    }));
  }, []);

  // Calculate streak for a routine type (scoped to active kid)
  const getStreak = useCallback(
    (routineType: RoutineType): number => {
      const tasks = state.routines[routineType];
      const kid = state.settings.activeKid;
      let streak = 0;
      const d = new Date();

      // Check if today is complete — if so, count it
      const todayKey = d.toISOString().slice(0, 10);
      const todayRec = state.history[todayKey];
      if (
        todayRec?.[kid] &&
        todayRec[kid][routineType].completed.length === tasks.length
      ) {
        streak++;
      }

      // Walk backwards from yesterday
      for (let i = 1; i <= 365; i++) {
        const prev = new Date();
        prev.setDate(prev.getDate() - i);
        const key = prev.toISOString().slice(0, 10);
        const rec = state.history[key];
        if (rec?.[kid] && rec[kid][routineType].completed.length === tasks.length) {
          streak++;
        } else {
          break;
        }
      }
      return streak;
    },
    [state]
  );

  return {
    state,
    loaded,
    todayRecord,
    toggleTask,
    toggleDarkMode,
    setActiveKid,
    addTask,
    removeTask,
    reorderTask,
    getStreak,
    activeKid,
    kids,
    addKid,
    removeKid,
    updateKid,
  };
}
