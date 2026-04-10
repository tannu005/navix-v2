"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";

import Features from "@/components/features";
import HowItWorks from "@/components/how-it-works";

// FIX: package moved from @studio-freight/react-lenis → lenis/react
const ReactLenis = dynamic(
  () => import("lenis/react").then((mod) => mod.ReactLenis),
  {
    ssr: false,
    // FIX: fallback prevents layout shift while Lenis JS loads
    loading: () => <div className="min-h-screen bg-[#050505]" />,
  }
);

export default function Home() {
  const [mounted, setMounted] = useState(false);

  const h1OverRef   = useRef(null);
  const canvasRef   = useRef(null);
  const cursorRef   = useRef(null); // FIX: custom cursor element
  const rafIdRef    = useRef(null); // FIX: track RAF id across frames
  // FIX: start off-screen so trail/mask don't render at (0,0) on load
  const mouse       = useRef({ x: -9999, y: -9999 });
  const points      = useRef([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // FIX: reset points on every mount so stale positions don't carry over
    points.current = Array.from({ length: 20 }, () => ({
      x: mouse.current.x,
      y: mouse.current.y,
    }));

    const handleResize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);
    handleResize();

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
      ctx.lineWidth   = 1.5;
      ctx.beginPath();
      ctx.moveTo(points.current[0].x, points.current[0].y);
      for (let i = 1; i < points.current.length; i++) {
        ctx.lineTo(points.current[i].x, points.current[i].y);
      }
      ctx.stroke();

      if (h1OverRef.current) {
        const rect = h1OverRef.current.getBoundingClientRect();
        const x    = mouse.current.x - rect.left;
        const y    = mouse.current.y - rect.top;
        const mask = `radial-gradient(circle 250px at ${x}px ${y}px, black, transparent)`;
        h1OverRef.current.style.webkitMaskImage = mask;
        h1OverRef.current.style.maskImage       = mask;
      }

      // FIX: store new RAF id every frame so cleanup always cancels the latest
      rafIdRef.current = requestAnimationFrame(tick);
    };

    rafIdRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafIdRef.current); // FIX: correct cancel
      window.removeEventListener("resize", handleResize);
    };
  }, [mounted]);

  // FIX: stable reference with useCallback, no new fn every render
  const handleMouseMove = useCallback((e) => {
    mouse.current = { x: e.clientX, y: e.clientY };

    // Update custom cursor position via direct DOM (no re-render)
    if (cursorRef.current) {
      cursorRef.current.style.transform =
        `translate(${e.clientX - 14}px, ${e.clientY - 14}px)`;
    }
  }, []);

  // Reset cursor + trail when mouse leaves viewport
  const handleMouseLeave = useCallback(() => {
    mouse.current = { x: -9999, y: -9999 };
  }, []);

  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.5 }}>
      <main
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative min-h-screen bg-[#050505]"
      >
        {/* FIX: custom cursor ring — pairs with cursor:none in globals.css */}
        <div
          ref={cursorRef}
          className="custom-cursor fixed top-0 left-0 pointer-events-none z-[10000]"
          style={{ willChange: "transform" }} // GPU-composited, no layout thrash
        />

        {/* Trail canvas — z-[100] keeps it above content, below modals/header */}
        <canvas
          ref={canvasRef}
          className={`fixed inset-0 pointer-events-none z-[100] transition-opacity duration-700 ${
            mounted ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Hero */}
        <section className="relative h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">
          <video
            loop
            autoPlay
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-10 grayscale z-0"
          >
            <source
              src="https://video.twimg.com/amplify_video/1613142244415504384/vid/1280x720/mSj6C-X1oV1S5jHj.mp4"
              type="video/mp4"
            />
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
              <h1
                ref={h1OverRef}
                className="absolute inset-0 text-[11vw] font-bebas uppercase leading-none tracking-tighter headline-over"
              >
                Elevate Your Career
              </h1>
            </div>

            <Link href="/dashboard">
              <Button
                size="lg"
                className="bg-white text-black font-bold px-12 h-16 rounded-full text-[10px] uppercase tracking-widest hover:bg-[#c7593c] hover:text-white transition-all duration-300"
              >
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
