"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function CinematicHero() {
  const introRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const introTL = gsap.timeline();
    // Font swapping intro animation
    const fonts = ["Anton", "Jost", "Alkatra", "Nova Oval", "Oswald", "Poppins"];
    fonts.forEach((font) => {
      introTL.to(".intro-text", 0.1, { fontFamily: font });
    });

    introTL.to(".intro-overlay", 1, { scaleY: 0, ease: "expo.inOut" });
    introTL.to(".intro-red-bar", 1, { scaleY: 2, ease: "expo.inOut" }, "-=1.25");

    // Title animation logic
    gsap.from(".hero-title span", {
      duration: 1.5,
      y: "120%",
      scale: -0.5,
      ease: "expo.inOut",
      delay: 0.6,
      stagger: 0.025,
    });
  }, []);

  return (
    <main className="relative w-full overflow-hidden bg-black">
      {/* Intro Overlay */}
      <section ref={introRef} className="intro-overlay fixed inset-0 z-[1000] flex items-center justify-center bg-black origin-top">
        <span className="intro-text text-white text-5xl">Loading</span>
        <div className="intro-red-bar absolute bottom-0 left-0 w-full h-[30%] bg-[#f21010] origin-bottom scale-y-0" />
      </section>

      {/* Cinematic Hero Section */}
      <section className="relative w-screen h-screen flex items-center justify-center">
        <div className="relative w-[90vw] h-[90vh] flex flex-col items-center justify-center overflow-hidden rounded-[3vw]">
          {/* Background Video */}
          <video className="absolute inset-0 w-full h-full object-cover z-0" loop autoPlay muted>
            <source src="https://www.paulrogerdev.fr/codepen/pexels-artem-podrez-4832087-1280x720-30fps.mp4" type="video/mp4" />
          </video>

          {/* Masked Content */}
          <div className="relative z-10 flex flex-col items-center">
            <h1 className="hero-title text-[19vw] font-['Bebas_Neue'] uppercase leading-[0.8] text-white overflow-hidden">
              {"Build your board".split("").map((char, i) => (
                <span key={i} className="inline-block">{char === " " ? "\u00A0" : char}</span>
              ))}
            </h1>
          </div>

          {/* SVG Mask for the cinematic shape [cite: 3] */}
          <svg width="0" height="0">
            <defs>
              <clipPath id="svgClipPath" clipPathUnits="objectBoundingBox">
                <path d="M0.648438 0.00390625 L0.296875 0.00390625 L0.0976562 0.15625 L-0.00390625 1.003906 L0.644531 1.003906 L0.820312 0.882812 ZM0.648438 0.00390625"/>
              </clipPath>
            </defs>
          </svg>
        </div>
      </section>
    </main>
  );
}
