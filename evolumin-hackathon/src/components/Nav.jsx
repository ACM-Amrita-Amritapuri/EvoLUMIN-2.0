import React, { useState } from "react";
import LOGO from "../assets/logo.jpg";

export default function Nav({ go }) {
  return (
    <nav><div className="wrap">
      <div className="logo" onClick={() => go("top")}><img src={LOGO} className="nav-logo" alt="" />EVO<b>LUMIN</b></div>
      <div>
        <a onClick={() => go("about")}>About</a>
        <a onClick={() => go("problems")}>Domains</a>
        <a onClick={() => go("dates")}>Timeline</a>
        <a onClick={() => go("qa")}>Q&amp;A</a>
        <a onClick={() => go("contact")}>Contact</a>
      </div>
    </div></nav>
  );
}
