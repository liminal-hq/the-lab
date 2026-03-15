import { test, expect } from '@playwright/test';

test('verify collision mechanics (wall push-out and landing)', async ({ page }) => {
  await page.goto('http://localhost:8000/rats-the-video-game/index.html');
  await page.waitForFunction(() => window.gameState && window.gameState.rat);

  await page.evaluate(() => {
    window.gameState.score = 0;
    window.gameState.birds = [];
    window.gameState.turds = [];
    window.gameState.input.left = false;
    window.gameState.input.right = false;
    window.gameState.input.jump = false;
    window.gameState.input.jumpPressed = false;
    window.gameState.input.chew = false;
  });

  await page.evaluate(() => {
    window.gameState.rat.x = 100;
    window.gameState.rat.y = 50;
    window.gameState.rat.vy = -10;
    window.gameState.rat.vx = 0;
    window.gameState.obstacles = [];
  });

  await page.waitForFunction(() => window.gameState.rat.y <= 0 && window.gameState.rat.grounded);

  const groundY = await page.evaluate(() => window.gameState.rat.y);
  expect(groundY).toBe(0);

  await page.evaluate(() => {
    window.gameState.rat.y = 10;
    window.gameState.rat.vy = 0;
    window.gameState.rat.grounded = true;
    window.gameState.obstacles = [{ x: 150, w: 30, h: 30, type: 'BOX' }];
    window.gameState.rat.x = 140;
    window.gameState.rat.vx = 5;
  });

  await page.waitForFunction(() => window.gameState.rat.vx <= 0 && window.gameState.rat.x <= 135);

  const stateAfterWall = await page.evaluate(() => ({
    x: window.gameState.rat.x,
    vx: window.gameState.rat.vx
  }));

  expect(stateAfterWall.x).toBeLessThanOrEqual(135);
  expect(stateAfterWall.vx).toBe(0);

  await page.evaluate(() => {
    window.gameState.obstacles = [{ x: 150, w: 30, h: 30, type: 'BOX' }];
    window.gameState.rat.x = 165;
    window.gameState.rat.y = 40;
    window.gameState.rat.vy = -5;
    window.gameState.rat.vx = 0;
    window.gameState.rat.grounded = false;
  });

  await page.waitForFunction(() =>
    window.gameState.rat.y === 30 &&
    window.gameState.rat.vy === 0 &&
    window.gameState.rat.grounded
  );

  const stateAfterLand = await page.evaluate(() => ({
    y: window.gameState.rat.y,
    vy: window.gameState.rat.vy,
    grounded: window.gameState.rat.grounded
  }));

  expect(stateAfterLand.y).toBe(30);
  expect(stateAfterLand.vy).toBe(0);
  expect(stateAfterLand.grounded).toBe(true);
});
