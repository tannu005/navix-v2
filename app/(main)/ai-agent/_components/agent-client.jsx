"use client";

import { useState } from "react";
import { initAgentState, agentStep } from "@/actions/agent";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Brain, Zap, Search, Wrench, CheckCircle2,
  ChevronDown, ChevronRight, Loader2, Sparkles, Send,
  BookOpen, Target, Clock, Award, TrendingUp, Star,
  AlertCircle, Users, Briefcase, FileText
} from "lucide-react";
import ReactMarkdown from "react-markdown";

// Suggested goals tailored to recruiter-relevant skills
const SUGGESTED_GOALS = [
  "Analyze my profile and tell me what I need to land a Senior Frontend Engineer role at a FAANG company",
  "What's the best 3-month plan to transition from my current role into Data Science?",
  "Review my skills and create a salary negotiation strategy for my next job offer",
  "Find the biggest gaps in my profile for a Product Manager role and how to fix them",
  "Build me a complete LinkedIn optimization plan for a Cloud Engineer role",
  "What are the top 5 things I should do this week to accelerate my career?",
];

const STATUS_ICONS = {
  thinking: <Brain className="h-4 w-4 text-blue-400 animate-pulse" />,
  acting: <Wrench className="h-4 w-4 text-yellow-400 animate-spin" />,
  reflecting: <Search className="h-4 w-4 text-purple-400 animate-pulse" />,
  done: <CheckCircle2 className="h-4 w-4 text-green-400" />,
  error: <Zap className="h-4 w-4 text-red-400" />,
};

const STATUS_LABELS = {
  thinking: "Thinking...",
  acting: "Using tools...",
  reflecting: "Reflecting on results...",
  done: "Complete",
  error: "Error",
};

export default function AgentClient() {
  const [goal, setGoal] = useState("");
  const [running, setRunning] = useState(false);
  const [steps, setSteps] = useState([]);
  const [toolCalls, setToolCalls] = useState([]);
  const [observations, setObservations] = useState([]);
  const [finalAnswer, setFinalAnswer] = useState(null);
  const [currentStatus, setCurrentStatus] = useState(null);
  const [expandedSteps, setExpandedSteps] = useState(true);

  async function handleRun() {
    if (!goal.trim() || running) return;

    setRunning(true);
    setSteps([]);
    setToolCalls([]);
    setObservations([]);
    setFinalAnswer(null);
    setCurrentStatus("thinking");

    try {
      // Get initial state from server
      let serialized = await initAgentState(goal);

      // Stream the ReAct loop step by step
      let iterations = 0;
      const maxIter = 8;

      while (iterations < maxIter) {
        const nextSerialized = await agentStep(serialized);
        const state = JSON.parse(nextSerialized);
        serialized = nextSerialized;

        setCurrentStatus(state.status);
        setSteps([...state.steps]);
        setToolCalls([...state.toolCalls]);
        setObservations([...state.observations]);

        if (state.status === "done" || state.status === "error") {
          setFinalAnswer(state.finalAnswer);
          break;
        }

        iterations++;
        // Small delay so UI can render each step
        await new Promise((r) => setTimeout(r, 200));
      }
    } catch (err) {
      setFinalAnswer(`Something went wrong: ${err.message}`);
      setCurrentStatus("error");
    } finally {
      setRunning(false);
    }
  }

  function reset() {
    setGoal("");
    setSteps([]);
    setToolCalls([]);
    setObservations([]);
    setFinalAnswer(null);
    setCurrentStatus(null);
  }

  const hasActivity = steps.length > 0 || running;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Brain className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold gradient-title">AI Career Agent</h1>
            <p className="text-muted-foreground text-sm">
              Autonomous multi-step AI that plans, researches, and delivers career advice
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="outline" className="text-xs gap-1">
            <Zap className="h-3 w-3" /> ReAct Loop
          </Badge>
          <Badge variant="outline" className="text-xs gap-1">
            <Search className="h-3 w-3" /> Tool Calling
          </Badge>
          <Badge variant="outline" className="text-xs gap-1">
            <Brain className="h-3 w-3" /> Multi-step Reasoning
          </Badge>
          <Badge variant="outline" className="text-xs gap-1">
            <Sparkles className="h-3 w-3" /> Powered by Groq · Agentic AI
          </Badge>
        </div>
      </div>

      {/* Goal Input */}
      {!hasActivity && (
        <div className="space-y-4">
          <div className="relative">
            <textarea
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.metaKey) handleRun();
              }}
              placeholder="Ask anything about your career... The agent will plan and research autonomously."
              rows={3}
              className="w-full rounded-xl border border-input bg-background px-4 py-3 pr-14 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
            />
            <Button
              onClick={handleRun}
              disabled={!goal.trim() || running}
              size="icon"
              className="absolute right-3 bottom-3 h-8 w-8"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">⌘ + Enter to run</p>

          {/* Suggested goals */}
          <div>
            <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">
              Suggested goals
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {SUGGESTED_GOALS.map((g, i) => (
                <button
                  key={i}
                  onClick={() => setGoal(g)}
                  className="text-left text-xs p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors text-muted-foreground hover:text-foreground"
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Active goal banner */}
      {hasActivity && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              {currentStatus && STATUS_ICONS[currentStatus]}
              <span className="font-medium">{goal}</span>
            </div>
            {!running && (
              <Button variant="ghost" size="sm" onClick={reset} className="text-xs h-7">
                New Goal
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Agent Reasoning Steps */}
      {steps.length > 0 && (
        <Card>
          <CardHeader
            className="pb-3 cursor-pointer"
            onClick={() => setExpandedSteps(!expandedSteps)}
          >
            <CardTitle className="text-sm flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-primary" />
                Agent Reasoning ({steps.length} step{steps.length !== 1 ? "s" : ""})
                {running && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
              </div>
              {expandedSteps ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </CardTitle>
          </CardHeader>
          {expandedSteps && (
            <CardContent className="space-y-3 pt-0">
              {steps.map((step, i) => (
                <div key={i} className="flex gap-3">
                  <div className="mt-1 flex-shrink-0">
                    <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-xs text-primary font-medium">{i + 1}</span>
                    </div>
                  </div>
                  <div className="flex-1 text-xs text-muted-foreground leading-relaxed border-l border-border pl-3">
                    {step.content}
                  </div>
                </div>
              ))}
              {running && (
                <div className="flex gap-3">
                  <div className="mt-1 flex-shrink-0">
                    <div className="h-5 w-5 rounded-full bg-muted animate-pulse" />
                  </div>
                  <div className="flex-1 text-xs text-muted-foreground border-l border-border pl-3 italic">
                    {STATUS_LABELS[currentStatus] || "Processing..."}
                  </div>
                </div>
              )}
            </CardContent>
          )}
        </Card>
      )}

      {/* Tool Calls */}
      {toolCalls.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Wrench className="h-4 w-4 text-yellow-400" />
              Tools Used ({toolCalls.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2 pt-0">
            {toolCalls.map((tc, i) => (
              <Badge key={i} variant="secondary" className="text-xs gap-1 font-mono">
                <Zap className="h-3 w-3" />
                {tc.tool}
              </Badge>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Observations (tool results) */}
      {observations.length > 0 && (
        <div className="space-y-3">
          {observations.map((obs, i) => (
            <Card key={i} className="border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs text-muted-foreground flex items-center gap-2">
                  <Search className="h-3 w-3" />
                  Result from <span className="font-mono text-primary">{obs.tool}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ObservationView tool={obs.tool} data={obs.result} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Final Answer */}
      {finalAnswer && (
        <Card className="border-green-500/30 bg-green-500/5">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-400" />
              Agent Response
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-invert prose-sm max-w-none prose-p:text-muted-foreground prose-li:text-muted-foreground prose-headings:text-foreground">
              <ReactMarkdown>{finalAnswer}</ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SPECIALIZED TOOL RESULT RENDERERS
   ═══════════════════════════════════════════════════════════════ */

// ─── Learning Path View ─── Beautiful week-by-week timeline
function LearningPathView({ data }) {
  if (!data) return null;

  const weeks = data.weeks || [];
  const totalHours = data.totalHours;

  return (
    <div className="space-y-4">
      {/* Summary header */}
      {totalHours && (
        <div className="flex items-center gap-3 mb-4 p-3 rounded-lg bg-primary/5 border border-primary/20">
          <Clock className="h-4 w-4 text-primary flex-shrink-0" />
          <span className="text-sm text-foreground">
            <strong>{weeks.length}-Week Plan</strong>
            <span className="text-muted-foreground"> · {totalHours} total hours</span>
          </span>
        </div>
      )}

      {/* Week cards */}
      <div className="space-y-3">
        {weeks.map((week, i) => (
          <div
            key={i}
            className="relative rounded-xl border border-border/60 bg-card/50 p-5 transition-all hover:border-primary/30 hover:bg-card/80"
          >
            {/* Week indicator */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 border border-primary/20">
                  <span className="text-xs font-bold text-primary">{week.week || i + 1}</span>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">{week.focus}</h4>
                </div>
              </div>
            </div>

            {/* Resources */}
            {week.resources && week.resources.length > 0 && (
              <div className="mb-3 ml-11">
                <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                  <BookOpen className="h-3 w-3" /> Resources
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {week.resources.map((res, j) => (
                    <span
                      key={j}
                      className="inline-flex items-center text-xs px-2.5 py-1 rounded-md bg-secondary/80 text-secondary-foreground border border-border/50"
                    >
                      {typeof res === "object" ? JSON.stringify(res) : res}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Milestone */}
            {week.milestone && (
              <div className="ml-11">
                <div className="flex items-start gap-2 p-2.5 rounded-lg bg-green-500/5 border border-green-500/15">
                  <Award className="h-3.5 w-3.5 text-green-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-green-300/80 leading-relaxed">{week.milestone}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Resume Analysis View ───
function ResumeAnalysisView({ data }) {
  return (
    <div className="space-y-4">
      {/* ATS Score */}
      {data.atsScore !== undefined && (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
          <Target className="h-4 w-4 text-primary flex-shrink-0" />
          <span className="text-sm">
            <strong>ATS Score:</strong>{" "}
            <span className={`font-bold ${data.atsScore >= 70 ? "text-green-400" : data.atsScore >= 50 ? "text-yellow-400" : "text-red-400"}`}>
              {data.atsScore}/100
            </span>
          </span>
        </div>
      )}

      {/* Strengths */}
      {data.strengths && data.strengths.length > 0 && (
        <div>
          <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3 text-green-400" /> Strengths
          </p>
          <div className="flex flex-wrap gap-1.5">
            {data.strengths.map((s, i) => (
              <Badge key={i} className="bg-green-500/10 text-green-400 border-green-500/20 text-xs font-normal">
                {s}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Weaknesses */}
      {data.weaknesses && data.weaknesses.length > 0 && (
        <div>
          <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
            <AlertCircle className="h-3 w-3 text-yellow-400" /> Areas to Improve
          </p>
          <div className="flex flex-wrap gap-1.5">
            {data.weaknesses.map((w, i) => (
              <Badge key={i} className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20 text-xs font-normal">
                {w}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Missing Keywords */}
      {data.missingKeywords && data.missingKeywords.length > 0 && (
        <div>
          <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
            <Search className="h-3 w-3 text-red-400" /> Missing Keywords
          </p>
          <div className="flex flex-wrap gap-1.5">
            {data.missingKeywords.map((k, i) => (
              <Badge key={i} variant="outline" className="text-xs font-normal text-red-400 border-red-500/20">
                + {k}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Top Suggestion */}
      {data.topSuggestion && (
        <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/15">
          <p className="text-xs text-blue-300/80 flex items-start gap-2">
            <Star className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-blue-400" />
            <span><strong>Top Suggestion:</strong> {data.topSuggestion}</span>
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Job Market View ───
function JobMarketView({ data }) {
  return (
    <div className="space-y-3">
      {/* Demand Level */}
      {data.demandLevel && (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
          <TrendingUp className="h-4 w-4 text-primary flex-shrink-0" />
          <span className="text-sm">
            <strong>Market Demand:</strong>{" "}
            <span className={`font-semibold ${data.demandLevel === "High" ? "text-green-400" : data.demandLevel === "Medium" ? "text-yellow-400" : "text-red-400"}`}>
              {data.demandLevel}
            </span>
          </span>
        </div>
      )}

      {/* Salary */}
      {data.avgSalaryINR && (
        <div className="flex items-center gap-2 text-sm">
          <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-muted-foreground">Avg Salary:</span>
          <span className="font-semibold text-foreground">{data.avgSalaryINR}</span>
        </div>
      )}

      {/* Top Skills */}
      {data.topSkillsRequired && data.topSkillsRequired.length > 0 && (
        <div>
          <p className="text-xs text-muted-foreground mb-2">Top Skills Required</p>
          <div className="flex flex-wrap gap-1.5">
            {data.topSkillsRequired.map((s, i) => (
              <Badge key={i} variant="secondary" className="text-xs font-normal">{s}</Badge>
            ))}
          </div>
        </div>
      )}

      {/* Hiring Companies */}
      {data.hiringCompanies && data.hiringCompanies.length > 0 && (
        <div>
          <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
            <Users className="h-3 w-3" /> Hiring Companies
          </p>
          <div className="flex flex-wrap gap-1.5">
            {data.hiringCompanies.map((c, i) => (
              <Badge key={i} variant="outline" className="text-xs font-normal">{c}</Badge>
            ))}
          </div>
        </div>
      )}

      {/* Growth Outlook */}
      {data.growthOutlook && (
        <div className="p-3 rounded-lg bg-green-500/5 border border-green-500/15">
          <p className="text-xs text-green-300/80">
            <strong>Growth Outlook:</strong> {data.growthOutlook}
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Skill Gap View ───
function SkillGapView({ data }) {
  return (
    <div className="space-y-3">
      {/* Match Score */}
      {data.matchScore !== undefined && (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
          <Target className="h-4 w-4 text-primary flex-shrink-0" />
          <span className="text-sm">
            <strong>Match Score:</strong>{" "}
            <span className={`font-bold ${data.matchScore >= 70 ? "text-green-400" : data.matchScore >= 50 ? "text-yellow-400" : "text-red-400"}`}>
              {data.matchScore}%
            </span>
          </span>
        </div>
      )}

      {/* Matched Skills */}
      {data.matched && data.matched.length > 0 && (
        <div>
          <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3 text-green-400" /> Matched Skills
          </p>
          <div className="flex flex-wrap gap-1.5">
            {data.matched.map((s, i) => (
              <Badge key={i} className="bg-green-500/10 text-green-400 border-green-500/20 text-xs font-normal">{s}</Badge>
            ))}
          </div>
        </div>
      )}

      {/* Missing Skills */}
      {data.missing && data.missing.length > 0 && (
        <div>
          <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
            <AlertCircle className="h-3 w-3 text-red-400" /> Missing Skills
          </p>
          <div className="flex flex-wrap gap-1.5">
            {data.missing.map((s, i) => (
              <Badge key={i} className="bg-red-500/10 text-red-400 border-red-500/20 text-xs font-normal">+ {s}</Badge>
            ))}
          </div>
        </div>
      )}

      {/* Priority */}
      {data.priority && data.priority.length > 0 && (
        <div>
          <p className="text-xs text-muted-foreground mb-2">Priority to Learn</p>
          <ol className="space-y-1">
            {data.priority.map((p, i) => (
              <li key={i} className="flex items-center gap-2 text-xs text-foreground/80">
                <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px] font-bold flex-shrink-0">{i + 1}</span>
                {p}
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Verdict */}
      {data.verdict && (
        <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/15">
          <p className="text-xs text-blue-300/80"><strong>Verdict:</strong> {data.verdict}</p>
        </div>
      )}
    </div>
  );
}

// ─── Interview Questions View ───
function InterviewQuestionsView({ data }) {
  const questions = data.questions || [];
  return (
    <div className="space-y-3">
      {questions.map((q, i) => (
        <div key={i} className="p-4 rounded-lg border border-border/60 bg-card/50">
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold flex-shrink-0 mt-0.5">
              {i + 1}
            </span>
            <div className="flex-1">
              <p className="text-sm text-foreground mb-2">{q.question}</p>
              <div className="flex items-center gap-2">
                {q.type && (
                  <Badge variant="outline" className="text-[10px] capitalize">{q.type}</Badge>
                )}
                {q.hint && (
                  <span className="text-[10px] text-muted-foreground italic">💡 {q.hint}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Cover Letter View ───
function CoverLetterView({ data }) {
  return (
    <div className="space-y-4">
      {data.coverLetter && (
        <div className="p-5 rounded-lg border border-border/60 bg-card/50">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">Generated Cover Letter</span>
          </div>
          <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {data.coverLetter}
          </div>
        </div>
      )}
      {data.keyHighlights && data.keyHighlights.length > 0 && (
        <div>
          <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
            <Star className="h-3 w-3 text-yellow-400" /> Key Highlights Used
          </p>
          <div className="flex flex-wrap gap-1.5">
            {data.keyHighlights.map((h, i) => (
              <Badge key={i} variant="secondary" className="text-xs font-normal">{h}</Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Salary Advice View ───
function SalaryAdviceView({ data }) {
  return (
    <div className="space-y-3">
      {data.marketRange && (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
          <TrendingUp className="h-4 w-4 text-primary flex-shrink-0" />
          <span className="text-sm"><strong>Market Range:</strong> {data.marketRange}</span>
        </div>
      )}
      {data.askFor && (
        <div className="flex items-center gap-2 text-sm p-3 rounded-lg bg-green-500/5 border border-green-500/15">
          <span className="text-green-300/80"><strong>Ask For:</strong> {data.askFor}</span>
        </div>
      )}
      {data.tactics && data.tactics.length > 0 && (
        <div>
          <p className="text-xs text-muted-foreground mb-2">Negotiation Tactics</p>
          <ol className="space-y-1.5">
            {data.tactics.map((t, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-foreground/80">
                <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px] font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                {t}
              </li>
            ))}
          </ol>
        </div>
      )}
      {data.redFlags && data.redFlags.length > 0 && (
        <div>
          <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
            <AlertCircle className="h-3 w-3 text-red-400" /> Red Flags
          </p>
          <div className="flex flex-wrap gap-1.5">
            {data.redFlags.map((f, i) => (
              <Badge key={i} className="bg-red-500/10 text-red-400 border-red-500/20 text-xs font-normal">{f}</Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── LinkedIn Optimization View ───
function LinkedInView({ data }) {
  return (
    <div className="space-y-3">
      {data.headlineSuggestion && (
        <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/15">
          <p className="text-xs text-muted-foreground mb-1">Headline Suggestion</p>
          <p className="text-sm font-medium text-foreground">{data.headlineSuggestion}</p>
        </div>
      )}
      {data.bioRewrite && (
        <div className="p-3 rounded-lg border border-border/60 bg-card/50">
          <p className="text-xs text-muted-foreground mb-1">Bio Rewrite</p>
          <p className="text-sm text-foreground/80 leading-relaxed">{data.bioRewrite}</p>
        </div>
      )}
      {data.skillsToAdd && data.skillsToAdd.length > 0 && (
        <div>
          <p className="text-xs text-muted-foreground mb-2">Skills to Add</p>
          <div className="flex flex-wrap gap-1.5">
            {data.skillsToAdd.map((s, i) => (
              <Badge key={i} variant="secondary" className="text-xs font-normal">+ {s}</Badge>
            ))}
          </div>
        </div>
      )}
      {data.keywordStrategy && (
        <div className="p-3 rounded-lg bg-green-500/5 border border-green-500/15">
          <p className="text-xs text-green-300/80"><strong>Keyword Strategy:</strong> {data.keywordStrategy}</p>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN OBSERVATION VIEW — Routes to specialized renderers
   ═══════════════════════════════════════════════════════════════ */

function ObservationView({ tool, data }) {
  if (!data || typeof data !== "object") {
    return <p className="text-xs text-muted-foreground">{String(data)}</p>;
  }

  if (data.error) {
    return <p className="text-xs text-red-400">{data.error}</p>;
  }

  // Route to specialized viewers based on tool name
  switch (tool) {
    case "generate_learning_path":
      return <LearningPathView data={data} />;
    case "analyze_resume":
      return <ResumeAnalysisView data={data} />;
    case "search_job_market":
      return <JobMarketView data={data} />;
    case "evaluate_skill_gap":
      return <SkillGapView data={data} />;
    case "generate_interview_questions":
      return <InterviewQuestionsView data={data} />;
    case "write_cover_letter":
      return <CoverLetterView data={data} />;
    case "salary_negotiation_advice":
      return <SalaryAdviceView data={data} />;
    case "optimize_linkedin":
      return <LinkedInView data={data} />;
    default:
      return <GenericView data={data} />;
  }
}

// ─── Generic fallback renderer (for unknown tools) ───
function GenericView({ data }) {
  return (
    <div className="space-y-2">
      {Object.entries(data).map(([key, value]) => (
        <div key={key} className="text-xs">
          <span className="font-medium text-foreground capitalize">
            {key.replace(/([A-Z])/g, " $1").trim()}:
          </span>{" "}
          {Array.isArray(value) ? (
            <div className="flex flex-wrap gap-1 mt-1">
              {value.map((v, i) => (
                <Badge key={i} variant="outline" className="text-xs font-normal">
                  {typeof v === "object" ? JSON.stringify(v) : String(v)}
                </Badge>
              ))}
            </div>
          ) : typeof value === "object" ? (
            <pre className="text-muted-foreground mt-1 text-xs overflow-auto p-2 rounded bg-muted/30">
              {JSON.stringify(value, null, 2)}
            </pre>
          ) : (
            <span className="text-muted-foreground">{String(value)}</span>
          )}
        </div>
      ))}
    </div>
  );
}
