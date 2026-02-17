# Rats: The Video Game - Technical Specifications

## Overview
An open-world side-scrolling platformer where the player controls a rat navigating a procedurally generated city. The game runs in the browser using HTML5 Canvas and the Web Audio API.

## Architecture
*   **Game Loop**: `requestAnimationFrame` driven loop handling updates and rendering.
*   **Graphics**: Custom `GraphicsEngine` class using 2D Canvas context. Procedural generation for buildings and environment.
*   **Audio**: Custom `AudioEngine` class using Web Audio API to emulate a 16-channel PC Speaker.
*   **Input**: Event listeners for keyboard input (Arrow keys, Space).

## Audio System
*   **Oscillators**: Uses square waves to mimic PC speaker sound.
*   **Channels**: Supports up to 16 concurrent channels (implemented as dynamic oscillator creation for simplicity in this prototype).
*   **Music**: Procedural sequencing using `setInterval` and pentatonic scales.

## Graphics System
*   **Procedural City**: Buildings generated with random width, height, and colour.
*   **Lighting**: Simple day/night cycle elements (moon, lit windows).
*   **Character**: Vector-like drawing of a rat using canvas paths.

## Tech Stack
*   HTML5
*   JavaScript (ES6 Modules)
*   pnpm workspaces
