import { useRef, useState } from "react";
import "../styles/qa.css";
import { FAQS, EMAIL } from "../data.jsx";

export function QA() {
  const [o, setO] = useState(0), list = useRef(null);
  // Arrow keys, Home and End move focus between question buttons.
  const keys = e => {
    const k = { ArrowDown: 1, ArrowUp: -1, Home: "first", End: "last" }[e.key];
    if (!k) return;
    const b = [...list.current.querySelectorAll("button")], i = b.indexOf(document.activeElement);
    if (i < 0) return;
    e.preventDefault();
    b[k === "first" ? 0 : k === "last" ? b.length - 1 : (i + k + b.length) % b.length].focus();
  };
  return (
    <section className="sec" id="qa"><div className="wrap fq-wrap">
      <div className="fq-side">
        <h2 className="disp">Questions you <em className="lit">might have</em>.</h2>
        <p className="lead">Cannot find what you need? Write to <a className="fq-mail" href={"mailto:" + EMAIL}>{EMAIL}</a>.</p>
      </div>
      <div className="fq-list" ref={list} onKeyDown={keys}>{FAQS.map(([q, a], i) => (
        <div className={"fq-item" + (o === i ? " open" : "")} key={q}>
          <h3><button type="button" id={"faqb" + i} onClick={() => setO(o === i ? -1 : i)} aria-expanded={o === i} aria-controls={"faq" + i}>
            <span>{q}</span><i className="fq-pm" aria-hidden="true" />
          </button></h3>
          <div className="fq-a" id={"faq" + i} role="region" aria-labelledby={"faqb" + i}><div><p>{a}</p></div></div>
        </div>
      ))}</div>
    </div></section>
  );
}
