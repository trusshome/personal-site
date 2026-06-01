# Personal Site Standup

Owner. Luciano Tarabocchia II (Lou)
Project. Personal showcase site
Domain. www.entityresoloution.com (Entity resoLOUtion, the name is baked into the brand)
Folder. 007 - TrussHomeCo / 002 - ClaudeCode / personal-site
Last updated. Monday, June 2 2026

This is the running standup for the personal site. Read it before each new session so you know the goal, where the work stands, what is in flight, what changed, what failed, and the one next step. Keep it current.

---

## Goal (what we are building)

A personal showcase site that positions Lou as a builder who ships real solutions and turns LinkedIn traffic into booked discovery calls. The single conversion is book a call to talk about a solution.

Core pages.

- Hero. WebGL shader background, wordmark, three glow-pill dock buttons, glass booking calendar.
- Project showcase. Three proof pieces, Truss Home, ESP Development (draft), Jets / PDL demo.
- About. Short story on the builder, framed around entity resolution and shipping.
- Book a call. The single funnel endpoint, one slot picker, no competing actions.

---

## Current state (where the work stands right now)

Steps 1 through 7 complete. Analytics, SEO, and content are all wired. npm run build exits 0.

This session brought the hero to a dramatically different visual direction. The original resolving-dots animation was debugged and reworked extensively, then replaced with a three.js WebGL line-field shader. The CTA buttons were restyled with a glow-pill treatment and dock magnification. A full glass booking calendar was built on the home page so visitors can select a date, see Cal.com availability, and complete a booking without leaving the page.

No git repo for personal-site. The folder is untracked inside the home repo at C:\Users\ltara. Git init is a prerequisite for Step 8.

No .env.local. CAL_COM_API_KEY must be set for the booking calendar API routes to work.

SECURITY. The Cal.com API key cal_live_9f6cedd78486a164751772aa7b43be19 was shared in plaintext in the session chat. Lou must revoke it immediately at cal.com/settings/developer/api-keys and generate a new one before doing anything else.

---

## Files in flight (active files being modified)

- site-standup.md. This file.
- SESSION-HANDOFF.md. Updated this session.
- app/globals.css. Tokens and animations.
- app/(site)/page.tsx. The home page, now a client component managing the glass calendar toggle state.
- app/(site)/layout.tsx. Stripped to a bare main wrapper, no Nav or Footer.
- app/layout.tsx. Added suppressHydrationWarning to fix browser extension hydration mismatch.
- app/api/cal/slots/route.ts. New. Proxies Cal.com slot availability server-side.
- app/api/cal/book/route.ts. New. Proxies Cal.com booking creation server-side.
- components/ShaderAnimation.tsx. New. three.js WebGL hero background.
- components/GlowLink.tsx. New. Shared glow-pill visual for all CTA buttons.
- components/CTAButton.tsx. Refactored to use GlowLink.
- components/HeroButtonRow.tsx. New. Dock magnification row with three glow buttons.
- components/GlassBookingCalendar.tsx. New. Full on-page booking flow.
- lib/site.ts. Added site.linkedin and site.calEvent.

---

## What changed (touched this session, June 2 2026)

Hero animation. ResolveAnim was debugged. Several issues fixed: font-load re-measure, vertical clipping, touch scroll fighting, pointercancel reset, orientationchange listener. Then the scatter was reworked to fill the full hero with a circular distribution, dot count raised to 360 desktop and 150 mobile, stagger made continuous by radius. A rotating spiral collapse was added. Cursor follow replaced click-and-drag. Then the whole component was replaced with ShaderAnimation using three.js because Lou wanted a different visual direction entirely.

ShaderAnimation. three.js WebGL renderer, a PlaneGeometry covering the viewport, a fragment shader that draws layered line rings. Retinted to brand: ink background, lines blending cyan-motion to signal, no other hues. Honors reduced motion by rendering one static frame and skipping the rAF loop. Cleans up renderer, geometry, and material on unmount.

Nav and footer removed. Both were stripped from app/(site)/layout.tsx. Nav.tsx and Footer.tsx files remain on disk. The home page, about, and work pages have no chrome at all. This was a deliberate product call.

CTA button redesign. GlowLink.tsx built as the shared visual source. CTAButton delegates to GlowLink and keeps the cal link and analytics. Glow is a signal-to-cyan-motion gradient, blurs on hover. ArrowUpRight icon from lucide-react on every button. Default label changed to Book.

Hero button row. HeroButtonRow.tsx. Motion-based dock row, mouse proximity drives a scale spring (1 to 1.08, damping 12). Three buttons: Projects to /work, Book toggles the glass calendar, Find Me to LinkedIn. Horizontal gap set to gap-8.

Glass booking calendar. GlassBookingCalendar.tsx. Persistent glass card (ink/50, backdrop-blur-2xl, border white/10) with two columns. Left column stays mounted throughout: monthly grid, day of week headers, past dates disabled, today dot in signal, selected day lit in signal glow. Right column slides in (spring, 460px) when a date is clicked, then AnimatePresence swaps between three inner panels: time slot grid, booking form, success state. Shimmer covers the right panel during data load so the glass background never goes blank. All Cal.com calls go through the two server-side API routes.

Cal.com API routes. app/api/cal/slots/route.ts fetches the 30min event type ID from Cal.com (module-level cache), then fetches available slots. Returns the slot array plus the event type ID. app/api/cal/book/route.ts POSTs a booking with name, email, notes, timezone, start, and auto-computed end. Both read CAL_COM_API_KEY from env. Neither file has any key hardcoded.

Cal.com MCP. claude mcp add --transport http cal https://mcp.cal.com/mcp --scope user was run. The server is registered globally in Claude Code. It needs OAuth to connect. OAuth is at https://cal.com/integrate. This is separate from the REST API key used by the production routes.

Security incident. The REST API key was shared in plaintext in chat. Treat it as compromised. Revoke at cal.com/settings/developer/api-keys. Generate a new one. Add to .env.local.

Hydration warning fixed. suppressHydrationWarning added to the html element in app/layout.tsx. A browser extension was injecting data-theme and CSS variables before React hydrated, causing a mismatch.

New dependencies. three, @types/three (WebGL shader), lucide-react (icons), date-fns (calendar date math). All installed with npm install --force due to platform binary lock in the lockfile.

---

## Failed attempts (what did not work and why)

- mcpServers in settings.json. Claude Code's settings.json does not accept a mcpServers key. MCP server definitions go in .mcp.json files or via claude mcp add. The validator rejected the edit.
- .mcp.json approach for Cal.com MCP. Created a .mcp.json at the project root. The server showed as Pending approval, then when approved via enabledMcpjsonServers, it showed Failed to connect because .mcp.json has no way to carry auth headers. Removed. Replaced with claude mcp add which stores auth internally.
- cal_live API key shared in chat. Shared in plaintext. Key is compromised. Must be revoked.

---

## Next step (the single next thing to try)

Before Step 8: revoke the compromised Cal.com key, generate a new one, add it to .env.local, then init the personal-site git repo.

After that: Step 8 from prompts.md. Deploy on Vercel, point www.entityresoloution.com, confirm SSL, confirm the book_a_call event records in the deployed environment. The Cal.com API routes will only work once CAL_COM_API_KEY is set in the Vercel environment variables.

---

## Build rules to honor

- Per the project instructions, build any website UI with the ui-ux-pro-max connector and the 21st.dev connector.
- Get permission to feature ESP since it is a client and a friend's firm.
- Keep any sensitive PDL data off the public site.
- Match the writing system instructions. Active voice, direct, simple words, no dashes, no marketing fluff.

---

## Lead funnel (the core workflow)

LinkedIn profile or post, then land on the site, then click Book in the hero, pick a date on the glass calendar, pick a time, fill in name and email, confirm the booking. Discovery call is booked on the same page. Analytics fires book_a_call at the moment of date selection.

---

## Decisions locked

- Domain. www.entityresoloution.com, purchased on Namecheap on May 31 2026.
- Stack. Next.js 16.2.6, React 19.2.4, Tailwind v4, motion, three.js, date-fns, lucide-react. Locked.
- Booking tool. Cal.com, account set up May 31 2026, username entity-resoloution. Event type 30min.
- LinkedIn. https://www.linkedin.com/in/entity-resoloution/ stored in lib/site.ts as site.linkedin.
- Hero visual. WebGL shader, three.js, ink base with signal and cyan-motion lines. No dots animation.
- Booking surface. On-page glass calendar, no Cal.com iframe or redirect.

## Decisions still open

- Public scope. Which PDL and client detail can show publicly, and at what level.
- ESP feature permission. ESP is a client and a friend's firm, so get a yes before featuring it.
- Cal.com OAuth for MCP. The MCP server is registered but not yet authorized. OAuth flow needed at https://cal.com/integrate.
- Smooth scroll. lenis is installed and globals.css has the helper rules but no provider is wired.
