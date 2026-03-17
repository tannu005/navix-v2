import { UserPlus, FileEdit, Users, Trophy } from "lucide-react";

export const howItWorks = [
  {
    title: "Create Your Profile",
    description:
      "Sign up and tell us about your industry, experience level, and skills during a quick onboarding.",
    icon: <UserPlus className="w-6 h-6 text-primary" />,
  },
  {
    title: "Get AI Insights",
    description:
      "Receive personalised industry insights, salary data, and skill recommendations tailored to your field.",
    icon: <FileEdit className="w-6 h-6 text-primary" />,
  },
  {
    title: "Practice & Build",
    description:
      "Take AI-generated interview quizzes, build your resume with AI feedback, and generate cover letters in seconds.",
    icon: <Users className="w-6 h-6 text-primary" />,
  },
  {
    title: "Track & Win",
    description:
      "Manage your entire job search in the Job Tracker and land your dream role with data-backed confidence.",
    icon: <Trophy className="w-6 h-6 text-primary" />,
  },
];
