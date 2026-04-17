"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Target, Lock, CheckCircle2, Circle, Trophy, Brain, Zap, ArrowRight, BookOpen, BrainCircuit, Layers } from "lucide-react"
import { EXAM_CONFIGS } from "@/lib/exam-config"
import { EXAM_CURRICULA, getCurriculum, getTotalTopics } from "@/lib/exam-curriculum"

interface ExamHistory {
  date: string;
  score: number;
  passed: boolean;
  correct: number;
  total: number;
  timeSpent: number;
  byTopic?: Record<string, { correct: number; total: number }>;
}

const EXAM_STORAGE_KEYS: Record<string, string> = {
  FE_EE: 'feee_exam_history',
  FE_ME: 'fme_exam_history',
  PE_EE: 'peee_exam_history',
  MCAT: 'mcat_exam_history',
  CISSP: 'cissp_exam_history',
  SECURITY_PLUS: 'secplus_exam_history',
  PATENT_BAR: 'patent_exam_history',
};

const EXAM_COLORS: Record<string, string> = {
  FE_EE: 'from-blue-500 to-blue-600',
  FE_ME: 'from-orange-500 to-orange-600',
  PE_EE: 'from-amber-500 to-amber-600',
  MCAT: 'from-teal-500 to-teal-600',
  CISSP: 'from-purple-500 to-purple-600',
  SECURITY_PLUS: 'from-red-500 to-red-600',
  PATENT_BAR: 'from-indigo-500 to-indigo-600',
  SAT: 'from-pink-500 to-pink-600',
  GRE: 'from-green-500 to-green-600',
  GMAT: 'from-cyan-500 to-cyan-600',
  LSAT: 'from-violet-500 to-violet-600',
};

function getHistory(examId: string): ExamHistory[] {
  if (typeof window === 'undefined') return [];
  const key = EXAM_STORAGE_KEYS[examId];
  if (!key) return [];
  try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; }
}

function getCompletedTopics(examId: string): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try { return new Set(JSON.parse(localStorage.getItem(`${examId.toLowerCase()}_completed_topics`) || '[]')); } catch { return new Set(); }
}

export default function LearningPathPage() {
  const [mounted, setMounted] = useState(false);
  const [selectedExam, setSelectedExam] = useState<string | null>(null);

  useEffect(() => { setMounted(true); }, []);

  // Find exams that have curriculum data
  const allExams = Object.keys(EXAM_CONFIGS);
  const examsWithCurriculum = allExams.filter(id => getCurriculum(id).length > 0);

  // Get history for all exams
  const examData = examsWithCurriculum.map(id => {
    const config = EXAM_CONFIGS[id];
    const history = mounted ? getHistory(id) : [];
    const completedTopics = mounted ? getCompletedTopics(id) : new Set<string>();
    const curriculum = getCurriculum(id);
    const totalTopics = getTotalTopics(id);
    const completedCount = completedTopics.size;
    const latestScore = history.length > 0 ? history[history.length - 1].score : null;
    const attempts = history.length;
    return { id, config, history, completedTopics, curriculum, totalTopics, completedCount, latestScore, attempts };
  });

  // Sort: exams with activity first, then by completion
  const sortedExams = [...examData].sort((a, b) => {
    if (a.attempts !== b.attempts) return b.attempts - a.attempts;
    if (a.completedCount !== b.completedCount) return b.completedCount - a.completedCount;
    return a.config.name.localeCompare(b.config.name);
  });

  const activeExam = selectedExam ? examData.find(e => e.id === selectedExam) : null;

  if (!mounted) return <div className="space-y-6"><div className="h-8 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Adaptive Learning Path</h1>
        <p className="text-muted-foreground">Personalized study plan based on your progress and exam performance</p>
      </div>

      {/* Exam Selection Grid */}
      {!selectedExam && (
        <>
          {/* Active Exams (with history) */}
          {sortedExams.some(e => e.attempts > 0) && (
            <div>
              <h2 className="text-lg font-semibold mb-3">Your Active Exams</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {sortedExams.filter(e => e.attempts > 0).map(exam => {
                  const progress = exam.totalTopics > 0 ? Math.round((exam.completedCount / exam.totalTopics) * 100) : 0;
                  return (
                    <Card key={exam.id} className="cursor-pointer hover:shadow-lg transition-all" onClick={() => setSelectedExam(exam.id)}>
                      <CardHeader className="pb-2">
                        <div className={`h-2 w-full rounded-full bg-gradient-to-r ${EXAM_COLORS[exam.id] || 'from-gray-400 to-gray-500'} mb-3`} />
                        <CardTitle className="text-lg">{exam.config.shortName}</CardTitle>
                        <CardDescription>{exam.config.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Topics completed</span>
                            <span className="font-medium">{exam.completedCount} / {exam.totalTopics}</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                            <div className={`h-2 rounded-full bg-gradient-to-r ${EXAM_COLORS[exam.id] || 'from-gray-400 to-gray-500'} transition-all`} style={{ width: `${progress}%` }} />
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{exam.attempts} exam attempts</span>
                            {exam.latestScore !== null && <span>Latest: {exam.latestScore}%</span>}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Available Exams */}
          <div>
            <h2 className="text-lg font-semibold mb-3">
              {sortedExams.some(e => e.attempts > 0) ? 'Other Available Exams' : 'Choose an Exam to Start'}
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {sortedExams.filter(e => e.attempts === 0).map(exam => (
                <Card key={exam.id} className="cursor-pointer hover:shadow-md transition-all" onClick={() => setSelectedExam(exam.id)}>
                  <CardHeader className="pb-2">
                    <div className={`h-1.5 w-full rounded-full bg-gradient-to-r ${EXAM_COLORS[exam.id] || 'from-gray-400 to-gray-500'} mb-2`} />
                    <CardTitle className="text-base">{exam.config.shortName}</CardTitle>
                    <CardDescription className="text-xs">{exam.curriculum.length} sections, {exam.totalTopics} topics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href={`/dashboard/test-prep/${exam.id.toLowerCase()}`}>
                      <Button variant="outline" size="sm" className="w-full gap-1">
                        <BookOpen className="h-3 w-3" /> Start Learning
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Selected Exam Learning Path */}
      {selectedExam && activeExam && (
        <>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setSelectedExam(null)}>← Back</Button>
            <h2 className="text-xl font-bold">{activeExam.config.name} Learning Path</h2>
            <Badge variant="outline">{activeExam.completedCount}/{activeExam.totalTopics} topics</Badge>
          </div>

          {/* Quick Actions */}
          <div className="grid gap-3 md:grid-cols-3">
            <Link href={`/dashboard/test-prep/${selectedExam.toLowerCase()}`}>
              <Card className="p-4 hover:shadow-md transition-all cursor-pointer">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="font-semibold text-sm">Read Lessons</p>
                    <p className="text-xs text-muted-foreground">Study course content</p>
                  </div>
                </div>
              </Card>
            </Link>
            <Link href={`/dashboard/test-prep/${selectedExam.toLowerCase()}`}>
              <Card className="p-4 hover:shadow-md transition-all cursor-pointer">
                <div className="flex items-center gap-3">
                  <BrainCircuit className="h-8 w-8 text-purple-500" />
                  <div>
                    <p className="font-semibold text-sm">Practice QBank</p>
                    <p className="text-xs text-muted-foreground">Targeted question practice</p>
                  </div>
                </div>
              </Card>
            </Link>
            <Link href={`/dashboard/test-prep/${selectedExam.toLowerCase()}`}>
              <Card className="p-4 hover:shadow-md transition-all cursor-pointer">
                <div className="flex items-center gap-3">
                  <Layers className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="font-semibold text-sm">Flashcards</p>
                    <p className="text-xs text-muted-foreground">Quick review cards</p>
                  </div>
                </div>
              </Card>
            </Link>
          </div>

          {/* Section-by-Section Path */}
          <Card>
            <CardHeader>
              <CardTitle>Your Learning Journey</CardTitle>
              <CardDescription>
                {activeExam.curriculum.length} sections with {activeExam.totalTopics} topics.
                {activeExam.attempts > 0 && ` Latest exam: ${activeExam.latestScore}%.`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeExam.curriculum.map((section, sIdx) => {
                  const sectionTopicsDone = section.topics.filter(t => activeExam.completedTopics.has(t.id)).length;
                  const sectionTotal = section.topics.length;
                  const sectionPct = sectionTotal > 0 ? Math.round((sectionTopicsDone / sectionTotal) * 100) : 0;
                  const isComplete = sectionPct === 100;

                  // Check exam performance for this section
                  let examPct: number | null = null;
                  if (activeExam.history.length > 0) {
                    const latest = activeExam.history[activeExam.history.length - 1];
                    if (latest.byTopic && latest.byTopic[String(sIdx)]) {
                      const d = latest.byTopic[String(sIdx)];
                      examPct = Math.round((d.correct / d.total) * 100);
                    }
                  }

                  return (
                    <div key={section.sectionId} className="rounded-lg border p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-10 w-10 items-center justify-center rounded-full ${isComplete ? 'bg-green-500/10' : 'bg-primary/10'}`}>
                            {isComplete ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <Circle className="h-5 w-5 text-primary" />}
                          </div>
                          <div>
                            <h4 className="font-semibold">{section.sectionName}</h4>
                            <p className="text-xs text-muted-foreground">{sectionTopicsDone}/{sectionTotal} topics completed</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {examPct !== null && (
                            <Badge className={examPct >= 70 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}>
                              Exam: {examPct}%
                            </Badge>
                          )}
                          {isComplete && <Badge variant="secondary">Complete</Badge>}
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2 mb-3">
                        <div className={`h-2 rounded-full transition-all ${isComplete ? 'bg-green-500' : 'bg-primary'}`} style={{ width: `${sectionPct}%` }} />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {section.topics.map(topic => {
                          const done = activeExam.completedTopics.has(topic.id);
                          return (
                            <Badge key={topic.id} variant={done ? "default" : "outline"} className={`text-xs ${done ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : ''}`}>
                              {done && <CheckCircle2 className="h-3 w-3 mr-1" />}
                              {topic.title}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          {activeExam.history.length > 0 && (
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Study Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {(() => {
                    const latest = activeExam.history[activeExam.history.length - 1];
                    const recs: { text: string; priority: string }[] = [];
                    if (latest.byTopic) {
                      const weakSections = Object.entries(latest.byTopic)
                        .map(([tid, d]) => ({ tid: Number(tid), pct: Math.round((d.correct / d.total) * 100) }))
                        .filter(s => s.pct < 60)
                        .sort((a, b) => a.pct - b.pct);
                      weakSections.forEach(ws => {
                        const section = activeExam.curriculum[ws.tid];
                        if (section) {
                          recs.push({ text: `Focus on ${section.sectionName} (${ws.pct}%) — review the lesson content and practice QBank questions for this section.`, priority: 'high' });
                        }
                      });
                    }
                    if (!latest.passed) {
                      recs.push({ text: `Your latest score was ${latest.score}%. Target ${activeExam.config.passingInfo || '70%+'} by focusing on weak sections.`, priority: 'medium' });
                    }
                    const unfinishedTopics = activeExam.totalTopics - activeExam.completedCount;
                    if (unfinishedTopics > 0) {
                      recs.push({ text: `${unfinishedTopics} topics not yet marked complete. Read through remaining lessons to build a complete foundation.`, priority: 'low' });
                    }
                    if (recs.length === 0) {
                      recs.push({ text: 'You\'re making great progress! Keep practicing with full exams to maintain your readiness.', priority: 'low' });
                    }
                    return recs.map((r, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <div className={`mt-0.5 h-1.5 w-1.5 rounded-full ${r.priority === 'high' ? 'bg-red-500' : r.priority === 'medium' ? 'bg-amber-500' : 'bg-green-500'}`} />
                        <span>{r.text}</span>
                      </li>
                    ));
                  })()}
                </ul>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
