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
      data-card
      className="group liquid-glass flex flex-col justify-between p-8 hover:bg-white/5 transition-all duration-500 rounded-2xl m-2"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${index * 0.12}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${index * 0.12}s`,
      }}
    >
      <p
        className="text-white/60 text-lg leading-relaxed mb-10 group-hover:text-white/80 transition-colors duration-500"
        style={{ fontFamily: "'Instrument Serif', serif" }}
      >
        &ldquo;{t.quote}&rdquo;
      </p>

      <div className="flex items-center gap-4">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0"
          style={{
            border: "1px solid rgba(255,255,255,0.2)",
            background: "rgba(255,255,255,0.05)",
            color: "rgba(255,255,255,0.8)",
          }}
        >
          {t.initial}
        </div>
        <div>
          <p className="text-white/80 text-sm font-medium">{t.author}</p>
          <p className="text-white/40 text-xs">
            {t.role}{" "}
            <span style={{ color: "rgba(255,255,255,0.6)" }}>· {t.company}</span>
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
    <section id="testimonials" className="relative z-10 py-32 px-6 border-t border-white/5 bg-transparent">
      <div className="max-w-6xl mx-auto">
        <div
          ref={headRef}
          className="mb-20 text-center"
          style={{
            opacity: headVisible ? 1 : 0,
            transform: headVisible ? "translateY(0)" : "translateY(30px)",
            transition:
              "opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <p className="text-xs tracking-[0.4em] text-white/30 uppercase mb-4">
            Voices
          </p>
          <h2
            className="text-6xl text-white"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            Real careers,<br />
            <span className="text-white/40">real results.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TESTIMONIALS.map((t, i) => (
            <TestimonialCard key={i} t={t} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
