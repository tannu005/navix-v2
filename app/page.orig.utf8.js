"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { SignInButton, useAuth } from "@clerk/nextjs";
import { ArrowRight, Zap } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Features from "@/components/features";
import HowItWorks from "@/components/how-it-works";
import Testimonials from "@/components/testimonials";
import FAQs from "@/components/faqs";
import CTA from "@/components/cta";

/* ÔöÇÔöÇÔöÇ Main Page ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ */
export default function HomePage() {
  const { isSignedIn } = useAuth();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <div
      className={`min-h-screen bg-black text-white transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
    >
      <Navbar />

      {/* ÔöÇÔöÇÔöÇ Hero ÔöÇÔöÇÔöÇ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4">
        <div className="mb-6">
          <span className="inline-flex items-center gap-2 text-xs tracking-widest text-sky-400 border border-sky-400/30 bg-sky-400/5 px-4 py-2 rounded-full">
            <Zap size={12} /> GROQ POWERED CAREER COACHING
          </span>
        </div>
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter mb-6">
          ELEVATE
          <br />
          YOUR CAREER
        </h1>
        <p className="text-gray-400 text-base sm:text-lg max-w-xl mb-10">
          AI-powered resume optimization, interview preparation, and application
          tracking ÔÇö all in one intelligent platform.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {isSignedIn ? (
            <Link
              href="/dashboard"
              className="bg-white text-black text-sm font-bold px-8 py-3 rounded hover:bg-sky-400 transition-all"
            >
              LAUNCH NAVIX{" "}
              <ArrowRight size={14} className="inline ml-2" />
            </Link>
          ) : (
            <SignInButton mode="modal">
              <button className="bg-white text-black text-sm font-bold px-8 py-3 rounded hover:bg-sky-400 transition-all">
                LAUNCH NAVIX{" "}
                <ArrowRight size={14} className="inline ml-2" />
              </button>
            </SignInButton>
          )}
        </div>
      </section>

      {/* ÔöÇÔöÇÔöÇ Features + How to Use (single component) ÔöÇÔöÇÔöÇ */}
      <Features />

      {/* ÔöÇÔöÇÔöÇ How It Works (Process Steps) ÔöÇÔöÇÔöÇ */}
      <HowItWorks />

      {/* ÔöÇÔöÇÔöÇ Testimonials ÔöÇÔöÇÔöÇ */}
      <Testimonials />

      {/* ÔöÇÔöÇÔöÇ FAQ + Stats ÔöÇÔöÇÔöÇ */}
      <FAQs />

      {/* ÔöÇÔöÇÔöÇ CTA ÔöÇÔöÇÔöÇ */}
      <CTA />

      {/* ÔöÇÔöÇÔöÇ Footer ÔöÇÔöÇÔöÇ */}
      <Footer />
    </div>
  );
}
