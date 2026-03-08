import { useState, useMemo } from 'react';
import { useAppStore } from '@/stores/appStore';
import { RECIPES } from '@/data/recipes';
import { DEFAULT_FREEZER, DEFAULT_PANTRY, FRIDGE_STAPLES } from '@/data/inventory';
import type { Recipe } from '@/lib/types';

// ─── Keyword matching for ingredient text ───

function buildKeywordMap() {
  const map: { keyword: string; id: string; source: 'freezer' | 'pantry' | 'fridge' }[] = [];
  for (const [, cat] of Object.entries(DEFAULT_FREEZER)) {
    for (const item of cat.items) {
      for (const w of item.label.toLowerCase().split(/[\s/]+/)) {
        if (w.length > 2) map.push({ keyword: w, id: item.id, source: 'freezer' });
      }
      map.push({ keyword: item.label.toLowerCase(), id: item.id, source: 'freezer' });
    }
  }
  for (const [, cat] of Object.entries(DEFAULT_PANTRY)) {
    for (const item of cat.items) {
      for (const w of item.label.toLowerCase().split(/[\s/()]+/).filter(Boolean)) {
        if (w.length > 2) map.push({ keyword: w, id: item.id, source: 'pantry' });
      }
      map.push({ keyword: item.label.toLowerCase(), id: item.id, source: 'pantry' });
    }
  }
  for (const item of FRIDGE_STAPLES) {
    for (const w of item.label.toLowerCase().split(/[\s/]+/)) {
      if (w.length > 2) map.push({ keyword: w, id: item.id, source: 'fridge' });
    }
    map.push({ keyword: item.label.toLowerCase(), id: item.id, source: 'fridge' });
  }
  return map;
}

const KEYWORD_MAP = buildKeywordMap();

type ParsedIngredient = {
  text: string;
  matched: boolean;
  matchedId: string | null;
  source: 'freezer' | 'pantry' | 'fridge' | 'none';
};

type ParsedRecipe = {
  name: string;
  description: string;
  ingredients: ParsedIngredient[];
  instructions: string[];
  prepTime: string;
  cookTime: string;
  totalTime: string;
  servings: string;
  image: string;
  url: string;
};

function matchIngredient(text: string) {
  const lower = text.toLowerCase();
  const sorted = [...KEYWORD_MAP].sort((a, b) => b.keyword.length - a.keyword.length);
  for (const entry of sorted) {
    if (lower.includes(entry.keyword)) {
      return { matched: true, matchedId: entry.id, source: entry.source } as const;
    }
  }
  return { matched: false, matchedId: null, source: 'none' } as const;
}

function matchAllIngredients(ingredients: ParsedIngredient[]): ParsedIngredient[] {
  return ingredients.map((ing) => ({ ...ing, ...matchIngredient(ing.text) }));
}

// ─── Craving search keywords ───

const CRAVING_KEYWORDS: Record<string, string[]> = {
  // Moods
  comfort: ['mac-cheese', 'emergency-mac-cheese', 'bolognese', 'beef-stroganoff', 'crock-beef-roast', 'emergency-grilled-cheese', 'emergency-breakfast-dinner'],
  cozy: ['crock-beef-roast', 'crock-chili-beef', 'crock-chili-venison', 'crock-pork-roast', 'minestrone', 'lentil-soup', 'beef-stroganoff'],
  quick: ['emergency-quesadillas', 'emergency-nuggets', 'emergency-frozen-pizza', 'emergency-pb-j', 'emergency-grilled-cheese', 'emergency-waffles', 'quesadillas', 'eggs-toast'],
  easy: ['emergency-nuggets', 'emergency-frozen-pizza', 'emergency-waffles', 'emergency-fish-sticks', 'emergency-mini-quiche', 'emergency-gyoza', 'pizza-frozen'],
  fancy: ['venison-steak-sheet', 'steak-potato', 'ribs', 'everest-chicken', 'ramen-bowl', 'curry-coconut'],
  hearty: ['crock-beef-roast', 'crock-chili-beef', 'beef-stroganoff', 'steak-potato', 'burgers', 'ribs', 'bolognese'],
  light: ['lemon-garlic-pasta', 'eggs-toast', 'cereal-yogurt', 'tortelini-cold-pasta', 'stir-fry'],
  spicy: ['tacos-beef', 'tacos-venison', 'enchiladas-beef', 'nachos', 'curry-coconut', 'ramen-bowl'],
  cheesy: ['emergency-mac-cheese', 'mac-cheese', 'alfredo', 'quesadillas', 'nachos', 'pizza-homemade', 'emergency-grilled-cheese', 'enchiladas-beef'],
  crispy: ['chicken-wings', 'everest-chicken', 'emergency-nuggets', 'emergency-fish-sticks', 'pork-chops-sheet', 'emergency-waffles'],
  sweet: ['pancakes-sausage', 'waffles-bacon', 'french-toast-bake', 'emergency-waffles'],
  // Foods
  beef: ['tacos-beef', 'bolognese', 'steak-potato', 'burgers', 'sloppy-joes', 'crock-beef-roast', 'beef-stroganoff', 'crock-chili-beef', 'italian-beef', 'enchiladas-beef', 'nachos'],
  pork: ['crock-pork-roast', 'pork-chops-sheet', 'ribs', 'crock-ham'],
  venison: ['tacos-venison', 'bolognese-venison', 'venison-steak-sheet', 'crock-chili-venison', 'enchiladas-venison'],
  chicken: ['chicken-wings', 'everest-chicken', 'emergency-nuggets'],
  pasta: ['bolognese', 'bolognese-venison', 'alfredo', 'buccatini', 'lemon-garlic-pasta', 'mac-cheese', 'emergency-mac-cheese', 'beef-stroganoff', 'ramen-bowl', 'tortelini-cold-pasta'],
  noodle: ['bolognese', 'alfredo', 'ramen-bowl', 'beef-stroganoff', 'mac-cheese'],
  noodles: ['bolognese', 'alfredo', 'ramen-bowl', 'beef-stroganoff', 'mac-cheese'],
  taco: ['tacos-beef', 'tacos-venison', 'nachos', 'burritos', 'quesadillas', 'enchiladas-beef', 'enchiladas-venison'],
  tacos: ['tacos-beef', 'tacos-venison', 'nachos', 'burritos', 'quesadillas'],
  mexican: ['tacos-beef', 'tacos-venison', 'enchiladas-beef', 'enchiladas-venison', 'burritos', 'nachos', 'quesadillas', 'emergency-quesadillas'],
  pizza: ['pizza-homemade', 'pizza-frozen', 'pizza-delivery', 'emergency-frozen-pizza'],
  soup: ['crock-chili-beef', 'crock-chili-venison', 'lentil-soup', 'minestrone', 'ramen-bowl'],
  breakfast: ['pancakes-sausage', 'waffles-bacon', 'french-toast-bake', 'egg-mcmuffins', 'eggs-toast', 'bagels-cream-cheese', 'cereal-yogurt', 'emergency-breakfast-dinner'],
  sandwich: ['burgers', 'sloppy-joes', 'italian-beef', 'crock-ham', 'emergency-grilled-cheese', 'emergency-pb-j'],
  steak: ['steak-potato', 'venison-steak-sheet'],
  roast: ['crock-beef-roast', 'crock-pork-roast', 'italian-beef'],
  chili: ['crock-chili-beef', 'crock-chili-venison'],
  burger: ['burgers'],
  burgers: ['burgers'],
  wings: ['chicken-wings', 'everest-chicken'],
  dumpling: ['emergency-gyoza'],
  dumplings: ['emergency-gyoza'],
  gyoza: ['emergency-gyoza'],
  ramen: ['ramen-bowl'],
  curry: ['curry-coconut'],
  stir: ['stir-fry'],
  mac: ['mac-cheese', 'emergency-mac-cheese'],
  cheese: ['emergency-mac-cheese', 'mac-cheese', 'emergency-grilled-cheese', 'quesadillas', 'nachos'],
  grilled: ['emergency-grilled-cheese', 'steak-potato', 'pork-chops-sheet'],
  slow: ['crock-beef-roast', 'crock-pork-roast', 'crock-chili-beef', 'crock-chili-venison', 'crock-ham', 'ribs'],
  crockpot: ['crock-beef-roast', 'crock-pork-roast', 'crock-chili-beef', 'crock-chili-venison', 'crock-ham'],
  frozen: ['emergency-nuggets', 'emergency-frozen-pizza', 'emergency-waffles', 'emergency-fish-sticks', 'emergency-mini-quiche', 'emergency-gyoza', 'pizza-frozen'],
  kids: ['emergency-nuggets', 'emergency-mac-cheese', 'mac-cheese', 'pizza-homemade', 'emergency-frozen-pizza', 'quesadillas', 'pancakes-sausage', 'emergency-pb-j'],
};

// ─── Main Component ───

type Tab = 'craving' | 'import';

export default function FunMode() {
  const [activeTab, setActiveTab] = useState<Tab>('craving');

  return (
    <div className="px-4 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold text-gray-900 mb-1">Fun Mode</h2>
      <p className="text-sm text-gray-500 mb-4">
        Feeling adventurous? Tell us what you're craving or import a new recipe.
      </p>

      <div className="flex gap-2 mb-5">
        {(['craving', 'import'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === tab
                ? 'bg-amber-600 text-white'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            {tab === 'craving' ? "What am I craving?" : 'Import Recipe'}
          </button>
        ))}
      </div>

      {activeTab === 'craving' ? <CravingTab /> : <ImportTab />}
    </div>
  );
}

// ─── Craving Tab ───

function CravingTab() {
  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { freezer, pantry } = useAppStore();

  const availableFreezerIds = useMemo(() =>
    Object.values(freezer).flatMap((cat) =>
      cat.items.filter((i) => i.quantity > 0).map((i) => i.id),
    ), [freezer]);

  const availablePantryIds = useMemo(() =>
    Object.values(pantry).flatMap((cat) =>
      cat.items.filter((i) => i.inStock).map((i) => i.id),
    ), [pantry]);

  const scoreRecipe = (recipe: Recipe) => {
    const missingProteins = recipe.requiredProteins.filter((p) => !availableFreezerIds.includes(p));
    const missingPantry = recipe.pantryNeeds.filter((p) => !availablePantryIds.includes(p));
    return {
      missing: [...missingProteins, ...missingPantry],
      totalMissing: missingProteins.length + missingPantry.length,
      canMake: missingProteins.length === 0 && missingPantry.length === 0,
    };
  };

  const results = useMemo(() => {
    if (!submitted || !query.trim()) return null;

    const words = query.toLowerCase().split(/[\s,]+/).filter((w) => w.length > 1);

    // Collect matching recipe IDs from keyword map
    const matchedIds = new Set<string>();
    for (const word of words) {
      // Direct keyword match
      if (CRAVING_KEYWORDS[word]) {
        for (const id of CRAVING_KEYWORDS[word]) matchedIds.add(id);
      }
      // Partial keyword match
      for (const [key, ids] of Object.entries(CRAVING_KEYWORDS)) {
        if (key.includes(word) || word.includes(key)) {
          for (const id of ids) matchedIds.add(id);
        }
      }
      // Also search recipe names directly
      for (const recipe of RECIPES) {
        if (recipe.name.toLowerCase().includes(word) || recipe.category.includes(word)) {
          matchedIds.add(recipe.id);
        }
      }
    }

    // If nothing matched, show everything sorted by inventory
    const pool = matchedIds.size > 0
      ? RECIPES.filter((r) => matchedIds.has(r.id))
      : RECIPES;

    return pool
      .map((r) => ({ recipe: r, score: scoreRecipe(r) }))
      .sort((a, b) => a.score.totalMissing - b.score.totalMissing);
  }, [submitted, query, availableFreezerIds, availablePantryIds]);

  const handleSearch = () => {
    if (query.trim()) setSubmitted(true);
  };

  const canMake = results?.filter((r) => r.score.canMake) ?? [];
  const almostCanMake = results?.filter((r) => !r.score.canMake && r.score.totalMissing <= 2) ?? [];
  const needMore = results?.filter((r) => r.score.totalMissing > 2) ?? [];

  // Quick prompt chips
  const quickPrompts = [
    'comfort food', 'something quick', 'kids favorite', 'cheesy',
    'spicy', 'beef', 'pasta', 'breakfast', 'soup', 'crispy',
  ];

  return (
    <div>
      {/* Prompt box */}
      <div className="relative mb-3">
        <textarea
          value={query}
          onChange={(e) => { setQuery(e.target.value); setSubmitted(false); }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSearch();
            }
          }}
          placeholder="What are you craving? (e.g. &quot;something cheesy and quick&quot;, &quot;comfort food&quot;, &quot;beef tacos&quot;)"
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 resize-none"
        />
        <button
          onClick={handleSearch}
          disabled={!query.trim()}
          className="absolute bottom-3 right-3 px-4 py-1.5 bg-amber-600 text-white rounded-lg text-sm font-semibold hover:bg-amber-700 disabled:opacity-40 transition-colors"
        >
          Search
        </button>
      </div>

      {/* Quick prompts */}
      <div className="flex flex-wrap gap-2 mb-6">
        {quickPrompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => { setQuery(prompt); setSubmitted(true); }}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              query === prompt && submitted
                ? 'bg-amber-100 border-amber-300 text-amber-700'
                : 'bg-white border-gray-200 text-gray-500 hover:border-amber-300 hover:text-amber-600'
            }`}
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Results */}
      {results && (
        <div className="space-y-6">
          {results.length === 0 && (
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
              <p className="text-3xl mb-2">{"\u{1F914}"}</p>
              <p className="text-sm text-gray-500">No matches. Try different words or browse your recipes.</p>
            </div>
          )}

          {canMake.length > 0 && (
            <ResultSection title="You can make these now" accent="green">
              {canMake.map(({ recipe }) => (
                <ScoredRecipeCard key={recipe.id} recipe={recipe} status="ready" />
              ))}
            </ResultSection>
          )}

          {almostCanMake.length > 0 && (
            <ResultSection title="Almost — missing 1-2 things" accent="amber">
              {almostCanMake.map(({ recipe, score }) => (
                <ScoredRecipeCard key={recipe.id} recipe={recipe} status="almost" missing={score.missing} />
              ))}
            </ResultSection>
          )}

          {needMore.length > 0 && (
            <ResultSection title="Would need a grocery run" accent="gray">
              {needMore.slice(0, 6).map(({ recipe, score }) => (
                <ScoredRecipeCard key={recipe.id} recipe={recipe} status="missing" missing={score.missing} />
              ))}
            </ResultSection>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Import Tab (URL + manual paste) ───

function ImportTab() {
  const [url, setUrl] = useState('');
  const [recipe, setRecipe] = useState<ParsedRecipe | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [manualMode, setManualMode] = useState(false);
  const [manualIngredients, setManualIngredients] = useState('');
  const { freezer, pantry } = useAppStore();

  const fetchRecipe = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setError('');
    setRecipe(null);
    try {
      const res = await fetch('/api/parse-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = await res.json() as (ParsedRecipe & { error?: string });
      if (!res.ok) { setError(data.error ?? 'Failed to parse recipe'); return; }
      data.ingredients = matchAllIngredients(data.ingredients);
      setRecipe(data);
    } catch {
      setError('Failed to fetch. Try pasting ingredients manually.');
    } finally {
      setLoading(false);
    }
  };

  const handleManualParse = () => {
    if (!manualIngredients.trim()) return;
    const lines = manualIngredients.split('\n').filter((l) => l.trim());
    const ingredients = matchAllIngredients(
      lines.map((text) => ({ text: text.trim(), matched: false, matchedId: null, source: 'none' as const })),
    );
    setRecipe({
      name: 'New Recipe', description: '', ingredients, instructions: [],
      prepTime: '', cookTime: '', totalTime: '', servings: '', image: '', url: '',
    });
    setManualMode(false);
  };

  const isInStock = (ing: ParsedIngredient): boolean => {
    if (!ing.matched || !ing.matchedId) return false;
    if (ing.source === 'freezer') {
      for (const [, cat] of Object.entries(freezer)) {
        const item = cat.items.find((i) => i.id === ing.matchedId);
        if (item && item.quantity > 0) return true;
      }
      return false;
    }
    if (ing.source === 'pantry') {
      for (const [, cat] of Object.entries(pantry)) {
        const item = cat.items.find((i) => i.id === ing.matchedId);
        if (item?.inStock) return true;
      }
      return false;
    }
    if (ing.source === 'fridge') return true;
    return false;
  };

  return (
    <div>
      <p className="text-sm text-gray-500 mb-4">
        Paste a NYT Cooking gift link (or any recipe URL) to check what you have.
      </p>

      <div className="flex gap-2 mb-3">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && fetchRecipe()}
          placeholder="https://cooking.nytimes.com/recipes/..."
          className="flex-1 min-w-0 px-4 py-3 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
        />
        <button
          onClick={fetchRecipe}
          disabled={loading || !url.trim()}
          className="px-5 py-3 bg-amber-600 text-white rounded-xl text-sm font-semibold hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Parsing...' : 'Go'}
        </button>
      </div>

      <button
        onClick={() => setManualMode(!manualMode)}
        className="text-xs text-amber-600 hover:text-amber-700 mb-4 block"
      >
        {manualMode ? 'Hide manual entry' : 'Or paste ingredients manually'}
      </button>

      {manualMode && (
        <div className="mb-6">
          <textarea
            value={manualIngredients}
            onChange={(e) => setManualIngredients(e.target.value)}
            placeholder={"1 lb ground beef\n1 can crushed tomatoes\n2 cloves garlic\n..."}
            rows={8}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 resize-none"
          />
          <button
            onClick={handleManualParse}
            className="mt-2 px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700"
          >
            Check inventory
          </button>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin" />
        </div>
      )}

      {recipe && <ImportedRecipeCard recipe={recipe} isInStock={isInStock} />}
    </div>
  );
}

// ─── Shared UI Components ───

function ResultSection({ title, accent, children }: { title: string; accent: 'green' | 'amber' | 'gray'; children: React.ReactNode }) {
  const dot = { green: 'bg-green-500', amber: 'bg-amber-500', gray: 'bg-gray-400' };
  const border = { green: 'border-green-200', amber: 'border-amber-200', gray: 'border-gray-200' };
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-2 h-2 rounded-full ${dot[accent]}`} />
        <h3 className="text-sm font-bold text-gray-700">{title}</h3>
      </div>
      <div className={`space-y-2 border-l-2 ${border[accent]} pl-4 ml-0.5`}>
        {children}
      </div>
    </div>
  );
}

function ScoredRecipeCard({ recipe, status, missing }: { recipe: Recipe; status: 'ready' | 'almost' | 'missing'; missing?: string[] }) {
  const bg = { ready: 'bg-green-50 border-green-200', almost: 'bg-amber-50 border-amber-200', missing: 'bg-gray-50 border-gray-100' };
  const icon = { ready: '\u2705', almost: '\u{1F7E1}', missing: '\u274C' };
  const categoryLabel = recipe.category.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  const formatMissing = (id: string) =>
    id.replace(/^(pantry-|fridge-|easy-|beef-|pork-|venison-)/, '').replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className={`rounded-xl px-4 py-3 border ${bg[status]} transition-colors`}>
      <div className="flex items-center gap-2">
        <span className="text-lg">{icon[status]}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-800">{recipe.name}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/60 border border-gray-200 text-gray-400">{categoryLabel}</span>
          </div>
          {recipe.note && <p className="text-xs text-gray-500 mt-0.5">{recipe.note}</p>}
        </div>
      </div>
      {missing && missing.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2 ml-7">
          {missing.map((id) => (
            <span key={id} className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-gray-200 text-gray-500">
              Need: {formatMissing(id)}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function ImportedRecipeCard({ recipe, isInStock }: { recipe: ParsedRecipe; isInStock: (ing: ParsedIngredient) => boolean }) {
  const haveCount = recipe.ingredients.filter((i) => i.matched && isInStock(i)).length;
  const matchedButOut = recipe.ingredients.filter((i) => i.matched && !isInStock(i)).length;
  const unmatched = recipe.ingredients.filter((i) => !i.matched).length;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {recipe.image && <img src={recipe.image} alt={recipe.name} className="w-full h-48 object-cover" />}
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-1">{recipe.name}</h3>
        {recipe.description && <p className="text-sm text-gray-500 mb-3">{recipe.description}</p>}
        <div className="flex flex-wrap gap-3 mb-4 text-xs text-gray-500">
          {recipe.prepTime && <span>Prep: {recipe.prepTime}</span>}
          {recipe.cookTime && <span>Cook: {recipe.cookTime}</span>}
          {recipe.totalTime && <span>Total: {recipe.totalTime}</span>}
          {recipe.servings && <span>Serves: {recipe.servings}</span>}
        </div>
        <div className="flex gap-2 mb-4">
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">{haveCount} have</span>
          {matchedButOut > 0 && <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">{matchedButOut} out of stock</span>}
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">{unmatched} need to buy</span>
        </div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Ingredients</h4>
        <div className="space-y-1.5 mb-5">
          {recipe.ingredients.map((ing, i) => {
            const inStock = ing.matched && isInStock(ing);
            const outOfStock = ing.matched && !isInStock(ing);
            return (
              <div key={i} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${inStock ? 'bg-green-50 border border-green-200' : outOfStock ? 'bg-red-50 border border-red-200' : 'bg-gray-50 border border-gray-100'}`}>
                <span className="text-base">{inStock ? '\u2705' : outOfStock ? '\u{1F6D2}' : '\u2753'}</span>
                <span className={`flex-1 ${inStock ? 'text-green-800' : outOfStock ? 'text-red-800' : 'text-gray-600'}`}>{ing.text}</span>
                {ing.matched && <span className="text-[10px] text-gray-400 uppercase">{ing.source}</span>}
              </div>
            );
          })}
        </div>
        {recipe.instructions.length > 0 && (
          <>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Instructions</h4>
            <ol className="space-y-3 mb-4">
              {recipe.instructions.map((step, i) => (
                <li key={i} className="flex gap-3 text-sm text-gray-600">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 text-amber-700 text-xs font-bold flex items-center justify-center">{i + 1}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </>
        )}
        {recipe.url && <a href={recipe.url} target="_blank" rel="noopener noreferrer" className="text-xs text-amber-600 hover:text-amber-700 underline">View original recipe</a>}
      </div>
    </div>
  );
}
