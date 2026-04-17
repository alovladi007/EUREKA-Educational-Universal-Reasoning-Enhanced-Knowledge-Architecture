"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, AlertCircle, Trophy, Clock, BrainCircuit, Target, ArrowRight, BarChart3 } from "lucide-react"
import { EXAM_CONFIGS, EXAM_TYPE_LIST } from "@/lib/exam-config"

interface ExamHistory {
  date: string; score: number; passed: boolean; correct: number; total: number; timeSpent: number;
  byTopic?: Record<string, { correct: number; total: number }>;
}

const STORAGE_KEYS: Record<string, string> = {
  FE_EE: 'feee_exam_history', FE_ME: 'fme_exam_history', PE_EE: 'peee_exam_history',
  MCAT: 'mcat_exam_history', CISSP: 'cissp_exam_history',
  SECURITY_PLUS: 'secplus_exam_history', PATENT_BAR: 'patent_exam_history',
};

const QBANK_SIZES: Record<string, number> = {
  MCAT: 500, CISSP: 400, PE_EE: 400, FE_EE: 605, FE_ME: 555,
  PATENT_BAR: 300, SECURITY_PLUS: 300,
};

function getHistory(examId: string): ExamHistory[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(STORAGE_KEYS[examId] || '') || '[]'); } catch { return []; }
}

export default function AssessmentsPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  // Gather all exam histories
  const examData = Object.entries(STORAGE_KEYS).map(([examId, key]) => {
    const config = EXAM_CONFIGS[examId];
    const history = mounted ? getHistory(examId) : [];
    const qbankSize = QBANK_SIZES[examId] || 0;
    return { examId, config, history, qbankSize };
  }).filter(e => e.config);

  // Recent submissions (all attempts sorted by date)
  const allAttempts = examData.flatMap(e =>
    e.history.map(h => ({ ...h, examId: e.examId, examName: e.config.name, shortName: e.config.shortName }))
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Stats
  const totalCompleted = allAttempts.length;
  const avgScore = totalCompleted > 0 ? Math.round(allAttempts.reduce((s, a) => s + a.score, 0) / totalCompleted) : 0;
  const bestScore = totalCompleted > 0 ? Math.max(...allAttempts.map(a => a.score)) : 0;
  const passCount = allAttempts.filter(a => a.passed).length;

  // Available practice exams (exams with qbanks)
  const availableExams = examData.filter(e => e.qbankSize > 0);

  if (!mounted) return <div className="space-y-6"><div className="h-8 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Assessments</h1>
        <p className="text-muted-foreground">Practice exams, QBank sessions, and performance tracking</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCompleted}</div>
            <p className="text-xs text-muted-foreground">Total practice exams</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgScore}%</div>
            <p className="text-xs text-muted-foreground">Across all exams</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Best Score</CardTitle>
            <Trophy className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bestScore}%</div>
            <p className="text-xs text-muted-foreground">Personal best</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
            <Target className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCompleted > 0 ? Math.round((passCount / totalCompleted) * 100) : 0}%</div>
            <p className="text-xs text-muted-foreground">{passCount}/{totalCompleted} passed</p>
          </CardContent>
        </Card>
      </div>

      {/* Available Practice Exams */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><BrainCircuit className="h-5 w-5" /> Available Practice Exams</CardTitle>
          <CardDescription>Start a QBank session or full practice exam</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {availableExams.map(exam => {
              const attempts = exam.history.length;
              const latest = attempts > 0 ? exam.history[exam.history.length - 1] : null;
              return (
                <div key={exam.examId} className="rounded-lg border p-4 hover:bg-accent transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{exam.config.shortName}</h4>
                    <Badge variant="outline" className="text-xs">{exam.qbankSize} questions</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    {exam.config.totalQuestions} Qs &middot; {Math.round(exam.config.totalDuration / 60)}h &middot; {exam.config.scoreRange.label}
                  </p>
                  {latest && (
                    <div className="flex items-center gap-2 mb-3 text-xs">
                      <Badge className={latest.passed ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}>
                        Last: {latest.score}%
                      </Badge>
                      <span className="text-muted-foreground">{attempts} attempts</span>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Link href={`/dashboard/test-prep/${exam.examId.toLowerCase()}`} className="flex-1">
                      <Button size="sm" className="w-full gap-1"><BrainCircuit className="h-3 w-3" /> QBank</Button>
                    </Link>
                    <Link href={`/dashboard/test-prep/${exam.examId.toLowerCase()}`} className="flex-1">
                      <Button size="sm" variant="outline" className="w-full gap-1"><Trophy className="h-3 w-3" /> Full Exam</Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Submissions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Submissions</CardTitle>
          <CardDescription>Your completed practice exams and scores</CardDescription>
        </CardHeader>
        <CardContent>
          {allAttempts.length > 0 ? (
            <div className="space-y-3">
              {allAttempts.slice(0, 15).map((attempt, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${attempt.passed ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                      {attempt.passed ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <AlertCircle className="h-5 w-5 text-red-500" />}
                    </div>
                    <div className="flex-1 space-y-1">
                      <h4 className="font-semibold">{(attempt as any).examName} — Practice Exam</h4>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{new Date(attempt.date).toLocaleDateString()}</span>
                        <span>{attempt.correct}/{attempt.total} correct</span>
                        {attempt.timeSpent > 0 && (
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{Math.round(attempt.timeSpent / 60)} min</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-2xl font-bold">{attempt.score}%</div>
                      <Badge className={attempt.passed ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}>
                        {attempt.passed ? 'PASS' : 'REVIEW'}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No assessments completed yet</h3>
              <p className="text-muted-foreground text-sm mb-4">Start a practice exam above to track your progress here.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
