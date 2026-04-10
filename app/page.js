"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import gsap from "gsap";

// Import your Navix UI components
import Features from "@/components/features";
import HowItWorks from "@/components/how-it-works";
import Testimonials from "@/components/testimonials";
import FAQs from "@/components/faqs";
import CTA from "@/components/cta";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [introGone, setIntroGone] = useState(false);
  
  const introRef = useRef(null);
  const h1UnderRef = useRef(null);
  const h1OverRef = useRef(null);
  const cursorRef = useRef(null);
  const canvasRef = useRef(null);

  // String Physics Ref
  const mouse = useRef({ x: 0, y: 0 });
  const points = useRef([]);
  const numPoints = 20;

  useEffect(() => {
    setMounted(true);
    // Initialize points for the string
    for (let i = 0; i < numPoints; i++) {
      points.current.push({ x: 0, y: 0 });
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      runCinematicAnimations();
      
      // String and Mask Animation Loop
      const tick = () => {
        drawString();
        updateHeadlineMask();
        requestAnimationFrame(tick);
      };
      const animId = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(animId);
    }
  }, [mounted]);

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
    if (!h1UnderRef.current || !h1OverRef.current) return;
    separateLetters(h1UnderRef.current);
    separateLetters(h1OverRef.current);
    
    const uLetters = h1UnderRef.current.querySelectorAll(".cin-letter");
    const oLetters = h1OverRef.current.querySelectorAll(".cin-letter");
    
    gsap.set([uLetters, oLetters], { y: "115%", scaleY: 1.8, opacity: 0 });
    const introTL = gsap.timeline({ onComplete: () => setIntroGone(true) });
    
    introTL.to(introRef.current, { scaleY: 0, duration: 1.2, ease: "expo.inOut", transformOrigin: "top" });
    gsap.to([uLetters, oLetters], { y: "0%", scaleY: 1, opacity: 1, duration: 1.5, ease: "expo.out", stagger: 0.02, delay: 0.6 });
  }

  const drawString = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let px = mouse.current.x;
    let py = mouse.current.y;

    points.current.forEach((p) => {
      p.x += (px - p.x) * 0.35; // Friction/Stiffness
      p.y += (py - p.y) * 0.35;
      px = p.x;
      py = p.y;
    });

    ctx.strokeStyle = "rgba(199, 89, 60, 0.5)";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(points.current[0].x, points.current[0].y);
    for (let i = 1; i < points.current.length; i++) {
      ctx.lineTo(points.current[i].x, points.current[i].y);
    }
    ctx.stroke();
  };

  const updateHeadlineMask = () => {
    if (h1OverRef.current) {
      const rect = h1OverRef.current.getBoundingClientRect();
      const x = mouse.current.x - rect.left;
      const y = mouse.current.y - rect.top;
      const maskValue = `radial-gradient(circle 250px at ${x}px ${y}px, black, transparent)`;
      h1OverRef.current.style.webkitMask = maskValue;
      h1OverRef.current.style.mask = maskValue;
    }
  };

  const handleMouseMove = (e) => {
    mouse.current = { x: e.clientX, y: e.clientY };
  };

  // HYDRATION GUARD: Don't render interactive elements until mounted
  if (!mounted) return <div className="min-h-screen bg-[#05070a]" />;

  return (
    <main onMouseMove={handleMouseMove} className="relative min-h-screen bg-[#05070a] overflow-x-hidden selection:bg-primary/30">
      
      {/* Follow String Canvas */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[1001]" />

      {/* Cinematic Intro */}
      {!introGone && (
        <div ref={introRef} className="intro-overlay bg-black text-primary font-bebas text-6xl fixed inset-0 z-[2000] flex items-center justify-center">
          NAVIX AI
        </div>
      )}

      {/* Hero Section */}
      <section className="relative w-full h-screen flex flex-col items-center justify-center text-center px-4">
        {/* Background Career/Tech Video */}
        <video loop autoPlay muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-10 grayscale z-0">
          <source src="https://video.twimg.com/amplify_video/1613142244415504384/vid/1280x720/mSj6C-X1oV1S5jHj.mp4" type="video/mp4" />
        </video>

        <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
          <div className="flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] font-syne uppercase tracking-widest fade-up">
            <Sparkles className="w-3.5 h-3.5" />
            Groq Powered Career Coaching
          </div>

          {/* Masked Headline Reveal */}
          <div className="relative mb-6">
            <h1 ref={h1UnderRef} className="text-[10vw] font-bebas uppercase leading-none tracking-tighter headline-under">
              Elevate Your Career
            </h1>
            <h1 ref={h1OverRef} className="text-[10vw] font-bebas uppercase leading-none tracking-tighter headline-over absolute top-0 left-0 w-full z-10">
              Elevate Your Career
            </h1>
          </div>

          <p className="max-w-lg mx-auto text-zinc-500 font-dm text-base mb-10 fade-up">
            Optimized workspace for resume building and interview prep.
          </p>

          <Link href="/dashboard" className="fade-up">
            <Button size="lg" className="bg-primary hover:bg-primary/80 text-black font-bold px-12 h-14 rounded-full transition-all duration-500">
              Launch Navix <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Main Content */}
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
