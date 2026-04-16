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

/* ─── Types ─────────────────────────────────────────── */
const faqItems = [
  { q: "What is Navix?", a: "Navix is an AI career coach." },
  { q: "How does it help?", a: "It helps with resumes, interviews, and job tracking." },
];

const features = [
  {
    protocol: "https",
    title: "Secure Connection",
    description: "Ensures encrypted communication between client and server.",
    icon: "🔒", // Replace with a React component if needed
  },
  {
    protocol: "http",
    title: "Standard Connection",
    description: "Basic communication without encryption.",
    icon: "🌐",
  },
];
// Define steps as an array of objects
const steps = [
  {
    num: "1",
    title: "Sign Up",
    description: "Create your account to get started.",
  },
  {
    num: "2",
    title: "Build Resume",
    description: "Use AI tools to craft your resume.",
  },
  {
    num: "3",
    title: "Prepare Interview",
    description: "Practice with AI-powered interview simulations.",
  },
];
// Testimonials data
const testimonials = [
  {
    quote: "Navix helped me land my dream job!",
    name: "Jane Doe",
    role: "Software Engineer",
    result: "Secured a role at a top tech company",
  },
  {
    quote: "The AI resume builder was a game changer.",
    name: "John Smith",
    role: "Product Manager",
    result: "Got more interview calls than ever before",
  },
];

// Stats data
const stats = [
  {
    value: "10K+",
    label: "Resumes optimized",
  },
  {
    value: "5K+",
    label: "Successful interviews",
  },
];

/* ─── Data ───────────────────────────────────────────── */
const features: Feature[] = [
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

const steps: Step[] = [
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

const testimonials: Testimonial[] = [
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

const stats: Stat[] = [
  { value: "10k+", label: "Resumes Analyzed" },
  { value: "5k+", label: "Interviews Prepped" },
  { value: "85%", label: "Interview Rate Improvement" },
  { value: "4.9★", label: "Average User Rating" },
];

const faqs: FaqItem[] = [
  {
    q: "What makes Navix different from other career tools?",
    a: "Navix combines Groq-powered AI with a unified platform — resume optimization, interview prep, and application tracking all in one place. Most tools only do one of these well.",
  },
  {
    q: "Is my data secure?",
    a: "Yes. Your resume and interview data are encrypted in transit and at rest. We never sell your data to third parties. See our Privacy Policy for full details.",
  },
  {
    q: "How does the ATS optimization work?",
    a: "Our AI parses your resume and compares it against thousands of job descriptions and known ATS parsing rules, then suggests specific changes to improve your match score.",
  },
  {
    q: "Can I use Navix if I'm switching careers?",
    a: "Absolutely. Navix is built for career changers. Just describe your target industry and roles — the AI will help you identify transferable skills and bridge any gaps.",
  },
  {
    q: "Is there a free tier?",
    a: "Yes. You can analyze one resume and run three mock interviews for free. Premium plans unlock unlimited access and advanced analytics.",
  },
];

/* ─── Sub-components ─────────────────────────────────── */

function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div
          key={i}
          className="border border-white/10 rounded-lg overflow-hidden bg-[#0d0d0d] hover:border-white/20 transition-colors"
        >
          <button
            className="w-full flex items-center justify-between px-6 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-inset"
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
          >
            <span className="text-sm font-medium text-gray-100 pr-4">
              {item.q}
            </span>
            <ChevronDown
              size={16}
              className={`text-gray-400 flex-shrink-0 transition-transform duration-200 ${
                open === i ? "rotate-180" : ""
              }`}
            />
          </button>
          {open === i && (
            <div className="px-6 pb-4">
              <p className="text-sm text-gray-300 leading-relaxed">{item.a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────── */

export default function HomePage() {
  const { isSignedIn } = useAuth();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Brief fade-in on mount
    const t = setTimeout(() => setLoaded(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={`min-h-screen bg-black text-white transition-opacity duration-500 ${
        loaded ? "opacity-100" : "opacity-0"
      }`}
    >
      <Navbar />

      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden hero-gradient hero-grid">
        {/* Subtle radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(56,189,248,0.04) 0%, transparent 70%)",
          }}
        />

        {/* Groq badge */}
        <div className="relative z-10 mb-6">
          <span className="inline-flex items-center gap-2 text-xs tracking-widest text-sky-400 border border-sky-400/30 bg-sky-400/5 px-4 py-2 rounded-full">
            <Zap size={12} />
            GROQ POWERED CAREER COACHING
          </span>
        </div>

        {/* ── DO NOT CHANGE: ELEVATE YOUR CAREER heading ── */}
        <h1 className="relative z-10 text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter leading-none mb-6">
          ELEVATE
          <br />
          YOUR CAREER
        </h1>
        {/* ─────────────────────────────────────────────── */}

        <p className="relative z-10 text-gray-400 text-base sm:text-lg max-w-xl mb-10 leading-relaxed">
          AI-powered resume optimization, interview preparation, and application
          tracking — all in one place.
        </p>

        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4">
          {isSignedIn ? (
            <Link
              href="/dashboard"
              className="group inline-flex items-center gap-2 bg-white text-black text-sm font-semibold px-8 py-3 rounded hover:bg-sky-400 hover:scale-105 hover:brightness-110 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              LAUNCH NAVIX
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          ) : (
            <SignInButton mode="modal">
              <button className="group inline-flex items-center gap-2 bg-white text-black text-sm font-semibold px-8 py-3 rounded hover:bg-sky-400 hover:scale-105 hover:brightness-110 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black">
                LAUNCH NAVIX
                <ArrowRight
                  size={14}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            </SignInButton>
          )}
          <a
            href="#features"
            className="text-sm text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-1.5"
          >
            Explore features <ChevronDown size={14} />
          </a>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────── */}
      <section id="features" className="py-24 px-4 bg-[#050505]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14 text-center">
            <p className="text-xs tracking-widest text-sky-400 mb-3">
              SYSTEM FEATURES
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Four protocols.{" "}
              <span className="text-gray-400">One mission.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((f) => (
              <div
                key={f.protocol}
                className="bg-[#111827] border border-white/10 rounded-xl p-6 hover:border-sky-400/30 transition-all duration-300 hover:bg-[#131d2e]"
              >
                <div className="mb-4">{f.icon}</div>
                <p className="text-xs tracking-widest text-sky-400/80 mb-2">
                  {f.protocol}
                </p>
                <h3 className="text-base font-semibold text-white mb-2">
                  {f.title}
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESS ───────────────────────────────────────── */}
      <section id="process" className="py-24 px-4 bg-black">
        <div className="max-w-4xl mx-auto">
          <div className="mb-14 text-center">
            <p className="text-xs tracking-widest text-sky-400 mb-3">
              HOW IT WORKS
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold">
              Four steps{" "}
              <span className="text-gray-400">to your next role.</span>
            </h2>
          </div>

          <div className="space-y-6">
            {steps.map((step, i) => (
              <div
                key={step.num}
                className="flex gap-6 items-start p-6 rounded-xl border border-white/10 bg-[#0d0d0d] hover:border-white/20 transition-colors"
              >
                <span className="text-2xl font-black text-sky-400/60 tabular-nums flex-shrink-0 pt-0.5">
                  {step.num}
                </span>
                <div>
                  <h3 className="text-base font-semibold text-white mb-1.5">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-[#050505] border-y border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((s) => (
              <div key={s.label} className="py-2">
                <p
                  className="text-3xl sm:text-4xl font-black mb-1"
                  style={{
                    background:
                      "linear-gradient(135deg, #38bdf8, #818cf8)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {s.value}
                </p>
                <p className="text-xs tracking-wide text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-gray-700 mt-8">
            Stats based on beta user data as of 2026. Results may vary.
          </p>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────── */}
      <section id="testimonials" className="py-24 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="mb-14 text-center">
            <p className="text-xs tracking-widest text-sky-400 mb-3">VOICES</p>
            <h2 className="text-3xl sm:text-4xl font-bold">
              Common queries.{" "}
              <span className="text-gray-400">Real results.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6 flex flex-col"
              >
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      className="text-amber-400 fill-amber-400"
                    />
                  ))}
                </div>
                <blockquote className="text-sm text-gray-200 leading-relaxed mb-4 flex-1">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <div className="border-t border-white/10 pt-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                  <span className="text-xs text-sky-400 border border-sky-400/30 bg-sky-400/5 px-2 py-1 rounded-full">
                    {t.result}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-gray-700 mt-8">
            Testimonials are illustrative examples. Results may vary.
          </p>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────── */}
      <section id="faq" className="py-24 px-4 bg-[#050505]">
        <div className="max-w-2xl mx-auto">
          <div className="mb-12 text-center">
            <p className="text-xs tracking-widest text-sky-400 mb-3">FAQ</p>
            <h2 className="text-3xl sm:text-4xl font-bold">
              Common queries.{" "}
              <span className="text-gray-400">Straight answers.</span>
            </h2>
          </div>
          <FaqAccordion items={faqs} />
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────── */}
      <section className="py-24 px-4 bg-black text-center">
        <div className="max-w-2xl mx-auto">
          <CheckCircle size={32} className="text-sky-400 mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl font-black mb-4">
            Start your ascent.
          </h2>
          <p className="text-gray-400 mb-10 text-sm sm:text-base leading-relaxed">
            Join thousands of professionals using Navix to land the roles they
            deserve.
          </p>
          <Link
            href="/dashboard"
            className="group inline-flex items-center gap-2 bg-sky-400 text-black text-sm font-bold px-10 py-4 rounded hover:bg-sky-300 hover:scale-105 hover:brightness-110 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            GET STARTED
            <ArrowRight
              size={14}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
