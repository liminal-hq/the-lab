# Tunneller's Journal

## Generation Heuristics
- **District Colour Signals:** Grouping level slices by hue bands (green -> blue -> red) creates readable progression without new assets.
- **Progressive Difficulty:** Tightening gap ranges and increasing obstacle density over distance creates a natural ramp in challenge.
- **Small Knobs, Big Feel:** Minor shifts in `gapMin/gapMax` and obstacle probability noticeably change pace and player stress.

```
 (\_/)
 (o.o)  "Same city, different districts."
 (> <)
```
* In rats-the-video-game, procedural world generation uses a deterministic Mulberry32 RNG seeded via the ?seed= URL parameter for reproducibility, while dynamic logic uses Math.random(). If no seed is provided, a new random seed is calculated inside the level reset function so layouts remain random across restarts.
