"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { model } from "@/lib/gemini";
import { revalidatePath } from "next/cache";

export async function saveResume(content) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) throw new Error("User not found");

  try {
    const resume = await db.resume.upsert({
      where: { userId: user.id },
      update: { content },
      create: { userId: user.id, content },
    });
    revalidatePath("/resume");
    return resume;
  } catch (error) {
    console.error("Error saving resume:", error);
    throw new Error("Failed to save resume");
  }
}

export async function getResume() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) throw new Error("User not found");

  return await db.resume.findUnique({ where: { userId: user.id } });
}

export async function improveWithAI({ current, type }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: { industryInsight: true },
  });
  if (!user) throw new Error("User not found");

  const prompt = `
    As an expert resume writer, improve the following ${type} description for a ${user.industry} professional.
    Make it more impactful, quantifiable, and aligned with industry standards.
    Current content: "${current}"
    Requirements:
    1. Use strong action verbs
    2. Include metrics and results where possible
    3. Highlight relevant technical skills
    4. Keep it concise but detailed
    5. Focus on achievements over responsibilities
    6. Use industry-specific keywords
    Format the response as a single paragraph without any extra text or explanation.
  `;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error("Error improving content:", error);
    throw new Error("Failed to improve content");
  }
}

// NEW: ATS score checker — not in tutorial
export async function checkATSScore({ resumeContent, jobDescription }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const prompt = `
    You are an ATS (Applicant Tracking System) expert. Analyze this resume against the job description.
    Resume: ${resumeContent}
    Job Description: ${jobDescription}
    Return ONLY valid JSON, no markdown:
    {
      "score": number between 0-100,
      "matchedKeywords": ["keyword1", "keyword2"],
      "missingKeywords": ["keyword1", "keyword2"],
      "suggestions": ["suggestion1", "suggestion2"],
      "summary": "2-3 sentence summary of fit"
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```(?:json)?\n?/g, "").trim();
    return JSON.parse(text);
  } catch (error) {
    console.error("Error checking ATS score:", error);
    throw new Error("Failed to analyze resume");
  }
}
