import { test, expect } from '@playwright/test';

test('verify squeak mechanic scaring birds within radius', async ({ page }) => {
  // Go to the game page
  await page.goto('http://localhost:8000/rats-the-video-game/index.html');

  // Bypass tutorial modal
  await page.evaluate("localStorage.setItem('rats_tutorial_seen', 'true')");
  await page.reload();

  // Wait for game to initialize
  await page.waitForFunction(() => window.gameState && window.gameState.rat);

  // Setup game state
  await page.evaluate(() => {
    // Position rat
    window.gameState.rat.x = 500;
    window.gameState.rat.y = 0;
    window.gameState.rat.vx = 0;
    window.gameState.rat.vy = 0;

    // Inject mock birds at known distances
    window.gameState.birds = [
      { id: 'inside_left', x: 150, y: 100, vy: 0, speed: 0 },   // 350 distance (inside 400)
      { id: 'inside_right', x: 850, y: 100, vy: 0, speed: 0 },  // 350 distance (inside 400)
      { id: 'outside_left', x: 50, y: 100, vy: 0, speed: 0 },   // 450 distance (outside 400)
      { id: 'outside_right', x: 950, y: 100, vy: 0, speed: 0 }  // 450 distance (outside 400)
    ];

    // Trigger squeak mechanic
    window.gameState.input.squeakPressed = true;
  });

  // Wait for the game loop to process the input and clear the flag
  await page.waitForFunction(() => window.gameState.input.squeakPressed === false);

  // Check bird states
  const birdsState = await page.evaluate(() => window.gameState.birds);

  const insideLeft = birdsState.find(b => b.id === 'inside_left');
  const insideRight = birdsState.find(b => b.id === 'inside_right');
  const outsideLeft = birdsState.find(b => b.id === 'outside_left');
  const outsideRight = birdsState.find(b => b.id === 'outside_right');

  // Birds inside the radius should have a negative vy (flying away upwards)
  expect(insideLeft.vy).toBeLessThan(0);
  expect(insideRight.vy).toBeLessThan(0);

  // Birds outside the radius should not be affected
  expect(outsideLeft.vy).toBe(0);
  expect(outsideRight.vy).toBe(0);
});
