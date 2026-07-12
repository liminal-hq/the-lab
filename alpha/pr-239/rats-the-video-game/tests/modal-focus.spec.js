import { test, expect } from '@playwright/test';

test.describe('Modal Focus Stack and Touch Targets', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:8000/rats-the-video-game/index.html');
        // Bypass tutorial modal for the start of each test
        await page.evaluate(() => localStorage.setItem('rats_tutorial_seen', 'true'));
        await page.reload();
    });

    test('Debug toggle has correct touch target size', async ({ page }) => {
        // Show tutorial modal again to access debug toggle by removing flag and reloading
        await page.evaluate(() => localStorage.removeItem('rats_tutorial_seen'));
        await page.reload();

        const debugToggle = page.locator('#debug-toggle');
        const box = await debugToggle.boundingBox();
        expect(box.width).toBeGreaterThanOrEqual(24);
        expect(box.height).toBeGreaterThanOrEqual(24);
    });

    test('Focus stack correctly restores focus when closing nested modals', async ({ page }) => {
        // Click Options button via JS to ensure focus
        await page.evaluate(() => {
             const btn = document.getElementById('options-btn');
             btn.focus();
             btn.click();
        });

        await expect(page.locator('#options-modal')).toBeVisible();

        // Click Credits button via JS
        await page.evaluate(() => {
             const btn = document.getElementById('credits-btn');
             btn.focus();
             btn.click();
        });

        await expect(page.locator('#credits-modal')).toBeVisible();
        await expect(page.locator('#options-modal')).toBeHidden(); // It's hidden in logic by display: none

        // Close Credits Modal via Enter key (should be focused on the Back button)
        await page.keyboard.press('Enter');

        await expect(page.locator('#credits-modal')).toBeHidden();
        await expect(page.locator('#options-modal')).toBeVisible();

        // Check if focus returned to credits-btn
        const isCreditsBtnFocused = await page.evaluate(() => document.activeElement.id === 'credits-btn');
        expect(isCreditsBtnFocused).toBeTruthy();

        // Close Options Modal via Escape key since credits-btn is currently focused
        await page.keyboard.press('Escape');
        await expect(page.locator('#options-modal')).toBeHidden();

        // Check if focus returned to options-btn
        const isOptionsBtnFocused = await page.evaluate(() => document.activeElement.id === 'options-btn');
        expect(isOptionsBtnFocused).toBeTruthy();
    });
});
