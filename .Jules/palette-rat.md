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

## 4. Emoji and Decorative Icon Accessibility

**Pattern:**
- Wrap emojis in `<span role="img" aria-label="...">` to ensure screen readers announce them properly rather than reading out their unicode names.
- For buttons that already have `aria-label` describing their function (like a "Options" button), wrap any decorative text or icons inside the button with `<span aria-hidden="true">` to prevent screen readers from announcing redundant information (e.g., avoiding "Options, gear icon").

**Why this helps:**
- Screen reader users get concise, contextually accurate descriptions of interactive elements.
- It prevents annoying "double read" scenarios where an icon's name is read right after the button's label.
- Emojis are explicitly announced based on their semantic meaning in the app, rather than relying on browser-dependent default pronunciation.
