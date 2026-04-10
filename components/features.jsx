"use client";

import { useEffect, useRef } from "react";
import { 
  Cpu, 
  FileText, 
  Search, 
  ShieldCheck, 
  Zap, 
  BarChart3 
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger for the "linked" scroll feel
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const features = [
  {
    title: "Agentic AI Analysis",
    description: "Instant resume scoring powered by Groq LPU technology for sub-second inference.",
    icon: <Cpu className="w-6 h-6" />,
    tag: "Protocol 01"
  },
  {
    title: "ATS Optimization",
    description: "Tailor your professional identity to bypass algorithmic gatekeepers with precision.",
    icon: <ShieldCheck className="w-6 h-6" />,
    tag: "Protocol 02"
  },
  {
    title: "Real-time Tracking",
    description: "A high-performance dashboard to manage application lifecycles and interview funnels.",
    icon: <BarChart3 className="w-6 h-6" />,
    tag: "Protocol 03"
  },
  {
    title: "Interview Intelligence",
    description: "Simulate high-stakes technical interviews with context-aware AI feedback.",
    icon: <Zap className="w-6 h-6" />,
    tag: "Protocol 04"
  }
];

export default function Features() {
  const containerRef = useRef(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Headline Animation
      gsap.from(".features-title", {
        opacity: 0,
        y: 100,
        rotateX: -45,
        duration: 1.5,
        ease: "expo.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        }
      });

      // 2. Feature Cards "Obsidian" Unfold
      gsap.from(".feature-card", {
        opacity: 0,
        y: 60,
        scale: 0.9,
        stagger: 0.2,
        duration: 1,
        ease: "power4.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
          end: "bottom 25%",
          toggleActions: "play none none reverse",
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="relative py-32 px-4 bg-[#050505]"
      id="features"
    >
      <div className="container mx-auto max-w-6xl">
        {/* Header Section */}
        <div className="mb-24 text-center">
          <span className="inline-block text-[10px] uppercase tracking-[0.5em] text-primary mb-4 font-syne">
            Core Capabilities
          </span>
          <h2 className="features-title text-6xl md:text-8xl font-bebas leading-none uppercase">
            System <span className="text-white/20">Features</span>
          </h2>
        </div>

        {/* Features Grid */}
        <div 
          ref={containerRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {features.map((feature, index) => (
            <div 
              key={index}
              className="feature-card glass-panel group relative p-10 rounded-2xl overflow-hidden transition-all duration-500 hover:border-primary/50"
              data-card
            >
              {/* Technical protocol tag */}
              <div className="absolute top-6 right-8 text-[9px] font-mono opacity-30 tracking-widest uppercase">
                {feature.tag}
              </div>

              {/* Icon with Groq-themed Glow */}
              <div className="mb-8 p-3 w-fit rounded-lg bg-white/5 border border-white/10 text-primary group-hover:scale-110 group-hover:bg-primary/10 transition-transform duration-500">
                {feature.icon}
              </div>

              <h3 className="text-2xl font-syne font-bold mb-4 tracking-tight">
                {feature.title}
              </h3>
              
              <p className="text-zinc-500 font-dm leading-relaxed max-w-sm">
                {feature.description}
              </p>

              {/* Bottom Decorative Line */}
              <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-primary transition-all duration-700 group-hover:w-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Background Decorative element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none z-0" />
    </section>
  );
}
