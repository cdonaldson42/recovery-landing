// === Inventory ===

export type FreezerItem = {
  id: string;
  label: string;
  unit: string;
  quantity: number;
};

export type FreezerCategory = {
  label: string;
  emoji: string;
  items: FreezerItem[];
};

export type FreezerInventory = Record<string, FreezerCategory>;

export type PantryItem = {
  id: string;
  label: string;
  inStock: boolean;
};

export type PantryCategory = {
  label: string;
  emoji: string;
  items: PantryItem[];
};

export type PantryInventory = Record<string, PantryCategory>;

export type FridgeStaple = {
  id: string;
  label: string;
};

export type ProteinMap = Record<string, string[]>;

// === Themes ===

export type MealSlot = {
  label: string;
  categories: string[];
  note: string;
};

export type ThemeDay = {
  label: string;
  emoji: string;
  description: string;
  mealSlots: Record<string, MealSlot>;
};

export type Themes = Record<string, ThemeDay>;

// === Recipes ===

export type CloseMatch = {
  missingItem: string;
  suggestion: string;
};

export type Recipe = {
  id: string;
  name: string;
  category: string;
  themeDay: string | null;
  requiredProteins: string[];
  pantryNeeds: string[];
  fridgeNeeds: string[];
  note?: string;
  servings?: string;
  lunchCarryover?: boolean;
  isDelivery?: boolean;
  closeMatch?: CloseMatch;
  isCloseMatch?: boolean;
};

export type MatchedRecipe = Recipe & {
  missingProteins: string[];
  missingPantry: string[];
  totalMissing: number;
  matchTier: 1 | 2 | 3 | 4;
};

// === Meal Planning ===

export type PlannedMeal = {
  id: string;
  date: string;
  slot: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  recipeId: string | null;
  customName?: string;
  notes?: string;
};

// === Shopping ===

export type ShoppingListItem = {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  isPurchased: boolean;
  source: 'staple_restock' | 'recipe_need' | 'manual';
};

// === App ===

export type AppMode = 'planner' | 'grocery' | 'emergency' | 'fun';
