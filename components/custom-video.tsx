"use client";

import { useEffect, useRef } from "react";

export default function CustomVideoBackground() {
  const videoRef = useRef(null);
  const fadingOutRef = useRef(false);
  const rafRef = useRef(null);

  const fadeVideo = (targetOpacity, durationMs, callback = null) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    
    const video = videoRef.current;
    if (!video) return;

    const startOpacity = parseFloat(video.style.opacity || "1");
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      
      const currentOpacity = startOpacity + (targetOpacity - startOpacity) * progress;
      video.style.opacity = currentOpacity.toString();

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        if (callback) callback();
      }
    };

    rafRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Initial fade in
    video.style.opacity = "0";
    video.addEventListener("loadeddata", () => {
      fadeVideo(1, 500);
    }, { once: true });

    // Ensure it fades in if already loaded
    if (video.readyState >= 3) {
      fadeVideo(1, 500);
    }

    const handleTimeUpdate = () => {
      if (!video) return;
      const timeRemaining = video.duration - video.currentTime;
      
      // Start fade out at 0.55s remaining
      if (timeRemaining <= 0.55 && !fadingOutRef.current) {
        fadingOutRef.current = true;
        fadeVideo(0, 500);
      }
    };

    const handleEnded = () => {
      if (!video) return;
      video.style.opacity = "0";
      setTimeout(() => {
        video.currentTime = 0;
        video.play().then(() => {
          fadingOutRef.current = false;
          fadeVideo(1, 500);
        }).catch(console.error);
      }, 100);
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      {/* Video with object-bottom so it focuses on the laptop without shifting down */}
      <video
        ref={videoRef}
        muted
        autoPlay
        playsInline
        className="absolute inset-0 w-full h-full object-cover object-bottom opacity-0 z-0"
      >
        <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_115001_bcdaa3b4-03de-47e7-ad63-ae3e392c32d4.mp4" type="video/mp4" />
      </video>
      
      {/* Dark gradient overlays to blend into the header and content */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black pointer-events-none z-10" />
    </div>
  );
}
