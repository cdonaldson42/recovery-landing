"use client";

import { useState, useEffect, useCallback } from "react";
import { AppState, RoutineType, KidDayRecord, KidId } from "@/lib/types";
import { DEFAULT_STATE } from "@/lib/defaults";
import { loadState, saveState, getToday } from "@/lib/storage";

const EMPTY_KID_DAY: KidDayRecord = {
  morning: { completed: [] },
  bedtime: { completed: [] },
};

function ensureToday(state: AppState): AppState {
  const today = getToday();
  if (state.history[today]) return state;
  return {
    ...state,
    history: {
      ...state.history,
      [today]: {
        kid1: { ...EMPTY_KID_DAY, morning: { completed: [] }, bedtime: { completed: [] } },
        kid2: { ...EMPTY_KID_DAY, morning: { completed: [] }, bedtime: { completed: [] } },
      },
    },
  };
}

export function useRoutineStore() {
  const [state, setState] = useState<AppState>(DEFAULT_STATE);
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const s = ensureToday(loadState());
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
        const dayRec = s.history[today];
        const kidRec = dayRec[kid];
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
    getStreak,
    activeKid,
  };
}
