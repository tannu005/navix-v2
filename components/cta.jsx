"use client";

import { useRef } from "react";
import Link from "next/link";

export default function CTA() {
  return (
    <section className="relative py-48 px-6 text-center overflow-hidden border-t border-white/5 bg-transparent">
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-32"
        style={{ background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.2), transparent)" }}
      />
      <p className="text-xs tracking-[0.4em] text-white/30 uppercase mb-6">Ready</p>
      <h2
        className="text-7xl md:text-8xl text-white mb-10"
        style={{ fontFamily: "'Instrument Serif', serif", lineHeight: 0.95 }}
      >
        Start your<br />
        <span className="text-white/40">ascent.</span>
      </h2>
      <Link
        href="/dashboard"
        className="liquid-glass group inline-flex items-center gap-3 px-10 py-4 rounded-full text-sm tracking-widest uppercase text-white/80 hover:text-white hover:bg-white/10 transition-all duration-500"
      >
        <span className="relative">Get Started</span>
        <span className="relative text-white/40 group-hover:text-white transition-colors duration-300">→</span>
      </Link>
    </section>
  );
}
