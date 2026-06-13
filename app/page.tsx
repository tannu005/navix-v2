"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import ToolShowcase from "@/components/tool-showcase";
import HowItWorks from "@/components/how-it-works";
import Testimonials from "@/components/testimonials";
import FAQs from "@/components/faqs";
import CTA from "@/components/cta";
import Footer from "@/components/footer";
import CustomVideoBackground from "@/components/custom-video";
import ScrollFloat from "@/components/scroll-float";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {
  const ctaRef = useRef(null);

  useEffect(() => {
    if (!ctaRef.current) return;
    
    gsap.fromTo(
      ctaRef.current,
      { opacity: 1, y: 0 },
      {
        opacity: 0,
        y: 100,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "+=800",
          scrub: 1
        }
      }
    );
  }, []);

  return (
    <main className="min-h-screen relative w-full">
      
      {/* Landing Page Background Video */}
      <div className="fixed inset-0 w-full h-full z-[-1] pointer-events-none">
        <CustomVideoBackground />
      </div>

      {/* Hero Section - 100vh */}
      <div className="h-screen w-full relative flex flex-col justify-center items-center px-6">
        
        {/* ScrollFloat text from the zip file */}
        <ScrollFloat
          animationDuration={1}
          ease="power2.inOut"
          scrollStart="top top"
          scrollEnd="+=1000"
          stagger={0.03}
          textClassName="text-5xl md:text-7xl lg:text-[6rem] text-white tracking-tight text-center drop-shadow-2xl mix-blend-difference"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          {`Navigate\nyour career`}
        </ScrollFloat>
        
        {/* Subtext and Buttons */}
        <div ref={ctaRef} className="max-w-xl w-full space-y-8 flex flex-col items-center mt-8 pointer-events-auto">
          <p className="text-white text-lg md:text-xl leading-relaxed px-4 opacity-90 drop-shadow-md text-center">
            Stay ahead in your career journey. Join our platform today and land your dream job with AI-powered insights, personalized roadmaps, and interview coaching.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
            <Link href="/dashboard" className="liquid-glass rounded-full px-8 py-4 flex items-center gap-3 text-white font-medium hover:bg-white/10 transition-all border border-white/20 hover:border-white/40 group">
              <span className="text-base">Start Your Journey</span>
              <div className="bg-white rounded-full p-2 text-black group-hover:scale-110 transition-transform">
                <ArrowRight size={18} />
              </div>
            </Link>
            
            <Link href="#features" className="rounded-full px-8 py-4 text-white/80 text-base font-medium hover:text-white transition-colors border border-transparent hover:border-white/20">
              Explore Features
            </Link>
          </div>
        </div>
      </div>

      {/* Normal Content Flow overlapping the video */}
      <div className="relative z-20 bg-black/80 border-t border-white/10 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
         {/* Top gradient transition */}
         <div className="absolute -top-32 left-0 right-0 h-32 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
         
         <div className="pt-24 pb-16 space-y-24">
           <HowItWorks />
           <ToolShowcase />
           <Testimonials />
           <FAQs />
           <CTA />
           <Footer />
         </div>
      </div>
    </main>
  );
}
