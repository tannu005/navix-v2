"use client";

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const FRAME_COUNT = 180;

export default function ScrollytellingCanvas() {
  const canvasRef = useRef(null);
  const [images, setImages] = useState([]);
  const [loaded, setLoaded] = useState(false);

  // Preload images
  useEffect(() => {
    const loadImages = async () => {
      const loadedImages = [];
      const promises = Array.from({ length: FRAME_COUNT }, (_, i) => {
        return new Promise((resolve) => {
          const img = new Image();
          const frameNum = String(i + 1).padStart(3, '0');
          img.src = `/ezgif-frame-${frameNum}.jpg`;
          
          img.onload = () => {
            loadedImages[i] = img;
            resolve();
          };

          img.onerror = () => {
            img.failed = true;
            loadedImages[i] = img;
            resolve();
          };
        });
      });

      await Promise.all(promises);
      setImages(loadedImages);
      setLoaded(true);
    };

    loadImages();
  }, []);

  // Draw and Scroll Logic
  useEffect(() => {
    if (!loaded || images.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawFrame = (index) => {
      const img = images[index];
      if (!img || img.failed) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // Object-fit: cover logic with zoom to hide baked-in black bars
      const ZOOM_FACTOR = 1.35; 
      const canvasRatio = canvas.width / canvas.height;
      const imgWidth = img.width || 1;
      const imgHeight = img.height || 1;
      const imgRatio = imgWidth / imgHeight;
      
      let drawWidth = canvas.width;
      let drawHeight = canvas.height;
      let offsetX = 0;
      let offsetY = 0;

      if (imgRatio > canvasRatio) {
        drawWidth = canvas.height * imgRatio * ZOOM_FACTOR;
        drawHeight = canvas.height * ZOOM_FACTOR;
      } else {
        drawWidth = canvas.width * ZOOM_FACTOR;
        drawHeight = (canvas.width / imgRatio) * ZOOM_FACTOR;
      }

      offsetX = (canvas.width - drawWidth) / 2;
      offsetY = (canvas.height - drawHeight) / 2;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      try {
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      } catch (e) {
        // Ignore draw errors
      }
    };

    const handleScroll = () => {
      const section = canvasRef.current?.closest('section');
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const sectionTop = rect.top;
      const sectionHeight = rect.height;
      
      const scrollDistance = sectionHeight - window.innerHeight;
      
      let scrollFraction = 0;
      if (scrollDistance > 0) {
        scrollFraction = Math.max(0, Math.min(1, -sectionTop / scrollDistance));
      }
      
      const frameIndex = Math.min(FRAME_COUNT - 1, Math.floor(scrollFraction * FRAME_COUNT));
      
      requestAnimationFrame(() => drawFrame(frameIndex));
    };

    // Initial draw
    drawFrame(0);

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [loaded, images]);

  // Mouse Parallax for the Canvas Image
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !loaded) return;

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      const moveX = (clientX - centerX) / centerX;
      const moveY = (clientY - centerY) / centerY;

      gsap.to(canvas, {
        x: moveX * -30,
        y: moveY * -30,
        duration: 1.5,
        ease: 'power2.out'
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [loaded]);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full scale-[1.05] origin-center opacity-60 mix-blend-screen"
      />
      {/* Overlay gradient to blend the canvas with the rest of the dark UI */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/80" />
    </div>
  );
}
