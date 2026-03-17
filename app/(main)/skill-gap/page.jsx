import { getUserOnboardingStatus } from "@/actions/user";
import { redirect } from "next/navigation";
import SkillGapClient from "./_components/skill-gap-client";

export const metadata = { title: "Skill Gap Analyser" };

export default async function SkillGapPage() {
  const { isOnboarded } = await getUserOnboardingStatus();
  if (!isOnboarded) redirect("/onboarding");
  return (
    <div className="container mx-auto px-4 pt-24 pb-12">
      <SkillGapClient />
    </div>
  );
}
