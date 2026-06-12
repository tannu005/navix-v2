import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const LOGOS = [
  'https://raw.githubusercontent.com/dsMagnatov/Acreage-landing-assets/refs/heads/main/voiceflow-logo-svg-150px.svg',
  'https://raw.githubusercontent.com/dsMagnatov/Acreage-landing-assets/refs/heads/main/zendesk-logo-svg-150px.svg',
  'https://raw.githubusercontent.com/dsMagnatov/Acreage-landing-assets/refs/heads/main/pendo-logo-svg-150px.svg',
  'https://raw.githubusercontent.com/dsMagnatov/Acreage-landing-assets/refs/heads/main/glide-logo-svg-150px.svg',
  'https://raw.githubusercontent.com/dsMagnatov/Acreage-landing-assets/refs/heads/main/canva-logo-svg-150px.svg'
];

// Duplicate 4 times for seamless infinite scroll on wide screens
const MARQUEE_LOGOS = [...LOGOS, ...LOGOS, ...LOGOS, ...LOGOS];

export default function GlassPanel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const panelWrapperRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const wrapper = panelWrapperRef.current;
    if (!container || !wrapper) return;

    // Animate panel sliding up from bottom as we scroll
    gsap.fromTo(
      wrapper,
      { y: '100%' },
      {
        y: '0%',
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top bottom', // Start when container enters viewport from bottom
          end: 'bottom bottom', // End when container hits bottom of viewport
          scrub: 1.5, // Added inertia (1.5 seconds to catch up) for smoother entrance
        }
      }
    );
  }, []);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      // Calculate distance from center (-1 to 1)
      const moveX = (clientX - centerX) / centerX;
      const moveY = (clientY - centerY) / centerY;

      gsap.to(panel, {
        x: moveX * 20, // max move 20px
        y: moveY * 20,
        rotationY: moveX * 4, // max rotation 4 deg
        rotationX: -moveY * 4,
        ease: 'power3.out',
        duration: 1
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div ref={containerRef} className="absolute bottom-0 left-0 w-full h-screen flex items-center justify-center pt-32 pb-12 px-4 md:px-12 z-20 pointer-events-none overflow-hidden">
      <div 
        ref={panelWrapperRef}
        className="w-full max-w-[1250px] h-[900px] max-h-[85vh] pointer-events-auto"
        style={{ perspective: '1000px' }}
      >
        <div 
          ref={panelRef}
          className="w-full h-full flex flex-col justify-between rounded-3xl relative overflow-hidden"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.16)',
            backdropFilter: 'blur(160px)',
            WebkitBackdropFilter: 'blur(160px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            transformStyle: 'preserve-3d',
            willChange: 'transform'
          }}
        >
          <div className="flex-1 flex flex-col items-center justify-center px-6 md:px-12 text-center relative z-0">
          <p className="font-serif italic text-white/70 text-base md:text-lg mb-4 md:mb-6">About Us</p>
          <h2 className="font-serif text-white text-4xl md:text-6xl lg:text-[96px] leading-[1.1] lg:leading-[92.6px] tracking-tight w-full max-w-[1000px] mx-auto">
            We transform sterile concrete into thriving{' '}
            <span className="italic">urban</span>
            {' '}jungles. Our innovative designs bring wild{' '}
            <span className="italic">nature</span> back to modern cities. Experience the{' '}
            <span className="italic">bloom</span>
          </h2>
        </div>

        {/* Logo Marquee */}
        <div className="relative border-t border-white/10 py-6 overflow-hidden">
          <div className="flex w-max animate-marquee items-center">
            {MARQUEE_LOGOS.map((logo, index) => (
              <div key={index} className="flex-shrink-0 px-8 md:px-12 flex items-center justify-center">
                <img 
                  src={logo} 
                  alt="Partner Logo" 
                  className="h-[32px] opacity-40 hover:opacity-100 transition-opacity duration-300 filter invert brightness-0"
                />
              </div>
            ))}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
