"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import gsap from "gsap";

// Import your other Navix sections
import Features from "@/components/features";
import HowItWorks from "@/components/how-it-works";
import Testimonials from "@/components/testimonials";
import FAQs from "@/components/faqs";
import CTA from "@/components/cta";

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const [introGone, setIntroGone] = useState(false);
  const introRef = useRef(null);
  const h1Ref = useRef(null);
  const strokeRef = useRef(null);
  const cursorRef = useRef(null);
  const trailContainerRef = useRef(null);

  // Magic Trail Configuration
  const trailConfig = {
    imageLifespan: 600,
    mouseThreshold: 40,
    inDuration: 0.6,
    outDuration: 0.8,
  };

  const trailImages = [
    "https://assets.codepen.io/7558/cr-blurry-orange-small-001.jpg",
    "https://assets.codepen.io/7558/cr-blurry-orange-small-002.jpg",
    "https://assets.codepen.io/7558/cr-blurry-orange-small-003.jpg",
    "https://assets.codepen.io/7558/cr-blurry-orange-small-004.jpg",
    "https://assets.codepen.io/7558/cr-blurry-orange-small-005.jpg"
  ];

  let trail = [];
  let lastMouseX = 0;
  let lastMouseY = 0;
  let imageIndex = 0;

  useEffect(() => {
    setMounted(true);
    runCinematicAnimations();
    const animId = requestAnimationFrame(cleanUpTrail);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Fixes the "C areer" breaking issue by wrapping words in nowrap spans
  function separateLetters(el) {
    if (!el) return;
    const text = el.textContent || "";
    const words = text.split(/\s+/);
    let html = "";
    words.forEach((word, wi) => {
      html += `<span style="display:inline-flex; overflow:hidden; vertical-align:top; white-space:nowrap;">`;
      word.split("").forEach((ch) => {
        html += `<span class="cin-letter" style="display:inline-block">${ch}</span>`;
      });
      html += `</span>`;
      if (wi < words.length - 1) html += `<span style="display:inline-block; width:0.25em"> </span>`;
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
    const fonts = ["Anton","Jost","Alkatra","Nova Oval","Oswald","Lexend","Poppins","Syne"];
    
    fonts.forEach((f) => introTL.to(introRef.current, { duration: 0.08, fontFamily: f }));
    introTL.to(introRef.current, { scaleY: 0, duration: 1, ease: "expo.inOut", transformOrigin: "top" });

    gsap.to([h1Letters, strokeLetters], { 
      y: "0%", 
      scaleY: 1, 
      opacity: 1, 
      duration: 1.2, 
      ease: "expo.out", 
      stagger: 0.02, 
      delay: 0.8 
    });
  }

  const createTrailImage = (x, y) => {
    const imageSrc = trailImages[imageIndex];
    imageIndex = (imageIndex + 1) % trailImages.length;
    
    const img = document.createElement("img");
    img.className = "trail-img";
    img.src = imageSrc;
    img.style.width = "200px";
    img.style.height = "200px";
    img.style.left = `${x}px`;
    img.style.top = `${y}px`;
    img.style.transform = `translate(-50%, -50%) scale(0)`;
    
    trailContainerRef.current?.appendChild(img);
    
    gsap.to(img, { scale: 1, duration: trailConfig.inDuration, ease: "expo.out" });

    trail.push({
      element: img,
      removeTime: Date.now() + trailConfig.imageLifespan
    });
  };

  const cleanUpTrail = () => {
    const now = Date.now();
    if (trail.length > 0 && now > trail[0].removeTime) {
      const item = trail.shift();
      gsap.to(item.element, {
        scale: 0,
        opacity: 0,
        duration: trailConfig.outDuration,
        onComplete: () => item.element.remove()
      });
    }
    requestAnimationFrame(cleanUpTrail);
  };

  const handleMouseMove = (e) => {
    // Update Custom Cursor
    gsap.to(cursorRef.current, { x: e.clientX, y: e.clientY, duration: 0.4, ease: "power2.out" });

    // Handle Magic Trail
    const dist = Math.hypot(e.clientX - lastMouseX, e.clientY - lastMouseY);
    if (dist > trailConfig.mouseThreshold) {
      createTrailImage(e.clientX, e.clientY);
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
    }
  };

  return (
    <div onMouseMove={handleMouseMove} className="relative min-h-screen bg-black overflow-hidden selection:bg-primary/30">
      
      {/* 1. MAGIC TRAIL CONTAINER */}
      <div ref={trailContainerRef} className="fixed inset-0 pointer-events-none z-[12]" />

      {/* 2. INTRO OVERLAY */}
      {!introGone && (
        <div ref={introRef} className="intro-overlay">
          NAVIX AI
        </div>
      )}

      {/* 3. HERO SECTION */}
      <section className="relative w-full h-screen flex flex-col items-center justify-center text-center px-4">
        
        {/* AI Resume/Job Background Video */}
        <video loop autoPlay muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-20 z-0">
          <source src="https://video.twimg.com/amplify_video/1613142244415504384/vid/1280x720/mSj6C-X1oV1S5jHj.mp4" type="video/mp4" />
        </video>

        <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
          <div className="flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary-foreground text-[10px] font-syne uppercase tracking-widest fade-up">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered Career Intelligence
          </div>

          <div className="relative mb-6">
            <h1 ref={h1Ref} className="text-[12vw] font-bebas text-white uppercase leading-none tracking-tighter">
              Elevate Your Career
            </h1>
            <div ref={strokeRef} className="absolute inset-0 text-[12vw] font-bebas uppercase leading-none text-transparent pointer-events-none tracking-tighter" style={{ WebkitTextStroke: "1px rgba(255,255,255,0.1)" }}>
              Elevate Your Career
            </div>
          </div>

          <p className="max-w-md text-zinc-400 font-dm text-sm mb-10 fade-up" style={{ transitionDelay: "1.2s" }}>
            The intelligent path to your next role. Optimize resumes, master interviews, and track opportunities in one workspace.
          </p>

          <div className="flex gap-4 fade-up" style={{ transitionDelay: "1.4s" }}>
            <Link href="/dashboard">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-syne px-10 h-14 uppercase tracking-wider text-xs">
                Launch Dashboard <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. ADDITIONAL CONTENT SECTIONS */}
      <div className="relative z-20 bg-black">
        <Features />
        <HowItWorks />
        <Testimonials />
        <FAQs />
        <CTA />
      </div>

      {/* 5. CUSTOM CINEMATIC CURSOR */}
      <div ref={cursorRef} className="fixed top-0 left-0 z-[1001] pointer-events-none -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
        <div className="w-24 h-8 bg-primary rounded-full rotate-[-12deg] flex items-center justify-center text-[10px] text-white font-bold uppercase tracking-widest opacity-0 hover:opacity-100 transition-opacity">
          Navix
        </div>
      </div>

    </div>
  );
}
