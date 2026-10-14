import { useState } from "react";
import { Head } from "./Head.jsx";
import { useMQ } from "../hooks.js";
import { STAGES } from "../data.jsx";

export function Timeline() {
  const [a, setA] = useState(0), narrow = useMQ("(max-width:820px)"), N = STAGES.length;
  const go = n => { if (n >= 0 && n < N) setA(n); };
  const info = <><time>Stage {a + 1} of {N} · Date to be announced</time>{!narrow && <h3>{STAGES[a][0]}</h3>}<p>{STAGES[a][1]}</p></>;
  return (
    <section className="sec" id="timeline"><div className="wrap">
      <Head eb="Timeline" title="Six stages to the final pitch." lead="Select a stage to see what happens and what you need to do. Exact dates are announced on the registration portal." />
      <div className="tlw">
        <div className="line" aria-hidden="true"><i style={{ width: (a / (N - 1)) * 100 + "%" }} /></div>
        <ol className="tl">{STAGES.map((x, i) => (
          <li key={x[0]} className={"nd-i" + (i <= a ? " on" : "")}>
            <button type="button" className={"nd" + (i <= a ? " on" : "") + (i === a ? " cur" : "")} onClick={() => setA(i)}
              aria-current={i === a ? "step" : undefined} aria-expanded={narrow ? i === a : undefined} aria-controls={!narrow ? "stage-panel" : undefined}>
              <span className="dot" aria-hidden="true">{i + 1}</span><em>{x[0]}</em>
            </button>
            {narrow && i === a && <div className="dd" key={a}>{info}</div>}
          </li>
        ))}</ol>
      </div>
      {!narrow && (
        <div className="detail">
          <div id="stage-panel" aria-live="polite"><div className="dk" key={a}>{info}</div></div>
          <div className="dstep">
            <button type="button" className="sb" aria-disabled={a === 0} onClick={() => go(a - 1)}>← Previous</button>
            <button type="button" className="sb" aria-disabled={a === N - 1} onClick={() => go(a + 1)}>Next →</button>
          </div>
        </div>
      )}
    </div></section>
  );
}
