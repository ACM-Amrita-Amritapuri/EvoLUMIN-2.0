> NOTE (handoff): paths to a temp scratchpad were rewritten to repo paths (docs/...). Screenshots go to any temp folder. See ../../HANDOFF.md first.

# Evolumin 2.0 redesign: shared spec (read fully before touching code)

Project: `H:\Personal\ACM\EvoLUMIN-2.0\evolumin-hackathon` (React 18 + Vite, plain CSS, no new dependencies). It is a MARKETING PAGE whose one job is to get students to register for a 36-hour national hackathon. The owner called the current look "blocky" with a "very bad colour scheme" (flat red buttons, cyan chips, 1px-bordered boxes everywhere, Goldman font). We are replacing the whole visual layer.

## Concept: "light on a black stage"
The logo is a neon crescent lit red (left) and cyan (right) on black. The page is the same idea: a near-black stage where RED and CYAN exist only as LIGHT (glows, blurred orbs, thin gradient lines, gradient text used once), never as flat fills or boxes. Type is large and editorial. Structure comes from spacing, scale and hairlines, NOT from boxed cards.

The one memorable thing (spend boldness here, keep everything else quiet): a thin ember-to-ion gradient "road" rail that runs down the left of the page and fills as you scroll (echoing the winding road in the printed brochure's timeline). Plus the glowing logo in the hero. Everything else is disciplined.

## Tokens (already defined in `src/styles/base.css`, imported globally; use the variables, do not redefine)
--void #07070b page · --deep #0d0d14 rare raised surface · --cream #f4eee3 headlines · --dim (cream 68%) body text · --faint (cream 14%) hairlines · --ember #ff4d5e · --ion #45d0f5 · --gold #d9b26b (brochure gold: ONLY for prize figures and a few key numbers) · --light (ember to ion gradient) · --serif Cormorant Garamond · --sans Instrument Sans · --ease.
Shared classes in base.css: `.wrap` (max 1200px container), `.disp` (display serif style; h2.disp is clamp(40px,6.4vw,92px)), `.lead`, `.lit` (gradient text, max ONE use per page-level headline, and not in every headline), `.btn` (cream pill; `.btn.line` outline pill; `.btn.sm`), `.rule` (fading hairline), `.sec` (section padding), `.sr`. Read base.css first.

## Typography
Display = Cormorant Garamond (use 300/400/500, big, tight leading, tracking -0.02em; italic sparingly). Body/UI = Instrument Sans 400/500/600. Line length under 70ch. Body size 17px+ with 1.6+ line-height. No monospace anywhere.

## Hard rules (these are what separates this from a template)
- NO boxed card grids. No 1px-bordered tiles around every item. If something needs separation use whitespace, a fading hairline, or a single full-width row. At most ONE element per section may sit on a raised surface, and only if it truly needs it.
- NO flat red or cyan blocks, chips or buttons. Red/cyan appear as glow, gradient hairline, or text/number tint on a small scale.
- NO tracked-out ALL-CAPS eyebrow labels above headings. No labels like "WORD — fragment". No middle-dot joined meta strings ("A · B · C"). No "→" appended to button text. No numbered markers (01/02) unless the content truly is a sequence (the timeline is; tracks, goals and sponsor perks are not).
- Do not accent just one word of every headline. Headlines are plain sentences in sentence case.
- Motion: purposeful and sparing. Respect prefers-reduced-motion (base.css already neutralises animations globally; still avoid depending on them). No fade-and-slide-up on every section, no hover lift on everything. Hover feedback is fine on real interactive things (links, rows, buttons).
- DO NOT hide content by default behind a scroll-reveal state: content must be fully visible with no JS state (the owner and screenshots look at the page without scrolling every section). `App.jsx` keeps adding class `in` to each `section` when visible; you may use it for a tiny enhancement but never for visibility.
- Accessibility floor: visible focus (base.css has it), real buttons/links, aria preserved from existing components, contrast on text at least 4.5:1, touch targets 44px.
- Responsive: must work at 360px width up to 1440px+, no horizontal scroll.
- Writing: plain, specific, active voice, sentence case. CTA says what happens ("Register your team"). Do not invent facts.

## Facts you may use (from the printed brochure; do not invent beyond these)
- Evolumin 2.0: national 36-hour hackathon by the ACM Amritapuri Student Chapter, Amrita School of Computing, Amrita Vishwa Vidyapeetham, Amritapuri campus. Tagline: "Fix what's broken. Build what matters." Vision: "Beyond boundaries. Beyond ideas. Building what comes next." Belief: technology becomes meaningful when it solves problems that matter.
- College and high school students invited. Teams of 2 to 4 (from existing site). Ideation online (Phase 1), grand finale on campus offline (Phase 2). Mentors, workshops, resources. Prizes: "attractive cash prizes"; no amounts for 2.0.
- Evolumin 1.0 (first edition): 1,000+ participants, 36 hours, 4 months, 25 finalist teams at the Amritapuri finals, 5.5 lakh prize pool, themes SDGs/Healthcare/Agriculture.
- Chapter: hosted national-level OLabs Hackathon, Outstanding Activities Chapter Award, among 400+ ACM Student Chapters; ACM Amritapuri is a top 10 chapter in India.
- Timeline: Phase 1 online ideation Oct 28 to Nov 3; ideation closes 28 Nov; evaluation 10 Dec; results published; implementation phase (time for teams to come to campus); Phase 2 offline Grand Finale in the 1st week of Feb.
- Grand Finale highlights: guest speakers from industry, networking area, goodies, attractive cash prizes, chance to work with Amrita's research team.
- Contact: evolumin2.0@gmail.com (the ONLY contact to show; no phone numbers, no personal emails).
- There are NO sponsor logos, judges, mentors or prize breakdown yet: do not fake any, do not show "coming soon" blocks for them.
- Assets: `public/logo.jpeg` (1254x1254, pure black background, so use `mix-blend-mode:screen` to melt it into the page), `public/hero.mp4` (small dark circuit-board video loop).
- Use `import.meta.env.BASE_URL + "file"` for public assets as existing code does.

## File ownership (parallel work: ONLY edit your own files)
Each agent owns its component files and creates its own CSS files in `src/styles/`, imported from the component file (`import "../styles/xxx.css"`; App.jsx imports `./styles/shell.css`). Use a unique class prefix so selectors never collide. Never edit another agent's files, `base.css`, `main.jsx`, or `index.html`. If you need a change there, say so in your final report.
`src/data.jsx` is shared: edit it ONLY with the Edit tool (never Write/overwrite) and ONLY the exports your section owns, listed below. The old stylesheet is kept for reference only at `src/styles/legacy.css.bak` (not imported; do not reuse its look).

1. SHELL + HERO (prefix `nv-`, `hr-`): `App.jsx`, `components/Hero.jsx`, `components/Clock.jsx`, `styles/shell.css`, `styles/hero.css`. Owns nav, the left scroll "road" rail, a sticky compact Register pill that appears after the hero, skip link, the hash routing logic (KEEP it working exactly: `#/domain/<id>` page vs home sections; section ids: top, about, domains, timeline, qa, sponsors, register; footer id contact).
2. ABOUT (prefix `ab-`): `components/About.jsx`, `components/Count.jsx`, `components/Head.jsx` (shared heading helper; others may stop using it), `styles/about.css`. data export `GOALS`. Section id `about`.
3. TRACKS (prefix `tk-`): `components/Domains.jsx`, `components/DomainPage.jsx`, `styles/tracks.css`. data exports `DOMAINS`, `TECH`, `ART`/`Art`. Section id `domains`; keep route links `#/domain/<id>` and the click handler behaviour.
4. TIMELINE + FAQ (prefix `tl-`, `fq-`): `components/Timeline.jsx`, `components/QA.jsx`, `hooks.js`, `styles/timeline.css`, `styles/qa.css`. data exports `STAGES`, `HIGHLIGHTS`, `FAQS`. Section ids `timeline`, `qa`.
5. SPONSORS + REGISTER + FOOTER (prefix `sp-`, `rg-`, `ft-`): `components/Sponsors.jsx`, `components/Register.jsx`, `components/Footer.jsx`, `styles/sponsors.css`, `styles/register.css`, `styles/footer.css`. data exports `TIERS`, `PERKS`, `WHY`, `EMAIL`, `LINKS`, `REGISTER_URL`. Section ids `sponsors`, `register`, footer `contact`.

Page order: Hero, About, Tracks, Timeline, FAQ, Sponsors, Register (closing call to action), Footer. Sections sit directly on the void with generous space (use `.sec`); separate with `.rule` hairlines or just space. Each section should feel like a distinct, confident composition rather than the same heading-plus-grid repeated: vary alignment and structure between sections (e.g. asymmetric two-column, full-width list, oversized numbers, a long single column).

## Verification you must do before reporting
1. `cd` to the project and run `npx vite build` and make it pass (do NOT start or stop dev servers; one already runs at http://127.0.0.1:5173/ with hot reload).
2. Look at your section with a real screenshot. Headless Edge works: 
   `"/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe" --headless=new --disable-gpu --hide-scrollbars --window-size=1440,5200 --virtual-time-budget=8000 --screenshot=<scratchpad>/<yourprefix>_full.png http://127.0.0.1:5173/` then crop with PIL (`python -c "from PIL import Image; ..."`) into pieces of ~1100px height and view them with the Read tool. Also check a 390px-wide screenshot (`--window-size=390,5200`). The hero must use `min-height:min(100svh,900px)` so tall screenshot windows don't stretch it. Use the scratchpad dir `<screenshot scratch dir: any temp folder>` for screenshots (prefix filenames with your section name). Other agents are editing other sections concurrently, so a transient build error from someone else's file is possible: wait a minute and retry; only fix your own files.
3. Critique honestly against the hard rules above, fix what fails, and report: files changed, what you built, anything you need from another owner. Keep the report under 250 words.
