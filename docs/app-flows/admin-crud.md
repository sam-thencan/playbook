## Admin CRUD

### Lessons
- List: `src/app/admin/lessons/page.tsx`
- Edit: `src/app/admin/lessons/edit/page.tsx` (fetches `/api/lessons/by-id` when `?id=`)
- API: `POST /api/admin/lessons`, `PATCH /api/admin/lessons/[id]`, `DELETE /api/admin/lessons/[id]`

### Offers
- List: `src/app/admin/offers/page.tsx`
- Edit: `src/app/admin/offers/edit/page.tsx` (fetches `/api/offers/by-id` when `?id=`)
- API: `POST /api/admin/offers`, `PATCH /api/admin/offers/[id]`, `DELETE /api/admin/offers/[id]`

### Access control
- Edge middleware ensures `/admin/*` requires `profiles.role='admin'`.
- RLS policies require `public.is_admin()` for all writes.


