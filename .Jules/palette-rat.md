# Palette-Rat Journal 🎨🐀

## 1. Input Blocking Pattern for `rats-the-video-game`

**Problem:** Game engine listens to `keydown` on `window` (bubbling phase) to drive game logic (Jump, Move). When a modal is open, keyboard users expect keys (Space, Arrows) to interact with the UI, not the game.

**Solution:**
Register an "Input Blocker" listener on `window` **immediately** (in a standard script block), before the game engine module is loaded/executed.

```javascript
window.addEventListener('keydown', (e) => {
    if (isModalOpen()) {
        // Allow Escape to propagate (so we can close modal)
        if (e.key === 'Escape') return;

        // Stop game keys
        if (isGameKey(e.code)) {
            // stopImmediatePropagation() prevents the event from reaching the Game Engine's listener
            // on the same element (window), provided this listener is registered FIRST.
            e.stopImmediatePropagation();
        }
    }
});
```

**Key Insight:**
- Do **not** use `capture: true` if you want standard UI elements (buttons) to still handle `Enter`/`Space` naturally. The event must reach the target (button) and bubble up.
- Use `stopImmediatePropagation()` on the bubbling phase at `window` level to intercept before the Game Engine sees it.

## 2. Touch-Action Zoom Pattern

**Problem:** `user-scalable=no` (the old standard for games) breaks accessibility by preventing users from zooming in on UI elements. However, allowing zoom (`user-scalable=yes`) can cause gameplay issues like double-tap-to-zoom interfering with rapid tapping mechanics.

**Solution:**
Use CSS `touch-action` to granularly control gesture handling.

1.  **Enable Zoom in Meta:**
    ```html
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    ```

2.  **Disable Double-Tap Zoom Globally (but allow pinch):**
    Apply `touch-action: manipulation` to the `body` or UI containers.
    ```css
    body {
        touch-action: manipulation;
    }
    ```

3.  **Disable All Browser Gestures on Game Surface:**
    Apply `touch-action: none` to the `canvas` or game container to ensure the game engine receives raw touch events immediately.
    ```css
    canvas {
        touch-action: none;
    }
    ```

**Impact:**
- **Accessibility:** Users can pinch-zoom to read text in modals or overlays.
- **Gameplay:** Rapid tapping on the game canvas remains responsive and does not trigger browser zoom.
