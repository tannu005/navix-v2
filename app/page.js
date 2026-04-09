"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import gsap from "gsap";

// Import your existing Navix components
import Features from "@/components/features";
import HowItWorks from "@/components/how-it-works";
import Testimonials from "@/components/testimonials";
import FAQs from "@/components/faqs";
import CTA from "@/components/cta";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [introGone, setIntroGone] = useState(false);
  
  const introRef = useRef(null);
  const h1Ref = useRef(null);
  const strokeRef = useRef(null);
  const canvasRef = useRef(null);

  // String Physics Variables
  const mouse = useRef({ x: 0, y: 0 });
  const points = useRef([]);
  const numPoints = 20; // Length of the string

  useEffect(() => {
    setMounted(true);
    // Initialize string points
    for (let i = 0; i < numPoints; i++) {
      points.current.push({ x: 0, y: 0 });
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      runCinematicAnimations();
      const render = () => {
        drawString();
        requestAnimationFrame(render);
      };
      render();
    }
  }, [mounted]);

  // Cinematic Intro Text Logic
  function separateLetters(el) {
    if (!el) return;
    const text = el.textContent || "";
    const words = text.split(/\s+/);
    let html = "";
    words.forEach((word) => {
      html += `<span style="display:inline-flex; overflow:hidden; vertical-align:top; white-space:nowrap;">`;
      word.split("").forEach((ch) => {
        html += `<span class="cin-letter" style="display:inline-block">${ch}</span>`;
      });
      html += `</span>`;
      html += `<span style="display:inline-block; width:0.25em"> </span>`;
    });
    el.innerHTML = html;
  }

  function runCinematicAnimations() {
    if (!h1Ref.current) return;
    separateLetters(h1Ref.current);
    separateLetters(strokeRef.current);
    
    const h1Letters = h1Ref.current.querySelectorAll(".cin-letter");
    const strokeLetters = strokeRef.current?.querySelectorAll(".cin-letter");
    
    gsap.set([h1Letters, strokeLetters], { y: "115%", scaleY: 1.8, opacity: 0 });
    const introTL = gsap.timeline({ onComplete: () => setIntroGone(true) });
    
    introTL.to(introRef.current, { scaleY: 0, duration: 1.2, ease: "expo.inOut", transformOrigin: "top" });
    gsap.to([h1Letters, strokeLetters], { y: "0%", scaleY: 1, opacity: 1, duration: 1.5, ease: "expo.out", stagger: 0.02, delay: 0.6 });
  }

  // Physics Logic for the "String"
  const drawString = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let px = mouse.current.x;
    let py = mouse.current.y;

    points.current.forEach((p, index) => {
      p.x += (px - p.x) * 0.35; // LERP for string stiffness
      p.y += (py - p.y) * 0.35;
      px = p.x;
      py = p.y;
    });

    // Draw the String
    ctx.strokeStyle = "rgba(199, 89, 60, 0.6)"; // Your primary theme color
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(points.current[0].x, points.current[0].y);

    for (let i = 1; i < points.current.length; i++) {
      ctx.lineTo(points.current[i].x, points.current[i].y);
    }
    ctx.stroke();

    // Draw the cursor head
    ctx.fillStyle = "#c7593c";
    ctx.beginPath();
    ctx.arc(mouse.current.x, mouse.current.y, 4, 0, Math.PI * 2);
    ctx.fill();
  };

  const handleMouseMove = (e) => {
    mouse.current = { x: e.clientX, y: e.clientY };
  };

  if (!mounted) return <div className="min-h-screen bg-[#05070a]" />;

  return (
    <main onMouseMove={handleMouseMove} className="relative min-h-screen bg-[#05070a] overflow-x-hidden">
      
      {/* 1. THE STRING CANVAS (Replaces Image Trail) */}
      <canvas 
        ref={canvasRef} 
        className="fixed inset-0 pointer-events-none z-[1001]"
      />

      {/* 2. CINEMATIC INTRO */}
      {!introGone && (
        <div ref={introRef} className="intro-overlay bg-black text-[#c7593c] font-bebas text-6xl fixed inset-0 z-[2000] flex items-center justify-center">
          NAVIX AI
        </div>
      )}

      {/* 3. HERO SECTION */}
      <section className="relative w-full h-screen flex flex-col items-center justify-center text-center px-4">
        <video loop autoPlay muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-10 grayscale z-0">
          <source src="https://video.twimg.com/amplify_video/1613142244415504384/vid/1280x720/mSj6C-X1oV1S5jHj.mp4" type="video/mp4" />
        </video>

        <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
          <div className="flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] font-syne uppercase tracking-widest fade-up">
            <Sparkles className="w-3.5 h-3.5" />
            AI Career Coaching
          </div>

          <div className="relative mb-6">
            <h1 ref={h1Ref} className="text-[10vw] font-bebas text-white uppercase leading-none tracking-tighter">
              Elevate Your Career
            </h1>
            <div ref={strokeRef} className="absolute inset-0 text-[10vw] font-bebas uppercase leading-none text-transparent pointer-events-none opacity-20" style={{ WebkitTextStroke: "1px #fff" }}>
              Elevate Your Career
            </div>
          </div>

          <p className="max-w-lg mx-auto text-zinc-500 font-dm text-base mb-10 fade-up">
            Optimized workspace for resume building and Groq AI career intelligence.
          </p>

          <Link href="/dashboard" className="fade-up">
            <Button size="lg" className="bg-primary hover:bg-primary/80 text-black font-bold px-12 h-14 rounded-full transition-all duration-500">
              Launch Navix <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* 4. MAIN CONTENT */}
      <div className="relative z-20 bg-[#05070a]">
        <Features />
        <HowItWorks />
        <Testimonials />
        <FAQs />
        <CTA />
      </div>
    </main>
  );
}
