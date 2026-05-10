import { test, expect } from '@playwright/test';

test('verify squeak mechanics (scaring birds)', async ({ page }) => {
  await page.goto('http://localhost:8000/rats-the-video-game/index.html');
  await page.waitForFunction(() => window.gameState && window.gameState.rat);

  await page.evaluate(() => {
    // Setup state
    window.gameState.rat.x = 100;
    window.gameState.rat.y = 0;
    window.gameState.birds = [
        { x: 150, y: 100, vy: 0 }, // Close enough (dist < 400)
        { x: 450, y: 100, vy: 0 }, // Close enough (dist < 400)
        { x: 600, y: 100, vy: 0 }  // Too far (dist > 400)
    ];
    window.gameState.input.squeakPressed = true;
  });

  // Wait for the birds to be affected
  await page.waitForFunction(() => window.gameState.birds[0].vy < 0);

  const birdVys = await page.evaluate(() => window.gameState.birds.map(b => b.vy));

  expect(birdVys[0]).toBeLessThan(0); // Scared
  expect(birdVys[1]).toBeLessThan(0); // Scared
  expect(birdVys[2]).toBe(0); // Not scared
});
