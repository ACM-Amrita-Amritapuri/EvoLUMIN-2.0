import React,{useRef,useEffect} from "react";
import {LazyMotion,domAnimation,m,useScroll,useTransform,useSpring,useMotionValue,useMotionTemplate,useVelocity,useReducedMotion,useInView,animate,stagger,AnimatePresence,MotionConfig,useMotionValueEvent,useAnimationFrame} from "motion/react";
import {renderToString} from "react-dom/server";

// (a) pinned scrollytelling: outer tall, inner sticky
function Pinned(){
  const ref=useRef(null);
  const {scrollYProgress:p}=useScroll({target:ref,offset:["start start","end end"]});
  const bg=useTransform(p,[0,1],["0%","-30%"]);      // slow layer
  const mid=useTransform(p,[0,1],["0%","-80%"]);     // fast layer
  const op=useTransform(p,[0,.2,.8,1],[0,1,1,0]);    // accelerated candidate (opacity)
  const clip=useTransform(p,[0,.5],["inset(0 100% 0 0)","inset(0 0% 0 0)"]);
  return <section ref={ref} style={{height:"400vh"}}>
    <div style={{position:"sticky",top:0,height:"100vh",overflow:"hidden"}}>
      <m.div style={{y:bg}}/><m.div style={{y:mid,opacity:op,clipPath:clip}}/>
    </div></section>;
}
// (b) per-word scroll reveal: ONE useScroll, per-word useTransform inside small child (no re-render, MVs)
function Word({w,i,n,p}){
  const s=i/n,e=s+1/n; const o=useTransform(p,[s,e],[.15,1]);
  return <m.span style={{opacity:o}}>{w} </m.span>;
}
function Words({text}){
  const ref=useRef(null); const ws=text.split(" ");
  const {scrollYProgress:p}=useScroll({target:ref,offset:["start 0.9","start 0.3"]});
  return <p ref={ref}>{ws.map((w,i)=><Word key={i} w={w} i={i} n={ws.length} p={p}/>)}</p>;
}
// (c) pointer tilt
function Tilt(){
  const x=useMotionValue(0),y=useMotionValue(0);
  const cfg={stiffness:150,damping:18,mass:.4};
  const rx=useSpring(useTransform(y,[-.5,.5],[10,-10]),cfg), ry=useSpring(useTransform(x,[-.5,.5],[-10,10]),cfg);
  const gx=useTransform(x,[-.5,.5],[0,100]), gy=useTransform(y,[-.5,.5],[0,100]);
  const bg=useMotionTemplate`radial-gradient(400px at ${gx}% ${gy}%, #ff4d5e55, transparent)`;
  return <m.div style={{rotateX:rx,rotateY:ry,transformPerspective:800,background:bg}}
    onPointerMove={e=>{const r=e.currentTarget.getBoundingClientRect();x.set((e.clientX-r.left)/r.width-.5);y.set((e.clientY-r.top)/r.height-.5)}}
    onPointerLeave={()=>{x.set(0);y.set(0)}}/>;
}
// (d) count-up
function Count({to}){
  const ref=useRef(null); const inView=useInView(ref,{once:true,margin:"0px 0px -20% 0px"});
  useEffect(()=>{ if(!inView) return; const c=animate(0,to,{duration:1.6,ease:[.16,1,.3,1],onUpdate:v=>{ref.current.textContent=Math.round(v)}}); return()=>c.stop()},[inView,to]);
  return <span ref={ref}>0</span>;
}
// (e) stagger via variants + imperative stagger()
const list={show:{transition:{staggerChildren:.08,delayChildren:.1}}}, item={hidden:{opacity:0,y:30},show:{opacity:1,y:0}};
function Stag(){
  const ref=useRef(null);
  useEffect(()=>{animate(ref.current.children,{opacity:[0,1],y:[30,0]},{delay:stagger(.08,{from:"center"}),duration:.6})},[]);
  return <><m.ul variants={list} initial="hidden" whileInView="show" viewport={{once:true,margin:"0px 0px -15% 0px"}}><m.li variants={item}/></m.ul><ul ref={ref}><li/></ul></>;
}
// (f) velocity skew
function Skew(){
  const {scrollY}=useScroll(); const v=useVelocity(scrollY);
  const sm=useSpring(v,{stiffness:400,damping:50});
  const skew=useTransform(sm,[-3000,0,3000],[-4,0,4],{clamp:true});
  return <m.div style={{skewY:skew}}/>;
}
// (g) route transitions
function Routes({path,children}){
  return <AnimatePresence mode="wait" initial={false}><m.main key={path} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-20}} transition={{duration:.35}}>{children}</m.main></AnimatePresence>;
}
// (h) CSS var hue per section, no re-render
function Hue(){
  const ref=useRef(null); const {scrollYProgress:p}=useScroll();
  useMotionValueEvent(p,"change",v=>document.documentElement.style.setProperty("--hue",String(Math.round(v*360))));
  const hue=useTransform(p,[0,1],[0,360]);
  return <m.div ref={ref} style={{"--hue":hue,background:"hsl(var(--hue) 90% 55%)"}}/>;
}
function App(){return <MotionConfig reducedMotion="user"><LazyMotion features={domAnimation} strict><Pinned/><Words text="a b c"/><Tilt/><Count to={5}/><Stag/><Skew/><Routes path="/"/><Hue/></LazyMotion></MotionConfig>}
console.log(renderToString(<App/>).length);
