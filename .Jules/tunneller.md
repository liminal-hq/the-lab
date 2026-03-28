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

## Deterministic Procedural Generation
Splitting level generation RNG (`levelRandom()`) from dynamic entity RNG (`Math.random()`) like particles and birds is a critical tuning heuristic. By utilizing a Mulberry32 PRNG seeded via a URL parameter, the deterministic level geometry enables reliable reproduction of generation bugs and pacing constraints, without sacrificing the non-deterministic, chaotic emergence of active gameplay elements.
