import { useState, useEffect, useRef } from "react";
import { Hero } from "./components/Hero.jsx";
import { About } from "./components/About.jsx";
import { Domains } from "./components/Domains.jsx";
import { DomainPage } from "./components/DomainPage.jsx";
import { Timeline } from "./components/Timeline.jsx";
import { QA } from "./components/QA.jsx";
import { Sponsors } from "./components/Sponsors.jsx";
import { Register } from "./components/Register.jsx";
import { Footer } from "./components/Footer.jsx";
import { DOMAINS, LINKS } from "./data.jsx";

const parseRoute = () => { const m = location.hash.match(/^#\/domain\/([\w-]+)/); return m && DOMAINS.some(x => x.id === m[1]) ? m[1] : null; };

export default function App() {
  const [track, setTrack] = useState(parseRoute);
  const [menu, setMenu] = useState(false);
  const [act, setAct] = useState("");
  const bar = useRef(null), tr = useRef(track), jump = useRef(null), first = useRef(true);
  tr.current = track;
  const d = DOMAINS.find(x => x.id === track);
  // hash routing: #/domain/<id> is its own page; other hashes are sections of the home page
  useEffect(() => {
    const h = () => {
      const id = parseRoute(); if (id) { setTrack(id); return; }
      const t = location.hash.slice(1);
      if (tr.current && !(t && document.getElementById(t))) { jump.current = t; setTrack(null); }
    };
    addEventListener("hashchange", h); return () => removeEventListener("hashchange", h);
  }, []);
  useEffect(() => {
    setMenu(false);
    document.title = d ? d.name + " · Evolumin Hackathon" : "Evolumin Hackathon";
    const j = jump.current; jump.current = null;
    if (track) scrollTo({ top: 0, behavior: "instant" });
    else {
      const id = j !== null ? j : location.hash.slice(1), el = id && document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "instant" }); else if (!first.current) scrollTo({ top: 0, behavior: "instant" });
    }
    first.current = false;
  }, [track]);
  useEffect(() => {
    const f = () => {
      bar.current.style.transform = "scaleX(" + scrollY / ((document.documentElement.scrollHeight - innerHeight) || 1) + ")";
      let a = ""; document.querySelectorAll("section[id]").forEach(x => { if (x.getBoundingClientRect().top < innerHeight * .4) a = x.id; }); setAct(a);
    };
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -10% 0px" });
    document.querySelectorAll("section").forEach(x => { io.observe(x); x.querySelectorAll(".facts,.dg,.tiers,.qa").forEach(g => [...g.children].forEach((c, i) => c.style.setProperty("--k", i))); });
    f(); addEventListener("scroll", f, { passive: true });
    return () => { removeEventListener("scroll", f); io.disconnect(); };
  }, [track]);
  const cur = d ? "domains" : act;
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <div className="prog" ref={bar} aria-hidden="true" />
      <header className="nav"><div className="wrap ni">
        <a className="brand" href="#top">Evolumin</a>
        <nav aria-label="Primary" className={"ls" + (menu ? " o" : "")}>{LINKS.map(([id, l]) => <a key={id} href={"#" + id} className={cur === id ? "on" : ""} aria-current={cur === id ? "true" : undefined} onClick={() => setMenu(false)}>{l}</a>)}</nav>
        <a className="btn sm" href="#register">Register</a>
        <button className="bu" aria-label="Menu" aria-expanded={menu} onClick={() => setMenu(!menu)}>{menu ? "✕" : "☰"}</button>
      </div></header>
      <main id="main" className={d ? "dp" : undefined}>
        {d ? <DomainPage key={d.id} d={d} /> : <><Hero /><About /><Domains /><Timeline /><QA /><Sponsors /></>}
        <Register />
      </main>
      <Footer />
    </>
  );
}
