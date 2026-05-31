"use client";

import { useEffect, useRef, useState } from "react";
import {
  Cpu,
  FileText,
  ShieldCheck,
  Zap,
  BarChart3,
  Brain,
  MessageSquare,
  Briefcase,
  TrendingUp,
  UserCheck,
  ClipboardList,
} from "lucide-react";

/* ─── IntersectionObserver hook (robust, no GSAP dependency) ─── */
function useInView(ref, threshold = 0.15) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return visible;
}

/* ─── Feature data ─── */
const features = [
  {
    title: "Agentic AI Analysis",
    description:
      "Instant resume scoring powered by Groq LPU technology for sub-second inference. Get ATS scores, keyword analysis, and actionable improvement tips.",
    icon: <Cpu className="w-6 h-6" />,
    tag: "Protocol 01",
  },
  {
    title: "ATS Optimization",
    description:
      "Tailor your professional identity to bypass algorithmic gatekeepers. Compare your resume against real job descriptions and boost your match rate.",
    icon: <ShieldCheck className="w-6 h-6" />,
    tag: "Protocol 02",
  },
  {
    title: "Real-time Tracking",
    description:
      "A high-performance dashboard to manage application lifecycles, interview funnels, and track your entire job search pipeline in one place.",
    icon: <BarChart3 className="w-6 h-6" />,
    tag: "Protocol 03",
  },
  {
    title: "Interview Intelligence",
    description:
      "Simulate high-stakes technical and behavioral interviews with context-aware AI feedback, scoring, and personalized coaching tips.",
    icon: <Zap className="w-6 h-6" />,
    tag: "Protocol 04",
  },
  {
    title: "AI Career Agent",
    description:
      "Autonomous multi-step AI agent that plans, researches, and delivers personalized career advice using a ReAct reasoning loop with tool-calling.",
    icon: <Brain className="w-6 h-6" />,
    tag: "Protocol 05",
  },
  {
    title: "Cover Letter Generator",
    description:
      "Generate tailored, compelling cover letters in seconds. AI analyzes the job description and your profile to craft the perfect pitch.",
    icon: <FileText className="w-6 h-6" />,
    tag: "Protocol 06",
  },
];

/* ─── How-to-use steps ─── */
const howToSteps = [
  {
    num: "01",
    title: "Create Your Profile",
    description:
      "Sign up, select your industry, enter your skills, and set your career goals. The system calibrates everything to your unique trajectory.",
    icon: <UserCheck className="w-5 h-5" />,
  },
  {
    num: "02",
    title: "Build & Optimize Your Resume",
    description:
      "Use the AI Resume Builder to create or upload your resume. Get instant ATS scoring, keyword suggestions, and formatting improvements.",
    icon: <FileText className="w-5 h-5" />,
  },
  {
    num: "03",
    title: "Practice Mock Interviews",
    description:
      "Run AI-powered mock interviews tailored to your target roles. Get scored on technical depth, communication, and receive detailed feedback.",
    icon: <MessageSquare className="w-5 h-5" />,
  },
  {
    num: "04",
    title: "Explore Career Roadmaps",
    description:
      "Get a personalized week-by-week learning plan with resources, milestones, and skill gap analysis for your target role.",
    icon: <TrendingUp className="w-5 h-5" />,
  },
  {
    num: "05",
    title: "Generate Cover Letters",
    description:
      "Paste a job description and let AI craft a tailored cover letter highlighting your most relevant experience and skills.",
    icon: <ClipboardList className="w-5 h-5" />,
  },
  {
    num: "06",
    title: "Track & Win",
    description:
      "Manage your entire application pipeline in the Job Tracker. Monitor statuses, schedule interviews, and land your dream role.",
    icon: <Briefcase className="w-5 h-5" />,
  },
];

/* ─── Feature Card ─── */
function FeatureCard({ feature, index }) {
  const ref = useRef(null);
  const visible = useInView(ref);

  return (
    <div
      ref={ref}
      className="group relative p-8 sm:p-10 rounded-2xl overflow-hidden transition-all duration-500 hover:border-sky-400/40"
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.06)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${index * 0.1}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${index * 0.1}s, border-color 0.5s`,
      }}
    >
      {/* Protocol tag */}
      <div className="absolute top-5 right-6 text-[9px] font-mono opacity-30 tracking-widest uppercase">
        {feature.tag}
      </div>

      {/* Icon */}
      <div
        className="mb-6 p-3 w-fit rounded-lg transition-transform duration-500 group-hover:scale-110"
        style={{
          background: "rgba(56,189,248,0.06)",
          border: "1px solid rgba(56,189,248,0.12)",
          color: "rgb(56,189,248)",
        }}
      >
        {feature.icon}
      </div>

      <h3 className="text-xl font-semibold mb-3 tracking-tight text-white/90">
        {feature.title}
      </h3>

      <p className="text-white/40 text-sm leading-relaxed max-w-sm group-hover:text-white/60 transition-colors duration-500">
        {feature.description}
      </p>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-sky-400 transition-all duration-700 group-hover:w-full" />
    </div>
  );
}

/* ─── Step Card ─── */
function StepCard({ step, index }) {
  const ref = useRef(null);
  const visible = useInView(ref);

  return (
    <div
      ref={ref}
      className="group relative flex gap-5 p-6 rounded-xl transition-all duration-500"
      style={{
        background: "rgba(255,255,255,0.015)",
        border: "1px solid rgba(255,255,255,0.05)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(30px)",
        transition: `opacity 0.6s cubic-bezier(0.16,1,0.3,1) ${index * 0.08}s, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${index * 0.08}s`,
      }}
    >
      {/* Step number */}
      <div
        className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-xs font-mono tracking-widest"
        style={{
          border: "1px solid rgba(56,189,248,0.2)",
          background: "rgba(56,189,248,0.06)",
          color: "rgba(56,189,248,0.7)",
        }}
      >
        {step.num}
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sky-400/60">{step.icon}</span>
          <h4 className="text-base font-medium text-white/80 group-hover:text-sky-300 transition-colors duration-500">
            {step.title}
          </h4>
        </div>
        <p className="text-white/30 text-sm leading-relaxed group-hover:text-white/50 transition-colors duration-500">
          {step.description}
        </p>
      </div>
    </div>
  );
}

/* ─── Main Component ─── */
export default function Features() {
  const headRef = useRef(null);
  const headVisible = useInView(headRef);
  const howRef = useRef(null);
  const howVisible = useInView(howRef);

  return (
    <section className="relative py-32 px-4 bg-[#050505]" id="features">
      <div className="container mx-auto max-w-6xl">
        {/* ─── Header ─── */}
        <div
          ref={headRef}
          className="mb-20 text-center"
          style={{
            opacity: headVisible ? 1 : 0,
            transform: headVisible ? "translateY(0)" : "translateY(40px)",
            transition:
              "opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <span className="inline-block text-[10px] uppercase tracking-[0.5em] text-sky-400 mb-4">
            Core Capabilities
          </span>
          <h2 className="text-5xl md:text-7xl font-black uppercase leading-none tracking-tighter">
            System <span className="text-white/20">Features</span>
          </h2>
        </div>

        {/* ─── Features Grid ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-32">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>

        {/* ─── How to Use Section ─── */}
        <div
          ref={howRef}
          className="mb-16 text-center"
          style={{
            opacity: howVisible ? 1 : 0,
            transform: howVisible ? "translateY(0)" : "translateY(40px)",
            transition:
              "opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <span className="inline-block text-[10px] uppercase tracking-[0.5em] text-sky-400 mb-4">
            Getting Started
          </span>
          <h2 className="text-4xl md:text-5xl font-black uppercase leading-none tracking-tighter">
            How to <span className="text-white/20">Use Navix</span>
          </h2>
          <p className="text-white/30 text-sm mt-4 max-w-lg mx-auto">
            From profile setup to landing your dream role — here&apos;s your step-by-step guide to maximizing Navix.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {howToSteps.map((step, index) => (
            <StepCard key={index} step={step} index={index} />
          ))}
        </div>
      </div>

      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-sky-500/5 blur-[120px] rounded-full pointer-events-none z-0" />
    </section>
  );
}
