import { test, expect } from '@playwright/test';

test('verify coffee speed boost mechanics', async ({ page }) => {
  await page.goto('http://localhost:8000/rats-the-video-game/index.html');
  await page.waitForFunction(() => window.gameState && window.gameState.rat);

  await page.evaluate(() => {
    window.gameState.score = 0;
    window.gameState.rat.x = 100;
    window.gameState.rat.y = 0;
    window.gameState.rat.vx = 0;
    window.gameState.rat.vy = 0;
    window.gameState.rat.grounded = true;
    window.gameState.rat.canDoubleJump = true;
    window.gameState.speedBoost = false;
    window.gameState.speedBoostTimer = 0;
    window.gameState.input.left = false;
    window.gameState.input.right = false;
    window.gameState.input.jump = false;
    window.gameState.input.jumpPressed = false;
    window.gameState.input.chew = false;
    window.gameState.obstacles = [];
    window.gameState.birds = [];
    window.gameState.turds = [];
  });

  await page.evaluate(() => {
    window.gameState.input.right = true;
  });

  await page.waitForFunction(() => window.gameState.rat.vx === 5);

  const baseSpeed = await page.evaluate(() => window.gameState.rat.vx);
  expect(baseSpeed).toBe(5);

  const scoreBeforeCoffee = await page.evaluate(() => window.gameState.score);

  await page.evaluate(() => {
    window.gameState.obstacles.push({ x: 100, w: 20, h: 25, type: 'COFFEE' });
  });

  await page.waitForFunction(() =>
    window.gameState.speedBoost === true &&
    window.gameState.score === 5 &&
    window.gameState.rat.vx === 7.5
  );

  const scoreAfterCoffee = await page.evaluate(() => window.gameState.score);
  expect(scoreAfterCoffee).toBe(scoreBeforeCoffee + 5);

  const speedBoostData = await page.evaluate(() => ({
    active: window.gameState.speedBoost,
    timer: window.gameState.speedBoostTimer,
    vx: window.gameState.rat.vx
  }));

  expect(speedBoostData.active).toBe(true);
  expect(speedBoostData.timer).toBeGreaterThan(0);
  expect(speedBoostData.timer).toBeLessThanOrEqual(300);
  expect(speedBoostData.vx).toBe(7.5);

  await page.evaluate(() => {
    window.gameState.speedBoostTimer = 1;
  });

  await page.waitForFunction(() =>
    window.gameState.speedBoost === false &&
    window.gameState.speedBoostTimer === 0 &&
    window.gameState.rat.vx === 5
  );

  const expiredBoostData = await page.evaluate(() => ({
    active: window.gameState.speedBoost,
    timer: window.gameState.speedBoostTimer,
    vx: window.gameState.rat.vx
  }));

  expect(expiredBoostData.active).toBe(false);
  expect(expiredBoostData.timer).toBe(0);
  expect(expiredBoostData.vx).toBe(5);

  await page.evaluate(() => {
    window.gameState.input.right = false;
  });
});
