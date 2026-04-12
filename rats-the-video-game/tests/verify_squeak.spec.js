import { test, expect } from '@playwright/test';

test('verify squeak mechanic logic', async ({ page }) => {
  await page.goto('http://localhost:8000/rats-the-video-game/index.html');
  await page.waitForFunction(() => window.gameState && window.gameState.rat);

  // Dismiss help modal so controls register
  await page.evaluate(() => {
    const btn = document.getElementById('close-btn');
    if (btn) btn.click();
  });

  await page.evaluate(() => {
    // Reset state
    window.gameState.score = 0;
    window.gameState.rat.x = 1000;
    window.gameState.rat.y = 0;

    // Clear obstacles
    window.gameState.obstacles = [];

    // Create test birds
    window.gameState.birds = [
      { x: 1200, y: 0, vy: 0 }, // 200 away (should scare)
      { x: 1500, y: 0, vy: 0 }  // 500 away (should not scare)
    ];
  });

  // Press squeak directly via state logic
  await page.evaluate(() => {
    window.gameState.input.squeakPressed = true;
  });

  // Wait a short time for game loop to pick up input
  await page.waitForTimeout(200);

  const birds = await page.evaluate(() => window.gameState.birds);

  // Near bird should have negative vy (moving up)
  expect(birds[0].vy).toBeLessThan(0);

  // Far bird should have 0 vy (not moving up)
  expect(birds[1].vy).toBe(0);
});
