import type { VercelRequest, VercelResponse } from '@vercel/node';

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.body as { url: string };

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });

    if (!response.ok) {
      return res.status(422).json({ error: `Failed to fetch URL: ${response.status}` });
    }

    const html = await response.text();

    // Extract JSON-LD structured data
    const jsonLdMatch = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);

    let recipeData: Record<string, unknown> | null = null;

    if (jsonLdMatch) {
      for (const match of jsonLdMatch) {
        const jsonStr = match.replace(/<script[^>]*>/, '').replace(/<\/script>/, '').trim();
        try {
          const parsed = JSON.parse(jsonStr);
          // Could be an array or single object
          const items = Array.isArray(parsed) ? parsed : [parsed];
          for (const item of items) {
            if (item['@type'] === 'Recipe' || (Array.isArray(item['@type']) && item['@type'].includes('Recipe'))) {
              recipeData = item;
              break;
            }
            // Check @graph
            if (item['@graph'] && Array.isArray(item['@graph'])) {
              const recipe = item['@graph'].find((g: Record<string, unknown>) =>
                g['@type'] === 'Recipe' || (Array.isArray(g['@type']) && (g['@type'] as string[]).includes('Recipe'))
              );
              if (recipe) {
                recipeData = recipe;
                break;
              }
            }
          }
        } catch {
          // skip malformed JSON-LD
        }
        if (recipeData) break;
      }
    }

    // Fallback: try extracting from meta tags
    if (!recipeData) {
      const titleMatch = html.match(/<meta\s+property="og:title"\s+content="([^"]+)"/i);
      const descMatch = html.match(/<meta\s+property="og:description"\s+content="([^"]+)"/i);
      const imageMatch = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i);

      if (titleMatch) {
        recipeData = {
          name: titleMatch[1],
          description: descMatch?.[1] ?? '',
          image: imageMatch?.[1] ?? '',
        };
      }
    }

    if (!recipeData) {
      return res.status(422).json({ error: 'Could not find recipe data on this page. Try pasting ingredients manually.' });
    }

    // Parse ingredients from JSON-LD
    const rawIngredients: string[] = [];
    if (recipeData.recipeIngredient && Array.isArray(recipeData.recipeIngredient)) {
      rawIngredients.push(...(recipeData.recipeIngredient as string[]));
    }

    // Parse instructions
    const instructions: string[] = [];
    if (recipeData.recipeInstructions) {
      const ri = recipeData.recipeInstructions;
      if (Array.isArray(ri)) {
        for (const step of ri) {
          if (typeof step === 'string') {
            instructions.push(step);
          } else if (step && typeof step === 'object' && 'text' in step) {
            instructions.push(String(step.text));
          }
        }
      }
    }

    // Parse duration (PT30M -> 30 min)
    const parseDuration = (d: unknown): string => {
      if (!d || typeof d !== 'string') return '';
      const match = d.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
      if (!match) return String(d);
      const hours = match[1] ? `${match[1]}h ` : '';
      const mins = match[2] ? `${match[2]}m` : '';
      return `${hours}${mins}`.trim();
    };

    const recipe: ParsedRecipe = {
      name: String(recipeData.name ?? ''),
      description: String(recipeData.description ?? ''),
      ingredients: rawIngredients.map((text) => ({
        text,
        matched: false,
        matchedId: null,
        source: 'none' as const,
      })),
      instructions,
      prepTime: parseDuration(recipeData.prepTime),
      cookTime: parseDuration(recipeData.cookTime),
      totalTime: parseDuration(recipeData.totalTime),
      servings: String(recipeData.recipeYield ?? ''),
      image: typeof recipeData.image === 'string'
        ? recipeData.image
        : (Array.isArray(recipeData.image) ? String(recipeData.image[0]) : ''),
      url,
    };

    return res.status(200).json(recipe);
  } catch (err) {
    return res.status(500).json({ error: `Failed to parse recipe: ${err instanceof Error ? err.message : 'Unknown error'}` });
  }
}
