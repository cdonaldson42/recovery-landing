import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppMode, FreezerInventory, PantryInventory, PlannedMeal, ShoppingListItem } from '@/lib/types';
import { DEFAULT_FREEZER, DEFAULT_PANTRY } from '@/data/inventory';

type AppState = {
  // Navigation
  activeMode: AppMode;
  setActiveMode: (mode: AppMode) => void;

  // Calendar
  selectedDate: string;
  setSelectedDate: (date: string) => void;

  // Inventory
  freezer: FreezerInventory;
  pantry: PantryInventory;
  updateFreezerQuantity: (categoryKey: string, itemId: string, quantity: number) => void;
  addFreezerItem: (categoryKey: string, label: string, unit: string) => void;
  removeFreezerItem: (categoryKey: string, itemId: string) => void;
  addFreezerCategory: (key: string, label: string, emoji: string) => void;
  togglePantryItem: (categoryKey: string, itemId: string) => void;
  addPantryItem: (categoryKey: string, label: string) => void;
  removePantryItem: (categoryKey: string, itemId: string) => void;
  addPantryCategory: (key: string, label: string, emoji: string) => void;

  // Meal planning
  plannedMeals: PlannedMeal[];
  addPlannedMeal: (meal: PlannedMeal) => void;
  removePlannedMeal: (mealId: string) => void;
  shoppingList: ShoppingListItem[];
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Navigation
      activeMode: 'planner',
      setActiveMode: (mode) => set({ activeMode: mode }),

      // Calendar
      selectedDate: new Date().toISOString().split('T')[0]!,
      setSelectedDate: (date) => set({ selectedDate: date }),

      // Inventory
      freezer: structuredClone(DEFAULT_FREEZER),
      pantry: structuredClone(DEFAULT_PANTRY),

      updateFreezerQuantity: (categoryKey, itemId, quantity) =>
        set((state) => {
          const freezer = structuredClone(state.freezer);
          const category = freezer[categoryKey];
          if (!category) return state;
          const item = category.items.find((i) => i.id === itemId);
          if (!item) return state;
          item.quantity = Math.max(0, quantity);
          return { freezer };
        }),

      addFreezerItem: (categoryKey, label, unit) =>
        set((state) => {
          const freezer = structuredClone(state.freezer);
          const category = freezer[categoryKey];
          if (!category) return state;
          const id = `${categoryKey}-${label.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
          category.items.push({ id, label, unit, quantity: 0 });
          return { freezer };
        }),

      removeFreezerItem: (categoryKey, itemId) =>
        set((state) => {
          const freezer = structuredClone(state.freezer);
          const category = freezer[categoryKey];
          if (!category) return state;
          category.items = category.items.filter((i) => i.id !== itemId);
          return { freezer };
        }),

      addFreezerCategory: (key, label, emoji) =>
        set((state) => {
          const freezer = structuredClone(state.freezer);
          freezer[key] = { label, emoji, items: [] };
          return { freezer };
        }),

      togglePantryItem: (categoryKey, itemId) =>
        set((state) => {
          const pantry = structuredClone(state.pantry);
          const category = pantry[categoryKey];
          if (!category) return state;
          const item = category.items.find((i) => i.id === itemId);
          if (!item) return state;
          item.inStock = !item.inStock;
          return { pantry };
        }),

      addPantryItem: (categoryKey, label) =>
        set((state) => {
          const pantry = structuredClone(state.pantry);
          const category = pantry[categoryKey];
          if (!category) return state;
          const id = `pantry-${label.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
          category.items.push({ id, label, inStock: true });
          return { pantry };
        }),

      removePantryItem: (categoryKey, itemId) =>
        set((state) => {
          const pantry = structuredClone(state.pantry);
          const category = pantry[categoryKey];
          if (!category) return state;
          category.items = category.items.filter((i) => i.id !== itemId);
          return { pantry };
        }),

      addPantryCategory: (key, label, emoji) =>
        set((state) => {
          const pantry = structuredClone(state.pantry);
          pantry[key] = { label, emoji, items: [] };
          return { pantry };
        }),

      // Meal planning
      plannedMeals: [],
      addPlannedMeal: (meal) =>
        set((state) => ({ plannedMeals: [...state.plannedMeals, meal] })),
      removePlannedMeal: (mealId) =>
        set((state) => ({
          plannedMeals: state.plannedMeals.filter((m) => m.id !== mealId),
        })),
      shoppingList: [],
    }),
    {
      name: 'donaldson-dinners-storage',
    },
  ),
);
