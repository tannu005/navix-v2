"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Mic, FileText, Pen, Kanban, LineChart } from "lucide-react";

const TOOLS = [
  {
    id: "interviews",
    title: "AI Interviews",
    description: "Real-time voice-based mock interviews with industry-specific AI personas.",
    icon: Mic,
    color: "from-cyan-500/20 to-blue-500/20",
    border: "border-cyan-500/30"
  },
  {
    id: "resume",
    title: "Resume Builder",
    description: "Generate ATS-friendly resumes tailored to the exact job you want.",
    icon: FileText,
    color: "from-purple-500/20 to-pink-500/20",
    border: "border-purple-500/30"
  },
  {
    id: "cover-letter",
    title: "Cover Letters",
    description: "Instantly draft highly personalized cover letters that match your tone.",
    icon: Pen,
    color: "from-green-500/20 to-emerald-500/20",
    border: "border-emerald-500/30"
  },
  {
    id: "tracker",
    title: "Job Tracker",
    description: "A gorgeous Kanban pipeline to track every application, interview, and offer.",
    icon: Kanban,
    color: "from-orange-500/20 to-red-500/20",
    border: "border-orange-500/30"
  },
  {
    id: "insights",
    title: "Market Insights",
    description: "Live salary data and skill trends to help you negotiate like a pro.",
    icon: LineChart,
    color: "from-blue-500/20 to-indigo-500/20",
    border: "border-blue-500/30"
  }
];

export default function ToolShowcase() {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  const [viewMode, setViewMode] = useState("spiral");
  
  // Animation state refs
  const blendRef = useRef({ val: 0 }); // 0 = spiral, 1 = list
  const progressRef = useRef(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    cardsRef.current.forEach((card) => {
      if (!card) return;
      gsap.set(card, {
        position: "absolute",
        top: "60%", // Shifted down to compensate for the 3D tilt raising the back cards
        left: "50%",
        xPercent: -50,
        yPercent: -50,
        transformOrigin: "50% 50%",
      });
    });

    const wrapValue = (v, total) => ((v % total) + total) % total;

    const renderFrame = (progress) => {
      progressRef.current = progress;
      const blend = blendRef.current.val;

        // Restored Clean 5-Card Spiral Physics
        const N = TOOLS.length;
        const ANGLE_STEP = (Math.PI * 2) / N; // 1.256 radians - perfectly distributes 5 cards around a full circle!
        const TOTAL = Math.PI * 2; // 6.28
        const HALF = Math.PI; // 3.14
        const RADIUS = 650;
        const PITCH = 0; // Flat ring, relying on rotateX for perspective tilt!
        
        const LIST_SPACING = 550;
        const TOTAL_W = N * LIST_SPACING;
        const HALF_W = TOTAL_W / 2;
        const LINEAR_FACTOR = TOTAL_W / TOTAL;

        // We allow 2 full loops of the entire array over the scroll distance
        const scrollCurrent = progress * (TOTAL * 2);
        const linearScroll = scrollCurrent * LINEAR_FACTOR;

        cardsRef.current.forEach((card, i) => {
          if (!card) return;

          // Spiral Target Math (Modulo Wrapping)
          const theta = wrapValue(i * ANGLE_STEP - scrollCurrent + HALF, TOTAL) - HALF;
          const sx_spiral = -Math.sin(theta) * RADIUS;
          const sy_spiral = -theta * PITCH;
          const sz_spiral = Math.cos(theta) * RADIUS - RADIUS;
          const rotY_spiral = -theta * (180 / Math.PI);
          
          const distSpiral = Math.abs(theta);
          const opacity_spiral = Math.max(0, 1 - (distSpiral / Math.PI)); // Reaches exactly 0 at the back of the circle!
          const scale_spiral = Math.max(0.4, 1 - (distSpiral / Math.PI) * 0.4);

        // List Target Math (Modulo Wrapping)
        const lx = wrapValue(i * LIST_SPACING - linearScroll + HALF_W, TOTAL_W) - HALF_W;
        const sx_list = lx;
        const sy_list = 0;
        const sz_list = Math.abs(lx) * -0.15;
        const rotY_list = lx * -0.02;
        
        const distList = Math.abs(lx) / LIST_SPACING;
        const opacity_list = Math.max(0.1, 1 - distList * 0.5);
        const scale_list = Math.max(0.6, 1 - distList * 0.1);

        // Interpolate between Spiral and List
        const sx = gsap.utils.interpolate(sx_spiral, sx_list, blend);
        const sy = gsap.utils.interpolate(sy_spiral, sy_list, blend);
        const sz = gsap.utils.interpolate(sz_spiral, sz_list, blend);
        const rotY = gsap.utils.interpolate(rotY_spiral, rotY_list, blend);
        const scale = gsap.utils.interpolate(scale_spiral, scale_list, blend);
        const opacity = gsap.utils.interpolate(opacity_spiral, opacity_list, blend);
        const distBlend = gsap.utils.interpolate(distSpiral, distList, blend);

        gsap.set(card, {
          x: sx,
          y: sy,
          z: sz,
          rotationY: rotY,
          scale: scale,
          opacity: opacity,
          zIndex: Math.round(100 - distBlend * 10),
          pointerEvents: distBlend < 0.3 ? "auto" : "none"
        });
      });
    };

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "+=1500", // Shortened massively so it doesn't take forever to scroll through the section
      pin: true,
      scrub: 1,
      onUpdate: (self) => {
        renderFrame(self.progress);
      }
    });
    
    renderFrame(0);

    return () => st.kill();
  }, []);

  // Handle Mode Toggle
  useEffect(() => {
    const targetBlend = viewMode === "list" ? 1 : 0;
    
    gsap.to(blendRef.current, {
      val: targetBlend,
      duration: 1.2,
      ease: "power3.inOut",
      onUpdate: () => {
        const progress = progressRef.current;
        const blend = blendRef.current.val;
        const wrapValue = (v, total) => ((v % total) + total) % total;

        const N = TOOLS.length;
        const ANGLE_STEP = (Math.PI * 2) / N; 
        const TOTAL = Math.PI * 2; 
        const HALF = Math.PI; 
        const RADIUS = 650;
        const PITCH = 0; 
        
        const LIST_SPACING = 550;
        const TOTAL_W = N * LIST_SPACING;
        const HALF_W = TOTAL_W / 2;
        const LINEAR_FACTOR = TOTAL_W / TOTAL;

        const scrollCurrent = progress * (TOTAL * 2);
        const linearScroll = scrollCurrent * LINEAR_FACTOR;

        cardsRef.current.forEach((card, i) => {
          if (!card) return;

          const theta = wrapValue(i * ANGLE_STEP - scrollCurrent + HALF, TOTAL) - HALF;
          const sx_spiral = -Math.sin(theta) * RADIUS;
          const sy_spiral = -theta * PITCH;
          const sz_spiral = Math.cos(theta) * RADIUS - RADIUS;
          const rotY_spiral = -theta * (180 / Math.PI);
          
          const distSpiral = Math.abs(theta);
          const opacity_spiral = Math.max(0, 1 - (distSpiral / Math.PI));
          const scale_spiral = Math.max(0.4, 1 - (distSpiral / Math.PI) * 0.4);

          const lx = wrapValue(i * LIST_SPACING - linearScroll + HALF_W, TOTAL_W) - HALF_W;
          const sx_list = lx;
          const sy_list = 0;
          const sz_list = Math.abs(lx) * -0.15;
          const rotY_list = lx * -0.02;
          
          const distList = Math.abs(lx) / LIST_SPACING;
          const opacity_list = Math.max(0.1, 1 - distList * 0.5);
          const scale_list = Math.max(0.6, 1 - distList * 0.1);

          const sx = gsap.utils.interpolate(sx_spiral, sx_list, blend);
          const sy = gsap.utils.interpolate(sy_spiral, sy_list, blend);
          const sz = gsap.utils.interpolate(sz_spiral, sz_list, blend);
          const rotY = gsap.utils.interpolate(rotY_spiral, rotY_list, blend);
          const scale = gsap.utils.interpolate(scale_spiral, scale_list, blend);
          const opacity = gsap.utils.interpolate(opacity_spiral, opacity_list, blend);
          const distBlend = gsap.utils.interpolate(distSpiral, distList, blend);

          gsap.set(card, {
            x: sx,
            y: sy,
            z: sz,
            rotationY: rotY,
            scale: scale,
            opacity: opacity,
            zIndex: Math.round(100 - distBlend * 10),
            pointerEvents: distBlend < 0.3 ? "auto" : "none"
          });
        });
      }
    });
  }, [viewMode]);

  return (
    <section id="features" ref={sectionRef} className="relative h-screen w-full bg-transparent overflow-hidden" style={{ perspective: "1200px" }}>
      
      {/* Fable-style Header Toggle */}
      <div className="absolute top-8 right-8 z-50 flex items-center gap-4 text-xs font-mono tracking-[0.2em] uppercase">
        <button 
          onClick={() => setViewMode("spiral")}
          className={`transition-all duration-300 ${viewMode === "spiral" ? "text-white opacity-100" : "text-white/40 opacity-50 hover:opacity-100"}`}
        >
          spiral
        </button>
        <span className="w-1 h-1 rounded-full bg-white/20"></span>
        <button 
          onClick={() => setViewMode("list")}
          className={`transition-all duration-300 ${viewMode === "list" ? "text-white opacity-100" : "text-white/40 opacity-50 hover:opacity-100"}`}
        >
          list
        </button>
      </div>

      <div className="absolute top-24 left-0 right-0 text-center z-50 pointer-events-none">
        <p className="text-xs tracking-[0.4em] text-white/30 uppercase mb-4">Ecosystem</p>
        <h2 className="text-6xl text-white drop-shadow-lg" style={{ fontFamily: "'Instrument Serif', serif" }}>
          System Features
        </h2>
      </div>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ transformStyle: "preserve-3d", transform: "rotateX(-10deg)" }}>
        {TOOLS.map((tool, i) => {
          const Icon = tool.icon;
          return (
            <div
              key={tool.id}
              ref={el => cardsRef.current[i] = el}
              className={`w-[320px] md:w-[380px] p-8 rounded-3xl bg-black/60 backdrop-blur-2xl border ${tool.border} flex flex-col items-center text-center shadow-[0_0_50px_rgba(0,0,0,0.5)]`}
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${tool.color} flex items-center justify-center mb-6 shadow-inner border border-white/10`}>
                <Icon size={32} className="text-white" />
              </div>
              <h3 className="text-3xl font-medium text-white mb-4" style={{ fontFamily: "'Instrument Serif', serif" }}>{tool.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed font-light">
                {tool.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
