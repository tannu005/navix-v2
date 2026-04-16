"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { SignInButton, useAuth } from "@clerk/nextjs";
import {
  ChevronDown,
  FileText,
  Target,
  MessageSquare,
  BarChart3,
  CheckCircle,
  Star,
  ArrowRight,
  Zap,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/* ─── Data ───────────────────────────────────────────── */
const features = [
  {
    protocol: "PROTOCOL 01",
    title: "Resume Intelligence",
    description:
      "AI-powered resume analysis with ATS optimization, keyword matching, and tailored recommendations for your target roles.",
    icon: <FileText size={20} className="text-sky-400" />,
  },
  {
    protocol: "PROTOCOL 02",
    title: "Application Targeting",
    description:
      "Intelligent job matching that aligns your skills and experience with the right opportunities across industries.",
    icon: <Target size={20} className="text-sky-400" />,
  },
  {
    protocol: "PROTOCOL 03",
    title: "Interview Preparation",
    description:
      "Simulated interviews powered by Groq AI with real-time feedback, scoring, and personalized coaching tips.",
    icon: <MessageSquare size={20} className="text-sky-400" />,
  },
  {
    protocol: "PROTOCOL 04",
    title: "Progress Analytics",
    description:
      "Track your applications, monitor success rates, and gain insights into your job search performance over time.",
    icon: <BarChart3 size={20} className="text-sky-400" />,
  },
];

const steps = [
  {
    num: "01",
    title: "Create Your Profile",
    description:
      "Sign up and tell us about your industry, target roles, and career goals. The system calibrates to your unique trajectory.",
  },
  {
    num: "02",
    title: "Upload Your Resume",
    description:
      "Our AI analyzes your resume against ATS systems and real job descriptions, surfacing gaps and opportunities instantly.",
  },
  {
    num: "03",
    title: "Practice & Prepare",
    description:
      "Run AI-powered mock interviews tailored to your target roles. Get scored, get feedback, and iterate until you're ready.",
  },
  {
    num: "04",
    title: "Track & Optimize",
    description:
      "Monitor every application, identify patterns, and refine your strategy with data-driven insights from your dashboard.",
  },
];

const testimonials = [
  {
    quote:
      "Navix helped me identify exactly what was missing from my resume. Three weeks after optimizing, I landed interviews at two FAANG companies.",
    name: "Priya M.",
    role: "Software Engineer",
    result: "Landed FAANG interview",
  },
  {
    quote:
      "The mock interview feature is genuinely impressive. It asked me questions I didn't expect and gave me honest, actionable feedback.",
    name: "Arjun K.",
    role: "Product Manager",
    result: "Promoted internally",
  },
  {
    quote:
      "I was applying to dozens of jobs with no response. After Navix's ATS optimization, my response rate jumped significantly.",
    name: "Sara L.",
    role: "UX Designer",
    result: "3x more callbacks",
  },
];

const stats = [
  { value: "10k+", label: "Resumes Analyzed" },
  { value: "5k+", label: "Interviews Prepped" },
  { value: "85%", label: "Interview Rate Improvement" },
  { value: "4.9★", label: "Average User Rating" },
];

const faqs = [
  {
    q: "What makes Navix different from other career tools?",
    a: "Navix combines Groq-powered AI with a unified platform — resume optimization, interview prep, and application tracking all in one place.",
  },
  {
    q: "Is my data secure?",
    a: "Yes. Your resume and interview data are encrypted in transit and at rest.",
  },
  {
    q: "How does the ATS optimization work?",
    a: "Our AI parses your resume and compares it against thousands of job descriptions and known ATS parsing rules.",
  },
  {
    q: "Is there a free tier?",
    a: "Yes. You can analyze one resume and run three mock interviews for free.",
  },
];

/* ─── Sub-components ─────────────────────────────────── */
function FaqAccordion({ items }) {
  const [open, setOpen] = useState(null);

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="border border-white/10 rounded-lg overflow-hidden bg-[#0d0d0d]">
          <button
            className="w-full flex items-center justify-between px-6 py-4 text-left"
            onClick={() => setOpen(open === i ? null : i)}
          >
            <span className="text-sm font-medium text-gray-100">{item.q}</span>
            <ChevronDown size={16} className={`transition-transform ${open === i ? "rotate-180" : ""}`} />
          </button>
          {open === i && (
            <div className="px-6 pb-4">
              <p className="text-sm text-gray-300">{item.a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────── */
export default function HomePage() {
  const { isSignedIn } = useAuth();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <div className={`min-h-screen bg-black text-white transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}>
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4">
        <div className="mb-6">
          <span className="inline-flex items-center gap-2 text-xs tracking-widest text-sky-400 border border-sky-400/30 bg-sky-400/5 px-4 py-2 rounded-full">
            <Zap size={12} /> GROQ POWERED CAREER COACHING
          </span>
        </div>
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter mb-6">
          ELEVATE<br />YOUR CAREER
        </h1>
        <p className="text-gray-400 text-base sm:text-lg max-w-xl mb-10">
          AI-powered resume optimization, interview preparation, and application tracking.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {isSignedIn ? (
            <Link href="/dashboard" className="bg-white text-black text-sm font-bold px-8 py-3 rounded hover:bg-sky-400 transition-all">
              LAUNCH NAVIX <ArrowRight size={14} className="inline ml-2" />
            </Link>
          ) : (
            <SignInButton mode="modal">
              <button className="bg-white text-black text-sm font-bold px-8 py-3 rounded hover:bg-sky-400 transition-all">
                LAUNCH NAVIX <ArrowRight size={14} className="inline ml-2" />
              </button>
            </SignInButton>
          )}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-4 bg-[#050505]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f) => (
            <div key={f.protocol} className="bg-[#111827] border border-white/10 rounded-xl p-6 hover:border-sky-400/30 transition-all">
              <div className="mb-4">{f.icon}</div>
              <p className="text-xs text-sky-400 mb-2">{f.protocol}</p>
              <h3 className="text-base font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-gray-300">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-[#050505] border-y border-white/5">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-black text-sky-400">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Common Queries</h2>
          <FaqAccordion items={faqs} />
        </div>
      </section>

      <Footer />
    </div>
  );
}
