> Review note: This file is an intentional agent log in `.Jules/` that captures Nibble verification learnings. Updates here are expected when related test behaviour changes land.

# Nibble's Journal 🧪

## Learnings

### Canvas Game Verification
*   **Pattern:** Validating Game Logic via Global State Injection.
*   **Context:** Canvas-based games often lack DOM elements for state.
*   **Solution:** Expose `window.gameState` (or similar) and use Playwright's `page.evaluate()` to manipulate state (e.g., spawn entities) and assertions.
*   **Sync:** Use `page.waitForFunction` to ensure game loop has processed the injected state before asserting.

### Squeak Mechanic Verification
*   **Pattern:** Testing Interaction Radius & State Mutations.
*   **Context:** The Squeak mechanic scares nearby birds. The effect is distance-based and modifies velocity state arrays.
*   **Solution:** Spawn entities at known distances (one inside radius, one outside) and verify their specific state updates after the mechanic is triggered to confirm the area-of-effect behavior without changing real gameplay logic.
