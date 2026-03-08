import type { Themes, ThemeDay } from '@/lib/types';

export const THEMES: Themes = {
  sunday: {
    label: "Big Breakfast + Crock Pot",
    emoji: "\u{1F373}",
    description: "Big family breakfast in the morning. Crock pot meal sets all day for the week.",
    mealSlots: {
      breakfast: {
        label: "Big Breakfast",
        categories: ["big-breakfast"],
        note: "Pancakes, waffles, french toast bake, eggs + sausage/bacon",
      },
      dinner: {
        label: "Crock Pot",
        categories: ["crock-pot"],
        note: "Sets all day. Leftovers feed Mon\u2013Wed lunches.",
      },
    },
  },
  monday: {
    label: "Leftovers / Once",
    emoji: "\u267B\uFE0F",
    description: "Use Sunday\u2019s crock pot meal. Easy night.",
    mealSlots: {
      dinner: {
        label: "Leftovers",
        categories: ["leftovers", "once"],
        note: "Sunday crock pot carries over. Pack lunches from this too.",
      },
    },
  },
  tuesday: {
    label: "Taco Tuesday",
    emoji: "\u{1F32E}",
    description: "Tacos, burritos, enchiladas, quesadillas \u2014 anything Mexican-inspired.",
    mealSlots: {
      dinner: {
        label: "Taco Night",
        categories: ["taco-tuesday"],
        note: "Ground beef, venison, or pork-based Mexican meals",
      },
    },
  },
  wednesday: {
    label: "Pasta Night",
    emoji: "\u{1F35D}",
    description: "All pasta dishes. Meat-based or vegetarian.",
    mealSlots: {
      dinner: {
        label: "Pasta",
        categories: ["pasta"],
        note: "Bolognese, alfredo, lemon garlic, ramen bowl, etc.",
      },
    },
  },
  thursday: {
    label: "Sheet Pan",
    emoji: "\u{1F969}",
    description: "One pan meals \u2014 protein + veggies roasted together.",
    mealSlots: {
      dinner: {
        label: "Sheet Pan",
        categories: ["sheet-pan"],
        note: "Steaks, pork chops, chicken wings, veggies & sausage",
      },
    },
  },
  friday: {
    label: "Pizza Night",
    emoji: "\u{1F355}",
    description: "Pizza. Homemade, frozen, or delivery.",
    mealSlots: {
      dinner: {
        label: "Pizza",
        categories: ["pizza"],
        note: "Homemade dough, frozen pizza, or order out",
      },
    },
  },
  saturday: {
    label: "Quiet Breakfast + New Recipe",
    emoji: "\u{1F9EA}",
    description: "Low-key breakfast in the morning. Saturday evening is for trying something new.",
    mealSlots: {
      breakfast: {
        label: "Quiet Breakfast",
        categories: ["quiet-breakfast"],
        note: "Eggs & toast, bagels, cereal, yogurt & granola",
      },
      dinner: {
        label: "New Recipe Night",
        categories: ["new-recipe"],
        note: "Try something new! Paste a URL or describe it to Claude.",
      },
    },
  },
};

export const getTheme = (dayName: string): ThemeDay | null =>
  THEMES[dayName.toLowerCase()] ?? null;

export const getDinnerCategories = (dayName: string): string[] => {
  const theme = getTheme(dayName);
  return theme?.mealSlots?.dinner?.categories ?? [];
};
