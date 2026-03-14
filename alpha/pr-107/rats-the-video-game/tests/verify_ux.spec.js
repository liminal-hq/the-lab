import { test, expect } from '@playwright/test';

test('verify palette-rat UX and accessibility improvements', async ({ page }) => {
  await page.goto('http://localhost:8000/rats-the-video-game/index.html');

  const playButton = page.locator('#close-btn');
  await expect(playButton).toBeVisible();

  const playBackground = await playButton.evaluate((el) => window.getComputedStyle(el).backgroundColor);
  const playTextColour = await playButton.evaluate((el) => window.getComputedStyle(el).color);
  expect(playBackground).toBe('rgb(46, 204, 113)');
  expect(playTextColour).toBe('rgb(0, 0, 0)');

  await page.reload();
  await page.keyboard.press('Tab');
  const focusOutlineColour = await page.evaluate(() => {
    const active = document.activeElement;
    return window.getComputedStyle(active).outlineColor;
  });
  expect(focusOutlineColour).toBe('rgb(241, 196, 15)');

  const modalLabels = await page.evaluate(() => ({
    tutorial: document.getElementById('tutorial-modal')?.getAttribute('aria-labelledby'),
    options: document.getElementById('options-modal')?.getAttribute('aria-labelledby'),
    credits: document.getElementById('credits-modal')?.getAttribute('aria-labelledby'),
  }));
  expect(modalLabels.tutorial).toBe('tutorial-title');
  expect(modalLabels.options).toBe('options-title');
  expect(modalLabels.credits).toBe('credits-title');

  await page.click('#close-btn');
  await page.click('#options-btn');

  const firstControlLabel = page.locator('.control-row label').first();
  const firstControlInput = page.locator('.control-row input').first();
  await expect(firstControlLabel).toBeVisible();

  const labelCursor = await firstControlLabel.evaluate((el) => window.getComputedStyle(el).cursor);
  const inputCursor = await firstControlInput.evaluate((el) => window.getComputedStyle(el).cursor);
  expect(labelCursor).toBe('pointer');
  expect(inputCursor).toBe('pointer');
});
