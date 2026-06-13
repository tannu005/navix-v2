import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";

export const dynamic = "force-dynamic";
import { generateIndustryInsights } from "@/lib/inngest/functions";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [generateIndustryInsights],
});
