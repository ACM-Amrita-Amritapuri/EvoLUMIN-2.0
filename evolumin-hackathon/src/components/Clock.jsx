import { useState, useEffect, useRef } from "react";
import { EVENT } from "../data.jsx";

function Digits({ n, w }) {
  return <>{String(n).padStart(w, "0").split("").map((c, i) => <span className="dgt" key={i + c}>{c}</span>)}</>;
}

export function Clock() {
  const [now, setNow] = useState(Date.now());
  const [dw] = useState(() => Math.max(2, String(Math.floor(Math.max(0, EVENT - Date.now()) / 864e5)).length)); // reserve width for the day digits once
  useEffect(() => { let t; const tick = () => { setNow(Date.now()); t = setTimeout(tick, 1000 - Date.now() % 1000 + 5); }; tick(); return () => clearTimeout(t); }, []);
  const s = Math.max(0, Math.floor((EVENT - now) / 1000));
  const P = [[Math.floor(s / 86400), "days", dw], [Math.floor(s % 86400 / 3600), "hours", 2], [Math.floor(s % 3600 / 60), "mins", 2], [s % 60, "secs", 2]];
  return (
    <div className="clock" role="timer" aria-label="Time left until kick-off">
      <p>Kick-off in</p>
      <div className="cg">{P.map(([v, l, w], i) => <div className={"u" + (i === 0 ? " hot" : "")} key={l}><b aria-hidden="true"><Digits n={v} w={w} /></b><span className="lb">{l}</span></div>)}</div>
      <span className="sr">{P.map(([v, l]) => v + " " + l).join(", ")}</span>
    </div>
  );
}
