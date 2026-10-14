import { Head } from "./Head.jsx";
import { Art, DOMAINS } from "../data.jsx";

export function Domains() {
  const open = (e, id) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button) return; // let "open in new tab" work
    e.preventDefault(); history.replaceState(null, "", "#domains"); location.hash = "/domain/" + id; // Back returns to this section
  };
  return (
    <section className="sec" id="domains"><div className="wrap">
      <Head eb="Domains" title="Choose your track." lead="Six domains, each with ready problem statements. Select a domain to see its problems, judging criteria and what to submit." />
      <ul className="dg">{DOMAINS.map((d, i) => {
        const n = d.problems.length;
        return (
          <li key={d.id}><a className="dc" href={"#/domain/" + d.id} onClick={e => open(e, d.id)} aria-labelledby={"dn-" + d.id} aria-describedby={"db-" + d.id}>
            <div className="dc-top"><span className="dc-n">{String(i + 1).padStart(2, "0")}</span><span className="dc-c">{n} {n === 1 ? "problem" : "problems"}</span></div>
            <div className="dc-art"><Art id={d.id} /></div>
            <div className="dc-bd"><h3 id={"dn-" + d.id}>{d.name}</h3><p id={"db-" + d.id}>{d.blurb}</p><ul className="dc-list">{d.problems.map(([t]) => <li key={t}>{t}</li>)}</ul></div>
            <div className="dc-ft"><span>Explore domain</span><span className="arr" aria-hidden="true">→</span></div>
          </a></li>
        );
      })}</ul>
    </div></section>
  );
}
