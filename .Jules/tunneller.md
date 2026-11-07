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
* Learned: Keeping generation chunks evenly spaced (e.g., 5 cycles) creates a smooth progression ramp. Use `>=` on `cycle - 1` to match 0-based district thresholds synchronously with visual building transitions.
