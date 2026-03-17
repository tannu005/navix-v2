"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { format } from "date-fns";

const OutlookIcon = {
  Positive: <TrendingUp className="h-5 w-5 text-green-500" />,
  Neutral: <Minus className="h-5 w-5 text-yellow-500" />,
  Negative: <TrendingDown className="h-5 w-5 text-red-500" />,
};

const DemandColor = {
  High: "bg-green-500/20 text-green-400 border-green-500/30",
  Medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Low: "bg-red-500/20 text-red-400 border-red-500/30",
};

export default function DashboardView({ insights }) {
  const salaryData = insights.salaryRanges.map((r) => ({
    role: r.role.length > 20 ? r.role.substring(0, 20) + "…" : r.role,
    min: Math.round(r.min / 1000),
    median: Math.round(r.median / 1000),
    max: Math.round(r.max / 1000),
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold gradient-title">Industry Insights</h1>
        <p className="text-muted-foreground mt-1">
          Last updated:{" "}
          {insights.lastUpdated
            ? format(new Date(insights.lastUpdated), "MMM d, yyyy")
            : "Today"}
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Market Outlook</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            {OutlookIcon[insights.marketOutlook]}
            <span className="font-semibold">{insights.marketOutlook}</span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Growth Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold text-green-400">{insights.growthRate}%</span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Demand Level</CardTitle>
          </CardHeader>
          <CardContent>
            <span className={`px-3 py-1 rounded-full text-sm border ${DemandColor[insights.demandLevel]}`}>
              {insights.demandLevel}
            </span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Top Skills Count</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold">{insights.topSkills.length}</span>
          </CardContent>
        </Card>
      </div>

      {/* Salary Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Salary Ranges by Role (₹K)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salaryData} margin={{ top: 5, right: 20, left: 0, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis
                  dataKey="role"
                  tick={{ fill: "#9ca3af", fontSize: 11 }}
                  angle={-35}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }}
                  formatter={(val) => [`₹${val}K`]}
                />
                <Bar dataKey="min" fill="#3b82f6" name="Min" radius={[2, 2, 0, 0]} />
                <Bar dataKey="median" fill="#8b5cf6" name="Median" radius={[2, 2, 0, 0]} />
                <Bar dataKey="max" fill="#10b981" name="Max" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Skills */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              Top In-Demand Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {insights.topSkills.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Key Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Key Industry Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {insights.keyTrends.map((trend, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-primary mt-0.5">→</span>
                  {trend}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Recommended Skills */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recommended Skills to Learn</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {insights.recommendedSkills.map((skill) => (
                <Badge key={skill} className="bg-primary/20 text-primary border-primary/30">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
