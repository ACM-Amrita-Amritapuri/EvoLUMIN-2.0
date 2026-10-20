> NOTE (handoff): paths to a temp scratchpad were rewritten to repo paths (docs/...). Screenshots go to any temp folder. See ../../HANDOFF.md first.

# Evolumin 2.0, round 2: brand theme + 3D + motion + performance (addendum to DESIGN.md)

Read `DESIGN.md` (same folder) first; it still applies (facts, hard rules, ownership model, verification method). This round changes the brief. Project: `H:\Personal\ACM\EvoLUMIN-2.0\evolumin-hackathon` (React 18 + Vite, plain CSS, **JavaScript, not TypeScript**: decided, do not convert anything).

## Owner feedback on round 1
"This is fine but my theme isn't being used properly; it looks like AI slop in between. Use 3D, motion effects, Framer stuff. Very optimized, efficient, functional."
So: the page must look unmistakably like THE EVOLUMIN BRAND, not a generic dark SaaS page.

## The brand (from the printed brochure: study it mentally)
Black stage; a thin DOUBLE GOLD HAIRLINE FRAME with small diamond ornaments (the cover border and every page border); cream serif titles (Cormorant/Lora) with a gold italic word in some titles ("About *Us*"); gold fading rules with a centred diamond (`—◆—`) between blocks; gold numerals in stat cards; and the SMOKY NEON FLAME logo (red left, cyan right). Structure = gold (hairlines, ornaments, frames, key numerals). Light = red/cyan flame (glows, particles, gradient hairlines, the 3D logo). Never flat red/cyan fills.
Shared pieces already in `src/styles/base.css`: `--gold`, `--gold-line`, `.orn` (gold diamond divider: `<div className="orn" aria-hidden="true"><i/></div>`), `.frame` (double gold hairline box; use for AT MOST one deliberately chosen element per section, e.g. the award plaque, the Grand Finale, the sponsor Title column, the register CTA), plus everything from round 1. Use gold ornaments to separate major blocks inside a section (replace plain `.rule` where it fits) and a gold italic word in at most one headline per section where it reads naturally (headline stays sentence case; the brochure does this, so it is on brand, but do not do it in every heading).

## Motion (Framer / `motion` library, already installed: `import { m, useScroll, useTransform, useSpring, useMotionValue, useInView, animate, AnimatePresence, useReducedMotion } from "motion/react"`)
`src/lib/motion.jsx` exports `MotionRoot` (already wrapping the app in main.jsx; it is `LazyMotion` + `domAnimation` + `strict`), `ease`, and `Reveal`. **Use `m.div` / `m.span` etc. (never `motion.div`: strict mode throws).** Rules:
- Animate only `transform` and `opacity`. Never animate width/height/top/left/box-shadow/filter blur radius. Scroll-linked effects use `useScroll({target, offset})` + `useTransform` (no React state per frame). Springs via `useSpring` on motion values.
- Respect `useReducedMotion()`: with reduced motion render the final state, no loops, no parallax.
- Pause or avoid any infinite animation when its element is off-screen (`useInView`) and never run more than a couple at once.
- Motion has a purpose (orientation, emphasis, feedback). One signature moment per section, not decoration everywhere. Do not fade-slide every element on scroll (the owner called round 1 "AI slop in between": generic uniform reveals are exactly that). Prefer: scroll-linked drawing/lighting, word-by-word reading reveals, pointer-reactive tilt/magnet, count-ups, parallax with different speeds.
- Content must remain visible with JS motion disabled (SSR-free app, but screenshots and reduced-motion users): use `initial={false}`-safe patterns, i.e. final state is the default CSS state where practical, or the reduced-motion branch renders final state.

## 3D
Only the hero gets real WebGL (three.js, installed). Elsewhere get 3D FEEL with CSS perspective + pointer-driven `rotateX/rotateY` motion values (springs), parallax depth layers, never extra WebGL contexts.

## Performance budget (this matters: "very optimized")
- Initial JS stays small: the three.js scene is a separate lazily imported chunk (`React.lazy(() => import("./HeroScene.jsx"))`) mounted only after first paint/idle, with the existing static logo `<img>` as the fallback and LCP element. Domain detail page is `React.lazy` too.
- No new runtime dependencies. No layout thrash (don't read layout in scroll handlers; no `getBoundingClientRect` per frame). One rAF loop max per effect; stop when hidden (`document.hidden`, IntersectionObserver).
- Images/video: `loading="lazy"`/`decoding="async"` below the fold, explicit width/height to avoid layout shift. Fonts already preconnect; add `<link rel="preload">` for nothing else.
- CSS: avoid expensive effects over large areas (huge blurred elements must be static or transform-only; `backdrop-filter` only on the small nav/pill). Use `content-visibility:auto` with `contain-intrinsic-size` on below-the-fold sections.
- Final build must succeed; the shell agent reports bundle sizes (`npx vite build`).

## Ownership this round (ONLY edit your own files; shared data.jsx via Edit only)
1. HERO 3D (prefix `hr-`): `components/Hero.jsx`, `components/HeroScene.jsx` (new), `components/Clock.jsx`, `styles/hero.css`.
2. SHELL + THEME + PERF (prefix `nv-`): `App.jsx`, `styles/shell.css`, `styles/base.css`, `main.jsx`, `lib/motion.jsx`, `index.html`, `vite.config.js`. Also lazy-loads DomainPage and adds route transition; owns the page-wide gold frame, grain, rail, nav, sticky pill.
3. ABOUT (prefix `ab-`): `components/About.jsx`, `components/Count.jsx`, `components/Head.jsx`, `styles/about.css`, data `GOALS`.
4. TRACKS (prefix `tk-`): `components/Domains.jsx`, `components/DomainPage.jsx`, `styles/tracks.css`, data `DOMAINS/TECH/ART`.
5. TIMELINE + FAQ (prefix `tl-`, `fq-`): `components/Timeline.jsx`, `components/QA.jsx`, `styles/timeline.css`, `styles/qa.css`, data `STAGES/HIGHLIGHTS/FAQS`.
6. SPONSORS + REGISTER + FOOTER (prefix `sp-`, `rg-`, `ft-`): `components/Sponsors.jsx`, `components/Register.jsx`, `components/Footer.jsx`, `styles/sponsors.css`, `styles/register.css`, `styles/footer.css`, data `TIERS/PERKS/WHY/EMAIL/LINKS/REGISTER_URL`.
If you need a change in someone else's file, put it in your final report instead of editing.

## Verification
Same as DESIGN.md: `npx vite build` must pass (do not start/stop dev servers; one runs at http://127.0.0.1:5173/ with hot reload). Screenshot with headless Edge using a tall window (e.g. `--window-size=1440,5200`), crop with PIL, view with Read; scratchpad dir for images: `<screenshot scratch dir: any temp folder>` (prefix file names with your section). For a true mobile (390px) check use an iframe: write a tiny html file into `public/` named `_<yourprefix>_mob.html` containing `<iframe src="/" width="390" height="9000" style="border:0">`, screenshot it with `--window-size=390,9000`, then DELETE that file. Headless screenshots show WebGL via software rendering and cannot hover or scroll: say what you could not verify. Final report under 250 words: files changed, what you built, perf notes, anything needed from another owner.
