import { test, expect } from '@playwright/test';

test.describe('Sonic Squeak Mechanic', () => {
    test('squeak shatters nearby turds but not far ones', async ({ page }) => {
        // Navigate to the game page relative to the baseURL
        await page.goto('/rats-the-video-game/index.html');

        // Dismiss the tutorial modal
        await page.click('#close-btn');

        // Wait for the game to start and the tutorial modal to fully close
        await page.waitForTimeout(500);

        // Inject turds and rat state for testing
        await page.evaluate(() => {
            // Set rat position explicitly
            window.gameState.rat.x = 500;
            window.gameState.rat.y = 100;

            // Clear existing turds
            window.gameState.turds = [];

            // Add one turd within radius (e.g. 50 units away)
            window.gameState.turds.push({ x: 500, y: 140, vy: 0 }); // dist: 40

            // Add another turd far away (e.g. 200 units away)
            window.gameState.turds.push({ x: 700, y: 100, vy: 0 }); // dist: 200
        });

        // Trigger squeak action
        await page.keyboard.press('KeyS');

        // Let a few frames run for update to clear turds
        await page.waitForTimeout(100);

        // Verify state
        const remainingTurds = await page.evaluate(() => {
            return window.gameState.turds;
        });

        // Check that there is only 1 turd remaining
        expect(remainingTurds.length).toBe(1);

        // Check that the remaining turd is the far one
        expect(remainingTurds[0].x).toBe(700);
        expect(remainingTurds[0].y).toBeLessThanOrEqual(100);
    });
});
