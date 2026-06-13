import { getCoverLetters } from "@/actions/cover-letter";
import { getUserOnboardingStatus } from "@/actions/user";
import { redirect } from "next/navigation";
import CoverLetterClient from "./_components/cover-letter-client";

export const metadata = { title: "AI Cover Letter" };

export default async function CoverLetterPage() {
  const { isOnboarded } = await getUserOnboardingStatus();
  if (!isOnboarded) redirect("/onboarding");

  const letters = await getCoverLetters();

  return (
    <div className="container mx-auto px-4 pt-24 pb-12">
      <CoverLetterClient letters={letters} />
    </div>
  );
}
