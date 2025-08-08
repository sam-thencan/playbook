# 30-Day Local SEO Playbook – TODO

Priority order per request:
1) Admin
2) Tighten UI
3-N) Content pipeline and remaining features

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
- [ ] Basic toasts/feedback and empty states
- [ ] Optional: event log view for admin (audit of create/update/delete)

## 2) Tighten UI (P1)
- [ ] Typography
  - [x] Increase heading weights (h1/h2 → `font-semibold`/`font-bold`); ensure readable contrast
  - [ ] Tune `leading`/`tracking` for display headings
- [ ] Components
  - [x] Table text contrast on white cards (current text too light)
  - [x] Card overflow clipping (no input bleed)
  - [ ] Card spacing/padding defaults; consistent shadow and radius (10–12px)
  - [ ] Button variants: primary/secondary/ghost sizing + states; accessible focus rings
  - [ ] ProgressRing stroke width/contrast; label placement
  - [x] Pill contrast variants (estimate pill)
- [ ] Layout
  - [x] Container widths (`max-w-3xl/5xl`), responsive gaps
  - [ ] Dark mode surfaces/tokens; accent `#FF6A00` audit
- [ ] Accessibility
  - [x] Semantic headings order, focus outlines

## 3) Content system (P2)
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

## 4) Media handling (P2)
- [ ] Supabase Storage bucket `lessons` (public read)
  - [ ] RLS: only admins can upload/write
- [ ] Admin upload component (drag & drop) with progress
- [ ] Image optimization (Next `<Image>`), aspect-ratio helpers

## 5) Lesson page rendering (P2)
- [x] Render block types with responsive, accessible markup
- [ ] Previous/Next lesson navigation
- [ ] Show contextual Offer card when eligible

## 6) Streaks (P3)
- [ ] Compute daily streak from `events`
- [ ] Display on dashboard; increment on completion; milestone toasts

## 7) Offer unlocks (P3)
- [ ] Eligibility: by `unlock_day` or `unlock_percent`
- [ ] Display CTA when unlocked; log `offer_unlocked` / `offer_redeemed`

## 8) Testing & DX (P2/P3)
- [ ] Lightweight unit tests for libs (streaks, unlocks)
- [ ] Lint/type checks in CI

---
Meta
- Commit after each completed step as a small, reviewable change.
