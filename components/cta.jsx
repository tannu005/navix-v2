"use client";

import { useRef } from "react";
import Link from "next/link";

export default function CTA() {
  return (
    <section className="relative py-48 px-6 text-center overflow-hidden border-t border-white/[0.04]">
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-32"
        style={{ background: "linear-gradient(to bottom, transparent, rgba(0,200,255,0.2), transparent)" }}
      />
      <p className="text-xs tracking-[0.4em] text-white/20 uppercase mb-6">Ready</p>
      <h2
        className="text-6xl md:text-8xl font-medium mb-10 text-white/80"
        style={{ fontFamily: "'Georgia', serif", letterSpacing: "-0.04em", lineHeight: 0.95 }}
      >
        Start your<br />
        <span style={{ color: "rgba(0,200,255,0.7)" }}>ascent.</span>
      </h2>
      <Link
        href="/dashboard"
        className="group inline-flex items-center gap-3 px-10 py-4 border border-white/10 text-sm tracking-widest uppercase text-white/60 hover:text-white hover:border-white/20 transition-all duration-500 relative overflow-hidden"
      >
        <span
          className="absolute inset-0 translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-500"
          style={{ background: "rgba(0,180,255,0.06)" }}
        />
        <span className="relative">Get Started</span>
        <span className="relative text-white/20 group-hover:text-cyan-400 transition-colors duration-300">→</span>
      </Link>
    </section>
  );
}
