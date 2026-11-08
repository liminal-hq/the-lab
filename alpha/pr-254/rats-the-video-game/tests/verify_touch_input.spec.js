import { test, expect } from '@playwright/test';

test('verify mobile tap input logic and modal isolation', async ({ page }) => {
  await page.goto('http://localhost:8000/rats-the-video-game/index.html');
  await page.evaluate("localStorage.setItem('rats_tutorial_seen', 'true')");
  await page.goto('http://localhost:8000/rats-the-video-game/index.html');
  await page.waitForFunction(() => window.gameState);

  // Test 1: Tap on the canvas should trigger jump and chew
  const inputAfterCanvasTap = await page.evaluate(() => {
    const gameCanvas = document.getElementById('gameCanvas');
    const touchEvent = new Event('touchstart', { bubbles: true, cancelable: true });
    touchEvent.touches = [{ clientX: 100, clientY: 100 }];
    gameCanvas.dispatchEvent(touchEvent);

    return { ...window.gameState.input };
  });

  expect(inputAfterCanvasTap.jumpPressed).toBe(true);
  expect(inputAfterCanvasTap.jump).toBe(true);
  expect(inputAfterCanvasTap.chew).toBe(true);

  // Wait 150ms and check that jump and chew are reset
  const inputAfterDelay = await page.evaluate(() => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ ...window.gameState.input });
      }, 150);
    });
  });

  expect(inputAfterDelay.jump).toBe(false);
  expect(inputAfterDelay.chew).toBe(false);

  // Test 2: Tap on a modal should NOT trigger game inputs
  await page.evaluate(() => {
    document.getElementById('options-modal').setAttribute('aria-hidden', 'false');
  });

  const inputAfterModalTap = await page.evaluate(() => {
    window.gameState.input.jumpPressed = false;
    window.gameState.input.jump = false;
    window.gameState.input.chew = false;

    const optionsModal = document.getElementById('options-modal');
    const touchEvent = new Event('touchstart', { bubbles: true, cancelable: true });
    touchEvent.touches = [{ clientX: 100, clientY: 100 }];
    optionsModal.dispatchEvent(touchEvent);

    return { ...window.gameState.input };
  });

  expect(inputAfterModalTap.jumpPressed).toBe(false);
  expect(inputAfterModalTap.jump).toBe(false);
  expect(inputAfterModalTap.chew).toBe(false);
});
