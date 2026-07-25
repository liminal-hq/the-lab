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
    DOWNTOWN: 5,
    COMMERCIAL: 10,
    CONSTRUCTION: 15,
    INDUSTRIAL: 20
});
