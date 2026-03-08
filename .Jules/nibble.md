# Nibble's Journal 🧪

## Learnings

### Canvas Game Verification
*   **Pattern:** Validating Game Logic via Global State Injection.
*   **Context:** Canvas-based games often lack DOM elements for state.
*   **Solution:** Expose `window.gameState` (or similar) and use Playwright's `page.evaluate()` to manipulate state (e.g., spawn entities) and assertions.
*   **Sync:** Use `page.waitForFunction` to ensure game loop has processed the injected state before asserting.

### Physics / Collision Verification
*   **Pattern:** Deterministic Harness for Movement and Collision.
*   **Context:** Testing physics frame updates (like gravity and AABB collision push-out) can be flaky if relying on real-time inputs or variable frame rates.
*   **Solution:** Directly set the initial physical state (position, velocity) and environment (obstacles) via injected state. Allow a small fixed timeout (e.g., 300-500ms) for the game loop to execute the deterministic physics ticks, then assert on the resulting fixed state.
