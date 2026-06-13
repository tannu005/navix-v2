"use server";

import { db } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { generateAIInsights } from "./dashboard";

export async function updateUser(data) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Try to find user, if not found create them
  let user = await db.user.findUnique({ where: { clerkUserId: userId } });

  if (!user) {
    // Auto-create user if they don't exist yet
    const clerkUser = await currentUser();
    user = await db.user.create({
      data: {
        clerkUserId: userId,
        name: `${clerkUser?.firstName || ""} ${clerkUser?.lastName || ""}`.trim() || "User",
        imageUrl: clerkUser?.imageUrl || "",
        email: clerkUser?.emailAddresses[0]?.emailAddress || "",
      },
    });
  }

  try {
    const result = await db.$transaction(
      async (tx) => {
        let industryInsight = await tx.industryInsight.findUnique({
          where: { industry: data.industry },
        });

        if (!industryInsight) {
          try {
            const insights = await generateAIInsights(data.industry);
            industryInsight = await tx.industryInsight.create({
              data: {
                industry: data.industry,
                ...insights,
                nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
              },
            });
          } catch (aiError) {
            console.error("AI insights failed:", aiError.message);
            // Create with fallback data so onboarding never fails
            industryInsight = await tx.industryInsight.create({
              data: {
                industry: data.industry,
                salaryRanges: [
                  { role: "Junior", min: 400000, max: 700000, median: 550000, location: "India" },
                  { role: "Mid-level", min: 700000, max: 1200000, median: 950000, location: "India" },
                  { role: "Senior", min: 1200000, max: 2000000, median: 1600000, location: "India" },
                ],
                growthRate: 12,
                demandLevel: "High",
                topSkills: ["Communication", "Problem Solving", "Leadership", "Data Analysis", "Project Management"],
                marketOutlook: "Positive",
                keyTrends: ["AI adoption", "Remote work", "Upskilling", "Digital transformation", "Sustainability"],
                recommendedSkills: ["Python", "Data Analysis", "Cloud Computing", "AI/ML basics", "Agile"],
                nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
              },
            });
          }
        }

        const updatedUser = await tx.user.update({
          where: { id: user.id },
          data: {
            industry: data.industry,
            experience: data.experience,
            bio: data.bio,
            skills: data.skills,
          },
        });

        return { updatedUser, industryInsight };
      },
      { timeout: 15000 }
    );

    revalidatePath("/");
    return result.updatedUser;
  } catch (error) {
    console.error("Error updating user:", error.message);
    throw new Error("Failed to update profile: " + error.message);
  }
}

export async function getUserOnboardingStatus() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  try {
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      select: { industry: true },
    });
    return { isOnboarded: !!user?.industry };
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    throw new Error("Failed to check onboarding status");
  }
}