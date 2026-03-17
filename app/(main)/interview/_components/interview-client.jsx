"use client";

import { useState } from "react";
import { generateQuiz, saveQuizResult } from "@/actions/interview";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";

export default function InterviewClient({ assessments }) {
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentQ, setCurrentQ] = useState(0);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const chartData = assessments.map((a) => ({
    date: format(new Date(a.createdAt), "MMM d"),
    score: a.quizScore,
  }));

  async function startQuiz() {
    setLoading(true);
    try {
      const questions = await generateQuiz();
      setQuiz(questions);
      setAnswers({});
      setCurrentQ(0);
      setResult(null);
    } catch {
      toast.error("Failed to generate quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function submitQuiz() {
    const answersArray = quiz.map((_, i) => answers[i] || "");
    const correct = quiz.filter((q, i) => q.correctAnswer === answersArray[i]).length;
    const score = Math.round((correct / quiz.length) * 100);

    setSubmitting(true);
    try {
      const saved = await saveQuizResult(quiz, answersArray, score);
      setResult({ score, saved, answersArray });
    } catch {
      toast.error("Failed to save results.");
    } finally {
      setSubmitting(false);
    }
  }

  // Results screen
  if (result) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold gradient-title mb-2">{result.score}%</h1>
          <p className="text-muted-foreground">
            {result.score >= 80 ? "Excellent work!" : result.score >= 60 ? "Good effort!" : "Keep practising!"}
          </p>
        </div>

        {result.saved?.improvementTip && (
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="pt-4">
              <p className="text-sm">{result.saved.improvementTip}</p>
            </CardContent>
          </Card>
        )}

        {quiz.map((q, i) => (
          <Card key={i} className={result.answersArray[i] === q.correctAnswer ? "border-green-500/30" : "border-red-500/30"}>
            <CardContent className="pt-4 space-y-2">
              <p className="font-medium text-sm">{q.question}</p>
              <p className="text-xs text-muted-foreground">
                Your answer:{" "}
                <span className={result.answersArray[i] === q.correctAnswer ? "text-green-400" : "text-red-400"}>
                  {result.answersArray[i] || "No answer"}
                </span>
              </p>
              {result.answersArray[i] !== q.correctAnswer && (
                <p className="text-xs text-green-400">Correct: {q.correctAnswer}</p>
              )}
              <p className="text-xs text-muted-foreground italic">{q.explanation}</p>
            </CardContent>
          </Card>
        ))}

        <Button onClick={startQuiz} className="w-full">Try Another Quiz</Button>
      </div>
    );
  }

  // Active quiz
  if (quiz) {
    const q = quiz[currentQ];
    const progress = ((currentQ + 1) / quiz.length) * 100;

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Question {currentQ + 1} of {quiz.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} />
        </div>

        <Card>
          <CardContent className="pt-6 space-y-6">
            <p className="font-medium text-lg">{q.question}</p>
            <RadioGroup
              value={answers[currentQ] || ""}
              onValueChange={(val) => setAnswers((prev) => ({ ...prev, [currentQ]: val }))}
            >
              {q.options.map((opt, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <RadioGroupItem value={opt} id={`opt-${i}`} />
                  <Label htmlFor={`opt-${i}`} className="cursor-pointer">{opt}</Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          {currentQ > 0 && (
            <Button variant="outline" onClick={() => setCurrentQ((p) => p - 1)} className="flex-1">
              Previous
            </Button>
          )}
          {currentQ < quiz.length - 1 ? (
            <Button
              onClick={() => setCurrentQ((p) => p + 1)}
              disabled={!answers[currentQ]}
              className="flex-1"
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={submitQuiz}
              disabled={submitting || Object.keys(answers).length < quiz.length}
              className="flex-1"
            >
              {submitting ? "Submitting…" : "Submit Quiz"}
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Landing screen
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-title">Interview Prep</h1>
          <p className="text-muted-foreground mt-1">
            AI-generated questions tailored to your industry and skills
          </p>
        </div>
        <Button onClick={startQuiz} disabled={loading} size="lg">
          {loading ? "Generating Quiz…" : "Start New Quiz"}
        </Button>
      </div>

      {assessments.length > 0 && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Your Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="date" tick={{ fill: "#9ca3af", fontSize: 12 }} />
                    <YAxis domain={[0, 100]} tick={{ fill: "#9ca3af", fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }}
                      formatter={(v) => [`${v}%`, "Score"]}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      dot={{ fill: "#8b5cf6" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold">Recent Quizzes</h2>
            {assessments.slice(0, 5).map((a, i) => (
              <Card key={i}>
                <CardContent className="py-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium">{a.category} Quiz</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(a.createdAt), "MMM d, yyyy")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{a.quizScore}%</p>
                    {a.improvementTip && (
                      <p className="text-xs text-muted-foreground max-w-xs text-right mt-1">
                        {a.improvementTip}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {assessments.length === 0 && (
        <div className="text-center py-16 border rounded-xl text-muted-foreground">
          <p className="text-4xl mb-3">🎯</p>
          <p className="font-medium text-foreground">No quizzes yet</p>
          <p className="text-sm mt-1">Start your first quiz to see your progress here</p>
        </div>
      )}
    </div>
  );
}
