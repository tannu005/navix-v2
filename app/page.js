"use client";

import { useEffect, useRef, useState } from "react";
import { ReactLenis } from '@studio-freight/react-lenis';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [logoFont, setLogoFont] = useState("font-bebas");
  const containerRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);
    
    // 1. Dynamic Logo Font Swap based on scroll
    ScrollTrigger.create({
      trigger: "#features",
      start: "top center",
      onEnter: () => setLogoFont("font-syne"),
      onLeaveBack: () => setLogoFont("font-bebas"),
    });

    // 2. Obsidian Section "Assembly" Animation
    const sections = gsap.utils.toArray(".obsidian-section");
    sections.forEach((section) => {
      gsap.fromTo(section, 
        { scale: 0.8, opacity: 0, rotateX: -10 },
        { 
          scale: 1, opacity: 1, rotateX: 0,
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "top center",
            scrub: 1,
          }
        }
      );
    });
  }, [mounted]);

  if (!mounted) return null;

  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.5 }}>
      <main className="relative">
        
        {/* Dynamic Logo Navigation */}
        <nav className="fixed top-0 w-full z-[1000] p-8 flex justify-between items-center mix-blend-difference">
          <div className={`logo-text text-4xl uppercase tracking-tighter ${logoFont}`}>
            Navix
          </div>
          <div className="font-dm text-[10px] uppercase tracking-[0.5em]">Menu</div>
        </nav>

        {/* Hero Section */}
        <section className="obsidian-section h-screen flex items-center justify-center">
          <h1 className="text-[15vw] font-bebas leading-none uppercase text-center">
            Digital <br /> <span className="text-primary">Assembly</span>
          </h1>
        </section>

        {/* Features Section (Triggers Logo Morph) */}
        <section id="features" className="obsidian-section min-h-screen bg-white text-black p-24">
          <div className="grid grid-cols-2 gap-24">
            <div className="space-y-8">
              <span className="font-syne text-xs uppercase tracking-widest">Protocol 001</span>
              <h2 className="text-8xl font-bebas uppercase leading-none">Automated Intelligence</h2>
            </div>
            <div className="flex items-end">
              <p className="font-dm text-2xl leading-tight">
                Rebuilding the interface of career growth through precision agentic workflows.
              </p>
            </div>
          </div>
        </section>

      </main>
    </ReactLenis>
  );
}
