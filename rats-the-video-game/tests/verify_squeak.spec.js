import { test, expect } from '@playwright/test';

test('verify squeak mechanic scares nearby birds', async ({ page }) => {
  // Go to the game
  await page.goto('http://localhost:8000/rats-the-video-game/index.html');

  // Wait for game to initialize and expose state
  await page.waitForFunction(() => window.gameState && window.gameState.rat);

  // Setup: Reset game state and inject test entities
  await page.evaluate(() => {
    // Reset rat
    window.gameState.rat.x = 100;
    window.gameState.rat.y = 0;

    // Clear birds
    window.gameState.birds = [];

    // Inject near bird (distance < 400)
    window.gameState.birds.push({ id: 'near_bird', x: 200, y: 50, vy: 0 });

    // Inject far bird (distance >= 400)
    window.gameState.birds.push({ id: 'far_bird', x: 600, y: 50, vy: 0 });
  });

  // Trigger squeak by modifying input state
  await page.evaluate(() => {
    window.gameState.input.squeakPressed = true;
  });

  // Wait a few frames for game loop to process the squeak
  await page.waitForTimeout(100);

  // Check bird states
  const results = await page.evaluate(() => {
    return {
      nearBird: window.gameState.birds.find(b => b.id === 'near_bird'),
      farBird: window.gameState.birds.find(b => b.id === 'far_bird')
    };
  });

  // Near bird should have negative vy (flying up)
  expect(results.nearBird.vy).toBeLessThan(0);

  // Far bird should still have 0 vy
  expect(results.farBird.vy).toBe(0);
});
