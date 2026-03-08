import type { Recipe, MatchedRecipe } from '@/lib/types';

export const RECIPES: Recipe[] = [

  // ================================================================
  // CROCK POT — Sunday dinners (sets the week for lunches)
  // ================================================================
  {
    id: "crock-beef-roast",
    name: "Beef Roast",
    category: "crock-pot",
    themeDay: "sunday",
    requiredProteins: ["beef-roast"],
    pantryNeeds: ["pantry-broth-beef"],
    fridgeNeeds: ["fridge-onion", "fridge-garlic"],
    note: "Set in morning. Shreds for lunches Mon\u2013Wed.",
    servings: "6\u20138",
    lunchCarryover: true,
  },
  {
    id: "crock-pork-roast",
    name: "Pulled Pork",
    category: "crock-pot",
    themeDay: "sunday",
    requiredProteins: ["pork-roast"],
    pantryNeeds: [],
    fridgeNeeds: ["fridge-onion"],
    note: "Pulled pork sandwiches for lunch all week.",
    servings: "6\u20138",
    lunchCarryover: true,
  },
  {
    id: "crock-chili-beef",
    name: "Beef Chili",
    category: "crock-pot",
    themeDay: "sunday",
    requiredProteins: ["beef-ground"],
    pantryNeeds: ["pantry-beans-kidney", "pantry-crushed-tomato", "pantry-broth-beef"],
    fridgeNeeds: ["fridge-onion", "fridge-garlic"],
    note: "Great for lunches. Serve with crackers or cornbread.",
    servings: "6\u20138",
    lunchCarryover: true,
  },
  {
    id: "crock-chili-venison",
    name: "Venison Chili",
    category: "crock-pot",
    themeDay: "sunday",
    requiredProteins: ["venison-ground"],
    pantryNeeds: ["pantry-beans-kidney", "pantry-crushed-tomato", "pantry-broth-beef"],
    fridgeNeeds: ["fridge-onion", "fridge-garlic"],
    note: "Same as beef chili, great use of ground venison.",
    servings: "6\u20138",
    lunchCarryover: true,
  },
  {
    id: "crock-ham",
    name: "Ham (Crock Pot)",
    category: "crock-pot",
    themeDay: "sunday",
    requiredProteins: ["pork-ham"],
    pantryNeeds: [],
    fridgeNeeds: [],
    note: "Ham sandwiches for lunches all week.",
    servings: "6\u20138",
    lunchCarryover: true,
  },

  // ================================================================
  // TACO TUESDAY
  // ================================================================
  {
    id: "tacos-beef",
    name: "Beef Tacos",
    category: "taco-tuesday",
    themeDay: "tuesday",
    requiredProteins: ["beef-ground"],
    pantryNeeds: ["pantry-tortillas"],
    fridgeNeeds: ["fridge-cheese-shredded", "fridge-sour-cream", "fridge-salsa"],
    note: "Classic ground beef tacos.",
  },
  {
    id: "tacos-venison",
    name: "Venison Tacos",
    category: "taco-tuesday",
    themeDay: "tuesday",
    requiredProteins: ["venison-ground"],
    pantryNeeds: ["pantry-tortillas"],
    fridgeNeeds: ["fridge-cheese-shredded", "fridge-sour-cream", "fridge-salsa"],
    note: "Same as beef tacos \u2014 venison works great.",
  },
  {
    id: "enchiladas-beef",
    name: "Beef Enchiladas",
    category: "taco-tuesday",
    themeDay: "tuesday",
    requiredProteins: ["beef-ground"],
    pantryNeeds: ["pantry-tortillas", "pantry-enchilada-sauce"],
    fridgeNeeds: ["fridge-cheese-shredded"],
    note: "Baked enchiladas.",
  },
  {
    id: "enchiladas-venison",
    name: "Venison Enchiladas",
    category: "taco-tuesday",
    themeDay: "tuesday",
    requiredProteins: ["venison-ground"],
    pantryNeeds: ["pantry-tortillas", "pantry-enchilada-sauce"],
    fridgeNeeds: ["fridge-cheese-shredded"],
  },
  {
    id: "burritos",
    name: "Burritos",
    category: "taco-tuesday",
    themeDay: "tuesday",
    requiredProteins: ["beef-ground", "venison-ground"],
    pantryNeeds: ["pantry-tortillas", "pantry-rice", "pantry-beans-black"],
    fridgeNeeds: ["fridge-cheese-shredded", "fridge-sour-cream", "fridge-salsa"],
  },
  {
    id: "quesadillas",
    name: "Quesadillas",
    category: "taco-tuesday",
    themeDay: "tuesday",
    requiredProteins: [],
    pantryNeeds: ["pantry-tortillas"],
    fridgeNeeds: ["fridge-cheese-shredded"],
    note: "Easy fallback. Add leftover meat if available.",
  },
  {
    id: "nachos",
    name: "Nachos",
    category: "taco-tuesday",
    themeDay: "tuesday",
    requiredProteins: ["beef-ground"],
    pantryNeeds: ["pantry-chips", "pantry-beans-black"],
    fridgeNeeds: ["fridge-cheese-shredded", "fridge-sour-cream", "fridge-salsa"],
  },

  // ================================================================
  // PASTA WEDNESDAY
  // ================================================================
  {
    id: "bolognese",
    name: "Bolognese",
    category: "pasta",
    themeDay: "wednesday",
    requiredProteins: ["beef-ground"],
    pantryNeeds: ["pantry-pasta-spaghetti", "pantry-crushed-tomato", "pantry-tomato-sauce"],
    fridgeNeeds: ["fridge-onion", "fridge-garlic", "fridge-butter"],
    note: "Rich meat sauce. One of the family favorites.",
  },
  {
    id: "bolognese-venison",
    name: "Venison Bolognese",
    category: "pasta",
    themeDay: "wednesday",
    requiredProteins: ["venison-ground"],
    pantryNeeds: ["pantry-pasta-spaghetti", "pantry-crushed-tomato", "pantry-tomato-sauce"],
    fridgeNeeds: ["fridge-onion", "fridge-garlic", "fridge-butter"],
  },
  {
    id: "alfredo",
    name: "Alfredo",
    category: "pasta",
    themeDay: "wednesday",
    requiredProteins: [],
    pantryNeeds: ["pantry-pasta-penne"],
    fridgeNeeds: ["fridge-butter", "fridge-cheese-shredded", "fridge-milk"],
    note: "Made from scratch or jarred sauce.",
    closeMatch: {
      missingItem: "pantry-alfredo-jar",
      suggestion: "No jarred alfredo \u2014 make butter & parmesan sauce instead",
    },
  },
  {
    id: "buccatini",
    name: "Buccatini",
    category: "pasta",
    themeDay: "wednesday",
    requiredProteins: [],
    pantryNeeds: ["pantry-pasta-spaghetti", "pantry-tomato-sauce"],
    fridgeNeeds: ["fridge-garlic", "fridge-butter"],
  },
  {
    id: "lemon-garlic-pasta",
    name: "Lemon Garlic Pasta",
    category: "pasta",
    themeDay: "wednesday",
    requiredProteins: [],
    pantryNeeds: ["pantry-pasta-penne"],
    fridgeNeeds: ["fridge-garlic", "fridge-butter", "fridge-cheese-shredded"],
    note: "Great when out of red sauce. Light and fast.",
    isCloseMatch: true,
  },
  {
    id: "mac-cheese",
    name: "Mac & Cheese",
    category: "pasta",
    themeDay: "wednesday",
    requiredProteins: [],
    pantryNeeds: ["pantry-pasta-penne"],
    fridgeNeeds: ["fridge-butter", "fridge-milk", "fridge-cheese-shredded"],
    note: "Homemade. Kids love it.",
  },
  {
    id: "beef-stroganoff",
    name: "Beef Stroganoff",
    category: "pasta",
    themeDay: "wednesday",
    requiredProteins: ["beef-steak-other", "beef-ground"],
    pantryNeeds: ["pantry-pasta-egg-noodles", "pantry-broth-beef"],
    fridgeNeeds: ["fridge-butter", "fridge-sour-cream", "fridge-onion", "fridge-garlic"],
  },
  {
    id: "ramen-bowl",
    name: "Ramen Bowl",
    category: "pasta",
    themeDay: "wednesday",
    requiredProteins: ["beef-ground", "venison-ground", "pork-roast"],
    pantryNeeds: ["pantry-ramen", "pantry-broth-beef"],
    fridgeNeeds: ["fridge-eggs", "fridge-garlic", "fridge-onion"],
    note: "Elevated ramen with real broth and meat.",
  },
  {
    id: "tortelini-cold-pasta",
    name: "Tortellini Cold Pasta",
    category: "pasta",
    themeDay: "wednesday",
    requiredProteins: [],
    pantryNeeds: [],
    fridgeNeeds: [],
    note: "Store-bought tortellini. Add from pantry/fridge what you have.",
  },

  // ================================================================
  // SHEET PAN THURSDAY
  // ================================================================
  {
    id: "steak-potato",
    name: "Steak & Potato",
    category: "sheet-pan",
    themeDay: "thursday",
    requiredProteins: ["beef-steak-ribeye", "beef-steak-sirloin", "beef-steak-other"],
    pantryNeeds: [],
    fridgeNeeds: ["fridge-butter", "fridge-garlic"],
    note: "Cast iron or sheet pan. Simple and satisfying.",
  },
  {
    id: "venison-steak-sheet",
    name: "Venison Steak",
    category: "sheet-pan",
    themeDay: "thursday",
    requiredProteins: ["venison-steak", "venison-tenderloin"],
    pantryNeeds: [],
    fridgeNeeds: ["fridge-butter", "fridge-garlic"],
    note: "Don\u2019t overcook \u2014 medium rare for tenderness.",
  },
  {
    id: "pork-chops-sheet",
    name: "Pork Chops",
    category: "sheet-pan",
    themeDay: "thursday",
    requiredProteins: ["pork-chops"],
    pantryNeeds: [],
    fridgeNeeds: ["fridge-butter", "fridge-garlic"],
  },
  {
    id: "ribs",
    name: "Ribs",
    category: "sheet-pan",
    themeDay: "thursday",
    requiredProteins: ["pork-ribs"],
    pantryNeeds: [],
    fridgeNeeds: [],
    note: "Low and slow in oven. Worth the wait.",
  },
  {
    id: "veggies-sausage",
    name: "Veggies & Sausage",
    category: "sheet-pan",
    themeDay: "thursday",
    requiredProteins: [],
    pantryNeeds: [],
    fridgeNeeds: ["fridge-sausage"],
    note: "Sheet pan with whatever veg you have.",
  },
  {
    id: "chicken-wings",
    name: "Chicken Wings",
    category: "sheet-pan",
    themeDay: "thursday",
    requiredProteins: ["easy-wings"],
    pantryNeeds: [],
    fridgeNeeds: [],
    note: "Bake from frozen or fresh.",
  },
  {
    id: "everest-chicken",
    name: "Everest Chicken",
    category: "sheet-pan",
    themeDay: "thursday",
    requiredProteins: ["easy-wings"],
    pantryNeeds: [],
    fridgeNeeds: ["fridge-butter"],
    note: "Family favorite recipe.",
  },

  // ================================================================
  // PIZZA FRIDAY
  // ================================================================
  {
    id: "pizza-homemade",
    name: "Homemade Pizza",
    category: "pizza",
    themeDay: "friday",
    requiredProteins: [],
    pantryNeeds: ["pantry-pizza-dough", "pantry-pizza-sauce"],
    fridgeNeeds: ["fridge-cheese-shredded"],
    note: "Make the dough. Kids can add toppings.",
  },
  {
    id: "pizza-frozen",
    name: "Frozen Pizza",
    category: "pizza",
    themeDay: "friday",
    requiredProteins: ["easy-pizza-frozen"],
    pantryNeeds: [],
    fridgeNeeds: [],
    note: "Easy Friday fallback.",
  },
  {
    id: "pizza-delivery",
    name: "Order Pizza",
    category: "pizza",
    themeDay: "friday",
    requiredProteins: [],
    pantryNeeds: [],
    fridgeNeeds: [],
    isDelivery: true,
    note: "Take-out night.",
  },

  // ================================================================
  // SATURDAY — QUIET BREAKFAST OPTIONS
  // ================================================================
  {
    id: "eggs-toast",
    name: "Eggs & Toast",
    category: "quiet-breakfast",
    themeDay: "saturday",
    requiredProteins: [],
    pantryNeeds: ["pantry-bread"],
    fridgeNeeds: ["fridge-eggs", "fridge-butter"],
  },
  {
    id: "bagels-cream-cheese",
    name: "Bagels & Cream Cheese",
    category: "quiet-breakfast",
    themeDay: "saturday",
    requiredProteins: [],
    pantryNeeds: ["pantry-bagels"],
    fridgeNeeds: ["fridge-cream-cheese"],
  },
  {
    id: "cereal-yogurt",
    name: "Cereal & Yogurt",
    category: "quiet-breakfast",
    themeDay: "saturday",
    requiredProteins: [],
    pantryNeeds: ["pantry-cereal"],
    fridgeNeeds: [],
  },

  // ================================================================
  // SUNDAY — BIG BREAKFAST OPTIONS
  // ================================================================
  {
    id: "pancakes-sausage",
    name: "Pancakes & Sausage",
    category: "big-breakfast",
    themeDay: "sunday",
    requiredProteins: [],
    pantryNeeds: ["pantry-pancake-mix", "pantry-syrup"],
    fridgeNeeds: ["fridge-eggs", "fridge-milk", "fridge-butter", "fridge-sausage"],
  },
  {
    id: "waffles-bacon",
    name: "Waffles & Bacon",
    category: "big-breakfast",
    themeDay: "sunday",
    requiredProteins: [],
    pantryNeeds: ["pantry-pancake-mix", "pantry-syrup"],
    fridgeNeeds: ["fridge-eggs", "fridge-milk", "fridge-butter", "fridge-bacon"],
  },
  {
    id: "french-toast-bake",
    name: "French Toast Bake",
    category: "big-breakfast",
    themeDay: "sunday",
    requiredProteins: [],
    pantryNeeds: ["pantry-bread", "pantry-syrup"],
    fridgeNeeds: ["fridge-eggs", "fridge-milk", "fridge-butter"],
    note: "Prep the night before.",
  },
  {
    id: "egg-mcmuffins",
    name: "Egg McMuffins",
    category: "big-breakfast",
    themeDay: "sunday",
    requiredProteins: [],
    pantryNeeds: [],
    fridgeNeeds: ["fridge-eggs", "fridge-cheese-sliced", "fridge-bacon", "fridge-sausage"],
  },

  // ================================================================
  // EMERGENCY / EASY NIGHTS
  // ================================================================
  {
    id: "emergency-nuggets",
    name: "Chicken Nuggets & Fries",
    category: "emergency",
    themeDay: null,
    requiredProteins: ["easy-nuggets"],
    pantryNeeds: ["easy-fries"],
    fridgeNeeds: [],
    note: "15-minute fallback. Always keep stocked.",
  },
  {
    id: "emergency-gyoza",
    name: "Gyoza / Dumplings",
    category: "emergency",
    themeDay: null,
    requiredProteins: ["easy-gyoza"],
    pantryNeeds: ["pantry-rice"],
    fridgeNeeds: [],
  },
  {
    id: "emergency-breakfast-dinner",
    name: "Breakfast for Dinner",
    category: "emergency",
    themeDay: null,
    requiredProteins: [],
    pantryNeeds: ["pantry-pancake-mix"],
    fridgeNeeds: ["fridge-eggs", "fridge-bacon", "fridge-butter"],
    note: "Kids always love this.",
  },
  {
    id: "emergency-quesadillas",
    name: "Quesadillas",
    category: "emergency",
    themeDay: null,
    requiredProteins: [],
    pantryNeeds: ["pantry-tortillas"],
    fridgeNeeds: ["fridge-cheese-shredded"],
  },
  {
    id: "emergency-pigs-blanket",
    name: "Pigs in a Blanket",
    category: "emergency",
    themeDay: null,
    requiredProteins: [],
    pantryNeeds: [],
    fridgeNeeds: ["fridge-sausage"],
  },
  {
    id: "emergency-mac-cheese",
    name: "Mac & Cheese",
    category: "emergency",
    themeDay: null,
    requiredProteins: [],
    pantryNeeds: ["pantry-pasta-penne"],
    fridgeNeeds: ["fridge-butter", "fridge-milk", "fridge-cheese-shredded"],
    note: "Homemade comfort food. 20 minutes.",
  },
  {
    id: "emergency-frozen-pizza",
    name: "Frozen Pizza",
    category: "emergency",
    themeDay: null,
    requiredProteins: ["easy-pizza-frozen"],
    pantryNeeds: [],
    fridgeNeeds: [],
    note: "Zero effort. 15 minutes in oven.",
  },
  {
    id: "emergency-waffles",
    name: "Frozen Waffles",
    category: "emergency",
    themeDay: null,
    requiredProteins: ["easy-waffles"],
    pantryNeeds: ["pantry-syrup"],
    fridgeNeeds: ["fridge-butter"],
    note: "Toast and go.",
  },
  {
    id: "emergency-fish-sticks",
    name: "Fish Sticks & Fries",
    category: "emergency",
    themeDay: null,
    requiredProteins: ["easy-fishsticks"],
    pantryNeeds: ["easy-fries"],
    fridgeNeeds: [],
    note: "Bake together on one sheet pan.",
  },
  {
    id: "emergency-grilled-cheese",
    name: "Grilled Cheese & Soup",
    category: "emergency",
    themeDay: null,
    requiredProteins: [],
    pantryNeeds: ["pantry-bread"],
    fridgeNeeds: ["fridge-butter", "fridge-cheese-sliced"],
    note: "Classic comfort. Add canned soup if you have it.",
  },
  {
    id: "emergency-pb-j",
    name: "PB&J Dinner",
    category: "emergency",
    themeDay: null,
    requiredProteins: [],
    pantryNeeds: ["pantry-bread", "pantry-pb", "pantry-jelly"],
    fridgeNeeds: [],
    note: "No shame. Sometimes it's that kind of night.",
  },
  {
    id: "emergency-mini-quiche",
    name: "Mini Quiche",
    category: "emergency",
    themeDay: null,
    requiredProteins: ["easy-miniquiche"],
    pantryNeeds: [],
    fridgeNeeds: [],
    note: "Straight from freezer to oven.",
  },

  // ================================================================
  // OTHER DINNERS (non-themed, rotational)
  // ================================================================
  {
    id: "italian-beef",
    name: "Italian Beef",
    category: "once",
    themeDay: "monday",
    requiredProteins: ["beef-roast"],
    pantryNeeds: ["pantry-broth-beef"],
    fridgeNeeds: ["fridge-onion", "fridge-garlic"],
    note: "Slow cook roast Italian-style. Sandwiches.",
  },
  {
    id: "burgers",
    name: "Burgers",
    category: "once",
    themeDay: "monday",
    requiredProteins: ["beef-ground"],
    pantryNeeds: ["pantry-bread"],
    fridgeNeeds: ["fridge-cheese-sliced", "fridge-onion"],
  },
  {
    id: "sloppy-joes",
    name: "Sloppy Joes",
    category: "once",
    themeDay: "monday",
    requiredProteins: ["beef-ground"],
    pantryNeeds: ["pantry-bread", "pantry-tomato-sauce"],
    fridgeNeeds: ["fridge-onion"],
  },
  {
    id: "stir-fry",
    name: "Stir Fry",
    category: "once",
    themeDay: "monday",
    requiredProteins: ["beef-steak-other", "venison-steak", "pork-chops"],
    pantryNeeds: ["pantry-rice"],
    fridgeNeeds: ["fridge-garlic", "fridge-onion", "fridge-butter"],
  },
  {
    id: "curry-coconut",
    name: "Curry with Coconut Milk",
    category: "once",
    themeDay: "monday",
    requiredProteins: ["beef-ground", "venison-ground", "pork-chops"],
    pantryNeeds: ["pantry-rice", "pantry-coconut-milk"],
    fridgeNeeds: ["fridge-onion", "fridge-garlic"],
  },
  {
    id: "lentil-soup",
    name: "Lentil Soup",
    category: "once",
    themeDay: "monday",
    requiredProteins: [],
    pantryNeeds: ["pantry-lentils", "pantry-broth-beef"],
    fridgeNeeds: ["fridge-onion", "fridge-garlic"],
  },
  {
    id: "minestrone",
    name: "Minestrone",
    category: "once",
    themeDay: "monday",
    requiredProteins: [],
    pantryNeeds: ["pantry-pasta-penne", "pantry-beans-kidney", "pantry-crushed-tomato", "pantry-broth-beef"],
    fridgeNeeds: ["fridge-onion", "fridge-garlic"],
  },
  {
    id: "quinoa-casserole",
    name: "Quinoa Casserole",
    category: "once",
    themeDay: "monday",
    requiredProteins: [],
    pantryNeeds: ["pantry-quinoa", "pantry-broth-beef"],
    fridgeNeeds: ["fridge-onion", "fridge-cheese-shredded"],
  },
];

// ================================================================
// HELPERS
// ================================================================

export const getRecipesByCategory = (category: string): Recipe[] =>
  RECIPES.filter((r) => r.category === category);

export const getMatchingRecipes = (
  availableFreezerIds: string[],
  availablePantryIds: string[],
): MatchedRecipe[] => {
  return RECIPES.map((recipe) => {
    const missingProteins = recipe.requiredProteins.filter(
      (p) => !availableFreezerIds.includes(p),
    );
    const missingPantry = recipe.pantryNeeds.filter(
      (p) => !availablePantryIds.includes(p),
    );
    const totalMissing = missingProteins.length + missingPantry.length;

    return {
      ...recipe,
      missingProteins,
      missingPantry,
      totalMissing,
      matchTier:
        totalMissing === 0 ? 1 as const :
        totalMissing <= 2 ? 2 as const :
        totalMissing <= 4 ? 3 as const : 4 as const,
    };
  }).sort((a, b) => a.totalMissing - b.totalMissing);
};

export const getEmergencyRecipes = (availableFreezerIds: string[]): Recipe[] =>
  RECIPES.filter(
    (r) =>
      r.category === "emergency" &&
      (r.requiredProteins.length === 0 ||
        r.requiredProteins.some((p) => availableFreezerIds.includes(p))),
  );
