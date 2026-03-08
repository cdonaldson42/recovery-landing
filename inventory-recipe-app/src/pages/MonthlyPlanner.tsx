import { useState } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
  getDay,
} from 'date-fns';
import { THEMES } from '@/data/themes';
import { RECIPES } from '@/data/recipes';
import { useAppStore } from '@/stores/appStore';
import type { PlannedMeal } from '@/lib/types';

const DAY_NAMES = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;
const DAY_HEADERS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function MonthlyPlanner() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const { plannedMeals, addPlannedMeal, removePlannedMeal } = useAppStore();

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calStart = startOfWeek(monthStart);
  const calEnd = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  const getMealsForDate = (date: Date): PlannedMeal[] => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return plannedMeals.filter((m) => m.date === dateStr);
  };

  const getThemeForDate = (date: Date) => {
    const dayName = DAY_NAMES[getDay(date)]!;
    return THEMES[dayName]!;
  };

  return (
    <div className="px-2 lg:px-4">
      {/* Desktop: side-by-side. Mobile: stacked */}
      <div className="flex flex-col lg:flex-row lg:gap-6">
        {/* Calendar column */}
        <div className={`${selectedDay ? 'lg:flex-1' : 'w-full'} min-w-0`}>
          {/* Month header with nav */}
          <div className="flex items-center justify-between mb-3 px-2">
            <button
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500"
            >
              <ChevronLeft />
            </button>
            <h2 className="text-lg font-bold text-gray-900">
              {format(currentMonth, 'MMMM yyyy')}
            </h2>
            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500"
            >
              <ChevronRight />
            </button>
          </div>

          {/* Day of week headers */}
          <div className="grid grid-cols-7 mb-1">
            {DAY_HEADERS.map((d) => (
              <div key={d} className="text-center text-xs font-medium text-gray-400 py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-xl overflow-hidden">
            {days.map((day) => {
              const theme = getThemeForDate(day);
              const meals = getMealsForDate(day);
              const inMonth = isSameMonth(day, currentMonth);
              const today = isToday(day);
              const selected = selectedDay && isSameDay(day, selectedDay);

              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDay(selected ? null : day)}
                  className={`flex flex-col items-start p-1.5 lg:p-2 min-h-[72px] lg:min-h-[90px] text-left transition-colors ${
                    !inMonth ? 'bg-gray-50 opacity-40' : 'bg-white hover:bg-amber-50/30'
                  } ${selected ? 'ring-2 ring-amber-500 ring-inset bg-amber-50/50' : ''}`}
                >
                  <div className="flex items-center gap-1 w-full">
                    <span className={`text-xs lg:text-sm font-semibold w-5 h-5 lg:w-6 lg:h-6 flex items-center justify-center rounded-full ${
                      today
                        ? 'bg-amber-600 text-white'
                        : inMonth ? 'text-gray-700' : 'text-gray-400'
                    }`}>
                      {format(day, 'd')}
                    </span>
                    <span className="text-[10px] lg:text-xs">{theme.emoji}</span>
                  </div>
                  {meals.length > 0 ? (
                    <div className="mt-0.5 space-y-px w-full">
                      {meals.slice(0, 2).map((meal) => (
                        <div
                          key={meal.id}
                          className="text-[9px] lg:text-[11px] leading-tight text-amber-700 bg-amber-50 rounded px-1 py-px truncate"
                        >
                          {meal.customName ?? RECIPES.find((r) => r.id === meal.recipeId)?.name ?? 'Meal'}
                        </div>
                      ))}
                      {meals.length > 2 && (
                        <div className="text-[9px] lg:text-[11px] text-gray-400">+{meals.length - 2} more</div>
                      )}
                    </div>
                  ) : (
                    <div className="mt-0.5 text-[9px] lg:text-[11px] leading-tight text-gray-300 truncate">
                      {theme.label}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Day detail column — right pane on desktop, below on mobile */}
        {selectedDay && (
          <div className="lg:w-[380px] lg:shrink-0 mt-4 lg:mt-0 lg:sticky lg:top-16 lg:self-start lg:max-h-[calc(100vh-5rem)] lg:overflow-y-auto">
            <DayDetail
              day={selectedDay}
              theme={getThemeForDate(selectedDay)}
              meals={getMealsForDate(selectedDay)}
              onAddMeal={addPlannedMeal}
              onRemoveMeal={removePlannedMeal}
              onClose={() => setSelectedDay(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Icons ───

function ChevronLeft() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

function XIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

// ─── Day Detail Panel ───

function DayDetail({
  day,
  theme,
  meals,
  onAddMeal,
  onRemoveMeal,
  onClose,
}: {
  day: Date;
  theme: { label: string; emoji: string; description: string; mealSlots: Record<string, { label: string; categories: string[]; note: string }> };
  meals: PlannedMeal[];
  onAddMeal: (meal: PlannedMeal) => void;
  onRemoveMeal: (id: string) => void;
  onClose: () => void;
}) {
  const [showPicker, setShowPicker] = useState<string | null>(null);
  const dateStr = format(day, 'yyyy-MM-dd');

  const slotsToShow = Object.entries(theme.mealSlots);
  const categories = slotsToShow.flatMap(([, slot]) => slot.categories);
  const matchingRecipes = RECIPES.filter((r) => categories.includes(r.category));

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs font-medium text-amber-600 uppercase tracking-wide">
            {format(day, 'EEEE, MMM d')}
          </p>
          <h3 className="text-base font-bold text-gray-900">
            {theme.emoji} {theme.label}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400"
        >
          <XIcon />
        </button>
      </div>

      <p className="text-sm text-gray-500 mb-4">{theme.description}</p>

      {slotsToShow.map(([slotKey, slot]) => {
        const slotMeals = meals.filter((m) => m.slot === slotKey);
        const slotRecipes = RECIPES.filter((r) => slot.categories.includes(r.category));

        return (
          <div key={slotKey} className="mb-4 last:mb-0">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-gray-700">{slot.label}</h4>
            </div>
            <p className="text-xs text-gray-400 mb-2">{slot.note}</p>

            {slotMeals.length > 0 && (
              <div className="space-y-1.5 mb-2">
                {slotMeals.map((meal) => {
                  const recipe = RECIPES.find((r) => r.id === meal.recipeId);
                  return (
                    <div
                      key={meal.id}
                      className="flex items-center justify-between bg-amber-50 rounded-lg px-3 py-2"
                    >
                      <span className="text-sm font-medium text-amber-800">
                        {meal.customName ?? recipe?.name ?? 'Meal'}
                      </span>
                      <button
                        onClick={() => onRemoveMeal(meal.id)}
                        className="text-amber-400 hover:text-red-500 transition-colors"
                      >
                        <XIcon />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {showPicker === slotKey ? (
              <RecipePicker
                recipes={slotRecipes}
                allRecipes={matchingRecipes}
                onSelect={(recipeId, customName) => {
                  onAddMeal({
                    id: `${dateStr}-${slotKey}-${Date.now()}`,
                    date: dateStr,
                    slot: slotKey as PlannedMeal['slot'],
                    recipeId,
                    customName,
                  });
                  setShowPicker(null);
                }}
                onCancel={() => setShowPicker(null)}
              />
            ) : (
              <button
                onClick={() => setShowPicker(slotKey)}
                className="w-full py-2 border-2 border-dashed border-gray-200 rounded-lg text-sm text-gray-400 hover:border-amber-400 hover:text-amber-600 transition-colors"
              >
                + Add meal
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Recipe Picker ───

function RecipePicker({
  recipes,
  allRecipes,
  onSelect,
  onCancel,
}: {
  recipes: typeof RECIPES;
  allRecipes: typeof RECIPES;
  onSelect: (recipeId: string | null, customName?: string) => void;
  onCancel: () => void;
}) {
  const [custom, setCustom] = useState('');
  const [showAll, setShowAll] = useState(false);
  const displayRecipes = showAll ? allRecipes : recipes;

  return (
    <div className="bg-gray-50 rounded-xl p-3 space-y-2">
      {displayRecipes.length > 0 && (
        <div className="space-y-1 max-h-48 overflow-y-auto">
          {displayRecipes.map((r) => (
            <button
              key={r.id}
              onClick={() => onSelect(r.id)}
              className="w-full text-left px-3 py-2 rounded-lg bg-white hover:bg-amber-50 text-sm text-gray-700 hover:text-amber-700 transition-colors"
            >
              <span className="font-medium">{r.name}</span>
              {r.note && <span className="text-xs text-gray-400 ml-2">{r.note}</span>}
            </button>
          ))}
        </div>
      )}

      {!showAll && allRecipes.length > recipes.length && (
        <button
          onClick={() => setShowAll(true)}
          className="text-xs text-amber-600 hover:text-amber-700"
        >
          Show all {allRecipes.length} options
        </button>
      )}

      <div className="flex gap-2 pt-1 border-t border-gray-200">
        <input
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && custom.trim()) {
              onSelect(null, custom.trim());
            }
          }}
          placeholder="Or type a custom meal..."
          className="flex-1 min-w-0 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-amber-500"
        />
        {custom.trim() && (
          <button
            onClick={() => onSelect(null, custom.trim())}
            className="px-3 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium"
          >
            Add
          </button>
        )}
      </div>
      <button
        onClick={onCancel}
        className="text-xs text-gray-400 hover:text-gray-600"
      >
        Cancel
      </button>
    </div>
  );
}
