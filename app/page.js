"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReactLenis } from '@studio-freight/react-lenis';
import gsap from "gsap";

// Import your components
import Features from "@/components/features";
import HowItWorks from "@/components/how-it-works";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [introGone, setIntroGone] = useState(false);
  
  const introRef = useRef(null);
  const h1UnderRef = useRef(null);
  const h1OverRef = useRef(null);
  const canvasRef = useRef(null);

  const mouse = useRef({ x: 0, y: 0 });
  const points = useRef([]);
  const numPoints = 20;

  // STEP 1: Fix Hydration Mismatch
  useEffect(() => {
    setMounted(true);
    // Initialize points for the string physics
    const pts = [];
    for (let i = 0; i < numPoints; i++) pts.push({ x: 0, y: 0 });
    points.current = pts;
  }, []);

  // STEP 2: Browser-only Animations
  useEffect(() => {
    if (!mounted) return;

    // Intro Wipe
    gsap.to(introRef.current, { 
      scaleY: 0, 
      duration: 1.5, 
      ease: "expo.inOut", 
      transformOrigin: "top",
      onComplete: () => setIntroGone(true)
    });

    const tick = () => {
      // 1. Draw Physics String
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let px = mouse.current.x;
        let py = mouse.current.y;

        points.current.forEach((p) => {
          p.x += (px - p.x) * 0.35;
          p.y += (py - p.y) * 0.35;
          px = p.x;
          py = p.y;
        });

        ctx.strokeStyle = "rgba(199, 89, 60, 0.5)"; // Groq Orange String
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(points.current[0].x, points.current[0].y);
        for (let i = 1; i < points.current.length; i++) ctx.lineTo(points.current[i].x, points.current[i].y);
        ctx.stroke();
      }

      // 2. Update Headline Mask
      if (h1OverRef.current) {
        const rect = h1OverRef.current.getBoundingClientRect();
        const x = mouse.current.x - rect.left;
        const y = mouse.current.y - rect.top;
        const mask = `radial-gradient(circle 250px at ${x}px ${y}px, black, transparent)`;
        h1OverRef.current.style.mask = mask;
        h1OverRef.current.style.webkitMask = mask;
      }

      requestAnimationFrame(tick);
    };

    const animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [mounted]);

  const handleMouseMove = (e) => {
    mouse.current = { x: e.clientX, y: e.clientY };

    // Magnetic UI Interaction
    const btns = document.querySelectorAll(".magnetic");
    btns.forEach(btn => {
      const rect = btn.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
      const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
      gsap.to(btn, { x, y, duration: 0.5 });
    });
  };

  // Render a blank screen during SSR to avoid mismatch
  if (!mounted) return <div className="min-h-screen bg-[#050505]" />;

  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.5 }}>
      <main onMouseMove={handleMouseMove} className="relative min-h-screen selection:bg-orange-500/30">
        
        {/* Obsidian Physics String */}
        <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[1001]" />

        {/* Cinematic Intro Overlay */}
        {!introGone && (
          <div ref={introRef} className="intro-overlay fixed inset-0 z-[2000] bg-black">
            NAVIX AI
          </div>
        )}

        {/* Hero Section */}
        <section className="relative h-screen flex flex-col items-center justify-center text-center px-4">
          <video loop autoPlay muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-10 grayscale z-0">
            <source src="https://video.twimg.com/amplify_video/1613142244415504384/vid/1280x720/mSj6C-X1oV1S5jHj.mp4" type="video/mp4" />
          </video>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-[10px] font-syne uppercase tracking-[0.3em]">
              <Sparkles className="w-3 h-3 text-primary" />
              Agentic Career Coaching
            </div>

            <div className="relative mb-8">
              <h1 ref={h1UnderRef} className="text-[11vw] font-bebas uppercase leading-none tracking-tighter headline-under">
                Elevate Your Career
              </h1>
              <h1 ref={h1OverRef} className="text-[11vw] font-bebas uppercase leading-none tracking-tighter headline-over absolute top-0 left-0 w-full z-10">
                Elevate Your Career
              </h1>
            </div>

            <p className="max-w-md mx-auto text-zinc-500 font-dm text-lg mb-12 tracking-tight">
              A high-performance workspace for optimized resumes and Groq-powered interview mastery.
            </p>

            <Link href="/dashboard" className="inline-block">
              <Button size="lg" className="magnetic bg-white text-black hover:bg-white/90 font-bold px-12 h-16 rounded-full text-xs uppercase tracking-widest transition-none">
                Start Building <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Content Section */}
        <div className="relative z-20 space-y-40 pb-40">
          <Features />
          <HowItWorks />
        </div>
      </main>
    </ReactLenis>
  );
}
