# Tunneller's Journal

     ## Generation Heuristics
     - **Deterministic Seeding:** Adding a `?seed=` URL parameter that seeds a `mulberry32` PRNG allows for consistent, reproducible procedural level generation (layout, gaps, obstacles) while still defaulting to randomized runs. This enables reliable debugging of unfair setups without breaking the chaotic pacing.
