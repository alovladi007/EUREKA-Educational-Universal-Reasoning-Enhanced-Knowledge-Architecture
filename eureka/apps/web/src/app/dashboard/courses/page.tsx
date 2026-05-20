"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, BookOpen, Clock, Star, Play, Layers, BrainCircuit, Trophy } from "lucide-react"
import { EXAM_CONFIGS, EXAM_TYPE_LIST } from "@/lib/exam-config"
import { getCurriculum, getTotalTopics } from "@/lib/exam-curriculum"

interface ExamHistory {
  date: string; score: number; passed: boolean; correct: number; total: number; timeSpent: number;
}

const STORAGE_KEYS: Record<string, string> = {
  FE_EE: 'feee_exam_history', FE_ME: 'fme_exam_history', PE_EE: 'peee_exam_history',
  MCAT: 'mcat_exam_history', CISSP: 'cissp_exam_history',
  SECURITY_PLUS: 'secplus_exam_history', PATENT_BAR: 'patent_exam_history',
};

const EXAM_ICONS: Record<string, string> = {
  MCAT: 'from-teal-500 to-cyan-600', CISSP: 'from-purple-500 to-violet-600',
  FE_EE: 'from-blue-500 to-blue-600', FE_ME: 'from-orange-500 to-red-600',
  PE_EE: 'from-amber-500 to-yellow-600', SECURITY_PLUS: 'from-red-500 to-rose-600',
  PATENT_BAR: 'from-indigo-500 to-indigo-600', SAT: 'from-pink-500 to-pink-600',
  GRE: 'from-green-500 to-emerald-600', GMAT: 'from-cyan-500 to-sky-600',
  LSAT: 'from-violet-500 to-purple-600',
};

const HAS_CONTENT: Set<string> = new Set(['MCAT', 'CISSP', 'FE_EE', 'FE_ME', 'PE_EE', 'SECURITY_PLUS', 'PATENT_BAR']);

function getHistory(examId: string): ExamHistory[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(STORAGE_KEYS[examId] || '') || '[]'); } catch { return []; }
}

function getCompletedCount(examId: string): number {
  if (typeof window === 'undefined') return 0;
  try { return JSON.parse(localStorage.getItem(`${examId.toLowerCase()}_completed_topics`) || '[]').length; } catch { return 0; }
}

export default function CoursesPage() {
  const [activeTab, setActiveTab] = useState<"enrolled" | "available">("enrolled");
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const allExams = EXAM_TYPE_LIST.map(config => {
    const curriculum = getCurriculum(config.id);
    const totalTopics = getTotalTopics(config.id);
    const history = mounted ? getHistory(config.id) : [];
    const completedTopics = mounted ? getCompletedCount(config.id) : 0;
    const hasContent = HAS_CONTENT.has(config.id);
    const isEnrolled = history.length > 0 || completedTopics > 0;
    const latestScore = history.length > 0 ? history[history.length - 1].score : null;
    const totalAttempts = history.length;
    const progress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
    return { config, curriculum, totalTopics, history, completedTopics, hasContent, isEnrolled, latestScore, totalAttempts, progress };
  });

  const enrolled = allExams.filter(e => e.isEnrolled);
  const available = allExams.filter(e => !e.isEnrolled);

  const filtered = (activeTab === "enrolled" ? enrolled : available).filter(e =>
    !searchQuery || e.config.name.toLowerCase().includes(searchQuery.toLowerCase()) || e.config.shortName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Courses</h1>
          <p className="text-muted-foreground">Your exam prep courses and study progress</p>
        </div>
        <Link href="/dashboard/test-prep">
          <Button>Browse All Exams</Button>
        </Link>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search courses..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2 border-b">
        <button onClick={() => setActiveTab("enrolled")} className={`px-4 py-2 font-medium transition-colors ${activeTab === "enrolled" ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground"}`}>
          In Progress ({enrolled.length})
        </button>
        <button onClick={() => setActiveTab("available")} className={`px-4 py-2 font-medium transition-colors ${activeTab === "available" ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground"}`}>
          Available ({available.length})
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((exam) => (
          <Card key={exam.config.id} className="flex flex-col">
            <CardHeader>
              <div className={`mb-3 h-24 rounded-lg bg-gradient-to-br ${EXAM_ICONS[exam.config.id] || 'from-gray-400 to-gray-500'} flex items-center justify-center`}>
                <BookOpen className="h-10 w-10 text-white" />
              </div>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="line-clamp-1">{exam.config.name}</CardTitle>
                  <CardDescription className="mt-1">{exam.config.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              <div className="flex flex-wrap gap-2 text-xs">
                <Badge variant="outline"><BookOpen className="h-3 w-3 mr-1" />{exam.curriculum.length} sections</Badge>
                <Badge variant="outline"><Layers className="h-3 w-3 mr-1" />{exam.totalTopics} topics</Badge>
                <Badge variant="outline"><Clock className="h-3 w-3 mr-1" />{Math.round(exam.config.totalDuration / 60)}h exam</Badge>
                {exam.hasContent && <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs">Content ready</Badge>}
              </div>

              {exam.isEnrolled && (
                <>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Topics completed</span>
                      <span className="font-medium">{exam.completedTopics}/{exam.totalTopics}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                      <div className={`h-2 rounded-full bg-gradient-to-r ${EXAM_ICONS[exam.config.id] || 'from-gray-400 to-gray-500'} transition-all`} style={{ width: `${exam.progress}%` }} />
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{exam.totalAttempts} exam attempts</span>
                    {exam.latestScore !== null && (
                      <span className="flex items-center gap-1">
                        <Trophy className="h-3 w-3" /> Latest: {exam.latestScore}%
                      </span>
                    )}
                  </div>
                </>
              )}

              {!exam.isEnrolled && (
                <div className="rounded-lg bg-secondary/50 p-3 text-center">
                  <p className="text-sm text-muted-foreground">
                    {exam.config.totalQuestions} questions &middot; {exam.config.scoreRange.label}
                    {exam.config.passingInfo && <><br />{exam.config.passingInfo}</>}
                  </p>
                </div>
              )}

              <Link href={`/dashboard/test-prep/${exam.config.id.toLowerCase()}`}>
                <Button className="w-full gap-2" variant={exam.isEnrolled ? "default" : "outline"}>
                  <Play className="h-4 w-4" />
                  {exam.isEnrolled ? "Continue Studying" : "Start Course"}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            {searchQuery ? `No courses match "${searchQuery}"` : activeTab === "enrolled" ? "No courses started yet. Browse available exams to begin!" : "All courses are in progress!"}
          </div>
        )}
      </div>
    </div>
  )
}
