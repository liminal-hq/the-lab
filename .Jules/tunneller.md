# Tunneller Journal

## Critical Learnings

*   **Readability Constraints:** When dynamically generating gaps between buildings and placing obstacles inside them, it is critical to enforce a relationship between `gap` width and `obstacle` width. Before, a `PRIUS` (width 80) could spawn in a gap of 50, causing it to clip into buildings. Introducing a fallback (`if (objW > gap - 10) type = 'BOX'`) ensures readability without sacrificing the intended difficulty or variety of a district.
*   **Pacing and Variety:** Breaking the level into more distinct visual and mechanical districts (e.g., adding a "Construction" district) improves pacing. Each district needs tailored obstacle weightings (e.g., Construction leans heavily on `BOX` and `SPRING`).
*   **Asset Reusability:** You can significantly change the "mood" of a section of the game purely through color palettes (`hueBase` manipulation of buildings) and obstacle density/selection, without needing a single new sprite or SVG.
