
import { test, expect } from '@playwright/test';

test('verify level transition', async ({ page }) => {
  // Go to the game
  await page.goto('http://localhost:8000/rats-the-video-game/index.html');

  // Wait for game to initialize
  await page.waitForTimeout(1000);

  // Expose info to console
  const result = await page.evaluate(() => {
    const subway = window.gameState.obstacles.find(o => o.type === 'SUBWAY_ENTRANCE');
    if (!subway) return { error: "Subway entrance not found" };

    // Teleport rat to subway entrance
    window.gameState.rat.x = subway.x + 10;
    window.gameState.rat.y = 0;

    // Wait for update (simulated by returning info after a small delay logic via next evaluate,
    // but here we just set it and return initial state)
    return {
        found: true,
        subwayX: subway.x,
        initialLevel: window.gameState.level
    };
  });

  console.log('Setup Result:', result);
  expect(result.found).toBe(true);
  expect(result.initialLevel).toBe('SURFACE');

  // Wait for a few frames for the game loop to update collision
  await page.waitForTimeout(500);

  // Check new state
  const newLevel = await page.evaluate(() => window.gameState.level);
  console.log('New Level:', newLevel);

  expect(newLevel).toBe('SUBWAY');
});
