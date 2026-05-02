const { chromium } = require('playwright');
(async () => {
    const browser = await chromium.launch();
    const page1 = await browser.newPage();
    await page1.goto('http://localhost:8000/rats-the-video-game/index.html?seed=tunneller');
    await page1.waitForFunction(() => window.gameState && window.gameState.obstacles);
    const obs1 = await page1.evaluate(() => window.gameState.obstacles);

    const page2 = await browser.newPage();
    await page2.goto('http://localhost:8000/rats-the-video-game/index.html?seed=tunneller');
    await page2.waitForFunction(() => window.gameState && window.gameState.obstacles);
    const obs2 = await page2.evaluate(() => window.gameState.obstacles);

    if (JSON.stringify(obs1) === JSON.stringify(obs2)) {
        console.log("Seed test passed: identical layouts.");
    } else {
        console.error("Seed test failed: layouts differ.");
        process.exit(1);
    }
    await browser.close();
})();
