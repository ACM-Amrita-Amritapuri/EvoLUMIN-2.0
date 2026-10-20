import { useRef } from "react";
import { m, useScroll, useTransform, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import "../styles/register.css";
import { REGISTER_URL, EMAIL } from "../data.jsx";

function Magnet({ glow }) {
  const reduce = useReducedMotion(), rect = useRef(null);
  const x = useMotionValue(0), y = useMotionValue(0);
  const cfg = { stiffness: 220, damping: 18, mass: 0.4 };
  const sx = useSpring(x, cfg), sy = useSpring(y, cfg);
  const on = (e) => { if (!reduce && e.pointerType === "mouse") rect.current = e.currentTarget.getBoundingClientRect(); };
  const move = (e) => {
    const r = rect.current; if (!r) return;
    x.set((e.clientX - r.left - r.width / 2) * 0.35); y.set((e.clientY - r.top - r.height / 2) * 0.35);
  };
  const off = () => { rect.current = null; x.set(0); y.set(0); };
  return (
    // the padding around the button is the pull zone
    <span className="rg-pad" onPointerEnter={on} onPointerMove={move} onPointerLeave={off}>
      <m.span className="rg-mag" style={reduce ? undefined : { x: sx, y: sy }}>
        <m.i className="rg-glow" aria-hidden="true" style={{ opacity: glow.o, scale: glow.s }} />
        <a className="btn rg-btn" href={REGISTER_URL}>Register your team</a>
      </m.span>
    </span>
  );
}

export function Register() {
  const ref = useRef(null), reduce = useReducedMotion();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start end", "center center"] });
  // leaks start off-centre and converge; the glow ignites with the same progress
  const lx = useTransform(p, [0, 1], ["-22%", "6%"]), rx = useTransform(p, [0, 1], ["22%", "-6%"]);
  const glow = { o: useTransform(p, [0, 1], [0.25, 1]), s: useTransform(p, [0, 1], [0.7, 1.15]) };
  const txt = useTransform(p, [0, 0.7], [0, 1]), ty = useTransform(p, [0, 0.7], [40, 0]);
  return (
    <section className="rg" id="register" ref={ref}>
      <m.i className="rg-leak rg-e" aria-hidden="true" style={reduce ? undefined : { x: lx }} />
      <m.i className="rg-leak rg-i" aria-hidden="true" style={reduce ? undefined : { x: rx }} />
      <m.div className="rg-in" style={reduce ? undefined : { opacity: txt, y: ty }}>
        <h2 className="rg-h">Your team's <span className="lit">turn to build.</span></h2>
        <p className="lead">Form a team of 2 to 4, pick a track and submit your idea. Ideation opens on Oct 28.</p>
        <Magnet glow={glow} />
        <p className="rg-q">Questions? Write to <a href={"mailto:" + EMAIL}>{EMAIL}</a></p>
      </m.div>
    </section>
  );
}
