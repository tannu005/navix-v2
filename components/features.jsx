"use client";

import { useEffect, useRef, useState } from "react";

const FEATURES = [
  {
    index: "01",
    title: "AI Career Agent",
    subtitle: "Autonomous multi-step reasoning",
    description:
      "A real ReAct-loop agent that plans, researches, and synthesises a personalised strategy — not a chatbot, an autonomous system.",
    tag: "Agentic AI",
  },
  {
    index: "02",
    title: "Career Roadmap",
    subtitle: "Week-by-week precision",
    description:
      "From where you are to where you want to be. AI-generated milestones, resources, and projects mapped to your exact timeline.",
    tag: "Planning",
  },
  {
    index: "03",
    title: "Skill Gap Analysis",
    subtitle: "Know exactly what's missing",
    description:
      "Match your profile against any role. Get a score, priority gaps, quick wins, and the keywords that get you past the ATS.",
    tag: "Intelligence",
  },
  {
    index: "04",
    title: "Salary Intelligence",
    subtitle: "Negotiate from data",
    description:
      "Real ranges, top-paying companies, and a negotiation script tailored to your experience level and location.",
    tag: "Strategy",
  },
  {
    index: "05",
    title: "Resume + ATS",
    subtitle: "Built to be found",
    description:
      "AI-enhanced bullet points, an ATS score checker, and a PDF export — all in one builder.",
    tag: "Execution",
  },
  {
    index: "06",
    title: "Job Tracker",
    subtitle: "Your pipeline, organised",
    description:
      "Track every application from applied to offer. Status columns, interview dates, and salary notes in one view.",
    tag: "Workflow",
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
      { threshold: 0.15 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return visible;
}

function FeatureRow({ f, index }) {
  const ref = useRef(null);
  const visible = useInView(ref);

  return (
    <div
      ref={ref}
      data-card
      className="group grid grid-cols-[80px_1fr_auto] items-start gap-8 py-10 border-b border-white/[0.06] cursor-default reveal"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${index * 0.08}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${index * 0.08}s`,
      }}
    >
      <span className="text-xs tracking-widest text-white/20 pt-1 font-mono">{f.index}</span>

      <div>
        <div className="flex items-baseline gap-4 mb-3">
          <h3
            className="text-2xl font-medium text-white/90 group-hover:text-cyan-300 transition-colors duration-500"
            style={{ fontFamily: "'Georgia', serif", letterSpacing: "-0.02em" }}
          >
            {f.title}
          </h3>
          <span className="text-sm text-white/30 hidden sm:block">{f.subtitle}</span>
        </div>
        <p className="text-white/30 text-sm leading-relaxed max-w-lg group-hover:text-white/50 transition-colors duration-500">
          {f.description}
        </p>
      </div>

      <span className="text-[10px] tracking-[0.2em] uppercase text-white/20 border border-white/10 px-3 py-1.5 group-hover:border-cyan-400/20 group-hover:text-cyan-400/40 transition-all duration-500 whitespace-nowrap mt-1">
        {f.tag}
      </span>
    </div>
  );
}

export default function Features() {
  const headRef = useRef(null);
  const headVisible = useInView(headRef);

  return (
    <section id="features" className="py-32 px-6 max-w-4xl mx-auto">
      <div
        ref={headRef}
        style={{
          opacity: headVisible ? 1 : 0,
          transform: headVisible ? "translateY(0)" : "translateY(30px)",
          transition:
            "opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)",
        }}
        className="mb-20 reveal"
      >
        <p className="text-xs tracking-[0.4em] text-white/20 uppercase mb-4">Capabilities</p>
        <h2
          className="text-5xl font-medium text-white/80"
          style={{ fontFamily: "'Georgia', serif", letterSpacing: "-0.03em" }}
        >
          Everything you need<br />
          <span className="text-white/30">to move forward.</span>
        </h2>
      </div>

      <div>
        {FEATURES.map((f, i) => (
          <FeatureRow key={f.index} f={f} index={i} />
        ))}
      </div>
    </section>
  );
}
