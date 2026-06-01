# Entity resoLOUtion. CLAUDE.md

Read this before touching any file. It is the authoritative source on the brand, stack, and conventions for the personal site. It mirrors the CLAUDE.md style used in trusshome-web and esprealty-web.

---

## Project snapshot

What it is. A personal showcase site for Lou (Luciano Tarabocchia II) that positions him as a builder who resolves messy problems into one clear, shipped answer, and turns LinkedIn traffic into booked discovery calls.

The single conversion. Book a call.

Domain. www.entityresoloution.com, the name Lou sits inside resoLOUtion, the pun is the brand.
Booking. Cal.com, https://cal.com/entity-resoloution.
Repo home. 007 - TrussHomeCo / 002 - ClaudeCode / personal-site.
Owner email. hello@trusshomeco.com.
Where it gets built. The repo scaffold and UI run in Lou's Cursor instance, where the ui-ux-pro-max and 21st.dev connectors live. This folder holds the spec the Cursor build follows.

Stack. Next.js 16 App Router, React 19, TypeScript, Tailwind v4 via @tailwindcss/postcss, motion for animation, lenis for smooth scroll, deployed on Vercel. Matches esprealty-web.

---

## Brand system. Direction A, Resolution

The idea is clarity. Scattered things resolving into one clear answer. Clean, technical, calm. One electric accent does all the talking. The reso**LOU**tion wordmark lights LOU in the accent so Lou's name is the visual hook.

### Colors. Always use these exact hex values

| Token | Hex | Use |
|---|---|---|
| `ink` | `#14171C` | Primary text, headings, dark UI |
| `paper` | `#F7F5F0` | Page background, warm off white |
| `signal` | `#2F6BFF` | The one accent, CTAs, the LOU highlight, links |
| `signal-dark` | `#1F54D6` | Hover and pressed states on signal |
| `signal-tint` | `#E7EEFF` | Soft accent fills, badges, highlight blocks |
| `slate` | `#5A626E` | Secondary text, captions, muted labels |
| `hairline` | `#E3E0D8` | Borders, dividers, card edges |
| `cyan-motion` | `#11C5D4` | Motion only, the resolving dots animation. Never static UI |

Discipline rule. One accent. `signal` is the only call to action color. Do not add a second brand color for static UI. `cyan-motion` exists only inside the hero resolving animation and nowhere else.

### Fonts

- Display and headings. Space Grotesk. Technical, geometric, confident.
- Body and UI. Inter. Clean, neutral, readable.
- Labels and code accents. JetBrains Mono. Used sparingly for tags, kickers, and small technical labels.

### Wordmark

Render the name as one lowercase string with LOU lit in `signal`.

```
entity reso[LOU]tion
```

- `entity reso` and `tion` are `ink`.
- `LOU` is `signal`, set in the same weight, not bolder, the color does the work.
- On dark sections, swap `ink` letters to `paper` and keep `LOU` in `signal`.
- A compact mark for the favicon and nav is the bracketed `[LOU]` alone in `signal` on `paper`.

### Motion

The hero animates scattered dots resolving into a single point, the literal brand promise. Use `signal` for the resolved point and `cyan-motion` for the scatter, fading to `signal` as they converge. Keep it short, calm, and respect reduced motion settings. No bounce, no spin.

---

## Layout and routing

App Router, one folder per route, mirroring esprealty-web.

```
app/
  layout.tsx        root, html plus body plus fonts plus metadata only, no chrome
  globals.css       tokens as CSS variables, Tailwind layer
  (site)/           the main site, wrapped in chrome
    layout.tsx      holds Nav, the main wrapper, and Footer
    page.tsx        landing, hero plus showcase teaser
    about/page.tsx
    work/page.tsx           the showcase index
    work/[slug]/page.tsx    one case study per slug
  book/page.tsx     the funnel endpoint, sits OUTSIDE (site) so it renders with no chrome
  sitemap.ts
  robots.ts
components/   ProjectCard, Nav, Footer, CTAButton, Wordmark, ResolveAnim
content/      case studies as typed data, like esprealty content
lib/          site config, analytics helper
public/       logo, banner, og image
```

Chrome lives in the `(site)` route group layout, not the root layout, so the book page can render clean with no Nav or Footer. Route groups do not change URLs, the paths stay `/`, `/about`, `/work`, `/work/[slug]`, `/book`.

### Conventions

- Tokens live as CSS variables in `globals.css`, surfaced through the Tailwind v4 theme. Reference tokens, never raw hex, in components.
- One clear call to action per page, book a call, pointing to https://cal.com/entity-resoloution. The booking URL keeps the deliberate resoLOUtion spelling and is sourced from `lib/site.ts`, never retyped, so nothing autocorrects it to resolution.
- The book page is a plain link to Cal, not an embed, to stay light and avoid a third party script on the funnel endpoint.
- Case study content lives in `content/`, typed, so pages stay presentational.
- Keep the booking action a single button. No competing forms or links on the book page.
- Analytics is Vercel Analytics, mounted once in the root layout. The single conversion event is `book_a_call`, fired from `CTAButton` on every click via `lib/analytics.ts`. Records only in the deployed environment.
- SEO surface: `sitemap.ts` reads `publishedStudies()` so drafts never appear, `robots.ts` allows all, and `metadataBase` comes from `lib/site.ts` so every canonical and OG URL is absolute and keeps the resoloution spelling. The OG image is a dynamic `opengraph-image.tsx` at 1200 by 630; it uses hex that mirrors the tokens because ImageResponse runs without the DOM.

---

## Build rules to honor

- Build UI with the ui-ux-pro-max and 21st.dev connectors, which run in the Cursor instance.
- Get written permission before featuring ESP, since it is a client and a friend's firm. Until then the ESP slug stays an unpublished draft.
- Keep all sensitive PDL data off the public site. The Jets / PDL case study uses fabricated, labeled sample data only.
- Match the writing system instructions in the project. Active voice, direct, simple words, no dashes, no marketing fluff.
- Plan first, explore before assuming, write tests first, implement the minimum, verify nothing regressed, document while context is fresh, and review your own work as an attacker before any commit.

---

## The funnel

LinkedIn profile or post, then www.entityresoloution.com, then the work showcase, then the book a call button, then https://cal.com/entity-resoloution, then a booked discovery call. Wire analytics so the booking conversion rate is tracked end to end.
