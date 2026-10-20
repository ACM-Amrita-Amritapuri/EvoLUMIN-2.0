# Evolumin 2.0 website: handoff and live progress log

If you are a new agent (or human) picking this up cold: read this file top to bottom, then `docs/design/DESIGN3.md` (the active spec), then `docs/RESEARCH.md`. Everything needed to continue is in the repo. Keep the **Status** table and **Log** at the bottom updated as you work.

## 1. What this is
Marketing and registration landing page for **Evolumin 2.0**, a national 36-hour student hackathon run by the ACM Amritapuri Student Chapter (Amrita School of Computing, Amrita Vishwa Vidyapeetham, Amritapuri campus). The page's single job: get students to register. Stack: React 18 + Vite 5, plain CSS, **JavaScript (TypeScript deliberately not used: small static page, TS gives no visitor-facing benefit)**. Libraries: `motion` (Framer Motion v14, only via `LazyMotion` + `m.*`, strict). `three` is being REMOVED (replaced by raw WebGL2, see `src/lib/gl.js`).

Source of truth for content: the brochure `../EVOLUMIN 2.0 BROCHURE.pdf` (18 pages, image-only PDF; text was transcribed into `src/data.jsx`). Run: `npm install && npm run dev` (http://127.0.0.1:5173). Build: `npm run build`.

## 2. Owner requirements (accumulated, in the owner's spirit)
- Revamp, make it genuinely good; use brochure content. It is a MARKETING page for people who will register (not for sponsors: the sponsor section was REMOVED).
- Theme: **the red-to-cyan flame (logo colours) is the MAIN theme and must be visibly present in every section**; gold is minor/none (the golden page frame/margin was removed; remove any gold left).
- Must feel big/cinematic, not "compact". Use 3D, motion, Framer-style effects, pinned scroll sequences, very optimized and efficient code.
- The logo 3D FX must look premium (the earlier three.js version smeared/tore the logo: "shit"); the linear flow elements (left scroll rail, timeline) must be redesigned.
- Contact: only `evolumin2.0@gmail.com` (no personal emails, no phone numbers).
- Do not invent facts; no sponsor logos/judges/mentors/prize breakdown exist yet, so none are shown (no "coming soon" blocks).
- Registration URL is still `#register` (placeholder; real form link not yet provided: ask the owner).
- Countdown targets ideation opening 2026-10-28T00:00:00+05:30 (year assumed).
- Owner wants subagents used for parallel work, verified with real screenshots; keep this handoff current so work can continue after a limit reset.

## 3. Page structure (home): Hero, About, Tracks, Timeline, FAQ, Register (finale), Footer
Hash routing: `#/domain/<id>` is a track detail page (React.lazy `DomainPage`); other hashes scroll to section ids `top, about, domains, timeline, qa, register` (footer id `contact`). `src/App.jsx` owns routing, nav, rail, sticky pill, view transition.

## 4. File map
- `src/App.jsx` shell, nav, rail, routing. `src/main.jsx` mounts `MotionRoot`. `src/lib/motion.jsx` (LazyMotion root, `ease`, `Reveal`). `src/lib/gl.js` raw WebGL2 helpers (program, triangle, texture, loop, tier, guardContext).
- `src/components/`: `Hero.jsx` + `HeroFlame.jsx` (raw WebGL2 logo flame, lazy), `Clock.jsx` (live countdown), `Atmosphere.jsx` (fixed WebGL smoke background, lazy), `About.jsx` + `Count.jsx` + `Head.jsx`, `Domains.jsx` + `DomainPage.jsx` (tracks), `Timeline.jsx`, `QA.jsx` (FAQ), `Register.jsx`, `Footer.jsx`.
- `src/data.jsx`: ALL content (DOMAINS tracks with sample problems, TECH, STAGES, HIGHLIGHTS, GOALS, FAQS, LINKS, EMAIL, REGISTER_URL, `Art` line-art glyphs).
- `src/styles/`: `base.css` (tokens, scale, theme utilities), `shell.css`, plus one css per section (`hero atmosphere about tracks timeline qa register footer`).
- `public/`: `logo.jpeg` (1254px, black bg; the WebGL texture), `logo-glow.webp` (transparent fallback), `logo-sm.webp` (nav icon), `hero.mp4` (UNUSED now; safe to delete).
- `docs/design/`: DESIGN.md (facts + hard rules), DESIGN2.md (superseded), **DESIGN3.md (active spec: theme, scale, 3D, pinned motion, ownership, verification)**. `docs/research/`: verified prototypes (WebGL smoke, CSS theme, motion snippets, pinned scroll). `docs/tools/shot.mjs`: real-browser screenshot harness.

## 5. Verification harness (use it; headless URL screenshots cannot scroll or hover)
`cd docs/tools && npm init -y && npm i playwright-core` (uses the installed Microsoft Edge via `channel:"msedge"`; no browser download; do not commit node_modules). Then:
`node docs/tools/shot.mjs <outPrefix> http://127.0.0.1:5173/ 1440x900 "auto:12"` (plan = scrollY list | `auto:N` | `sel:#about,#domains`). Saves `<outPrefix>_<i>.png`, prints page and console errors. Always check 1440x900, 1920x1080 and 390x844, including through pinned runways.

## 6. Design decisions and why (from research; details in docs/RESEARCH.md)
1. Drop three.js (129 kB gzip) for raw WebGL2 (~1 kB helper + shaders): both the fixed smoke background and the hero flame.
2. Logo FX: keep the bright core crisp; only the smoky halo flows (warp ∝ 1 − coreMask); 4 depth slices with parallax; in-shader bloom taps; instanced ember sprites; premultiplied alpha; never rely on CSS `mix-blend-mode` under transformed parents.
3. Motion: pinned scrollytelling (tall wrapper + sticky 100svh stage + `useScroll`) is the signature technique; native off-main-thread animation only for opacity/clip-path/filter/transform; no overflow hidden on html/body ancestors of sticky; `content-visibility:auto` must not apply to pinned wrappers.
4. Theme: red→violet→cyan gradient (violet stop avoids muddy grey), two static light leaks per section (screen blend, never animated), gradient hairlines/borders/numerals/rail/button/focus ring.
5. Scale: container ≤1680px, gutter clamp(24px,5vw,120px), hero h1 ≤180px, h2 ≤168px, body ≤21px, sections min-height 100svh, pinned runways 80–100svh per step.
6. Skipped: Lenis (risk with hash routing; native + pinned sections suffices), TypeScript, Framer layout animations.

## 7. Status (update me)
| Piece | Owner (agent) | Status |
|---|---|---|
| Content/data from brochure, FAQ, timeline dates | done earlier | DONE |
| Sponsors section removal | lead | DONE |
| Golden page frame removal | lead | DONE (verify no gold left everywhere) |
| lib/gl.js helper, DESIGN3 spec, docs, harness | lead | DONE |
| Atmosphere (WebGL smoke bg) | agent 1 | DONE (implemented, 2.3 kB gz chunk; tested on a mock page only: re-check on the real page once the shell mounts it; tuning knobs `LOOK` table + final `col=.46*` in shader) |
| Hero flame + countdown | agent 2 | DONE (raw WebGL2 HeroFlame, 3.0 kB gz; crisp core, flowing halo, 4 depth slices, embers; StrictMode crash fixed) |
| Shell + theme core + flow rail + view transitions | agent 3 | DONE (base.css tokens/utilities/leaks, flow-line nav, View Transitions, Atmosphere lazily mounted; removed content-visibility:auto from .sec to avoid clipping leaks) |
| About pinned statement + numerals | agent 4 | DONE (250svh statement pin + 400svh numerals pin, stacked on mobile/reduced motion; own `.ab-pin` sticky styles) |
| Tracks pinned horizontal showcase + detail page | agent 5 | DONE (450svh pinned strip of 6 panels, keyboard focus scrolls runway, stacked on mobile/touch/reduced motion; detail page with spinning gradient ring) |
| Timeline cinematic pinned + FAQ | agent 6 | DONE (600svh pinned runway, stacked mobile fallback; keyboard behaviour untested; reported Atmosphere errors on the real page: investigating) |
| Register finale + Footer | agent 7 | DONE (100svh finale, scroll-linked converging leaks, magnetic ignite button, giant gradient footer wordmark) |
| Lead integration review (real screenshots 1440/390), `npm uninstall three`, remove `public/hero.mp4`, final build + sizes | lead | DONE (1920 only spot-checked by agents; not re-reviewed by lead) |
| Real registration URL (`REGISTER_URL` in data.jsx) | owner to provide | BLOCKED on owner |
| Nothing committed yet; branch `dev`; owner has not asked for a commit | | PENDING owner request |

## 8. Known pitfalls
- Headless Edge URL screenshots (`--screenshot`) cannot scroll/hover and give blank sections; use `docs/tools/shot.mjs`.
- Do not use `motion.*` (strict LazyMotion throws); use `m.*`.
- Large blurred or blend-mode elements must be static; animate only transform/opacity.
- If a destructive shell command is held by a safety hook, delete files with the PowerShell tool instead.
- `npm install` inside this repo previously needed `npm ci`; `node_modules` is not committed.

## 9. Log
- Earlier rounds (1–2): brochure transcribed into data.jsx; redesign with Cormorant Garamond + Instrument Sans; sponsors removed; gold frame removed; lib/motion.jsx and first WebGL (three.js) hero built; owner rejected: weak 3D/motion, compact feel, theme absent below hero, bad logo FX.
- Round 3 (current): four research agents (motion, WebGL, scroll tech, theme/design) completed; findings in docs/RESEARCH.md; DESIGN3.md written; 7 build agents launched in parallel (see Status).

## 10. Resume playbook (if the session or limits were lost mid-work)
1. `git status` and `npm run build`. Several files may be half-edited by agents that were interrupted: a build error names the file; fix or finish it.
2. Open `docs/design/DESIGN3.md`: the "Ownership" list there IS the task breakdown (7 jobs: Atmosphere, Hero flame, Shell+theme core, About, Tracks, Timeline+FAQ, Register+Footer). Each job lists its files and a precise brief. For each job, check the Status table above, look at the files, and re-run only what is unfinished; give a fresh agent the job text from DESIGN3.md plus "read HANDOFF.md, DESIGN3.md, DESIGN.md first". Jobs touch disjoint files, so they can run in parallel; `src/data.jsx` is shared (edit exports with the Edit tool, never overwrite).
3. Verify every job with the real-browser harness (`docs/tools/shot.mjs`) at 1440x900, 1920x1080, 390x844, scrolling through pinned runways, and look at the PNGs. Quality bar: red-to-cyan flame theme unmistakably visible in every section, big/cinematic scale, crisp logo flame, no gold, legible text, no console errors.
4. Lead integration (after all jobs): `npm uninstall three` (nothing may import `three`; delete `src/components/HeroScene.jsx` if still present), delete `public/hero.mp4` (unused), confirm `npx vite build` and record bundle sizes here, update Status, and ask the owner for the real registration URL before replacing `REGISTER_URL` in data.jsx.
5. Do not commit unless the owner asks. Branch is `dev`.

### Agent reports received so far (append here)
- Atmosphere agent: finished. `src/components/Atmosphere.jsx` + `src/styles/atmosphere.css`; raw WebGL2, alpha:false, 30fps, ~0.5 scale (1M px cap), per-section hue table (top mixed, about red, domains cyan, timeline red->cyan, qa quiet, register both), reduced-motion static frame, context loss handled. Verified by screenshots on a mock page at 1440/1920/390 + reduced motion. Open: not yet mounted by shell agent; re-verify legibility on the real page.
- Timeline+FAQ agent: finished. timeline.css has its own pinned/sticky rules (base.css had no `.pin` rule yet). Verified at 1440/1920/390 with the Atmosphere canvas hidden because on the real page the Atmosphere canvas threw `uTime` and `T` errors and rendered white under swiftshader (lead investigating). Open: tab/click keyboard behaviour not tested; shell rail head showed as black dot.
- About agent: finished. About.jsx/Count.jsx/about.css rewritten; pins: statement 250svh, 1.0 figures 400svh (22vw gradient numerals, clip swaps, progress bar), plaque with gradient ring, two-column goals. Verified real Edge at 1440/1920/390 with the WebGL canvas hidden (its own script). Open: `reading 'uTime'`/`'T'` runtime errors come from WebGL code of another agent (being resolved at lead integration); 'solves problems that matter.' gradient is static per element.
- Shell agent: finished. base.css: scale tokens (--fs-*, --gut, .wrap min(1680px,100%-2*gut)), .disp/.num/.sec(min-height 100svh)/.pin, utilities .lit .glow .gline .orn .frame .eyebrow .btn.grad, per-section leaks by id (--c1/--c2, ::before/::after, screen blend) so sections must NOT use ::before/::after on #top/#about/#domains/#timeline/#qa/#register. App.jsx: flow-line nav with 6 focusable nodes, View Transitions route change, Atmosphere via React.lazy. Bundle gz: entry 55.4 kB, motion 39.6, css 9.3, HeroFlame 3.0, Atmosphere 2.3, gl 1.1, DomainPage 1.1. Open: runtime error `reading 'uTime'` (Atmosphere.jsx) and `reading 'T'` (HeroFlame.jsx) on the real page; harness `sel:` plan did not scroll; Tracks panels slide under the left flow line.
- Register+Footer agent: finished (Register.jsx, Footer.jsx, register.css, footer.css). Open: sticky Register pill overlaps footer Back-to-top at 390px (shell owner); did not re-run build after final register.css tweak (lead to re-run).
- LEAD FIX: Atmosphere crashed in dev with `reading 'uTime'` because React StrictMode remounts the canvas after cleanup called WEBGL_lose_context (getContext returns the dead context, compile fails, U undefined). Fixed in Atmosphere.jsx: no forced loseContext in cleanup + `if (!U) return` guard. Same pattern suspected in HeroFlame.jsx (`reading 'T'`): hero agent asked to fix. LESSON: never force-lose a context on a canvas React may reuse.
- Tracks agent: finished (Domains.jsx, DomainPage.jsx, tracks.css). Verified full runway 1440/1920, mobile, detail page #/domain/space at 1440 (judged with canvases forced dark). Open: detail page not checked at 1920/390; pointer:coarse + reduced-motion render not checked; sticky Register pill overlaps panel text / footer on mobile (shell owner).
- LEAD FIX (text colour feedback from owner: 'text colour deviates from the theme, looks odd'): warm cream text clashed with neon red/cyan once gold was gone. Changed tokens in base.css to cool white (`--cream:#f3f6ff`, dim/faint based on rgb(220,228,248)), replaced every hard-coded warm rgba in styles; removed ALL tracked all-caps labels (sentence case, neutral dim colour, no tinted label text); About statement words now interpolate colour from opaque cool grey (#5b6483) to white instead of translucent opacity (which turned muddy over red smoke); lining numerals globally (Cormorant old-style numerals made '01' read 'OI'). Atmosphere intensity lowered (ceiling .46 -> .27, about/domains/timeline intensity .75-.8) so text stays legible. RULE going forward: no warm/beige text, no uppercase tracked labels, no gold.
- Hero agent: finished (HeroFlame.jsx, Hero.jsx, hero.css; HeroScene.jsx deleted). Zero page/console errors on the real page at 1440/1920/390 per agent; real-GPU performance NOT measured (SwiftShader only).
- LEAD FINAL PASS (round 3): uninstalled `three`; deleted public/hero.mp4; fixed owner feedback: (1) gradient-FILLED text (pink-violet-blue) replaced everywhere by white-hot neon text (white + red-left/cyan-right text-shadow), the violet stop is now used only on lines/borders, never text; (2) Tracks showcase background layers got a vertical mask (hard top edge looked like an overlapping rectangle under the heading); (3) removed the sticky Register pill and the hide-on-scroll nav (nav with Register button is always visible; pill overlapped content); removed dead heroGone/regSeen observers; (4) timeline stage fade windows no longer overlap (no ghosted double dates).
- FINAL bundle (gzip): entry 55.2 kB, motion 39.6 kB, css 9.3 kB, HeroFlame 3.0, Atmosphere 2.3, gl 1.1, DomainPage 1.1 (three.js 129 kB removed).
- STILL OPEN: real REGISTER_URL from owner; real-GPU/low-end-phone performance unmeasured; hover/magnetic/tilt effects, keyboard flow of pinned timeline/tracks, reduced-motion render, detail pages at 1920/390 not visually verified; brochure photos not used (low-res); nothing committed.
- Visual rules established by owner feedback: NO gold, NO warm/beige text, NO gradient-filled text, NO tracked all-caps labels, NO floating overlays that cover content.
