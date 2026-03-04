# Scurry's Journal

## Pizza Slice Collectible
- **Learning**: Placing high-value collectibles in dangerous areas (like gaps between buildings) creates a nice risk/reward dynamic. It forces players to deviate from the optimal "safe" path (jumping early) to a "risky" path (jumping late or falling then jumping). This adds depth without new mechanics.

## Coffee Speed Boost
- **Learning**: Increasing speed by 1.5x significantly alters the jump arc, making gaps easier to clear but precision landings harder. This forces the player to adapt their muscle memory quickly. The 5-second duration feels just long enough to be exciting but short enough not to be overwhelming.

### CHEESE Mechanic
Added a rare, high-value `CHEESE` collectible.
- Spawns with 10% chance.
- Provides 50 points upon collection.
- Renders as a bobbing gold wedge with goldenrod holes.
- Emits bright `#FFD700` particles calculated at `obsT - obs.h / 2`.
- High-value collectibles create momentary, fun risk/reward spikes without altering core traversal pacing. Ensure particle height generation correctly accounts for the custom Y-up coordinate system to avoid top-of-canvas spawning.
