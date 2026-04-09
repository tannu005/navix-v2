import Hero from "@/components/hero";
import Features from "@/components/features";
import HowItWorks from "@/components/how-it-works";
import Testimonials from "@/components/testimonials";
import FAQs from "@/components/faqs";
import CTA from "@/components/cta";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050507] text-white overflow-x-hidden">
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <FAQs />
      <CTA />
    </main>
  );
}
