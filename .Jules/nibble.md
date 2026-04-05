> Review note: This file is an intentional agent log in `.Jules/` that captures Nibble verification learnings. Updates here are expected when related test behaviour changes land.

# Nibble's Journal 🧪

## Learnings

### Canvas Game Verification
*   **Pattern:** Validating Game Logic via Global State Injection.
*   **Context:** Canvas-based games often lack DOM elements for state.
*   **Solution:** Expose `window.gameState` (or similar) and use Playwright's `page.evaluate()` to manipulate state (e.g., spawn entities) and assertions.
*   **Sync:** Use `page.waitForFunction` to ensure game loop has processed the injected state before asserting.

### Testing Area-of-Effect Mechanics
*   **Pattern:** Injecting Mock Entities for Distance Checks.
*   **Context:** Testing area-of-effect mechanics like the Squeak interaction radius.
*   **Solution:** Use Playwright's `page.evaluate()` to inject mock entities at known distances (inside and outside the radius) and assert their state mutations after the mechanic triggers.
