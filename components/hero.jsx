"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import gsap from "gsap";

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);
  const [introGone, setIntroGone] = useState(false);
  const introRef = useRef(null);
  const h1Ref = useRef(null);
  const cursorRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    runAnimations();
  }, []);

  function separateLetters(el) {
    if (!el) return;
    const text = el.textContent || "";
    el.innerHTML = text.split("").map(char => 
      `<span class="hero-letter inline-block">${char === " " ? "\u00A0" : char}</span>`
    ).join("");
  }

  function runAnimations() {
    if (!h1Ref.current) return;
    separateLetters(h1Ref.current);
    
    const letters = h1Ref.current.querySelectorAll(".hero-letter");
    gsap.set(letters, { y: "115%", opacity: 0 });

    const introTL = gsap.timeline({ onComplete: () => setIntroGone(true) });
    const fonts = ["Anton", "Jost", "Alkatra", "Nova Oval", "Oswald", "Poppins", "Syne"];
    
    fonts.forEach(f => introTL.to(introRef.current, { duration: 0.1, fontFamily: f }));
    introTL.to(introRef.current, { scaleY: 0, duration: 1, ease: "expo.inOut" });

    gsap.to(letters, { y: "0%", opacity: 1, duration: 1, stagger: 0.03, delay: 0.8, ease: "expo.out" });
  }

  function handleMouseMove(e) {
    gsap.to(cursorRef.current, { x: e.clientX, y: e.clientY, duration: 0.4 });
  }

  return (
    <div onMouseMove={handleMouseMove} className="relative w-full h-screen bg-[#080a0f] overflow-hidden">
      {!introGone && (
        <div ref={introRef} className="intro-overlay">
          NAVIX AI
          <div className="intro-red-bar" />
        </div>
      )}

      {/* Background Video */}
      <video loop autoPlay muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-20">
        <source src="https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-a-circuit-board-1577-large.mp4" type="video/mp4" />
      </video>

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <div className="flex items-center gap-2 mb-6 px-4 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary-foreground text-xs font-syne uppercase tracking-widest">
          <Sparkles className="w-3 h-3" />
          Powered by Gemini 2.0 Flash
        </div>

        <h1 ref={h1Ref} className="text-[12vw] font-bebas text-white uppercase leading-none mb-8">
          Elevate Your Career
        </h1>

        <div className="flex gap-4">
          <Link href="/dashboard">
            <Button size="lg" className="bg-primary hover:bg-primary/80 text-white font-syne px-8">
              Get Started <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Cinematic Cursor */}
      <div ref={cursorRef} className="fixed top-0 left-0 z-[1001] pointer-events-none -translate-x-1/2 -translate-y-1/2 scale-0 group-hover:scale-100 transition-transform">
        <div className="w-20 h-8 bg-primary rounded-full rotate-[-12deg] flex items-center justify-center text-[10px] text-white font-bold uppercase">
          Explore
        </div>
      </div>
    </div>
  );
}
