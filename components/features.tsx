"use client";

import { useRef } from "react";
import { 
  Cpu, 
  FileText, 
  Search, 
  ShieldCheck, 
  Zap, 
  BarChart3 
} from "lucide-react";
import { motion, useInView } from "framer-motion";

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
  const sectionRef = useRef(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 20 }
    }
  };

  return (
    <section 
      ref={sectionRef} 
      className="relative z-20 pt-16 pb-32 px-4 bg-transparent border-b border-white/5"
      id="features"
    >
      <div className="container mx-auto max-w-6xl">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 50, rotateX: -30 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-24 text-center"
        >
          <span className="inline-block text-xs uppercase tracking-widest text-white/50 mb-4">
            Core Capabilities
          </span>
          <h2 className="text-5xl md:text-7xl text-white leading-none" style={{ fontFamily: "'Instrument Serif', serif" }}>
            System <span className="text-white/50">Features</span>
          </h2>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              className="liquid-glass group relative p-10 rounded-2xl overflow-hidden transition-all duration-500 hover:bg-white/5"
            >
              {/* Technical protocol tag */}
              <div className="absolute top-6 right-8 text-xs font-mono opacity-30 tracking-widest uppercase text-white">
                {feature.tag}
              </div>

              {/* Icon */}
              <div className="mb-8 p-3 w-fit rounded-lg bg-white/5 border border-white/10 text-white/80 group-hover:scale-110 group-hover:bg-white/10 transition-transform duration-500">
                {feature.icon}
              </div>

              <h3 className="text-2xl text-white mb-4" style={{ fontFamily: "'Instrument Serif', serif" }}>
                {feature.title}
              </h3>
              
              <p className="text-white/60 text-sm leading-relaxed max-w-sm">
                {feature.description}
              </p>

              {/* Bottom Decorative Line */}
              <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-white/40 transition-all duration-700 group-hover:w-full" />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Background Decorative element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/5 blur-[120px] rounded-full pointer-events-none z-0" />
    </section>
  );
}
