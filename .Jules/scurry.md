> Review note: This file is an intentional agent log in `.Jules/` that captures Scurry implementation learnings. Updates here are expected when related gameplay behaviour changes land.

# Scurry's Journal

## Pizza Slice Collectible
- **Learning**: Placing high-value collectibles in dangerous areas (like gaps between buildings) creates a nice risk/reward dynamic. It forces players to deviate from the optimal "safe" path (jumping early) to a "risky" path (jumping late or falling then jumping). This adds depth without new mechanics.

## Coffee Speed Boost
- **Learning**: Increasing speed by 1.5x significantly alters the jump arc, making gaps easier to clear but precision landings harder. This forces the player to adapt their muscle memory quickly. The 5-second duration feels just long enough to be exciting but short enough not to be overwhelming.
- Squeak button needed a gameplay purpose. Added bird scaring mechanism. Mapped to Swipe Down on mobile to maintain input parity.
- Adding a secondary interactive effect to an established input creates a richer, more responsive world without adding to control complexity.

## Sonic Squeak Turd Deflection
- **Learning**: Adding secondary defensive interactions (like deflecting turds) to established flavor inputs (like Squeak) enriches the game feel without complicating controls. This turns a simple aesthetic button into a crucial timing mechanic for survival.
