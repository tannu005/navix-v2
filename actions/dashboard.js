"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { model } from "@/lib/gemini";

export const generateAIInsights = async (industry) => {
  const prompt = `
    Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
    {
      "salaryRanges": [
        { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
      ],
      "growthRate": number,
      "demandLevel": "High" | "Medium" | "Low",
      "topSkills": ["skill1", "skill2"],
      "marketOutlook": "Positive" | "Neutral" | "Negative",
      "keyTrends": ["trend1", "trend2"],
      "recommendedSkills": ["skill1", "skill2"]
    }
    IMPORTANT: Return ONLY the JSON. No markdown, no extra text.
    Include at least 5 roles for salaryRanges. growthRate is a percentage number. Include at least 5 skills and trends.
  `;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```(?:json)?\n?/g, "").trim();
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini failed, using fallback:", error.message);
    return {
      salaryRanges: [
        { role: "Junior", min: 400000, max: 700000, median: 550000, location: "India" },
        { role: "Mid-level", min: 700000, max: 1200000, median: 950000, location: "India" },
        { role: "Senior", min: 1200000, max: 2000000, median: 1600000, location: "India" },
        { role: "Lead", min: 1800000, max: 3000000, median: 2400000, location: "India" },
        { role: "Manager", min: 2000000, max: 4000000, median: 3000000, location: "India" },
      ],
      growthRate: 12,
      demandLevel: "High",
      topSkills: ["Communication", "Problem Solving", "Leadership", "Data Analysis", "Project Management"],
      marketOutlook: "Positive",
      keyTrends: ["AI adoption", "Remote work", "Upskilling", "Digital transformation", "Sustainability"],
      recommendedSkills: ["Python", "Data Analysis", "Cloud Computing", "AI/ML basics", "Agile"],
    };
  }
};

export async function getIndustryInsights() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: { industryInsight: true },
  });
  if (!user) throw new Error("User not found");

  if (!user.industryInsight) {
    const insights = await generateAIInsights(user.industry);
    return await db.industryInsight.create({
      data: {
        industry: user.industry,
        ...insights,
        nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
  }

  // IMPROVED: actually refresh when stale (tutorial never did this)
  if (user.industryInsight.nextUpdate < new Date()) {
    const insights = await generateAIInsights(user.industry);
    return await db.industryInsight.update({
      where: { industry: user.industry },
      data: {
        ...insights,
        lastUpdated: new Date(),
        nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
  }

  return user.industryInsight;
}
