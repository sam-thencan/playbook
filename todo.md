# 30-Day Local SEO Playbook – TODO

Priority order per request:
1) Admin
2) Tighten UI
3-N) Content pipeline and remaining features

## 1) Admin (P1)
- [ ] Gate `/admin/*` by `profiles.role === 'admin'`
  - [ ] Middleware using SSR Supabase; redirect non-admins to `/login`
  - [ ] Server-side re-check in pages to avoid client bypass
- [ ] Lessons CRUD (wired to Supabase)
  - [ ] List with search, sort (by `day`, `sort_order`, `published`)
  - [ ] Create/Edit form with validation (zod)
  - [ ] Fields: title, slug, day (optional), is_intro, is_bonus, estimated_minutes, resources[], body (JSON blocks), sort_order, published
  - [ ] Publish toggle, delete, optimistic UI
- [ ] Offers CRUD (wired to Supabase)
  - [ ] List with filters (active, type)
  - [ ] Create/Edit fields: title, description, type, unlock_day, unlock_percent, sort_order, cta{label,url}, active
  - [ ] Publish toggle, delete
- [ ] RLS sanity checks for admin write (already in schema)
- [ ] Basic toasts/feedback and empty states
- [ ] Optional: event log view for admin (audit of create/update/delete)

## 2) Tighten UI (P1)
- [ ] Typography
  - [ ] Increase heading weights (h1/h2 → `font-semibold`/`font-bold`); ensure readable contrast
  - [ ] Tune `leading`/`tracking` for display headings
- [ ] Components
  - [ ] Table text contrast on white cards (current text too light)
  - [ ] Card spacing/padding defaults; consistent shadow and radius (10–12px)
  - [ ] Button variants: primary/secondary/ghost sizing + states; accessible focus rings
  - [ ] ProgressRing stroke width/contrast; label placement
  - [ ] Pill contrast variants
- [ ] Layout
  - [ ] Container widths (`max-w-3xl/5xl`), responsive gaps, mobile checks
  - [ ] Dark mode surfaces/tokens; accent `#FF6A00` audit
- [ ] Accessibility
  - [ ] Semantic headings order, skip-links, focus outlines, keyboard nav

## 3) Content system (P2)
- [ ] Support mixed lesson content types
  - [ ] Blocks: paragraph, heading, list, quote, callout, image{url,alt,caption}, video{provider|url,caption}
  - [ ] Define JSON block schema (versioned) for `lessons.body`
  - [ ] Renderer for all block types
- [ ] Admin lesson editor UI
  - [ ] Simple block editor (add/reorder/delete)
  - [ ] Resource links editor
  - [ ] Preview pane
- [ ] PDF import improvements
  - [ ] Map detected sections to blocks; attach images where present

## 4) Media handling (P2)
- [ ] Supabase Storage bucket `lessons` (public read)
  - [ ] RLS: only admins can upload/write
- [ ] Admin upload component (drag & drop) with progress
- [ ] Image optimization (Next `<Image>`), aspect-ratio helpers

## 5) Lesson page rendering (P2)
- [ ] Render block types with responsive, accessible markup
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
