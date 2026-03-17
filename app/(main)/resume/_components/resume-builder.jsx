"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { saveResume, improveWithAI, checkATSScore } from "@/actions/resume";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Download, Sparkles, Target, ChevronDown, ChevronUp } from "lucide-react";
import ReactMarkdown from "react-markdown";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

const RESUME_TEMPLATE = `# Your Name
your.email@example.com | LinkedIn: linkedin.com/in/yourprofile

## Summary
A brief summary of your professional background and career objectives.

## Experience

### Job Title — Company Name
*Month Year – Present*
- Key achievement with measurable impact
- Another key achievement

## Education

### Degree — University Name
*Graduation Year*

## Skills
**Technical:** Skill 1, Skill 2, Skill 3
`;

export default function ResumeBuilder({ initialContent }) {
  const [content, setContent] = useState(initialContent || RESUME_TEMPLATE);
  const [saving, setSaving] = useState(false);
  const [improving, setImproving] = useState(false);
  const [atsLoading, setAtsLoading] = useState(false);
  const [jobDesc, setJobDesc] = useState("");
  const [atsResult, setAtsResult] = useState(null);
  const [showAts, setShowAts] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await saveResume(content);
      toast.success("Resume saved!");
    } catch {
      toast.error("Failed to save resume.");
    } finally {
      setSaving(false);
    }
  }

  async function handleImprove() {
    if (!content.trim()) return toast.error("Please write some content first.");
    setImproving(true);
    try {
      const improved = await improveWithAI({ current: content, type: "resume" });
      setContent(improved);
      toast.success("Resume improved with AI!");
    } catch {
      toast.error("Failed to improve resume.");
    } finally {
      setImproving(false);
    }
  }

  async function handleDownload() {
    try {
      const { default: html2pdf } = await import("html2pdf.js");
      const el = document.getElementById("resume-preview");
      await html2pdf()
        .set({ margin: 10, filename: "resume.pdf", html2canvas: { scale: 2 }, jsPDF: { unit: "mm", format: "a4" } })
        .from(el)
        .save();
      toast.success("PDF downloaded!");
    } catch {
      toast.error("Failed to download PDF.");
    }
  }

  async function handleATSCheck() {
    if (!jobDesc.trim()) return toast.error("Please paste a job description first.");
    setAtsLoading(true);
    try {
      const result = await checkATSScore({ resumeContent: content, jobDescription: jobDesc });
      setAtsResult(result);
    } catch {
      toast.error("Failed to analyse resume.");
    } finally {
      setAtsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-title">Resume Builder</h1>
          <p className="text-muted-foreground mt-1">Write, AI-improve, and download your resume</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" onClick={handleImprove} disabled={improving}>
            <Sparkles className="h-4 w-4 mr-2" />
            {improving ? "Improving..." : "Improve with AI"}
          </Button>
          <Button variant="outline" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Resume"}
          </Button>
        </div>
      </div>

      {/* ATS Checker */}
      <Card>
        <CardHeader className="pb-3 cursor-pointer" onClick={() => setShowAts(!showAts)}>
          <CardTitle className="flex items-center justify-between text-base">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              ATS Score Checker
              <Badge variant="secondary" className="text-xs">New</Badge>
            </div>
            {showAts ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </CardTitle>
        </CardHeader>
        {showAts && (
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Paste Job Description</Label>
              <textarea
                rows={4}
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
                placeholder="Paste the full job description here..."
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
              />
            </div>
            <Button onClick={handleATSCheck} disabled={atsLoading}>
              {atsLoading ? "Analysing..." : "Check ATS Score"}
            </Button>
            {atsResult && (
              <div className="space-y-4 pt-2 border-t">
                <div className="flex items-center gap-4">
                  <div className="text-5xl font-bold text-primary">{atsResult.score}%</div>
                  <p className="text-sm text-muted-foreground">{atsResult.summary}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-green-400 mb-2">Matched Keywords</p>
                    <div className="flex flex-wrap gap-1">
                      {atsResult.matchedKeywords.map((k) => (
                        <Badge key={k} className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">{k}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-red-400 mb-2">Missing Keywords</p>
                    <div className="flex flex-wrap gap-1">
                      {atsResult.missingKeywords.map((k) => (
                        <Badge key={k} className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">{k}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Suggestions</p>
                  <ul className="space-y-1">
                    {atsResult.suggestions.map((s, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex gap-2">
                        <span className="text-primary mt-0.5">→</span>{s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* Editor + Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Label className="mb-2 block text-sm font-medium">Markdown Editor</Label>
          <div data-color-mode="dark">
            <MDEditor value={content} onChange={setContent} height={600} />
          </div>
        </div>
        <div>
          <Label className="mb-2 block text-sm font-medium">Preview</Label>
          <div
            id="resume-preview"
            className="h-[600px] overflow-y-auto border rounded-lg p-6 bg-white text-black text-sm leading-relaxed"
          >
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
