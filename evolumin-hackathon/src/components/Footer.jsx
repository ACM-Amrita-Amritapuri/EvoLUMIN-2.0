import React, { useState } from "react";
import LOGO from "../assets/logo.jpg";

export default function Footer({ go }) {
  return (
    <footer className="foot" id="contact"><div className="wrap">
      <div className="fg">
        <div><div className="logo"><img src={LOGO} className="nav-logo" alt="" />EVO<b>LUMIN</b></div><p style={{ marginTop: 12 }}>Build. Evolve. Illuminate. Ideas that burn bright.</p></div>
        <div><h5>Explore</h5><a onClick={() => go("about")}>About</a><a onClick={() => go("problems")}>Domains</a><a onClick={() => go("dates")}>Important dates</a><a onClick={() => go("qa")}>Q&amp;A</a></div>
        <div><h5>Contact</h5><a href="mailto:hello@evolumin.example">hello@evolumin.example</a><p>Coordinator, +91 00000 00000</p><p>Venue: to be announced</p></div>
        <div><h5>Follow us</h5><a>Instagram</a><a>LinkedIn</a><a>Discord</a></div>
      </div>
      <div className="mega">EVOLUMIN</div>
      <div className="copy">© Evolumin Hackathon. All rights reserved.</div>
    </div></footer>
  );
}
