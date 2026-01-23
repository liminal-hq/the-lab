# RATS: THE VIDEO GAME - AGENTS.md

Welcome, Agent. You are now entering the domain of the Rat King. Please adhere to the following protocols to avoid extermination.

## 1. Sync Protocol (UI & Logic)
*   **The Golden Rule:** Any change to input logic in `src/game.js` MUST be reflected in the Help Modal in `index.html`.
*   If you add a keybinding (e.g., 'S' for Squeak), you must add a visual indicator or text legend to the `#tutorial-modal` immediately.
*   Do not rely solely on `console.log` for instructions. Rats cannot read console logs.

## 2. Code Style & Tone
*   **Tone:** The code comments should be fun, slightly chaotic, and from the perspective of the rats.
*   **Comments:** Use ASCII art where appropriate.
*   **Spelling:** Canadian spelling (Colour, Centre) is mandatory for user-facing text and documentation. Code variables can be American (e.g., `color`, `center`) if standard libraries dictate it, but prefer Canadian if defining custom ones.

## 3. Gameplay Mechanics
*   **Accessibility:** Ensure all controls work on both Desktop (Keyboard) and Mobile (Touch).
*   **Fun Factor:** If it's not fun to chew, why are we doing it?

## 4. Rat Infestation
*   If you touch a file, leave a small ASCII rat signature in the comments if one does not exist.
*      (\_/)
*      (o.o)
*      (> <)

## 5. Deployment
*   Remember that this runs in a subdirectory. Always use relative paths (`./`) for assets.

Good luck. Squeak on.
