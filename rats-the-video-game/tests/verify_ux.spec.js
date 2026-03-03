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

//   (\_/)
//   (o.o)
//   (> <)
// Squeak! Making the tests accessible!
test.describe('Screen Reader Accessibility Verification', () => {
    test('Icons have aria-hidden attribute', async ({ page }) => {
        await page.goto('/rats-the-video-game/index.html');

        // Verify options button icon
        const optionsIcon = page.locator('#options-btn span');
        await expect(optionsIcon).toHaveAttribute('aria-hidden', 'true');

        // Verify help button icon
        const helpIcon = page.locator('#help-btn span');
        await expect(helpIcon).toHaveAttribute('aria-hidden', 'true');
    });

    test('Emojis have role and aria-label attributes', async ({ page }) => {
        await page.goto('/rats-the-video-game/index.html');

        // Wait for modal to be visible
        await page.waitForSelector('#tutorial-modal', { state: 'visible' });

        // Verify Pizza emoji
        const pizzaEmoji = page.locator('span[aria-label="Pizza"]');
        await expect(pizzaEmoji).toHaveAttribute('role', 'img');
        await expect(pizzaEmoji).toHaveText('🍕');

        // Verify Coffee emoji
        const coffeeEmoji = page.locator('span[aria-label="Coffee"]');
        await expect(coffeeEmoji).toHaveAttribute('role', 'img');
        await expect(coffeeEmoji).toHaveText('☕');
    });

    test('Keyboard navigation works correctly', async ({ page }) => {
        await page.goto('/rats-the-video-game/index.html');

        // Close tutorial
        const closeBtn = page.locator('#close-btn');
        await expect(closeBtn).toBeFocused();
        await page.keyboard.press('Enter');
        await expect(page.locator('#tutorial-modal')).not.toBeVisible();

        // Tab to options button (since it's first in DOM)
        await page.keyboard.press('Tab');
        const optionsBtn = page.locator('#options-btn');
        await expect(optionsBtn).toBeFocused();

        // Tab to help button
        await page.keyboard.press('Tab');
        const helpBtn = page.locator('#help-btn');
        await expect(helpBtn).toBeFocused();

        // Open tutorial
        await page.keyboard.press('Enter');
        await expect(page.locator('#tutorial-modal')).toBeVisible();

        // Check focus moves into modal
        await page.waitForTimeout(100); // Give time for focus to move
        await expect(closeBtn).toBeFocused();

        // Close tutorial
        await page.keyboard.press('Enter');
        await expect(page.locator('#tutorial-modal')).not.toBeVisible();
    });

    test('Mobile view works correctly', async ({ page }) => {
        // Set viewport to mobile size
        await page.setViewportSize({ width: 375, height: 667 });

        await page.goto('/rats-the-video-game/index.html');

        // Wait for modal to be visible
        await page.waitForSelector('#tutorial-modal', { state: 'visible' });

        // Check mobile controls are visible, desktop are hidden
        // Can't easily check CSS media query for pointer: coarse here without specific setup,
        // but we can ensure the layout doesn't break.
        await expect(page.locator('#tutorial-modal')).toBeVisible();

        const closeBtn = page.locator('#close-btn');
        await closeBtn.click();

        await expect(page.locator('#tutorial-modal')).not.toBeVisible();
    });
});
