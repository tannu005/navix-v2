import CinematicHero from "@/components/CinematicHero";
import Features from "@/components/features";
import HowItWorks from "@/components/how-it-works";
import Testimonials from "@/components/testimonials";
import FAQs from "@/components/faqs";
import CTA from "@/components/cta";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* The new Cinematic Hero replaces the old Hero component */}
      <CinematicHero />

      {/* Original Navix content remains below */}
      <section className="container mx-auto py-24 px-4">
        <Features />
        <HowItWorks />
        <Testimonials />
        <FAQs />
        <CTA />
      </section>

      {/* Optional Noise Overlay for texture  */}
      <div className="fixed inset-0 pointer-events-none z-[1002] opacity-[0.03] bg-[url('https://www.paulrogerdev.fr/codepen/noise.png')]" />
    </div>
  );
}
