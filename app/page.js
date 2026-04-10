"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import dynamic from 'next/dynamic';

// Import components normally
import Features from "@/components/features";
import HowItWorks from "@/components/how-it-works";

// Dynamic import for Lenis with a more robust SSR guard
const ReactLenis = dynamic(() => import('@studio-freight/react-lenis').then(mod => mod.ReactLenis), {
  ssr: false
});

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const h1OverRef = useRef(null);
  const canvasRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });
  const points = useRef(Array.from({ length: 20 }, () => ({ x: 0, y: 0 })));

  // 1. Handle Mounting to prevent hydration errors
  useEffect(() => {
    setMounted(true);
  }, []);

  // 2. Handle Canvas & Mask Animation
  useEffect(() => {
    if (!mounted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    
    // Set initial size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let px = mouse.current.x;
      let py = mouse.current.y;

      points.current.forEach((p) => {
        p.x += (px - p.x) * 0.35;
        p.y += (py - p.y) * 0.35;
        px = p.x;
        py = p.y;
      });

      ctx.strokeStyle = "rgba(199, 89, 60, 0.4)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(points.current[0].x, points.current[0].y);
      for (let i = 1; i < points.current.length; i++) {
        ctx.lineTo(points.current[i].x, points.current[i].y);
      }
      ctx.stroke();

      if (h1OverRef.current) {
        const rect = h1OverRef.current.getBoundingClientRect();
        const x = mouse.current.x - rect.left;
        const y = mouse.current.y - rect.top;
        
        // Using CSS variables for cleaner integration with your globals.css
        h1OverRef.current.style.setProperty('--mouse-x', `${x}px`);
        h1OverRef.current.style.setProperty('--mouse-y', `${y}px`);
        
        const mask = `radial-gradient(circle 250px at ${x}px ${y}px, black, transparent)`;
        h1OverRef.current.style.webkitMaskImage = mask;
        h1OverRef.current.style.maskImage = mask;
      }
      requestAnimationFrame(tick);
    };

    const animId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [mounted]);

  // IMPORTANT: For Next.js, it's safer to render the skeleton 
  // and only "activate" the JS-heavy parts after mounting.
  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.5 }}>
      <main 
        onMouseMove={(e) => { mouse.current = { x: e.clientX, y: e.clientY } }} 
        className="relative min-h-screen bg-[#050505] selection:bg-white/20"
      >
        {/* Only show canvas and heavy effects once mounted */}
        {mounted && (
          <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[1001]" />
        )}

        <section className="relative h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">
          <video loop autoPlay muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-10 grayscale z-0">
            <source src="https://video.twimg.com/amplify_video/1613142244415504384/vid/1280x720/mSj6C-X1oV1S5jHj.mp4" type="video/mp4" />
          </video>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-[10px] uppercase tracking-[0.4em] font-syne text-[#c7593c]">
              <Sparkles className="w-3 h-3" />
              Agentic AI Intelligence
            </div>

            <div className="relative mb-8">
              <h1 className="text-[11vw] font-bebas uppercase leading-none tracking-tighter headline-under">
                Elevate Your Career
              </h1>
              <h1 ref={h1OverRef} className="text-[11vw] font-bebas uppercase leading-none tracking-tighter headline-over">
                Elevate Your Career
              </h1>
            </div>

            <Link href="/dashboard">
              <Button size="lg" className="bg-white text-black font-bold px-12 h-16 rounded-full text-[10px] uppercase tracking-widest hover:scale-105 transition-transform">
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
    </ReactLenis>
  );
}
