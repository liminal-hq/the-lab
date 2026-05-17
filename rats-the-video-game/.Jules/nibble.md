# Nibble's QA Journal

- Discovered that mobile tap events mapped to game inputs (`touchstart` translating to jump/chew) can be effectively simulated in Playwright by dispatching a native `TouchEvent` via `page.evaluate()`.
- Crucial lesson: when dispatching simulated `TouchEvent` objects, target the actual DOM node (like `document.getElementById('gameCanvas')`) rather than `window`. If you target `window`, methods like `e.target.closest()` used in UI/modal isolation checks will throw errors because `closest` does not exist on the `Window` object.
