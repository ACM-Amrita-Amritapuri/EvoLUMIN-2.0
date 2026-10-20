import { useState, useEffect, useRef, lazy, Suspense } from "react";
import { flushSync } from "react-dom";
import { m, useScroll, useSpring, useTransform, useMotionValueEvent, useReducedMotion } from "motion/react";
import { Hero } from "./components/Hero.jsx";
import { About } from "./components/About.jsx";
import { Domains } from "./components/Domains.jsx";
import { Timeline } from "./components/Timeline.jsx";
import { QA } from "./components/QA.jsx";
import { Register } from "./components/Register.jsx";
import { Footer } from "./components/Footer.jsx";
import { DOMAINS, LINKS } from "./data.jsx";
import { ease } from "./lib/motion.jsx";
import "./styles/shell.css";

const loadDomain = () => import("./components/DomainPage.jsx");
const DomainPage = lazy(loadDomain);
const Atmosphere = lazy(() => import("./components/Atmosphere.jsx"));
// flow-line nodes: home sections in page order
const NODES = [["top", "Start"], ...LINKS, ["register", "Register"]];
const nodeColor = i => `color-mix(in srgb,var(--ember) ${100 - Math.round(i / (NODES.length - 1) * 100)}%,var(--ion))`;
const nextFrame = () => new Promise(r => requestAnimationFrame(r));
const parseRoute = () => { const r = location.hash.match(/^#\/domain\/([\w-]+)/); return r && DOMAINS.some(x => x.id === r[1]) ? r[1] : null; };

export default function App() {
  const [track, setTrack] = useState(parseRoute);
  const [menu, setMenu] = useState(false);
  const [act, setAct] = useState(""), [solid, setSolid] = useState(false);
  const [atm, setAtm] = useState(false), [pos, setPos] = useState([]);
  const head = useRef(null), tr = useRef(track), jump = useRef(null), first = useRef(true), prevY = useRef(0);
  const reduce = useReducedMotion();
  tr.current = track;
  const d = DOMAINS.find(x => x.id === track);

  // scroll-linked: one motion value feeds the nav (direction) and the road rail (progress)
  const { scrollY, scrollYProgress } = useScroll();
  const prog = useSpring(scrollYProgress, { stiffness: 140, damping: 28, restDelta: 0.0005 });
  const headY = useTransform(prog, [0, 1], ["0%", "100%"]);
  const fill = useTransform(prog, [0, 1], ["inset(0 0 100% 0)", "inset(0 0 0% 0)"]);
  useMotionValueEvent(scrollY, "change", y => setSolid(y > 24)); // setState bails out when unchanged, so no re-render per frame

  // after the incoming page has mounted: jump to its section or reset to the top
  const settle = () => {
    const j = jump.current; jump.current = null;
    if (tr.current) { scrollTo({ top: 0, behavior: "auto" }); return; }
    const id = j !== null ? j : location.hash.slice(1), el = id && document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "auto" }); else scrollTo({ top: 0, behavior: "auto" });
  };
  // route change inside a View Transition (plain swap when unsupported or reduced motion); `next` = track id or null for home
  const go = (next, j = null) => {
    const swap = async () => {
      if (next) await loadDomain();
      flushSync(() => { jump.current = j; setTrack(next); });
      if (next) for (let i = 0; i < 30 && !document.querySelector("main.dp h1"); i++) await nextFrame(); // lazy page committed
      settle();
    };
    if (document.startViewTransition && !matchMedia("(prefers-reduced-motion: reduce)").matches) { const vt = document.startViewTransition(swap); vt.ready.catch(() => {}); } else swap();
  };
  // hash routing: #/domain/<id> is its own page; other hashes are sections of the home page
  useEffect(() => {
    const h = () => {
      const id = parseRoute(); if (id) { if (id !== tr.current) go(id); return; }
      const t = location.hash.slice(1);
      if (tr.current && !(t && document.getElementById(t))) go(null, t);
    };
    addEventListener("hashchange", h); return () => removeEventListener("hashchange", h);
  }, []);
  useEffect(() => {
    setMenu(false);
    document.title = d ? d.name + " · Evolumin Hackathon" : "Evolumin Hackathon";
    if (first.current) { first.current = false; if (track) scrollTo({ top: 0, behavior: "auto" }); else { const el = document.getElementById(location.hash.slice(1)); if (el) el.scrollIntoView({ behavior: "auto" }); } }
  }, [track]);

  // active section via IntersectionObserver (no scroll handler, no layout reads)
  useEffect(() => {
    const secs = [...document.querySelectorAll("section[id]")];
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) setAct(e.target.id); }), { rootMargin: "-40% 0px -59% 0px" });
    secs.forEach(x => io.observe(x));
    return () => io.disconnect();
  }, [track]);

  // Atmosphere mounts after first paint; flow-line node positions (fraction of scroll range) re-measured on layout changes
  useEffect(() => { const t = setTimeout(() => setAtm(true), 300); return () => clearTimeout(t); }, []);
  useEffect(() => {
    if (track) return;
    const measure = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      const p = NODES.map(([id]) => { const el = document.getElementById(id); return el && max > 0 ? Math.min(1, Math.max(0, (el.getBoundingClientRect().top + window.scrollY) / max)) : 0; });
      setPos(o => o.length === p.length && o.every((v, i) => Math.abs(v - p[i]) < .002) ? o : p);
    };
    const ro = new ResizeObserver(measure); ro.observe(document.body); measure();
    return () => ro.disconnect();
  }, [track]);

  const cur = d ? "domains" : act;
  const ai = NODES.findIndex(([id]) => id === cur);
  const dur = reduce ? 0 : 0.2;
  return (
    <>
      <a className="nv-skip" href="#main">Skip to content</a>
      {atm && <Suspense fallback={null}><Atmosphere /></Suspense>}
      <nav className="fl" aria-label="Page progress">
        <i className="fl-track" aria-hidden="true" /><m.i className="fl-fill" aria-hidden="true" style={{ clipPath: fill }} /><m.b className="fl-head" aria-hidden="true" style={{ y: headY }} />
        {!d && pos.length > 0 && NODES.map(([id, l], i) => <a key={id} href={"#" + id} className={"fl-n" + (i <= ai ? " on" : "")} style={{ top: pos[i] * 100 + "%", "--c": nodeColor(i) }} aria-label={l}><i /><b aria-hidden="true">{l}</b></a>)}
      </nav>
      <m.header ref={head} className={"nv" + (solid || menu ? " solid" : "")} animate={{ y: "0%" }} transition={{ duration: reduce ? 0 : 0.35, ease }}><div className="wrap nv-in">
        <a className="nv-brand" href="#top" aria-label="Evolumin home">
          <img className="nv-logo" src={import.meta.env.BASE_URL + "logo-sm.webp"} alt="" width="28" height="28" />
          <span>Evolumin</span>
        </a>
        <nav aria-label="Primary" className={"nv-links" + (menu ? " open" : "")}>{LINKS.map(([id, l]) => <a key={id} href={"#" + id} className={cur === id ? "on" : ""} aria-current={cur === id ? "true" : undefined} onClick={() => setMenu(false)}>{l}</a>)}</nav>
        <a className="btn sm" href="#register">Register</a>
        <button className="nv-burger" aria-label="Menu" aria-expanded={menu} onClick={() => setMenu(!menu)}><span aria-hidden="true" /></button>
      </div></m.header>
      <main id="main" className={d ? "dp" : undefined}>
        {d ? <Suspense fallback={null}><DomainPage d={d} /></Suspense> : <><Hero /><About /><Domains /><Timeline /><QA /></>}
        <Register />
      </main>
      <Footer />
    </>
  );
}
