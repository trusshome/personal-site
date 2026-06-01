# Personal Site Standup

Owner. Luciano Tarabocchia II (Lou)
Project. Entity resoLOUtion personal showcase site
Domain. www.entityresoloution.com (live)
Folder. 007 - TrussHomeCo / 002 - ClaudeCode / personal-site
Last updated. Sunday, June 1 2026

This is the running standup for the personal site. Read it before each new session so you know the goal, where the work stands, what is in flight, what changed, what failed, and the one next step. Keep it current.

---

## Goal

A personal showcase site that positions Lou as a builder who ships real solutions and turns LinkedIn traffic into booked discovery calls. Single conversion: book a call.

---

## Current state

Site is deployed and live at www.entityresoloution.com. Only the hero page is public. All other routes return 404.

GitHub: trusshome/personal-site (private). Vercel: truss-home-s-projects/personal-site.

The hero shows the WebGL shader, entity resoLOUtion wordmark, and four dock buttons (Projects, Data, Book, Find Me). Clicking Projects or Data opens a 3D rotating circular gallery. Clicking Book opens the glass booking calendar. Find Me links to LinkedIn.

Cal.com booking is fully functional on production. The API routes use Cal.com v2 (v1 was decommissioned). Slots and bookings both verified working. 11 slots returning for available days.

Gallery cards are placeholder content. No hrefs set yet. Real content to be added when Lou is ready.

---

## What changed this session (June 1 2026)

Cal.com v1 to v2 migration.
Both API routes (slots, book) were broken because Cal.com decommissioned their v1 API. Migrated to v2: Bearer auth header instead of query param, updated endpoint paths, updated response parsing. The slots response has the date map directly in data.data (not nested under data.data.slots as originally assumed). Fixed.

CircularGallery component.
Built components/ui/circular-gallery.tsx. A 3D ring carousel with perspective 2000px. Cards are 260x360px, aspect 3/4. Interaction: drag to spin, mouse wheel to spin, auto-rotate when idle (pauses on interaction, resumes 800ms after). Clicking a card navigates to its href. Radius and autoRotateSpeed are props.

Hero panel system.
Replaced the single bookOpen boolean with a panel state (none/book/projects/data). Four buttons now. Projects and Data each open their own CircularGallery. Book opens GlassBookingCalendar. Buttons are mutually exclusive. AnimatePresence with motion.div layout handles smooth height transitions.

Transition fix.
The snap-and-pause on panel close was caused by two things: AnimatePresence mode=wait holding the layout open during the spring exit, and GlassBookingCalendar's own inner exit animation propagating through the tree and extending the hold. Fixed by splitting enter/exit transitions (spring enter, 150ms easeOut exit), wrapping AnimatePresence in a motion.div layout, dropping mode=wait, and removing the inner exit animation from GlassBookingCalendar's root element.

Data gallery.
Six PDL use case cards added as the Data panel: Fan Enrichment, Lead Intelligence, Talent Mapping, Market Sizing, ICP Builder, Network Graph. No hrefs yet. Will link to blog posts.

Pre-deploy audit.
- HeroProjectCards.tsx deleted (unused, had TypeScript type error on transition prop)
- focus-rail.tsx transition type fixed (per-property object instead of function)
- /about, /work, /work/[slug], /book all return notFound() — files kept for future
- Sitemap trimmed to / only
- .gitignore created

Git setup and deploy.
- git init, branch main, initial commit
- Pushed to github.com/trusshome/personal-site
- Rewritten history: all commits use hello@trusshomeco.com / trusshome (force-pushed)
- vercel.json added with framework: nextjs (pre-existing Vercel project had no framework set, caused output directory error)
- CAL_COM_API_KEY added to Vercel — first two attempts corrupted by PowerShell pipe BOM. Fixed using cmd stdin redirect with raw ASCII bytes.
- Namecheap DNS: A record @ to 76.76.21.21, CNAME www to cname.vercel-dns.com
- www.entityresoloution.com: 200. Apex: propagating.
- Production smoke test: 11 slots returned, eventTypeId 5863479.

---

## Files in flight

None. Session is complete and all files are committed and deployed.

---

## Failed attempts this session

PowerShell pipe BOM corruption. Piping a string to vercel env add in PowerShell adds a BOM character (0xFEFF) to the start of the value regardless of Console.OutputEncoding settings. This appeared as a Bytestring error in the Cal.com fetch (character at index 7 of the Authorization header value is > 255). Fixed by writing raw ASCII bytes to a temp file and using cmd stdin redirect. See Gotchas in SESSION-HANDOFF.md.

vercel --prod output directory error. The pre-existing personal-site Vercel project had no framework configured. It was looking for a public/ directory. Fixed by adding vercel.json with framework: nextjs.

---

## Next step

Add real project content to gallery cards. Replace placeholder titles, subtitles, and Unsplash images in galleryItems inside app/(site)/page.tsx. Add href to each card pointing to the case study or external URL.

After that: build blog at /blog/[slug] and wire dataItems hrefs. Then restore /about and /work when content is ready.

---

## Decisions locked

- Domain. www.entityresoloution.com, Namecheap. DNS pointed at Vercel.
- Stack. Next.js 16.2.6, React 19.2.4, Tailwind v4, motion, three.js, date-fns, lucide-react. Locked.
- Booking. Cal.com entity-resoloution, 30min event type. On-page glass calendar. No embed or redirect.
- Cal.com API version. v2. v1 is decommissioned.
- LinkedIn. https://www.linkedin.com/in/entity-resoloution/ in lib/site.ts.
- Hero visual. WebGL shader, three.js, ink base with signal and cyan-motion lines.
- Panel system. Projects / Data / Book are mutually exclusive panels. Find Me is always an external link.
- Gallery. CircularGallery with radius 360, autoRotateSpeed 0.04, drag and wheel interaction.
- Deployment. Vercel, truss-home-s-projects team, personal-site project.
- GitHub. trusshome/personal-site, private, main branch, hello@trusshomeco.com author.

## Decisions still open

- Real project images and copy for gallery cards.
- Blog structure and slug conventions for Data card links.
- ESP feature permission. Written yes required before the case study publishes.
- About page copy and timeline for going live.
- Apex domain (entityresoloution.com without www). DNS propagation in progress.
- book_a_call analytics event. Needs Vercel Analytics dashboard verification once traffic arrives.
