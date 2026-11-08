// --------------------------------------------------------------------------
//  DISTRICT THRESHOLDS (shared by game.js visuals and audio.js music)
// --------------------------------------------------------------------------
//  Single source of truth for where each SURFACE district begins, keyed by
//  the 0-based building/cycle index `i` used in generateSurface().
//
//      (\_/)
//      (o.o)  "One map, one soundtrack."
//      (> <)
// --------------------------------------------------------------------------

export const DISTRICT_THRESHOLDS = Object.freeze({
    DOWNTOWN: 7,
    CONSTRUCTION: 13,
    INDUSTRIAL: 19
});
