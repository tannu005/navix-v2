"use client";

import { useState } from "react";
import { getSalaryIntelligence } from "@/actions/agent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, DollarSign, TrendingUp, Building2, Copy } from "lucide-react";

export default function SalaryClient() {
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("India");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  async function handleFetch() {
    if (!role.trim()) return toast.error("Please enter a role");
    setLoading(true);
    try {
      const result = await getSalaryIntelligence({ targetRole: role, location });
      setData(result);
    } catch {
      toast.error("Failed to fetch salary data. Try again.");
    } finally {
      setLoading(false);
    }
  }

  function copyScript() {
    navigator.clipboard.writeText(data.negotiationScript);
    toast.success("Script copied to clipboard!");
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold gradient-title">Salary Intelligence</h1>
        <p className="text-muted-foreground mt-1">
          Data-backed salary ranges and negotiation strategy for any role
        </p>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-2">
              <Label>Role</Label>
              <Input
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Senior Software Engineer, Data Scientist"
                onKeyDown={(e) => e.key === "Enter" && handleFetch()}
              />
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="India / Bangalore / Remote"
              />
            </div>
          </div>
          <Button onClick={handleFetch} disabled={loading}>
            {loading
              ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Fetching...</>
              : "Get Salary Data"}
          </Button>
        </CardContent>
      </Card>

      {data && (
        <div className="space-y-6">
          {/* Salary bands */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { label: "Fresher (0–2 yrs)", value: data.fresher },
              { label: "Mid Level (2–5 yrs)", value: data.midLevel },
              { label: "Senior (5–8 yrs)", value: data.senior },
              { label: "Lead / Principal", value: data.lead },
              { label: "Your Estimate", value: data.estimatedForUser, highlight: true },
            ].map((s, i) => (
              <Card key={i} className={s.highlight ? "border-primary/40 bg-primary/5" : ""}>
                <CardContent className="pt-4 pb-3 text-center">
                  <p className={`font-bold text-lg ${s.highlight ? "text-primary" : ""}`}>{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top-paying companies */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary" />
                  Top Paying Companies
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-2">
                  {data.topPayingCompanies?.map((c, i) => (
                    <Badge key={i} variant="secondary">{c}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Salary boost skills */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-400" />
                  Skills That Boost Salary
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-2">
                  {data.salaryBoostSkills?.map((s, i) => (
                    <Badge key={i} className="bg-green-500/20 text-green-400 border-green-500/30">{s}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Negotiation script */}
          {data.negotiationScript && (
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-primary" />
                    Negotiation Script
                  </div>
                  <Button variant="ghost" size="sm" onClick={copyScript} className="h-7 text-xs gap-1">
                    <Copy className="h-3 w-3" /> Copy
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground leading-relaxed italic">
                  &ldquo;{data.negotiationScript}&rdquo;
                </p>
              </CardContent>
            </Card>
          )}

          {/* Benefits to negotiate */}
          {data.benefitsToNegotiate?.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Benefits to Negotiate Beyond Salary</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 flex flex-wrap gap-2">
                {data.benefitsToNegotiate.map((b, i) => (
                  <Badge key={i} variant="outline">{b}</Badge>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Market insights */}
          {data.insights?.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Market Insights</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-1">
                  {data.insights.map((ins, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex gap-2">
                      <span className="text-primary mt-0.5">→</span>{ins}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          <Button variant="outline" onClick={() => setData(null)}>Search Another Role</Button>
        </div>
      )}
    </div>
  );
}
