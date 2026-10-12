import React, { useState } from "react";
import LOGO from "../assets/logo.jpg";

export default function Intro() {
  const [on, setOn] = useState(() => !window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  React.useEffect(() => {
    const root = document.documentElement;
    if (!on) { root.classList.remove("intro"); return; }
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => setOn(false), 3400);
    return () => { clearTimeout(t); document.body.style.overflow = ""; root.classList.remove("intro"); };
  }, [on]);
  if (!on) return null;
  return (
    <div className="intro" onClick={() => setOn(false)} aria-hidden="true">
      <div className="lb t" /><div className="lb b" />
      <div className="i-box">
        <img src={LOGO} className="i-logo" alt="" />
        <div className="i-title">EVO<b>LUMIN</b></div>
        <div className="i-sub">Hackathon</div>
      </div>
      <span className="i-skip">Click to skip</span>
    </div>
  );
}
