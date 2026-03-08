import type { FreezerInventory, PantryInventory, FridgeStaple, ProteinMap } from '@/lib/types';

export const DEFAULT_FREEZER: FreezerInventory = {
  beef: {
    label: "Beef (Quarter)",
    emoji: "\u{1F969}",
    items: [
      { id: "beef-ground", label: "Ground Beef", unit: "lbs", quantity: 0 },
      { id: "beef-roast", label: "Roasts", unit: "count", quantity: 0 },
      { id: "beef-steak-ribeye", label: "Ribeye Steaks", unit: "count", quantity: 0 },
      { id: "beef-steak-sirloin", label: "Sirloin Steaks", unit: "count", quantity: 0 },
      { id: "beef-steak-other", label: "Other Steaks", unit: "count", quantity: 0 },
    ],
  },
  venison: {
    label: "Venison",
    emoji: "\u{1F98C}",
    items: [
      { id: "venison-steak", label: "Venison Steaks", unit: "count", quantity: 0 },
      { id: "venison-tenderloin", label: "Tenderloin", unit: "count", quantity: 0 },
      { id: "venison-ground", label: "Ground Venison", unit: "lbs", quantity: 0 },
    ],
  },
  pork: {
    label: "Pork",
    emoji: "\u{1F437}",
    items: [
      { id: "pork-roast", label: "Pork Roasts", unit: "count", quantity: 0 },
      { id: "pork-ham", label: "Hams", unit: "count", quantity: 0 },
      { id: "pork-chops", label: "Pork Chops", unit: "count", quantity: 0 },
      { id: "pork-ribs", label: "Ribs (racks)", unit: "count", quantity: 0 },
    ],
  },
  easy: {
    label: "Easy / Frozen Meals",
    emoji: "\u26A1",
    items: [
      { id: "easy-nuggets", label: "Chicken Nuggets", unit: "bags", quantity: 0 },
      { id: "easy-fishsticks", label: "Fish Sticks", unit: "bags", quantity: 0 },
      { id: "easy-gyoza", label: "Gyoza / Dumplings", unit: "bags", quantity: 0 },
      { id: "easy-fries", label: "French Fries", unit: "bags", quantity: 0 },
      { id: "easy-wings", label: "Chicken Wings", unit: "packs", quantity: 1 },
      { id: "easy-pizza-frozen", label: "Frozen Pizza", unit: "count", quantity: 0 },
      { id: "easy-miniquiche", label: "Mini Quiche", unit: "boxes", quantity: 0 },
      { id: "easy-waffles", label: "Frozen Waffles", unit: "boxes", quantity: 0 },
      { id: "easy-gogurt", label: "GoGurt", unit: "boxes", quantity: 0 },
    ],
  },
};

export const DEFAULT_PANTRY: PantryInventory = {
  pasta: {
    label: "Pasta & Grains",
    emoji: "\u{1F35D}",
    items: [
      { id: "pantry-pasta-spaghetti", label: "Spaghetti / Buccatini", inStock: true },
      { id: "pantry-pasta-penne", label: "Penne / Rigatoni", inStock: true },
      { id: "pantry-pasta-egg-noodles", label: "Egg Noodles", inStock: true },
      { id: "pantry-ramen", label: "Ramen Noodles", inStock: true },
      { id: "pantry-rice", label: "Rice", inStock: true },
      { id: "pantry-quinoa", label: "Quinoa", inStock: false },
    ],
  },
  sauces: {
    label: "Sauces & Canned",
    emoji: "\u{1F96B}",
    items: [
      { id: "pantry-tomato-sauce", label: "Canned Tomato Sauce", inStock: true },
      { id: "pantry-crushed-tomato", label: "Crushed Tomatoes", inStock: true },
      { id: "pantry-enchilada-sauce", label: "Enchilada Sauce", inStock: true },
      { id: "pantry-alfredo-jar", label: "Alfredo Sauce (jar)", inStock: false },
      { id: "pantry-coconut-milk", label: "Coconut Milk", inStock: false },
      { id: "pantry-broth-beef", label: "Beef Broth", inStock: true },
      { id: "pantry-broth-chicken", label: "Chicken Broth", inStock: true },
      { id: "pantry-beans-black", label: "Black Beans (canned)", inStock: true },
      { id: "pantry-beans-kidney", label: "Kidney Beans (canned)", inStock: true },
      { id: "pantry-lentils", label: "Lentils (dried)", inStock: false },
    ],
  },
  baking: {
    label: "Baking & Breakfast",
    emoji: "\u{1F95E}",
    items: [
      { id: "pantry-pancake-mix", label: "Pancake Mix", inStock: true },
      { id: "pantry-syrup", label: "Maple Syrup", inStock: true },
      { id: "pantry-oatmeal", label: "Oatmeal", inStock: true },
      { id: "pantry-cereal", label: "Cereal", inStock: true },
      { id: "pantry-granola", label: "Granola", inStock: false },
    ],
  },
  wraps: {
    label: "Wraps & Bread",
    emoji: "\u{1FAD3}",
    items: [
      { id: "pantry-tortillas", label: "Tortillas", inStock: true },
      { id: "pantry-bread", label: "Bread / Sandwich Bread", inStock: true },
      { id: "pantry-bagels", label: "Bagels", inStock: false },
      { id: "pantry-pizza-dough", label: "Pizza Dough / Mix", inStock: true },
      { id: "pantry-pizza-sauce", label: "Pizza Sauce", inStock: true },
    ],
  },
  snacks: {
    label: "Snacks & Lunch Extras",
    emoji: "\u{1F968}",
    items: [
      { id: "pantry-chips", label: "Chips", inStock: true },
      { id: "pantry-crackers", label: "Crackers / Goldfish", inStock: true },
      { id: "pantry-pb", label: "Peanut Butter", inStock: true },
      { id: "pantry-jelly", label: "Jelly / Jam", inStock: true },
      { id: "pantry-granola-bars", label: "Granola Bars", inStock: true },
    ],
  },
};

export const FRIDGE_STAPLES: FridgeStaple[] = [
  { id: "fridge-butter", label: "Butter" },
  { id: "fridge-eggs", label: "Eggs" },
  { id: "fridge-milk", label: "Milk" },
  { id: "fridge-cheese-shredded", label: "Shredded Cheese" },
  { id: "fridge-cheese-sliced", label: "Sliced Cheese" },
  { id: "fridge-garlic", label: "Garlic" },
  { id: "fridge-onion", label: "Onions" },
  { id: "fridge-olive-oil", label: "Olive Oil" },
  { id: "fridge-sour-cream", label: "Sour Cream" },
  { id: "fridge-salsa", label: "Salsa" },
  { id: "fridge-cream-cheese", label: "Cream Cheese" },
  { id: "fridge-bacon", label: "Bacon" },
  { id: "fridge-sausage", label: "Breakfast Sausage" },
];

export const PROTEIN_MAP: ProteinMap = {
  beef: ["beef-ground", "beef-roast", "beef-steak-ribeye", "beef-steak-sirloin", "beef-steak-other"],
  venison: ["venison-steak", "venison-tenderloin", "venison-ground"],
  pork: ["pork-roast", "pork-ham", "pork-chops", "pork-ribs"],
  easy: ["easy-nuggets", "easy-fishsticks", "easy-gyoza", "easy-wings", "easy-pizza-frozen"],
};
