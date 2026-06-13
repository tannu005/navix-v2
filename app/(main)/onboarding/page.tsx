import { redirect } from "next/navigation";
import { getUserOnboardingStatus } from "@/actions/user";
import OnboardingForm from "./_components/onboarding-form";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export default async function OnboardingPage({ searchParams }) {
  const searchParamsAwaited = await searchParams;
  const { isOnboarded } = await getUserOnboardingStatus();
  
  if (isOnboarded && searchParamsAwaited.edit !== "true") {
    redirect("/dashboard");
  }

  let user = null;
  if (isOnboarded) {
    const { userId } = await auth();
    user = await db.user.findUnique({ where: { clerkUserId: userId } });
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 pt-20">
      <OnboardingForm initialData={user} />
    </main>
  );
}
