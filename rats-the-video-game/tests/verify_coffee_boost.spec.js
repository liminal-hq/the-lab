import { test, expect } from '@playwright/test';

test('verify coffee speed boost mechanics', async ({ page }) => {
  // Go to the game
  await page.goto('http://localhost:8000/rats-the-video-game/index.html');

  // Wait for game to initialize and expose state
  await page.waitForFunction(() => window.gameState && window.gameState.rat);

  // Setup: Reset game state for testing
  await page.evaluate(() => {
    window.gameState.score = 0;
    // Move Rat to a safe known location (x=100, y=0 is default start)
    window.gameState.rat.x = 100;
    window.gameState.rat.y = 0;
    window.gameState.rat.vx = 0;
    window.gameState.rat.vy = 0;
    window.gameState.speedBoost = false;
    window.gameState.speedBoostTimer = 0;

    // Clear existing obstacles and turds to avoid interference
    window.gameState.obstacles = [];
    window.gameState.turds = [];
  });

  // --- Test Case 1: Base Speed ---
  // Simulate moving right
  await page.evaluate(() => {
    window.gameState.input.right = true;
  });

  // Wait for a game loop frame to apply velocity
  await page.waitForTimeout(50);

  const baseSpeed = await page.evaluate(() => window.gameState.rat.vx);
  expect(baseSpeed).toBe(5); // Baseline SPEED is 5

  // --- Test Case 2: Collect Coffee (+5 score, speedBoost = true, speedBoostTimer = 300) ---
  const scoreBeforeCoffee = await page.evaluate(() => window.gameState.score);

  await page.evaluate(() => {
    // Spawn COFFEE at rat location
    // Rat is at 100,0. Size ~30x20.
    // Obstacle COFFEE: w=20, h=25.
    window.gameState.obstacles.push({ x: 100, w: 20, h: 25, type: 'COFFEE' });
  });

  // Wait for game loop to process collision
  await page.waitForTimeout(100);

  const scoreAfterCoffee = await page.evaluate(() => window.gameState.score);
  expect(scoreAfterCoffee).toBe(scoreBeforeCoffee + 5);

  const speedBoostData = await page.evaluate(() => {
    return {
      active: window.gameState.speedBoost,
      timer: window.gameState.speedBoostTimer,
      vx: window.gameState.rat.vx
    };
  });

  expect(speedBoostData.active).toBe(true);
  expect(speedBoostData.timer).toBeGreaterThan(0);
  expect(speedBoostData.timer).toBeLessThanOrEqual(300);
  expect(speedBoostData.vx).toBe(7.5); // SPEED * 1.5

  // --- Test Case 3: Speed Boost Expiration ---
  await page.evaluate(() => {
    // Fast forward the timer to expire on the next few frames
    window.gameState.speedBoostTimer = 1;
  });

  // Wait for a few game loop frames for the timer to reach 0 and reset the boost
  await page.waitForTimeout(100);

  const expiredBoostData = await page.evaluate(() => {
    return {
      active: window.gameState.speedBoost,
      timer: window.gameState.speedBoostTimer,
      vx: window.gameState.rat.vx
    };
  });

  expect(expiredBoostData.active).toBe(false);
  expect(expiredBoostData.timer).toBe(0);
  expect(expiredBoostData.vx).toBe(5); // Should return to base SPEED

  // Stop moving right
  await page.evaluate(() => {
    window.gameState.input.right = false;
  });
});
