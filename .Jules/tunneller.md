# Tunneller's Journal

## Generation Heuristics
- **District Colour Signals:** Grouping level slices by hue bands (green -> blue -> red) creates readable progression without new assets. Adding intermediate hues (like orange for construction) bridges harsh jumps.
- **Progressive Difficulty:** Tightening gap ranges and increasing obstacle density over distance creates a natural ramp in challenge.
- **Small Knobs, Big Feel:** Minor shifts in `gapMin/gapMax` and obstacle probability noticeably change pace and player stress.
- **Readability & Spatial Context:** Wide obstacles (like the 'PRIUS') need a minimum gap size (e.g., >= 85px) to remain readable and fair. In tightly packed areas, swap them for narrower obstacles.

```
 (\_/)
 (o.o)  "Same city, different districts."
 (> <)
```
