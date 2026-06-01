# Build Plan. Entity resoLOUtion

Owner. Lou
Last updated. Monday, June 2 2026
Read with. CLAUDE.md for brand and conventions, site-standup.md for current state.

This is the step by step plan to build the site. Follow the order. Each step ends before the next starts.

---

## What we are building

Four pages and one conversion. Hero, work showcase, about, and book a call. The book a call button points to https://cal.com/entity-resoloution. Brand is Direction A, Resolution, defined in CLAUDE.md.

---

## Stack and source of truth

- Next.js 16 App Router, React 19, TypeScript, Tailwind v4, motion, three.js, date-fns, lucide-react, Vercel. Mirrors esprealty-web.
- Brand tokens and folder conventions live in CLAUDE.md. Reference tokens, never raw hex.

---

## The pages (current state)

1. Hero. WebGL shader background, entity resoLOUtion wordmark, three glow-pill dock buttons (Projects, Book, Find Me), glass booking calendar. DONE.
2. Work. Three case studies as cards, Truss Home, ESP (draft), Jets / PDL (fabricated data, labeled). DONE.
3. About. Short builder story, ends with book a call. DONE.
4. Book. Funnel endpoint at /book, link to Cal.com. DONE.

---

## Build sequence

### Step 1. Scaffold the repo (done)
### Step 2. Brand primitives (done)
### Step 3. Hero (done, then reworked)
### Step 4. Work showcase (done)
### Step 5. About (done)
### Step 6. Book (done)
### Step 7. Analytics and SEO (done)

### Step 8. Deploy and connect the domain
Deploy on Vercel. Point www.entityresoloution.com at the Vercel project. Confirm SSL settles and the live site loads on both the apex and www.

Prerequisites before Step 8.
- Revoke the compromised Cal.com API key (cal_live_9f6cedd78486a164751772aa7b43be19 was shared in chat, treat as compromised).
- Generate a new Cal.com API key at cal.com/settings/developer/api-keys.
- Create personal-site/.env.local with the new key: CAL_COM_API_KEY=new_key.
- Init the personal-site git repo (no .git exists yet): git init inside personal-site, branch main, .gitignore, secret scan, initial commit, create private GitHub repo personal-site under trusshome using gh, push.
- Set CAL_COM_API_KEY as an environment variable in the Vercel project before deploying, otherwise the glass booking calendar API routes will fail at runtime.

After it is live.
- Confirm the book_a_call analytics event records in the deployed environment.
- Confirm the glass calendar fetches real Cal.com slots (requires the env var set in Vercel).
- Update CLAUDE.md and this definition of done.

---

## Content sourcing

- Truss Home. Live platform, payments, dispatch, four booking chats. Strongest proof.
- ESP Development. Live client site. Feature only after written permission. Draft slug stays unpublished until then.
- Jets / PDL demo. Data enrichment concept. Fabricated, labeled data only, nothing sensitive on the public site.

---

## Open items that gate the build

- ESP feature permission. Written yes before the ESP case study publishes.
- Public scope for PDL detail. Keep it fabricated and labeled.
- Cal.com API key replacement. Compromised key must be revoked and replaced.
- personal-site git repo. Must be initialized before deploying.
- .env.local. Must exist with CAL_COM_API_KEY before the booking calendar works.

---

## Definition of done

- Four pages live on www.entityresoloution.com.
- Glass booking calendar lets visitors pick a date, see real Cal.com availability, fill in their name and email, and confirm a booking without leaving the page.
- Three glow-pill dock buttons on the hero: Projects, Book (toggles the calendar), Find Me (LinkedIn).
- Brand matches Direction A, one accent, LOU lit in signal, WebGL shader hero.
- Analytics tracks the book_a_call conversion.
- No sensitive PDL data anywhere on the public site.
- ESP stays 404 publicly.
- CLAUDE.md updated to match what shipped.
