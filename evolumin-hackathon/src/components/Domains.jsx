import { useEffect, useRef, useState } from "react";
import { m, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { Art, DOMAINS, TECH } from "../data.jsx";
import "../styles/tracks.css";

// Pointer-tilted 3D-feel object. Listens on its closest `host` ancestor; the rect is cached on enter (and dropped on scroll), never read per move.
export function Tilt({ host, max = 7, children }) {
  const ref = useRef(null), reduce = useReducedMotion();
  const x = useMotionValue(0), y = useMotionValue(0), h = useMotionValue(0);
  const cfg = { stiffness: 140, damping: 16, mass: 0.6 };
  const sx = useSpring(x, cfg), sy = useSpring(y, cfg), sh = useSpring(h, cfg);
  const rotateY = useTransform(sx, v => v * max * 2), rotateX = useTransform(sy, v => -v * max * 2);
  const scale = useTransform(sh, v => 1 + v * 0.08);
  const gx = useTransform(sx, v => 50 + v * 100 + "%"), gy = useTransform(sy, v => 50 + v * 100 + "%");
  useEffect(() => {
    const el = ref.current, hostEl = reduce ? null : el.closest(host);
    if (!hostEl) return;
    let r = null;
    const enter = e => { if (e.pointerType === "touch") return; r = el.getBoundingClientRect(); h.set(1); };
    const move = e => {
      if (e.pointerType === "touch") return;
      r = r || el.getBoundingClientRect();
      x.set(Math.max(-0.5, Math.min(0.5, (e.clientX - r.left - r.width / 2) / (r.width * 1.6))));
      y.set(Math.max(-0.5, Math.min(0.5, (e.clientY - r.top - r.height / 2) / (r.height * 1.6))));
    };
    const leave = () => { x.set(0); y.set(0); h.set(0); r = null; };
    const stale = () => { r = null; };
    hostEl.addEventListener("pointerenter", enter); hostEl.addEventListener("pointermove", move); hostEl.addEventListener("pointerleave", leave);
    window.addEventListener("scroll", stale, { passive: true });
    return () => { hostEl.removeEventListener("pointerenter", enter); hostEl.removeEventListener("pointermove", move); hostEl.removeEventListener("pointerleave", leave); window.removeEventListener("scroll", stale); };
  }, [host, reduce]);
  return <span className="tk-tilt" ref={ref}><m.span className="tk-tilt-in" style={reduce ? undefined : { rotateX, rotateY, scale, "--gx": gx, "--gy": gy, "--h": sh }}>{children}</m.span></span>;
}

const N = DOMAINS.length, DWELL = 0.035, smooth = t => t * t * (3 - 2 * t);
// Piecewise map: scroll progress -> panel position 0..N-1, with a short hold on each panel.
const KEYS = DOMAINS.flatMap((_, i) => [Math.max(0, i / (N - 1) - DWELL), Math.min(1, i / (N - 1) + DWELL)]);
const POS = DOMAINS.flatMap((_, i) => [i, i]);
const STACKED = "(max-width:700px), (pointer:coarse), (prefers-reduced-motion:reduce)";

function Panel({ d, i, pos, onOpen }) {
  const par = useTransform(pos, v => (v - i) * 9 + "vw");
  const ink = useTransform(pos, v => (v - i) * -14 + "vw");
  return (
    <li className={"tk-panel " + (i % 2 ? "ion" : "ember")}>
      <m.span className="tk-num" aria-hidden="true" style={{ x: ink }}>{String(i + 1).padStart(2, "0")}</m.span>
      <div className="tk-copy">
        <p className="tk-kick">Track {String(i + 1).padStart(2, "0")} of {String(N).padStart(2, "0")}</p>
        <h3 className="disp tk-name">{d.name}</h3>
        <p className="tk-blurb">{d.blurb}</p>
        <ul className="tk-peek">{d.problems.slice(0, 2).map(([t]) => <li key={t}>{t}</li>)}</ul>
        <a className="tk-open" href={"#/domain/" + d.id} onClick={e => onOpen(e, d.id)} onFocus={() => onOpen.focus(i)}>Open this track<svg viewBox="0 0 48 48" width="44" height="44" aria-hidden="true"><circle cx="24" cy="24" r="23" fill="none" stroke="currentColor" strokeWidth="1" /><path d="M17 24h14m-5-5 5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></a>
      </div>
      <m.div className="tk-par" style={{ x: par }} aria-hidden="true"><div className="tk-orb"><Tilt host=".tk-panel" max={9}><Art id={d.id} /></Tilt></div></m.div>
    </li>
  );
}

export function Domains() {
  const run = useRef(null), [cur, setCur] = useState(0);
  const { scrollYProgress: p } = useScroll({ target: run, offset: ["start start", "end end"] });
  const pos = useTransform(p, KEYS, POS, { ease: smooth });
  const x = useTransform(pos, v => -v / N * 100 + "%");
  const red = useTransform(pos, v => 0.5 + 0.5 * Math.cos(Math.PI * v));
  const blue = useTransform(red, v => 1 - v);
  useMotionValueEvent(pos, "change", v => setCur(Math.round(v)));
  const open = (e, id) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button) return; // let "open in new tab" work
    e.preventDefault(); history.replaceState(null, "", "#domains"); location.hash = "/domain/" + id; // Back returns to this section
  };
  // Tab into a panel: bring the pinned runway to that panel (not needed when stacked).
  open.focus = i => {
    if (matchMedia(STACKED).matches) return;
    const r = run.current, top = r.getBoundingClientRect().top + scrollY;
    window.scrollTo({ top: top + i / (N - 1) * (r.offsetHeight - innerHeight), behavior: "instant" });
  };
  return (
    <section className="sec tk pin" id="domains">
      <div className="wrap tk-intro">
        <h2 className="disp tk-h">Pick the problem <span className="lit">you want to fix.</span></h2>
        <p className="lead tk-lead">Six tracks, each with sample problem statements. Scroll across them, then open one to see its problems, how we judge and what to submit.</p>
      </div>
      <div className="tk-run pin" ref={run}>
        <div className="tk-stage">
          <m.i className="tk-bg ember" style={{ opacity: red }} aria-hidden="true" />
          <m.i className="tk-bg ion" style={{ opacity: blue }} aria-hidden="true" />
          <m.ol className="tk-strip" style={{ x }}>{DOMAINS.map((d, i) => <Panel key={d.id} d={d} i={i} pos={pos} onOpen={open} />)}</m.ol>
          <div className="tk-hud" aria-hidden="true">
            <span className="tk-cur"><b>{String(cur + 1).padStart(2, "0")}</b> / {String(N).padStart(2, "0")} &nbsp;{DOMAINS[cur].name.split(/,| &/)[0]}</span>
            <span className="tk-bar"><m.i style={{ scaleX: p }} /></span>
          </div>
        </div>
      </div>
      <div className="wrap"><p className="tk-tech"><span className="tk-tech-l">Build it with any of these</span>{TECH.map(t => <span key={t}>{t}</span>)}</p></div>
    </section>
  );
}
