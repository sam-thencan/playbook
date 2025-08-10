## Lesson Markdown Import – Authoring Guide

This repo supports a simple Markdown subset that maps 1:1 to our lesson blocks. Follow these rules so content imports cleanly.

## Supported → Block mapping
- `## Heading` → heading level 2 (section)
- `### Subheading` → heading level 3 (sub-section)
- `- List item` (one per line, contiguous) → list block
- Any other non-empty line → paragraph block (one paragraph per line)
- Blank line → separates blocks (flushes lists/paragraphs)
 - A bare YouTube or Loom URL on its own line → video block (auto-detected)

## Not supported (imported as plain paragraphs or ignored)
- H1 `#` headings
- Links/formatting (bold/italic), tables
- Images `![]()` and code fences

## Authoring rules
1. Start sections with `##`, sub-sections with `###`. Do not use `#`.
2. Use one logical sentence/paragraph per line. Leave a blank line between blocks.
3. Lists: prefix each item with `- `; keep items together with no blank lines.
4. If you must include a URL, place the raw URL on its own line; we’ll curate into resources later.
5. Keep headings concise; keep paragraphs clear and short.

## Recommended shape

What You’ll Do Today
Short intro paragraph describing today’s outcome.

Steps
- Do this first
- Then do this
- Finish by doing this

Tips
- Two to three short, actionable tips

Local SEO Foundations
Today you’ll set up the basics that everything else relies on.

Steps
- Claim your Google Business Profile
- Add appropriate business categories
- Verify your phone number and website

Tips
- Use a local phone number (not a call center)

## Notes for AI agents
- Output ONLY the supported subset above—no frontmatter/HTML.
- Keep lines under ~120 chars when possible.
- YouTube or Loom share links on their own line will become video blocks automatically. If you prefer, provide the embed-ready URL.