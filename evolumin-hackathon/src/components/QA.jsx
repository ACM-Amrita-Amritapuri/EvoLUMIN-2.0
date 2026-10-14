import { useState } from "react";
import { FAQS } from "../data.jsx";

export function QA() {
  const [o, setO] = useState(0);
  return (
    <section className="sec" id="qa"><div className="wrap qa-wrap">
      <div className="qa-side">
        <div className="eb">Support</div><h2>Questions, answered.</h2>
        <p className="lead">Cannot find what you need? Write to us and a coordinator will reply.</p>
        <a className="lnk" href="mailto:hello@evolumin.example">hello@evolumin.example</a>
      </div>
      <div className="qa">{FAQS.map(([q, a], i) => (
        <div className={"q" + (o === i ? " o" : "")} key={q}>
          <button onClick={() => setO(o === i ? -1 : i)} aria-expanded={o === i} aria-controls={"faq" + i}>{q}<span aria-hidden="true">+</span></button>
          <div id={"faq" + i}><p>{a}</p></div>
        </div>
      ))}</div>
    </div></section>
  );
}
