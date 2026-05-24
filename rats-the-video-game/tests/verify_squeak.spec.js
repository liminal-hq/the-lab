import { test, expect } from '@playwright/test';

test('verify squeak mechanic scares nearby birds', async ({ page }) => {
  await page.goto('http://localhost:8000/rats-the-video-game/index.html');
  await page.waitForFunction(() => window.gameState && window.gameState.rat);

  // Setup predictable state for test
  await page.evaluate(() => {
    window.gameState.rat.x = 100;
    window.gameState.rat.y = 0;
    window.gameState.rat.vy = 0;
    window.gameState.rat.vx = 0;

    // Place birds
    window.gameState.birds = [
      { x: 200, y: 100, vy: 0 }, // Close (100px away)
      { x: 600, y: 100, vy: 0 }, // Far (500px away)
      { x: 150, y: 100, vy: -5 } // Close, but already flying
    ];

    // Trigger Squeak
    window.gameState.input.squeakPressed = true;
  });

  // Wait for game loop to consume the squeak input
  await page.waitForFunction(() => window.gameState.input.squeakPressed === false);

  // Evaluate final bird states
  const birds = await page.evaluate(() => window.gameState.birds);

  // Bird 0: close by, vy should be between -5 and -2 ( -(Math.random() * 3 + 2) )
  expect(birds[0].vy).toBeLessThanOrEqual(-2);

  // Bird 1: too far, vy should still be 0
  expect(birds[1].vy).toBe(0);

  // Bird 2: already flying, vy should be preserved
  expect(birds[2].vy).toBe(-5);
});
