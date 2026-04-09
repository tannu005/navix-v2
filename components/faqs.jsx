"use client";

import { useEffect, useRef, useState } from "react";

const FAQS = [
  {
    question: "How does the AI interview preparation work?",
    answer:
      "Our AI analyzes your industry and skills to generate relevant technical and behavioral interview questions. After you complete a quiz, you get detailed feedback, correct answers with explanations, and personalized tips to improve weak areas.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes. We use Clerk for authentication and all data is encrypted in transit and at rest. We never share your personal information or resume data with third parties.",
  },
  {
    question: "How often are the industry insights updated?",
    answer:
      "Industry insights are refreshed weekly using AI to ensure you have the most current salary data, skill demands, and market trends for your specific field.",
  },
  {
    question: "Can I use Navix to track multiple job applications?",
    answer:
      "Absolutely. The Job Tracker lets you manage your entire application pipeline — from first application through offers — with status tracking, interview scheduling, notes, and salary information all in one place.",
  },
  {
    question: "How does the ATS resume checker work?",
    answer:
      "Paste a job description alongside your resume and our AI scores how well your resume matches the role. You get a match percentage, matched keywords, missing keywords, and specific suggestions to improve your chances of passing ATS filters.",
  },
  {
    question: "Is Navix free to use?",
    answer:
      "Yes — sign up with your email or Google account and get full access to all features including interview prep, resume builder, cover letter generator, and job tracker.",
  },
];

function useInView(ref) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return visible;
}

function FAQItem({ faq, index }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const visible = useInView(ref);

  return (
    <div
      ref={ref}
      className="border-b border-white/[0.06] last:border-0 reveal"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.6s cubic-bezier(0.16,1,0.3,1) ${index * 0.07}s, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${index * 0.07}s`,
      }}
    >
      <button
        className="w-full flex items-start justify-between gap-6 py-7 text-left group"
        onClick={() => setOpen(!open)}
      >
        <span
          className="text-sm text-white/50 group-hover:text-white/80 transition-colors duration-400 leading-relaxed"
          style={{ transition: "color 0.3s" }}
        >
          {faq.question}
        </span>
        <span
          className="flex-shrink-0 w-5 h-5 flex items-center justify-center text-white/20 group-hover:text-white/40 transition-all duration-300 mt-0.5"
          style={{
            transform: open ? "rotate(45deg)" : "rotate(0deg)",
            transition:
              "transform 0.3s cubic-bezier(0.16,1,0.3,1), color 0.3s",
          }}
        >
          +
        </span>
      </button>

      <div
        style={{
          maxHeight: open ? "200px" : "0",
          overflow: "hidden",
          transition:
            "max-height 0.4s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <p className="text-white/25 text-sm leading-relaxed pb-7 max-w-xl">
          {faq.answer}
        </p>
      </div>
    </div>
  );
}

export default function FAQs() {
  const headRef = useRef(null);
  const headVisible = useInView(headRef);

  return (
    <section className="py-32 px-6 border-t border-white/[0.04]">
      <div className="max-w-4xl mx-auto">
        {/* Stats Section */}
        <h2 className="text-3xl font-bold mb-10 text-center">Our Impact</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 reveal">
          <div className="text-center">
            <p className="text-4xl font-bold">10k+</p>
            <p className="text-muted-foreground">Resumes Built</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold">5k+</p>
            <p className="text-muted-foreground">Interviews Prepped</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold">3k+</p>
            <p className="text-muted-foreground">Cover Letters Generated</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold">2k+</p>
            <p className="text-muted-foreground">Job Offers Secured</p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-20 mt-20">
          {/* Heading */}
          <div
            ref={headRef}
            style={{
              opacity: headVisible ? 1 : 0,
              transform: headVisible ? "translateY(0)" : "translateY(30px)",
              transition:
                "opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)",
            }}
            className="md:sticky md:top-32 md:self-start reveal"
          >
            <p className="text-xs tracking-[0.4em] text-white/20 uppercase mb-4">
              Questions
            </p>
            <h2
              className="text-5xl font-medium text-white/80"
              style={{
                fontFamily: "'Georgia', serif",
                letterSpacing: "-0.03em",
              }}
            >
              Common<br />
              <span className="text-white/30">queries.</span>
            </h2>
          </div>

          {/* FAQ List */}
          <div>
            {FAQS.map((faq, i) => (
              <FAQItem key={i} faq={faq} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
