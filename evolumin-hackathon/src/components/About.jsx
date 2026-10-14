import { Head } from "./Head.jsx";
import { Count } from "./Count.jsx";

export function About() {
  const F = [[<Count to={36} suffix=" h" />, "Build sprint"], ["2 to 4", "Team size"], [<Count to={6} />, "Domains"], ["Hybrid", "Online + onsite"]];
  return (
    <section className="sec" id="about"><div className="wrap">
      <Head eb="About" title="Built to turn ideas into working things." lead="Evolumin brings students together to tackle real problems across six domains. Teams plan online, then build and pitch to a panel of judges, with mentors alongside from start to finish." />
      <div className="facts">{F.map(([b, s]) => <div className="fact" key={s}><b>{b}</b><span>{s}</span></div>)}</div>
    </div></section>
  );
}
