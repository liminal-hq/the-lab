> Review note: This file is an intentional agent log in `.Jules/` that captures Nibble verification learnings. Updates here are expected when related test behaviour changes land.

# Nibble's Journal 🧪

## Learnings

### Canvas Game Verification
*   **Pattern:** Validating Game Logic via Global State Injection.
*   **Context:** Canvas-based games often lack DOM elements for state.
*   **Solution:** Expose `window.gameState` (or similar) and use Playwright's `page.evaluate()` to manipulate state (e.g., spawn entities) and assertions.
*   **Sync:** Use `page.waitForFunction` to ensure game loop has processed the injected state before asserting.

### Testing Entity Modifications
*   **Pattern:** Identifying manipulated entities within global state.
*   **Context:** Testing area-of-effect mechanics (like Squeak scaring birds) that modify multiple dynamic entities.
*   **Solution:** When injecting entities into global arrays (e.g., `window.gameState.birds`), attach arbitrary identifying properties (like `id`) to track them after the game loop has updated their state (such as positions changing due to continuous speed/velocity adjustments).
