import { test, expect } from '@playwright/test';

const GAME_URL = 'http://localhost:8000/rats-the-video-game/index.html';

async function loadGameWithAudioMock(page) {
  await page.addInitScript(() => {
    window.__audioMock = {
      contexts: 0,
      oscillators: [],
    };

    class MockAudioParam {
      constructor() {
        this.value = 0;
        this.ops = [];
      }

      setValueAtTime(value, time) {
        this.value = value;
        this.ops.push({ kind: 'set', value, time });
      }

      exponentialRampToValueAtTime(value, time) {
        this.value = value;
        this.ops.push({ kind: 'exp', value, time });
      }

      linearRampToValueAtTime(value, time) {
        this.value = value;
        this.ops.push({ kind: 'lin', value, time });
      }
    }

    class MockGain {
      constructor() {
        this.gain = new MockAudioParam();
      }

      connect() {}
    }

    class MockOscillator {
      constructor() {
        this.type = 'sine';
        this.frequency = new MockAudioParam();
      }

      connect() {}

      start() {
        window.__audioMock.oscillators.push({
          type: this.type,
          freqOps: [...this.frequency.ops],
        });
      }

      stop() {}
    }

    class MockAudioContext {
      constructor() {
        window.__audioMock.contexts += 1;
        this.currentTime = 0;
        this.destination = {};
      }

      createGain() {
        return new MockGain();
      }

      createOscillator() {
        return new MockOscillator();
      }
    }

    window.AudioContext = MockAudioContext;
    window.webkitAudioContext = MockAudioContext;
  });

  await page.goto(GAME_URL);
  await page.waitForFunction(() => window.gameState && window.gameState.rat);
}

test('verify music starts on first non-space control interaction', async ({ page }) => {
  await loadGameWithAudioMock(page);
  await page.click('#close-btn');

  await page.keyboard.press('KeyA');
  await page.waitForTimeout(100);

  const afterNonControlKey = await page.evaluate(() => window.__audioMock.contexts);
  expect(afterNonControlKey).toBe(0);

  await page.keyboard.press('ArrowLeft');
  await page.waitForFunction(() => window.__audioMock.contexts === 1);

  const afterMoveLeft = await page.evaluate(() => window.__audioMock.contexts);
  expect(afterMoveLeft).toBe(1);

  await page.keyboard.press('Space');
  await page.waitForTimeout(100);

  const afterJump = await page.evaluate(() => window.__audioMock.contexts);
  expect(afterJump).toBe(1);
});

test('verify trash pile chew uses dedicated trash audio path', async ({ page }) => {
  await loadGameWithAudioMock(page);
  await page.click('#close-btn');

  await page.evaluate(() => {
    window.game.toggleMusic(true);
    window.game.toggleMusic(false);

    window.__audioMock.oscillators = [];

    const state = window.gameState;
    state.score = 0;
    state.rat.x = 100;
    state.rat.y = 0;
    state.rat.vx = 0;
    state.rat.vy = 0;
    state.rat.grounded = true;
    state.input.chew = true;
    state.turds = [];
    state.birds = [];
    state.obstacles = [{ x: 95, w: 40, h: 40, type: 'TRASH_PILE' }];
  });

  await page.waitForFunction(() => window.gameState.obstacles.length === 0);

  const result = await page.evaluate(() => {
    const startFrequencies = window.__audioMock.oscillators
      .filter((osc) => osc.type === 'square')
      .map((osc) => {
        const firstSet = osc.freqOps.find((op) => op.kind === 'set');
        return firstSet ? firstSet.value : null;
      })
      .filter((value) => typeof value === 'number');

    return {
      score: window.gameState.score,
      startFrequencies,
    };
  });

  expect(result.score).toBe(1);
  expect(result.startFrequencies).toContain(100);
  expect(result.startFrequencies).toContain(140);
});
