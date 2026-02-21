import { test, expect } from '@playwright/test';

test('verify district generation', async ({ page }) => {
  // Go to the game
  await page.goto('http://localhost:8000/rats-the-video-game/index.html');

  // Wait for game to initialize
  await page.waitForTimeout(1000);

  // Get buildings from game state
  const buildings = await page.evaluate(() => window.gameState.buildings);

  console.log(`Total buildings: ${buildings.length}`);

  // Helper to extract hue from "hsl(123.45, 20%, 30%)"
  const getHue = (color) => {
      const match = color.match(/hsl\(([-\d.]+),/);
      return match ? parseFloat(match[1]) : null;
  };

  // District 1: "The Burbs" (Indices 0-8) -> Hue 100 +/- 20 (80 to 120)
  // We skip index 0 sometimes as it might be special start? No, loop starts at 0.
  // Let's check a few
  for (let i = 0; i <= 8; i++) {
      const hue = getHue(buildings[i].color);
      console.log(`Building ${i} Hue: ${hue}`);
      expect(hue).toBeGreaterThanOrEqual(80);
      expect(hue).toBeLessThanOrEqual(120);
  }

  // District 2: "Downtown" (Indices 9-16) -> Hue 200 +/- 20 (180 to 220)
  for (let i = 9; i <= 16; i++) {
      const hue = getHue(buildings[i].color);
      console.log(`Building ${i} Hue: ${hue}`);
      expect(hue).toBeGreaterThanOrEqual(180);
      expect(hue).toBeLessThanOrEqual(220);
  }

  // District 3: "Industrial" (Indices 17+) -> Hue 0 +/- 20 (-20 to 20)
  for (let i = 17; i < buildings.length; i++) {
       // Filter out "TUNNEL" types if any (should be SURFACE buildings here)
       if (buildings[i].type === 'TUNNEL') continue;

      const hue = getHue(buildings[i].color);
      console.log(`Building ${i} Hue: ${hue}`);
      expect(hue).toBeGreaterThanOrEqual(-20);
      expect(hue).toBeLessThanOrEqual(20);
  }
});
