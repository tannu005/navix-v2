import { BrainCircuit, Briefcase, LineChart, ScrollText, Map, BarChart2, GraduationCap } from "lucide-react";

export const features = [
  {
    icon: <BrainCircuit className="h-10 w-10 mb-4 text-primary" />,
    title: "AI Career Agent",
    description: "Autonomous AI that plans multi-step strategies, uses research tools, and delivers personalised guidance — like a senior career coach on demand.",
  },
  {
    icon: <Map className="h-10 w-10 mb-4 text-primary" />,
    title: "Career Roadmap",
    description: "AI-generated week-by-week learning plan tailored to your skills and target role, complete with resources, projects, and milestones.",
  },
  {
    icon: <BarChart2 className="h-10 w-10 mb-4 text-primary" />,
    title: "Skill Gap Analyser",
    description: "Instantly compare your profile against any job. Get a match score, missing keywords, and a prioritised learning plan.",
  },
  {
    icon: <ScrollText className="h-10 w-10 mb-4 text-primary" />,
    title: "ATS Resume Builder",
    description: "Build ATS-optimised resumes with AI. Check your match score against any job description before you apply.",
  },
  {
    icon: <GraduationCap className="h-10 w-10 mb-4 text-primary" />,
    title: "Interview Prep",
    description: "AI-generated industry-specific questions with instant feedback, explanations, and personalised improvement tips.",
  },
  {
    icon: <LineChart className="h-10 w-10 mb-4 text-primary" />,
    title: "Industry Insights",
    description: "Weekly-refreshed salary data, in-demand skills, and market trends for your specific industry.",
  },
  {
    icon: <Briefcase className="h-10 w-10 mb-4 text-primary" />,
    title: "Job Tracker",
    description: "Track every application, interview, and offer in one place. Know your pipeline, offer rate, and next steps at a glance.",
  },
];
