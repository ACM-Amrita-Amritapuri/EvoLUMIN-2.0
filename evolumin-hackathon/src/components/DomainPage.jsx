import { useState, useEffect, useRef } from "react";
import { Art, DOMAINS } from "../data.jsx";

export function DomainPage({ d }) {
  const h = useRef(null), i = DOMAINS.indexOf(d), N = DOMAINS.length;
  const prev = DOMAINS[(i + N - 1) % N], next = DOMAINS[(i + 1) % N];
  useEffect(() => { h.current.focus({ preventScroll: true }); }, []);
  return (
    <div className="dpg">
      <div className="wrap">
        <nav className="crumb" aria-label="Breadcrumb"><ol><li><a href="#top">Home</a></li><li><a href="#domains">Domains</a></li><li aria-current="page">{d.name}</li></ol></nav>
        <div className="dhero">
          <div>
            <div className="eb">Domain {String(i + 1).padStart(2, "0")} of {String(N).padStart(2, "0")}</div>
            <h1 ref={h} tabIndex={-1}>{d.name}</h1>
            <p className="lead">{d.blurb}</p>
            <div className="dmeta"><div><b>{d.problems.length}</b><span>Problem {d.problems.length === 1 ? "statement" : "statements"}</span></div><div><b>36 h</b><span>Build sprint</span></div><div><b>2 to 4</b><span>Team size</span></div></div>
            <div className="cta"><a className="btn" href="#register">Register your team</a><a className="btn ghost" href="#domains">All domains</a></div>
          </div>
          <div className="art" aria-hidden="true"><Art id={d.id} /></div>
        </div>
        <section className="ds">
          <h2>Problem statements</h2>
          <p className="lead">Teams in this domain build a working solution for one of the problems below. Choose the one you can ship best and make it useful for real people.</p>
          <div className="pgrid">{d.problems.map(([t, x], k) => <article className="pc" key={t}><span>Problem {k + 1}</span><h3>{t}</h3><p>{x}</p></article>)}</div>
        </section>
        <section className="ds dtwo">
          <div><h2>Judging criteria</h2><ul className="lst">{["Innovation", "Impact", "Technical depth", "Feasibility", "Presentation"].map(c => <li key={c}>{c}</li>)}</ul></div>
          <div><h2>What to submit</h2><ol className="lst">{["A short abstract for the idea round", "A working prototype", "Source code repository", "Pitch deck and live demo"].map(c => <li key={c}>{c}</li>)}</ol></div>
        </section>
        <nav className="dnav" aria-label="More domains">
          <a className="dn" href={"#/domain/" + prev.id}><small>← Previous domain</small><b>{prev.name}</b></a>
          <a className="dn nx" href={"#/domain/" + next.id}><small>Next domain →</small><b>{next.name}</b></a>
        </nav>
      </div>
    </div>
  );
}
