"use client";

import { useEffect, useRef, useState } from "react";

const TESTIMONIALS = [
  {
    quote:
      "The AI interview prep helped me land my dream job at a top tech company. The practice questions were spot-on.",
    author: "Priya Sharma",
    role: "Software Engineer",
    company: "Google",
    initial: "P",
  },
  {
    quote:
      "The resume builder transformed my CV completely. I started getting callbacks within days of updating my resume.",
    author: "Rohan Mehta",
    role: "Product Manager",
    company: "Microsoft",
    initial: "R",
  },
  {
    quote:
      "The industry insights helped me negotiate a 40% salary increase. I knew exactly what I was worth in the market.",
    author: "Aisha Patel",
    role: "Data Scientist",
    company: "Amazon",
    initial: "A",
  },
];

function useInView(ref) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return visible;
}

function TestimonialCard({ t, index }) {
  const ref = useRef(null);
  const visible = useInView(ref);

  return (
    <div
      ref={ref}
      className="group flex flex-col justify-between p-8 border border-white/[0.06] hover:border-white/[0.10] transition-colors duration-500"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${index * 0.12}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${index * 0.12}s, border-color 0.5s`,
        background: "rgba(255,255,255,0.01)",
      }}
    >
      <p
        className="text-white/40 text-sm leading-relaxed mb-10 group-hover:text-white/60 transition-colors duration-500"
        style={{ fontFamily: "'Georgia', serif" }}
      >
        &ldquo;{t.quote}&rdquo;
      </p>

      <div className="flex items-center gap-4">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0"
          style={{
            border: "1px solid rgba(0,200,255,0.15)",
            background: "rgba(0,200,255,0.06)",
            color: "rgba(0,200,255,0.6)",
          }}
        >
          {t.initial}
        </div>
        <div>
          <p className="text-white/60 text-sm font-medium">{t.author}</p>
          <p className="text-white/20 text-xs">
            {t.role}{" "}
            <span style={{ color: "rgba(0,200,255,0.4)" }}>· {t.company}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const headRef = useRef(null);
  const headVisible = useInView(headRef);

  return (
    <section className="py-32 px-6 border-t border-white/[0.04]">
      <div className="max-w-4xl mx-auto">
        <div
          ref={headRef}
          className="mb-20"
          style={{
            opacity: headVisible ? 1 : 0,
            transform: headVisible ? "translateY(0)" : "translateY(30px)",
            transition: "opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <p className="text-xs tracking-[0.4em] text-white/20 uppercase mb-4">Voices</p>
          <h2
            className="text-5xl font-medium text-white/80"
            style={{ fontFamily: "'Georgia', serif", letterSpacing: "-0.03em" }}
          >
            Real careers,<br />
            <span className="text-white/30">real results.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ background: "rgba(255,255,255,0.04)" }}>
          {TESTIMONIALS.map((t, i) => (
            <TestimonialCard key={i} t={t} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
