> Review note: This file is an intentional agent log in `.Jules/` that captures Nibble verification learnings. Updates here are expected when related test behaviour changes land.

# Nibble's Journal 🧪

## Learnings

### Canvas Game Verification
*   **Pattern:** Validating Game Logic via Global State Injection.
*   **Context:** Canvas-based games often lack DOM elements for state.
*   **Solution:** Expose `window.gameState` (or similar) and use Playwright's `page.evaluate()` to manipulate state (e.g., spawn entities) and assertions.
*   **Sync:** Use `page.waitForFunction` to ensure game loop has processed the injected state before asserting.

### Touch Input Simulation
*   Mobile tap events mapped to game inputs (`touchstart` translating to jump/chew) can be effectively simulated in Playwright by dispatching a native `TouchEvent` via `page.evaluate()`.
*   Target the actual DOM node (like `document.getElementById('gameCanvas')`) rather than `window` when dispatching simulated `TouchEvent` objects. If you target `window`, methods like `e.target.closest()` used in UI/modal isolation checks will throw errors because `closest` does not exist on the `Window` object.

### Testing Input Consumption
*   When triggering single-frame inputs (like `squeakPressed`) via `page.evaluate()` in Playwright, use `await page.waitForFunction(() => window.gameState.input.squeakPressed === false)` to reliably ensure the game loop has fully processed the input and applied resulting side-effects (like scaring birds) before evaluating assertions.
* When using the HTML test harness (`test_runner.html`) to test single-frame input consumption or entity side-effects, it's necessary to manually reset the entity properties (like setting `rat.grounded = true`, `rat.vy = 0`, and `rat.stunTimer = 0`) before injecting the single-frame input (`input.jumpPressed = true`). Afterwards, wait `200ms` for the game loop to process before asserting the flag was cleared.
* When using Playwright `requestAnimationFrame` to step forward exactly one game tick, use `await new Promise(r => win.requestAnimationFrame(r))` rather than an arbitrary `setTimeout`. Wait for one frame to align, then inject state, then wait for another frame to allow execution.
