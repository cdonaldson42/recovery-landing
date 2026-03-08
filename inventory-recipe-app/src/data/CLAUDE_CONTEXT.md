# Meal Planning App — Claude Context File
> Paste this into any AI session to instantly restore full project context.

---

## What This App Is
A **personal family meal planning PWA** built in React + Tailwind, deployed via Vercel.
It is NOT a generic recipe app. It is built around a fixed personal meal rotation,
a home meat supply (quarter beef, venison, pork), and a monthly planning workflow.

---

## Tech Stack
- **React + Vite** — frontend
- **Tailwind CSS** — styling (mobile-first)
- **Zustand** — global state (inventory, meal plan, grocery list)
- **Supabase** — database + auth (persists across devices)
- **date-fns** — calendar logic
- **Deployed:** Vercel, connected via GitHub

---

## The 4 App Modes (Bottom Nav Bar)

### 1. 📅 Monthly Planner
- Calendar grid view of the current month
- Every day is pre-labeled with its theme (see Weekly Themes below)
- Tap a day → see theme → pick a meal filtered by theme + freezer inventory
- Tracks protein usage across the month (don't burn all roasts week 1)
- Freezer inventory auto-decrements as meals are planned

### 2. 🛒 Weekly Grocery Check
- Shows the next 7 days from the monthly plan
- For each planned meal, lists non-staple pantry ingredients needed
- Simple yes/no checklist per ingredient
- Also checks fridge staples (butter, eggs, cheese, milk, bacon, sausage)
- Outputs a clean grocery list grouped by: Produce / Dairy / Pantry / Frozen

### 3. 🚨 Emergency Mode
- Triggered when plans change day-of
- Three quick buttons:
  - **Too Tired** → shows easy/frozen meals from freezer inventory
  - **Missing Ingredients** → shows what CAN be made with confirmed stock
  - **Eating Out** → clears the night, shifts leftovers forward
- No scrolling. 2-tap resolution.

### 4. 🧪 Fun Mode — New Recipe Saturday
- Saturday evening experimental slot
- Paste a URL → app parses ingredients → checks inventory → shows have vs. need
- Or describe it to Claude → Claude fills in the recipe card
- After trying: ⭐ Save to rotation (auto-tagged to theme day) or 🗑 Pass
- Saved recipes appear in Monthly Planner going forward

---

## Weekly Theme Structure

| Day       | Theme                        | Notes |
|-----------|------------------------------|-------|
| Sunday    | Big Breakfast + Crock Pot    | Pancakes/waffles/bacon/sausage AM. Crock pot sets all day. Leftovers feed Mon–Wed lunches. |
| Monday    | Leftovers / Once             | Sunday crock pot carries over. Pack lunches from this. |
| Tuesday   | Taco Tuesday                 | Tacos, enchiladas, burritos, quesadillas, nachos |
| Wednesday | Pasta Night                  | Bolognese, alfredo, stroganoff, ramen bowl, mac & cheese |
| Thursday  | Sheet Pan                    | Steaks, pork chops, ribs, veggies & sausage |
| Friday    | Pizza Night                  | Homemade, frozen, or delivery |
| Saturday  | Quiet Breakfast + New Recipe | Eggs/bagels/cereal AM. New recipe experiment PM. |

---

## Freezer Inventory Structure
This is a home meat supply — updated when new supply arrives, not daily.

**Beef (Quarter)**
- Ground beef (lbs)
- Roasts (count)
- Ribeye steaks (count)
- Sirloin steaks (count)
- Other steaks (count)

**Venison**
- Steaks (count)
- Tenderloin (count)
- Ground venison (lbs)

**Pork**
- Roasts (count)
- Hams (count)
- Pork chops (count)
- Ribs / racks (count)

**Easy / Frozen**
- Chicken nuggets, fish sticks, gyoza, french fries, chicken wings (1 pack noted), frozen pizza, mini quiche, frozen waffles, GoGurt

> No fish or chicken in current supply besides the wing pack.

---

## Pantry Inventory
Tracked as in-stock / out-of-stock toggles (not quantities).
Categories: Pasta & Grains / Sauces & Canned / Baking & Breakfast / Wraps & Bread / Snacks & Lunch Extras

---

## Fridge Staples
**Always assumed on hand. Only flagged during weekly grocery check if running low.**
Butter, eggs, milk, shredded cheese, sliced cheese, garlic, onions, olive oil,
sour cream, salsa, cream cheese, bacon, breakfast sausage.

> Do NOT build a fridge inventory screen. Just a simple checklist during weekly grocery mode.

---

## Smart Suggest Logic (4 Tiers)

| Tier | Condition | Example |
|------|-----------|---------|
| 1 | Perfect match — theme + all ingredients on hand | "It's Taco Tuesday, you have ground beef + tortillas → make tacos" |
| 2 | Theme match, missing 1–2 pantry items | "Have pasta, no red sauce → try butter/garlic tonight or add sauce to list" |
| 3 | Ingredient match, wrong theme day | "You have a pork roast → save for Sunday crock pot, or swap Thursday" |
| 4 | Low stock warning | "Low on tortillas — Taco Tuesday in 3 days, add to grocery list?" |

---

## Crock Pot / Lunch Connection
- Sunday crock pot meal auto-populates Mon–Wed lunch suggestions
- App tracks estimated portions to confirm enough for the full week
- Proteins that work: beef roast, pork roast, ham, beef/venison chili

---

## Recipe Rotation (Personal — NOT from an API)
Pre-loaded in `src/data/recipes.js`. Key meals by category:

**Crock Pot:** Beef Roast, Pulled Pork, Beef Chili, Venison Chili, Ham
**Taco Tuesday:** Beef/Venison Tacos, Enchiladas, Burritos, Quesadillas, Nachos
**Pasta:** Bolognese, Venison Bolognese, Alfredo, Buccatini, Lemon Garlic, Mac & Cheese, Beef Stroganoff, Ramen Bowl, Tortellini Cold Pasta
**Sheet Pan:** Steak & Potato, Venison Steak, Pork Chops, Ribs, Veggies & Sausage, Chicken Wings, Everest Chicken
**Pizza:** Homemade, Frozen, Delivery
**Big Breakfast:** Pancakes & Sausage, Waffles & Bacon, French Toast Bake, Egg McMuffins
**Quiet Breakfast:** Eggs & Toast, Bagels & Cream Cheese, Cereal & Yogurt
**Emergency:** Nuggets & Fries, Gyoza, Breakfast for Dinner, Quesadillas, Pigs in a Blanket
**Other/Once:** Italian Beef, Burgers, Sloppy Joes, Stir Fry, Curry, Lentil Soup, Minestrone, Quinoa Casserole

---

## Key Design Principles
- **Monthly planning workflow** — not day-of. Sit down once a month, fill the calendar.
- **Mobile-first PWA** — large tap targets, bottom nav bar, installable to home screen
- **Personal rotation only** — no public recipe API, no random suggestions
- **Fridge staples assumed** — never make the user log butter and garlic
- **Each mode is independent** — user can open any mode without going through the others
- **Emergency mode is fast** — 2 taps max to resolve a changed plan

---

## Data Files
All in `src/data/`:
- `themes.js` — 7-day theme config with meal slots and categories
- `inventory.js` — freezer structure, pantry toggles, fridge staples list
- `recipes.js` — full recipe rotation with protein/pantry requirements and match helpers

---

## Build Order (Recommended)
1. App shell + bottom nav (4 modes)
2. Freezer & pantry inventory screens
3. Monthly Planner calendar + meal assignment
4. Weekly Grocery Check + grocery list output
5. Emergency Mode
6. Fun Mode (Saturday new recipe)
7. Supabase persistence + auth
