# Claude Code Prompts. Entity resoLOUtion

Status. Site is live at www.entityresoloution.com. Steps 1 through 8 done. All docs updated June 1 2026.

Read with build-plan.md and CLAUDE.md.

---

## Shared rules (baked into every prompt below)

- Plan before you touch anything. Show the plan and wait for my go.
- Write tests first, implement the minimum, verify nothing regressed.
- Document while context is fresh. Review as an attacker before commit.
- Reference tokens from CLAUDE.md, never raw hex. One accent, signal.
- Active voice, simple words, no dashes.
- ESP stays an unpublished draft until Lou confirms written permission.
- All PDL data stays fabricated and labeled. Nothing sensitive ships.
- npm install always needs --force on this machine.
- Never pipe env var values through PowerShell — use the cmd stdin redirect method in SESSION-HANDOFF.md Gotchas.

---

## Steps 1 through 8 (done)

All complete. Site is live. See SESSION-HANDOFF.md for full detail.

---

## Resume prompt (use this to cold-start a new session)

```
You are resuming the Entity resoLOUtion personal site build in a fresh
session with no prior chat history. The working folder is
007 - TrussHomeCo / 002 - ClaudeCode / personal-site.

Read these files in order and treat them as the source of truth:
- SESSION-HANDOFF.md   cold start brief, read this first
- CLAUDE.md            brand tokens, stack, folder conventions, build rules
- build-plan.md        the build sequence and definition of done
- prompts.md           this file, copy-paste prompts per step

Then scan app, components, content, lib, and app/api so your understanding
matches what is on disk.

Confirm the ui-ux-pro-max and 21st.dev connectors are available before any
UI work. If either is missing, stop and tell me.

State of play. Steps 1 through 8 complete. Site is live at
www.entityresoloution.com. GitHub at trusshome/personal-site (private).
Vercel project personal-site under truss-home-s-projects.

Current live page: hero only. All other routes return 404.
Hero has: WebGL shader, wordmark, four dock buttons (Projects, Data, Book,
Find Me). Projects and Data open CircularGallery panels with placeholder
cards. Book opens the glass booking calendar (Cal.com v2, fully working on
production). Find Me links to LinkedIn.

Cal.com API key is stored in .env.local locally and in Vercel production.
Do NOT re-add it via PowerShell pipe — see SESSION-HANDOFF.md Gotchas.

Do not start work yet. Confirm you have read the handoff and the docs,
give me a short summary of the current state in your own words, and state
what the next step is. Then wait for my go.
```

---

## Step 9. Add real project content to gallery

```
Continue the Entity resoLOUtion build. Site is live at
www.entityresoloution.com. Re-read CLAUDE.md and SESSION-HANDOFF.md.

Rules: plan first and wait for my go. Active voice, no dashes.

The Projects panel on the hero (app/(site)/page.tsx) shows a CircularGallery
with placeholder cards in the galleryItems array. Replace the placeholder
content with real project data:

For each card: real title, subtitle (client · year), label (role), a real
photo URL (screenshot, project image, or a descriptive Unsplash photo), and
href pointing to the project page or external URL.

Do not link to /work/[slug] unless that page has been restored from
notFound(). Use an external URL or omit href if no destination exists yet.

Show me the planned card data before touching any file. Wait for my go.
```

---

## Step 10. Blog and data use cases

```
Continue the Entity resoLOUtion build. Site is live. Re-read CLAUDE.md
and SESSION-HANDOFF.md.

Rules: plan first and wait for my go. Active voice, no dashes.

The Data panel on the hero shows 6 PDL use case cards in dataItems. Each
card needs an href pointing to a blog post at /blog/[slug].

Do this in order:
1. Scaffold app/(site)/blog/[slug]/page.tsx with generateStaticParams and
   a content source in content/blog.ts (same pattern as content/work.ts).
2. Add metadata, canonical URL, and sitemap entry for blog posts.
3. Add href to each dataItem in app/(site)/page.tsx pointing to the correct
   slug once posts exist.
4. Make sure the blog index (if any) returns notFound() until there are
   enough posts to publish.

All PDL data in posts stays fabricated and labeled. No real customer or
fan data. Show me the plan and wait for my go.
```

---

## Step 11. Restore about and work pages

```
Continue the Entity resoLOUtion build. Site is live. Re-read CLAUDE.md
and SESSION-HANDOFF.md.

Rules: plan first and wait for my go. Active voice, no dashes.

/about and /work currently return notFound(). Restore them:
1. Retrieve the previous page implementations from git history.
2. Remove the notFound() guard from each.
3. Re-add canonical, description, and OG metadata.
4. Update the sitemap to include / and /about and /work.
5. Restore the work index FocusRail with real case studies only.

ESP case study (/work/esp-development): only publish if Lou confirms
written permission in this session. Until then keep status: draft.

Show me the plan and wait for my go.
```
