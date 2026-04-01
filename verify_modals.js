const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:8000/rats-the-video-game/index.html');
  await page.evaluate(() => localStorage.setItem('rats_tutorial_seen', 'true'));
  await page.reload();

  // Test Focus stack
  await page.click('#options-btn');
  await page.waitForTimeout(500);

  await page.evaluate(() => {
      const btn = document.getElementById('credits-btn');
      btn.focus();
      btn.click();
  });
  await page.waitForTimeout(500);

  await page.keyboard.press('Enter');
  await page.waitForTimeout(500);

  const activeId = await page.evaluate(() => document.activeElement.id);
  if (activeId !== 'credits-btn') {
      console.error("Focus stack failed! Active element id:", activeId);
      process.exit(1);
  } else {
      console.log("Focus restored successfully to credits-btn.");
  }

  // Close Options
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);

  // Open tutorial modal again so debug toggle is visible
  await page.evaluate(() => {
      document.getElementById('help-btn').click();
  });
  await page.waitForTimeout(500);

  // Check touch target for debug toggle
  const dims = await page.evaluate(() => {
      const el = document.getElementById('debug-toggle');
      const rect = el.getBoundingClientRect();
      return { w: rect.width, h: rect.height, hasFor: el.parentElement.hasAttribute('for') };
  });
  if (dims.w < 24 || dims.h < 24 || !dims.hasFor) {
      console.error("Debug toggle dimensions or for attribute incorrect:", dims);
      process.exit(1);
  } else {
      console.log("Debug toggle is accessible.", dims);
  }

  await browser.close();
})();
