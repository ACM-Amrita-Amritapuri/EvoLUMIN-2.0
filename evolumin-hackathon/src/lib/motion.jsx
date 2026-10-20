import { LazyMotion, MotionConfig, domAnimation, m, useReducedMotion } from "motion/react";

export const ease = [0.16, 1, 0.3, 1];

// domAnimation is the small feature set (~15 kB); `strict` makes accidental use of the full `motion.*` components throw.
export const MotionRoot = ({ children }) => <MotionConfig reducedMotion="user"><LazyMotion features={domAnimation} strict>{children}</LazyMotion></MotionConfig>;

// Fade-and-rise once when scrolled into view. Use sparingly; prefer scroll-linked effects for hero moments.
export function Reveal({ as = "div", y = 24, delay = 0, children, ...rest }) {
  const M = m[as], reduce = useReducedMotion();
  return <M initial={reduce ? false : { opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "0px 0px -12% 0px" }} transition={{ duration: 0.8, ease, delay }} {...rest}>{children}</M>;
}
