"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function HeroSection() {
  const imageRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const el = imageRef.current;
    if (!el) return;
    const handleScroll = () => {
      if (window.scrollY > 100) {
        el.classList.add("scrolled");
      } else {
        el.classList.remove("scrolled");
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="w-full pt-36 md:pt-48 pb-10 overflow-hidden">
      <div className="space-y-8 text-center px-4">

        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-medium"
          style={{
            borderColor: "hsl(199 89% 60% / 0.3)",
            background: "hsl(199 89% 60% / 0.07)",
            color: "hsl(199, 89%, 70%)",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
          }}
        >
          <Sparkles className="h-3.5 w-3.5" />
          Powered by Gemini 2.0 Flash · Agentic AI
        </div>

        {/* Headline */}
        <div
          className="space-y-4 mx-auto max-w-5xl"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s",
          }}
        >
          <h1 className="text-5xl font-bold md:text-6xl lg:text-7xl xl:text-8xl gradient-title leading-tight">
            Your AI Career Coach
            <br />
            <span className="text-foreground/90">for Professional Success</span>
          </h1>
          <p className="mx-auto max-w-[580px] text-muted-foreground md:text-lg leading-relaxed">
            Advance your career with personalised AI guidance — from resume building and interview prep to skill gap analysis and salary intelligence.
          </p>
        </div>

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row justify-center gap-3"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s",
          }}
        >
          <Link href="/dashboard">
            <Button
              size="lg"
              className="px-8 h-12 text-base font-semibold btn-glow"
              style={{ background: "hsl(199, 89%, 48%)", color: "#fff" }}
            >
              Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="#features">
            <Button
              size="lg"
              variant="outline"
              className="px-8 h-12 text-base"
              style={{ borderColor: "hsl(199 89% 60% / 0.3)" }}
            >
              See Features
            </Button>
          </Link>
        </div>

        {/* Trust line */}
        <p
          className="text-xs text-muted-foreground"
          style={{
            opacity: mounted ? 0.6 : 0,
            transition: "opacity 0.6s ease 0.3s",
          }}
        >
          No credit card required · 8 AI tools · Built for job seekers
        </p>

        {/* Dashboard preview — placeholder since no banner.jpeg */}
        <div
          className="hero-image-wrapper mt-8 max-w-5xl mx-auto"
          style={{
            opacity: mounted ? 1 : 0,
            transition: "opacity 0.8s ease 0.4s",
          }}
        >
          <div ref={imageRef} className="hero-image">
            {/* Dashboard mockup */}
            <div
              className="rounded-xl border mx-auto overflow-hidden"
              style={{
                background: "hsl(222, 18%, 8%)",
                borderColor: "hsl(199 89% 60% / 0.2)",
                boxShadow: "0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px hsl(199 89% 60% / 0.08)",
              }}
            >
              {/* Browser chrome */}
              <div
                className="flex items-center gap-2 px-4 py-3 border-b"
                style={{ borderColor: "hsl(199 89% 60% / 0.1)", background: "hsl(222, 20%, 6%)" }}
              >
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/70" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                  <div className="w-3 h-3 rounded-full bg-green-500/70" />
                </div>
                <div
                  className="flex-1 mx-4 px-3 py-1 rounded text-xs text-center"
                  style={{ background: "hsl(222, 18%, 10%)", color: "hsl(215, 15%, 50%)" }}
                >
                  navix.vercel.app/dashboard
                </div>
              </div>
              {/* Mock dashboard content */}
              <div className="p-6 grid grid-cols-4 gap-4">
                {["Market Outlook", "Growth Rate", "Demand Level", "AI Tools"].map((label, i) => (
                  <div
                    key={i}
                    className="rounded-lg p-4 border"
                    style={{ background: "hsl(222, 18%, 10%)", borderColor: "hsl(222, 15%, 16%)" }}
                  >
                    <p className="text-xs mb-2" style={{ color: "hsl(215, 15%, 50%)" }}>{label}</p>
                    <div
                      className="h-5 rounded"
                      style={{
                        background: `hsl(199, 89%, ${40 + i * 8}% / 0.3)`,
                        width: `${60 + i * 10}%`
                      }}
                    />
                  </div>
                ))}
                <div
                  className="col-span-4 rounded-lg p-4 border"
                  style={{ background: "hsl(222, 18%, 10%)", borderColor: "hsl(222, 15%, 16%)" }}
                >
                  <p className="text-xs mb-3" style={{ color: "hsl(215, 15%, 50%)" }}>Salary Ranges by Role (₹K)</p>
                  <div className="flex items-end gap-2 h-20">
                    {[65, 45, 80, 55, 70, 40, 90, 60].map((h, i) => (
                      <div key={i} className="flex-1 rounded-t" style={{ height: `${h}%`, background: `hsl(${199 + i * 5}, 70%, 50%)`, opacity: 0.7 }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
