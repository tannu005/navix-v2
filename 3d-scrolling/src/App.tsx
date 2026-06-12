/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import ScrollFloat from './components/ScrollFloat';
import PillNav from './components/PillNav';
import GlassPanel from './components/GlassPanel';

gsap.registerPlugin(ScrollToPlugin);

const FRAME_COUNT = 180;

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<(HTMLImageElement & { failed?: boolean })[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hasErrors, setHasErrors] = useState(false);

  // Preload images
  useEffect(() => {
    const loadImages = async () => {
      const loadedImages: (HTMLImageElement & { failed?: boolean })[] = [];
      let loadedCount = 0;
      let errorCount = 0;

      const promises = Array.from({ length: FRAME_COUNT }, (_, i) => {
        return new Promise<void>((resolve) => {
          const img = new Image() as HTMLImageElement & { failed?: boolean };
          const frameNum = String(i + 1).padStart(3, '0');
          img.src = `/scrollytelling/ezgif-frame-${frameNum}.jpg`;
          
          img.onload = () => {
            loadedImages[i] = img;
            loadedCount++;
            setProgress(Math.round((loadedCount / FRAME_COUNT) * 100));
            resolve();
          };

          img.onerror = () => {
            img.failed = true;
            errorCount++;
            loadedImages[i] = img;
            loadedCount++;
            setProgress(Math.round((loadedCount / FRAME_COUNT) * 100));
            resolve();
          };
        });
      });

      await Promise.all(promises);
      setImages(loadedImages);
      setHasErrors(errorCount > 0);
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

    const drawFrame = (index: number) => {
      const img = images[index];
      if (!img || img.failed) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // Object-fit: cover logic with zoom to hide baked-in black bars
      const ZOOM_FACTOR = 1.35; // Adjust this value to zoom in more or less
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
      const scrollTop = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const scrollFraction = Math.max(0, Math.min(1, scrollTop / maxScroll));
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

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      const moveX = (clientX - centerX) / centerX;
      const moveY = (clientY - centerY) / centerY;

      // Move the canvas slightly opposite to the mouse direction
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

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    gsap.to(window, { duration: 3, scrollTo: 0, ease: 'power3.inOut' });
  };

  const handleAboutClick = (e: React.MouseEvent) => {
    e.preventDefault();
    gsap.to(window, { duration: 3, scrollTo: document.body.scrollHeight, ease: 'power3.inOut' });
  };

  return (
    <div className="h-[500vh] bg-black relative">
      <PillNav
        logo="/logo.svg"
        logoAlt="Logo"
        items={[
          { label: 'HOME', href: '#home', onClick: handleHomeClick },
          { label: 'ABOUT', href: '#about', onClick: handleAboutClick },
          { label: 'SERVICES', href: '/services' },
          { label: 'CONTACT', href: '/contact' }
        ]}
        activeHref="#home"
        className="custom-nav"
        initialLoadAnimation={true}
      />

      {/* Loading Overlay */}
      {!loaded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black text-white text-2xl font-sans">
          Завантаження... {progress}%
        </div>
      )}

      {/* Error Message if images are missing */}
      {loaded && hasErrors && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-red-500/90 text-white px-6 py-4 rounded-lg shadow-lg text-center max-w-md backdrop-blur-sm">
          <p className="font-bold mb-2">Кадри не знайдено!</p>
          <p className="text-sm">
            Будь ласка, завантажте папку <strong>scrollytelling</strong> з картинками у папку <strong>public</strong> через файловий менеджер зліва.
          </p>
        </div>
      )}

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full z-0 scale-[1.05] origin-center"
      />

      {/* Text Overlay */}
      <div className="fixed inset-0 flex flex-col justify-end p-4 md:p-8 pointer-events-none z-10">
        <ScrollFloat
          containerClassName="text-white w-full"
          textClassName="block"
          animationDuration={1}
          ease="power2.inOut"
          scrollStart="top top"
          scrollEnd="+=1000"
          stagger={0.05}
          style={{
            fontFamily: "'Dirtyline36Daysoftype2022', sans-serif",
            fontSize: 'clamp(4rem, 15vw, 317px)',
            lineHeight: '0.85',
            letterSpacing: '0%',
            wordBreak: 'break-word'
          }}
        >
          {`Unleash The\nFull Power`}
        </ScrollFloat>
      </div>

      {/* Glass Panel at the end of scroll */}
      <GlassPanel />
    </div>
  );
}
