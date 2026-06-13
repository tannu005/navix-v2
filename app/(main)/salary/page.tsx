import { getUserOnboardingStatus } from "@/actions/user";
import { redirect } from "next/navigation";
import SalaryClient from "./_components/salary-client";

export const metadata = { title: "Salary Intelligence" };

export default async function SalaryPage() {
  const { isOnboarded } = await getUserOnboardingStatus();
  if (!isOnboarded) redirect("/onboarding");
  return (
    <div className="container mx-auto px-4 pt-24 pb-12">
      <SalaryClient />
    </div>
  );
}
