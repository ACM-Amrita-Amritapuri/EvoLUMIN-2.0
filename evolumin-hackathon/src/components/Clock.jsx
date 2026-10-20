import { useState, useEffect } from "react";
import { m, useReducedMotion } from "motion/react";
import { ease } from "../lib/motion.jsx";

const OPENS = new Date("2026-10-28T00:00:00+05:30").getTime();
const pad = n => String(n).padStart(2, "0");

// Keyed on value: each change remounts and slides in (translateY + opacity only).
function Digits({ v, reduce }) {
  return (
    <b className="hr-dg">
      <m.span key={v} initial={reduce ? false : { y: "40%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.45, ease }}>{pad(v)}</m.span>
    </b>
  );
}

export function Clock() {
  const reduce = useReducedMotion();
  const [now, setNow] = useState(Date.now);
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
  const left = Math.max(0, OPENS - now), s = Math.floor(left / 1000);
  const parts = [["days", Math.floor(s / 86400)], ["hours", Math.floor(s / 3600) % 24], ["minutes", Math.floor(s / 60) % 60], ["seconds", s % 60]];
  if (!left) return (
    <div className="hr-clock" role="timer" aria-label="Ideation is open">
      <p className="hr-clock-label">Ideation is open. <a href="#register">Register your team</a></p>
    </div>
  );
  return (
    <div className="hr-clock" role="timer" aria-label="Countdown to ideation opening on October 28">
      <ol aria-hidden="true">{parts.map(([u, n]) => <li key={u}><Digits v={n} reduce={reduce} /><span>{u}</span></li>)}</ol>
      <p className="hr-clock-label">Ideation opens on October 28</p>
    </div>
  );
}
