> Review note: This file is an intentional agent log in `.Jules/` that captures Nibble verification learnings. Updates here are expected when related test behaviour changes land.

# Nibble's Journal 🧪

## Learnings

### Canvas Game Verification
*   **Pattern:** Validating Game Logic via Global State Injection.
*   **Context:** Canvas-based games often lack DOM elements for state.
*   **Solution:** Expose `window.gameState` (or similar) and use Playwright's `page.evaluate()` to manipulate state (e.g., spawn entities) and assertions.
*   **Sync:** Use `page.waitForFunction` to ensure game loop has processed the injected state before asserting.
- When writing Playwright tests for area-of-effect mechanics (like scaring birds) in `rats-the-video-game`, use specific properties (like injected `id`s or initial `x`/`y` coordinates) to identify and track dynamic entities within global state arrays (e.g., `window.gameState.birds`) across game loops, rather than relying on array indices or direct object references.
