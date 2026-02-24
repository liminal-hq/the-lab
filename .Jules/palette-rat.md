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

## 2. Accessibility & Clarity Patterns

**Problem:** Game controls lack visual feedback for keyboard navigation, and primary actions (like "PLAY") are visually ambiguous or alarming (Red).

**Solution:**
- **High Contrast Focus Ring:** Use a bright Yellow (`#f1c40f`) outline with `3px solid` and `2px offset` to ensure focus visibility against dark backgrounds.
- **Positive Action Pattern:** Use Emerald Green (`#2ecc71`) with Black text for primary "Go" / "Start" actions to clearly distinguish them from destructive actions.
- **Click Affordance:** Add `cursor: pointer` to labels in control rows (`.control-row label`) to improve mouse/touch interaction clarity.

```css
/* High-contrast focus for keyboard accessibility */
:focus-visible {
    outline: 3px solid #f1c40f;
    outline-offset: 2px;
}

/* Primary Action Button (Play/Start) */
.btn-primary {
    background: #2ecc71; /* Emerald Green */
    color: #000; /* High Contrast Black Text */
}
```
