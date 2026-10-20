import { useRef } from "react";
import { m, useScroll, useTransform, useReducedMotion } from "motion/react";
import "../styles/footer.css";
import { LINKS, EMAIL } from "../data.jsx";

export function Footer() {
  const ref = useRef(null), reduce = useReducedMotion();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const y = useTransform(p, [0, 1], [90, 0]), o = useTransform(p, [0, 0.7], [0.15, 1]);
  return (
    <footer className="ft" id="contact" ref={ref}>
      <hr className="gline ft-line" />
      <div className="ft-in">
        <m.p className="ft-mark" style={reduce ? undefined : { y, opacity: o }}>Evolumin 2.0</m.p>
        <div className="ft-cols">
          <nav aria-label="Footer"><h2>Explore</h2><ul>{LINKS.map(([id, l]) => <li key={id}><a href={"#" + id}>{l}</a></li>)}</ul></nav>
          <div><h2>Contact</h2><a href={"mailto:" + EMAIL}>{EMAIL}</a></div>
          <div><h2>Venue</h2><p>Amrita Vishwa Vidyapeetham, Amritapuri campus</p><p>Organised by the ACM Amritapuri Student Chapter, Amrita School of Computing</p></div>
        </div>
        <div className="ft-bar">
          <p className="ft-cp">© {new Date().getFullYear()} Evolumin 2.0. All rights reserved.</p>
          <a className="ft-top" href="#top">Back to top</a>
        </div>
      </div>
    </footer>
  );
}
