import { test, expect } from '@playwright/test';

test('verify input leakage (Enter key) and accessibility improvements', async ({ page }) => {
  // Go to the game page
  await page.goto('http://localhost:8000/rats-the-video-game/index.html');

  // 1. Verify Tutorial Modal has "Space" instruction for Jump
  const tutorialLegend = page.locator('#tutorial-modal .control-legend');
  await expect(tutorialLegend).toBeVisible();
  await expect(tutorialLegend).toContainText('Space', { timeout: 2000 });
  await expect(tutorialLegend).toContainText('Jump', { timeout: 2000 });

  // 2. Verify closed modals have aria-hidden="true"
  const optionsModal = page.locator('#options-modal');
  const creditsModal = page.locator('#credits-modal');

  await expect(optionsModal).toHaveAttribute('aria-hidden', 'true', { timeout: 2000 });
  await expect(creditsModal).toHaveAttribute('aria-hidden', 'true', { timeout: 2000 });

  // Close tutorial modal to interact with game/options
  // The 'PLAY!' button is #close-btn
  await page.click('#close-btn');
  await expect(page.locator('#tutorial-modal')).toBeHidden();

  // 3. Verify Input Leakage (Space Key)
  // Open Options Modal
  await page.click('#options-btn');
  await expect(optionsModal).toBeVisible();

  // Verify aria-hidden becomes false when open (JavaScript logic check)
  await expect(optionsModal).toHaveAttribute('aria-hidden', 'false', { timeout: 2000 });

  // Focus should be on the first element (Music Toggle)
  // We can explicitly verify or focus it
  await page.focus('#music-toggle');

  // Press and HOLD Space to check state during keydown
  await page.keyboard.down('Space');
  const isJumping = await page.evaluate(() => window.gameState.input.jump);
  await page.keyboard.up('Space');

  expect(isJumping).toBe(false, 'Space key should be blocked from game input when modal is open');

  // 4. Verify Input Leakage (Enter Key)
  // Focus on the Close button to simulate closing action
  await page.focus('#close-options-btn');

  // Press and HOLD Enter to check state during keydown
  await page.keyboard.down('Enter');

  // Check if game state input.chew became true
  const isChewing = await page.evaluate(() => window.gameState.input.chew);

  // Clean up key state
  await page.keyboard.up('Enter');

  expect(isChewing).toBe(false, 'Enter key should be blocked from game input when modal is open');

  // Verify modal closes on Enter (default button behavior)
  await expect(optionsModal).toBeHidden();

  // Verify aria-hidden becomes true when closed
  await expect(optionsModal).toHaveAttribute('aria-hidden', 'true', { timeout: 2000 });
});
