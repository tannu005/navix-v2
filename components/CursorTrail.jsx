"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function CursorTrail() {
  const containerRef = useRef(null);

  useEffect(() => {
    // Configuration from your provided code
    const config = {
      imageCount: 14,
      imageLifespan: 600,
      removalDelay: 16,
      mouseThreshold: 40,
      inDuration: 600,
      outDuration: 800,
      inEasing: "cubic-bezier(.07,.5,.5,1)",
      outEasing: "cubic-bezier(.87, 0, .13, 1)",
      baseImageSize: 240,
      minImageSize: 160,
      maxImageSize: 340,
      easing: {
        scale: "cubic-bezier(0.34, 1.56, 0.64, 1)",
        reveal: "cubic-bezier(0.87, 0, 0.13, 1)"
      }
    };

    const images = [
      "https://assets.codepen.io/7558/cr-blurry-orange-small-001.jpg",
      "https://assets.codepen.io/7558/cr-blurry-orange-small-002.jpg",
      "https://assets.codepen.io/7558/cr-blurry-orange-small-003.jpg",
      "https://assets.codepen.io/7558/cr-blurry-orange-small-004.jpg",
      "https://assets.codepen.io/7558/cr-blurry-orange-small-005.jpg"
    ];

    let trail = [];
    let mouseX = 0, mouseY = 0, lastMouseX = 0, lastMouseY = 0;
    let currentEffect = "flame";
    let imageIndex = 0;

    const container = containerRef.current;

    // Helper: Create the trail image
    const createImage = (x, y) => {
      const imageSrc = images[imageIndex];
      imageIndex = (imageIndex + 1) % images.length;
      
      const img = document.createElement("img");
      img.className = "trail-img absolute pointer-events-none will-change-transform z-[12]";
      img.src = imageSrc;
      img.style.width = `${config.baseImageSize}px`;
      img.style.height = `${config.baseImageSize}px`;
      img.style.left = `${x}px`;
      img.style.top = `${y}px`;
      img.style.transform = `translate(-50%, -50%) scale(0)`;
      
      container.appendChild(img);
      
      gsap.to(img, {
        scale: 1,
        duration: config.inDuration / 1000,
        ease: "expo.out"
      });

      trail.push({
        element: img,
        removeTime: Date.now() + config.imageLifespan
      });
    };

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      const dist = Math.hypot(mouseX - lastMouseX, mouseY - lastMouseY);
      if (dist > config.mouseThreshold) {
        createImage(mouseX, mouseY);
        lastMouseX = mouseX;
        lastMouseY = mouseY;
      }
    };

    const cleanUp = () => {
      const now = Date.now();
      if (trail.length > 0 && now > trail[0].removeTime) {
        const item = trail.shift();
        gsap.to(item.element, {
          scale: 0,
          opacity: 0,
          duration: config.outDuration / 1000,
          onComplete: () => item.element.remove()
        });
      }
      requestAnimationFrame(cleanUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    const animId = requestAnimationFrame(cleanUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden" 
    />
  );
}
