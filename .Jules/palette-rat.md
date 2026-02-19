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

## 2. Modal Accessibility Pattern

**Problem:** Modals are custom `div` elements with `role="dialog"` and `aria-modal="true"`. Screen readers need a label to announce the dialog's purpose upon focus.

**Solution:**
Ensure every modal has an internal heading (e.g., `<h2>`) with a unique `id`, and link the modal container to it using `aria-labelledby`.

```html
<div id="tutorial-modal" role="dialog" aria-modal="true" aria-labelledby="tutorial-title">
    <div class="modal-content">
        <h2 id="tutorial-title">How to Play</h2>
        <!-- content -->
    </div>
</div>
```

**Key Insight:**
- Explicitly associating the visible heading avoids redundant `aria-label` text and keeps the accessible name synchronized with the visual UI.
