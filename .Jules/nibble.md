> Review note: This file is an intentional agent log in `.Jules/` that captures Nibble verification learnings. Updates here are expected when related test behaviour changes land.

# Nibble's Journal 🧪

## Learnings

### Canvas Game Verification
*   **Pattern:** Validating Game Logic via Global State Injection.
*   **Context:** Canvas-based games often lack DOM elements for state.
*   **Solution:** Expose `window.gameState` (or similar) and use Playwright's `page.evaluate()` to manipulate state (e.g., spawn entities) and assertions.
*   **Sync:** Use `page.waitForFunction` to ensure game loop has processed the injected state before asserting.
*   **Pattern:** Validating Single-Frame Mechanics.
*   **Context:** Canvas-based games often have inputs that process and clear in a single frame.
*   **Solution:** Use Playwright's `page.waitForFunction` to wait for the input flag (e.g., `squeakPressed`) to clear to ensure the side-effect has been fully processed before asserting on the resulting game state.
