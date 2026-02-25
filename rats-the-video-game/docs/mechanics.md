# Game Mechanics: Obstacles & Interactions

## Overview
This document outlines the new mechanics for "Rats: The Video Game", specifically focusing on obstacles the player must overcome by jumping or chewing.

## 1. Chewing Through Obstacles (Boxes)
Rats are famous for their teeth. They never stop growing, so they must chew!

*   **Obstacle**: Cardboard Boxes.
*   **Appearance**: Brown squares located on the ground level.
*   **Behaviour**:
    *   Blocks the player's horizontal movement (Solid).
*   **Interaction**:
    *   **Action**: Press `Enter` (or `C`) while standing next to the box.
    *   **Result**: The box is destroyed.
    *   **Audio**: A crunchy "Chew" sound.
    *   **Visual**: The box disappears (potential particle effect in future versions).

<!--
      ____
     |    |
     |____|  <-- Delicious Cardboard
-->

## 2. Jumping Over Hazards (Rat Traps)
The city is dangerous. Humans have laid traps.

*   **Hazard**: Rat Traps / Spikes.
*   **Appearance**: Sharp, jagged shapes on the ground.
*   **Behaviour**:
    *   Dangerous to touch.
*   **Interaction**:
    *   **Action**: Jump (`Space`) over the trap.
    *   **Result (Collision)**:
        *   Player is knocked back.
        *   "Hurt" audio plays (Snap!).
        *   (Optional) Momentum loss.

<!--
      /\/\/\
     |______|  <-- Do Not Touch
-->

## 3. Coffee Break (Power-Up)
Even rats need a pick-me-up.

*   **Item**: Coffee Cup.
*   **Appearance**: White cup with a lid and steam.
*   **Behaviour**:
    *   Collectible (pass through).
*   **Interaction**:
    *   **Action**: Walk into it.
    *   **Result**:
        *   +5 Points.
        *   **Speed Boost**: Move 1.5x faster for 5 seconds.
    *   **Audio**: "Slurp" sound.

<!--
      )  )
     [____]  <-- Zoom Zoom
-->

## 4. Controls Update
*   **Move**: Arrow Keys (Left/Right)
*   **Jump**: Space
*   **Chew**: Enter / C
*   **Squeak**: S (Happy Squeak)
*   **Help**: ? (Toggle Tutorial)

### Touch Controls (Mobile)
*   **Move Left**: Touch Left side of screen (0-50%)
*   **Move Right**: Touch Right side of screen (50-100%)
*   **Jump**: Tap anywhere or Swipe Up

## Notes on Implementation
*   Obstacles are generated procedurally along with the city buildings.
*   We use Canadian spelling for all code comments and documentation (e.g., Colour, Centre).
