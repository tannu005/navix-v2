"use client";

import { useState } from "react";
import { generateCareerRoadmap } from "@/actions/agent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { MapPin, TrendingUp, BookOpen, Code2, Trophy, Loader2, ChevronDown, ChevronRight } from "lucide-react";

const RESOURCE_ICONS = { course: "📚", book: "📖", practice: "💻", community: "👥" };

export default function RoadmapClient() {
  const [targetRole, setTargetRole] = useState("");
  const [weeks, setWeeks] = useState("12");
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState(null);
  const [expandedPhase, setExpandedPhase] = useState(0);

  async function handleGenerate() {
    if (!targetRole.trim()) return toast.error("Please enter a target role");
    setLoading(true);
    try {
      const data = await generateCareerRoadmap({ targetRole, timelineWeeks: parseInt(weeks) });
      setRoadmap(data);
      setExpandedPhase(0);
    } catch {
      toast.error("Failed to generate roadmap. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold gradient-title">Career Roadmap</h1>
        <p className="text-muted-foreground mt-1">
          AI-generated personalised roadmap to reach your target role
        </p>
      </div>

      {!roadmap && (
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-2">
                <Label>Target Role</Label>
                <Input
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Senior Full Stack Engineer, Data Scientist, DevOps Lead"
                  onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                />
              </div>
              <div className="space-y-2">
                <Label>Timeline (weeks)</Label>
                <Input
                  type="number"
                  value={weeks}
                  onChange={(e) => setWeeks(e.target.value)}
                  min="4"
                  max="52"
                />
              </div>
            </div>
            <Button onClick={handleGenerate} disabled={loading} className="w-full md:w-auto">
              {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Generating Roadmap...</> : "Generate My Roadmap"}
            </Button>
          </CardContent>
        </Card>
      )}

      {roadmap && (
        <div className="space-y-6">
          {/* Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Target Role", value: roadmap.targetRole, icon: <Trophy className="h-4 w-4" /> },
              { label: "Current Level", value: roadmap.currentLevel, icon: <TrendingUp className="h-4 w-4" /> },
              { label: "Salary Range", value: roadmap.estimatedSalaryRange, icon: <MapPin className="h-4 w-4" /> },
              { label: "Market Demand", value: roadmap.demandOutlook, icon: <TrendingUp className="h-4 w-4" /> },
            ].map((s, i) => (
              <Card key={i}>
                <CardContent className="pt-4 pb-3">
                  <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                    {s.icon}{s.label}
                  </div>
                  <p className="font-semibold text-sm">{s.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Key Insights */}
          {roadmap.keyInsights?.length > 0 && (
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Key Insights</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-1">
                  {roadmap.keyInsights.map((insight, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex gap-2">
                      <span className="text-primary mt-0.5">→</span>{insight}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Phases */}
          <div className="space-y-3">
            <h2 className="text-xl font-semibold">Learning Phases</h2>
            {roadmap.phases?.map((phase, i) => (
              <Card key={i} className={expandedPhase === i ? "border-primary/40" : ""}>
                <CardHeader
                  className="pb-3 cursor-pointer"
                  onClick={() => setExpandedPhase(expandedPhase === i ? -1 : i)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                        {phase.phase}
                      </div>
                      <div>
                        <CardTitle className="text-base">{phase.title}</CardTitle>
                        <p className="text-xs text-muted-foreground">{phase.weeks}</p>
                      </div>
                    </div>
                    {expandedPhase === i ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </div>
                </CardHeader>
                {expandedPhase === i && (
                  <CardContent className="pt-0 space-y-4">
                    <p className="text-sm text-muted-foreground">{phase.goal}</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {phase.skills?.length > 0 && (
                        <div>
                          <p className="text-xs font-medium mb-2 flex items-center gap-1">
                            <Code2 className="h-3 w-3" />Skills
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {phase.skills.map((s, j) => (
                              <Badge key={j} variant="secondary" className="text-xs">{s}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {phase.projects?.length > 0 && (
                        <div>
                          <p className="text-xs font-medium mb-2">Projects</p>
                          <ul className="space-y-1">
                            {phase.projects.map((p, j) => (
                              <li key={j} className="text-xs text-muted-foreground flex gap-1">
                                <span className="text-primary">•</span>{p}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {phase.milestones?.length > 0 && (
                        <div>
                          <p className="text-xs font-medium mb-2 flex items-center gap-1">
                            <Trophy className="h-3 w-3" />Milestones
                          </p>
                          <ul className="space-y-1">
                            {phase.milestones.map((m, j) => (
                              <li key={j} className="text-xs text-muted-foreground flex gap-1">
                                <span className="text-green-400">✓</span>{m}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {phase.resources?.length > 0 && (
                      <div>
                        <p className="text-xs font-medium mb-2 flex items-center gap-1">
                          <BookOpen className="h-3 w-3" />Resources
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {phase.resources.map((r, j) => (
                            <span key={j} className="text-xs border rounded-md px-2 py-1 text-muted-foreground flex items-center gap-1">
                              {RESOURCE_ICONS[r.type] || "📌"} {r.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            ))}
          </div>

          {/* Recruiter Tips */}
          {roadmap.recruiterTips?.length > 0 && (
            <Card className="border-yellow-500/20 bg-yellow-500/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-yellow-400">Recruiter Tips</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-1">
                  {roadmap.recruiterTips.map((tip, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex gap-2">
                      <span className="text-yellow-400">★</span>{tip}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          <Button variant="outline" onClick={() => setRoadmap(null)}>Generate New Roadmap</Button>
        </div>
      )}
    </div>
  );
}
