import { getResume } from "@/actions/resume";
import { getUserOnboardingStatus } from "@/actions/user";
import { redirect } from "next/navigation";
import ResumeBuilder from "./_components/resume-builder";

export const metadata = { title: "Resume Builder" };

export default async function ResumePage() {
  const { isOnboarded } = await getUserOnboardingStatus();
  if (!isOnboarded) redirect("/onboarding");

  const resume = await getResume();

  return (
    <div className="container mx-auto px-4 pt-24 pb-12">
      <ResumeBuilder initialContent={resume?.content || ""} />
    </div>
  );
}
