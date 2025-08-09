# 30-Day Local SEO Playbook – TODO

Priority order (current):
0) UI Overhaul (first)
1) Admin
2) Content pipeline and remaining features

## 0) UI Overhaul (P0)
- Dashboard
  - [ ] Course outline ToC (Weeks 1–5 + Bonus in Week 5) with expand/collapse
  - [ ] Week progress (X/Y lessons), ETA, Resume Week CTA
  - [ ] Favorites row (top 5) + /favorites
  - [ ] ProgressRing contrast/labels polish
- Lesson page
  - [x] Sidebar (search + completion ticks)
  - [ ] Collapse by Week (Intro/Week 1–5/Bonus)
  - [ ] Mobile sticky bottom bar: Previous | Mark Complete | Next
  - [x] Previous/Next nav (desktop)
  - [ ] Offer card display polish (copy/states)
- Visual tokens & components
  - [ ] Card spacing/padding defaults; consistent shadow + 10–12px radius
  - [ ] Button variants (primary/secondary/ghost) sizing + focus rings
  - [ ] Typography tracking (H1/H2), spacing scale
  - [ ] Dark mode surfaces/tokens; accent `#FF6A00` audit
  - [x] Lesson sidebar responsive (mobile slide‑in)

## 1) Admin (P1)
- [x] Gate `/admin/*` by `profiles.role === 'admin'`
  - [x] Middleware using SSR Supabase; redirect non-admins to `/login`
  - [x] Server-side re-check in pages to avoid client bypass
- [x] Lessons CRUD (wired to Supabase)
  - [x] List with sort (by `day`, `sort_order`, `published`)
  - [x] Create/Edit form
  - [x] Fields: title, slug, day (optional), is_intro, is_bonus, estimated_minutes, resources[], body (blocks), sort_order, published
  - [x] Publish toggle, delete
- [x] Offers CRUD (wired to Supabase)
  - [x] List
  - [x] Create/Edit fields: title, description, type, unlock_day, unlock_percent, sort_order, cta{label,url}, active
  - [x] Publish toggle, delete
- [x] RLS sanity checks for admin write (already in schema)
- [x] Basic toasts/feedback (non-blocking) and empty states
- [ ] Optional: event log view for admin (audit of create/update/delete)

## 2) Content system (P2)
 - [ ] Support mixed lesson content types
   - [x] Blocks: paragraph, heading, list, image{url,alt,caption}, video{provider|url,caption}, code
   - [ ] Define JSON block schema (versioned) for `lessons.body`
   - [x] Renderer for all block types
 - [ ] Admin lesson editor UI
   - [x] Simple block editor (add/reorder/delete)
   - [x] Resource links editor
   - [x] Preview pane
 - [ ] PDF import improvements
   - [x] Map detected sections to blocks; detect featured YouTube when present
   - [x] Re-parse lessons to new block spec and detect featured YouTube video per day
     - [x] Intro → Day 30 + Bonus

## 3) Media handling (P2)
- [ ] Support mixed lesson content types
  - [x] Blocks: paragraph, heading, list, image{url,alt,caption}, video{provider|url,caption}, code
  - [ ] Define JSON block schema (versioned) for `lessons.body`
  - [x] Renderer for all block types
- [ ] Admin lesson editor UI
  - [x] Simple block editor (add/reorder/delete)
  - [x] Resource links editor
  - [x] Preview pane
- [ ] PDF import improvements
  - [x] Map detected sections to blocks; detect featured YouTube when present
  - [x] Re-parse lessons to new block spec and detect featured YouTube video per day
    - [x] Intro → Day 30 + Bonus

## 4) Lesson page rendering (P2)
- [ ] Supabase Storage bucket `lessons` (public read)
  - [ ] RLS: only admins can upload/write
- [ ] Admin upload component (drag & drop) with progress
- [ ] Image optimization (Next `<Image>`), aspect-ratio helpers

## 5) Streaks (P3)
- [x] Render block types with responsive, accessible markup
- [x] Previous/Next lesson navigation
- [ ] Show contextual Offer card when eligible (polish display)
- [x] Lesson navigator (sidebar) with grouping and search (desktop + mobile)
- [ ] Dashboard Table of Contents for quick jump

## 6) Offer unlocks (P3)
- [ ] Compute daily streak from `events`
- [ ] Display on dashboard; increment on completion; milestone toasts

## 7) Testing & DX (P2/P3)
- [ ] Eligibility: by `unlock_day` or `unlock_percent`
- [ ] Display CTA when unlocked; log `offer_unlocked` / `offer_redeemed`

## Next Big 3 (for tomorrow)
1) UI Overhaul: Dashboard ToC + Week progress + ProgressRing polish
2) UI Overhaul: Sidebar collapsible by Week + mobile sticky lesson bar
3) UI Overhaul: Components polish (cards/buttons/spacing) + offer card copy
- [ ] Lightweight unit tests for libs (streaks, unlocks)
- [ ] Lint/type checks in CI

---
Meta
- Commit after each completed step as a small, reviewable change.

## Next Big 3 (for tomorrow)
1) Dashboard ToC + progress polish
   - Build a clickable ToC of all lessons on `/dashboard` with resume state; improve `ProgressRing` contrast/labels.
2) Media pipeline
   - Supabase Storage bucket `lessons` (public read), admin-only uploads, drag & drop, and use Next `<Image>` in Renderer.
3) Go-live readiness
   - Prod env setup (Vercel + Supabase), env vars, seed lessons, RLS review, basic smoke tests, and offer display polish.
