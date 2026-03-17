import { getUserOnboardingStatus } from "@/actions/user";
import { redirect } from "next/navigation";
import RoadmapClient from "./_components/roadmap-client";

export const metadata = { title: "Career Roadmap" };

export default async function CareerRoadmapPage() {
  const { isOnboarded } = await getUserOnboardingStatus();
  if (!isOnboarded) redirect("/onboarding");
  return (
    <div className="container mx-auto px-4 pt-24 pb-12">
      <RoadmapClient />
    </div>
  );
}
