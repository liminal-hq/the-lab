
const { test, expect } = require('@playwright/test');

test('verify ux improvements', async ({ page }) => {
  // (\_/)
  // (o.o) <( Testing the cheese... I mean, UX! )
  // (> <)

  await page.goto('http://localhost:8000/rats-the-video-game/index.html');

  // 1. Verify "PLAY!" button color (Green)
  const closeBtn = page.locator('#close-btn');
  await expect(closeBtn).toBeVisible();

  const bgColor = await closeBtn.evaluate((el) => {
    return window.getComputedStyle(el).backgroundColor;
  });

  // rgb(46, 204, 113) is #2ecc71 (Emerald Green)
  console.log('Button Background Color:', bgColor);
  expect(bgColor).toBe('rgb(46, 204, 113)');

  const textColor = await closeBtn.evaluate((el) => {
      return window.getComputedStyle(el).color;
  });
  // rgb(0, 0, 0) is Black
  console.log('Button Text Color:', textColor);
  expect(textColor).toBe('rgb(0, 0, 0)');

  // 2. Verify Focus Visible Style exists
  // We check if the computed style of a focused element has the outline
  // Focus the close button
  await closeBtn.focus();
  // Tab to trigger focus-visible if needed, but programmatic focus might trigger it depending on browser
  // Playwright's page.keyboard.press('Tab') is more reliable for focus-visible

  // Reload to clear focus state
  await page.reload();
  await page.keyboard.press('Tab'); // Focus first element (likely options or help btn)

  // Check active element
  const outlineColor = await page.evaluate(() => {
      const el = document.activeElement;
      return window.getComputedStyle(el).outlineColor;
  });

  console.log('Active Element Outline Color:', outlineColor);
  expect(outlineColor).toBe('rgb(241, 196, 15)'); // #f1c40f

  // 3. Verify Cursor Pointer on Labels
  // Close tutorial modal if open so we can click options
  const tutorialModal = page.locator('#tutorial-modal');
  if (await tutorialModal.isVisible()) {
      await page.click('#close-btn');
  }

  // Open Options Modal to see labels
  await page.click('#options-btn');
  const label = page.locator('.control-row label').first();
  await expect(label).toBeVisible();

  const cursor = await label.evaluate((el) => {
      return window.getComputedStyle(el).cursor;
  });
  console.log('Label Cursor:', cursor);
  expect(cursor).toBe('pointer');
});
