import { useEffect, useRef } from "react";
import { m, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Art, DOMAINS } from "../data.jsx";
import { Tilt } from "./Domains.jsx";
import "../styles/tracks.css";

// Scroll parallax on the glyph: transform only, no React state.
function Para({ children }) {
  const ref = useRef(null), reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [36, -36]);
  return <m.div ref={ref} style={reduce ? undefined : { y }}>{children}</m.div>;
}

export function DomainPage({ d }) {
  const h = useRef(null), i = DOMAINS.indexOf(d), N = DOMAINS.length;
  const prev = DOMAINS[(i + N - 1) % N], next = DOMAINS[(i + 1) % N];
  useEffect(() => { h.current.focus({ preventScroll: true }); }, []);
  return (
    <div className={"tk-page " + (i % 2 ? "ion" : "ember")}>
      <div className="wrap">
        <nav className="tk-crumb" aria-label="Breadcrumb"><ol><li><a href="#top">Home</a></li><li><a href="#domains">Tracks</a></li><li aria-current="page">{d.name}</li></ol></nav>
        <div className="tk-hero">
          <div>
            <h1 className="disp tk-title" ref={h} tabIndex={-1}>{d.name}</h1>
            <p className="lead">{d.blurb}</p>
            <p className="tk-meta">A 36 hour build, in teams of 2 to 4.</p>
            <div className="tk-cta"><a className="btn" href="#register">Register your team</a><a className="tk-back" href="#domains">See all tracks</a></div>
          </div>
          <Para><div className="tk-glyph" aria-hidden="true"><Tilt host=".tk-glyph" max={11}><Art id={d.id} /></Tilt></div></Para>
        </div>
        <section className="tk-sec">
          <h2 className="disp">Problem statements</h2>
          <p className="lead">Build a working solution for one of these. Pick the one you can ship best and make it useful for real people.</p>
          <ol className="tk-probs">{d.problems.map(([t, x]) => <li key={t}><h3>{t}</h3><p>{x}</p></li>)}</ol>
        </section>
        <section className="tk-sec tk-two">
          <div><h2 className="disp">Judging criteria</h2><ul>{["Innovation", "Impact", "Technical depth", "Feasibility", "Presentation"].map(c => <li key={c}>{c}</li>)}</ul></div>
          <div><h2 className="disp">What to submit</h2><ul>{["A short abstract for the idea round", "A working prototype", "Source code repository", "Pitch deck and live demo"].map(c => <li key={c}>{c}</li>)}</ul></div>
        </section>
        <nav className="tk-pn" aria-label="More tracks">
          <a href={"#/domain/" + prev.id}><small>Previous track</small>{prev.name}</a>
          <a className="nx" href={"#/domain/" + next.id}><small>Next track</small>{next.name}</a>
        </nav>
      </div>
    </div>
  );
}

export default DomainPage;
