# 30-Day Local SEO Playbook – TODO

## P0: Unified grouping, Tags, Search, Sticky Headers
- **Unified grouping**: Add `category` to lessons backend: one of Intro, Week 1, Week 2, Week 3, Week 4, Week 5, Bonus. Server/UI will group both the sidebar and dashboard by this field (no heuristics). Fallback: if `category` is null, compute from `day` as today. Migration: expose category in the admin editor (select) to override odd cases.
- **Tags**: Add `tags text[]` to lessons; index for search. Admin editor gets tag chips with add/remove (comma or Enter to add). Lesson page shows tag chips beside the Estimated time pill (wrapping row). Dashboard outline may preview tags subtly on hover; primary surfacing is in lesson page and search.
- **Search**: Client search box (dashboard header and sidebar): type-to-search titles, tag array, and text blocks. Start simple: SQL ILIKE over `title`, `tags`, and a flattened `body_text` generated/stored column. To avoid heavy JSON scanning, add a generated column (or trigger) that concatenates paragraph/heading strings into `body_text` (updated on write). Results: highlight matches; allow filtering by tags via chip clicks.
- **Sidebar/dashboard UX**: Remove accordions; render categories with sticky section headers (CSS `position: sticky; top: 0` inside the scroll container). Auto-scroll to current lesson on load. Shared grouping util uses category and sorts Intro → Week 1 → … → Week 5 → Bonus. (Accordions removed; sticky headers implemented in sidebar; dashboard uses always-expanded week cards; auto-scroll still pending.)

- Steps to implement:
  - [x] Schema: add `category`/`tags`/`body_text` with proper indexes.
  - [x] Admin: add Category select + Tag chips; plumb through API.
  - [x] Dashboard: switch to category grouping (Intro/Bonus mapped into Week labels).
  - [ ] Sidebar: switch to category grouping (currently infers from `day`; update to read `category`).
  - [x] Search API: endpoint querying `title`/`tags`/`body_text`.
  - [ ] Client search UI: dashboard header + sidebar integration with highlighting and tag chip filters.
  - [x] Lesson page: render tag chips next to the Estimated pill.

## 0) UI Overhaul (P0)
- Visual tokens & components
  - [ ] Typography tracking (H1/H2), spacing scale
  - [ ] Dark mode surfaces/tokens; accent `#FF6A00` audit

## 0.5) Launch Prep – Payments, Google OAuth, Deploy (P0-beta)
- Stripe payments / access control
  - [x] Add `profiles.has_access boolean default false`
  - [x] Gate `/dashboard` and `/lesson/*` when `has_access=false` → redirect to `/pay`
  - [x] `/pay` page with one-time purchase CTA (Stripe Checkout)
  - [x] Server: `/api/checkout` creates Checkout Session (price via `STRIPE_PRICE_ID`), ties `supabase_user_id`
  - [x] Server: `/api/stripe/webhook` verifies signature; on `checkout.session.completed` → set `has_access=true` and log event
  - [ ] E2E QA (new user → pay → instant access)

- Google sign‑in
  - [ ] Prod OAuth configuration and QA pass

- Deploy / liveness
  - [ ] Vercel project + env for `course.30dayseo.com`
  - [ ] Supabase Auth Site URL set to prod; Stripe webhook endpoint for prod URL

- Content polish (post-beta)
  - [ ] Lessons polish round; ensure featured videos added/rendered
  - [ ] Minor copy/spacing tune-ups

## 1) Admin (P1) + UI carryover
- [x] Optional: event log view for admin (audit of create/update/delete)

- UI carryover
  - [x] Mobile sticky bottom bar: Previous | Mark Complete | Next

## 2) Content system (P2)
 - [ ] Define JSON block schema (versioned) for `lessons.body`
 - [ ] PDF import improvements
   - [ ] Map detected sections to blocks; detect featured YouTube when present

## 3) Media handling (P2)
 - [ ] Define JSON block schema (versioned) for `lessons.body`
 - [ ] PDF import improvements

## 4) Lesson page rendering (P2)
- [x] Supabase Storage bucket `lessons` (public read)
  - [ ] RLS: only admins can upload/write
- [x] Admin upload component (drag & drop) with progress
- [ ] Image optimization (Next `<Image>`), aspect-ratio helpers

## 5) Streaks (P3)
- [ ] Show contextual Offer card when eligible (polish display)
- [x] Dashboard Table of Contents for quick jump

## 6) Offer unlocks (P3)
- [x] Display CTA when unlocked; log `offer_unlocked` / `offer_redeemed`

## 7) Testing & DX (P2/P3)
 - [ ] Lightweight unit tests for libs (streaks, unlocks)
 - [ ] Lint/type checks in CI

---
P0 – Dashboard and Lesson polish (next up)
- Dashboard
  - [x] Remove accordions from week cards; always expanded inside cards
  - [x] Group by `lessons.category` with display labels:
    - Week 1 (Intro + Days 1–7), Week 2 (Days 8–14), Week 3 (Days 15–21), Week 4 (Days 22–28), Week 5 (Days 29–31 + Bonus)
    - Merge `Intro` into Week 1 and `Bonus` into Week 5 for display
  - [x] Time left: sum `estimated_minutes` for incomplete items (fallback 12 min when null)
- Lesson page
  - [x] Show tag chips next to Estimated pill
  - [x] Hide Resources section when empty; align bottom Prev | Mark Complete | Next in one row
- Content model
  - [x] Add a dedicated `featured_video` block rendered above content; prevent duplicate videos (implemented as "first video block featured" + filtered from body)
  - [x] Update Markdown import to optionally flag the first YouTube link as `featured_video` (via bare YouTube/Loom URL detection; first one featured)
  - [ ] Update `lesson_md_import.md` instructions for tag usage (featured video covered)
- Data model tweaks
  - [x] Allow `day = 0` for Intro and >30 for extensions (relax check to 365); migration + backfill existing lessons

---
Meta
- Commit after each completed step as a small, reviewable change.
