import { test, expect } from '@playwright/test';

test('verify squeak mechanic scares birds', async ({ page }) => {
  await page.goto('http://localhost:8000/rats-the-video-game/index.html');
  await page.waitForFunction(() => window.gameState && window.gameState.rat);

  // Wait for the first tick
  await page.waitForTimeout(100);

  // Set up scenario: single rat and single bird nearby
  await page.evaluate(() => {
    window.gameState.score = 0;
    window.gameState.rat.x = 100;
    window.gameState.rat.y = 50;

    // Position bird near the rat
    window.gameState.birds = [
      { x: 150, y: 30, vx: 0, vy: 0, width: 20, height: 20 }
    ];
    window.gameState.turds = [];

    // Clear inputs
    window.gameState.input.left = false;
    window.gameState.input.right = false;
    window.gameState.input.jump = false;
    window.gameState.input.jumpPressed = false;
    window.gameState.input.chew = false;
    window.gameState.input.squeakPressed = false;
  });

  // Trigger squeak
  await page.evaluate(() => {
    window.gameState.input.squeakPressed = true;
  });

  // Wait for the single-frame squeak logic to process and clear the flag
  await page.waitForFunction(() => window.gameState.input.squeakPressed === false);

  // Verify bird state
  const birdVy = await page.evaluate(() => window.gameState.birds[0].vy);

  // The squeak logic sets bird.vy < 0 (upwards movement)
  expect(birdVy).toBeLessThan(0);
});
