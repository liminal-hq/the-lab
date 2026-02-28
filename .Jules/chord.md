# Chord's Audio Journal

## Mix Learnings

- **Audio Normalization**: When procedurally generating chiptune audio, multiple oscillators firing simultaneously (especially during fast musical intervals combined with SFX like jump/chew) can easily exceed 0dBFS, causing harsh digital clipping. Inserting a `DynamicsCompressorNode` just before `AudioContext.destination` is a reliable way to act as a limiter, keeping the 16-channel symphony sounding comfortable and balanced without requiring complex manual ducking logic.

## Design Patterns

- **District Motifs**: Game states tracking progression (like `state.currentCycle`) can be passed into the `AudioEngine` to modulate scales, bass lines, and drum frequencies. This allows procedural music to evolve synchronously with procedural generation, creating a more cohesive world feeling (e.g., dissonant Phrygian scales for harder "Industrial" districts).
