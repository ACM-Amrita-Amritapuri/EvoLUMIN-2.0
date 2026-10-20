import { useEffect, useRef } from "react";
import { m, useScroll, useTransform, useReducedMotion } from "motion/react";
import "../styles/timeline.css";
import { STAGES, HIGHLIGHTS } from "../data.jsx";
import { useMQ } from "../hooks.js";

const N = STAGES.length;

// One stage: cross-fades by runway progress (p). The first stays lit at p=0, the last at p=1.
function View({ i, p, pinned, children }) {
  // keyframes must stay inside [0,1] for native scroll animation
  const first = !i, last = i === N - 1;
  // fade windows of neighbouring stages do not overlap, so two giant dates are never on screen together
  const at = [...(first ? [0] : [(i - 0.05) / N, (i + 0.2) / N]), ...(last ? [1] : [(i + 0.65) / N, (i + 0.9) / N])];
  const opacity = useTransform(p, at, first ? [1, 1, 0] : last ? [0, 1, 1] : [0, 1, 1, 0]);
  const y = useTransform(p, at, first ? [0, 0, -40] : last ? [40, 0, 0] : [40, 0, 0, -40]);
  return <m.div className="tl-view" style={pinned ? { opacity, y } : undefined}>{children}</m.div>;
}

export function Timeline() {
  const wrap = useRef(null), list = useRef(null), reduce = useReducedMotion();
  const stacked = useMQ("(max-width:700px), (hover:none), (prefers-reduced-motion:reduce)");
  const pinned = !stacked && !reduce;
  const { scrollYProgress: p } = useScroll({ target: wrap, offset: ["start start", "end end"] });
  const fill = useTransform(p, [0.5 / N, (N - 0.5) / N], ["inset(0 0 100% 0)", "inset(0 0 0% 0)"]);
  const redX = useTransform(p, [0, 1], ["0vw", "38vw"]), cyanX = useTransform(p, [0, 1], ["0vw", "-38vw"]);
  const glow = useTransform(p, [0, 0.7, 1], [0.35, 0.55, 1]);
  const hl = useTransform(p, [(N - 0.7) / N, (N - 0.2) / N], [0, 1]);

  // Current stage -> classes on the list items (one DOM write per change, no React state per frame).
  useEffect(() => {
    const items = [...list.current.children];
    const mark = cur => {
      items.forEach((li, i) => {
        li.classList.toggle("done", i <= cur);
        li.classList.toggle("cur", i === cur);
        if (i === cur) li.setAttribute("aria-current", "step"); else li.removeAttribute("aria-current");
      });
      wrap.current.classList.toggle("fin", cur === N - 1);
    };
    if (!pinned) { mark(N); return; }
    let last = -1;
    const on = v => { const cur = Math.min(N - 1, Math.max(0, Math.floor(v * N))); if (cur !== last) mark(last = cur); };
    on(p.get());
    return p.on("change", on);
  }, [pinned, p]);

  // Steps scroll the runway to their stage.
  const go = i => {
    const el = wrap.current, top = el.getBoundingClientRect().top + scrollY;
    scrollTo({ top: top + (el.offsetHeight - innerHeight) * (i + 0.5) / N });
  };

  return (
    <section className="sec tl" id="timeline">
      <div className="wrap tl-intro">
        <h2 className="disp">Six steps from idea to <em className="lit">finale</em>.</h2>
        <p className="lead">Ideate online, get evaluated, then build and pitch on campus.</p>
      </div>
      <div className={"tl-run" + (pinned ? " pin" : "")} ref={wrap}>
        <div className="tl-stage">
          {pinned && <>
            <m.span className="tl-leak r" aria-hidden="true" style={{ x: redX, opacity: glow }} />
            <m.span className="tl-leak c" aria-hidden="true" style={{ x: cyanX, opacity: glow }} />
          </>}
          <div className="tl-rail">
            <span className="tl-line" aria-hidden="true"><m.i style={pinned ? { clipPath: fill } : undefined} /></span>
            <ol ref={list} aria-label="Evolumin 2.0 stages">
              {STAGES.map(([title, desc, date, phase], i) => (
                <li key={title}>
                  <button type="button" className="tl-step" onClick={() => go(i)} onFocus={e => pinned && e.target.matches(":focus-visible") && go(i)} tabIndex={pinned ? 0 : -1}>
                    <b className="tl-node">{i + 1}</b>
                    <span><span className="tl-st">{title}</span><small>{date}</small></span>
                  </button>
                  <View i={i} p={p} pinned={pinned}>
                    <p className="tl-phase">Stage {i + 1} of {N} &middot; {phase}</p>
                    <p className="disp lit tl-date">{date}</p>
                    <h3>{title}</h3>
                    <p className="tl-desc">{desc}</p>
                    {i === N - 1 && <m.ul className="tl-hl" style={pinned ? { opacity: hl } : undefined} aria-label="Highlights of the finale">{HIGHLIGHTS.map(h => <li key={h}>{h}</li>)}</m.ul>}
                  </View>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
