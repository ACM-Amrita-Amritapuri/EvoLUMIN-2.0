import React, { useState } from "react";
import { FAQS } from "../data";

export default function QA() {
  const [i, setI] = useState(0);
  React.useEffect(() => {
    const on = e => setI(e.detail);
    window.addEventListener("qastep", on);
    return () => window.removeEventListener("qastep", on);
  }, []);
  return (
    <section id="qa"><div className="wrap">
      <h2>Q&amp;A</h2>
      <p className="sub">Quick answers to common questions.</p>
      {FAQS.map(([q, a], n) => (
        <div className="faq" key={q}>
          <button onClick={() => { window.__qaLock = Date.now() + 6000; setI(i === n ? -1 : n); }}>{q}<span>{i === n ? "−" : "+"}</span></button>
          {i === n && <div>{a}</div>}
        </div>
      ))}
    </div></section>
  );
}
