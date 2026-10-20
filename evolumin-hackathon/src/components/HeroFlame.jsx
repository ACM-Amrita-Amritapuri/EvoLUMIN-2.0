import { useEffect, useRef } from "react";
import { getGL, program, triangle, texture, loadImage, loop, guardContext, tier, VS_TRI } from "../lib/gl.js";

// Logo pass. Warp is scaled by (1 - core) so the white-hot lines stay put and only the smoky halo flows. Slice 0 carries the
// core; slices 1..N-1 add halo only, shifted by pointer/scroll parallax, so depth never ghosts the crisp lines.
const FS = `#version 300 es
precision highp float;
uniform sampler2D T;uniform vec2 R,P;uniform float t,S,gain;uniform int N;
out vec4 o;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3. - 2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1)),f.x),f.y);}
vec2 curl(vec2 p){float e=.12;return vec2(n(p+vec2(0,e))-n(p-vec2(0,e)),n(p-vec2(e,0))-n(p+vec2(e,0)))/(2.*e);}
void main(){
  vec2 p=gl_FragCoord.xy/R;p.y=1. - p.y;
  float br=1.+.03*sin(t*.9);
  vec2 c=p-.5;
  float a=S*.4+P.x*.06;c=mat2(cos(a),-sin(a),sin(a),cos(a))*c/br;
  vec2 flow=curl(c*3.+vec2(0,-t*.1))+.5*curl(c*7.+vec2(t*.06,-t*.18));
  float lod=max(log2(1254./R.y),0.)+.15;
  vec3 acc=vec3(0);
  for(int i=0;i<4;i++){
    if(i>=N)break;
    float z=1.-float(i)*.5;
    vec2 q=c-P*z*vec2(.016,.012)-vec2(S*z*.05,-S*z*.02);
    q/=1.+z*.008;
    vec2 uv=q+.5;
    vec3 b=textureLod(T,uv,1.5).rgb;
    float core=max(smoothstep(.3,.62,min(b.r,min(b.g,b.b))),smoothstep(.55,.9,dot(b,vec3(.3,.55,.15))));
    vec2 off=flow*(.007*(1.-core)*(1.+.25*float(i))+.00025);
    vec2 ch=q*.0018*(.6+z*.4);
    vec3 s=vec3(textureLod(T,uv+off+ch,lod).r,textureLod(T,uv+off,lod).g,textureLod(T,uv+off-ch,lod).b);
    vec3 w3=textureLod(T,uv,3.).rgb;
    acc+=i==0?s:s*.18*(1.-core)*(1.-smoothstep(.1,.38,dot(w3,vec3(.3,.55,.15))));
  }
  vec2 u0=c+.5;vec3 bl=vec3(0);
  for(int k=0;k<4;k++){
    float an=float(k)*1.5708+.6+t*.04;vec2 d=vec2(cos(an),sin(an));
    bl+=textureLod(T,u0+d*.03,3.).rgb+textureLod(T,u0+d*.1,5.).rgb*1.4;
  }
  vec3 col=min(max((acc+bl*.1)*gain*(.88+.06*sin(t*1.1))-.05,0.)*1.05,1.);
  o=vec4(col,max(col.r,max(col.g,col.b)));
}`;

// One instanced soft sprite per ember: position, wrap, flicker and parallax all live in the vertex shader.
const EVS = `#version 300 es
layout(location=1)in vec4 A;layout(location=2)in vec2 B;
uniform float t,S;uniform vec2 P,R;out vec2 u;out vec3 col;out float al;
const vec2 Q[4]=vec2[](vec2(-1,-1),vec2(1,-1),vec2(-1,1),vec2(1,1));
void main(){
  vec2 q=Q[gl_VertexID];u=q;
  float z=B.x*2.-1.,ph=fract(A.y+t*A.z);
  vec2 p=vec2(A.x+sin(ph*6.+B.x*40.)*.035*(.4+ph)+ph*.03,mix(.84,.06,ph));
  p+=P*z*vec2(.04,.03)+vec2(S*z*.06,0);
  al=smoothstep(0.,.1,ph)*(1.-smoothstep(.5,1.,ph))*(.55+.45*sin(t*3.+B.x*60.));
  col=B.y>.5?vec3(1.,.3,.36):vec3(.27,.82,.96);
  float s=A.w*(.7+.3*z)*(1.-ph*.5);
  p+=q*s*vec2(R.y/R.x,1.);
  gl_Position=vec4(p.x*2.-1.,1.-p.y*2.,0.,1.);
}`;
const EFS = `#version 300 es
precision mediump float;in vec2 u;in vec3 col;in float al;out vec4 o;
void main(){float a=1.-length(u);if(a<=0.)discard;a*=a;vec3 c=mix(col,vec3(1),a*a*.6);o=vec4(c*a*al,a*al*.8);}`;

export default function HeroFlame({ paused, still, onReady, onFail }) {
  const box = useRef(null), api = useRef({});
  useEffect(() => { api.current.pause?.(paused); }, [paused]);

  useEffect(() => {
    const el = box.current, canvas = document.createElement("canvas");
    canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block";
    el.appendChild(canvas);
    const low = tier().low, fine = matchMedia("(pointer:fine)").matches;
    const NE = low ? 120 : 300, NS = low ? 2 : 4;
    let gl, logoP, emP, triVAO, emVAO, uL, uE, tex, img, scale = low ? 0.75 : 1, ready = false, dead = false;
    let t = 0, px = 0, py = 0, tx = 0, ty = 0, S = 0, inView = true, isPaused = false, w = 0, h = 0, slow = 0, frames = 0;

    const size = () => {
      if (!w) return;
      const pr = Math.min(devicePixelRatio || 1, 1.5) * scale, cap = Math.sqrt(1.4e6 / (w * h));
      const k = Math.min(pr, cap);
      canvas.width = Math.round(w * k); canvas.height = Math.round(h * k);
      gl?.viewport(0, 0, canvas.width, canvas.height);
    };

    const build = () => {
      gl = getGL(canvas, { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false, powerPreference: "high-performance" });
      if (!gl) { onFail?.(); return false; }
      try {
        logoP = program(gl, VS_TRI, FS); emP = program(gl, EVS, EFS);
      } catch (e) { console.error(e.message); onFail?.(); return false; }
      triVAO = triangle(gl);
      emVAO = gl.createVertexArray(); gl.bindVertexArray(emVAO);
      const d = new Float32Array(NE * 6);
      for (let i = 0; i < NE; i++) {
        const x = 0.22 + Math.random() * 0.6;
        d.set([x, Math.random(), 0.025 + Math.random() * 0.06, 0.006 + Math.random() * 0.016, Math.random(), x + (Math.random() - 0.5) * 0.35 > 0.5 ? 1 : 0], i * 6);
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer()); gl.bufferData(gl.ARRAY_BUFFER, d, gl.STATIC_DRAW);
      gl.enableVertexAttribArray(1); gl.vertexAttribPointer(1, 4, gl.FLOAT, false, 24, 0); gl.vertexAttribDivisor(1, 1);
      gl.enableVertexAttribArray(2); gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 24, 16); gl.vertexAttribDivisor(2, 1);
      const loc = (p, names) => Object.fromEntries(names.map(n => [n, gl.getUniformLocation(p, n)]));
      uL = loc(logoP, ["T", "R", "P", "t", "S", "gain", "N"]); uE = loc(emP, ["t", "S", "P", "R"]);
      tex = texture(gl, img);
      gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA); gl.clearColor(0, 0, 0, 0);
      size();
      return true;
    };

    const draw = () => {
      if (!ready || !uL || gl.isContextLost()) return;
      const W = canvas.width, H = canvas.height;
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(logoP); gl.bindVertexArray(triVAO);
      gl.uniform1i(uL.T, 0); gl.uniform2f(uL.R, W, H); gl.uniform2f(uL.P, px, py); gl.uniform1f(uL.t, t); gl.uniform1f(uL.S, S);
      gl.uniform1f(uL.gain, innerWidth < 700 ? 0.8 : 1); gl.uniform1i(uL.N, NS);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      gl.useProgram(emP); gl.bindVertexArray(emVAO);
      gl.uniform1f(uE.t, t); gl.uniform1f(uE.S, S); gl.uniform2f(uE.P, px, py); gl.uniform2f(uE.R, W, H);
      gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, NE);
    };

    const lp = loop((now, ms) => {
      const dt = Math.min(ms / 1000, 0.05); t += dt;
      const k = 1 - Math.exp(-dt * 4);
      px += ((fine ? tx : Math.sin(t * 0.3) * 0.6) - px) * k; py += ((fine ? ty : Math.cos(t * 0.25) * 0.4) - py) * k;
      draw();
      // adaptive resolution: 90 consecutive slow frames shrink the canvas once more
      slow = ms > 26 ? slow + 1 : 0;
      if (++frames > 30 && slow > 90 && scale > 0.5) { scale *= 0.8; slow = 0; size(); }
    }, { fps: 60, active: () => inView && !isPaused });
    const sync = () => { if (ready && inView && !isPaused && !still) lp.start(); else lp.stop(); };

    const onMove = e => { tx = (e.clientX / innerWidth) * 2 - 1; ty = (e.clientY / innerHeight) * 2 - 1; };
    const onScroll = () => { S = Math.min(1, scrollY / innerHeight); if (isPaused || still) draw(); };
    const ro = new ResizeObserver(([e]) => { w = e.contentRect.width; h = e.contentRect.height; size(); if (ready) draw(); });
    const io = new IntersectionObserver(([e]) => { inView = e.isIntersecting; sync(); });
    ro.observe(el); io.observe(el);
    if (fine) addEventListener("pointermove", onMove, { passive: true });
    addEventListener("scroll", onScroll, { passive: true });
    api.current.pause = p => { isPaused = p; sync(); };

    const init = () => {
      if (!build()) return;
      ready = true; onScroll(); draw(); sync();
      requestAnimationFrame(() => onReady?.());
    };
    guardContext(canvas, () => init());
    loadImage(import.meta.env.BASE_URL + "logo.jpeg").then(i => { if (!dead) { img = i; init(); } }, () => onFail?.());

    return () => {
      dead = true; lp.stop(); ro.disconnect(); io.disconnect();
      removeEventListener("pointermove", onMove); removeEventListener("scroll", onScroll);
      gl?.getExtension("WEBGL_lose_context")?.loseContext(); canvas.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={box} className="hr-gl" />;
}
