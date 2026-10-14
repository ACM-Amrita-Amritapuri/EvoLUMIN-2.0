import { useState, useEffect, useRef } from "react";
import { Clock } from "./Clock.jsx";

export function Hero() {
  const v = useRef(null), [on, setOn] = useState(true);
  useEffect(() => {
    const el = v.current; el.muted = true; el.defaultMuted = true;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { setOn(false); return; }
    el.play().catch(() => setOn(false));
  }, []);
  const toggle = () => { const el = v.current; if (el.paused) { el.play(); setOn(true); } else { el.pause(); setOn(false); } };
  return (
    <section className="hero" id="top">
      <video className="bgv" ref={v} src={import.meta.env.BASE_URL + "hero.mp4"} autoPlay muted loop playsInline preload="auto" aria-hidden="true" />
      <button className="vbtn" onClick={toggle} aria-label={on ? "Pause background video" : "Play background video"}>{on ? "Pause video" : "Play video"}</button>
      <div className="shade" />
      <div className="wrap">
        <div className="tag">National Hackathon</div>
        <h1 aria-label="Evolumin">{"Evolumin".split("").map((c, i) => <span key={i} aria-hidden="true" style={{ "--i": i }}>{c}</span>)}</h1>
        <p>A hackathon for builders. Pick a domain, solve a real problem and ship it.</p>
        <div className="cta"><a className="btn" href="#register">Register your team</a><a className="btn ghost" href="#timeline">View timeline</a></div>
      </div>
      <Clock />
    </section>
  );
}
