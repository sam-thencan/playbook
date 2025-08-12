## POST /api/progress/complete

Mark a lesson as complete for the current user.

Auth: Required

Body:
- JSON: `{ "lessonSlug": "day-1" }`
- or form: `lessonSlug=day-1`

Response:
- JSON: `{ ok: true }` for JSON requests
- 303 redirect to next lesson for form submissions

Errors: `401 Unauthorized`, `400 lessonSlug is required`, `404 Lesson not found`

See: `src/app/api/progress/complete/route.ts`


