import { useState, useEffect, useRef } from "react";

export function Count({ to, suffix = "" }) {
  const r = useRef(null), [v, setV] = useState(0);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return; io.disconnect();
      const t0 = performance.now(), tick = t => { const k = Math.min(1, (t - t0) / 1200); setV(Math.round(to * (1 - Math.pow(1 - k, 3)))); if (k < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    });
    io.observe(r.current); return () => io.disconnect();
  }, []);
  return <span ref={r}>{v}{suffix}</span>;
}
