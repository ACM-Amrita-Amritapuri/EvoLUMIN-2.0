import React, { useState } from "react";
import { DOMAINS } from "../data";

export default function About() {
  const total = DOMAINS.reduce((a, d) => a + d.problems.length, 0);
  return (
    <section id="about"><div className="wrap">
      <h2>Evolumin.</h2>
      <p className="sub">Teams of 2 to 4 choose a domain and build a solution over the hackathon.</p>
      <div className="tiles flat">
        <div className="tile"><b data-count="36">36</b><span>Hours</span></div>
        <div className="tile"><b>₹ TBA</b><span>Prize pool</span></div>
        <div className="tile"><b>2 to 4</b><span>Team size</span></div>
        <div className="tile"><b data-count={DOMAINS.length} data-pad="1">{String(DOMAINS.length).padStart(2, "0")}</b><span>Domains · {total} problems</span></div>
      </div>
    </div></section>
  );
}
