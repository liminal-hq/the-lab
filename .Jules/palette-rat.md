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

## 2. Modal Accessibility and Clear Action Colour

**Pattern:**
- Use `aria-labelledby` on each modal dialog and map it to the modal heading ID.
- Keep the primary "PLAY!" action visually positive with Emerald Green (`#2ecc71`) and high-contrast Black text.
- Add clear keyboard focus visibility with a Yellow `:focus-visible` outline (`#f1c40f`).

**Why this helps:**
- Screen readers announce each dialog with context instead of a generic "dialog".
- Players can immediately understand that "PLAY!" is a go action, not a destructive one.
- Keyboard navigation remains visible on dark backgrounds.

## 3. Touch Behaviour Guard Rails

**Problem:** Touches inside modal content were still being interpreted as gameplay input.

**Fix:**
- Gate touch handlers with `.modal` checks, not just `#tutorial-modal`.
- Keep gameplay taps and swipes active only for the main game surface.

```javascript
if (e.target.closest('.modal') || e.target.closest('button')) return;
```

```
 (\_/)
 (o.o)  "No rogue jumps in the Options centre."
 (> <)
```

## 4. Minimum Touch Targets and Modal Dismissal

**Pattern:**
- Interactive inputs such as checkboxes require minimum touch targets of at least 24x24 pixels (e.g., `width: 24px; height: 24px;`) for mobile accessibility.
- Modal dialogs should implement an 'overlay click to close' pattern by attaching a click listener to `.modal` elements that checks `e.target === modal` before executing the close logic.

**Why this helps:**
- Larger touch targets prevent accidental misclicks on small mobile screens.
- Allowing users to tap outside a modal to close it provides an intuitive, standard mobile interaction pattern that reduces friction.

```
 (\_/)
 (o.o)  "Big paws need big buttons."
 (> <)
```
