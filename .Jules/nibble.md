> Review note: This file is an intentional agent log in `.Jules/` that captures Nibble verification learnings. Updates here are expected when related test behaviour changes land.

# Nibble's Journal 🧪

## Learnings

### Canvas Game Verification
*   **Pattern:** Validating Game Logic via Global State Injection.
*   **Context:** Canvas-based games often lack DOM elements for state.
*   **Solution:** Expose `window.gameState` (or similar) and use Playwright's `page.evaluate()` to manipulate state (e.g., spawn entities) and assertions.
*   **Sync:** Use `page.waitForFunction` to ensure game loop has processed the injected state before asserting.
- When using the HTML test harness (test_runner.html) in rats-the-video-game to test single-frame input consumption or entity side-effects, inject the state directly, use await new Promise(r => setTimeout(r, 200)) to allow the game loop to process it, and then assert that the input flag was cleared and the side-effect was applied.
