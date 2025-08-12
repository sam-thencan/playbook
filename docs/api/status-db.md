## GET /api/status/db

Checks authentication and confirms presence of newer schema columns (e.g., `category`, `tags_text`, `body_text`) by attempting a select.

Auth: Required

Response: `{ ok, auth, columns: { category_tags_present }, error? }`

See: `src/app/api/status/db/route.ts`


