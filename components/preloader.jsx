"use client";

import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const preloaderRef = useRef(null);
  const textRef = useRef(null);
  const barRef = useRef(null);

  useEffect(() => {
    // Prevent scrolling while loading
    document.body.style.overflow = "hidden";

    // Simulate loading progress
    const startTime = performance.now();
    const duration = 2000; // 2 seconds to load

    const animateLoading = (currentTime) => {
      const elapsed = currentTime - startTime;
      const currentProgress = Math.min(Math.floor((elapsed / duration) * 100), 100);
      
      setProgress(currentProgress);
      
      if (barRef.current) {
        barRef.current.style.width = `${currentProgress}%`;
      }

      if (currentProgress < 100) {
        requestAnimationFrame(animateLoading);
      } else {
        // When 100% is reached, start exit animation
        const tl = gsap.timeline({
          onComplete: () => {
            if (preloaderRef.current) {
              preloaderRef.current.style.display = "none";
            }
            document.body.style.overflow = "";
          }
        });

        tl.to(textRef.current, {
          y: -50,
          opacity: 0,
          duration: 0.8,
          ease: "power3.inOut"
        })
        .to(preloaderRef.current, {
          yPercent: -100,
          duration: 1.2,
          ease: "expo.inOut"
        }, "-=0.4");
      }
    };

    requestAnimationFrame(animateLoading);

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div 
      ref={preloaderRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black text-white"
    >
      <div ref={textRef} className="flex flex-col items-center gap-6 w-full max-w-sm px-8">
        {/* Sleek Logo Text */}
        <div className="flex items-baseline overflow-hidden">
          <span 
            className="text-4xl tracking-tighter font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70"
          >
            NAVIX
          </span>
          <span className="text-5xl text-cyan-500 font-black leading-none">.</span>
        </div>
        
        {/* Progress Display */}
        <div className="flex items-center justify-between w-full text-xs tracking-[0.2em] uppercase text-white/50 font-mono">
          <span>Loading</span>
          <span>{progress}%</span>
        </div>

        {/* Progress Bar */}
        <div className="h-[2px] w-full bg-white/10 overflow-hidden relative">
          <div 
            ref={barRef}
            className="absolute top-0 left-0 h-full bg-cyan-400"
            style={{ width: "0%" }}
          />
        </div>
      </div>
    </div>
  );
}
