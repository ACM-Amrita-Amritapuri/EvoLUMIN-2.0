import { useState, useEffect } from "react";

export function useMQ(q) {
  const [m, setM] = useState(() => matchMedia(q).matches);
  useEffect(() => { const l = matchMedia(q), f = () => setM(l.matches); l.addEventListener("change", f); f(); return () => l.removeEventListener("change", f); }, [q]);
  return m;
}
