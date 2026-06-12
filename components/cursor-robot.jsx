"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";
import { Bot } from "lucide-react";

export default function CursorRobot() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring physics for the main robot
  const smoothX = useSpring(mouseX, { damping: 20, stiffness: 150, mass: 0.5 });
  const smoothY = useSpring(mouseY, { damping: 20, stiffness: 150, mass: 0.5 });
  
  // Slower trailing particles
  const trail1X = useSpring(mouseX, { damping: 25, stiffness: 100, mass: 1 });
  const trail1Y = useSpring(mouseY, { damping: 25, stiffness: 100, mass: 1 });
  
  const trail2X = useSpring(mouseX, { damping: 30, stiffness: 80, mass: 1.5 });
  const trail2Y = useSpring(mouseY, { damping: 30, stiffness: 80, mass: 1.5 });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY, isVisible]);

  if (typeof window === "undefined") return null;

  return (
    <>
      {/* Trail Particle 2 */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-cyan-400/30 blur-[2px] pointer-events-none z-[9997]"
        style={{
          x: trail2X,
          y: trail2Y,
          translateX: "25px",
          translateY: "25px",
          opacity: isVisible ? 1 : 0,
        }}
      />
      {/* Trail Particle 1 */}
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-cyan-400/50 pointer-events-none z-[9998]"
        style={{
          x: trail1X,
          y: trail1Y,
          translateX: "20px",
          translateY: "20px",
          opacity: isVisible ? 1 : 0,
        }}
      />
      {/* The Robot */}
      <motion.div
        className="fixed top-0 left-0 text-cyan-400 pointer-events-none z-[9999] drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: "12px", // Offset from actual cursor so clicks still work
          translateY: "12px",
          opacity: isVisible ? 1 : 0,
        }}
      >
        <Bot size={24} strokeWidth={1.5} />
      </motion.div>
    </>
  );
}
