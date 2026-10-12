import React, { useState } from "react";
import { DATES, FAQS, SECS } from "./data";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import About from "./components/About";
import Problems from "./components/Problems";
import Chrono from "./components/Chrono";
import Sponsors from "./components/Sponsors";
import Dates from "./components/Dates";
import QA from "./components/QA";
import Footer from "./components/Footer";
import Intro from "./components/Intro";

export default function App() {
  const [active, setActive] = useState("top");
  React.useEffect(() => {
    const move = e => {
      document.documentElement.style.setProperty("--gx", e.clientX + "px");
      document.documentElement.style.setProperty("--gy", e.clientY + "px");
      const c = e.target.closest && e.target.closest(".dom,.tile,.cd,.cc,.faq,.sp div");
      if (c) { const r = c.getBoundingClientRect(); c.style.setProperty("--mx", e.clientX - r.left + "px"); c.style.setProperty("--my", e.clientY - r.top + "px"); }
    };
    window.addEventListener("pointermove", move);
    let io;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(es => es.forEach(x => { if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); } }), { threshold: 0.08 });
      document.querySelectorAll("section > .wrap > *").forEach(el => { el.classList.add("rv"); io.observe(el); });
    }
    // staggered reveal for cards
    const sel = ".grid > .dom, .tiles > .tile, .stages > div, .count > .cd, .sp > div, .faq";
    if (io) {
      document.querySelectorAll(sel).forEach(el => {
        const sib = [...el.parentNode.children].filter(s => s.matches(sel));
        const i = sib.indexOf(el);
        el.style.setProperty("--i", i % 6);
        el.style.setProperty("--dx", (el.matches(".tile,.stages > div") ? (i % 2 ? 40 : -40) : 0) + "px");
        el.classList.add("rv2");
        io.observe(el);
      });
    }
    // scroll-linked parallax
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const subs = [...document.querySelectorAll(".wrap .sub")];
    subs.forEach(p => {
      if (p.querySelector(".w")) return;
      const words = p.textContent.trim().split(/\s+/);
      p.textContent = "";
      words.forEach((w, i) => {
        const s = document.createElement("span");
        s.className = "w";
        s.style.setProperty("--k", (i / words.length).toFixed(3));
        s.textContent = w + (i < words.length - 1 ? " " : "");
        p.appendChild(s);
      });
    });
    const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
    const secs = [...document.querySelectorAll("section, .wave")];
    const root = document.getElementById("root");
    const layers = [...root.querySelectorAll(":scope > header, :scope > section, :scope > footer")];
    const setTops = () => {
      let y = 0;
      [...root.children].forEach(c => {
        const cs = getComputedStyle(c);
        if (cs.position === "fixed" || cs.display === "none") return;
        const mt = parseFloat(cs.marginTop) || 0, mb = parseFloat(cs.marginBottom) || 0;
        if (layers.includes(c)) { c.style.top = Math.min(0, window.innerHeight - c.offsetHeight) + "px"; c._y0 = y + mt; c._dw = mb; }
        y += c.offsetHeight + mt + mb;
      });
    };
    setTops();
    let ro;
    if ("ResizeObserver" in window) { ro = new ResizeObserver(setTops); layers.forEach(el => ro.observe(el)); }
    window.addEventListener("resize", setTops);
    window.addEventListener("load", setTops);
    const nav = root.querySelector(":scope > nav");
    let lastY = window.scrollY, lastA = "top", lastC = -1, lastQ = -1, tick = false;
    const upd = () => {
      tick = false;
      const y = window.scrollY, vh = window.innerHeight, st = document.documentElement.style;
      const hero = document.getElementById("top");
      st.setProperty("--pg", (y / Math.max(1, document.documentElement.scrollHeight - vh)).toFixed(4));
      let a = "top";
      SECS.forEach(([id]) => { const e = document.getElementById(id); if (e && e.getBoundingClientRect().top <= vh * 0.5) a = id; });
      if (a !== lastA) { lastA = a; setActive(a); }
      const dy = y - lastY; lastY = y;
      if (nav) { if (dy > 4 && y > 300) nav.classList.add("hide"); else if (dy < -4 || y <= 300) nav.classList.remove("hide"); }
      if (reduce) return;
      layers.forEach((el, i) => {
        const nx = layers[i + 1];
        el.style.setProperty("--cov", nx ? clamp(1 - nx.getBoundingClientRect().top / vh).toFixed(3) : "0");
        if (el._y0 !== undefined) {
          const t0 = parseFloat(el.style.top) || 0;
          el.style.setProperty("--dw", (el._dw ? clamp((y - (el._y0 - t0)) / el._dw) : 0).toFixed(3));
          el.style.setProperty("--ent", clamp(1 - (el._y0 - y) / vh).toFixed(3));
        }
      });
      document.querySelectorAll("[data-count]").forEach(el => {
        const sec = el.closest("section");
        const k = clamp((parseFloat(sec.style.getPropertyValue("--ent")) || 0) * 0.6 + (parseFloat(sec.style.getPropertyValue("--dw")) || 0) * 2.2);
        const n = Math.round(parseFloat(el.dataset.count) * k);
        el.textContent = el.dataset.pad ? String(n).padStart(2, "0") : String(n);
      });
      const qa = document.getElementById("qa");
      if (qa && !(window.__qaLock > Date.now())) {
        const c = Math.min(FAQS.length - 1, Math.floor((parseFloat(qa.style.getPropertyValue("--dw")) || 0) * FAQS.length * 0.95));
        if (c !== lastQ) { lastQ = c; window.dispatchEvent(new CustomEvent("qastep", { detail: c })); }
      }
      st.setProperty("--scroll", y + "px");
      st.setProperty("--hp", Math.min(1, y / ((hero && hero.offsetHeight) || vh)).toFixed(3));
      secs.forEach(s => {
        const b = s.getBoundingClientRect();
        if (b.bottom < -300 || b.top > vh + 300) return;
        const nat = s._y0 !== undefined ? s._y0 + s.offsetHeight / 2 - y : b.top + b.height / 2;
        s.style.setProperty("--sy", clamp((nat - vh / 2) / vh, -3, 3).toFixed(3));
        s.style.setProperty("--exit", clamp(1 - b.bottom / (vh * 0.45)).toFixed(3));
      });
      const vw = document.querySelector(".vtw");
      const ds = document.getElementById("dates");
      if (vw && ds && ds._y0 !== undefined) {
        const pin = ds._y0 - (parseFloat(ds.style.top) || 0);
        const p = clamp((y - (pin - vh * 0.35)) / Math.max(1, (pin + (ds._dw || 0) * 0.9) - (pin - vh * 0.35)));
        const c = Math.min(DATES.length - 1, Math.floor(p * DATES.length));
        if (!(window.__tlLock > Date.now()) && c !== lastC) { lastC = c; window.dispatchEvent(new CustomEvent("tlstep", { detail: c })); }
      }
      const ft = document.querySelector(".foot");
      if (ft) { const b = ft.getBoundingClientRect(); ft.style.setProperty("--fp", clamp((vh - b.top) / (vh * 0.6)).toFixed(3)); }
      subs.forEach(p => {
        const b = p.getBoundingClientRect();
        p.style.setProperty("--sp", (clamp((vh * 0.92 - b.top) / (vh * 0.45)) * 1.15).toFixed(3));
      });
    };
    const onS = () => { if (!tick) { tick = true; requestAnimationFrame(upd); } };
    window.addEventListener("scroll", onS, { passive: true });
    window.addEventListener("resize", onS);
    upd();
    return () => { window.removeEventListener("pointermove", move); window.removeEventListener("scroll", onS); window.removeEventListener("resize", onS); window.removeEventListener("resize", setTops); window.removeEventListener("load", setTops); ro && ro.disconnect(); io && io.disconnect(); };
  }, []);
  const go = id => {
    const el = document.getElementById(id);
    if (!el || id === "top") { window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    let y = 0;
    for (const c of document.getElementById("root").children) {
      if (c === el) break;
      const cs = getComputedStyle(c);
      if (cs.position === "fixed" || cs.display === "none") continue;
      y += c.offsetHeight + parseFloat(cs.marginTop) + parseFloat(cs.marginBottom);
    }
    window.scrollTo({ top: y, behavior: "smooth" });
  };
  return (
    <>
      <Intro />
      <div className="grain" aria-hidden="true" />
      <div className="prog" aria-hidden="true" />
      <div className="dots" role="navigation" aria-label="Page sections">
        {SECS.map(([id, l]) => <button key={id} className={active === id ? "on" : ""} data-label={l} aria-label={l} onClick={() => go(id)} />)}
      </div>
      {active !== "top" && <button className="totop" aria-label="Back to top" onClick={() => go("top")}>↑</button>}
      <Nav go={go} />
      <Hero go={go} />
      <About />
      <Problems />
      <Chrono />
      <Dates />
      <QA />
      <Sponsors />
      <Footer go={go} />
    </>
  );
}
