import React, { useState } from "react";

export default function Sponsors() {
  return (
    <section id="partners"><div className="wrap" style={{ textAlign: "center" }}>
      <h2 style={{ display: "inline-block", textAlign: "left" }}>Sponsors &amp; Partners.</h2>
      <p className="sub">The organisations backing Evolumin.</p>
      <div className="sp">
        {["Title Sponsor", "Industry Partner", "Knowledge Partner"].map(n => <div key={n}><b>Your Logo</b><span>{n}</span></div>)}
      </div>
      <a className="btn ghost" href="mailto:hello@evolumin.example?subject=Sponsorship%20Inquiry">Interested in sponsoring?</a>
    </div></section>
  );
}
