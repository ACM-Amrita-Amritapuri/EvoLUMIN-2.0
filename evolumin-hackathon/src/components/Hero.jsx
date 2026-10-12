import React, { useState } from "react";
import LOGO from "../assets/logo.jpg";
import { DOMAINS } from "../data";

export default function Hero({ go }) {
  const names = DOMAINS.map(d => d.name);
  return (
    <header className="hero" id="top">
      <div className="orb o1" /><div className="orb o2" /><div className="gridbg" />
      <svg className="curves" viewBox="0 0 1440 720" preserveAspectRatio="none" aria-hidden="true">
        <defs><linearGradient id="cg" x1="0" x2="1"><stop offset="0" stopColor="#19d3ff" /><stop offset="1" stopColor="#ff2d3d" /></linearGradient></defs>
        <path d="M-20 560 C 240 400, 440 680, 740 500 S 1180 320, 1460 460" />
        <path className="d" d="M-20 610 C 260 450, 460 720, 760 550 S 1200 380, 1460 510" />
        <path className="d" d="M-20 140 C 220 260, 520 40, 820 170 S 1220 300, 1460 120" />
      </svg>
      <div className="wrap hero-in">
        <div className="hero-text">
          <div className="credit">Evolumin presents</div>
          <h1><span className="c">EVO</span><span className="r">LUMIN</span><br />Hackathon</h1>
          <p>Pick a domain, solve a real problem and ship a working solution with your team.</p>
          <button className="btn" onClick={() => go("problems")}>Explore domains</button>
          <button className="btn ghost" onClick={() => go("dates")}>View timeline</button>
        </div>
        <div className="hero-art">
          <div className="hring" /><div className="hring r2" />
          <img src={LOGO} className="logo-img" alt="Evolumin logo" />
        </div>
      </div>
      <div className="marq"><div>{[...names, ...names].map((n, i) => <span key={i}>{n}</span>)}</div></div>
    </header>
  );
}
