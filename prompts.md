# Claude Code Prompts. Entity resoLOUtion

Copy one block at a time into Claude Code in Cursor. Run them in order.
Each prompt is self contained, carries the shared rules, and stops at the
end of its step so you can review before the next one. Read with
build-plan.md and CLAUDE.md.

Status. Steps 1 to 7 done. Hero redesigned (shader, glow buttons, glass calendar). Git setup and Step 8 are next.

---

## Shared rules (baked into every prompt below)

- Plan before you touch anything. Show the plan and wait for my go.
- Write tests first, implement the minimum, verify nothing regressed.
- Document while context is fresh. Review as an attacker before commit.
- Reference tokens from CLAUDE.md, never raw hex. One accent, signal.
- Active voice, simple words, no dashes.
- Use the ui-ux-pro-max and 21st.dev connectors for the UI.
- ESP stays an unpublished draft until I confirm written permission.
- All PDL data stays fabricated and labeled. Nothing sensitive ships.

---

## Steps 1 through 7 (done)

All complete. See SESSION-HANDOFF.md for detail.

---

## Git setup (prerequisite for Step 8, not yet done)

```
You are resuming the Entity resoLOUtion personal site build.

Read SESSION-HANDOFF.md, CLAUDE.md, build-plan.md, and prompts.md in that
order and treat them as the source of truth.

SECURITY FIRST. Before touching any code or git, confirm that Lou has:
1. Revoked the compromised Cal.com API key at cal.com/settings/developer/api-keys.
2. Generated a new key and added it to personal-site/.env.local as CAL_COM_API_KEY.
If either step is missing, stop and say so. Do not proceed.

Then do git setup only. Do not change application code or start Step 8.

Context: personal-site has no git repo of its own. The folder sits as an
untracked directory inside the home repo at C:\Users\ltara. Do NOT run any
git add, commit, or push at the home level. Work only inside personal-site.

Follow the project rules. Plan first, show the plan, wait for my go.
Verify each step. Review as an attacker before the commit. No dashes.

Do this in order:
1. Confirm git rev-parse --show-toplevel still points to C:\Users\ltara.
2. Run git init inside personal-site, set default branch to main.
3. Create .gitignore covering: node_modules, .next, .vercel, out, build,
   .env and .env.*, *.log, .DS_Store, next-env.d.ts, *.tsbuildinfo.
4. Secret scan. List every file that would be committed. If any .env file,
   API key, token, or secret appears, stop and tell me. Do not commit.
5. Commit. Stage source only. Message: Initial commit, Entity resoLOUtion
   site through Step 7 plus hero redesign and glass booking calendar.
6. Create a private GitHub repo named personal-site under the trusshome
   account using gh, then add it as origin.
7. Push main to origin and set upstream.
8. Verify. Confirm the push succeeded, branch tracks origin/main, and the
   remote does not contain node_modules, .next, or any .env file.

Stop after the push is verified. Do not start Step 8.
```

---

## Step 8. Deploy and connect the domain

```
Continue the Entity resoLOUtion build. Git setup is verified and pushed.
Re-read CLAUDE.md and SESSION-HANDOFF.md.

Rules: plan first and wait for my go, verify each action, document,
review as an attacker. Active voice, no dashes.

Before deploying, confirm:
- personal-site/.env.local exists with CAL_COM_API_KEY set to a live key.
- The old key cal_live_9f6cedd78486a164751772aa7b43be19 has been revoked.

Do only Step 8 from build-plan.md, deploy and domain:
- Deploy on Vercel. Set CAL_COM_API_KEY as a Vercel environment variable
  before the first production build so the glass booking calendar routes
  work at runtime.
- Point www.entityresoloution.com at the Vercel project.
- Confirm SSL settles and the live site loads on both the apex and www.

After it is live:
- Confirm the book_a_call event records in the deployed environment.
- Confirm the glass calendar fetches real Cal.com slots on the live domain.
- Update CLAUDE.md and the definition of done in build-plan.md.

Show me your Step 8 plan and wait for my go. Stop when the site is live
and verified.
```
