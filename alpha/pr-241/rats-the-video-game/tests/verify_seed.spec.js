const { test, expect } = require('@playwright/test');

test('Deterministic level generation with seed', async ({ page }) => {
    // Load with seed A
    await page.goto('http://localhost:8000/rats-the-video-game/index.html?seed=cheese');
    await page.waitForLoadState('networkidle');
    const stateA = await page.evaluate(() => window.gameState.buildings);

    // Reload with seed A
    await page.goto('http://localhost:8000/rats-the-video-game/index.html?seed=cheese');
    await page.waitForLoadState('networkidle');
    const stateA_reload = await page.evaluate(() => window.gameState.buildings);

    // Load with seed B
    await page.goto('http://localhost:8000/rats-the-video-game/index.html?seed=cracker');
    await page.waitForLoadState('networkidle');
    const stateB = await page.evaluate(() => window.gameState.buildings);

    expect(stateA.length).toBeGreaterThan(0);
    expect(stateA).toEqual(stateA_reload);
    expect(stateA).not.toEqual(stateB);
});
