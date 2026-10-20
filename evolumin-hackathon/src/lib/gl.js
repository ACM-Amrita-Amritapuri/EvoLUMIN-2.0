// Tiny raw-WebGL2 helpers shared by the background smoke and the hero flame (replaces three.js: ~1 kB instead of ~130 kB gzip).

export const VS_TRI = "#version 300 es\nlayout(location=0)in vec2 a;void main(){gl_Position=vec4(a,0.,1.);}";

export const getGL = (canvas, attrs) => canvas.getContext("webgl2", attrs) || null;

export function program(gl, vs, fs) {
  const sh = (type, src) => {
    const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  };
  const p = gl.createProgram();
  gl.attachShader(p, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(p, sh(gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
  return p;
}

// One oversized triangle covers the viewport (faster than a quad, no diagonal seam). Call once, bind per frame via gl.bindVertexArray(vao).
export function triangle(gl) {
  const vao = gl.createVertexArray(); gl.bindVertexArray(vao);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  return vao;
}

export const loadImage = url => new Promise((res, rej) => { const i = new Image(); i.decoding = "async"; i.onload = () => res(i); i.onerror = rej; i.src = url; });

export function texture(gl, img, { mips = true, unit = 0 } = {}) {
  const t = gl.createTexture(); gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, t);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
  if (mips) gl.generateMipmap(gl.TEXTURE_2D);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, mips ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  return t;
}

export const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

// Heuristic quality tier: weak devices get fewer taps/particles and a smaller canvas. Cheap, no async APIs.
export function tier() {
  const coarse = matchMedia("(pointer: coarse)").matches, cores = navigator.hardwareConcurrency || 4, mem = navigator.deviceMemory || 4;
  return { low: coarse || cores <= 4 || mem <= 4 };
}

// Frame loop that only runs while `active()` is true; capped to `fps`; stops on hidden tab. Returns { start, stop }.
export function loop(step, { fps = 60, active = () => true } = {}) {
  let raf = 0, last = 0, on = false;
  const gap = 1000 / fps - 1;
  const tick = t => {
    raf = 0; if (!on) return;
    if (document.hidden || !active()) { on = false; return; }
    if (t - last >= gap) { step(t / 1000, t - last); last = t; }
    raf = requestAnimationFrame(tick);
  };
  const start = () => { if (on) return; on = true; if (!raf) raf = requestAnimationFrame(tick); };
  const stop = () => { on = false; if (raf) cancelAnimationFrame(raf); raf = 0; };
  document.addEventListener("visibilitychange", () => { if (!document.hidden) start(); });
  return { start, stop };
}

// Wire context loss/restore: `init` must rebuild every GL object.
export function guardContext(canvas, init) {
  canvas.addEventListener("webglcontextlost", e => e.preventDefault());
  canvas.addEventListener("webglcontextrestored", init);
}
