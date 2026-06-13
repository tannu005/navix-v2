import { inngest } from "./client";
import { db } from "@/lib/prisma";
import { generateAIInsights } from "@/actions/dashboard";

export const generateIndustryInsights = inngest.createFunction(
  { id: "generate-industry-insights", name: "Generate Industry Insights" },
  { cron: "0 0 * * 0" }, // Every Sunday midnight
  async ({ step }) => {
    const users = await step.run("fetch-users", async () => {
      return await db.user.findMany({
        where: { industry: { not: null } },
        select: { industry: true },
        distinct: ["industry"],
      });
    });

    const results = await step.run("update-insights", async () => {
      const updates = [];
      for (const { industry } of users) {
        try {
          const insights = await generateAIInsights(industry);
          await db.industryInsight.upsert({
            where: { industry },
            update: {
              ...insights,
              lastUpdated: new Date(),
              nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
            create: {
              industry,
              ...insights,
              nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
          });
          updates.push({ industry, status: "success" });
        } catch (err) {
          updates.push({ industry, status: "error", error: err.message });
        }
      }
      return updates;
    });

    return { processed: results.length, results };
  }
);
