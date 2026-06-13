"use client";

import { useState } from "react";
import { generateCoverLetter, deleteCoverLetter } from "@/actions/cover-letter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Plus, Trash2, Copy, ChevronDown, ChevronUp } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { format } from "date-fns";

export default function CoverLetterClient({ letters: initialLetters }) {
  const [letters, setLetters] = useState(initialLetters);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [form, setForm] = useState({ jobTitle: "", companyName: "", jobDescription: "" });

  function handleChange(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function handleGenerate(e) {
    e.preventDefault();
    if (!form.jobTitle || !form.companyName || !form.jobDescription) {
      return toast.error("Please fill in all fields.");
    }
    setLoading(true);
    try {
      const letter = await generateCoverLetter(form);
      setLetters((prev) => [letter, ...prev]);
      setExpandedId(letter.id);
      setShowForm(false);
      setForm({ jobTitle: "", companyName: "", jobDescription: "" });
      toast.success("Cover letter generated!");
    } catch {
      toast.error("Failed to generate cover letter.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    try {
      await deleteCoverLetter(id);
      setLetters((prev) => prev.filter((l) => l.id !== id));
      toast.success("Deleted.");
    } catch {
      toast.error("Failed to delete.");
    }
  }

  function handleCopy(content) {
    navigator.clipboard.writeText(content);
    toast.success("Copied to clipboard!");
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-title">AI Cover Letter</h1>
          <p className="text-muted-foreground mt-1">
            Generate personalised cover letters tailored to any job
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          New Cover Letter
        </Button>
      </div>

      {/* Generate Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Generate New Cover Letter</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleGenerate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title *</Label>
                  <Input
                    id="jobTitle"
                    name="jobTitle"
                    value={form.jobTitle}
                    onChange={handleChange}
                    placeholder="e.g. Senior Frontend Engineer"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    value={form.companyName}
                    onChange={handleChange}
                    placeholder="e.g. Google"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="jobDescription">Job Description *</Label>
                <textarea
                  id="jobDescription"
                  name="jobDescription"
                  rows={5}
                  value={form.jobDescription}
                  onChange={handleChange}
                  placeholder="Paste the full job description here..."
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                  required
                />
              </div>
              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Generating…" : "Generate Cover Letter"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Letters List */}
      {letters.length === 0 && !showForm ? (
        <div className="text-center py-16 border rounded-xl text-muted-foreground">
          <p className="text-4xl mb-3">✉️</p>
          <p className="font-medium text-foreground">No cover letters yet</p>
          <p className="text-sm mt-1">
            Click &quot;New Cover Letter&quot; to generate your first one
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {letters.map((letter) => (
            <Card key={letter.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div
                    className="cursor-pointer flex-1"
                    onClick={() =>
                      setExpandedId(expandedId === letter.id ? null : letter.id)
                    }
                  >
                    <CardTitle className="text-base">
                      {letter.jobTitle} — {letter.companyName}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(new Date(letter.createdAt), "MMM d, yyyy")}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        setExpandedId(expandedId === letter.id ? null : letter.id)
                      }
                    >
                      {expandedId === letter.id ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleCopy(letter.content)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(letter.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              {expandedId === letter.id && (
                <CardContent>
                  <div className="prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown>{letter.content}</ReactMarkdown>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
