# Themed Mega PR Execution Sequence

## Status

- Run date: `2026-03-11`
- Source plan: `docs/integration-runs/2026-03-11-themed-mega-prs-action-plan.md`
- Mode: `pre-execute`
- Approval state: `sequence prepared; execute not started`
- Working tree state when sequence was generated: `dirty`
- Validation state when sequence was generated: `website build passed natively; Playwright passed via Docker fallback on this Arch host`

## Preconditions

1. Use the pinned package manager binary before any execute step.
   - `/home/scott/.nvm/versions/node/v22.21.1/bin/pnpm install`
2. Ensure the game test gate can run on the current host.
   - Preferred native path: `/home/scott/.nvm/versions/node/v22.21.1/bin/pnpm --dir rats-the-video-game exec playwright install`
   - Arch-only fallback on this machine: `docker run --rm --ipc=host -v "$PWD":/work -w /work mcr.microsoft.com/playwright:v1.58.2-jammy bash -lc "corepack enable && pnpm --dir rats-the-video-game test"`
3. Re-run validation commands successfully.
   - `/home/scott/.nvm/versions/node/v22.21.1/bin/pnpm --dir the-lab-website build`
   - `/home/scott/.nvm/versions/node/v22.21.1/bin/pnpm --dir rats-the-video-game test`
4. Start from a known-clean branch state before mutating Git history.
5. Treat the current local fold work as part of the execution payload, not as stray edits.

## Local Fold Payload

These local changes should be carried onto the integration branch before PR-specific work:

1. `rats-the-video-game/src/game.js`
   - dormant third-level generation scaffolding
2. `rats-the-video-game/src/audio.js`
   - dormant third-level audio motif scaffolding
3. `assets/images/lab_journal.svg`
   - cleanup-wave journal update
4. `docs/integration-runs/2026-03-11-themed-mega-prs-action-plan.md`
   - final audit decisions
5. `docs/integration-runs/2026-03-11-themed-mega-prs-action-plan.json`
   - final audit decisions

## Branch Strategy

1. `git switch main`
2. `git pull --ff-only`
3. `git switch -c integration/themed-pr-consolidation`
4. Commit the local fold payload first with a Conventional Commit message.

Recommended local commit subject:

```text
feat(rats-the-video-game): stage post-subway groundwork and cleanup journal
```

## Execution Sequence

1. Apply planned labels and communication notes on GitHub before touching branches.
   - `consolidation`: `#60`, `#61`, `#62`, `#85`, `#88`, `#94`, `#95`
   - `changes-requested`: `#58`, `#80`
   - fold-and-close after comment: `#57`, `#63`, `#65`, `#81`, `#82`, `#86`, `#87`
   - supersede-close after comment: `#56`, `#59`, `#64`, `#66`, `#67`, `#68`, `#69`, `#70`, `#71`, `#72`, `#73`, `#74`, `#75`, `#79`, `#83`, `#84`, `#89`, `#90`, `#92`, `#93`
2. Land the local fold payload commit on `integration/themed-pr-consolidation`.
   - This creates the destination for `#81`, `#82`, and the journal cleanup work.
3. Integrate `#62`.
   - Outcome title: `🧱 Scurry: Add double jump movement (#62)`
   - Close after comment: `#56`
   - Leave `#58` in `changes-requested`
4. Integrate `#94`.
   - Outcome title: `🐀 Scurry: Add high-value cheese collectibles (#94)`
   - Close after comment: `#66`, `#68`, `#70`, `#72`, `#74`, `#79`, `#83`, `#89`, `#92`
5. Integrate `#95` and port the selected `Palette-Rat` fold work.
   - Port from `#57`: touch jump-plus-chew behaviour only
   - Port from `#63`: mobile instructions and overlay wording
   - Outcome title: `🎨🐀 Palette-Rat: Improve mobile instructions and icon accessibility (#57, #63, #95)`
   - Close after comment: `#57`, `#59`, `#63`, `#67`, `#69`, `#71`, `#73`, `#75`, `#84`, `#90`, `#93`
   - Leave `#80` in `changes-requested`
6. Integrate `#61`.
   - Outcome title: `🚇 Tunneller: Add construction district pacing (#61)`
   - Close after comment: `#82`
7. Integrate `#60`.
   - Outcome title: `🎛️ Chord: Add district audio motifs and compression (#60)`
   - Close after comment: `#81`
8. Integrate `#88` and port the selected verification fold work from `#65`.
   - Outcome title: `🧪 Nibble: Expand gameplay verification coverage (#65, #88)`
   - Close after comment: `#65`
9. Integrate `#85` and port the selected docs/journal fold work from `#86` and `#87`.
   - Outcome title: `📜🖋️ Archivist-Ink: Refresh controls docs and visual journal (#85, #86, #87)`
   - Close after comment: `#86`, `#87`, `#64`
10. Post closure comments for all superseded or folded PRs naming their destination mega PR.
11. Re-run full validation on the integration branch.
12. Produce the final execution report artefact.

## Closure Map

1. `#57` -> `🎨🐀 Palette-Rat: Improve mobile instructions and icon accessibility (#57, #63, #95)`
2. `#59` -> `🎨🐀 Palette-Rat: Improve mobile instructions and icon accessibility (#57, #63, #95)`
3. `#63` -> `🎨🐀 Palette-Rat: Improve mobile instructions and icon accessibility (#57, #63, #95)`
4. `#65` -> `🧪 Nibble: Expand gameplay verification coverage (#65, #88)`
5. `#79` -> `🐀 Scurry: Add high-value cheese collectibles (#94)`
6. `#81` -> local dormant third-level groundwork commit plus `🎛️ Chord: Add district audio motifs and compression (#60)`
7. `#82` -> local dormant third-level groundwork commit plus `🚇 Tunneller: Add construction district pacing (#61)`
8. `#86` -> `📜🖋️ Archivist-Ink: Refresh controls docs and visual journal (#85, #86, #87)`
9. `#87` -> `📜🖋️ Archivist-Ink: Refresh controls docs and visual journal (#85, #86, #87)`

## Validation Commands

```bash
/home/scott/.nvm/versions/node/v22.21.1/bin/pnpm --dir the-lab-website build
/home/scott/.nvm/versions/node/v22.21.1/bin/pnpm --dir rats-the-video-game test
# Arch fallback for this machine:
docker run --rm --ipc=host -v "$PWD":/work -w /work mcr.microsoft.com/playwright:v1.58.2-jammy bash -lc "corepack enable && pnpm --dir rats-the-video-game test"
```

Observed when preparing this sequence:

- `/home/scott/.nvm/versions/node/v22.21.1/bin/pnpm --version` -> `10.29.3`
- `/home/scott/.nvm/versions/node/v22.21.1/bin/pnpm --dir the-lab-website build` passed on `2026-03-11`
- `docker run --rm --ipc=host -v "$PWD":/work -w /work mcr.microsoft.com/playwright:v1.58.2-jammy bash -lc "corepack enable && pnpm --dir rats-the-video-game test"` passed on `2026-03-11`
- Native Playwright browser install is still optional on this Arch host because the Docker fallback already satisfies the game test gate
- Docker is a host-specific workaround for this Arch machine, not the primary validation path for the repo

## Stop Conditions

1. Any failed validation command
2. Any merge conflict not already accounted for in the plan
3. Any unexpected divergence between the local fold payload and the target PR contents
