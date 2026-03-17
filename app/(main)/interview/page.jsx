import { getAssessments } from "@/actions/interview";
import { getUserOnboardingStatus } from "@/actions/user";
import { redirect } from "next/navigation";
import InterviewClient from "./_components/interview-client";

export const metadata = { title: "Interview Prep" };

export default async function InterviewPage() {
  const { isOnboarded } = await getUserOnboardingStatus();
  if (!isOnboarded) redirect("/onboarding");

  const assessments = await getAssessments();

  return (
    <div className="container mx-auto px-4 pt-24 pb-12">
      <InterviewClient assessments={assessments} />
    </div>
  );
}
