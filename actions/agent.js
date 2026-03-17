"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { runAgent, runAgentStep, createAgentState } from "@/lib/agent";
import { model } from "@/lib/gemini";

async function getAuthUser() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  const user = await db.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) throw new Error("User not found");
  return user;
}

// Single step for streaming UI
export async function agentStep(serializedState) {
  await getAuthUser();
  const state = JSON.parse(serializedState);
  const nextState = await runAgentStep(state);
  return JSON.stringify(nextState);
}

// Init state for streaming
export async function initAgentState(goal) {
  const user = await getAuthUser();
  const userContext = {
    name: user.name,
    industry: user.industry,
    experience: user.experience,
    skills: user.skills,
    bio: user.bio,
  };
  const state = createAgentState(goal, userContext);
  return JSON.stringify(state);
}

// Full run (non-streaming)
export async function runCareerAgent(goal) {
  const user = await getAuthUser();
  const userContext = {
    name: user.name,
    industry: user.industry,
    experience: user.experience,
    skills: user.skills,
    bio: user.bio,
  };
  const finalState = await runAgent(goal, userContext, null);
  try {
    await db.agentSession.create({
      data: {
        userId: user.id,
        goal,
        steps: finalState.steps,
        toolCalls: finalState.toolCalls,
        observations: finalState.observations,
        finalAnswer: finalState.finalAnswer,
        iterations: finalState.iterations,
      },
    });
  } catch (e) {
    console.error("Failed to save agent session:", e.message);
  }
  return {
    answer: finalState.finalAnswer,
    steps: finalState.steps,
    toolCalls: finalState.toolCalls,
    observations: finalState.observations,
  };
}

// Career roadmap generator
export async function generateCareerRoadmap({ targetRole, timelineWeeks = 12 }) {
  const user = await getAuthUser();
  const prompt = `
    Create a detailed ${timelineWeeks}-week career roadmap for someone who wants to become a ${targetRole}.
    Current profile:
    - Industry: ${user.industry}
    - Experience: ${user.experience} years
    - Current skills: ${(user.skills || []).join(", ")}
    - Bio: ${user.bio || "Not provided"}
    Return ONLY valid JSON, no markdown:
    {
      "title": "string",
      "targetRole": "string",
      "currentLevel": "string",
      "estimatedSalaryRange": "string",
      "demandOutlook": "string",
      "phases": [
        {
          "phase": 1,
          "title": "string",
          "weeks": "string",
          "goal": "string",
          "skills": ["string"],
          "projects": ["string"],
          "milestones": ["string"],
          "resources": [{"name": "string", "type": "course|book|practice|community", "url": "string"}]
        }
      ],
      "keyInsights": ["string"],
      "recruiterTips": ["string"]
    }
  `;
  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```(?:json)?\n?/g, "").trim();
    return JSON.parse(text);
  } catch (error) {
    console.error("Roadmap generation failed:", error.message);
    throw new Error("Failed to generate roadmap. Try again.");
  }
}


// Skill gap analyser
export async function analyzeSkillGap({ targetRole, jobDescription }) {
  const user = await getAuthUser();
  const prompt = `
    Perform a detailed skill gap analysis.
    Current profile:
    - Skills: ${(user.skills || []).join(", ")}
    - Industry: ${user.industry}
    - Experience: ${user.experience} years
    Target Role: ${targetRole}
    Job Description: ${jobDescription || `A typical ${targetRole} role`}
    Return ONLY valid JSON, no markdown:
    {
      "overallMatch": 65,
      "verdict": "string",
      "strongSkills": [{"skill": "string", "level": "Expert|Strong|Proficient", "marketDemand": "High|Medium|Low"}],
      "skillGaps": [{"skill": "string", "priority": "Critical|High|Medium|Low", "learningTime": "string", "resources": ["string"]}],
      "quickWins": ["string"],
      "longTermGoals": ["string"],
      "recruiterReadinessScore": 70,
      "topKeywordsToAdd": ["string"]
    }
  `;
  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```(?:json)?\n?/g, "").trim();
    return JSON.parse(text);
  } catch (error) {
    console.error("Skill gap analysis failed:", error.message);
    throw new Error("Failed to analyse skill gap. Try again.");
  }
}


// LinkedIn optimizer
export async function optimizeLinkedIn({ targetRole }) {
  const user = await getAuthUser();
  const prompt = `
    Optimize this LinkedIn profile for a ${targetRole} role.
    Current profile:
    - Name: ${user.name}
    - Bio: ${user.bio || "None"}
    - Skills: ${(user.skills || []).join(", ")}
    - Industry: ${user.industry}
    - Experience: ${user.experience} years
    Return ONLY valid JSON, no markdown:
    {
      "headline": "string",
      "about": "string",
      "skillsToHighlight": ["string"],
      "skillsToAdd": ["string"],
      "keywordStrategy": "string",
      "contentIdeas": ["string"],
      "profileStrengthTips": ["string"],
      "connectionStrategy": "string"
    }
  `;
  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```(?:json)?\n?/g, "").trim();
    return JSON.parse(text);
  } catch (error) {
    console.error("LinkedIn optimisation failed:", error.message);
    throw new Error("Failed to optimise LinkedIn profile. Try again.");
  }
}


// Salary intelligence
export async function getSalaryIntelligence({ targetRole, location = "India" }) {
  const user = await getAuthUser();
  const prompt = `
    Provide comprehensive salary intelligence for ${targetRole} in ${location}.
    Candidate: ${user.experience} years experience, skills: ${(user.skills || []).join(", ")}
    Return ONLY valid JSON, no markdown:
    {
      "role": "string",
      "location": "string",
      "fresher": "string",
      "midLevel": "string",
      "senior": "string",
      "lead": "string",
      "estimatedForUser": "string",
      "topPayingCompanies": ["string"],
      "salaryBoostSkills": ["string"],
      "negotiationScript": "string",
      "benefitsToNegotiate": ["string"],
      "marketTrend": "string",
      "insights": ["string"]
    }
  `;
  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```(?:json)?\n?/g, "").trim();
    return JSON.parse(text);
  } catch (error) {
    console.error("Salary intelligence failed:", error.message);
    throw new Error("Failed to fetch salary data. Try again.");
  }
}

// Get previous sessions
export async function getAgentSessions() {
  const user = await getAuthUser();
  return await db.agentSession.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 10,
  });
}
