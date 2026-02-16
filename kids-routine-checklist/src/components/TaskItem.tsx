"use client";

import { useState, useEffect, useRef } from "react";
import { Task } from "@/lib/types";
import { getRandomThemeAnimal } from "@/lib/dailyTheme";

interface TaskItemProps {
  task: Task;
  isCompleted: boolean;
  onToggle: () => void;
  onRemove?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

export default function TaskItem({ task, isCompleted, onToggle, onRemove, onMoveUp, onMoveDown }: TaskItemProps) {
  const [pressing, setPressing] = useState(false);
  const [miniCelebration, setMiniCelebration] = useState<string | null>(null);
  const wasCompleted = useRef(isCompleted);

  useEffect(() => {
    if (isCompleted && !wasCompleted.current) {
      const animal = getRandomThemeAnimal();
      setMiniCelebration(animal);
      const timer = setTimeout(() => setMiniCelebration(null), 1200);
      return () => clearTimeout(timer);
    }
    wasCompleted.current = isCompleted;
  }, [isCompleted]);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onToggle(); }}
      onMouseDown={() => setPressing(true)}
      onMouseUp={() => setPressing(false)}
      onMouseLeave={() => setPressing(false)}
      onTouchStart={() => setPressing(true)}
      onTouchEnd={() => setPressing(false)}
      className={`
        relative w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-300 cursor-pointer select-none overflow-hidden
        ${pressing ? "scale-95" : "scale-100"}
        ${
          isCompleted
            ? "border-green-300 bg-green-50 dark:bg-[rgba(3,46,21,0.3)] dark:border-green-800 opacity-75"
            : "border-gray-200 dark:border-gray-700 bg-[var(--surface)] hover:border-[var(--accent)] hover:shadow-md"
        }
      `}
    >
      {/* Mini animal celebration */}
      {miniCelebration && (
        <>
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl animate-task-animal-pop pointer-events-none z-10">
            {miniCelebration}
          </span>
          <span className="absolute right-4 top-0 text-2xl animate-task-animal-float pointer-events-none z-10" style={{ animationDelay: "0.1s" }}>
            {miniCelebration}
          </span>
          <span className="absolute left-4 top-0 text-xl animate-task-animal-float pointer-events-none z-10" style={{ animationDelay: "0.25s" }}>
            {miniCelebration}
          </span>
          <div className="absolute inset-0 animate-task-flash pointer-events-none rounded-2xl z-0" />
        </>
      )}

      {/* Animated checkmark circle */}
      <div
        className={`
          relative flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300
          ${
            isCompleted
              ? "border-green-500 bg-green-500"
              : "border-gray-300 dark:border-gray-600"
          }
        `}
      >
        {isCompleted && (
          <svg
            className="w-5 h-5 text-white animate-check"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path
              d="M5 13l4 4L19 7"
              className="animate-draw-check"
            />
          </svg>
        )}
      </div>

      {/* Task label */}
      <span
        className={`
          text-lg font-medium transition-all duration-300 flex-1
          ${
            isCompleted
              ? "line-through text-gray-400 dark:text-gray-500"
              : "text-gray-800 dark:text-gray-100"
          }
        `}
      >
        {task.label}
      </span>

      {/* Reorder + remove controls */}
      <div className="flex items-center gap-1 ml-auto flex-shrink-0" onClick={(e) => e.stopPropagation()}>
        {onMoveUp && (
          <button
            type="button"
            onClick={onMoveUp}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 dark:text-gray-500 hover:bg-[var(--surface-dim)] hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
            aria-label="Move up"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
            </svg>
          </button>
        )}
        {onMoveDown && (
          <button
            type="button"
            onClick={onMoveDown}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 dark:text-gray-500 hover:bg-[var(--surface-dim)] hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
            aria-label="Move down"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 dark:text-gray-500 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-500 transition-colors cursor-pointer"
            aria-label="Remove task"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
