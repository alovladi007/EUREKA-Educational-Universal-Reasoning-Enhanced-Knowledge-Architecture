"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  AlertCircle,
  Trophy,
  FileText,
  Calendar
} from "lucide-react"

export default function AssessmentsPage() {
  const upcomingAssessments = [
    {
      id: "1",
      title: "Calculus Midterm Exam",
      course: "Advanced Calculus",
      type: "Exam",
      dueDate: "2024-11-15T10:00:00",
      duration: 120,
      totalPoints: 100,
      questions: 25,
      status: "not_started",
    },
    {
      id: "2",
      title: "Algorithm Analysis Quiz",
      course: "Data Structures & Algorithms",
      type: "Quiz",
      dueDate: "2024-11-12T14:00:00",
      duration: 30,
      totalPoints: 20,
      questions: 10,
      status: "not_started",
    },
    {
      id: "3",
      title: "Organic Chemistry Lab Report",
      course: "Organic Chemistry I",
      type: "Assignment",
      dueDate: "2024-11-18T23:59:00",
      duration: null,
      totalPoints: 50,
      questions: null,
      status: "in_progress",
    },
  ]

  const completedAssessments = [
    {
      id: "4",
      title: "Linear Algebra Quiz 3",
      course: "Advanced Calculus",
      type: "Quiz",
      completedDate: "2024-11-01",
      score: 18,
      totalPoints: 20,
      grade: "A",
    },
    {
      id: "5",
      title: "Binary Trees Implementation",
      course: "Data Structures & Algorithms",
      type: "Project",
      completedDate: "2024-10-28",
      score: 95,
      totalPoints: 100,
      grade: "A",
    },
    {
      id: "6",
      title: "Chemical Reactions Exam",
      course: "Organic Chemistry I",
      type: "Exam",
      completedDate: "2024-10-25",
      score: 87,
      totalPoints: 100,
      grade: "B+",
    },
  ]

  const stats = {
    totalCompleted: 23,
    averageScore: 87,
    highestGrade: "A",
    upcomingCount: 3,
  }

  const formatDueDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = date.getTime() - now.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

    if (days > 1) return `In ${days} days`
    if (days === 1) return "Tomorrow"
    if (hours > 0) return `In ${hours} hours`
    return "Due soon"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Assessments</h1>
        <p className="text-muted-foreground">Track your assignments, quizzes, and exams</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCompleted}</div>
            <p className="text-xs text-muted-foreground">Total assessments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageScore}%</div>
            <p className="text-xs text-muted-foreground">Across all courses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Highest Grade</CardTitle>
            <Trophy className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.highestGrade}</div>
            <p className="text-xs text-muted-foreground">Best performance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingCount}</div>
            <p className="text-xs text-muted-foreground">Due this week</p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Assessments */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Assessments</CardTitle>
          <CardDescription>Don't miss these deadlines</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingAssessments.map((assessment) => (
              <div
                key={assessment.id}
                className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <ClipboardList className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold">{assessment.title}</h4>
                    <p className="text-sm text-muted-foreground">{assessment.course}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDueDate(assessment.dueDate)}</span>
                      </div>
                      {assessment.duration && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{assessment.duration} min</span>
                        </div>
                      )}
                      {assessment.questions && (
                        <span>{assessment.questions} questions</span>
                      )}
                      <span>{assessment.totalPoints} points</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant={assessment.type === "Exam" ? "destructive" : "secondary"}>
                    {assessment.type}
                  </Badge>
                  {assessment.status === "in_progress" ? (
                    <Button>Continue</Button>
                  ) : (
                    <Button variant="outline">Start</Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Completed Assessments */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Submissions</CardTitle>
          <CardDescription>Your completed assessments and grades</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {completedAssessments.map((assessment) => (
              <div
                key={assessment.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex items-start gap-4 flex-1">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <h4 className="font-semibold">{assessment.title}</h4>
                    <p className="text-sm text-muted-foreground">{assessment.course}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{assessment.type}</Badge>
                      <span className="text-xs text-muted-foreground">
                        Submitted on {new Date(assessment.completedDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-2xl font-bold">{assessment.score}/{assessment.totalPoints}</div>
                    <Badge className="mt-1">{assessment.grade}</Badge>
                  </div>
                  <Button variant="ghost" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
