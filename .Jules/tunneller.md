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

### Deterministic Seed Generation
- **What:** Swapped `Math.random()` during generation phases with a deterministic Mulberry32 RNG.
- **Why:** By allowing a `?seed=X` parameter in the URL, players and developers can reproduce and replay identical procedural city layouts to easily triage spacing and hazard placement bugs, while keeping standard gameplay unpredictable and random. The actual game logic (particles, AI) continues to use non-deterministic `Math.random()`.
- **Heuristic:** Keep procedural world generation strictly deterministic, but separate dynamic entity behavior.
