import { useState } from 'react';
import { useAppStore } from '@/stores/appStore';
import { RECIPES } from '@/data/recipes';
import type { Recipe } from '@/lib/types';

type EmergencyFilter = 'all' | 'too-tired' | 'whats-available' | 'eating-out';

export default function EmergencyMode() {
  const [filter, setFilter] = useState<EmergencyFilter>('all');
  const { freezer, pantry } = useAppStore();

  // Build available item IDs from current inventory
  const availableFreezerIds = Object.values(freezer).flatMap((cat) =>
    cat.items.filter((i) => i.quantity > 0).map((i) => i.id),
  );
  const availablePantryIds = Object.values(pantry).flatMap((cat) =>
    cat.items.filter((i) => i.inStock).map((i) => i.id),
  );

  // Score a recipe: how many required items are missing
  const scoreRecipe = (recipe: Recipe) => {
    const missingProteins = recipe.requiredProteins.filter(
      (p) => !availableFreezerIds.includes(p),
    );
    const missingPantry = recipe.pantryNeeds.filter(
      (p) => !availablePantryIds.includes(p),
    );
    // Fridge staples are assumed in stock
    return {
      missingProteins,
      missingPantry,
      totalMissing: missingProteins.length + missingPantry.length,
      canMake: missingProteins.length === 0 && missingPantry.length === 0,
    };
  };

  // Get recipes based on filter
  const getFilteredRecipes = () => {
    if (filter === 'eating-out') return [];

    let pool: Recipe[];

    if (filter === 'too-tired') {
      // Only emergency category + frozen/easy items
      pool = RECIPES.filter((r) => r.category === 'emergency');
    } else if (filter === 'whats-available') {
      // All recipes, sorted by what you can make
      pool = RECIPES.filter((r) => r.category !== 'new-recipe');
    } else {
      // 'all' — show emergency recipes first, then suggestions
      pool = RECIPES.filter((r) => r.category === 'emergency');
    }

    return pool
      .map((r) => ({ recipe: r, score: scoreRecipe(r) }))
      .sort((a, b) => a.score.totalMissing - b.score.totalMissing);
  };

  const scored = getFilteredRecipes();
  const canMakeNow = scored.filter((s) => s.score.canMake);
  const almostCanMake = scored.filter((s) => !s.score.canMake && s.score.totalMissing <= 2);
  const cantMake = scored.filter((s) => s.score.totalMissing > 2);

  return (
    <div className="px-4 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold text-gray-900 mb-1">Emergency Mode</h2>
      <p className="text-sm text-gray-500 mb-5">Plans changed? Pick one. 2 taps. Done.</p>

      {/* Three big buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <FilterButton
          active={filter === 'too-tired'}
          onClick={() => setFilter(filter === 'too-tired' ? 'all' : 'too-tired')}
          emoji={"\u{1F634}"}
          label="Too Tired"
          description="Frozen & easy meals"
        />
        <FilterButton
          active={filter === 'whats-available'}
          onClick={() => setFilter(filter === 'whats-available' ? 'all' : 'whats-available')}
          emoji={"\u{1F50D}"}
          label="What Can I Make?"
          description="Check all recipes"
        />
        <FilterButton
          active={filter === 'eating-out'}
          onClick={() => setFilter(filter === 'eating-out' ? 'all' : 'eating-out')}
          emoji={"\u{1F37D}\uFE0F"}
          label="Eating Out"
          description="Skip tonight"
        />
      </div>

      {/* Eating out message */}
      {filter === 'eating-out' && (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
          <p className="text-4xl mb-3">{"\u{1F37D}\uFE0F"}</p>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Enjoy your night out!</h3>
          <p className="text-sm text-gray-500">No cooking tonight. Leftovers shift forward.</p>
        </div>
      )}

      {/* Results */}
      {filter !== 'eating-out' && (
        <div className="space-y-6">
          {/* Can make right now */}
          {canMakeNow.length > 0 && (
            <Section
              title="Ready to go"
              subtitle="Everything you need is in stock"
              accent="green"
            >
              {canMakeNow.map(({ recipe }) => (
                <RecipeCard key={recipe.id} recipe={recipe} status="ready" />
              ))}
            </Section>
          )}

          {/* Almost can make */}
          {almostCanMake.length > 0 && (
            <Section
              title="Almost there"
              subtitle="Missing 1-2 items"
              accent="amber"
            >
              {almostCanMake.map(({ recipe, score }) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  status="almost"
                  missing={[...score.missingProteins, ...score.missingPantry]}
                />
              ))}
            </Section>
          )}

          {/* Can't make */}
          {filter === 'whats-available' && cantMake.length > 0 && (
            <Section
              title="Not tonight"
              subtitle="Missing too many ingredients"
              accent="gray"
            >
              {cantMake.slice(0, 5).map(({ recipe, score }) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  status="missing"
                  missing={[...score.missingProteins, ...score.missingPantry]}
                />
              ))}
              {cantMake.length > 5 && (
                <p className="text-xs text-gray-400 text-center pt-1">
                  +{cantMake.length - 5} more recipes need restocking
                </p>
              )}
            </Section>
          )}

          {/* Empty state */}
          {canMakeNow.length === 0 && almostCanMake.length === 0 && (
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
              <p className="text-4xl mb-3">{"\u{1F614}"}</p>
              <h3 className="text-base font-bold text-gray-900 mb-2">
                {filter === 'too-tired' ? 'Freezer is empty' : 'Nothing matches'}
              </h3>
              <p className="text-sm text-gray-500">
                Update your inventory or try a different filter.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Filter Button ───

function FilterButton({
  active,
  onClick,
  emoji,
  label,
  description,
}: {
  active: boolean;
  onClick: () => void;
  emoji: string;
  label: string;
  description: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
        active
          ? 'border-amber-500 bg-amber-50 shadow-md scale-[1.02]'
          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
      }`}
    >
      <span className="text-3xl mb-1.5">{emoji}</span>
      <span className={`text-sm font-bold ${active ? 'text-amber-700' : 'text-gray-800'}`}>
        {label}
      </span>
      <span className="text-xs text-gray-400 mt-0.5">{description}</span>
    </button>
  );
}

// ─── Section ───

function Section({
  title,
  subtitle,
  accent,
  children,
}: {
  title: string;
  subtitle: string;
  accent: 'green' | 'amber' | 'gray';
  children: React.ReactNode;
}) {
  const colors = {
    green: 'border-green-200',
    amber: 'border-amber-200',
    gray: 'border-gray-200',
  };
  const dotColors = {
    green: 'bg-green-500',
    amber: 'bg-amber-500',
    gray: 'bg-gray-400',
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-2 h-2 rounded-full ${dotColors[accent]}`} />
        <h3 className="text-sm font-bold text-gray-700">{title}</h3>
        <span className="text-xs text-gray-400">{subtitle}</span>
      </div>
      <div className={`space-y-2 border-l-2 ${colors[accent]} pl-4 ml-0.5`}>
        {children}
      </div>
    </div>
  );
}

// ─── Recipe Card ───

function RecipeCard({
  recipe,
  status,
  missing,
}: {
  recipe: Recipe;
  status: 'ready' | 'almost' | 'missing';
  missing?: string[];
}) {
  const bgColor = {
    ready: 'bg-green-50 border-green-200',
    almost: 'bg-amber-50 border-amber-200',
    missing: 'bg-gray-50 border-gray-100',
  };

  const statusIcon = {
    ready: '\u2705',
    almost: '\u{1F7E1}',
    missing: '\u274C',
  };

  // Make missing IDs human-readable
  const formatMissing = (id: string) => {
    return id
      .replace(/^(pantry-|fridge-|easy-|beef-|pork-|venison-)/, '')
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  return (
    <div className={`rounded-xl px-4 py-3 border ${bgColor[status]} transition-colors`}>
      <div className="flex items-center gap-2">
        <span className="text-lg">{statusIcon[status]}</span>
        <div className="flex-1 min-w-0">
          <span className="text-sm font-semibold text-gray-800">{recipe.name}</span>
          {recipe.note && (
            <p className="text-xs text-gray-500 mt-0.5">{recipe.note}</p>
          )}
        </div>
      </div>
      {missing && missing.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2 ml-7">
          {missing.map((id) => (
            <span
              key={id}
              className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-gray-200 text-gray-500"
            >
              Need: {formatMissing(id)}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
