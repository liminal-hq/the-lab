const { test, expect } = require('@playwright/test');

test('Squeak logic scares birds and shatters turds', async ({ page }) => {
    // Navigate to the local game
    await page.goto('http://localhost:8000/rats-the-video-game/index.html');

    // Wait for the game to initialize
    await page.waitForFunction(() => window.gameState && window.gameState.rat);

    // Start the game by closing tutorial
    await page.click('#close-btn');

    // Inject some birds and turds
    await page.evaluate(() => {
        window.gameState.birds = [
            { x: window.gameState.rat.x + 100, y: 100, vy: 0, id: 'close_bird' }, // Should be scared
            { x: window.gameState.rat.x + 500, y: 100, vy: 0, id: 'far_bird' }  // Should not be scared
        ];

        window.gameState.turds = [
            { x: window.gameState.rat.x + 50, y: window.gameState.rat.y + 50, vy: 0, id: 'close_turd' }, // Should shatter
            { x: window.gameState.rat.x + 200, y: window.gameState.rat.y + 200, vy: 0, id: 'far_turd' } // Should not shatter
        ];
    });

    // Press S to squeak
    await page.keyboard.press('s');

    // Wait for state updates
    await page.waitForTimeout(100);

    // Verify birds
    const birds = await page.evaluate(() => window.gameState.birds);
    const closeBird = birds.find(b => b.id === 'close_bird');
    const farBird = birds.find(b => b.id === 'far_bird');

    expect(closeBird.vy).toBeLessThan(0); // Scared
    expect(farBird.vy).toBe(0); // Not scared

    // Verify turds
    const turds = await page.evaluate(() => window.gameState.turds);

    expect(turds.find(t => t.id === 'close_turd')).toBeUndefined(); // Should be shattered
    expect(turds.find(t => t.id === 'far_turd')).toBeDefined(); // Should still exist
});
