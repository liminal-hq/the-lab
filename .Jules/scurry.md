# Scurry's Journal

## Pizza Slice Collectible
- **Learning**: Placing high-value collectibles in dangerous areas (like gaps between buildings) creates a nice risk/reward dynamic. It forces players to deviate from the optimal "safe" path (jumping early) to a "risky" path (jumping late or falling then jumping). This adds depth without new mechanics.

## Coffee Speed Boost
- **Learning**: Increasing speed by 1.5x significantly alters the jump arc, making gaps easier to clear but precision landings harder. This forces the player to adapt their muscle memory quickly. The 5-second duration feels just long enough to be exciting but short enough not to be overwhelming.

## 🧀 The Cheese Mechanic
- **Observation**: The game benefits from high-reward collectibles to create exciting moments of risk vs reward during fast-paced segments. The `PIZZA` obstacle offered 10 points with a 25% spawn chance, and `COFFEE` offered 5 points with a 15% spawn chance.
- **Learning**: To introduce a proper "jackpot" feeling, we added `CHEESE`! It has a low spawn chance (10%) but offers a massive 50 points. This provides excellent pacing value as players will naturally try harder (and risk failure) to maneuver and collect it.
- **Accessibility**: When adding emoji representation for the `CHEESE` to the tutorial instructions, it's crucial to ensure all emojis are wrapped properly in `<span role="img" aria-label="...">`. This ensures that screen readers can convey the collectible items effectively to all users, providing parity in game knowledge.
