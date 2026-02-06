"use client";

import { useState, useEffect, useCallback } from "react";
import { AppState, RoutineType, KidDayRecord, KidId, Task } from "@/lib/types";
import { DEFAULT_STATE } from "@/lib/defaults";
import { loadState, saveState, getToday } from "@/lib/storage";

const EMPTY_KID_DAY: KidDayRecord = {
  morning: { completed: [] },
  bedtime: { completed: [] },
};

const EMPTY_DAY = {
  kid1: { morning: { completed: [] }, bedtime: { completed: [] } },
  kid2: { morning: { completed: [] }, bedtime: { completed: [] } },
};

// Migrate old flat { morning, bedtime } records to per-kid format
function migrateHistory(state: AppState): AppState {
  let changed = false;
  const history = { ...state.history };
  for (const key of Object.keys(history)) {
    const rec = history[key] as unknown as Record<string, unknown>;
    if (!("kid1" in rec)) {
      changed = true;
      const oldMorning = (rec["morning"] as KidDayRecord["morning"]) ?? { completed: [] };
      const oldBedtime = (rec["bedtime"] as KidDayRecord["bedtime"]) ?? { completed: [] };
      // Old format — move existing data to kid1, give kid2 a clean slate
      history[key] = {
        kid1: { morning: oldMorning, bedtime: oldBedtime },
        kid2: { morning: { completed: [] }, bedtime: { completed: [] } },
      };
    }
  }
  return changed ? { ...state, history } : state;
}

// Remove completed task IDs that no longer exist in the current task lists
function pruneStaleCompletions(state: AppState): AppState {
  const morningIds = new Set(state.routines.morning.map((t) => t.id));
  const bedtimeIds = new Set(state.routines.bedtime.map((t) => t.id));
  let changed = false;
  const history = { ...state.history };

  for (const key of Object.keys(history)) {
    const dayRec = history[key];
    for (const kid of ["kid1", "kid2"] as const) {
      const kidRec = dayRec[kid];
      if (!kidRec) continue;
      const cleanMorning = kidRec.morning.completed.filter((id) => morningIds.has(id));
      const cleanBedtime = kidRec.bedtime.completed.filter((id) => bedtimeIds.has(id));
      if (cleanMorning.length !== kidRec.morning.completed.length || cleanBedtime.length !== kidRec.bedtime.completed.length) {
        changed = true;
        history[key] = {
          ...dayRec,
          [kid]: {
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
  if (state.history[today]) return state;
  return {
    ...state,
    history: {
      ...state.history,
      [today]: { ...EMPTY_DAY },
    },
  };
}

export function useRoutineStore() {
  const [state, setState] = useState<AppState>(DEFAULT_STATE);
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage on mount (always use latest routines from code)
  useEffect(() => {
    const raw = loadState();
    const withRoutines = {
      ...raw,
      routines: raw.routines?.morning?.length ? raw.routines : DEFAULT_STATE.routines,
    };
    const migrated = migrateHistory(withRoutines);
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

  const todayRecord: KidDayRecord = state.history[today]?.[activeKid] ?? EMPTY_KID_DAY;

  const toggleTask = useCallback(
    (routineType: RoutineType, taskId: string) => {
      setState((prev) => {
        const s = ensureToday(prev);
        const kid = s.settings.activeKid;
        const dayRec = s.history[today] ?? EMPTY_DAY;
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

  const setActiveKid = useCallback((kidId: KidId) => {
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
  };
}
