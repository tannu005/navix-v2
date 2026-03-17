import { redirect } from "next/navigation";
import { getIndustryInsights } from "@/actions/dashboard";
import { getUserOnboardingStatus } from "@/actions/user";
import DashboardView from "./_components/dashboard-view";

export const metadata = { title: "Industry Insights" };

export default async function DashboardPage() {
  const { isOnboarded } = await getUserOnboardingStatus();
  if (!isOnboarded) redirect("/onboarding");

  const insights = await getIndustryInsights();

  return (
    <div className="container mx-auto px-4 pt-24 pb-12">
      <DashboardView insights={insights} />
    </div>
  );
}
