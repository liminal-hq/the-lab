import { test, expect } from '@playwright/test';

test('verify squeak mechanic (area of effect on birds)', async ({ page }) => {
  // Navigate to local origin to set localStorage first to prevent help modal
  await page.goto('http://localhost:8000/');
  await page.evaluate(() => localStorage.setItem('rats_tutorial_seen', 'true'));

  await page.goto('http://localhost:8000/rats-the-video-game/index.html');
  await page.waitForFunction(() => window.gameState && window.gameState.rat);

  await page.evaluate(() => {
    // Reset state and place rat at specific position
    window.gameState.rat.x = 1000;
    window.gameState.rat.y = 50;

    // Inject birds with custom IDs for tracking
    // 1. Near bird (< 400)
    // 2. Far bird (> 400)
    window.gameState.birds = [
      { id: 'near', x: 1200, y: 100, speed: 2, vy: 0 },
      { id: 'far', x: 1500, y: 100, speed: 2, vy: 0 }
    ];

    // Trigger squeak
    window.gameState.input.squeakPressed = true;
  });

  // Wait for squeak to be consumed
  await page.waitForFunction(() => !window.gameState.input.squeakPressed);

  // Assert birds
  const birdsAfter = await page.evaluate(() => window.gameState.birds);
  const nearBird = birdsAfter.find(b => b.id === 'near');
  const farBird = birdsAfter.find(b => b.id === 'far');

  expect(nearBird.vy).toBeLessThan(0); // Should be scared upwards
  expect(farBird.vy).toBe(0); // Should be unaffected
});
