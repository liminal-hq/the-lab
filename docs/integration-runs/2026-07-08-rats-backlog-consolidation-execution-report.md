# Rats Backlog Consolidation Execution Report

## Status

- Run date: `2026-07-08`
- Mode: `execute`
- Branch: `integration/rats-backlog-consolidation`
- Outcome: `completed and merged`
- Integration PR: [#235](https://github.com/liminal-hq/the-lab/pull/235)

## Starting Point

An initial audit query capped at `--limit 50` undercounted the open PR queue; the real backlog was **132 open PRs** (`#14`, `#104`-`#234`), most of them the same fix re-proposed weekly by five stateless agent personas (Archivist, Ink, Tunneller, Chord, Nibble) that had no visibility into their own prior attempts. Two other personas (Scurry, Palette-Rat) were genuinely iterating on distinct weekly ideas rather than looping, which only became clear once the full 132-PR history was audited rather than just the most recent 50.

## Integrated Outcomes

17 distinct changes merged via `#235`, each landed as a real `--no-ff` merge of the winning PR (not squashed), reworded to use that PR's own title/body as the merge commit message:

1. `🚇 Tunneller: Deterministic level generation via seeds (#231)`
2. `🧱 Scurry: Sonic Squeak (Projectile Defense) (#117)`
3. `🧱 Scurry: [iFrames & Knockback Stun] (#207)`
4. `🧱 Scurry: [Hazard Momentum Loss] (#113)`
5. `🐀 Scurry: Speed Boost Particle Trail (#228)`
6. `🧱 Scurry: Bottle Cap Micro-collectibles (#154)`
7. `🎛️ Chord: Distinct metallic chew for cars (#192)`
8. `🎛️ Chord: Add splat SFX for bird turds (#230)`
9. `🎛️ Chord: Sync district motifs and add Construction variation (#171)`
10. `🎨🐀 Palette-Rat: Improve modal accessibility and touch targets (#160)`
11. `🎨🐀 Palette-Rat: Accessible canvas focus (#229)`
12. `🧪 Nibble: [verification improvement] (#196)`
13. `🧪 Nibble: verify squeak mechanic bird scattering (#201)`
14. `📜 Archivist: Document Birds, Turds, and Squeak mechanic (#232)`
15. `📜 Archivist: [controls doc improvement] (#168)`
16. `🖋️ Ink: Visualise the new squeak mechanic (#169)`
17. `🖋️ Ink: [visual journal update] (#233)`

Plus 4 cleanup commits: two journal-path consolidations (`.Jules/*.md` files six different PRs wrote to `rats-the-video-game/.Jules/` instead of the repo-root convention), a stray scratch-file removal, and one code-review fix commit (see below).

## Conflicts Resolved During Integration

- `#207` and `#113` both edited the same `TRAP`/`THIRD_RAIL` collision block in `game.js` - combined so stun-gating and coffee-boost-loss both apply.
- `#192` and `#230` both inserted a new method at the same point in `audio.js` - kept both (`playMetalChew`, `playSplat`) side by side.
- `#160` and `#229` both rewrote the shared `closeModal` function with different goals. Testing (`modal-focus.spec.js`) surfaced that combining them broke `#160`'s own regression test. Root cause: `#229`'s original bug was specific to the Help/Tutorial modal, not the Options/Credits nesting `#160` covers. Resolved by keeping `#160`'s tested `closeModal` untouched and moving the canvas refocus into `closeTutorial()` specifically.
- `#232` and `#168` both added a numbered section to `docs/mechanics.md` - renumbered sequentially.

## Code Review Before Merge

A high-effort review (8 finder angles, each candidate independently verified) found **8 real bugs**, all fixed in a follow-up commit before merge:

1. Bottle-cap spawns used `Math.random()` instead of the seeded `levelPRNG()`, breaking `?seed=` determinism for that collectible.
2. District music switched themes one building early (1-based `currentCycle` compared against 0-based visual thresholds). Fixed, and extracted a shared `rats-the-video-game/src/districts.js` constants module so the two files can't drift apart again.
3. Stunned + grounded rats had knockback friction applied twice in one frame (0.9x then 0.8x).
4. The `SPRING` obstacle had no stun gate, letting a stunned rat still get relaunched.
5. Falling-turd collision removed the turd from play unconditionally, even while the rat was stunned - turds vanished with zero feedback.
6. Touch swipe-down played the squeak sound twice per gesture; keyboard played it once.
7. `docs/mechanics.md` said the turd-hit sound was "Snap!" when the code plays "Splat!".
8. A second misplaced Jules journal file (`rats-the-video-game/.Jules/palette-rat.md`) was missed in the first consolidation pass.

## Validation

Final branch state passed, both before and after the code-review fixes:

- `/home/scott/.nvm/versions/node/v22.21.1/bin/pnpm --dir the-lab-website build`
- `docker run --rm --ipc=host -v "$PWD":/work -w /work mcr.microsoft.com/playwright:v1.58.2-jammy bash -lc "corepack enable && pnpm --dir rats-the-video-game test"`

The Docker Playwright run passes `15` tests, run multiple times for confidence (this suite has known timing-sensitive flakiness under parallel load per prior integration runs - one `squeak_mechanic.spec.js` flake was observed under the full parallel suite but passed 3/3 in isolation, consistent with that known pattern, not a regression).

## PR Disposition

- **17 kept PRs**: `#113, #117, #154, #160, #168, #169, #171, #192, #196, #201, #207, #228, #229, #230, #231, #232, #233` - each received a `merged` fate comment; GitHub auto-recognized all 17 as `MERGED` (not just closed) since their original commits are preserved in the `--no-ff` merge history now on `main`.
- **114 superseded/duplicate PRs**: closed with a fate comment referencing the specific winning PR that subsumed them.
- **1 deferred PR**: `#14` (Rats Music Converter) left untouched, already labelled `manual-follow-up` from a prior integration run.

No source PR branches were rebased or force-pushed.

## Notes

- The `integration/rats-backlog-consolidation` branch history was rebuilt once mid-run (`git rebase -i --rebase-merges`) to reword each merge commit's message from git's generic `Merge remote-tracking branch '...'` default to the `PR Title (#N)` / PR body format, matching how PR #235 itself was merged. This required force-pushing the integration branch (not any source PR branch) and reapplying the same conflict resolutions a second time.
- Full audit detail, scoring, and conflict analysis: `docs/integration-runs/2026-07-08-rats-backlog-consolidation-action-plan.md`.

## Next Actions

None - the queue is clear except the pre-existing deferred `#14`.
