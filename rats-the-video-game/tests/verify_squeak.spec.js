import { test, expect } from '@playwright/test';

test('verify squeak mechanic scaring birds in range', async ({ page }) => {
  await page.goto('http://localhost:8000/rats-the-video-game/index.html');
  await page.waitForFunction(() => window.gameState && window.gameState.rat);

  await page.evaluate(() => {
    // Reset Game State for isolated testing
    window.gameState.score = 0;

    // Position rat explicitly
    window.gameState.rat.x = 100;
    window.gameState.rat.y = 0;
    window.gameState.rat.vx = 0;
    window.gameState.rat.vy = 0;
    window.gameState.rat.grounded = true;
    window.gameState.rat.canDoubleJump = true;

    // Clear inputs
    window.gameState.input.left = false;
    window.gameState.input.right = false;
    window.gameState.input.jump = false;
    window.gameState.input.jumpPressed = false;
    window.gameState.input.chew = false;
    window.gameState.input.squeakPressed = false;

    // Clear entities
    window.gameState.obstacles = [];
    window.gameState.turds = [];
    window.gameState.birds = [];
  });

  // Spawn two birds with identifiable starting X coordinates
  await page.evaluate(() => {
    // We add an id to easily identify them after game loop processes them,
    // as their X might change slightly due to bird.speed
    window.gameState.birds.push({ id: 'in_range', x: 300, y: 100, vy: 0, speed: 0 });
    window.gameState.birds.push({ id: 'out_range', x: 600, y: 100, vy: 0, speed: 0 });
  });

  // Trigger squeak
  await page.evaluate(() => {
    window.gameState.input.squeakPressed = true;
  });

  // Wait for at least one bird to have a non-zero vy (meaning it was scared)
  // Or wait for the squeakPressed flag to be consumed
  await page.waitForFunction(() => !window.gameState.input.squeakPressed);

  const birdStates = await page.evaluate(() => {
    return window.gameState.birds.map(b => ({ id: b.id, vy: b.vy }));
  });

  // Find the birds by id
  const inRangeBird = birdStates.find(b => b.id === 'in_range');
  const outOfRangeBird = birdStates.find(b => b.id === 'out_range');

  expect(inRangeBird).toBeDefined();
  expect(outOfRangeBird).toBeDefined();

  // The in-range bird should have a negative vy (moving upwards)
  expect(inRangeBird.vy).toBeLessThan(0);

  // The out-of-range bird should still have 0 vy
  expect(outOfRangeBird.vy).toBe(0);
});
