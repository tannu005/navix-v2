"use client";

import { useEffect, useRef, useState } from "react";
import Hero from "@/components/hero";
import Features from "@/components/features";
import HowItWorks from "@/components/how-it-works";
import Testimonials from "@/components/testimonials";
import FAQs from "@/components/faqs";
import CTA from "@/components/cta";
import gsap from "gsap";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const cursorRef = useRef(null);
  const trailContainerRef = useRef(null);

  // Professional AI Career themed images
  const trailImages = [
    "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=200&h=200&fit=crop",
    "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=200&h=200&fit=crop",
    "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=200&h=200&fit=crop",
    "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=200&h=200&fit=crop"
  ];

  let trail = [];
  let lastMouseX = 0;
  let lastMouseY = 0;
  let imageIndex = 0;
  let idleTimer;

  useEffect(() => {
    setMounted(true);
    const animId = requestAnimationFrame(cleanUpTrail);
    return () => {
      cancelAnimationFrame(animId);
      clearTimeout(idleTimer);
    };
  }, []);

  const createTrailImage = (x, y) => {
    const imageSrc = trailImages[imageIndex];
    imageIndex = (imageIndex + 1) % trailImages.length;
    
    const img = document.createElement("img");
    img.className = "trail-img";
    img.src = imageSrc;
    img.style.width = "180px";
    img.style.height = "180px";
    img.style.left = `${x}px`;
    img.style.top = `${y}px`;
    img.style.borderRadius = "12px";
    img.style.opacity = "0";
    
    trailContainerRef.current?.appendChild(img);
    
    // Slow fade-in and scale entrance
    gsap.to(img, { opacity: 0.7, scale: 1, duration: 0.8, ease: "power2.out" });

    trail.push({
      element: img,
      removeTime: Date.now() + 800
    });
  };

  const cleanUpTrail = () => {
    const now = Date.now();
    if (trail.length > 0 && now > trail[0].removeTime) {
      const item = trail.shift();
      // Slow fade-out
      gsap.to(item.element, {
        opacity: 0,
        scale: 0.5,
        duration: 1.5,
        ease: "power2.inOut",
        onComplete: () => item.element.remove()
      });
    }
    requestAnimationFrame(cleanUpTrail);
  };

  const handleMouseMove = (e) => {
    // Obsidian-style follow-string cursor
    gsap.to(cursorRef.current, { 
      x: e.clientX, 
      y: e.clientY, 
      duration: 0.6, 
      ease: "power3.out" 
    });

    const dist = Math.hypot(e.clientX - lastMouseX, e.clientY - lastMouseY);
    if (dist > 50) {
      createTrailImage(e.clientX, e.clientY);
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
    }

    // Trigger slow fade-out when cursor is stopped or idle
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      trail.forEach(item => {
        gsap.to(item.element, { opacity: 0, duration: 2.5, ease: "power1.out" });
      });
    }, 150); 
  };

  return (
    <main 
      onMouseMove={handleMouseMove} 
      className="relative min-h-screen bg-[#05070a] overflow-x-hidden"
    >
      {/* Follow-string cursor component */}
      <div ref={cursorRef} className="fixed top-0 left-0 z-[1001] pointer-events-none -translate-x-1/2 -translate-y-1/2">
        <div className="w-3 h-3 bg-primary rounded-full shadow-[0_0_15px_rgba(var(--primary),0.5)]" />
      </div>

      {/* AI career trail container */}
      <div ref={trailContainerRef} className="fixed inset-0 pointer-events-none z-[12]" />

      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <FAQs />
      <CTA />
    </main>
  );
}
