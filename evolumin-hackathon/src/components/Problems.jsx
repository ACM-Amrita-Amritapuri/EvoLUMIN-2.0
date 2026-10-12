import React, { useState } from "react";
import { PAL, DOMAINS } from "../data";

export default function Problems() {
  const [open, setOpen] = useState(null);
  const ref = React.useRef(null);
  const di = DOMAINS.findIndex(d => d.id === open);
  const dom = DOMAINS[di];
  const N = DOMAINS.length;
  const pad = n => String(n).padStart(2, "0");
  const step = n => setOpen(DOMAINS[(di + n + N) % N].id);
  React.useEffect(() => {
    document.body.style.overflow = dom ? "hidden" : "";
    if (ref.current) ref.current.scrollTo(0, 0);
    const k = e => {
      if (!dom) return;
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open]);
  return (
    <section id="problems" className={dom ? "open" : ""}>
      <div className="wrap">
        <h2>Choose Your Domain.</h2>
        <p className="sub">Pick a domain to see its problem statements.</p>
        <div className="grid">
          {DOMAINS.map((d, i) => (
            <button key={d.id} className="dom" aria-label={"Open " + d.name} style={{ "--c": PAL[i][0] }} onClick={() => setOpen(d.id)}>
              <div className="dtop"><div className="ic">{d.icon}</div><span className="idx">{pad(i + 1)}</span></div>
              <h3>{d.name}</h3><p className="dblurb">{d.blurb}</p>
              <div className="dfoot"><small>{d.problems.length} problem{d.problems.length > 1 ? "s" : ""}</small><span className="go">→</span></div>
            </button>
          ))}
        </div>
      </div>
      {dom && (
        <div className="full" ref={ref} role="dialog" aria-modal="true" aria-label={dom.name} style={{ "--c": PAL[di][0] }}>
          <div className="full-bar">
            <button className="backbtn" onClick={() => setOpen(null)}>← Back</button>
            <span className="crumb">Domains / <b>{dom.name}</b></span>
            <span className="cnt">{pad(di + 1)} / {pad(N)}</span>
            <button className="x" onClick={() => setOpen(null)} aria-label="Close">✕</button>
          </div>
          <div className="full-layout">
            <aside className="side">
              {DOMAINS.map((d, i) => (
                <button key={d.id} className={"sd" + (d.id === open ? " on" : "")} style={{ "--c": PAL[i][0] }} onClick={() => setOpen(d.id)}>
                  <span>{d.icon}</span><b>{d.name}</b><em>{d.problems.length}</em>
                </button>
              ))}
            </aside>
            <div className="full-body" key={dom.id}>
              <h2>{dom.name}</h2>
              <p className="sub">{dom.blurb} Choose one problem to build · {dom.problems.length} problem statement{dom.problems.length > 1 ? "s" : ""}</p>
              <div className="fgrid">
                {dom.problems.map((p, i) => (
                  <article key={p.t} className="ps" style={{ background: `linear-gradient(145deg,${PAL[(di + i) % 6][0]},${PAL[(di + i) % 6][1]})`, animationDelay: i * 90 + "ms" }}>
                    <span className="tag">PS {pad(i + 1)}</span>
                    <h3>{p.t}</h3>
                    <p>{p.d}</p>
                    <div className="big">{pad(i + 1)}</div>
                  </article>
                ))}
              </div>
              <div className="pn">
                <button onClick={() => step(-1)}><small>Previous</small>{DOMAINS[(di - 1 + N) % N].name}</button>
                <button className="nx" onClick={() => step(1)}><small>Next</small>{DOMAINS[(di + 1) % N].name}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
