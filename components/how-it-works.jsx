"use client";

import { useEffect, useRef, useState } from "react";

const STEPS = [
  {
    index: "01",
    title: "Create Your Profile",
    description:
      "Sign up and tell us about your industry, experience level, and skills during a quick onboarding.",
  },
  {
    index: "02",
    title: "Get AI Insights",
    description:
      "Receive personalised industry insights, salary data, and skill recommendations tailored to your field.",
  },
  {
    index: "03",
    title: "Practice & Build",
    description:
      "Take AI-generated interview quizzes, build your resume with AI feedback, and generate cover letters in seconds.",
  },
  {
    index: "04",
    title: "Track & Win",
    description:
      "Manage your entire job search in the Job Tracker and land your dream role with data-backed confidence.",
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

function StepItem({ step, index }) {
  const ref = useRef(null);
  const visible = useInView(ref);

  return (
    <div
      ref={ref}
      className="group relative flex gap-8 pb-16 last:pb-0 reveal"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${index * 0.1}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${index * 0.1}s`,
      }}
    >
      {/* Line connector */}
      {index < STEPS.length - 1 && (
        <div
          className="absolute left-[39px] top-12 w-px"
          style={{
            height: "calc(100% - 12px)",
            background: "linear-gradient(to bottom, rgba(0,200,255,0.12), transparent)",
          }}
        />
      )}

      {/* Step number circle */}
      <div
        className="relative flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-xs font-mono tracking-widest z-10"
        style={{
          border: "1px solid rgba(0,200,255,0.15)",
          background: "rgba(0,200,255,0.04)",
          color: "rgba(0,200,255,0.5)",
          transition: "border-color 0.4s, color 0.4s",
        }}
      >
        {step.index}
      </div>

      <div className="pt-1.5">
        <h3
          className="text-xl font-medium mb-3 text-white/80 group-hover:text-cyan-300 transition-colors duration-500"
          style={{ fontFamily: "'Georgia', serif", letterSpacing: "-0.02em" }}
        >
          {step.title}
        </h3>
        <p className="text-white/30 text-sm leading-relaxed max-w-md group-hover:text-white/50 transition-colors duration-500">
          {step.description}
        </p>
      </div>
    </div>
  );
}

export default function HowItWorks() {
  const headRef = useRef(null);
  const headVisible = useInView(headRef);

  return (
    <section className="py-32 px-6 border-t border-white/[0.04]">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20">
        {/* Heading */}
        <div
          ref={headRef}
          style={{
            opacity: headVisible ? 1 : 0,
            transform: headVisible ? "translateY(0)" : "translateY(30px)",
            transition: "opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)",
          }}
          className="md:sticky md:top-32 md:self-start reveal"
        >
          <p className="text-xs tracking-[0.4em] text-white/20 uppercase mb-4">Process</p>
          <h2
            className="text-5xl font-medium text-white/80"
            style={{ fontFamily: "'Georgia', serif", letterSpacing: "-0.03em" }}
          >
            Four steps<br />
            <span className="text-white/30">to your next role.</span>
          </h2>
        </div>

        {/* Steps */}
        <div className="mt-4">
          {STEPS.map((step, i) => (
            <StepItem key={step.index} step={step} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
