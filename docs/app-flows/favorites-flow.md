## Favorites Flow

### API
- `GET /api/favorites` — Returns favorites joined to lessons for the current user.
- `POST /api/favorites` — Toggles a favorite for `lessonId` (JSON body).

### UI
- `FavoriteToggle` calls `POST /api/favorites`, does optimistic update, and notifies a toast.
- `ClientFavoritesRow` listens to a window event and refreshes the row from `GET /api/favorites`.

### Data
- Table `public.favorites` with PK `(user_id, lesson_id)`.
- RLS lets users read/insert/delete their own rows; admins can manage all.


