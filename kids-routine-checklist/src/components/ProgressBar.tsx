"use client";

import { useEffect, useState } from "react";

interface ProgressBarProps {
  completed: number;
  total: number;
}

export default function ProgressBar({ completed, total }: ProgressBarProps) {
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);
  const [showMilestone, setShowMilestone] = useState<string | null>(null);
  const [prevPct, setPrevPct] = useState(pct);

  useEffect(() => {
    // Detect crossing milestones (going up only)
    if (pct > prevPct) {
      if (pct >= 100 && prevPct < 100) {
        setShowMilestone("🎉 All done!");
      } else if (pct >= 50 && prevPct < 50) {
        setShowMilestone("⭐ Halfway there!");
      }
    }
    setPrevPct(pct);
  }, [pct, prevPct]);

  useEffect(() => {
    if (showMilestone) {
      const t = setTimeout(() => setShowMilestone(null), 1800);
      return () => clearTimeout(t);
    }
  }, [showMilestone]);

  // Color shifts from amber to green
  const barColor =
    pct < 40
      ? "bg-amber-400"
      : pct < 70
        ? "bg-yellow-400"
        : pct < 100
          ? "bg-lime-400"
          : "bg-green-400";

  return (
    <div className="relative w-full">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-semibold dark:text-gray-200">
          {completed}/{total} tasks
        </span>
        <span className="text-sm font-bold dark:text-gray-200">{pct}%</span>
      </div>
      <div className="w-full h-4 bg-[var(--surface-dim)] rounded-full overflow-hidden transition-colors duration-400">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${barColor} ${
            showMilestone ? "animate-bounce" : ""
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showMilestone && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[var(--surface)] px-3 py-1 rounded-full shadow-lg text-sm font-bold animate-bounce whitespace-nowrap">
          {showMilestone}
        </div>
      )}
    </div>
  );
}
