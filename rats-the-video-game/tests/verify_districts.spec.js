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

  // Burbs: 0-6
  for (let i = 0; i <= 6; i++) {
    const hue = getHue(buildings[i].color);
    expect(hue).toBeGreaterThanOrEqual(80);
    expect(hue).toBeLessThanOrEqual(120);
  }

  // Downtown: 7-12
  for (let i = 7; i <= 12; i++) {
    const hue = getHue(buildings[i].color);
    expect(hue).toBeGreaterThanOrEqual(180);
    expect(hue).toBeLessThanOrEqual(220);
  }

  // Construction: 13-18
  for (let i = 13; i <= 18; i++) {
    const hue = getHue(buildings[i].color);
    expect(hue).toBeGreaterThanOrEqual(10);
    expect(hue).toBeLessThanOrEqual(50);
  }

  // Industrial: 19+
  for (let i = 19; i < buildings.length; i++) {
    if (buildings[i].type === 'TUNNEL') continue;
    const hue = getHue(buildings[i].color);
    expect(hue).toBeGreaterThanOrEqual(-20);
    expect(hue).toBeLessThanOrEqual(20);
  }
});
