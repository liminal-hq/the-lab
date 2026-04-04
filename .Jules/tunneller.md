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
- Learned that Math.random() usage for particle systems should not be seeded so visual variety is maintained even during seeded regression tests or speedruns, whereas procedural layout needs deterministic RNG to correctly isolate level logic issues.
