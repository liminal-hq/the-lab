
import { test, expect } from '@playwright/test';

test('verify score mechanics', async ({ page }) => {
  // Go to the game
  await page.goto('http://localhost:8000/rats-the-video-game/index.html');

  // Wait for game to initialize and expose state
  await page.waitForFunction(() => window.gameState && window.gameState.rat);

  // Setup: Reset game state for testing
  await page.evaluate(() => {
    // Reset Score
    window.gameState.score = 0;
    // Move Rat to a safe known location (x=100, y=0 is default start)
    window.gameState.rat.x = 100;
    window.gameState.rat.y = 0;
    window.gameState.rat.vx = 0;
    window.gameState.rat.vy = 0;
    // Clear existing obstacles and turds to avoid interference
    window.gameState.obstacles = [];
    window.gameState.turds = [];
  });

  // --- Test Case 1: Collect Pizza (+10) ---
  const initialScore = await page.evaluate(() => {
    // Spawn PIZZA at rat location
    // Rat is at 100,0. Size ~30x20.
    // Obstacle PIZZA: w=30, h=40.
    // Collision logic: ratR > obsL && ratL < obsR && ratB < obsT
    // Place PIZZA at x=100.
    window.gameState.obstacles.push({ x: 100, w: 30, h: 40, type: 'PIZZA' });
    return window.gameState.score;
  });

  expect(initialScore).toBe(0);

  // Wait for game loop to process collision (approx 500ms)
  await page.waitForTimeout(500);

  const scoreAfterPizza = await page.evaluate(() => window.gameState.score);
  expect(scoreAfterPizza).toBe(10);

  // Verify PIZZA is removed
  const obstacleCount = await page.evaluate(() => window.gameState.obstacles.length);
  expect(obstacleCount).toBe(0);


  // --- Test Case 2: Hit by Turd (-5) ---
  await page.evaluate(() => {
    // Spawn TURD at rat location
    // Turd logic: circle/box check.
    // Rat: x=100, y=0. w=30, h=20.
    // Turd: x, y. Size ~5.
    // Place TURD at x=110, y=10 (center of rat)
    window.gameState.turds.push({ x: 110, y: 10, vy: 0 });
  });

  // Wait for collision
  await page.waitForTimeout(500);

  const scoreAfterTurd = await page.evaluate(() => window.gameState.score);
  expect(scoreAfterTurd).toBe(5); // 10 - 5 = 5


  // --- Test Case 3: Score Floor (Min 0) ---
  await page.evaluate(() => {
    window.gameState.score = 0;
    // Spawn another TURD
    window.gameState.turds.push({ x: 110, y: 10, vy: 0 });
  });

  await page.waitForTimeout(500);

  const scoreFloor = await page.evaluate(() => window.gameState.score);
  expect(scoreFloor).toBe(0); // Should not go below 0
});
