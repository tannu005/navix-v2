"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);
  const [introGone, setIntroGone] = useState(false);
  const introRef = useRef(null);
  const introRedRef = useRef(null);
  const h1Ref = useRef(null);
  const strokeRef = useRef(null);
  const cursorRef = useRef(null);
  const gsapRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js";
    script.onload = () => {
      const gsap = window.gsap;
      gsapRef.current = gsap;
      runAnimations(gsap);
    };
    document.head.appendChild(script);
    return () => {
      if (document.head.contains(script)) document.head.removeChild(script);
    };
  }, []);

  function separateLetters(el) {
    if (!el) return;
    const text = el.textContent || "";
    const words = text.split(/\s+/);
    let html = "";
    words.forEach((word, wi) => {
      html += `<span style="display:inline-flex;overflow:hidden;vertical-align:top;">`;
      word.split("").forEach((ch) => {
        html += `<span class="cin-letter" style="display:inline-block">${ch}</span>`;
      });
      html += `</span>`;
      if (wi < words.length - 1) html += `<span style="display:inline-block;width:0.25em"> </span>`;
    });
    el.innerHTML = html;
  }

  function runAnimations(gsap) {
    const intro = introRef.current;
    const introRed = introRedRef.current;
    const h1 = h1Ref.current;
    const stroke = strokeRef.current;
    if (!intro || !h1 || !stroke) return;

    separateLetters(h1);
    separateLetters(stroke);

    const h1Letters = h1.querySelectorAll(".cin-letter");
    const strokeLetters = stroke.querySelectorAll(".cin-letter");
    gsap.set([h1Letters, strokeLetters], { y: "115%", scaleY: 1.8, opacity: 0 });

    const fonts = ["Anton","Jost","Alkatra","Nova Oval","Oswald","PT Serif","Lexend","Poppins","Syne"];
    const introTL = gsap.timeline({ onComplete: () => setIntroGone(true) });
    fonts.forEach((f) => introTL.to(intro, { duration: 0.09, fontFamily: f, ease: "none" }));
    if (introRed) {
      introTL.to(introRed, { scaleY: 2, duration: 1, ease: "expo.inOut" }, "-=0.3");
    }
    introTL.to(intro, { scaleY: 0, duration: 1, ease: "expo.inOut", transformOrigin: "top" }, "-=1");

    gsap.to(h1Letters, { y: "0%", scaleY: 1, opacity: 1, duration: 1.4, ease: "expo.out", stagger: 0.028, delay: 0.8 });
    gsap.to(strokeLetters, { y: "0%", scaleY: 1, opacity: 1, duration: 1.4, ease: "expo.out", stagger: 0.028, delay: 0.88 });
  }

  function handleMouseMove(e) {
    const gsap = gsapRef.current;
    if (!gsap || !cursorRef.current) return;
    gsap.to(cursorRef.current, { duration: 0.45, x: e.clientX, y: e.clientY, ease: "power2.out" });
  }
  function handleMouseEnter() {
    const gsap = gsapRef.current;
    if (!gsap || !cursorRef.current) return;
    gsap.to(cursorRef.current, { scale: 1, duration: 0.45, ease: "expo.inOut" });
  }
  function handleMouseLeave() {
    const gsap = gsapRef.current;
    if (!gsap || !cursorRef.current) return;
    gsap.to(cursorRef.current, { scale: 0, duration: 0.45, ease: "expo.inOut" });
  }

  return (
    <>
      {/* INTRO WIPE */}
      {!introGone && (
        <div
          ref={introRef}
          style={{
            position:"fixed", zIndex:1000, inset:0,
            background:"#080a0f",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontFamily:"Syne,sans-serif", fontSize:"3vw", fontWeight:700,
            color:"rgba(255,255,255,0.12)", letterSpacing:"0.4em", textTransform:"uppercase",
            transformOrigin:"top", overflow:"hidden",
          }}
        >
          Navix
          <div
            ref={introRedRef}
            style={{
              position:"absolute", bottom:0, left:0, width:"100%", height:"28%",
              background:"hsl(199,89%,44%)",
              transform:"scaleY(0)", transformOrigin:"bottom",
              overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:"20vw", fontWeight:900, letterSpacing:"-1vw",
              color:"transparent", WebkitTextStroke:"1px hsl(199,89%,70% / 0.2)",
            }}
          >
            <span style={{ transform:"scaleX(0.5) scaleY(1.6)", display:"block" }}>
              NAVIXNAVIXNAVIX
            </span>
          </div>
        </div>
      )}

      {/* CINEMATIC HERO */}
      <section
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          position:"relative", width:"100vw", minHeight:"100vh",
          display:"flex", alignItems:"center", justifyContent:"center",
          overflow:"hidden", background:"#080a0f",
        }}
      >
        {/* Full-bleed background video */}
        <video loop autoPlay muted playsInline
          style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", zIndex:0, opacity:0.22 }}>
          <source src="https://www.paulrogerdev.fr/codepen/pexels-artem-podrez-4832087-1280x720-30fps.mp4" type="video/mp4" />
        </video>

        {/* Gradient overlay */}
        <div style={{
          position:"absolute", inset:0, zIndex:1,
          background:"linear-gradient(to bottom, rgba(8,10,15,0.72) 0%, rgba(8,10,15,0.35) 40%, rgba(8,10,15,0.88) 100%)",
        }} />

        {/* Polygon-masked video shape */}
        <div style={{
          position:"absolute", zIndex:2,
          top:"50%", left:"50%",
          width:"40vw", aspectRatio:"1/1",
          transform:"translate(-64%, -50%) scaleX(-1)",
          clipPath:"polygon(64.8% 0.4%, 29.7% 0.4%, 9.8% 15.6%, 0% 100.4%, 64.5% 100.4%, 82% 88.3%)",
          overflow:"hidden",
        }}>
          <video loop autoPlay muted playsInline
            style={{ position:"absolute", top:"50%", left:"50%", width:"100vw", height:"100vh", objectFit:"cover", transform:"translate(-50%,-50%)" }}>
            <source src="https://www.paulrogerdev.fr/codepen/pexels-artem-podrez-4832087-1280x720-30fps.mp4" type="video/mp4" />
          </video>
        </div>

        {/* TEXT CONTENT */}
        <div style={{ position:"relative", zIndex:3, textAlign:"center", padding:"6rem 1.5rem 0", width:"100%", maxWidth:"900px" }}>

          {/* Badge */}
          <div style={{
            display:"inline-flex", alignItems:"center", gap:"0.5rem",
            padding:"0.35rem 0.9rem", borderRadius:"999px",
            border:"1px solid hsl(199 89% 60% / 0.3)",
            background:"hsl(199 89% 60% / 0.07)",
            color:"hsl(199,89%,72%)",
            fontFamily:"Syne,sans-serif", fontSize:"0.6875rem", fontWeight:600,
            letterSpacing:"0.12em", textTransform:"uppercase",
            marginBottom:"2rem",
            opacity: mounted ? 1 : 0, transition:"opacity 0.5s ease 1.8s",
          }}>
            <Sparkles style={{ width:"11px", height:"11px" }} />
            Powered by Gemini 2.0 Flash · Agentic AI
          </div>

          {/* Headline with letter animation */}
          <div style={{ position:"relative", lineHeight:0.9, marginBottom:"0.2rem" }}>
            {/* Filled */}
            <h1 ref={h1Ref} style={{
              fontFamily:"Syne,sans-serif", fontWeight:800,
              fontSize:"clamp(3.2rem,10.5vw,8.5rem)",
              lineHeight:0.9, letterSpacing:"-0.04em", textTransform:"uppercase",
              margin:0, color:"#fff", position:"relative", zIndex:1,
            }}>
              Navix AI
            </h1>
            {/* Stroke outline */}
            <div ref={strokeRef} aria-hidden="true" style={{
              fontFamily:"Syne,sans-serif", fontWeight:800,
              fontSize:"clamp(3.2rem,10.5vw,8.5rem)",
              lineHeight:0.9, letterSpacing:"-0.04em", textTransform:"uppercase",
              position:"absolute", top:0, left:0, width:"100%", textAlign:"center",
              color:"transparent", WebkitTextStroke:"1px rgba(255,255,255,0.14)",
              zIndex:2, pointerEvents:"none",
            }}>
              Navix AI
            </div>
          </div>

          {/* Sub-headline */}
          <p style={{
            fontFamily:"DM Sans,sans-serif", fontWeight:300,
            fontSize:"clamp(0.9rem,1.7vw,1.15rem)",
            color:"rgba(255,255,255,0.45)", letterSpacing:"0.02em",
            maxWidth:"480px", margin:"2rem auto 2.5rem", lineHeight:1.75,
            opacity: mounted ? 1 : 0, transition:"opacity 0.6s ease 2.1s",
          }}>
            Your AI career coach — resume building, interview prep, skill gap analysis and salary intelligence.
          </p>

          {/* CTAs */}
          <div style={{
            display:"flex", justifyContent:"center", gap:"0.75rem", flexWrap:"wrap",
            opacity: mounted ? 1 : 0, transition:"opacity 0.6s ease 2.2s",
          }}>
            <Link href="/dashboard">
              <Button size="lg" className="btn-glow" style={{
                background:"hsl(199,89%,48%)", color:"#fff", border:"none",
                fontFamily:"Syne,sans-serif", fontWeight:600, letterSpacing:"0.06em",
                fontSize:"0.75rem", height:"48px", padding:"0 2rem", textTransform:"uppercase",
              }}>
                Get Started Free <ArrowRight style={{ marginLeft:"0.5rem", width:"15px", height:"15px" }} />
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" style={{
                borderColor:"rgba(255,255,255,0.14)", color:"rgba(255,255,255,0.55)",
                background:"rgba(255,255,255,0.03)", backdropFilter:"blur(8px)",
                fontFamily:"Syne,sans-serif", fontWeight:500, letterSpacing:"0.05em",
                fontSize:"0.75rem", height:"48px", padding:"0 2rem", textTransform:"uppercase",
              }}>
                See Features
              </Button>
            </Link>
          </div>

          {/* Trust line */}
          <p style={{
            marginTop:"1.5rem", fontSize:"0.625rem", color:"rgba(255,255,255,0.22)",
            letterSpacing:"0.16em", textTransform:"uppercase", fontFamily:"Syne,sans-serif",
            opacity: mounted ? 1 : 0, transition:"opacity 0.6s ease 2.4s",
          }}>
            No credit card required · 8 AI tools · Built for job seekers
          </p>
        </div>

        {/* Scroll hint */}
        <div style={{
          position:"absolute", bottom:"2.5rem", left:"50%", transform:"translateX(-50%)",
          zIndex:4, display:"flex", flexDirection:"column", alignItems:"center", gap:"0.5rem",
          opacity: mounted ? 0.4 : 0, transition:"opacity 0.6s ease 2.6s",
        }}>
          <span style={{ fontSize:"0.55rem", letterSpacing:"0.22em", textTransform:"uppercase", color:"rgba(255,255,255,0.7)", fontFamily:"Syne,sans-serif" }}>
            Scroll
          </span>
          <div style={{
            width:"1px", height:"42px",
            background:"linear-gradient(to bottom, rgba(255,255,255,0.5), transparent)",
            animation:"cin-scroll-pulse 2s ease-in-out infinite",
          }} />
        </div>
      </section>

      {/* CINEMATIC CURSOR */}
      <div
        ref={cursorRef}
        style={{
          position:"fixed", top:0, left:0, zIndex:9998, pointerEvents:"none",
          transform:"translate(-50%,-50%) scale(0)",
          display:"flex", alignItems:"center", justifyContent:"center",
          width:"clamp(70px,7vw,100px)", aspectRatio:"10/4",
          color:"#fff", fontFamily:"Syne,sans-serif", fontWeight:700,
          fontSize:"clamp(8px,1vw,11px)", letterSpacing:"0.1em", textTransform:"uppercase",
        }}
      >
        <div style={{
          position:"absolute", inset:0,
          background:"hsl(199,89%,48%)",
          borderRadius:"50%", transform:"rotate(-12deg)",
        }} />
        <span style={{ position:"relative", zIndex:1, color:"#fff" }}>Explore</span>
      </div>

      <style>{`
        @keyframes cin-scroll-pulse {
          0%,100%{opacity:1;transform:scaleY(1);}
          50%{opacity:0.3;transform:scaleY(0.5);}
        }
      `}</style>
    </>
  );
}
