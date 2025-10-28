"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Search, Filter, BookOpen, Clock, Users, Star, Play } from "lucide-react"

export default function CoursesPage() {
  const [activeTab, setActiveTab] = useState<"enrolled" | "available">("enrolled")

  const enrolledCourses = [
    {
      id: "1",
      title: "Advanced Calculus",
      instructor: "Dr. Sarah Johnson",
      progress: 67,
      nextLesson: "Integration Techniques",
      totalLessons: 48,
      completedLessons: 32,
      thumbnail: "/courses/calc.jpg",
      tier: "ug",
      rating: 4.8,
    },
    {
      id: "2",
      title: "Data Structures & Algorithms",
      instructor: "Prof. Michael Chen",
      progress: 45,
      nextLesson: "Binary Search Trees",
      totalLessons: 56,
      completedLessons: 25,
      thumbnail: "/courses/dsa.jpg",
      tier: "ug",
      rating: 4.9,
    },
    {
      id: "3",
      title: "Organic Chemistry I",
      instructor: "Dr. Emily Rodriguez",
      progress: 82,
      nextLesson: "Reaction Mechanisms",
      totalLessons: 40,
      completedLessons: 33,
      thumbnail: "/courses/chem.jpg",
      tier: "ug",
      rating: 4.7,
    },
  ]

  const availableCourses = [
    {
      id: "4",
      title: "Machine Learning Fundamentals",
      instructor: "Dr. David Park",
      description: "Learn the basics of ML, from linear regression to neural networks",
      duration: "12 weeks",
      students: 1243,
      tier: "ug",
      rating: 4.9,
    },
    {
      id: "5",
      title: "Constitutional Law",
      instructor: "Prof. James Williams",
      description: "Comprehensive study of constitutional principles and case law",
      duration: "14 weeks",
      students: 856,
      tier: "law",
      rating: 4.8,
    },
    {
      id: "6",
      title: "Financial Modeling",
      instructor: "Dr. Lisa Thompson",
      description: "Build financial models for business decision-making",
      duration: "8 weeks",
      students: 2134,
      tier: "mba",
      rating: 4.7,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Courses</h1>
          <p className="text-muted-foreground">Manage and explore your learning journey</p>
        </div>
        <Button>Browse All Courses</Button>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search courses..." className="pl-9" />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab("enrolled")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "enrolled"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Enrolled ({enrolledCourses.length})
        </button>
        <button
          onClick={() => setActiveTab("available")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "available"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Available ({availableCourses.length})
        </button>
      </div>

      {/* Enrolled Courses */}
      {activeTab === "enrolled" && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {enrolledCourses.map((course) => (
            <Card key={course.id} className="flex flex-col">
              <CardHeader>
                <div className="mb-3 h-32 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <BookOpen className="h-12 w-12 text-primary" />
                </div>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="line-clamp-1">{course.title}</CardTitle>
                    <CardDescription className="mt-1">{course.instructor}</CardDescription>
                  </div>
                  <Badge variant="secondary">{course.tier.toUpperCase()}</Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} />
                  <p className="text-sm text-muted-foreground">
                    {course.completedLessons} of {course.totalLessons} lessons completed
                  </p>
                </div>

                <div className="rounded-lg bg-secondary/50 p-3">
                  <p className="text-xs font-medium text-muted-foreground">Next Lesson</p>
                  <p className="mt-1 text-sm font-medium">{course.nextLesson}</p>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{course.rating}</span>
                  </div>
                </div>

                <Button className="w-full gap-2">
                  <Play className="h-4 w-4" />
                  Continue Learning
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Available Courses */}
      {activeTab === "available" && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {availableCourses.map((course) => (
            <Card key={course.id} className="flex flex-col">
              <CardHeader>
                <div className="mb-3 h-32 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <BookOpen className="h-12 w-12 text-primary" />
                </div>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="line-clamp-1">{course.title}</CardTitle>
                    <CardDescription className="mt-1">{course.instructor}</CardDescription>
                  </div>
                  <Badge variant="secondary">{course.tier.toUpperCase()}</Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {course.description}
                </p>

                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{course.students.toLocaleString()} students</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{course.rating}</span>
                  </div>
                </div>

                <Button className="w-full" variant="outline">
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
