import React, { useState } from "react";
import { EVENT } from "../data";

export default function Chrono() {
  const [now, setNow] = useState(Date.now());
  React.useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
  const s = Math.max(0, Math.floor((EVENT - now) / 1000));
  const pct = Math.min(100, Math.max(0, (1 - s / (60 * 86400)) * 100));
  const parts = [[Math.floor(s / 86400), "Days"], [Math.floor(s % 86400 / 3600), "Hours"], [Math.floor(s % 3600 / 60), "Minutes"], [s % 60, "Seconds"]];
  const when = EVENT.toLocaleString("en-IN", { timeZone: "Asia/Kolkata", day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" });
  return (
    <section id="countdown"><div className="wrap">
      <h2>Countdown.</h2>
      <p className="sub">Time left until the hackathon starts.</p>
      <div className="chrono">
        <div className="chrono-top"><div><span>Kick-off</span><b>{when} IST</b></div>{s === 0 && <i className="live">Live now</i>}</div>
        <div className="count">
          {parts.map(([v, l]) => (
            <div className="cd" key={l}><b key={v}>{String(v).padStart(2, "0")}</b><span>{l}</span></div>
          ))}
        </div>
        <div className="bar"><i style={{ width: pct + "%" }} /></div>
        <div className="stages">
          <div><span>01</span><small>Online</small><b>Idea Submission</b><em>Submit your abstract online.</em></div>
          <div><span>02</span><small>Offline</small><b>Final Showdown</b><em>Build and pitch in person.</em></div>
        </div>
      </div>
    </div></section>
  );
}
