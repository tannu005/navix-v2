"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import gsap from "gsap";

// Import standard components
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
  const cursorRef = useRef(null);
  const trailContainerRef = useRef(null);

  // AI-Themed images for trail
  const trailImages = [
    "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=200&h=200&fit=crop",
    "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=200&h=200&fit=crop",
    "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=200&h=200&fit=crop",
    "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=200&h=200&fit=crop"
  ];

  let trail = [];
  let lastMouseX = 0;
  let lastMouseY = 0;
  let imageIndex = 0;
  let idleTimer;

  // STEP 1: HYDRATION FIX
  useEffect(() => {
    setMounted(true);
    const animId = requestAnimationFrame(cleanUpTrail);
    return () => {
      cancelAnimationFrame(animId);
      clearTimeout(idleTimer);
    };
  }, []);

  // STEP 2: ANIMATION INITIALIZATION
  useEffect(() => {
    if (mounted) {
      runCinematicAnimations();
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

  const createTrailImage = (x, y) => {
    if (!trailContainerRef.current) return;
    const imageSrc = trailImages[imageIndex];
    imageIndex = (imageIndex + 1) % trailImages.length;
    
    const img = document.createElement("img");
    img.className = "trail-img";
    img.src = imageSrc;
    img.style.width = "180px";
    img.style.height = "180px";
    img.style.left = `${x}px`;
    img.style.top = `${y}px`;
    img.style.borderRadius = "12px";
    img.style.opacity = "0";
    
    trailContainerRef.current.appendChild(img);
    gsap.to(img, { opacity: 0.7, scale: 1, duration: 0.8, ease: "power2.out" });

    trail.push({ element: img, removeTime: Date.now() + 800 });
  };

  const cleanUpTrail = () => {
    const now = Date.now();
    if (trail.length > 0 && now > trail[0].removeTime) {
      const item = trail.shift();
      gsap.to(item.element, {
        opacity: 0,
        scale: 0.5,
        duration: 1.5,
        ease: "power2.inOut",
        onComplete: () => item.element?.remove()
      });
    }
    requestAnimationFrame(cleanUpTrail);
  };

  const handleMouseMove = (e) => {
    if (!mounted) return;
    
    // OBSIDIAN CURSOR FOLLOW
    gsap.to(cursorRef.current, { x: e.clientX, y: e.clientY, duration: 0.6, ease: "power3.out" });

    const dist = Math.hypot(e.clientX - lastMouseX, e.clientY - lastMouseY);
    if (dist > 50) {
      createTrailImage(e.clientX, e.clientY);
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
    }

    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      trail.forEach(item => {
        gsap.to(item.element, { opacity: 0, duration: 2.5, ease: "power1.out" });
      });
    }, 150); 
  };

  // Prevent early render to stop hydration errors
  if (!mounted) return <div className="min-h-screen bg-[#05070a]" />;

  return (
    <main 
      onMouseMove={handleMouseMove} 
      className="relative min-h-screen bg-[#05070a] overflow-x-hidden"
    >
      <div ref={cursorRef} className="fixed top-0 left-0 z-[1001] pointer-events-none -translate-x-1/2 -translate-y-1/2">
        <div className="w-3 h-3 bg-primary rounded-full shadow-[0_0_15px_rgba(var(--primary),0.5)]" />
      </div>

      <div ref={trailContainerRef} className="fixed inset-0 pointer-events-none z-[12]" />

      {!introGone && (
        <div ref={introRef} className="intro-overlay bg-black text-primary font-bebas text-6xl fixed inset-0 z-[2000] flex items-center justify-center">
          NAVIX AI
        </div>
      )}

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
            Optimized resume building and interview prep workspace.
          </p>

          <Link href="/dashboard" className="fade-up">
            <Button size="lg" className="bg-primary hover:bg-primary/80 text-black font-bold px-12 h-14 rounded-full transition-all duration-500">
              Launch Navix <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

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
