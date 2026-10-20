import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { m, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ease } from "../lib/motion.jsx";
import { Clock } from "./Clock.jsx";
import "../styles/hero.css";

// Separate chunk; a failed load just leaves the static logo in place.
const HeroFlame = lazy(() => import("./HeroFlame.jsx").catch(() => ({ default: () => null })));

const idle = cb => (window.requestIdleCallback ? requestIdleCallback(cb, { timeout: 1500 }) : setTimeout(cb, 300));
const unidle = id => (window.cancelIdleCallback ? cancelIdleCallback(id) : clearTimeout(id));

const box = { hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } } };
const line = { hidden: { y: "105%" }, show: { y: 0, transition: { duration: 1.1, ease } } };
const fade = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.9, ease, delay: 0.35 } } };

export function Hero() {
  const reduce = useReducedMotion(), sec = useRef(null);
  const [scene, setScene] = useState(false), [ready, setReady] = useState(false), [paused, setPaused] = useState(false);
  const base = import.meta.env.BASE_URL;

  useEffect(() => {
    const id = idle(() => setScene(true));
    return () => unidle(id);
  }, []);

  const { scrollYProgress: p } = useScroll({ target: sec, offset: ["start start", "end start"] });
  const artY = useTransform(p, [0, 1], [0, 140]), artO = useTransform(p, [0, 0.85], [1, 0]);
  const txtY = useTransform(p, [0, 1], [0, -70]);
  const exit = (y, o) => (reduce ? undefined : { y, opacity: o });
  const lines = ["Fix what's broken.", "Build what matters."];

  return (
    <section className="hr" id="top" ref={sec}>
      <m.div className={"hr-art" + (ready ? " is-ready" : "")} aria-hidden="true" style={exit(artY, artO)}>
        <img src={base + "logo-glow.webp"} alt="" width="760" height="760" fetchpriority="high" decoding="async" />
        {scene && (
          <Suspense fallback={null}>
            <HeroFlame paused={paused} still={reduce} onReady={() => setReady(true)} onFail={() => setScene(false)} />
          </Suspense>
        )}
      </m.div>
      <m.div className="wrap hr-body" style={exit(txtY)} variants={box} initial={reduce ? false : "hidden"} animate="show">
        <m.p className="hr-kicker" variants={fade}>Evolumin 2.0, national 36-hour hackathon</m.p>
        <h1 className="disp hr-title">
          {lines.map(t => <span className="hr-ln" key={t}><m.span variants={line}>{t}</m.span></span>)}
        </h1>
        <m.p className="lead hr-sub" variants={fade}>Pick a real problem, build a working answer with your team, and show it to people who can take it further.</m.p>
        <m.p className="hr-facts" variants={fade}>Open to college and high school students in teams of 2 to 4. Ideation happens online, and the finale is on the Amritapuri campus.</m.p>
        <m.div className="hr-cta" variants={fade}>
          <a className="btn" href="#register">Register your team</a>
          <a className="hr-link" href="#domains">See the tracks</a>
        </m.div>
      </m.div>
      <div className="wrap hr-foot">
        <div className="orn hr-orn" aria-hidden="true"><i /></div>
        <div className="hr-footrow">
          <Clock />
          {scene && ready && !reduce && (
            <button className="hr-vbtn" onClick={() => setPaused(v => !v)} aria-pressed={paused}>{paused ? "Play animation" : "Pause animation"}</button>
          )}
        </div>
      </div>
    </section>
  );
}
