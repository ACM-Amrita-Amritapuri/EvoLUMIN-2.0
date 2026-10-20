import { useEffect, useRef } from "react";
import { useMotionValueEvent } from "motion/react";

// Scroll-driven count-up: p is a 0..1 MotionValue; the number counts from 0 to `to` over [from, from+span].
// Written straight to the DOM node (no React re-render per frame). Default markup is the final value.
export function Count({ to, p, from = 0, span = 0.15, suffix = "", dec = 0 }) {
  const r = useRef(null);
  const fmt = n => n.toLocaleString("en-IN", { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suffix;
  const set = v => {
    if (!r.current) return;
    const t = Math.min(1, Math.max(0, (v - from) / span));
    r.current.textContent = fmt(to * (1 - (1 - t) ** 3));
  };
  useMotionValueEvent(p, "change", set);
  useEffect(() => set(p.get()), []);
  return <span ref={r}>{fmt(to)}</span>;
}
