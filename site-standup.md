# Personal Site Standup

Owner. Luciano Tarabocchia II (Lou)
Project. Entity resoLOUtion personal showcase site
Domain. www.entityresoloution.com (live)
Folder. 007 - TrussHomeCo / 002 - ClaudeCode / personal-site
Last updated. Monday, June 2 2026

This is the running standup for the personal site. Read it before each new session so you know the goal, where the work stands, what is in flight, what changed, what failed, and the one next step. Keep it current.

---

## Goal

A personal showcase site that positions Lou as a builder who ships real solutions and turns LinkedIn traffic into booked discovery calls. Single conversion: book a call.

---

## Current state

Site is deployed and live at www.entityresoloution.com. Only the hero page is public. All other routes return 404.

The hero shows the WebGL shader, entity resoLOUtion wordmark, and three dock buttons (Data, Book, Find Me) on one row. Clicking Data opens a 3D rotating circular gallery. Clicking Book opens the glass booking calendar. Find Me links to LinkedIn.

Cal.com booking is fully functional on production (v2 API). The full mobile booking flow works without breaking iOS 26 Liquid Glass at any step.

Gallery cards are placeholder content. No hrefs set yet. Real content to be added when Lou is ready.

---

## What changed this session (June 1–2 2026)

### Desktop scrollbar
Hide the scrollbar visually via scrollbar-width:none and ::-webkit-scrollbar{display:none} on html. Keeps overflow-y:scroll (needed for Liquid Glass runway) without showing a scrollbar track.

### CircularGallery responsive sizing
Added cardWidth and cardHeight props to CircularGallery. page.tsx detects mobile (≤640px) and passes 130×180px cards with radius=180 on mobile, 260×360px with radius=360 on desktop. Panel container uses h-[260px] sm:h-[500px] Tailwind classes.

### Gallery swipe (mobile)
The document-level touchmove lock was preventing gallery drag on iOS. Fixed by adding a non-passive touchmove listener directly on the gallery container that calls stopPropagation (bypasses the page lock) and preventDefault (stops native pan), then rotates the ring from touches[0].clientX. Pointer handlers skip pointerType==='touch' to avoid double processing.

### Swipe direction + momentum
Direction was inverted — changed prev-dx*0.4 to prev+dx*0.4 so a right swipe rotates right. Added velocity tracking (smoothed EMA of dx/dt) and a currentVelocity ref that the auto-rotate tick lerps toward autoRotateSpeed at MOMENTUM_LERP=0.06, creating natural deceleration into the background spin instead of a hard stop.

### Button glow (mobile rectangle bug)
iOS Safari doesn't clip filter:blur children to a parent's overflow:hidden+border-radius. Replaced the blurred absolute-inset gradient span with box-shadow on the button element itself. Box-shadow always respects border-radius. Shadow values are smaller on mobile (responsive sm: variants), full strength on desktop.

### Booking calendar — iOS Liquid Glass preservation (multiple passes)
This was the main work of the session. Root cause: anything that moves document scrollY off the 62px runway stops iOS 26 from compositing the in-flow shader behind its chrome.

Fixes applied in order:
1. Calendar wrapper div (overflow-y:auto, overscrollBehavior:contain, maxHeight calc) so the fixed section never needs to scroll.
2. Section overflow-y changed from auto to clip — clip creates a visual clipping region without creating a scroll container, so iOS cannot scroll the section at all.
3. window scroll listener that snaps scrollY back to the 62px offset whenever anything moves it (handles both overscroll chain and virtual keyboard displacement).
4. Left panel (date picker) hidden on mobile for form and success steps — freed the full wrapper height for those steps. Added a "Change date" back button and date·time context badge in the slots and form steps.
5. Left panel also hidden on mobile for the slots step. Most important fix: the calendar no longer expands when a date is tapped. Each mobile step is a full-width replacement view.
6. Removed motion.div layout wrapper around panels. The FLIP animation (scaleY transform) it triggered when the calendar changed height was breaking GPU compositing. Replaced with a plain div; panels still fade/scale via PANEL_ANIM.
7. visualViewport resize listener: on keyboard appearance, calculates exactly how much the focused input is hidden by the keyboard (getBoundingClientRect vs visualViewport.height) and scrolls the calendar wrapper by that amount without touching the document.

### Input zoom fix
iOS Safari auto-zooms inputs with font-size < 16px. inputCls used text-sm (14px). Changed to text-base (16px).

### Button layout
Removed the Projects button and its gallery panel (placeholder, no real content). Three buttons remain: Data, Book, Find Me.

Layout changed from grid-cols-2 (2×2 on mobile) to flex on all breakpoints — all three buttons on one row at every screen size. gap-2 mobile, gap-8 desktop. Removed w-full from buttons and DockButton wrappers.

Tightened wordmark-to-buttons gap: mt-10 → mt-4.

---

## Files in flight

None. All changes are committed and deployed to production.

---

## Next steps

Step 9. Replace placeholder gallery cards with real project photos and titles. Update galleryItems in app/(site)/page.tsx — each item needs title, subtitle, label, photo.url, and href. Currently the Data gallery is live; galleryItems for Projects was removed (no button). When Lou is ready to feature projects, add a Projects button back and wire galleryItems.

Step 10. Build blog at /blog/[slug] and wire dataItems hrefs to post pages.

Step 11. Restore /about and /work when content is ready. ESP case study requires written permission before publishing.

Optional. Custom home-screen app icon (currently uses a page screenshot on iOS).

---

## Decisions locked

- Domain. www.entityresoloution.com, Namecheap DNS → Vercel.
- Stack. Next.js 16.2.6, React 19.2.4, Tailwind v4, motion, three.js, date-fns, lucide-react. Locked.
- Booking. Cal.com entity-resoloution, 30min event type. On-page glass calendar. No embed or redirect.
- Cal.com API version. v2. v1 is decommissioned.
- LinkedIn. https://www.linkedin.com/in/entity-resoloution/ in lib/site.ts.
- Hero visual. WebGL shader, three.js, ink base with signal and cyan-motion lines.
- Panel system. Data and Book are mutually exclusive panels. Find Me is always an external link.
- Gallery. CircularGallery with drag, wheel, and touch swipe. Responsive card/radius sizing.
- Deployment. Vercel, truss-home-s-projects team, personal-site project.
- GitHub. trusshome/personal-site, private, main branch, hello@trusshomeco.com author.
- Buttons. Three buttons: Data, Book, Find Me. Single flex row on all screen sizes.
- Button glow. box-shadow only (no filter:blur) for iOS Safari compatibility.
- Mobile booking flow. Step-replacement pattern: each step (date picker → slots → form → success) hides the previous view on mobile. No stacking that would expand the calendar height.

## Decisions still open

- Real project images and copy (for a future Projects gallery or case study section).
- Blog structure and slug conventions for Data card links.
- ESP feature permission. Written yes required before the case study publishes.
- About page copy and timeline for going live.
- book_a_call analytics event. Needs Vercel Analytics dashboard verification once traffic arrives.
