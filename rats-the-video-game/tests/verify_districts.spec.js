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

  // Burbs: 0-4
  for (let i = 0; i <= 4; i++) {
    const hue = getHue(buildings[i].color);
    expect(hue).toBeGreaterThanOrEqual(80);
    expect(hue).toBeLessThanOrEqual(120);
  }

  // Downtown: 5-9
  for (let i = 5; i <= 9; i++) {
    const hue = getHue(buildings[i].color);
    expect(hue).toBeGreaterThanOrEqual(180);
    expect(hue).toBeLessThanOrEqual(220);
  }

  // Commercial: 10-14
  for (let i = 10; i <= 14; i++) {
    const hue = getHue(buildings[i].color);
    expect(hue).toBeGreaterThanOrEqual(260);
    expect(hue).toBeLessThanOrEqual(300);
  }

  // Construction: 15-19
  for (let i = 15; i <= 19; i++) {
    const hue = getHue(buildings[i].color);
    expect(hue).toBeGreaterThanOrEqual(15);
    expect(hue).toBeLessThanOrEqual(55);
  }

  // Industrial: 20+
  for (let i = 20; i < buildings.length; i++) {
    if (buildings[i].type === 'TUNNEL') continue;
    const hue = getHue(buildings[i].color);
    expect(hue).toBeGreaterThanOrEqual(-20);
    expect(hue).toBeLessThanOrEqual(20);
  }
});
