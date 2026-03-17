"use client";

import { useState } from "react";
import { analyzeSkillGap } from "@/actions/agent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Loader2, Target, TrendingUp, AlertCircle, CheckCircle2, Zap } from "lucide-react";

const PRIORITY_COLOR = {
  Critical: "bg-red-500/20 text-red-400 border-red-500/30",
  High:     "bg-orange-500/20 text-orange-400 border-orange-500/30",
  Medium:   "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Low:      "bg-blue-500/20 text-blue-400 border-blue-500/30",
};

const LEVEL_COLOR = {
  Expert:    "bg-green-500/20 text-green-400 border-green-500/30",
  Strong:    "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Proficient:"bg-purple-500/20 text-purple-400 border-purple-500/30",
};

export default function SkillGapClient() {
  const [targetRole, setTargetRole] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  async function handleAnalyze() {
    if (!targetRole.trim()) return toast.error("Please enter a target role");
    setLoading(true);
    try {
      const data = await analyzeSkillGap({ targetRole, jobDescription: jobDesc });
      setResult(data);
    } catch {
      toast.error("Failed to analyse skill gap. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold gradient-title">Skill Gap Analyser</h1>
        <p className="text-muted-foreground mt-1">
          Instantly see what skills you&apos;re missing for your target role
        </p>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label>Target Role *</Label>
            <Input
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Senior Backend Engineer, ML Engineer, Product Manager"
            />
          </div>
          <div className="space-y-2">
            <Label>Job Description (optional — for more accuracy)</Label>
            <textarea
              rows={4}
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
              placeholder="Paste a real job description here for a more targeted analysis..."
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
            />
          </div>
          <Button onClick={handleAnalyze} disabled={loading}>
            {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Analysing...</> : "Analyse My Skill Gap"}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-6">
          {/* Score */}
          <Card className={result.overallMatch >= 70 ? "border-green-500/30" : result.overallMatch >= 50 ? "border-yellow-500/30" : "border-red-500/30"}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-4xl font-bold">{result.overallMatch}%</p>
                  <p className="text-muted-foreground text-sm">Role Match Score</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm">{result.verdict}</p>
                  <p className="text-xs text-muted-foreground mt-1">Recruiter Readiness: {result.recruiterReadinessScore}%</p>
                </div>
              </div>
              <Progress value={result.overallMatch} className="h-3" />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strong Skills */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  Your Strong Skills ({result.strongSkills?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                {result.strongSkills?.length > 0 ? result.strongSkills.map((s, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span>{s.skill}</span>
                    <div className="flex items-center gap-2">
                      <Badge className={`text-xs ${LEVEL_COLOR[s.level] || "bg-muted"}`}>{s.level}</Badge>
                      <Badge variant="outline" className="text-xs">{s.marketDemand}</Badge>
                    </div>
                  </div>
                )) : <p className="text-sm text-muted-foreground">Update your profile with your current skills.</p>}
              </CardContent>
            </Card>

            {/* Skill Gaps */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-400" />
                  Skills to Develop ({result.skillGaps?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                {result.skillGaps?.map((gap, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{gap.skill}</span>
                      <Badge className={`text-xs ${PRIORITY_COLOR[gap.priority] || "bg-muted"}`}>{gap.priority}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">~{gap.learningTime}</p>
                    {gap.resources?.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {gap.resources.map((r, j) => (
                          <span key={j} className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{r}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Quick Wins */}
          {result.quickWins?.length > 0 && (
            <Card className="border-green-500/20 bg-green-500/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Zap className="h-4 w-4 text-green-400" />
                  Quick Wins — Do These First
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-1">
                  {result.quickWins.map((w, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex gap-2">
                      <span className="text-green-400">→</span>{w}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Keywords to add */}
          {result.topKeywordsToAdd?.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  Top Keywords to Add to Your Resume
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-2">
                  {result.topKeywordsToAdd.map((kw, i) => (
                    <Badge key={i} className="bg-primary/20 text-primary border-primary/30">{kw}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Button variant="outline" onClick={() => setResult(null)}>Analyse Another Role</Button>
        </div>
      )}
    </div>
  );
}
