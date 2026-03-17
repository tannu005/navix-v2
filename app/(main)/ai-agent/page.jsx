import { getUserOnboardingStatus } from "@/actions/user";
import { redirect } from "next/navigation";
import AgentClient from "./_components/agent-client";

export const metadata = { title: "AI Career Agent" };

export default async function AgentPage() {
  const { isOnboarded } = await getUserOnboardingStatus();
  if (!isOnboarded) redirect("/onboarding");

  return (
    <div className="container mx-auto px-4 pt-24 pb-12 max-w-4xl">
      <AgentClient />
    </div>
  );
}
