# Session Handoff. Entity resoLOUtion

Owner. Luciano Tarabocchia II (Lou)
Last updated. Sunday, June 1 2026
Read with. CLAUDE.md for brand and conventions, build-plan.md for the step sequence, prompts.md for the copy paste prompts, site-standup.md for the running log.

This file lets a brand new session resume the build cold, with no chat history, and go straight to the next step. It matches what is on disk, not memory.

---

## Project

What it is. A personal showcase site for Lou that positions him as a builder who resolves messy problems into one clear, shipped answer, and turns LinkedIn traffic into booked discovery calls.

The single conversion. Book a call.

Domain. www.entityresoloution.com. Live. SSL active on www, apex still propagating (check entityresoloution.com without www if not yet).

Booking. Cal.com, https://cal.com/entity-resoloution. Event type slug is 30min. The spelling is deliberate, resoloution not resolution.

Brand idea. Direction A, Resolution. Scattered things resolving into one clear answer. Clean, technical, calm. One electric accent does the talking. The wordmark lights LOU so Lou's name is the visual hook.

---

## Stack and structure

Stack. Next.js 16.2.6 App Router, React 19.2.4, TypeScript, Tailwind v4 via @tailwindcss/postcss, motion for animation, three.js for the hero WebGL shader, date-fns for the calendar, lucide-react for icons, Vercel Analytics. Deployed on Vercel.

Git. github.com/trusshome/personal-site (private). Branch main. Author hello@trusshomeco.com / trusshome.

Vercel. Project personal-site under truss-home-s-projects team. Deployed to production. CAL_COM_API_KEY set in Vercel environment (production). The BOM issue is fixed — the key was re-added using raw ASCII bytes via cmd stdin redirect.

Tokens. Live as CSS variables in app/globals.css inside the Tailwind v4 @theme block. Reference tokens by name in components, never raw hex.

Route group. The (site) layout holds only the main wrapper. Home, about, and work routes sit inside app/(site). Book sits at app/book/page.tsx. Home page is full-bleed dark hero. No Nav or Footer mounted anywhere.

Pages live now.

- / (home) — the only public page. Everything else returns notFound().
- /about, /work, /work/[slug], /book — all return notFound(). Files kept in place for future use.

On disk now.

```
app/
  layout.tsx              root, html plus body plus fonts plus metadata plus Analytics
  globals.css             Direction A tokens, base, animations, reduced motion
  opengraph-image.tsx     dynamic 1200 by 630 OG image
  sitemap.ts              returns only / (all other pages are 404)
  robots.ts               allows all, points to sitemap
  (site)/
    layout.tsx            main wrapper only, no Nav or Footer
    page.tsx              hero — client component, manages panel state
    about/page.tsx        notFound() placeholder
    work/page.tsx         notFound() placeholder
    work/[slug]/page.tsx  notFound() placeholder, generateStaticParams returns []
  book/page.tsx           notFound() placeholder
  api/
    cal/
      slots/route.ts      proxies Cal.com v2 availability (GET /v2/slots)
      book/route.ts       proxies Cal.com v2 booking (POST /v2/bookings)
components/
  Wordmark.tsx
  Nav.tsx                 exists but not mounted
  Footer.tsx              exists but not mounted
  CTAButton.tsx           delegates to GlowLink, fires book_a_call analytics
  GlowLink.tsx            shared glow-pill visual for all CTA buttons
  HeroButtonRow.tsx       dock magnification row — Projects, Data, Book, Find Me
  GlassBookingCalendar.tsx  three-step on-page booking: date > slots > form > success
  ShaderAnimation.tsx     three.js WebGL line-field for the hero background
  ProjectCard.tsx         kept on disk, not used on any live page
  ResolveAnim.tsx         original dots animation, not used, safe to delete
  SiteHeader.tsx          not used
  ui/
    circular-gallery.tsx  3D rotating card carousel used in hero panels
    focus-rail.tsx        3D swipeable rail used on /work (currently 404)
content/      work.ts — typed case studies. Truss Home and ESP published, Jets removed.
lib/          site.ts (config, cal link, calEvent, linkedin), analytics.ts, utils.ts (cn helper)
```

---

## Hero page panel system

The hero (app/(site)/page.tsx) is a client component managing a panel state.

```
type Panel = 'none' | 'book' | 'projects' | 'data'
```

Four dock buttons: Projects, Data, Book, Find Me.

- Projects — opens CircularGallery with 5 placeholder project cards (no hrefs yet)
- Data — opens CircularGallery with 6 PDL use case cards (no hrefs yet)
- Book — opens GlassBookingCalendar
- Find Me — external link to site.linkedin

Opening any panel closes the current one. AnimatePresence with fast 150ms exit + motion.div layout spring handles the height transition without the snap/pause that existed before.

---

## CircularGallery

components/ui/circular-gallery.tsx

A 3D rotating card carousel. Cards rotate on a ring with perspective 2000px. Interaction: drag to spin, wheel to spin, auto-rotate when idle (pauses on interaction, resumes after 800ms). Clicking a card navigates to its href (if set).

GalleryItem type:
```ts
{
  title: string
  subtitle: string
  label?: string
  photo: { url: string; alt: string; pos?: string }
  href?: string
}
```

Used in page.tsx with radius=360, autoRotateSpeed=0.04.

Project cards: 5 placeholder cards in galleryItems. All photo URLs are Unsplash. No hrefs set yet.
Data cards: 6 PDL use case cards in dataItems (Fan Enrichment, Lead Intelligence, Talent Mapping, Market Sizing, ICP Builder, Network Graph). No hrefs set yet.

When Lou is ready to add real projects, update galleryItems in page.tsx with real title, subtitle, photo.url (screenshot or real image), and href pointing to the case study or blog post.

When Lou builds the blog, update dataItems hrefs to point to /blog/slug.

---

## Cal.com API — v2

Both routes were migrated from Cal.com API v1 (decommissioned) to v2 in this session.

slots/route.ts:
- GET https://api.cal.com/v2/event-types — header Authorization: Bearer key, cal-api-version: 2024-06-14
- Response: { status, data: [...] } — find slug 30min, cache id
- GET https://api.cal.com/v2/slots — header cal-api-version: 2024-09-04
- Response: { status, data: { "YYYY-MM-DD": [{ start: "..." }] } } — date map directly in data, not nested under slots key
- Returns { slots: string[], eventTypeId: number } to the client

book/route.ts:
- POST https://api.cal.com/v2/bookings — header cal-api-version: 2026-02-25
- Body: { eventTypeId, start, attendee: { name, email, timeZone }, bookingFieldsResponses: { notes } }
- Response: { status, data: { uid, start } } — returns { uid, startTime: booking.start } to client

GlassBookingCalendar sends name, email, notes, timeZone, start, eventTypeId to /api/cal/book and expects { uid, startTime } back. No changes needed to the component.

---

## Brand

Tokens. ink #14171C, paper #F7F5F0, signal #2F6BFF, signal-dark #1F54D6, signal-tint #E7EEFF, slate #5A626E, hairline #E3E0D8, cyan-motion #11C5D4.

One accent rule. signal is the only CTA color. The glow-pill buttons use a gradient from signal through signal-dark to cyan-motion — this was a deliberate product decision that extends cyan-motion into the button UI. CLAUDE.md still documents the original rule.

Wordmark rule. entity reso[LOU]tion — entity, reso, tion in ink (or paper on dark). LOU in signal, same weight.

Hero. Full-bleed dark, WebGL shader background. No top nav on any page currently.

---

## What shipped in this session

Cal.com v1 to v2 migration. Both API routes rewritten. Fixed the slot parsing bug (data.data is the date map, not data.data.slots). Smoke tested on production.

Circular gallery. Built components/ui/circular-gallery.tsx — 3D ring carousel with drag, wheel, and auto-rotate. Replaced the FocusRail-based hero panel and the HeroProjectCards component (deleted). Work page still has FocusRail but returns notFound.

Hero panel system. Four buttons (Projects, Data, Book, Find Me). Panel state manages mutual exclusivity. AnimatePresence + motion.div layout smooths open/close transitions — fixed the snap and pause that previously appeared when toggling panels.

Data gallery. Six PDL use case cards added as a separate panel in the hero.

Pre-deploy audit. HeroProjectCards.tsx deleted (unused, type error). focus-rail.tsx transition type fixed. All pages except / return notFound. Sitemap trimmed to / only. .gitignore created.

Git and deploy.
- git init inside personal-site, branch main
- Pushed to github.com/trusshome/personal-site (private)
- All commits authored as hello@trusshomeco.com / trusshome (history rewritten and force-pushed)
- Deployed to Vercel production via vercel --prod
- vercel.json added with framework: nextjs (was needed because the pre-existing Vercel project had no framework set)
- CAL_COM_API_KEY added to Vercel — first two attempts had BOM corruption from PowerShell pipe encoding. Fixed by writing raw ASCII bytes to a temp file and redirecting via cmd stdin.
- Namecheap DNS configured. www.entityresoloution.com is live (200). Apex propagating.
- Production smoke test passed: Cal.com slots API returns real data (11 slots, eventTypeId 5863479).

---

## Gotchas

CAL_COM_API_KEY and PowerShell BOM. If you ever need to re-add this env var to Vercel, do NOT pipe it directly from PowerShell — PS adds a BOM (0xFEFF) which corrupts the Authorization header. Use raw bytes via cmd stdin redirect:
```powershell
$keyBytes = [System.Text.Encoding]::ASCII.GetBytes($key)
[System.IO.File]::WriteAllBytes("$env:TEMP\vkey.txt", $keyBytes)
cmd /c "vercel env add CAL_COM_API_KEY production < %TEMP%\vkey.txt"
Remove-Item "$env:TEMP\vkey.txt" -Force
```

npm install needs --force. The lockfile has a platform-specific binary that blocks normal installs. Always use npm install --force for new packages.

Orphaned dev server. Kill all node before starting a fresh dev server to avoid stale port conflicts.

.env.local is not in git. It is on disk locally but excluded by .gitignore. It contains CAL_COM_API_KEY. The production value is already set in Vercel.

---

## Current state

www.entityresoloution.com is live. The hero page shows the full-bleed WebGL shader, entity resoLOUtion wordmark, four dock buttons, and the correct panel for whichever button is active. Booking calendar fetches real Cal.com slots and completes bookings. All other pages return 404. Sitemap shows only /. GitHub repo is clean and authored correctly.

---

## Next steps

1. Replace placeholder gallery cards with real project photos and titles when ready.
2. Build blog repository and wire dataItems hrefs to /blog/slug.
3. Confirm ESP written permission and publish the case study (change status to published in content/work.ts and restore work page).
4. Verify book_a_call analytics event is recording in Vercel Analytics dashboard.
5. Confirm apex domain (entityresoloution.com without www) once DNS propagates.

---

## How to resume

1. Read CLAUDE.md, build-plan.md, this file, and prompts.md in that order.
2. Confirm the live site is up at www.entityresoloution.com before making changes.
3. Use npm install --force for any new packages.
4. Do not pipe env vars through PowerShell — use the cmd stdin redirect method documented in Gotchas.
5. Honor the shared rules. Plan first and wait for go, tests first, implement the minimum, verify, document.
