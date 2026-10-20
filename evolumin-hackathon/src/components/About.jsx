import { useRef, useSyncExternalStore } from "react";
import { m, useScroll, useTransform, useReducedMotion } from "motion/react";
import { Count } from "./Count.jsx";
import { GOALS } from "../data.jsx";
import "../styles/about.css";

const PRE = ["Technology", "becomes", "meaningful", "when", "it"];
const FACTS = [["36", "hours to build"], ["2 to 4", "students per team"], ["6", "tracks to choose from"], ["Online, then campus", "ideate from home, finish on the campus finale"]];
const FIGS = [
  { to: 1000, suf: "+", text: "1,000+", label: "participants" },
  { to: 25, text: "25", label: "finalist teams at the Amritapuri finals" },
  { to: 4, text: "4", label: "months of competition" },
  { to: 5.5, dec: 1, text: "5.5", label: "lakh prize pool" },
];
const HEAD = ["participants", "finalists", "months", "prize pool"];

// No pinning on phones or for reduced motion: everything is plain, fully visible markup.
const MOBILE = "(max-width:700px)";
function useStill() {
  const r = useReducedMotion();
  const mob = useSyncExternalStore(
    cb => { const q = matchMedia(MOBILE); q.addEventListener("change", cb); return () => q.removeEventListener("change", cb); },
    () => matchMedia(MOBILE).matches, () => false);
  return !!r || mob;
}

const Word = ({ w, i, p }) => {
  const a = 0.04 + i * 0.058;
  return <><m.span style={{ color: useTransform(p, [a, a + 0.12], ["#5b6483", "#f3f6ff"]) }} className="ab-w" aria-hidden="true">{w}</m.span>{" "}</>;
};

// Fades and rises into place at progress `a`.
const Arrive = ({ p, a, className, children }) => (
  <m.div className={className} style={{ opacity: useTransform(p, [a, a + 0.1], [0, 1]), y: useTransform(p, [a, a + 0.1], [32, 0]) }}>{children}</m.div>
);

function Fig({ f, i, p }) {
  const s = i / 4, e = s + 0.25, last = i === 3;
  const x = i ? [s - 0.05, s, e - 0.05, e] : [0, 0.001, e - 0.05, e];
  const opacity = useTransform(p, x, [i ? 0 : 1, 1, 1, last ? 1 : 0]);
  const clipPath = useTransform(p, x, [i ? "inset(100% -10% -30% -10%)" : "inset(-30% -10% -30% -10%)", "inset(-30% -10% -30% -10%)", "inset(-30% -10% -30% -10%)", last ? "inset(-30% -10% -30% -10%)" : "inset(-30% -10% 100% -10%)"]);
  const y = useTransform(p, x, [i ? 60 : 0, 0, 0, last ? 0 : -60]);
  return (
    <m.li className="ab-fig" style={{ opacity, clipPath, y }}>
      <span className="sr">{f.text} {f.label}</span>
      <span className="ab-num" aria-hidden="true"><Count to={f.to} p={p} from={s} span={0.17} suffix={f.suf} dec={f.dec} /></span>
      <span className="ab-cap" aria-hidden="true">{f.label}</span>
    </m.li>
  );
}

function Seg({ i, p }) {
  const s = i / 4;
  return <li><i style={{ scaleX: useTransform(p, [s, s + 0.25], [0, 1]) }} /><span>{HEAD[i]}</span></li>;
}

function Statement({ still }) {
  const ref = useRef(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const phr = useTransform(p, [0.33, 0.52], [0.4, 1]);
  return (
    <div className={`ab-pin ab-a${still ? " still" : ""}`} ref={ref}>
      <div className="ab-stage"><div className="ab-in ab-split">
        <h2 className="ab-statement" aria-label="Technology becomes meaningful when it solves problems that matter.">
          {still ? <span aria-hidden="true">{PRE.join(" ")} <span className="lit">solves problems that matter.</span></span>
            : <>{PRE.map((w, i) => <Word key={i} w={w} i={i} p={p} />)}<m.span className="ab-w lit" style={{ opacity: phr }} aria-hidden="true">solves problems that matter.</m.span></>}
        </h2>
        <div className="ab-side">
          {still ? <p className="lead">Evolumin 2.0 is a national hackathon for college and high school students, run by the ACM Amritapuri Student Chapter. You ideate online, then build and pitch on campus with mentors beside you.</p>
            : <Arrive p={p} a={0.5}><p className="lead">Evolumin 2.0 is a national hackathon for college and high school students, run by the ACM Amritapuri Student Chapter. You ideate online, then build and pitch on campus with mentors beside you.</p></Arrive>}
          <dl className="ab-facts">
            {FACTS.map(([b, s], i) => still ? <div key={s}><dt>{b}</dt><dd>{s}</dd></div>
              : <Arrive key={s} p={p} a={0.6 + i * 0.07}><dt>{b}</dt><dd>{s}</dd></Arrive>)}
          </dl>
        </div>
      </div></div>
    </div>
  );
}

function Proof({ still }) {
  const ref = useRef(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  return (
    <div className={`ab-pin ab-b${still ? " still" : ""}`} ref={ref}>
      <div className="ab-stage"><div className="ab-in">
        <p className="ab-intro">Evolumin 1.0 was the first edition. This is what it did.</p>
        {still
          ? <ol className="ab-figs">{FIGS.map(f => <li key={f.label} className="ab-fig"><span className="ab-num">{f.text}</span><span className="ab-cap">{f.label}</span></li>)}</ol>
          : <>
            <ol className="ab-figs">{FIGS.map((f, i) => <Fig key={f.label} f={f} i={i} p={p} />)}</ol>
            <ol className="ab-prog" aria-hidden="true">{FIGS.map((f, i) => <Seg key={f.label} i={i} p={p} />)}</ol>
          </>}
      </div></div>
    </div>
  );
}

export function About() {
  const still = useStill();
  return (
    <section className="sec ab" id="about" aria-label="About Evolumin 2.0">
      <Statement still={still} />
      <Proof still={still} />
      <div className="ab-in ab-rest">
        <p className="ab-plaque">
          Since then, the chapter has hosted the national-level OLabs Hackathon and won the <em className="lit">Outstanding</em> Activities Chapter Award among 400+ ACM Student Chapters. ACM Amritapuri is a top 10 chapter in India.
        </p>
        <div className="ab-why">
          <h3 className="disp">Why we host it</h3>
          <ul className="ab-goals">{GOALS.map(([t, x]) => <li key={t}><b>{t}</b><p>{x}</p></li>)}</ul>
        </div>
      </div>
    </section>
  );
}
