# Personal Site Kickoff and War Room Session Log

Date. Sunday, May 31 2026
Owner. Luciano Tarabocchia II
Folder. 007 - TrussHomeCo

This file captures the working session where we built the war room tracker, scheduled it to refresh daily, and added the personal website as the third active build. Use it to seed a new project folder so the personal site work stays organized in one place.

---

## What we did this session

1. Mapped the whole 007 - TrussHomeCo folder and read the project context files.
2. Built a war room dashboard at `war-room.html` that tracks every active project, its workflows, business goals, and a full risk register.
3. Made the dashboard interactive with project filter tabs and view lenses.
4. Scheduled a daily rebuild at 5am so git state and uncommitted file counts stay current.
5. Added the personal showcase site as a fourth tracked project.
6. Exported this session into the file you are reading now.

---

## The war room dashboard

Location. `C:\Users\ltara\Documents\007 - TrussHomeCo\war-room.html`

It is a single self contained HTML file. Open it in any browser. No build step, no dependencies.

Structure.

- A header with a date stamp that the daily job updates.
- A four stat summary strip (active builds, live or deployed, open risk items, high severity flags).
- Project filter tabs across the top (All, Truss Home, ESP Development, Jets / PDL, Personal Site, Business).
- View lenses you can toggle (Status, Workflows, Goals and Actions, Risks).
- One section per project, each with status panels, visual workflow flows, and goals and actions.
- A Risk and Legal Register table at the bottom that filters with the project tabs.

### Scheduled rebuild

A task named `war-room-daily-rebuild` runs every day at 5am local time. It re reads git state for each repo, refreshes the date stamp, status panels, risk rows, and summary numbers, and leaves goals, workflows, and the insurance facts untouched unless the files clearly changed. Scheduled tasks run while the app is open. If the app is closed at 5am the job runs on next launch.

---

## Project snapshot as of May 31 2026

### 1. Truss Home Platform
AI coordinated home services marketplace for Monmouth and Middlesex County, New Jersey. Next.js 14, deployed on Vercel, branch master. Flagship product with a client hub, an admin dispatch panel, four persona booking chats, Stripe payments, and contractor SMS dispatch through Quo.

Current state. 102 files show uncommitted changes, but the diff mirrors itself one to one (24,795 in, 24,795 out), which points to line ending churn rather than real edits. Contractor dispatch still runs in test mode, so SMS goes to test phones, not live contractors.

### 2. ESP Development and Construction
Client site for a friend's North Jersey design build firm. Next.js 16 and Tailwind v4, live at espdevelopmentnj.com, branch redesign/esp-2026. Working tree is clean. Portfolio holds nine projects, six completed with real photography and three pending as renders. Apex SSL may still be settling after the DNS cutover.

### 3. Jets / PDL Demo
A single page sales demo showing how fan ticketing data gets enriched with wealth and identity signals. Vite and React 19, local only, not deployed. All sample data is fabricated. The concept joins ticketing data with net worth, income, and political affiliation, so it stays sensitive even as a demo.

### 4. Personal Site (new this session)
See the kickoff brief below.

---

## Top risk flags carried into this work

- Insurance class code mismatch. The Hiscox General Liability policy is classed as janitorial and cleaning, but the platform sells handyman, pressure washing, and lawn care. A claim on a non cleaning job could be denied. Call Hiscox.
- Contractor liability and worker classification. The platform dispatches independent contractors, so it needs clear agreements, per vendor proof of insurance, and 1099 handling.
- Sensitive data in the Jets demo. Keep the fabricated data disclaimer until a privacy review clears it for real data.
- Live Stripe payments. Confirm PCI scope and that no raw card data is stored.

---

## Personal Site kickoff brief

This follows the project file structure used across 007 - TrussHomeCo so you can drop it straight into a new project folder.

### Goal (what we are building)
A personal showcase site for Luciano that tracks work across personal projects and PDL, positions you as a builder who ships real solutions, and turns LinkedIn traffic into booked discovery calls. The single conversion is book a call to chat about a solution.

### Current state (where the work stands right now)
Planning stage. No repo, no domain, no content. The proof to showcase already exists in Truss Home, ESP Development, and the Jets / PDL demo.

### Files in flight (active files being modified)
None yet. The first build step creates the new project scaffold.

### What's changed (touched this session)
Added the project to the war room tracker as a fourth build with status, workflows, goals, and two risk rows. No code written yet.

### Failed attempts (what did not work and why)
None yet.

### Next step (the single next thing to try)
Spin up a new project folder and repo, then scaffold the core pages, which are hero, project showcase, about, and book a call.

### Decisions to make
- Stack. Next.js and Tailwind match your other repos and the project build conventions.
- Booking tool. Cal.com or Calendly for the book a call action.
- Domain. A new domain or a subdomain of one you already own.
- Public scope. Which PDL and client work you can show publicly, and at what level of detail.

### Build rules to honor
- Per the project instructions, build any website work with the ui-ux-pro-max connector and the 21st.dev connector.
- Get permission to feature ESP, since it is a client and friend's firm.
- Keep any sensitive PDL data off the public site, the same concern flagged on the Jets demo.

### Lead funnel (the core workflow)
LinkedIn profile or post, then land on the site, then browse the showcase, then click book a call, then pick a slot, then the discovery call is booked. Keep one clear call to action and wire analytics so you can track the booking conversion rate.

---

## Suggested next actions

1. Create a new project folder for the personal site and start the repo.
2. Pick and connect the booking tool.
3. Draft three case studies from existing work.
4. Confirm public scope for PDL and client material before writing those case studies.
5. Keep using the war room to track all four builds, and let the 5am job keep it fresh.
