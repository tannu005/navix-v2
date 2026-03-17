"use client";

import { useState } from "react";
import { initAgentState, agentStep } from "@/actions/agent";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Brain, Zap, Search, Wrench, CheckCircle2,
  ChevronDown, ChevronRight, Loader2, Sparkles, Send
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
  acting:   <Wrench className="h-4 w-4 text-yellow-400 animate-spin" />,
  reflecting: <Search className="h-4 w-4 text-purple-400 animate-pulse" />,
  done:     <CheckCircle2 className="h-4 w-4 text-green-400" />,
  error:    <Zap className="h-4 w-4 text-red-400" />,
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
            <Sparkles className="h-3 w-3" /> Gemini 2.0 Flash
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
                <ObservationView data={obs.result} />
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

// Renders tool observation data nicely
function ObservationView({ data }) {
  if (!data || typeof data !== "object") {
    return <p className="text-xs text-muted-foreground">{String(data)}</p>;
  }

  if (data.error) {
    return <p className="text-xs text-red-400">{data.error}</p>;
  }

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
            <pre className="text-muted-foreground mt-1 text-xs overflow-auto">
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
