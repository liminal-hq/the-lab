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

## 2. Modal Accessibility & Affordance

**Problem:** Modals (`#tutorial-modal`, etc.) lacked screen reader context (`aria-labelledby`) and the primary action ("PLAY!") was Red, signifying cancellation/danger.

**Solution:**
- **Semantics:** Add `aria-labelledby="heading-id"` to modal containers and link to their internal `<h2>`.
- **Affordance:** Use Emerald Green (`#2ecc71`) with Black text for positive "Start" actions. Red (`#e74c3c`) is reserved for destructive/cancel actions.
- **Interactivity:** Add `cursor: pointer` to all `.control-row label` and `input[type="checkbox"]` elements to signal interactivity.
