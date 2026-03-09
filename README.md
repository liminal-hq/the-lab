# The Lab

![Welcome to The Lab](assets/images/lab_intro.svg)

Welcome to **The Lab**! This is a dynamic workspace for experimental projects, creative coding, and digital exploration. Step inside, put on your safety goggles (and maybe some whiskers), and see what's bubbling on the workbench.

## 🧪 Laboratory Rules

To keep the experiments running smoothly, please observe the following protocols:

1.  **Canadian Spelling**: We honour the 'u' in Colour, Behaviour, and Favour. The Centre of our operations is here.
2.  **Conventional Commits**: All contributions must follow the Conventional Commits standard.
3.  **Read AGENTS.md**: This file contains the prime directives. Follow them closely.

---

## 🚀 Active Experiments

### Rats: The Video Game

![Rats: The Video Game Action Shot](assets/images/rats_action.svg)

**Status:** *Containment Breach*

A procedural open-world city game where you assume the role of an escaped lab rat. Scurry through the streets, avoid hazards, and explore the urban jungle.

*   **Objective**: Escape the lab and rule the city.
*   **Tech Stack**: HTML5 Canvas, Web Audio API (16-channel PC Speaker emulation).
*   **Inspiration**: Suzanne Vega's "Rats" from *Flying with Angels* (2025).
*   **Access**: [Enter the Simulation](./rats-the-video-game)

---

### Incident Report: The smdu Breach

![Containment Breach](assets/images/rats_containment_breach.svg)

**Status:** *Under Investigation*

The containment breach has spread beyond the city. Lab specimens have been observed scurrying through CAT-6 cables, navigating `node_modules/ink/build/`, and nesting inside [smdu](https://github.com/liminal-hq/smdu) — a terminal disk usage analyser built with Ink and React.

The rats appear to have followed the resize event pipeline (SIGWINCH → PTY → Node streams → Ink runtime → smdu components), leaving paw prints across the entire render path. They were last seen chewing on Yoga layout nodes and have reportedly claimed `stdout` as their new burrow.

*   **Subjects**: 3+ escaped specimens (one wearing goggles)
*   **Entry Point**: Broken specimen housing → ethernet cable → `process.stdout`
*   **Current Location**: Somewhere between `reconciler.resetAfterCommit()` and `log-update.js`
*   **Terminal Output**: `WARNING: RATS DETECTED`

<!--
     ᘛ⁐̤ᕐᐷ  <-- they're in the comments too
-->

---

## 📝 Living Visual Journal

![Living Journal](assets/images/lab_journal.svg)

This repository is more than just code; it's a living record of our progress. The artwork you see here is part of our commitment to documenting the journey visually.

*   **Art Style**: Modern graphic novel aesthetic with bold outlines and halftone textures.
*   **Updates**: As the lab evolves, so too shall its visual identity. Watch this space for new sketches and schematics.

---

## ⚙️ Technical Specifications

*   **Architecture**: Monorepo managed with `pnpm` workspaces.
*   **Environment**: Web-based (Vanilla JS, Vue.js, Vite).
*   **Deployment**: GitHub Artifacts & Static Site Generation.
