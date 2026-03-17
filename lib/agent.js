/**
 * NAVIX AGENTIC AI ENGINE
 * ========================
 * Multi-step autonomous agent that plans, executes, reflects, and iterates.
 * Uses a ReAct (Reasoning + Acting) loop with tool-calling.
 *
 * Skills demonstrated to recruiters:
 * - Agentic AI / LLM orchestration
 * - Tool-use / function-calling patterns
 * - Multi-step reasoning chains
 * - State machine design
 * - Async orchestration
 */

import { model } from "@/lib/gemini";

// ─── Tool Registry ────────────────────────────────────────────────────────────
// Each tool the agent can call. In production these would hit real APIs.

export const AGENT_TOOLS = {
  analyze_resume: {
    name: "analyze_resume",
    description: "Analyze a resume for strengths, weaknesses, ATS score, and missing keywords",
    params: ["resumeContent", "targetRole"],
  },
  search_job_market: {
    name: "search_job_market",
    description: "Research current job market demand for a role/skill in an industry",
    params: ["role", "industry", "location"],
  },
  generate_learning_path: {
    name: "generate_learning_path",
    description: "Create a personalized step-by-step skill learning roadmap",
    params: ["currentSkills", "targetRole", "timeframeWeeks"],
  },
  evaluate_skill_gap: {
    name: "evaluate_skill_gap",
    description: "Compare user skills against job requirements and identify gaps",
    params: ["userSkills", "jobRequirements"],
  },
  generate_interview_questions: {
    name: "generate_interview_questions",
    description: "Generate targeted interview questions for a specific role and skill level",
    params: ["role", "skills", "difficulty"],
  },
  write_cover_letter: {
    name: "write_cover_letter",
    description: "Write a tailored cover letter for a specific job application",
    params: ["jobTitle", "company", "jobDescription", "userBackground"],
  },
  salary_negotiation_advice: {
    name: "salary_negotiation_advice",
    description: "Provide data-backed salary negotiation strategy",
    params: ["role", "industry", "experience", "location"],
  },
  optimize_linkedin: {
    name: "optimize_linkedin",
    description: "Suggest LinkedIn profile optimizations for a target role",
    params: ["currentBio", "targetRole", "skills"],
  },
};

// ─── Agent State ──────────────────────────────────────────────────────────────

export function createAgentState(goal, userContext) {
  return {
    goal,
    userContext,
    steps: [],           // completed reasoning steps
    toolCalls: [],       // tools called so far
    observations: [],    // tool results
    finalAnswer: null,
    status: "thinking",  // thinking | acting | reflecting | done | error
    iterations: 0,
    maxIterations: 8,
  };
}

// ─── Core ReAct Loop ──────────────────────────────────────────────────────────

export async function runAgentStep(state) {
  if (state.iterations >= state.maxIterations) {
    return { ...state, status: "done", finalAnswer: synthesizeFinalAnswer(state) };
  }

  const prompt = buildReActPrompt(state);

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    const parsed = parseAgentResponse(text);

    if (parsed.type === "tool_call") {
      const observation = await executeTool(parsed.tool, parsed.params, state.userContext);
      return {
        ...state,
        status: "reflecting",
        iterations: state.iterations + 1,
        steps: [...state.steps, { type: "thought", content: parsed.thought }],
        toolCalls: [...state.toolCalls, { tool: parsed.tool, params: parsed.params }],
        observations: [...state.observations, { tool: parsed.tool, result: observation }],
      };
    }

    if (parsed.type === "final_answer") {
      return {
        ...state,
        status: "done",
        iterations: state.iterations + 1,
        steps: [...state.steps, { type: "thought", content: parsed.thought }],
        finalAnswer: parsed.answer,
      };
    }

    // Fallback — continue thinking
    return {
      ...state,
      status: "thinking",
      iterations: state.iterations + 1,
      steps: [...state.steps, { type: "thought", content: text }],
    };
  } catch (err) {
    return { ...state, status: "error", finalAnswer: `Agent error: ${err.message}` };
  }
}

// Run the full agent loop and stream steps via callback
export async function runAgent(goal, userContext, onStep) {
  let state = createAgentState(goal, userContext);

  while (state.status !== "done" && state.status !== "error") {
    state = await runAgentStep(state);
    if (onStep) onStep(state);
  }

  return state;
}

// ─── Prompt Builder ───────────────────────────────────────────────────────────

function buildReActPrompt(state) {
  const toolList = Object.values(AGENT_TOOLS)
    .map((t) => `- ${t.name}(${t.params.join(", ")}): ${t.description}`)
    .join("\n");

  const history = state.steps
    .map((s, i) => `Step ${i + 1} [${s.type}]: ${s.content}`)
    .join("\n");

  const observations = state.observations
    .map((o, i) => `Observation ${i + 1} from ${o.tool}:\n${JSON.stringify(o.result, null, 2)}`)
    .join("\n");

  return `You are Navix AI, an expert career coach agent. You help users advance their careers through autonomous multi-step reasoning and action.

USER PROFILE:
${JSON.stringify(state.userContext, null, 2)}

GOAL: ${state.goal}

AVAILABLE TOOLS:
${toolList}

PREVIOUS STEPS:
${history || "None yet"}

PREVIOUS OBSERVATIONS:
${observations || "None yet"}

INSTRUCTIONS:
Think step by step. You can either:
1. Call a tool to gather information or take action
2. Give a final answer when you have enough information

Respond in EXACTLY one of these two formats:

FORMAT A - Tool Call:
THOUGHT: <your reasoning about what to do next>
ACTION: <tool_name>
PARAMS: <JSON object with the required params>

FORMAT B - Final Answer:
THOUGHT: <your final reasoning>
FINAL_ANSWER: <comprehensive, actionable response for the user>

Now respond:`;
}

// ─── Response Parser ──────────────────────────────────────────────────────────

function parseAgentResponse(text) {
  const thoughtMatch = text.match(/THOUGHT:\s*([\s\S]*?)(?=ACTION:|FINAL_ANSWER:|$)/i);
  const actionMatch = text.match(/ACTION:\s*(\w+)/i);
  const paramsMatch = text.match(/PARAMS:\s*(\{[\s\S]*?\})/i);
  const finalMatch = text.match(/FINAL_ANSWER:\s*([\s\S]+)/i);

  const thought = thoughtMatch ? thoughtMatch[1].trim() : text.substring(0, 200);

  if (finalMatch) {
    return { type: "final_answer", thought, answer: finalMatch[1].trim() };
  }

  if (actionMatch) {
    let params = {};
    if (paramsMatch) {
      try { params = JSON.parse(paramsMatch[1]); } catch { params = {}; }
    }
    return { type: "tool_call", thought, tool: actionMatch[1].trim(), params };
  }

  return { type: "final_answer", thought, answer: text };
}

// ─── Tool Executor ────────────────────────────────────────────────────────────

async function executeTool(toolName, params, userContext) {
  // Each tool calls Gemini with a focused prompt
  const toolPrompts = {
    analyze_resume: () => `
      Analyze this resume for a ${params.targetRole} role. Be specific and actionable.
      Resume: ${params.resumeContent || "Not provided"}
      Return JSON: { atsScore: number, strengths: string[], weaknesses: string[], missingKeywords: string[], topSuggestion: string }
    `,
    search_job_market: () => `
      Research the 2025 job market for ${params.role} in ${params.industry}.
      Return JSON: { demandLevel: "High|Medium|Low", avgSalaryINR: string, topSkillsRequired: string[], hiringCompanies: string[], growthOutlook: string }
    `,
    generate_learning_path: () => `
      Create a ${params.timeframeWeeks}-week learning roadmap for someone with skills [${(params.currentSkills || []).join(", ")}] targeting ${params.targetRole}.
      Return JSON: { weeks: [{ week: number, focus: string, resources: string[], milestone: string }], totalHours: number }
    `,
    evaluate_skill_gap: () => `
      Compare these user skills: [${(params.userSkills || []).join(", ")}]
      Against job requirements: ${params.jobRequirements}
      Return JSON: { matchScore: number, matched: string[], missing: string[], priority: string[], verdict: string }
    `,
    generate_interview_questions: () => `
      Generate 5 targeted ${params.difficulty || "medium"} interview questions for ${params.role} focusing on ${(params.skills || []).join(", ")}.
      Return JSON: { questions: [{ question: string, type: "technical|behavioral|situational", hint: string }] }
    `,
    write_cover_letter: () => `
      Write a compelling cover letter for ${params.jobTitle} at ${params.company}.
      Job: ${params.jobDescription}
      Candidate: ${params.userBackground}
      Return JSON: { coverLetter: string, keyHighlights: string[] }
    `,
    salary_negotiation_advice: () => `
      Provide salary negotiation advice for ${params.role} with ${params.experience} years experience in ${params.industry}, ${params.location}.
      Return JSON: { marketRange: string, askFor: string, tactics: string[], scripts: string[], redFlags: string[] }
    `,
    optimize_linkedin: () => `
      Suggest LinkedIn optimizations for targeting ${params.targetRole}.
      Current bio: ${params.currentBio}
      Skills: ${(params.skills || []).join(", ")}
      Return JSON: { headlineSuggestion: string, bioRewrite: string, skillsToAdd: string[], keywordStrategy: string }
    `,
  };

  const promptFn = toolPrompts[toolName];
  if (!promptFn) return { error: `Unknown tool: ${toolName}` };

  try {
    const result = await model.generateContent(
      promptFn() + "\n\nReturn ONLY valid JSON. No markdown, no extra text."
    );
    const text = result.response.text().replace(/```(?:json)?\n?/g, "").trim();
    return JSON.parse(text);
  } catch (err) {
    return { error: err.message, raw: "Tool execution failed" };
  }
}

// ─── Synthesis ────────────────────────────────────────────────────────────────

function synthesizeFinalAnswer(state) {
  const observations = state.observations
    .map((o) => `${o.tool}: ${JSON.stringify(o.result)}`)
    .join("\n");

  return `Based on my research:\n\n${observations}\n\nHere's my comprehensive recommendation for your goal: "${state.goal}"`;
}
