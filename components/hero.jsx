"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

export default function Hero() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.2 + 0.3,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
      o: Math.random() * 0.5 + 0.1,
    }));

    let raf;
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 200, 255, ${p.o})`;
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });
      raf = requestAnimationFrame(draw);
    }
    draw();

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-40" />

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050507]/60 to-[#050507]" />

      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(0,180,255,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <p
          className="text-xs tracking-[0.4em] text-cyan-400/60 uppercase mb-8 animate-fade-in"
          style={{ animationDelay: "0.2s", animationFillMode: "both" }}
        >
          AI Career Intelligence
        </p>

        <h1
          className="font-bold leading-[0.95] tracking-tight mb-8 animate-fade-in"
          style={{
            fontSize: "clamp(3.5rem, 10vw, 9rem)",
            animationDelay: "0.4s",
            animationFillMode: "both",
            fontFamily: "'Georgia', serif",
            letterSpacing: "-0.03em",
          }}
        >
          Navigate
          <br />
          <span style={{ color: "rgba(0,200,255,0.85)" }}>your future.</span>
        </h1>

        <p
          className="text-lg text-white/40 max-w-md mx-auto mb-14 leading-relaxed animate-fade-in"
          style={{ animationDelay: "0.6s", animationFillMode: "both" }}
        >
          An autonomous AI that plans your career, closes skill gaps, and gets you hired.
        </p>

        <div
          className="flex items-center justify-center gap-6 animate-fade-in"
          style={{ animationDelay: "0.8s", animationFillMode: "both" }}
        >
          <Link
            href="/dashboard"
            className="group relative px-8 py-3.5 text-sm tracking-widest uppercase overflow-hidden border border-white/10 text-white/80 hover:text-white transition-colors duration-500"
          >
            <span
              className="absolute inset-0 translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-500 ease-in-out"
              style={{ background: "rgba(0,180,255,0.08)" }}
            />
            <span className="relative">Begin</span>
          </Link>
          <Link
            href="#features"
            className="text-sm tracking-widest uppercase text-white/30 hover:text-white/60 transition-colors duration-300"
          >
            Explore ↓
          </Link>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce opacity-20">
        <div className="w-px h-12 bg-white/40" />
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.9s cubic-bezier(0.16,1,0.3,1) both;
        }
      `}</style>
    </section>
  );
}
