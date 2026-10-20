import { useEffect, useRef, useState } from "react";
import { VS_TRI, getGL, program, triangle, loop, guardContext, reducedMotion, tier } from "../lib/gl";
import "../styles/atmosphere.css";

// Per-section look: w = cyan weight (0 red .. 1 cyan), s = red-left/cyan-right split, k = intensity. Anchors sit at section tops.
const LOOK = { top: [.5, 1, 1], about: [0, .25, .75], domains: [1, .25, .8], timeline: [0, .2, .8], qa: [.5, .8, .65], register: [.5, 1, 1.3] };
const TIMELINE_END = [1, .2, .8]; // timeline fades red -> cyan across its height

const FS = `#version 300 es
precision highp float;
uniform float uTime,uW,uS,uK;uniform vec2 uPointer,uResolution,uScroll;out vec4 o;
float h(vec2 p){p=fract(p*vec2(.1031,.1030));p+=dot(p,p.yx+33.33);return fract((p.x+p.y)*p.x);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
  return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+1.),f.x),f.y);}
const mat2 R=mat2(.8,.6,-.6,.8)*2.02;
float fbm(vec2 p,int N){float s=0.,a=.5;for(int i=0;i<5;i++){if(i>=N)break;s+=a*n(p);p=R*p;a*=.5;}return s;}
void main(){
  vec2 uv=gl_FragCoord.xy/uResolution;vec2 p=(gl_FragCoord.xy-.5*uResolution)/uResolution.y;
  float t=uTime*.05;
  p+=uPointer*.08;p.y+=uScroll.x;p*=1.6;
  vec2 q=vec2(fbm(p+vec2(0,t),3),fbm(p+vec2(5.2,1.3)-t,3));
  vec2 r=vec2(fbm(p+3.*q+vec2(1.7,9.2)+t*1.5,3),fbm(p+3.*q+vec2(8.3,2.8)-t,3));
  float f=clamp((fbm(p+3.*r,5)-.3)*2.2,0.,1.);
  // soft pointer glow on the dominant hue
  float pg=exp(-length(uv-(uPointer*.5+.5))*3.5)*.25;
  float side=uv.x+.35*(r.x-.5);
  float wc=clamp(uW+uS*(side-.5)*1.6,0.,1.);
  // densities are exclusive: each hue's weight takes the other's away, so overlap never greys
  float dr=smoothstep(.3,1.05,f*f*1.5+.3*(q.x-.5)+pg)*(1.-wc)*(1.-wc);
  float dc=smoothstep(.3,1.05,f*1.3*(.3+r.y)+.2*(q.y-.5)+pg)*wc*wc;
  dr*=1.+.8*(1.-wc);dc*=1.+.8*wc; // renormalise so mixed regions stay bright
  vec3 ember=vec3(1.,.09,.17), ion=vec3(.14,.75,1.);
  vec3 col=ember*dr*dr*1.5+vec3(.9,.18,.1)*pow(dr,5.)*.25+ion*dc*dc*1.9+vec3(.3,.8,1.)*pow(dc,5.)*.2;
  float v=1.-smoothstep(.35,1.1,length(uv-.5)*1.25);
  col*=(.12+.88*v)*.45*uK;
  col=.27*(1.-exp(-col*.9)); // hard ceiling keeps cream text >= 4.5:1
  col+=(h(gl_FragCoord.xy+uTime)-.5)/255.;
  o=vec4(col,1.);
}`;

export default function Atmosphere() {
  const ref = useRef(null);
  const [fb, setFb] = useState(false);

  useEffect(() => {
    const c = ref.current, still = reducedMotion();
    const gl = getGL(c, { alpha: false, antialias: false, powerPreference: "low-power" });
    if (!gl) { setFb(true); return; }
    let prog, U, anchors = [], S = tier().low ? .4 : .5, w = 0, h = 0, px = 0, py = 0, tx = 0, ty = 0, slow = 0, alive = true;
    const look = new Float32Array(3);

    const init = () => {
      try { prog = program(gl, VS_TRI, FS); } catch { setFb(true); return; }
      gl.useProgram(prog); gl.bindVertexArray(triangle(gl));
      U = {}; for (const k of ["uTime", "uScroll", "uPointer", "uResolution", "uW", "uS", "uK"]) U[k] = gl.getUniformLocation(prog, k);
      size();
    };
    const size = () => {
      const k = Math.min(S * devicePixelRatio, Math.sqrt(1e6 / (innerWidth * innerHeight)));
      w = c.width = Math.max(2, innerWidth * k | 0); h = c.height = Math.max(2, innerHeight * k | 0);
      gl.viewport(0, 0, w, h); gl.uniform2f(U.uResolution, w, h);
    };
    // Section offsets are read here only (mount, resize, content growth), never per frame.
    const measure = () => {
      anchors = [];
      for (const id in LOOK) {
        const e = document.getElementById(id);
        if (!e) continue;
        const r = e.getBoundingClientRect(), y = r.top + scrollY;
        anchors.push([y, ...LOOK[id]]);
        if (id === "timeline") anchors.push([y + r.height - innerHeight, ...TIMELINE_END]);
      }
      anchors.sort((a, b) => a[0] - b[0]);
    };
    const sample = y => { // smooth piecewise interpolation of the section table at the viewport centre
      y += innerHeight * .5;
      let i = 0; while (i < anchors.length - 1 && anchors[i + 1][0] <= y) i++;
      const a = anchors[i], b = anchors[i + 1] || a, d = b[0] - a[0], t = d > 0 ? Math.min(1, Math.max(0, (y - a[0]) / d)) : 0, s = t * t * (3 - 2 * t);
      for (let j = 0; j < 3; j++) look[j] = a[j + 1] + (b[j + 1] - a[j + 1]) * s;
    };
    const t0 = performance.now();
    const draw = (now = performance.now()) => {
      if (!U) return;
      px += (tx - px) * .05; py += (ty - py) * .05;
      const m = document.documentElement.scrollHeight - innerHeight;
      if (anchors.length) sample(scrollY); else look.set([.5, 1, 1]);
      gl.uniform1f(U.uTime, (now - t0) / 1000 + (still ? 7 : 0)); gl.uniform2f(U.uScroll, m > 0 ? scrollY / m : 0, 0);
      gl.uniform2f(U.uPointer, px, py); gl.uniform1f(U.uW, look[0]); gl.uniform1f(U.uS, look[1]); gl.uniform1f(U.uK, look[2]);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const L = loop(ms => { // FPS-adaptive: sustained slow frames shrink the canvas once or twice
      slow = ms > 55 ? slow + 1 : Math.max(0, slow - 1);
      if (slow > 20 && S > .25) { S *= .7; slow = 0; size(); }
      draw();
    }, { fps: 30, active: () => alive });

    const onMove = e => { tx = e.clientX / innerWidth * 2 - 1; ty = 1 - e.clientY / innerHeight * 2; };
    const onResize = () => { size(); measure(); if (still) draw(); };
    const ro = new ResizeObserver(() => { measure(); if (still) draw(); });
    const onLost = () => L.stop(), onRestored = () => { init(); measure(); still ? draw() : L.start(); };
    c.addEventListener("webglcontextlost", onLost); guardContext(c, onRestored);
    init(); measure(); ro.observe(document.body); addEventListener("resize", onResize);
    if (still) { draw(); addEventListener("scroll", () => draw(), { passive: true }); }
    else { addEventListener("pointermove", onMove, { passive: true }); L.start(); }
    // late-mounted sections shift offsets: re-measure after load
    addEventListener("load", measure);

    return () => {
      alive = false; L.stop(); ro.disconnect();
      removeEventListener("resize", onResize); removeEventListener("pointermove", onMove); removeEventListener("load", measure);
      c.removeEventListener("webglcontextlost", onLost); c.removeEventListener("webglcontextrestored", onRestored);
      // no forced loseContext: StrictMode remounts the same canvas and would get a dead context back; the browser frees it when the canvas unmounts.
    };
  }, []);

  return <canvas ref={ref} className={fb ? "atmo fb" : "atmo"} aria-hidden="true" />;
}
