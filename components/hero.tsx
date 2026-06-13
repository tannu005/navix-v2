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
  const strokeRef = useRef(null);
  const cursorRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    runAnimations();
  }, []);

  // FIXED: Added white-space: nowrap to prevent letters from breaking lines
  function separateLetters(el) {
    if (!el) return;
    const text = el.textContent || "";
    const words = text.split(/\s+/);
    let html = "";
    words.forEach((word, wi) => {
      // Use nowrap on the word span to keep "Career" together
      html += `<span style="display:inline-flex; overflow:hidden; vertical-align:top; white-space:nowrap;">`;
      word.split("").forEach((ch) => {
        html += `<span class="cin-letter" style="display:inline-block">${ch}</span>`;
      });
      html += `</span>`;
      if (wi < words.length - 1) html += `<span style="display:inline-block; width:0.25em"> </span>`;
    });
    el.innerHTML = html;
  }

  function runAnimations() {
    const intro = introRef.current;
    if (!intro || !h1Ref.current) return;

    separateLetters(h1Ref.current);
    separateLetters(strokeRef.current);

    const h1Letters = h1Ref.current.querySelectorAll(".cin-letter");
    const strokeLetters = strokeRef.current?.querySelectorAll(".cin-letter");
    
    gsap.set([h1Letters, strokeLetters], { y: "115%", scaleY: 1.8, opacity: 0 });

    const introTL = gsap.timeline({ onComplete: () => setIntroGone(true) });
    const fonts = ["Anton","Jost","Alkatra","Nova Oval","Oswald","Lexend","Poppins","Syne"];
    
    fonts.forEach((f) => introTL.to(intro, { duration: 0.08, fontFamily: f }));
    introTL.to(intro, { scaleY: 0, duration: 1, ease: "expo.inOut", transformOrigin: "top" });

    // Entrance animation for headline
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

  return (
    <div className="relative w-full h-screen bg-[#080a0f] overflow-hidden">
      {!introGone && (
        <div ref={introRef} className="intro-overlay fixed inset-0 z-[1000] flex items-center justify-center bg-black text-white text-4xl uppercase font-bold">
          NAVIX AI
        </div>
      )}

      {/* NEW: AI Resume & Career Background Video */}
      <video loop autoPlay muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-30 z-0">
        <source src="https://video.twimg.com/amplify_video/1613142244415504384/vid/1280x720/mSj6C-X1oV1S5jHj.mp4" type="video/mp4" />
      </video>

      <section className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        {/* Badge */}
        <div className="flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary-foreground text-[10px] font-syne uppercase tracking-widest fade-up">
          <Sparkles className="w-3.5 h-3.5" />
          AI-Powered Career Intelligence
        </div>

        {/* FIXED Headline: "Elevate Your Career" */}
        <div className="relative mb-6">
          <h1 ref={h1Ref} className="text-[12vw] font-bebas text-white uppercase leading-none mix-blend-difference">
            Elevate Your Career
          </h1>
          <div ref={strokeRef} className="absolute inset-0 text-[12vw] font-bebas uppercase leading-none text-transparent pointer-events-none" style={{ WebkitTextStroke: "1px rgba(255,255,255,0.1)" }}>
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
      </section>

      {/* Custom Cursor Track */}
      <div ref={cursorRef} className="fixed top-0 left-0 z-[1001] w-24 h-8 bg-primary rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-[10px] text-white font-bold rotate-[-12deg] transition-transform duration-300">
        Navix
      </div>
    </div>
  );
}
