"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import gsap from "gsap";

// Import project components (Ensure paths are correct)
import Features from "@/components/features";
import HowItWorks from "@/components/how-it-works";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [introGone, setIntroGone] = useState(false);
  
  const introRef = useRef(null);
  const h1OverRef = useRef(null);
  const canvasRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });
  const points = useRef(Array.from({ length: 20 }, () => ({ x: 0, y: 0 })));

  // 1. Client-side initialization
  useEffect(() => {
    setMounted(true);
  }, []);

  // 2. Browser-only Animation Engine
  useEffect(() => {
    if (!mounted) return;

    // Intro Entrance Animation
    const introTl = gsap.to(introRef.current, { 
      scaleY: 0, 
      duration: 1.5, 
      ease: "expo.inOut", 
      transformOrigin: "top",
      onComplete: () => setIntroGone(true)
    });

    const tick = () => {
      // String Cursor Physics
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

        ctx.strokeStyle = "rgba(199, 89, 60, 0.4)"; // Groq Orange
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(points.current[0].x, points.current[0].y);
        for (let i = 1; i < points.current.length; i++) {
          ctx.lineTo(points.current[i].x, points.current[i].y);
        }
        ctx.stroke();
      }

      // Headline Mask Logic
      if (h1OverRef.current) {
        const rect = h1OverRef.current.getBoundingClientRect();
        const x = mouse.current.x - rect.left;
        const y = mouse.current.y - rect.top;
        const mask = `radial-gradient(circle 250px at ${x}px ${y}px, black, transparent)`;
        h1OverRef.current.style.webkitMaskImage = mask;
        h1OverRef.current.style.maskImage = mask;
      }

      requestAnimationFrame(tick);
    };

    const animId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(animId);
      introTl.kill();
    };
  }, [mounted]);

  const handleMouseMove = (e) => {
    mouse.current = { x: e.clientX, y: e.clientY };

    // Magnetic Interactions for buttons
    const btns = document.querySelectorAll(".magnetic-btn");
    btns.forEach(btn => {
      const rect = btn.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * 0.25;
      const y = (e.clientY - rect.top - rect.height / 2) * 0.25;
      gsap.to(btn, { x, y, duration: 0.4, ease: "power2.out" });
    });
  };

  // BLOCK HYDRATION ERRORS: Returns a blank shell during SSR
  if (!mounted) return <div className="min-h-screen bg-[#050505]" />;

  return (
    <main onMouseMove={handleMouseMove} className="relative min-h-screen bg-[#050505] selection:bg-[#c7593c]/30">
      
      {/* String Cursor */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[1001]" />

      {/* Intro Wipe */}
      {!introGone && (
        <div ref={introRef} className="intro-overlay fixed inset-0 z-[2000] bg-black">
          NAVIX AI
        </div>
      )}

      {/* Hero Content */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        {/* Background Atmosphere */}
        <video loop autoPlay muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-10 grayscale z-0">
          <source src="https://video.twimg.com/amplify_video/1613142244415504384/vid/1280x720/mSj6C-X1oV1S5jHj.mp4" type="video/mp4" />
        </video>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-[10px] uppercase tracking-[0.4em] font-syne text-[#c7593c]">
            <Sparkles className="w-3 h-3" />
            Agentic AI Protocol
          </div>

          <div className="relative mb-8">
            <h1 className="text-[11vw] font-bebas uppercase leading-none tracking-tighter headline-under">
              Elevate Your Career
            </h1>
            <h1 ref={h1OverRef} className="text-[11vw] font-bebas uppercase leading-none tracking-tighter headline-over">
              Elevate Your Career
            </h1>
          </div>

          <p className="max-w-md mx-auto text-zinc-500 font-dm text-lg mb-12 tracking-tight">
            Advanced workspace for resume optimization and interview mastery.
          </p>

          <Link href="/dashboard">
            <Button size="lg" className="magnetic-btn bg-white text-black hover:bg-white/90 font-bold px-12 h-16 rounded-full text-[10px] uppercase tracking-widest transition-none">
              Initialize System <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      <div className="relative z-20 space-y-40 pb-40">
        <Features />
        <HowItWorks />
      </div>
    </main>
  );
}
