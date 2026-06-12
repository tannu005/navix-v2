"use client";

export default function HeroBackground() {
  return (
    <div className="absolute inset-0 w-full h-full bg-[#080a0f] overflow-hidden">
      {/* AI Resume & Career Background Video - Girl Coding */}
      <video loop autoPlay muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-60 z-0">
        <source src="https://www.paulrogerdev.fr/codepen/pexels-artem-podrez-4832087-1280x720-30fps.mp4" type="video/mp4" />
      </video>
      
      {/* Dark gradient overlay to blend into the rest of the site */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black pointer-events-none z-10" />
    </div>
  );
}
