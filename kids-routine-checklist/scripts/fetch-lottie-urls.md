# How to Populate Lottie URLs

The `dailyTheme.ts` file has 84 animals with empty `lottieSrc` strings.
Until populated, the emoji fallback renders (existing behavior preserved).

## Quick Method: LottieFiles Search

1. Go to https://lottiefiles.com/search?q=ANIMAL_NAME (e.g. `?q=tiger`)
2. Click an animation you like
3. Click the **"..."** menu → **"Copy asset link"** or find the embed code
4. The URL will look like: `https://lottie.host/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX/filename.lottie`
5. Paste it into the `lottieSrc` field in `src/lib/dailyTheme.ts`

## Example

```ts
// Before:
{ emoji: "🐅", lottieSrc: "", name: "tiger" },

// After:
{ emoji: "🐅", lottieSrc: "https://lottie.host/abc12345-def6-7890-abcd-ef1234567890/tiger.lottie", name: "tiger" },
```

## Tips

- Prefer animations with **transparent backgrounds** (works with both light/dark mode)
- Look for animations that are **looping** or at least 2+ seconds
- Keep file sizes small (< 100KB each)
- The `.lottie` format is preferred over `.json` (smaller file size)
- If an animal doesn't have a good match, leave `lottieSrc: ""` — emoji renders instead
