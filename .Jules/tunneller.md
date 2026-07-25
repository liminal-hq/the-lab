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

## Deterministic Seeding
- Deterministic level generation uses cyrb128 to hash string seeds passed via `?seed=` (incorporating `state.level`) and seeds the mulberry32 PRNG.
* Subdividing the 25-cycle level into 5 distinct 5-cycle chunks improves pacing and introduces aesthetic variety without requiring new visual assets.
