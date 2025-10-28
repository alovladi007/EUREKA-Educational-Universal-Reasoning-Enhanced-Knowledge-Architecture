"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  LineChart,
  TrendingUp,
  TrendingDown,
  Clock,
  Target,
  Award,
  Brain,
  Zap
} from "lucide-react"

export default function AnalyticsPage() {
  const overallStats = {
    progress: 73,
    timeSpent: "42h 15m",
    averageScore: 87,
    coursesActive: 4,
    streak: 12,
    rank: "Top 15%",
  }

  const performanceData = [
    { course: "Advanced Calculus", score: 85, trend: "up", change: 5 },
    { course: "Data Structures", score: 92, trend: "up", change: 8 },
    { course: "Organic Chemistry", score: 84, trend: "down", change: 3 },
    { course: "Physics", score: 88, trend: "up", change: 2 },
  ]

  const strengths = [
    { skill: "Problem Solving", level: 92, category: "Cognitive" },
    { skill: "Mathematical Reasoning", level: 88, category: "Analytical" },
    { skill: "Critical Thinking", level: 85, category: "Cognitive" },
  ]

  const areasForImprovement = [
    { skill: "Time Management", level: 65, category: "Organizational" },
    { skill: "Organic Chemistry Concepts", level: 72, category: "Subject Knowledge" },
    { skill: "Lab Techniques", level: 68, category: "Practical" },
  ]

  const weeklyActivity = [
    { day: "Mon", hours: 4.5 },
    { day: "Tue", hours: 3.2 },
    { day: "Wed", hours: 5.1 },
    { day: "Thu", hours: 4.8 },
    { day: "Fri", hours: 3.9 },
    { day: "Sat", hours: 6.2 },
    { day: "Sun", hours: 2.8 },
  ]

  const maxHours = Math.max(...weeklyActivity.map(d => d.hours))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Learning Analytics</h1>
        <p className="text-muted-foreground">Track your progress and identify areas for growth</p>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.progress}%</div>
            <Progress value={overallStats.progress} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Invested</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.timeSpent}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Score</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.averageScore}%</div>
            <p className="text-xs text-green-500">+5% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.coursesActive}</div>
            <p className="text-xs text-muted-foreground">In progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Learning Streak</CardTitle>
            <Zap className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.streak} days</div>
            <p className="text-xs text-muted-foreground">Keep it going!</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Class Rank</CardTitle>
            <Award className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.rank}</div>
            <p className="text-xs text-muted-foreground">In cohort</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Performance by Course */}
        <Card>
          <CardHeader>
            <CardTitle>Performance by Course</CardTitle>
            <CardDescription>Your scores and trends across all courses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {performanceData.map((item) => (
                <div key={item.course} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.course}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold">{item.score}%</span>
                      {item.trend === "up" ? (
                        <div className="flex items-center gap-1 text-green-500">
                          <TrendingUp className="h-4 w-4" />
                          <span className="text-xs">+{item.change}%</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-red-500">
                          <TrendingDown className="h-4 w-4" />
                          <span className="text-xs">-{item.change}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <Progress value={item.score} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Weekly Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Activity</CardTitle>
            <CardDescription>Time spent learning this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {weeklyActivity.map((day) => (
                <div key={day.day} className="flex items-center gap-3">
                  <span className="w-12 text-sm font-medium">{day.day}</span>
                  <div className="flex-1">
                    <div
                      className="h-8 rounded bg-primary transition-all"
                      style={{ width: `${(day.hours / maxHours) * 100}%` }}
                    />
                  </div>
                  <span className="w-12 text-right text-sm text-muted-foreground">
                    {day.hours}h
                  </span>
                </div>
              ))}
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total this week</span>
                  <span className="font-bold">
                    {weeklyActivity.reduce((sum, d) => sum + d.hours, 0).toFixed(1)}h
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Strengths */}
        <Card>
          <CardHeader>
            <CardTitle>Your Strengths</CardTitle>
            <CardDescription>Skills where you excel</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {strengths.map((item) => (
                <div key={item.skill} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{item.skill}</p>
                      <p className="text-xs text-muted-foreground">{item.category}</p>
                    </div>
                    <Badge variant="secondary">{item.level}%</Badge>
                  </div>
                  <Progress value={item.level} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Areas for Improvement */}
        <Card>
          <CardHeader>
            <CardTitle>Areas for Improvement</CardTitle>
            <CardDescription>Focus on these to level up</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {areasForImprovement.map((item) => (
                <div key={item.skill} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{item.skill}</p>
                      <p className="text-xs text-muted-foreground">{item.category}</p>
                    </div>
                    <Badge variant="outline">{item.level}%</Badge>
                  </div>
                  <Progress value={item.level} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

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
            <li className="flex items-start gap-2">
              <div className="mt-0.5 h-1.5 w-1.5 rounded-full bg-primary" />
              <span>Spend 30 more minutes on Organic Chemistry to improve your mastery level</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="mt-0.5 h-1.5 w-1.5 rounded-full bg-primary" />
              <span>Practice more problems in Integration Techniques - you're close to mastery!</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="mt-0.5 h-1.5 w-1.5 rounded-full bg-primary" />
              <span>Your learning streak is strong! Keep studying daily to maintain momentum</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
