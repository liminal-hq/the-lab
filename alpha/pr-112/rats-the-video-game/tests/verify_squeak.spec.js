import { test, expect } from '@playwright/test';

test('verify squeak mechanic scares nearby birds', async ({ page }) => {
  await page.goto('http://localhost:8000/rats-the-video-game/index.html');
  await page.waitForFunction(() => window.gameState && window.gameState.rat);

  // Setup state for testing squeak
  await page.evaluate(() => {
    window.gameState.score = 0;
    window.gameState.rat.x = 100;
    window.gameState.rat.y = 0;
    window.gameState.rat.vx = 0;
    window.gameState.rat.vy = 0;
    window.gameState.rat.grounded = true;
    window.gameState.input.squeakPressed = false;

    // Create birds: one nearby, one far away
    window.gameState.birds = [
        { x: 150, y: 100, vy: 0, speed: 0 }, // Nearby, should be scared (dist = 50 < 400)
        { x: 600, y: 100, vy: 0, speed: 0 }  // Far away, shouldn't be affected (dist = 500 > 400)
    ];
  });

  // Trigger squeak
  await page.evaluate(() => {
    window.gameState.input.squeakPressed = true;
  });

  // Wait for squeak to be consumed by the game loop
  await page.waitForFunction(() => window.gameState.input.squeakPressed === false);

  const birdsState = await page.evaluate(() => window.gameState.birds);

  // Assert nearby bird is scared (vy should be negative, i.e., moving up)
  expect(birdsState[0].vy).toBeLessThan(0);

  // Assert far bird is unaffected (vy should still be 0)
  expect(birdsState[1].vy).toBe(0);
});
