## UI Components

Styling follows minimal white cards, neutral background, orange accents (#FF6A00), radius 10px, Poppins font.

### Core
- `Button` — Variants: `primary | secondary | ghost`. Accessible focus ring, rounded radius.
- `Card` — White container with hover/focus visuals.
- `ProgressRing` — SVG ring with numeric label at center.
- `Pill` — `solid | soft` variants for metadata and tags.

### Lessons
- `LessonSidebar` / `LessonSidebarMobile` — Searchable, grouped by Intro/Weeks/Bonus; shows completion ticks.
- `LessonStickyBar` — Mobile CTA bar with Prev/Complete/Next.
- `WeekAccordion` — Dashboard grouping per week; integrates `FavoriteToggle`.
- `blocks/Renderer` — Renders lesson body JSON blocks.

### Feedback
- `Toast` — Context provider + hook for ephemeral notifications.

See code under `src/components/**` for props and usage patterns.


