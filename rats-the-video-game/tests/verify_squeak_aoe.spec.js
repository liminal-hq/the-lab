import { test, expect } from '@playwright/test';

test('verify squeak mechanic area of effect', async ({ page }) => {
  await page.goto('http://localhost:8000/rats-the-video-game/index.html');
  await page.waitForFunction(() => window.gameState && window.gameState.rat);

  // Setup state for squeak test
  await page.evaluate(() => {
    // Stop random elements from interfering
    window.gameState.score = 0;
    window.gameState.rat.x = 1000;
    window.gameState.rat.y = 100;

    // Inject mock birds at known distances
    window.gameState.birds = [
      { id: 'bird-inside', x: 1200, y: 100, vy: 0 }, // dx=200, inside 400 radius
      { id: 'bird-outside', x: 1500, y: 100, vy: 0 }, // dx=500, outside 400 radius
    ];

    // Trigger squeak
    window.gameState.input.squeakPressed = true;
  });

  // Wait a few frames for the game loop to process the input
  await page.waitForTimeout(100);

  // Verify state mutations
  const birds = await page.evaluate(() => window.gameState.birds);

  const birdInside = birds.find(b => b.id === 'bird-inside');
  const birdOutside = birds.find(b => b.id === 'bird-outside');

  expect(birdInside).toBeDefined();
  expect(birdOutside).toBeDefined();

  // Bird inside the radius should have a negative vy (moving upwards)
  expect(birdInside.vy).toBeLessThan(0);

  // Bird outside the radius should remain unaffected (vy = 0)
  expect(birdOutside.vy).toBe(0);
});
