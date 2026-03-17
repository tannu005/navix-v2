import { redirect } from "next/navigation";
import { getUserOnboardingStatus } from "@/actions/user";
import OnboardingForm from "./_components/onboarding-form";

export default async function OnboardingPage() {
  const { isOnboarded } = await getUserOnboardingStatus();
  if (isOnboarded) redirect("/dashboard");

  return (
    <main className="min-h-screen flex items-center justify-center px-4 pt-20">
      <OnboardingForm />
    </main>
  );
}
