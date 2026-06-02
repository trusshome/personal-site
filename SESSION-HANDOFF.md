# Session Handoff. Entity resoLOUtion

Owner. Luciano Tarabocchia II (Lou)
Last updated. Monday, June 2 2026
Read with. CLAUDE.md for brand and conventions, build-plan.md for the step sequence, prompts.md for the copy paste prompts, site-standup.md for the running log.

This file lets a brand new session resume the build cold, with no chat history, and go straight to the next step. It matches what is on disk, not memory.

---

## Project

What it is. A personal showcase site for Lou that positions him as a builder who resolves messy problems into one clear, shipped answer, and turns LinkedIn traffic into booked discovery calls.

The single conversion. Book a call.

Domain. www.entityresoloution.com. Live. SSL active on www and apex.

Booking. Cal.com, https://cal.com/entity-resoloution. Event type slug is 30min. The spelling is deliberate, resoloution not resolution.

Brand idea. Direction A, Resolution. Scattered things resolving into one clear answer. Clean, technical, calm. One electric accent does the talking. The wordmark lights LOU so Lou's name is the visual hook.

---

## Stack and structure

Stack. Next.js 16.2.6 App Router, React 19.2.4, TypeScript, Tailwind v4 via @tailwindcss/postcss, motion for animation, three.js for the hero WebGL shader, date-fns for the calendar, lucide-react for icons, Vercel Analytics. Deployed on Vercel.

Git. github.com/trusshome/personal-site (private). Branch main. Author hello@trusshomeco.com / trusshome.

Vercel. Project personal-site under truss-home-s-projects team. Deployed to production. CAL_COM_API_KEY set in Vercel environment (production).

Tokens. Live as CSS variables in app/globals.css inside the Tailwind v4 @theme block. Reference tokens by name in components, never raw hex.

Route group. The (site) layout holds only the main wrapper. Home route sits inside app/(site). Book sits at app/book/page.tsx. Home page is full-bleed dark hero. No Nav or Footer mounted anywhere.

Pages live now.

- / (home) — the only public page. Everything else returns notFound().
- /about, /work, /work/[slug], /book — all return notFound(). Files kept in place for future use.

On disk now.

```
app/
  layout.tsx              root, html plus body plus fonts plus metadata plus Analytics
  globals.css             Direction A tokens, base, animations, reduced motion, scrollbar hide
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
  HeroButtonRow.tsx       three-button dock row — Data, Book, Find Me (single flex row)
  GlassBookingCalendar.tsx  three-step on-page booking: date > slots > form > success
  ShaderAnimation.tsx     three.js WebGL line-field for the hero background
  ProjectCard.tsx         kept on disk, not used on any live page
  ResolveAnim.tsx         original dots animation, not used, safe to delete
  SiteHeader.tsx          not used
  ui/
    circular-gallery.tsx  3D rotating card carousel used in hero Data panel
    focus-rail.tsx        3D swipeable rail used on /work (currently 404)
content/      work.ts — typed case studies. Truss Home and ESP published, Jets removed.
lib/          site.ts (config, cal link, calEvent, linkedin), analytics.ts, utils.ts (cn helper)
```

---

## Hero page panel system

The hero (app/(site)/page.tsx) is a client component managing a panel state.

```
type Panel = 'none' | 'book' | 'data'
```

Three dock buttons: Data, Book, Find Me. All on one flex row on all screen sizes.

- Data — opens CircularGallery with 6 PDL use case cards (no hrefs yet)
- Book — opens GlassBookingCalendar
- Find Me — external link to site.linkedin

Opening any panel closes the current one. AnimatePresence with fast 150ms exit + PANEL_ANIM handles the transition. The outer wrapper is a plain div (not motion.div layout) — layout animations on this div previously broke iOS Liquid Glass compositing via FLIP scaleY transforms.

---

## CircularGallery

components/ui/circular-gallery.tsx

A 3D rotating card carousel. Cards rotate on a ring with perspective 2000px. Interaction: drag to spin (mouse), wheel to spin (desktop), touch swipe to spin (mobile — non-passive touchmove listener, stopPropagation to bypass document scroll lock, preventDefault to stop native pan). Auto-rotate when idle, resumes with momentum deceleration after swipe (MOMENTUM_LERP=0.06).

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

Props: radius, autoRotateSpeed, cardWidth, cardHeight (all responsive — see page.tsx isMobile state).

Mobile: cardWidth=130, cardHeight=180, radius=180, panel h-[260px].
Desktop: cardWidth=260, cardHeight=360, radius=360, panel sm:h-[500px].

Data cards: 6 PDL use case cards (Fan Enrichment, Lead Intelligence, Talent Mapping, Market Sizing, ICP Builder, Network Graph). No hrefs yet. Will link to blog posts.

---

## Cal.com API — v2

Both routes use Cal.com v2 (v1 is decommissioned).

slots/route.ts:
- GET /v2/event-types → find slug 30min → cache eventTypeId
- GET /v2/slots → response data.data is the date map directly
- Returns { slots: string[], eventTypeId: number }

book/route.ts:
- POST /v2/bookings with cal-api-version: 2026-02-25
- Body: { eventTypeId, start, attendee: { name, email, timeZone }, bookingFieldsResponses: { notes } }
- Returns { uid, startTime }

GlassBookingCalendar expects { uid, startTime } from /api/cal/book.

---

## Brand

Tokens. ink #14171C, paper #F7F5F0, signal #2F6BFF, signal-dark #1F54D6, signal-tint #E7EEFF, slate #5A626E, hairline #E3E0D8, cyan-motion #11C5D4.

One accent rule. signal is the only CTA color. The glow-pill buttons use box-shadow with signal/signal-dark/cyan-motion RGBA values — NOT filter:blur (breaks iOS Safari overflow clipping).

Wordmark rule. entity reso[LOU]tion — entity, reso, tion in ink (or paper on dark). LOU in signal, same weight.

Hero. Full-bleed dark, WebGL shader background. No top nav on any page currently.

---

## What shipped in this session (June 1–2 2026)

Desktop scrollbar hidden. scrollbar-width:none + ::-webkit-scrollbar{display:none} on html. Keeps overflow-y:scroll for Liquid Glass runway without showing the track.

CircularGallery responsive. cardWidth/cardHeight props with mobile/desktop values in page.tsx. Touch swipe fixed (non-passive listener, stopPropagation). Direction corrected (prev+dx). Momentum deceleration into auto-rotate (EMA velocity → lerp to autoRotateSpeed).

Button glow iOS fix. Replaced filter:blur child with box-shadow on the button element. Responsive shadow intensity (smaller on mobile). iOS now clips glow to pill shape correctly.

Booking calendar Liquid Glass preservation. Six-pass fix:
1. Calendar wrapper with overflow-y:auto + overscrollBehavior:contain + maxHeight.
2. Section overflow-y:clip — never a scroll container.
3. window scroll listener snaps scrollY to 62px offset whenever anything moves it.
4. Left panel hidden on mobile for form and success steps.
5. Left panel hidden on mobile for slots step too (eliminates calendar expansion on date tap).
6. Removed motion.div layout from panel wrapper (FLIP animation was breaking GPU compositing).
7. visualViewport resize listener calculates exact keyboard overlap and scrolls the calendar wrapper by that amount — never touches document scroll.

Input zoom fix. inputCls text-sm → text-base (16px) to prevent iOS auto-zoom.

Button layout. Three buttons (Data, Book, Find Me), single flex row on all screen sizes, gap-2 mobile / gap-8 desktop. Projects button and panel removed. mt-10 → mt-4 (wordmark-to-buttons gap).

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

## iOS 26 Safari Liquid Glass — full technical record

Source: https://1ar.io/updates/safari-26-liquid-glass-web

Root cause. iOS 26 samples root CSS background-color behind its chrome at scrollY 0, ignores theme-color, and composites ONLY normal-flow content — not fixed or absolute layers — and only when scrollY > 0.

What is in place:

globals.css:
- :root vars: --safari-chrome-bg:#14171C, --safari-top-bleed:62px, --safari-bottom-bleed:136px, --safari-scroll-offset:62px.
- html: min-height:100%; overflow-y:scroll; overscroll-behavior:none; background-color:var(--safari-chrome-bg); scrollbar-width:none.
- html::-webkit-scrollbar { display:none }.
- body: min-height:calc(100dvh + 62px); background-color:var(--safari-chrome-bg).

app/layout.tsx: html/body have no inline bg styles. viewport has viewport-fit:cover and colorScheme:dark. theme-color intentionally NOT set.

app/(site)/page.tsx hero structure:
- Outer wrapper: position:relative; display:flow-root.
- MEDIA STAGE: in normal flow. height:calc(100lvh+top-bleed+bottom-bleed); margin-top:calc(-1*top-bleed). Holds ShaderAnimation.
- CONTENT OVERLAY: position:fixed; inset:0; overflow-y:clip (NOT auto — clip means it is never a scroll container). justify-center. safe-area padding.

Scroll lock (page.tsx useEffect):
- On load: window.scrollTo(62, 0) on mobile, 0 on desktop.
- window scroll listener: if |scrollY - offset| > 2px, snap back instantly. Handles both overscroll chain and iOS keyboard scroll.
- touchmove listener with passive:false: preventDefault unless touch is inside an element with overflowY auto/scroll AND scrollHeight > clientHeight.
- visualViewport resize listener: on keyboard appear, calculate overlap between focused input bottom and visual viewport bottom, scroll the nearest overflow container (calendar wrapper) by that amount. Never touches document.

Calendar wrapper in book panel:
- overflow-y:auto; overscrollBehavior:contain; maxHeight:calc(100dvh-safe-area-insets-225px).
- 225px accounts for the section padding + wordmark + mt-4 + buttons (2×40px rows? No — now single row 40px) + mt-6. Recalculate if layout changes significantly.

Mobile booking step-replacement:
- GlassBookingCalendar hides the left panel (date picker) on mobile whenever selectedDate !== null.
- Each step (slots, form, success) is a full-width replacement view with a back button.
- This prevents the calendar from expanding in height when a date is tapped — the height stays bounded by the right panel only, which fits within the wrapper max-height.

ShaderAnimation.tsx: canvas uses setSize(w,h,false) plus CSS width/height:100%. ResizeObserver on container.

Do NOT:
- Set theme-color meta tag.
- Make the shader fixed or absolute.
- Set body background to paper (light). Must be ink.
- Use motion.div layout on the panel wrapper div in page.tsx.

---

## Current state

www.entityresoloution.com is live. The hero page shows the full-bleed WebGL shader bleeding behind iOS 26 Safari bars, entity resoLOUtion wordmark, three glow-pill dock buttons (Data, Book, Find Me) on one row. Data panel opens a circular gallery with 6 PDL use case cards. Book panel opens the glass booking calendar — full mobile booking flow verified working. All steps (date picker, slots, form, success) maintain Liquid Glass compositing throughout. Find Me links to LinkedIn. All other pages return 404. GitHub repo is clean.

---

## Next steps

1. Replace placeholder Data gallery cards with real hrefs when blog posts exist.
2. Build blog at /blog/[slug] and wire dataItems hrefs.
3. Confirm ESP written permission and restore work page with the case study.
4. Verify book_a_call analytics event is recording in Vercel Analytics.
5. Custom home-screen app icon (currently iOS uses a page screenshot).

---

## How to resume

1. Read CLAUDE.md, build-plan.md, this file, and prompts.md in that order.
2. Confirm the live site is up at www.entityresoloution.com before making changes.
3. Use npm install --force for any new packages.
4. Do not pipe env vars through PowerShell — use the cmd stdin redirect method documented in Gotchas.
5. Honor the shared rules. Plan first and wait for go, implement the minimum, verify nothing regressed, document while context is fresh.
