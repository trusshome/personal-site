# Session Handoff. Entity resoLOUtion

Owner. Luciano Tarabocchia II (Lou)
Last updated. Monday, June 2 2026
Read with. CLAUDE.md for brand and conventions, build-plan.md for the step sequence, prompts.md for the copy paste prompts, site-standup.md for the running log.

This file lets a brand new session resume the build cold, with no chat history, and go straight to the next step. It matches what is on disk, not memory.

---

## Project

What it is. A personal showcase site for Lou that positions him as a builder who resolves messy problems into one clear, shipped answer, and turns LinkedIn traffic into booked discovery calls.

The single conversion. Book a call.

Domain. www.entityresoloution.com. The name Lou sits inside resoLOUtion, the pun is the brand. Bought on Namecheap, DNS not pointed anywhere yet.

Booking. Cal.com, https://cal.com/entity-resoloution. The spelling is deliberate, resoloution not resolution. The event type slug is 30min.

Brand idea. Direction A, Resolution. Scattered things resolving into one clear answer. Clean, technical, calm. One electric accent does the talking. The wordmark lights LOU so Lou's name is the visual hook.

---

## Stack and structure

Stack. Next.js 16.2.6 App Router, React 19.2.4, TypeScript, Tailwind v4 via @tailwindcss/postcss, motion for animation, three.js for the hero WebGL shader, date-fns for the calendar, lucide-react for icons, Vercel Analytics. Deploy target is Vercel.

Tokens. Live as CSS variables in app/globals.css inside the Tailwind v4 @theme block. Reference tokens by name in components, never raw hex. The one documented exception is app/opengraph-image.tsx and components/ShaderAnimation.tsx, both use hex that mirrors the tokens because they run without the DOM.

Route group. Site chrome was removed. The (site) layout now holds only the main wrapper, no Nav or Footer. The home, about, and work routes sit inside app/(site). The book page sits at app/book/page.tsx. The home page is a full-bleed dark hero with no top nav.

On disk now.

```
app/
  layout.tsx              root, html plus body plus fonts plus metadata plus Analytics
  globals.css             Direction A tokens, base, animations, reduced motion
  opengraph-image.tsx     dynamic 1200 by 630 OG image
  sitemap.ts              reads publishedStudies()
  robots.ts               allows all, points to the sitemap
  (site)/
    layout.tsx            main wrapper only, no Nav or Footer
    page.tsx              hero with WebGL shader, glass booking calendar
    about/page.tsx
    work/page.tsx         the showcase index
    work/[slug]/page.tsx  one case study per slug
  book/page.tsx           funnel endpoint, no chrome
  api/
    cal/
      slots/route.ts      proxies Cal.com availability to the client
      book/route.ts       proxies Cal.com booking creation to the client
components/
  Wordmark.tsx
  Nav.tsx                 exists but not used in layout (kept for future use)
  Footer.tsx              exists but not used in layout (kept for future use)
  CTAButton.tsx           delegates to GlowLink, keeps analytics + cal link
  GlowLink.tsx            shared glow-pill visual for all CTA buttons
  HeroButtonRow.tsx       dock magnification row with Projects, Book, Find Me
  GlassBookingCalendar.tsx three-step on-page booking: date > time slots > form > success
  ShaderAnimation.tsx     three.js WebGL line-field for the hero background
  ProjectCard.tsx
  ResolveAnim.tsx         original dots animation, now unused, safe to delete
content/      work.ts, the typed case study source
lib/          site.ts (config plus cal link plus calEvent plus linkedin), analytics.ts
```

---

## Brand

Tokens. ink #14171C, paper #F7F5F0, signal #2F6BFF, signal-dark #1F54D6, signal-tint #E7EEFF, slate #5A626E, hairline #E3E0D8, cyan-motion #11C5D4.

One accent rule. signal is the only call to action color. cyan-motion exists in the hero shader and in the glow pill gradient.

Note on glow pills. The CTA buttons across the site use a gradient glow from signal through signal-dark to cyan-motion. This extends cyan-motion beyond the hero animation, which was a deliberate product decision. CLAUDE.md still documents the original rule; update it to reflect the button glow if you want the spec and the build to agree.

Wordmark rule. Render the name as one unbroken word, entity resoLOUtion, with entity, reso, and tion in ink and LOU in signal at the same weight.

Hero. Full-bleed dark section using the three.js WebGL shader. Background is ink with lines blending cyan-motion into signal. Headline uses Wordmark dark prop (paper letters, LOU stays signal). No top nav on the home page.

---

## What shipped, step by step

Steps 1 through 7. Scaffold, brand primitives, hero, work showcase, about, book, analytics and SEO. All done and verified before this session. See previous SESSION-HANDOFF entries for detail.

Step 7 verification. npm run build exits 0. All routes return correct status. ESP 404. Sitemap correct. OG image 1200 by 630.

### What changed this session (June 2 2026)

Hero animation reworked then replaced.
- components/ResolveAnim.tsx was debugged and reworked extensively. The scatter was made to fill the full hero using a circular distribution. A rotating spiral collapse was added using a rotation spring on the container. Cursor follow replaced click-and-drag.
- Then replaced entirely by components/ShaderAnimation.tsx, a three.js WebGL line-field. The shader runs in an ink base with lines blending cyan-motion into signal. Honors reduced motion by rendering one static frame. Cleans up on unmount.

Nav and footer removed.
- app/(site)/layout.tsx stripped to a bare main wrapper. Nav.tsx and Footer.tsx files still exist but are not mounted anywhere.
- The home page lost its top nav. About and work pages also have no nav now.
- The work showcase teaser section below the hero was removed.

CTA button restyled.
- components/GlowLink.tsx created as the shared visual. Renders either a next/link or an external anchor. The glow is a gradient from signal via signal-dark to cyan-motion, 50 percent opacity, blurs on hover to 90 percent.
- components/CTAButton.tsx refactored to delegate to GlowLink. Keeps the cal link and the book_a_call analytics event.
- All buttons now use an ArrowUpRight icon from lucide-react.
- Default label changed from Book a call to Book.

Hero button row.
- components/HeroButtonRow.tsx. Three glow-pill buttons in a dock row with mouse-proximity magnification (motion spring, scale 1 to 1.08). Buttons are Projects (to /work), Book (toggles glass calendar), Find Me (to LinkedIn).
- LinkedIn URL stored in lib/site.ts as site.linkedin. URL is https://www.linkedin.com/in/entity-resoloution/.

Glass booking calendar.
- components/GlassBookingCalendar.tsx. Three-step horizontal layout inside one persistent glass card.
  - Left column: monthly grid date picker with past dates disabled and today dot in signal.
  - Right column, step 1: time slot grid fetched live from /api/cal/slots. Loading spinner, error state, retry.
  - Right column, step 2: booking form with name, email, notes. Glow confirm button. Validation.
  - Right column, step 3: animated signal checkmark, confirmed date and time, email confirmation note.
- The glass card stays mounted through all steps so the blur and border never disappear.

Cal.com API routes.
- app/api/cal/slots/route.ts. Fetches the 30min event type ID from Cal.com (cached per server process), then fetches available slots for the requested date. Proxied server-side so the API key never reaches the browser.
- app/api/cal/book/route.ts. Creates a Cal.com booking from the form submission. Handles the 30-minute end time automatically.
- Both read CAL_COM_API_KEY from process.env. Neither file has the key hardcoded.

Cal.com MCP.
- claude mcp add --transport http cal https://mcp.cal.com/mcp --scope user was run.
- The server is registered in Claude Code but needs OAuth to connect. The OAuth route is https://cal.com/integrate.
- The REST API key (cal_live_...) was accidentally shared in chat and must be treated as compromised. Lou should revoke it at cal.com/settings/developer/api-keys and generate a new one.
- New key must be added to personal-site/.env.local as CAL_COM_API_KEY=new_key.

hydration warning fixed.
- app/layout.tsx got suppressHydrationWarning on the html element. A browser extension was injecting data-theme and CSS vars before hydration.

New dependencies.
- three and @types/three for the WebGL shader.
- lucide-react for icons.
- date-fns for the calendar date math.
- All installed with npm install --force due to a platform binary lock in the lockfile.

---

## Guardrails that must stay true

ESP is a draft and must 404. Enforced in app/(site)/work/[slug]/page.tsx via dynamicParams false and notFound.

ESP copy must never serialize to the client. The work index uses publishedStudies() which filters ESP server-side.

PDL data stays fabricated and labeled. The Jets / PDL study carries sampleData true in content/work.ts. ProjectCard shows a Sample data badge.

One Book action per page. Every action uses CTAButton which reads site.cal. The home page now has a glass calendar as the booking surface, not a link.

resoLOUtion spelling never corrected. site.cal and site.calEvent and site.url and site.linkedin all live in lib/site.ts. Nothing retyped anywhere.

Reduced motion honored. ShaderAnimation renders one static frame. globals.css disables fade animations.

---

## Gotchas

personal-site has no git repo. The folder is untracked inside the home repo at C:\Users\ltara. A git init plan was drawn up but never executed. The plan: init inside personal-site, set main branch, write .gitignore, secret scan, one initial commit, create private GitHub repo as trusshome account using gh, push. Run this before Step 8.

npm install needs --force. The lockfile has a platform-specific binary that blocks normal installs on this machine. Always use npm install --force for new packages.

Orphaned dev server. A dev server for this project runs on port 3000 (PID noted as 12068 in a prior session). Check before starting a new one. Next auto-bumps to port 3001 if 3000 is taken.

Cal.com API key is compromised. The key cal_live_9f6cedd78486a164751772aa7b43be19 was shared in plaintext in the session chat. Lou must revoke it at cal.com/settings/developer/api-keys before doing anything else.

.env.local does not exist. Create it with the new Cal.com API key before testing the booking calendar or running npm run build in production mode.

---

## Current state

Home page is a full-bleed WebGL shader hero with the wordmark, three glow-pill dock buttons (Projects, Book, Find Me), and a glass booking calendar that opens when Book is clicked. The calendar picks a date, fetches live Cal.com slots, and submits a booking through Next.js API routes. No nav or footer on any page.

npm run build exits 0. The build cannot verify the Cal.com API calls because CAL_COM_API_KEY is not set in the environment, but the routes compile cleanly.

No git repo for personal-site. No .env.local. Both are blockers for Step 8.

---

## Next step

Do git setup before Step 8.

1. Revoke the compromised Cal.com API key and generate a new one.
2. Add the new key to personal-site/.env.local.
3. Init the personal-site git repo: git init inside personal-site, set branch main, write .gitignore (node_modules, .next, .vercel, out, build, .env and .env.*, *.log, .DS_Store), secret scan, initial commit with message Initial commit, Entity resoLOUtion site through Step 7 plus hero redesign, create private GitHub repo personal-site under trusshome using gh, push.
4. Run Step 8 from prompts.md: deploy to Vercel, point www.entityresoloution.com, confirm SSL, confirm book_a_call event records in the deployed environment.

---

## How to resume

1. Read CLAUDE.md, build-plan.md, this file, and prompts.md, in that order.
2. Confirm the ui-ux-pro-max and 21st.dev connectors are on before any UI work.
3. Check that the compromised API key has been revoked and .env.local has a fresh key.
4. Run git setup (see above), then Step 8 from prompts.md.
5. Honor the shared rules. Plan first and wait for go, tests first, implement the minimum, verify, document, review as an attacker. Reference tokens never raw hex, one accent signal. Active voice, no dashes.
