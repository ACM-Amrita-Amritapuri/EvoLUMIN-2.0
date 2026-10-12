import React, { useState } from "react";
import { DATES } from "../data";

export default function Dates() {
  const N = DATES.length;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [cur, setCur] = useState(reduce ? N - 1 : 0);
  const pad = n => String(n).padStart(2, "0");
  const fmt = s => s.iso ? new Date(s.iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "Date TBA";
  React.useEffect(() => {
    const on = e => setCur(e.detail);
    window.addEventListener("tlstep", on);
    return () => window.removeEventListener("tlstep", on);
  }, []);
  const pick = i => { window.__tlLock = Date.now() + 5000; setCur(i); };
  return (
    <section id="dates"><div className="wrap">
      <div className="tsplit">
        <div className="tl-left">
          <h2>Event Timeline</h2>
          <p className="sub">Every step from registration to the final pitch. Exact dates will be announced soon.</p>
          <div className="bigstep" aria-live="polite"><b key={cur}>{pad(cur + 1)}</b><span>/ {pad(N)}</span></div>
          <div className="curt" key={"t" + cur}>{DATES[cur].t}</div>
        </div>
        <div className={"vtw" + (reduce ? " all" : "")} style={{ "--cur": cur }}>
          <div className="vline" /><div className="vfill" /><div className="vhead" />
          <ol className="vt">
            {DATES.map((s, i) => (
              <li className={"vi" + (i < cur ? " done" : i === cur ? " on" : "")} key={s.t} style={{ "--i": i }} onClick={() => pick(i)} onKeyDown={e => e.key === "Enter" && pick(i)} tabIndex={0} role="button" aria-expanded={i === cur}>
                <div className="vn">{pad(i + 1)}</div>
                <div className="vb">
                  <div className="vh"><h4>{s.t}</h4><time>{fmt(s)}</time></div>
                  <div className="vd"><div><p>{s.d}</p></div></div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div></section>
  );
}
