# Build Plan. Entity resoLOUtion

Owner. Lou
Last updated. Monday, June 2 2026
Read with. CLAUDE.md for brand and conventions, site-standup.md for current state.

This is the step by step plan to build the site. Follow the order. Each step ends before the next starts.

---

## What we are building

One public page and one conversion. The hero page is the only live route. The book a call button opens the glass booking calendar on the same page. Brand is Direction A, Resolution, defined in CLAUDE.md.

---

## Stack and source of truth

- Next.js 16.2.6 App Router, React 19, TypeScript, Tailwind v4, motion, three.js, date-fns, lucide-react. Mirrors esprealty-web.
- Brand tokens and folder conventions live in CLAUDE.md. Reference tokens, never raw hex.

---

## Steps complete

### Step 1. Scaffold the repo (done)
### Step 2. Brand primitives (done)
### Step 3. Hero (done, then reworked multiple times)
### Step 4. Work showcase (done, currently 404 pending content decisions)
### Step 5. About (done, currently 404 pending content decisions)
### Step 6. Book (done, currently 404 — booking handled by glass calendar on hero)
### Step 7. Analytics and SEO (done)
### Step 8. Deploy and connect the domain (done)

Site is live at www.entityresoloution.com. GitHub repo at trusshome/personal-site. Vercel project personal-site under truss-home-s-projects.

### Step 8.5. Mobile polish (done — June 1–2 2026)

Substantial mobile and iOS 26 work:
- iOS 26 Liquid Glass: shader bleeds behind status bar and bottom toolbar. Full technical record in SESSION-HANDOFF.md.
- Desktop scrollbar hidden (overflow-y:scroll kept for Liquid Glass runway).
- CircularGallery: responsive card sizing, touch swipe (non-passive listener, stopPropagation), correct swipe direction, momentum deceleration into auto-rotate.
- Button glow: replaced filter:blur with box-shadow for correct iOS pill clipping. Responsive intensity.
- Booking calendar: six-pass Liquid Glass preservation fix. Step-replacement mobile UX. Keyboard-avoidance scroll. Input zoom prevention (text-base).
- Button layout: three buttons (Data, Book, Find Me), single flex row, tighter wordmark gap.

---

## What is live

Hero page only. Full-bleed WebGL shader background, entity resoLOUtion wordmark, three glow-pill dock buttons on one row.

- Data button — opens CircularGallery with 6 PDL use case cards (no hrefs yet)
- Book button — opens GlassBookingCalendar (fetches real Cal.com slots v2, creates real bookings, full mobile UX)
- Find Me button — links to LinkedIn

All other routes (/about, /work, /work/[slug], /book) return 404. Files are in place for future use.

---

## Next steps

### Step 9. Replace placeholder content

When Lou is ready to feature real projects, add a Projects button back to HeroButtonRow and populate galleryItems in app/(site)/page.tsx. Each item needs title, subtitle, label, photo.url, and href.

The Data gallery cards (dataItems in page.tsx) link to future blog posts — update hrefs when those are built.

### Step 10. Blog and data use cases

Build a blog repository at /blog/[slug]. When posts exist, update dataItems hrefs in app/(site)/page.tsx to point to /blog/slug for each PDL use case card.

### Step 11. Restore about and work pages

When Lou is ready to publish more content, restore the full page implementations from git history and remove the notFound() guard. ESP case study requires written permission before publishing.

---

## Content decisions still open

- Real project photos and copy (if/when a Projects gallery is added back).
- ESP case study. Written permission required before publishing.
- PDL data use case blog posts. No sensitive or real data. Fabricated and labeled only.
- About page copy.
- LinkedIn URL. Stored in lib/site.ts as site.linkedin.

---

## Definition of done (current)

- Hero live on www.entityresoloution.com. Done.
- Glass booking calendar lets visitors pick a date, see real Cal.com availability, fill in name and email, and confirm a booking without leaving the page. Done.
- Three glow-pill dock buttons: Data (gallery), Book (calendar), Find Me (LinkedIn). Done.
- Brand matches Direction A, one accent, LOU lit in signal, WebGL shader hero. Done.
- Analytics mounted (Vercel Analytics). book_a_call event fires on booking confirmation. Done.
- No sensitive PDL data anywhere on the public site. Done.
- All non-hero pages return 404. Done.
- Sitemap shows only /. Done.
- GitHub repo at trusshome/personal-site, all commits authored as hello@trusshomeco.com. Done.
- Cal.com API fully functional on production (v2, BOM fixed). Done.
- iOS 26 Safari Liquid Glass preserved throughout the full booking flow. Done.
- Mobile gallery: responsive card sizing, touch swipe, momentum deceleration. Done.
- Mobile buttons: three on one row, correct pill shape, no zoom on inputs. Done.

## Definition of done (future)

- Real project content in gallery (or case study pages).
- Blog posts wired to Data gallery cards.
- About page live.
- Work showcase live (with ESP if permission granted).
