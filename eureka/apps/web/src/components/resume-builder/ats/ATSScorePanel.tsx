"use client";

import { useState, useCallback } from "react";
import { useResumeStore } from "@/stores/resume";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Target, AlertTriangle, CheckCircle, AlertCircle, Loader2, X, ChevronDown, ChevronRight, FileText } from "lucide-react";
import { apiATSScore } from "@/lib/resume/api";
import type { ATSAnalysis } from "@/types/resume";

interface ATSScorePanelProps {
  open: boolean;
  onClose: () => void;
}

export function ATSScorePanel({ open, onClose }: ATSScorePanelProps) {
  const doc = useResumeStore((s) => s.activeDocument());
  const [analysis, setAnalysis] = useState<ATSAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(true);
  const [jobDescription, setJobDescription] = useState("");
  const [showJDInput, setShowJDInput] = useState(false);

  const runAnalysis = useCallback(async () => {
    if (!doc) return;
    setLoading(true);
    setError(null);
    try {
      const result = await apiATSScore({
        resume_data: doc.data as unknown as Record<string, unknown>,
        job_description: jobDescription.trim() || undefined,
      });
      setAnalysis(result as ATSAnalysis);
    } catch (err: unknown) {
      // Fallback to client-side analysis if backend unavailable
      setError(err instanceof Error ? err.message : "Backend unavailable — using local analysis");
      setAnalysis(localAnalyze(doc.data));
    } finally {
      setLoading(false);
    }
  }, [doc, jobDescription]);

  if (!open) return null;

  const scoreColor = analysis ? (analysis.score >= 80 ? "text-green-500" : analysis.score >= 60 ? "text-amber-500" : "text-red-500") : "text-muted-foreground";
  const gradeColor = analysis ? (analysis.grade === "A" || analysis.grade === "B" ? "bg-green-100 text-green-700" : analysis.grade === "C" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700") : "";

  return (
    <div className="fixed right-0 top-16 bottom-0 w-[420px] bg-background border-l shadow-xl z-40 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b bg-blue-50 dark:bg-blue-950/20">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-500" />
          <span className="font-semibold text-sm">ATS Score Checker</span>
          <Badge variant="secondary" className="text-[10px] h-4">AI-Powered</Badge>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {!analysis ? (
          <div className="space-y-4">
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-950/20 flex items-center justify-center mx-auto">
                <Target className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="font-semibold mt-3">Check ATS Compatibility</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Analyze your resume against ATS scoring criteria
              </p>
            </div>

            {/* Job Description Input */}
            <Card className="p-3">
              <button
                className="flex items-center gap-2 w-full text-left text-sm font-medium"
                onClick={() => setShowJDInput(!showJDInput)}
              >
                <FileText className="w-4 h-4 text-blue-500" />
                <span>Target a specific job?</span>
                <Badge variant="outline" className="text-[10px] ml-auto">Optional</Badge>
                {showJDInput ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              </button>
              {showJDInput && (
                <div className="mt-2">
                  <Label className="text-xs">Paste the Job Description</Label>
                  <textarea
                    className="w-full min-h-[100px] rounded border bg-background px-3 py-2 text-sm resize-y mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="We are looking for a Senior Software Engineer who..."
                  />
                  <p className="text-[10px] text-muted-foreground mt-1">
                    AI will compare your resume keywords against this job description
                  </p>
                </div>
              )}
            </Card>

            <Button className="w-full bg-blue-500 hover:bg-blue-600" onClick={runAnalysis} disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Target className="w-4 h-4 mr-2" />}
              {jobDescription.trim() ? "Score Against This Job" : "Run General ATS Analysis"}
            </Button>
          </div>
        ) : (
          <>
            {/* Score Circle */}
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full border-4" style={{ borderColor: analysis.score >= 80 ? "#22c55e" : analysis.score >= 60 ? "#f59e0b" : "#ef4444" }}>
                <div>
                  <span className={`text-3xl font-bold ${scoreColor}`}>{analysis.score}</span>
                  <span className="text-xs text-muted-foreground block">/ 100</span>
                </div>
              </div>
              <Badge className={`mt-2 ${gradeColor}`}>Grade: {analysis.grade}</Badge>
              <p className="text-sm text-muted-foreground mt-2">{analysis.summary}</p>
              {jobDescription.trim() && (
                <p className="text-[10px] text-blue-500 mt-1">Scored against provided job description</p>
              )}
            </div>

            {/* Missing Keywords */}
            {analysis.missingKeywords.length > 0 && (
              <Card className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-semibold">Missing Keywords ({analysis.missingKeywords.length})</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {analysis.missingKeywords.map((kw, i) => (
                    <Badge key={i} variant="outline" className={`text-[10px] ${kw.importance === "critical" ? "border-red-300 text-red-600" : kw.importance === "important" ? "border-amber-300 text-amber-600" : "border-gray-300 text-gray-600"}`}>
                      {kw.keyword}
                      {kw.importance === "critical" && " ⚠️"}
                    </Badge>
                  ))}
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">
                  Add these keywords to your resume to improve your ATS match
                </p>
              </Card>
            )}

            {/* Present Keywords */}
            {analysis.presentKeywords.length > 0 && (
              <Card className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-semibold">Matched Keywords ({analysis.presentKeywords.length})</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {analysis.presentKeywords.map((kw, i) => (
                    <Badge key={i} variant="outline" className="text-[10px] border-green-300 text-green-600">
                      {kw.keyword} ({kw.count}x)
                    </Badge>
                  ))}
                </div>
              </Card>
            )}

            {/* Issues */}
            {analysis.formatIssues.length > 0 && (
              <Card className="p-3">
                <button className="flex items-center gap-2 w-full text-left" onClick={() => setShowDetails(!showDetails)}>
                  {showDetails ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span className="text-sm font-semibold">Issues ({analysis.formatIssues.length})</span>
                </button>
                {showDetails && (
                  <div className="mt-2 space-y-2">
                    {analysis.formatIssues.map((issue, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <AlertCircle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${issue.severity === "high" ? "text-red-500" : issue.severity === "medium" ? "text-amber-500" : "text-blue-500"}`} />
                        <div>
                          <p className="text-xs">{issue.issue}</p>
                          <p className="text-[10px] text-muted-foreground">Fix: {issue.fix}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            )}

            {/* Recommendations */}
            {analysis.recommendations.length > 0 && (
              <Card className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-semibold">Recommendations</span>
                </div>
                <div className="space-y-2">
                  {analysis.recommendations.map((rec, i) => (
                    <div key={i} className="text-sm border-l-2 pl-2" style={{ borderColor: rec.impact === "high" ? "#ef4444" : rec.impact === "medium" ? "#f59e0b" : "#3b82f6" }}>
                      <p className="font-medium text-xs">{rec.title}</p>
                      <p className="text-[10px] text-muted-foreground">{rec.description}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {error && (
              <p className="text-[10px] text-amber-500 text-center">{error}</p>
            )}

            <Button variant="outline" className="w-full" onClick={() => { setAnalysis(null); }}>
              ← Back to Setup
            </Button>
            <Button variant="outline" className="w-full" onClick={runAnalysis} disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Target className="w-4 h-4 mr-2" />}
              Re-analyze
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

/** Fallback client-side analysis when backend is unavailable */
function localAnalyze(data: import("@/types/resume").ResumeData): ATSAnalysis {
  let score = 0;
  const issues: ATSAnalysis["formatIssues"] = [];
  const recommendations: ATSAnalysis["recommendations"] = [];

  const has = {
    summary: !!data.summary.content,
    experience: data.experience.length > 0,
    education: data.education.length > 0,
    skills: data.skills.groups.some(g => g.skills.length > 0),
    contact: !!(data.header.email && data.header.phone),
  };
  score += (Object.values(has).filter(Boolean).length / 5) * 20;
  if (!has.summary) recommendations.push({ title: "Add Summary", description: "A professional summary improves ATS parsing", impact: "high" });
  if (!has.contact) issues.push({ issue: "Missing contact info", severity: "high", fix: "Add email and phone" });

  const bullets = data.experience.flatMap(e => e.bullets.map(b => b.content)).filter(Boolean);
  const avg = bullets.length / Math.max(data.experience.length, 1);
  score += avg >= 3 ? 20 : avg >= 2 ? 15 : avg >= 1 ? 10 : 5;
  if (avg < 3) recommendations.push({ title: "Add More Bullets", description: `Average ${avg.toFixed(1)}/role. Aim for 3-5.`, impact: "high" });

  const quantified = bullets.filter(b => /\d+[%+]?|\$[\d,]+/.test(b)).length;
  score += (quantified / Math.max(bullets.length, 1)) * 20;

  const verbs = ["led", "built", "designed", "managed", "created", "developed", "implemented", "improved"];
  const withVerbs = bullets.filter(b => verbs.some(v => b.toLowerCase().startsWith(v))).length;
  score += (withVerbs / Math.max(bullets.length, 1)) * 10;

  const totalSkills = data.skills.groups.reduce((s, g) => s + g.skills.length, 0);
  score += totalSkills >= 10 ? 15 : totalSkills >= 5 ? 10 : 5;

  score += data.header.firstName && data.header.lastName ? 15 : 10;

  score = Math.round(Math.min(100, Math.max(0, score)));
  const grade = score >= 90 ? "A" : score >= 80 ? "B" : score >= 70 ? "C" : score >= 60 ? "D" : "F";

  return {
    score, grade,
    summary: score >= 80 ? "Well-optimized for ATS." : score >= 60 ? "Solid foundation, room for improvement." : "Needs significant improvements.",
    missingKeywords: [], presentKeywords: [], formatIssues: issues, recommendations,
  };
}
