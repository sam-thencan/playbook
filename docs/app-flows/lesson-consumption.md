## Lesson Consumption Flow

### Path and modules
- Page: `src/app/lesson/[slug]/page.tsx`
- Components: `LessonSidebar`, `LessonSidebarMobile`, `LessonStickyBar`, `Renderer`

### Behavior
1. Load lesson by `slug` with `select('id,title,day,estimated_minutes,resources,body,tags')`.
2. If authenticated, insert `lesson_viewed` event.
3. Load published lessons to compute prev/next and sidebar grouping (by explicit `category` or inferred by `day/is_intro/is_bonus`).
4. Compute offer unlocked state using `user_completion` and first active `offers` record.
5. Load completed slugs from `progress` to show checkmarks.
6. “Mark Complete” posts a form to `POST /api/progress/complete`.

### Rendering notes
- Featured video: if the first block is `video`, render in a dedicated player area.
- `Renderer` renders block JSON into UI.


