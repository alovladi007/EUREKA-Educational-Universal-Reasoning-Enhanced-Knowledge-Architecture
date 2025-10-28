"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  BookOpen,
  Brain,
  Trophy,
  Clock,
  TrendingUp,
  Play,
  CheckCircle2,
  AlertCircle
} from "lucide-react"

export default function DashboardPage() {
  // Mock data - would come from API
  const stats = {
    coursesInProgress: 4,
    completedAssignments: 23,
    averageScore: 87,
    timeSpent: "42h 15m",
  }

  const recentCourses = [
    {
      id: "1",
      title: "Advanced Calculus",
      progress: 67,
      nextLesson: "Integration Techniques",
      dueDate: "Tomorrow",
    },
    {
      id: "2",
      title: "Data Structures & Algorithms",
      progress: 45,
      nextLesson: "Binary Search Trees",
      dueDate: "In 3 days",
    },
    {
      id: "3",
      title: "Organic Chemistry",
      progress: 82,
      nextLesson: "Reaction Mechanisms",
      dueDate: "Today",
    },
  ]

  const upcomingAssessments = [
    {
      id: "1",
      title: "Calculus Midterm Exam",
      course: "Advanced Calculus",
      date: "Nov 15, 2024",
      type: "Exam",
    },
    {
      id: "2",
      title: "Algorithm Analysis Quiz",
      course: "Data Structures",
      date: "Nov 12, 2024",
      type: "Quiz",
    },
  ]

  const recentActivity = [
    { id: "1", action: "Completed", item: "Lecture 12: Linear Algebra", time: "2 hours ago" },
    { id: "2", action: "Scored 92%", item: "Quiz: Chemistry Fundamentals", time: "Yesterday" },
    { id: "3", action: "Started", item: "Lab: Binary Trees Implementation", time: "2 days ago" },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold">Welcome back!</h1>
        <p className="text-muted-foreground">Here's what's happening with your learning journey</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Courses in Progress</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.coursesInProgress}</div>
            <p className="text-xs text-muted-foreground">+1 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assignments Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedAssignments}</div>
            <p className="text-xs text-muted-foreground">12% more than average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageScore}%</div>
            <p className="text-xs text-muted-foreground">+5% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Spent Learning</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.timeSpent}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Courses */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Continue Learning</CardTitle>
            <CardDescription>Pick up where you left off</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentCourses.map((course) => (
                <div
                  key={course.id}
                  className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent transition-colors"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{course.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {course.dueDate}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Next: {course.nextLesson}
                    </p>
                    <div className="flex items-center gap-2">
                      <Progress value={course.progress} className="h-2" />
                      <span className="text-sm font-medium">{course.progress}%</span>
                    </div>
                  </div>
                  <Button size="sm" className="ml-4">
                    <Play className="h-4 w-4 mr-2" />
                    Continue
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Assessments */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Assessments</CardTitle>
            <CardDescription>Don't miss these deadlines</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingAssessments.map((assessment) => (
                <div
                  key={assessment.id}
                  className="flex items-start gap-3 rounded-lg border p-3"
                >
                  <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5" />
                  <div className="flex-1 space-y-1">
                    <h4 className="text-sm font-semibold">{assessment.title}</h4>
                    <p className="text-xs text-muted-foreground">{assessment.course}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {assessment.type}
                      </Badge>
                      <span className="text-xs">{assessment.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest achievements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <TrendingUp className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm">
                      <span className="font-medium">{activity.action}</span>{" "}
                      {activity.item}
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-auto flex-col gap-2 p-4">
              <Brain className="h-6 w-6" />
              <span>Ask AI Tutor</span>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 p-4">
              <BookOpen className="h-6 w-6" />
              <span>Browse Courses</span>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 p-4">
              <TrendingUp className="h-6 w-6" />
              <span>View Analytics</span>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 p-4">
              <Trophy className="h-6 w-6" />
              <span>My Achievements</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
