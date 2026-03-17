> Review note: This file is an intentional agent log in `.Jules/` that captures Palette-Rat UX and accessibility learnings. Updates here are expected when related interface behaviour changes land.

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

## 4. Modal Dismissal Conventions and Touch Targets

**Pattern:**
- Modals should support intuitive dismissal beyond just the "Close" button.
- Users expect clicking the dark background overlay (`.modal`) to close the dialog.
- Interactive inputs such as checkboxes need touch targets of at least 24x24 pixels for reliable mobile use.

**Implementation:**
Attach a click event listener to the `.modal` elements checking if `e.target === modal` (ensuring the click wasn't inside `.modal-content`).

```javascript
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal(modal); // Or specific logic like closeTutorial()
        }
    });
});
```

**Why this helps:**
- Reduces cognitive load and fine motor requirement to find and click a specific button.
- Matches standard expected web patterns.
```

**CSS:**
```css
.control-row input[type="checkbox"] {
    width: 24px;
    height: 24px;
    cursor: pointer;
}
```

```
 (\_/)
 (o.o)  "Big paws need big buttons."
 (> <)
```

## 5. Nested Modal Focus Management

**Problem:** When closing a nested modal (like Credits inside Options), focus wasn't restored correctly if a single variable `lastFocus` was used. The inner modal overwrote the outer modal's return focus target.

**Solution:**
Use a `focusStack` array to push `document.activeElement` when any modal opens, and pop it when any modal closes.

**Implementation:**
```javascript
const focusStack = [];

function openModal(modal) {
    focusStack.push(document.activeElement);
    // ... display logic ...
}

function closeModal(modal) {
    // ... display logic ...
    const lastFocus = focusStack.pop();
    if (lastFocus && document.body.contains(lastFocus)) {
        lastFocus.focus();
    }
}
```

**Why this helps:**
- Ensures screen reader and keyboard users are predictably returned to the exact button they pressed, no matter how deeply nested the modal stack gets.
- Creates a robust and reusable pattern instead of custom single-variable gymnastics.

```
 (\_/)
 (o.o)  "Follow the breadcrumbs back out."
 (> <)
```
