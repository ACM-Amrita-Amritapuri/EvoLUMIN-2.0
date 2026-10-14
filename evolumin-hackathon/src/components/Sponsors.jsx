import { Head } from "./Head.jsx";
import { SPONSORS } from "../data.jsx";

export function Sponsors() {
  return (
    <section className="sec" id="sponsors"><div className="wrap">
      <Head eb="Partners" title="Backed by people who build." lead="Our partners fund the prizes, mentor the teams and open doors for the winners." />
      <div className="tiers">{SPONSORS.map(([tier, name, d, m], i) => (
        <article className={"sc" + (i === 0 ? " top" : "")} key={name}>
          <div className="lg"><svg viewBox="0 0 120 60" fill="none" stroke="#fff" strokeWidth="2" aria-hidden="true"><circle cx="40" cy="30" r="20" /><path d="M34 40L40 20L46 40M36 34H44" strokeLinecap="round" /><text x="72" y="38" fill="#fff" stroke="none" fontSize="22" fontWeight="600" fontFamily="Goldman,sans-serif">{m}</text></svg></div>
          <div className="bd"><small>{tier}</small><h3>{name}</h3><p>{d}</p></div>
        </article>
      ))}</div>
    </div></section>
  );
}
