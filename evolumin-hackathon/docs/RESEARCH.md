# Research findings (round 3), condensed. Prototypes are in docs/research/.

## Motion library (`motion` 14.4, installed)
- Native (off-main-thread) scroll animation only when: `useScroll` has no target/offset (needs ScrollTimeline) or a target with a mappable 2-point edge/percent offset (needs ViewTimeline); and the animated style key is one of `opacity, clipPath, filter, transform, backgroundColor`; and `useTransform` gets ONE motion value with input and output arrays (no function transforms, springs, velocity, or templates). `x/y/scale/rotate`, `vh/px` offsets, and `["start start","end end"]` sticky offsets fall back to JS (still fine for a few elements; one rAF-batched read per frame, no React re-render).
- Bundle (gzip, over React): `m`+`domAnimation` +31 kB; `domMax` +46 kB; hooks only (`useScroll/useTransform/useSpring`) +12 kB; `motion/mini` `animate` 3.4 kB standalone; `scroll()` 3.8 kB standalone. We use LazyMotion + domAnimation + `m.*` (strict).
- Verified snippets (docs/research/motion-snippets.jsx): pinned sticky layers, word-by-word scroll reveal (one useScroll, motion value per word), spring tilt with `useMotionTemplate`, count-up writing to DOM, stagger, scroll-velocity skew, route transition, CSS-variable motion values.
- Do not: `motion.*` in strict mode; transform a `useScroll` target or ancestors; per-frame layout reads; `will-change` everywhere; blend-mode/filter on the same element as a scroll transform; animate width/height/blur; forget `ctrl.stop()` cleanups (StrictMode); `once:true` with absurd margins.

## WebGL
- three.js tree-shaken ≈ 133 kB gzip for either goal; OGL ≈ 13–16 kB; raw WebGL2 helper ≈ 1 kB (+2–4 kB shaders). Decision: raw WebGL2 for both the background smoke and the hero flame (≈ 8–10 kB total vs 129 kB).
- Background smoke: fixed canvas, 0.5 scale, 30fps, `alpha:false`, domain-warped fbm in ember/ion; fixes found: remap fbm `(f-.3)*2.2` for real black gaps; per-channel tonemap `1-exp(-c*1.5)` (not Reinhard, which greys the colours); dither ±0.5/255; make red/cyan densities mutually exclusive to avoid grey-purple overlap; cap canvas ≈ 1M px. Verified prototype: docs/research/webgl-smoke-prototype.html (shader source inside).
- Hero flame upgrade plan: single fullscreen pass with 4 depth slices (parallax, scale, curl-noise UV flow) + bloom via 6–8 `textureLod` taps + chromatic edge; embers as one instanced soft-sprite draw; skip trails and real post-processing bloom. Low tier (pointer:coarse, ≤4 cores, ≤4GB): 2 slices, fewer taps/embers. Premultiplied alpha output; avoid CSS mix-blend-mode under transformed parents (shows black box).
- Two canvases (background + hero) are fine; hero loop only while visible; handle context loss by rebuilding in one `init()`.

## Scroll technology
- Lenis (1.3.27; 8.3 kB core): works with sticky and useScroll but conflicts with hash routing/`scroll-behavior:smooth`; decision: skip.
- CSS scroll-driven animations (`animation-timeline: scroll()/view()`, `animation-range`): Chrome/Edge 115+, Safari 26+, Firefox 161+; verified in Edge; use with `@supports` as progressive enhancement. View Transitions (same-document) supported broadly: use for home↔domain route change.
- Sticky pin pattern verified in Edge: `.pin{height:400svh}` with `.pin>div{position:sticky;top:0;height:100svh}`. BREAKS if both html and body have `overflow-x:hidden` (use `clip`); do not put overflow on sticky ancestors; exempt pinned wrappers from `content-visibility:auto`; mobile collapses pinned effects.
- Why the old page felt compact: content column ≈1140px of a 1920px viewport; body text 15–16px; sections had no min-height; page only ≈12.5k px tall at 1080p. Target ≈20–24k px with pinned runways.

## Theme / design references
- Real CSS from Linear/Resend/Raycast/Vercel/Nothing/Arc: light is large offset radial-gradients or static blurred layers (≥8rem), gradient borders are 1px mask-composite rings at 20–55% alpha, rim lights are corner highlights, only transform/angle is animated, containers 1152–1550px.
- Per-section light plan, gradient-element list, scale tokens and signature moments are in docs/design/DESIGN3.md items 5–7. Verified CSS prototype: docs/research/css-theme-prototype.html (light leaks, gradient ring, glowing numerals, hairline, rail, button). Use a violet stop (#b06cff) in the gradient to avoid muddy grey.
