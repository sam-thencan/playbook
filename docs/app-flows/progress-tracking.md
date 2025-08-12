## Progress Tracking

### API
- `POST /api/progress/complete` — Accepts JSON `{ lessonSlug }` or form `lessonSlug`. Upserts `(user_id, lesson_id)` with `percent_complete=100` and timestamps. Logs `lesson_completed`.
  - If form submission, 303 redirects to the next incomplete lesson.

### Dashboard
- `src/app/dashboard/page.tsx`:
  - Loads `user_completion` for percent.
  - Computes streak from `events (lesson_completed)` grouped by day.
  - Builds outline groups from lessons and `progress`, integrates favorites.

### Views
- `user_completion` computes overall percent based on published non‑intro/non‑bonus lessons and `progress.completed_at`.


