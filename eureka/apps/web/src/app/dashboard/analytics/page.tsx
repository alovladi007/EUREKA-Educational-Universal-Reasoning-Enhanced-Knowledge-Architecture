"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  TrendingUp,
  TrendingDown,
  Clock,
  Target,
  Award,
  Brain,
  Zap,
  BarChart3,
  BookOpen,
  ArrowRight,
} from "lucide-react"

interface ExamHistory {
  date: string;
  score: number;
  passed: boolean;
  correct: number;
  total: number;
  timeSpent: number;
  byTopic?: Record<string, { correct: number; total: number }>;
}

const EXAM_KEYS: { key: string; name: string; color: string; route: string }[] = [
  { key: 'feee_exam_history', name: 'FE Electrical', color: 'bg-blue-500', route: '/dashboard/test-prep/fe_ee' },
  { key: 'fme_exam_history', name: 'FE Mechanical', color: 'bg-orange-500', route: '/dashboard/test-prep/fe_me' },
  { key: 'peee_exam_history', name: 'PE Electrical', color: 'bg-amber-500', route: '/dashboard/test-prep/pe_ee' },
  { key: 'mcat_exam_history', name: 'MCAT', color: 'bg-teal-500', route: '/dashboard/test-prep/mcat' },
  { key: 'cissp_exam_history', name: 'CISSP', color: 'bg-purple-500', route: '/dashboard/test-prep/cissp' },
  { key: 'secplus_exam_history', name: 'Security+', color: 'bg-red-500', route: '/dashboard/test-prep/security_plus' },
  { key: 'patent_exam_history', name: 'Patent Bar', color: 'bg-indigo-500', route: '/dashboard/test-prep/patent_bar' },
];

function getExamHistories(): { name: string; color: string; route: string; history: ExamHistory[] }[] {
  if (typeof window === 'undefined') return [];
  return EXAM_KEYS.map(({ key, name, color, route }) => {
    try {
      const raw = localStorage.getItem(key);
      return { name, color, route, history: raw ? JSON.parse(raw) : [] };
    } catch { return { name, color, route, history: [] }; }
  }).filter(e => e.history.length > 0);
}

export default function AnalyticsPage() {
  const [exams, setExams] = useState<ReturnType<typeof getExamHistories>>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setExams(getExamHistories());
    setMounted(true);
  }, []);

  // Aggregate stats
  const totalAttempts = exams.reduce((s, e) => s + e.history.length, 0);
  const allScores = exams.flatMap(e => e.history.map(h => h.score));
  const avgScore = allScores.length > 0 ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length) : 0;
  const bestScore = allScores.length > 0 ? Math.max(...allScores) : 0;
  const totalTimeSec = exams.reduce((s, e) => s + e.history.reduce((t, h) => t + (h.timeSpent || 0), 0), 0);
  const totalTimeHours = (totalTimeSec / 3600).toFixed(1);
  const totalCorrect = exams.reduce((s, e) => s + e.history.reduce((t, h) => t + h.correct, 0), 0);
  const totalQuestions = exams.reduce((s, e) => s + e.history.reduce((t, h) => t + h.total, 0), 0);
  const overallAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  const passCount = exams.reduce((s, e) => s + e.history.filter(h => h.passed).length, 0);
  const activeExams = exams.length;

  // Recent activity (last 7 attempts across all exams, sorted by date)
  const recentAttempts = exams
    .flatMap(e => e.history.map(h => ({ ...h, examName: e.name, color: e.color })))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  // Per-exam performance
  const examPerformance = exams.map(e => {
    const scores = e.history.map(h => h.score);
    const avg = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    const latest = scores[scores.length - 1] || 0;
    const prev = scores.length >= 2 ? scores[scores.length - 2] : latest;
    const trend = latest - prev;
    return { ...e, avgScore: avg, latestScore: latest, trend, attempts: e.history.length };
  }).sort((a, b) => b.attempts - a.attempts);

  // Strengths and weaknesses from latest attempts
  const strengths: { exam: string; topic: string; pct: number }[] = [];
  const weaknesses: { exam: string; topic: string; pct: number }[] = [];
  exams.forEach(e => {
    const latest = e.history[e.history.length - 1];
    if (latest?.byTopic) {
      Object.entries(latest.byTopic).forEach(([tid, data]) => {
        const pct = Math.round((data.correct / data.total) * 100);
        const entry = { exam: e.name, topic: `Section ${Number(tid) + 1}`, pct };
        if (pct >= 80) strengths.push(entry);
        if (pct < 60) weaknesses.push(entry);
      });
    }
  });
  strengths.sort((a, b) => b.pct - a.pct);
  weaknesses.sort((a, b) => a.pct - b.pct);

  // Score trend over time (all attempts chronologically)
  const scoreTrend = exams
    .flatMap(e => e.history.map(h => ({ date: h.date, score: h.score, exam: e.name })))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-20);

  if (!mounted) return <div className="space-y-6"><div className="h-8 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" /></div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Learning Analytics</h1>
        <p className="text-muted-foreground">Real performance data from your exam practice sessions</p>
      </div>

      {totalAttempts === 0 ? (
        <Card className="p-12 text-center">
          <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">No Data Yet</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Take practice exams in any test prep to see real analytics here. Your scores, trends, strengths, and weaknesses will appear automatically.
          </p>
          <Link href="/dashboard/test-prep">
            <Button size="lg" className="gap-2">
              <BookOpen className="h-5 w-5" /> Go to Test Prep <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </Card>
      ) : (
        <>
          {/* Overview Stats */}
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Attempts</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalAttempts}</div>
                <p className="text-xs text-muted-foreground">Across {activeExams} exams</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{avgScore}%</div>
                <p className="text-xs text-muted-foreground">All exams combined</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Best Score</CardTitle>
                <Zap className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{bestScore}%</div>
                <p className="text-xs text-muted-foreground">Personal best</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Accuracy</CardTitle>
                <Brain className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overallAccuracy}%</div>
                <p className="text-xs text-muted-foreground">{totalCorrect.toLocaleString()} / {totalQuestions.toLocaleString()} correct</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Time Invested</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalTimeHours}h</div>
                <p className="text-xs text-muted-foreground">Practice time</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
                <Award className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{passCount}/{totalAttempts}</div>
                <p className="text-xs text-muted-foreground">{totalAttempts > 0 ? Math.round((passCount / totalAttempts) * 100) : 0}% passing</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Performance by Exam */}
            <Card>
              <CardHeader>
                <CardTitle>Performance by Exam</CardTitle>
                <CardDescription>Your scores and trends across all exams</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {examPerformance.map((exam) => (
                    <Link key={exam.name} href={exam.route}>
                      <div className="space-y-2 p-3 rounded-lg hover:bg-accent transition-colors cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`h-3 w-3 rounded-full ${exam.color}`} />
                            <span className="text-sm font-medium">{exam.name}</span>
                            <Badge variant="outline" className="text-xs">{exam.attempts} attempts</Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold">{exam.latestScore}%</span>
                            {exam.trend > 0 ? (
                              <div className="flex items-center gap-1 text-green-500">
                                <TrendingUp className="h-4 w-4" />
                                <span className="text-xs">+{exam.trend}%</span>
                              </div>
                            ) : exam.trend < 0 ? (
                              <div className="flex items-center gap-1 text-red-500">
                                <TrendingDown className="h-4 w-4" />
                                <span className="text-xs">{exam.trend}%</span>
                              </div>
                            ) : (
                              <span className="text-xs text-muted-foreground">--</span>
                            )}
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                          <div className={`h-2 rounded-full ${exam.color} transition-all`} style={{ width: `${exam.avgScore}%` }} />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Score Trend Over Time */}
            <Card>
              <CardHeader>
                <CardTitle>Score Trend</CardTitle>
                <CardDescription>Last {scoreTrend.length} attempts across all exams</CardDescription>
              </CardHeader>
              <CardContent>
                {scoreTrend.length > 0 ? (
                  <div className="space-y-1">
                    <div className="flex items-end gap-1 h-48">
                      {scoreTrend.map((attempt, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10">
                            {attempt.exam}: {attempt.score}%
                          </div>
                          <div
                            className={`w-full rounded-t transition-all ${attempt.score >= 70 ? 'bg-green-500' : attempt.score >= 50 ? 'bg-amber-500' : 'bg-red-500'} group-hover:opacity-80`}
                            style={{ height: `${attempt.score}%` }}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                      <span>Oldest</span>
                      <span>Most recent</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">Take more exams to see trends</p>
                )}
              </CardContent>
            </Card>

            {/* Strengths */}
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">Your Strengths</CardTitle>
                <CardDescription>Sections where you scored 80%+</CardDescription>
              </CardHeader>
              <CardContent>
                {strengths.length > 0 ? (
                  <div className="space-y-3">
                    {strengths.slice(0, 8).map((s, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{s.topic}</p>
                          <p className="text-xs text-muted-foreground">{s.exam}</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">{s.pct}%</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">Take full exams to identify strengths</p>
                )}
              </CardContent>
            </Card>

            {/* Weaknesses */}
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Areas for Improvement</CardTitle>
                <CardDescription>Sections where you scored below 60%</CardDescription>
              </CardHeader>
              <CardContent>
                {weaknesses.length > 0 ? (
                  <div className="space-y-3">
                    {weaknesses.slice(0, 8).map((w, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{w.topic}</p>
                          <p className="text-xs text-muted-foreground">{w.exam}</p>
                        </div>
                        <Badge variant="destructive">{w.pct}%</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    {strengths.length > 0 ? 'No weak sections — great work!' : 'Take full exams to identify areas for improvement'}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest practice exam attempts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentAttempts.map((attempt, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                    <div className="flex items-center gap-3">
                      <div className={`h-3 w-3 rounded-full ${(attempt as any).color}`} />
                      <div>
                        <p className="text-sm font-medium">{(attempt as any).examName}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(attempt.date).toLocaleDateString()} &middot; {attempt.correct}/{attempt.total} correct
                          {attempt.timeSpent > 0 && ` · ${Math.round(attempt.timeSpent / 60)}min`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold">{attempt.score}%</span>
                      <Badge className={attempt.passed ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}>
                        {attempt.passed ? 'PASS' : 'REVIEW'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Personalized Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {weaknesses.length > 0 && (
                  <li className="flex items-start gap-2">
                    <div className="mt-0.5 h-1.5 w-1.5 rounded-full bg-red-500" />
                    <span>Focus on <strong>{weaknesses[0].topic}</strong> in {weaknesses[0].exam} — currently at {weaknesses[0].pct}%. Practice more questions in this section.</span>
                  </li>
                )}
                {examPerformance.some(e => e.trend < 0) && (
                  <li className="flex items-start gap-2">
                    <div className="mt-0.5 h-1.5 w-1.5 rounded-full bg-amber-500" />
                    <span>Your score dropped in <strong>{examPerformance.find(e => e.trend < 0)?.name}</strong> — review missed questions from your last attempt.</span>
                  </li>
                )}
                {examPerformance.some(e => e.attempts === 1) && (
                  <li className="flex items-start gap-2">
                    <div className="mt-0.5 h-1.5 w-1.5 rounded-full bg-blue-500" />
                    <span>Take another <strong>{examPerformance.find(e => e.attempts === 1)?.name}</strong> exam — one attempt isn't enough to gauge readiness.</span>
                  </li>
                )}
                <li className="flex items-start gap-2">
                  <div className="mt-0.5 h-1.5 w-1.5 rounded-full bg-green-500" />
                  <span>You've completed <strong>{totalAttempts}</strong> practice exams with <strong>{overallAccuracy}%</strong> accuracy. {overallAccuracy >= 70 ? 'Great progress — keep it up!' : 'Keep practicing to improve your score.'}</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
