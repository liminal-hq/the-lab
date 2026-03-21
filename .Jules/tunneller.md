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

- **Deterministic Level Generation:** Implementing a deterministic PRNG (like mulberry32) with a seed parameter for level layout generation (buildings, obstacles, hues) while keeping non-deterministic RNG (`Math.random`) for dynamic elements (AI, particles) ensures reproducibility for bug fixing and balanced pacing, without sacrificing the moment-to-moment organic feel of gameplay.
