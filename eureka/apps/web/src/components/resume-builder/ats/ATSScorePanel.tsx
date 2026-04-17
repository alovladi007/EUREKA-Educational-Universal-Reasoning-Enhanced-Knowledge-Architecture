"use client";

import { useState, useCallback } from "react";
import { useResumeStore } from "@/stores/resume";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Target, AlertTriangle, CheckCircle, AlertCircle, Loader2, X, ChevronDown, ChevronRight } from "lucide-react";
import type { ATSAnalysis } from "@/types/resume";

interface ATSScorePanelProps {
  open: boolean;
  onClose: () => void;
}

function analyzeResume(data: import("@/types/resume").ResumeData | null): ATSAnalysis {
  if (!data) return { score: 0, grade: "F", summary: "No resume data", missingKeywords: [], presentKeywords: [], formatIssues: [], recommendations: [] };

  let score = 0;
  const issues: ATSAnalysis["formatIssues"] = [];
  const recommendations: ATSAnalysis["recommendations"] = [];

  // Section completeness (20%)
  const sections = {
    summary: !!data.summary.content,
    experience: data.experience.length > 0,
    education: data.education.length > 0,
    skills: data.skills.groups.some(g => g.skills.length > 0),
    contact: !!(data.header.email && data.header.phone),
  };
  const sectionScore = Object.values(sections).filter(Boolean).length / Object.keys(sections).length;
  score += sectionScore * 20;

  if (!sections.summary) recommendations.push({ title: "Add a Professional Summary", description: "A 2-4 sentence summary improves ATS parsing and helps recruiters quickly understand your value.", impact: "high" });
  if (!sections.contact) issues.push({ issue: "Missing contact information", severity: "high", fix: "Add email and phone number" });

  // Bullet quality (20%)
  const allBullets = data.experience.flatMap(e => e.bullets.map(b => b.content)).filter(Boolean);
  const bulletCount = allBullets.length;
  const avgBulletsPerJob = data.experience.length > 0 ? bulletCount / data.experience.length : 0;
  if (avgBulletsPerJob >= 3) score += 20;
  else if (avgBulletsPerJob >= 2) score += 15;
  else if (avgBulletsPerJob >= 1) score += 10;
  else score += 5;

  if (avgBulletsPerJob < 3) recommendations.push({ title: "Add More Bullet Points", description: `Aim for 3-5 bullets per role. You average ${avgBulletsPerJob.toFixed(1)} bullets per position.`, impact: "high" });

  // Quantified achievements (20%)
  const numberPattern = /\d+[%+]?|\$[\d,]+/;
  const quantifiedBullets = allBullets.filter(b => numberPattern.test(b)).length;
  const quantifiedRatio = bulletCount > 0 ? quantifiedBullets / bulletCount : 0;
  score += quantifiedRatio * 20;

  if (quantifiedRatio < 0.5) recommendations.push({ title: "Add Numbers to Bullets", description: `Only ${Math.round(quantifiedRatio * 100)}% of your bullets have quantified results. Add metrics like percentages, dollar amounts, or counts.`, impact: "high" });

  // Action verb usage (10%)
  const actionVerbs = ["led", "built", "designed", "managed", "created", "developed", "implemented", "improved", "increased", "reduced", "delivered", "launched", "spearheaded", "architected", "optimized", "automated", "mentored", "established"];
  const bulletsWithActionVerbs = allBullets.filter(b => actionVerbs.some(v => b.toLowerCase().startsWith(v))).length;
  const actionVerbRatio = bulletCount > 0 ? bulletsWithActionVerbs / bulletCount : 0;
  score += actionVerbRatio * 10;

  const weakVerbs = allBullets.filter(b => /^(responsible for|worked on|helped|assisted|involved in)/i.test(b));
  if (weakVerbs.length > 0) issues.push({ issue: `${weakVerbs.length} bullet(s) start with weak verbs ("responsible for", "worked on")`, severity: "medium", fix: "Replace with strong action verbs like 'Led', 'Built', 'Delivered'" });

  // Skills section (15%)
  const totalSkills = data.skills.groups.reduce((sum, g) => sum + g.skills.length, 0);
  if (totalSkills >= 10) score += 15;
  else if (totalSkills >= 5) score += 10;
  else if (totalSkills > 0) score += 5;

  if (totalSkills < 8) recommendations.push({ title: "Expand Your Skills Section", description: `You have ${totalSkills} skills listed. Aim for 10-15+ relevant technical and soft skills.`, impact: "medium" });

  // Format (15%)
  score += 10; // Base format score for using our builder (ATS-safe templates)
  if (data.header.firstName && data.header.lastName) score += 5;
  if (!data.header.firstName || !data.header.lastName) issues.push({ issue: "Missing first or last name", severity: "high", fix: "Add your full name in the header" });

  // Resume length
  const totalContent = JSON.stringify(data).length;
  if (totalContent > 10000) recommendations.push({ title: "Consider Trimming Content", description: "Your resume may be too long. Aim for 1 page for <10 years experience, 2 pages max.", impact: "low" });

  score = Math.round(Math.min(100, Math.max(0, score)));
  const grade = score >= 90 ? "A" : score >= 80 ? "B" : score >= 70 ? "C" : score >= 60 ? "D" : "F";
  const summary = score >= 80 ? "Your resume is well-optimized for ATS systems." : score >= 60 ? "Your resume has a solid foundation but could use improvements." : "Your resume needs significant improvements for ATS compatibility.";

  return { score, grade, summary, missingKeywords: [], presentKeywords: [], formatIssues: issues, recommendations };
}

export function ATSScorePanel({ open, onClose }: ATSScorePanelProps) {
  const doc = useResumeStore((s) => s.activeDocument());
  const data = doc?.data ?? null;
  const [analysis, setAnalysis] = useState<ATSAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(true);

  const runAnalysis = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setAnalysis(analyzeResume(data));
      setLoading(false);
    }, 800);
  }, [data]);

  if (!open) return null;

  const scoreColor = analysis ? (analysis.score >= 80 ? "text-green-500" : analysis.score >= 60 ? "text-amber-500" : "text-red-500") : "text-muted-foreground";
  const gradeColor = analysis ? (analysis.grade === "A" || analysis.grade === "B" ? "bg-green-100 text-green-700" : analysis.grade === "C" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700") : "";

  return (
    <div className="fixed right-0 top-16 bottom-0 w-96 bg-background border-l shadow-xl z-40 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b bg-blue-50 dark:bg-blue-950/20">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-500" />
          <span className="font-semibold text-sm">ATS Score Checker</span>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {!analysis ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-950/20 flex items-center justify-center mx-auto">
              <Target className="w-8 h-8 text-blue-500" />
            </div>
            <div>
              <h3 className="font-semibold">Check ATS Compatibility</h3>
              <p className="text-sm text-muted-foreground mt-1">Analyze your resume against ATS scoring criteria</p>
            </div>
            <Button className="bg-blue-500 hover:bg-blue-600" onClick={runAnalysis} disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Target className="w-4 h-4 mr-2" />}
              Run ATS Analysis
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
            </div>

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
                          <p>{issue.issue}</p>
                          <p className="text-xs text-muted-foreground">Fix: {issue.fix}</p>
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
                      <p className="font-medium">{rec.title}</p>
                      <p className="text-xs text-muted-foreground">{rec.description}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            <Button variant="outline" className="w-full" onClick={runAnalysis}>
              <Target className="w-4 h-4 mr-2" /> Re-analyze
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
