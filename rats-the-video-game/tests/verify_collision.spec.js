import { test, expect } from '@playwright/test';

test('verify collision mechanics (wall push-out and landing)', async ({ page }) => {
  await page.goto('http://localhost:8000/rats-the-video-game/index.html');
  await page.waitForFunction(() => window.gameState && window.gameState.rat);

  // Test Case 1: Ground Collision
  await page.evaluate(() => {
    window.gameState.rat.x = 100;
    window.gameState.rat.y = 50;
    window.gameState.rat.vy = -10;
    window.gameState.obstacles = [];
  });

  // Wait for it to hit the ground (y <= 0 and grounded is true, or vy becomes 0 due to landing logic)
  await page.waitForFunction(() => window.gameState.rat.y <= 0 && window.gameState.rat.grounded);

  const groundY = await page.evaluate(() => window.gameState.rat.y);
  expect(groundY).toBe(0);

  // Test Case 2: Wall Push-out (Left side)
  await page.evaluate(() => {
    window.gameState.rat.y = 10; // Grounded
    window.gameState.rat.vy = 0;
    // Box at x=150, w=30. obsL = 150.
    window.gameState.obstacles = [{ x: 150, w: 30, h: 30, type: 'BOX' }];
    // Rat x=140 means ratL=125, ratR=155. Overlaps left side of box by 5.
    window.gameState.rat.x = 140;
    window.gameState.rat.vx = 5;
  });

  // Wait for push-out to complete (vx becomes 0 or x becomes <= 135)
  await page.waitForFunction(() => window.gameState.rat.vx <= 0 && window.gameState.rat.x <= 135);

  const stateAfterWall = await page.evaluate(() => ({
    x: window.gameState.rat.x,
    vx: window.gameState.rat.vx
  }));

  // Pushed to obsL - 15 = 150 - 15 = 135
  expect(stateAfterWall.x).toBeLessThanOrEqual(135);
  expect(stateAfterWall.vx).toBe(0);

  // Test Case 3: Landing on Box
  await page.evaluate(() => {
    window.gameState.obstacles = [{ x: 150, w: 30, h: 30, type: 'BOX' }];
    // Rat above the box, falling
    window.gameState.rat.x = 165; // Middle of the box
    window.gameState.rat.y = 40;  // Above obsT (30)
    window.gameState.rat.vy = -5;
    window.gameState.rat.vx = 0;
  });

  // Wait to land exactly on obsT (30)
  await page.waitForFunction(() => window.gameState.rat.y === 30 && window.gameState.rat.vy === 0 && window.gameState.rat.grounded);

  const stateAfterLand = await page.evaluate(() => ({
    y: window.gameState.rat.y,
    vy: window.gameState.rat.vy,
    grounded: window.gameState.rat.grounded
  }));

  // Should land exactly on obsT (30)
  expect(stateAfterLand.y).toBe(30);
  expect(stateAfterLand.vy).toBe(0);
  expect(stateAfterLand.grounded).toBe(true);
});
