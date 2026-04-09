import HeroSection from "@/components/hero"; // Updated cinematic component
import Features from "@/components/features";
import HowItWorks from "@/components/how-it-works";
import Testimonials from "@/components/testimonials";
import FAQs from "@/components/faqs";
import CTA from "@/components/cta";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#080a0f]">
      {/* Cinematic Hero Initialization */}
      <HeroSection />

      {/* Main Content Sections */}
      <section className="container mx-auto py-24 px-4 space-y-24">
        <Features />
        <HowItWorks />
        <Testimonials />
        <FAQs />
        <CTA />
      </section>

      {/* Scroll Hint Utility */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-40">
        <span className="text-[10px] uppercase tracking-widest font-syne text-white/70">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-white/50 to-transparent" />
      </div>
    </div>
  );
}
