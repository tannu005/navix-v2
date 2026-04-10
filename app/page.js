"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReactLenis } from '@studio-freight/react-lenis';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Import your components
import Features from "@/components/features";
import HowItWorks from "@/components/how-it-works";
import Testimonials from "@/components/testimonials";
import FAQs from "@/components/faqs";
import CTA from "@/components/cta";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [introGone, setIntroGone] = useState(false);
  
  const introRef = useRef(null);
  const h1UnderRef = useRef(null);
  const h1OverRef = useRef(null);
  const canvasRef = useRef(null);
  const heroRef = useRef(null);

  // String Physics
  const mouse = useRef({ x: 0, y: 0 });
  const points = useRef([]);
  const numPoints = 25;

  useEffect(() => {
    setMounted(true);
    for (let i = 0; i < numPoints; i++) points.current.push({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    if (mounted) {
      runCinematicAnimations();
      const render = () => {
        drawString();
        updateHeadlineMask();
        requestAnimationFrame(render);
      };
      const animId = requestAnimationFrame(render);
      return () => cancelAnimationFrame(animId);
    }
  }, [mounted]);

  const runCinematicAnimations = () => {
    const tl = gsap.timeline({ onComplete: () => setIntroGone(true) });
    tl.to(introRef.current, { scaleY: 0, duration: 1.5, ease: "expo.inOut", transformOrigin: "top" });
    
    // Smooth reveal for all fade-up items
    gsap.to(".fade-up", {
      opacity: 1,
      y: 0,
      duration: 1.5,
      stagger: 0.1,
      ease: "expo.out",
      delay: 0.5
    });
  };

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
      p.x += (px - p.x) * 0.3; 
      p.y += (py - p.y) * 0.3;
      px = p.x;
      py = p.y;
    });

    ctx.strokeStyle = "rgba(199, 89, 60, 0.4)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(points.current[0].x, points.current[0].y);
    for (let i = 1; i < points.current.length; i++) ctx.lineTo(points.current[i].x, points.current[i].y);
    ctx.stroke();
  };

  const updateHeadlineMask = () => {
    if (h1OverRef.current) {
      const rect = h1OverRef.current.getBoundingClientRect();
      const x = mouse.current.x - rect.left;
      const y = mouse.current.y - rect.top;
      h1OverRef.current.style.mask = `radial-gradient(circle 250px at ${x}px ${y}px, black, transparent)`;
      h1OverRef.current.style.webkitMask = `radial-gradient(circle 250px at ${x}px ${y}px, black, transparent)`;
    }
  };

  const handleMouseMove = (e) => {
    mouse.current = { x: e.clientX, y: e.clientY };

    // MAGNETIC BUTTON LOGIC
    const magneticBtns = document.querySelectorAll(".magnetic-btn");
    magneticBtns.forEach(btn => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const dist = Math.hypot(x, y);
      
      if (dist < 100) {
        gsap.to(btn, { x: x * 0.4, y: y * 0.4, duration: 0.6, ease: "power2.out" });
      } else {
        gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.3)" });
      }
    });
  };

  if (!mounted) return <div className="min-h-screen bg-[#050505]" />;

  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.5 }}>
      <main onMouseMove={handleMouseMove} className="relative min-h-screen">
        
        {/* Obsidian Follow-String */}
        <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[1001]" />

        {/* Intro Wipe */}
        {!introGone && (
          <div ref={introRef} className="intro-overlay fixed inset-0 z-[2000] flex items-center justify-center bg-black">
            <span className="text-primary font-bebas text-7xl tracking-widest">NAVIX</span>
          </div>
        )}

        {/* Hero Section */}
        <section ref={heroRef} className="relative h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">
          <video loop autoPlay muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-10 grayscale z-0">
            <source src="https://video.twimg.com/amplify_video/1613142244415504384/vid/1280x720/mSj6C-X1oV1S5jHj.mp4" type="video/mp4" />
          </video>

          <div className="relative z-10">
            <div className="fade-up inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-[10px] font-syne uppercase tracking-[0.3em]">
              <Sparkles className="w-3 h-3 text-primary" />
              Groq Powered Agentic AI
            </div>

            <div className="relative mb-8">
              <h1 ref={h1UnderRef} className="text-[12vw] font-bebas uppercase leading-none tracking-tighter headline-under">
                Elevate Your Career
              </h1>
              <h1 ref={h1OverRef} className="text-[12vw] font-bebas uppercase leading-none tracking-tighter headline-over absolute top-0 left-0 w-full z-10">
                Elevate Your Career
              </h1>
            </div>

            <p className="fade-up max-w-lg mx-auto text-zinc-500 font-dm text-lg mb-12 tracking-tight">
              A high-performance workspace for optimized resumes and interview mastery.
            </p>

            <Link href="/dashboard" className="fade-up inline-block">
              <Button size="lg" className="magnetic-btn bg-white text-black hover:bg-white/90 font-bold px-12 h-16 rounded-full text-xs uppercase tracking-widest transition-none">
                Get Started <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Scrolling Content */}
        <div className="relative z-20 space-y-32 pb-32">
          <Features />
          <HowItWorks />
          <Testimonials />
          <FAQs />
          <CTA />
        </div>
      </main>
    </ReactLenis>
  );
}
