import { test, expect } from '@playwright/test';

test('verify district generation colour bands', async ({ page }) => {
  await page.goto('http://localhost:8000/rats-the-video-game/index.html');
  await page.waitForTimeout(1000);

  const buildings = await page.evaluate(() => window.gameState.buildings);
  expect(buildings.length).toBeGreaterThanOrEqual(25);

  const getHue = (colour) => {
    const match = colour.match(/hsl\(([-\d.]+),/);
    return match ? parseFloat(match[1]) : null;
  };

  for (let i = 0; i <= 8; i++) {
    const hue = getHue(buildings[i].color);
    expect(hue).toBeGreaterThanOrEqual(80);
    expect(hue).toBeLessThanOrEqual(120);
  }

  for (let i = 9; i <= 16; i++) {
    const hue = getHue(buildings[i].color);
    expect(hue).toBeGreaterThanOrEqual(180);
    expect(hue).toBeLessThanOrEqual(220);
  }

  for (let i = 17; i < buildings.length; i++) {
    if (buildings[i].type === 'TUNNEL') continue;
    const hue = getHue(buildings[i].color);
    expect(hue).toBeGreaterThanOrEqual(-20);
    expect(hue).toBeLessThanOrEqual(20);
  }
});
