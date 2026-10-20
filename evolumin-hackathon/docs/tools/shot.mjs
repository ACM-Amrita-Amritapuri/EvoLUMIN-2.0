// usage: node shot.mjs <outPrefix> <url> <WxH> <scrollYs|auto:N|sel:#id,#id> [hoverSelector]
// Real Edge via playwright-core: scrolls the real page, so scroll-linked motion, IntersectionObserver and WebGL all run.
import { chromium } from "playwright-core";
const [prefix, url, size, plan, hover] = process.argv.slice(2);
const [W, H] = size.split("x").map(Number);
const b = await chromium.launch({ channel: "msedge", args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
const p = await b.newPage({ viewport: { width: W, height: H } });
p.on("pageerror", e => console.log("PAGEERROR", e.message));
p.on("console", m => { if (m.type() === "error") console.log("CONSOLE", m.text()); });
await p.goto(url, { waitUntil: "load" }); await p.waitForTimeout(2500);
const total = await p.evaluate(() => document.documentElement.scrollHeight);
console.log("scrollHeight", total);
let ys = [];
if (plan.startsWith("auto:")) { const n = +plan.slice(5); for (let i = 0; i < n; i++) ys.push(Math.min(i * H * 0.9, Math.max(0, total - H))); }
else if (plan.startsWith("sel:")) ys = plan.slice(4).split(",");
else ys = plan.split(",").map(Number);
let i = 0;
for (const y of ys) {
  if (typeof y === "string") await p.evaluate(s => document.querySelector(s)?.scrollIntoView({ behavior: "instant", block: "start" }), y);
  else await p.evaluate(v => window.scrollTo({ top: v, behavior: "instant" }), y);
  await p.waitForTimeout(1100);
  if (hover) { try { await p.hover(hover, { timeout: 1500 }); await p.waitForTimeout(600); } catch {} }
  await p.screenshot({ path: `${prefix}_${i++}.png` });
}
await b.close();
