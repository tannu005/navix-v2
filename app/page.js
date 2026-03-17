import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Brain, Zap, Target, Star } from "lucide-react";
import HeroSection from "@/components/hero";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { features } from "@/data/features";
import { testimonial } from "@/data/testimonial";
import { faqs } from "@/data/faqs";
import { howItWorks } from "@/data/howItWorks";

export default function LandingPage() {
  return (
    <>
      <div className="grid-background" />

      <HeroSection />

      {/* Agentic AI banner */}
      <section className="w-full py-6" style={{ background: "hsl(199 89% 60% / 0.04)", borderTop: "1px solid hsl(199 89% 60% / 0.12)", borderBottom: "1px solid hsl(199 89% 60% / 0.12)" }}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 text-center md:text-left">
            {[
              { icon: <Brain className="h-6 w-6" />, title: "Agentic AI Engine", sub: "Multi-step reasoning with tool calling" },
              { icon: <Zap className="h-6 w-6" />, title: "ReAct Loop Architecture", sub: "Plan → Act → Observe → Reflect" },
              { icon: <Target className="h-6 w-6" />, title: "Recruiter-Focused", sub: "Built around what top companies look for" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="p-2 rounded-lg" style={{ background: "hsl(199 89% 60% / 0.1)", color: "hsl(199, 89%, 60%)" }}>
                  {item.icon}
                </div>
                <div>
                  <p className="font-semibold text-sm">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="w-full py-16 md:py-28">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-14">
            <p className="text-sm font-medium mb-3 tracking-widest uppercase" style={{ color: "hsl(199, 89%, 60%)" }}>
              Features
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Everything You Need to Land Your Dream Role
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              8 AI-powered tools built for serious job seekers — all in one platform.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="card-hover border"
                style={{ background: "hsl(222, 18%, 8%)", borderColor: "hsl(222, 15%, 14%)" }}
              >
                <CardContent className="pt-6 text-center flex flex-col items-center gap-3">
                  <div className="p-3 rounded-xl" style={{ background: "hsl(199 89% 60% / 0.08)" }}>
                    {React.cloneElement(feature.icon, { className: "h-6 w-6", style: { color: "hsl(199, 89%, 60%)" } })}
                  </div>
                  <h3 className="text-base font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="w-full py-16" style={{ background: "hsl(222, 18%, 7%)", borderTop: "1px solid hsl(222, 15%, 12%)", borderBottom: "1px solid hsl(222, 15%, 12%)" }}>
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
            {[
              { value: "50+", label: "Industries Covered" },
              { value: "1000+", label: "Interview Questions" },
              { value: "8", label: "AI Tools" },
              { value: "24/7", label: "AI Support" },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center space-y-2">
                <h3 className="text-4xl font-bold stat-value">{stat.value}</h3>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="w-full py-16 md:py-28">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-sm font-medium mb-3 tracking-widest uppercase" style={{ color: "hsl(199, 89%, 60%)" }}>
              How It Works
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Four Steps to Accelerate Your Career</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto relative">
            {howItWorks.map((item, index) => (
              <div key={index} className="flex flex-col items-center text-center space-y-4">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center relative"
                  style={{ background: "hsl(199 89% 60% / 0.1)", border: "1px solid hsl(199 89% 60% / 0.2)" }}
                >
                  {React.cloneElement(item.icon, { style: { color: "hsl(199, 89%, 60%)" } })}
                  <span
                    className="absolute -top-2 -right-2 w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold"
                    style={{ background: "hsl(199, 89%, 48%)", color: "#fff" }}
                  >
                    {index + 1}
                  </span>
                </div>
                <h3 className="font-semibold text-base">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="w-full py-16 md:py-28" style={{ background: "hsl(222, 18%, 7%)" }}>
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-14">
            <p className="text-sm font-medium mb-3 tracking-widest uppercase" style={{ color: "hsl(199, 89%, 60%)" }}>
              Testimonials
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">What Our Users Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {testimonial.map((t, index) => (
              <Card
                key={index}
                className="card-hover"
                style={{ background: "hsl(222, 18%, 9%)", borderColor: "hsl(222, 15%, 14%)" }}
              >
                <CardContent className="pt-6 flex flex-col gap-5">
                  {/* Stars */}
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" style={{ color: "hsl(199, 89%, 60%)" }} />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed italic">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 mt-auto pt-3" style={{ borderTop: "1px solid hsl(222, 15%, 14%)" }}>
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                      style={{ background: "hsl(199 89% 60% / 0.15)", color: "hsl(199, 89%, 60%)" }}
                    >
                      {t.author[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{t.author}</p>
                      <p className="text-xs text-muted-foreground">{t.role} · <span style={{ color: "hsl(199, 89%, 60%)" }}>{t.company}</span></p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="w-full py-16 md:py-28">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-sm font-medium mb-3 tracking-widest uppercase" style={{ color: "hsl(199, 89%, 60%)" }}>
              FAQ
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Frequently Asked Questions</h2>
          </div>
          <div className="max-w-2xl mx-auto">
            <Accordion type="single" collapsible className="w-full space-y-2">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="rounded-xl px-4"
                  style={{ background: "hsl(222, 18%, 8%)", border: "1px solid hsl(222, 15%, 13%)" }}
                >
                  <AccordionTrigger className="text-left text-sm font-medium hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full px-4 pb-24">
        <div className="container mx-auto">
          <div className="gradient py-20 px-8">
            <div className="flex flex-col items-center justify-center space-y-6 text-center max-w-3xl mx-auto">
              <p className="text-sm font-medium tracking-widest uppercase" style={{ color: "hsl(199, 89%, 60%)" }}>
                Get Started Today
              </p>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-foreground">
                Ready to Accelerate Your Career?
              </h2>
              <p className="max-w-[560px] text-muted-foreground md:text-lg">
                Join professionals advancing their careers with AI-powered guidance.
              </p>
              <Link href="/dashboard" passHref>
                <Button
                  size="lg"
                  className="h-12 px-8 mt-2 text-base font-semibold btn-glow"
                  style={{ background: "hsl(199, 89%, 48%)", color: "#fff", border: "none" }}
                >
                  Start Your Journey <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
