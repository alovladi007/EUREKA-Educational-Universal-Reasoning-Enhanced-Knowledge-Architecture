"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Target, Lock, CheckCircle2, Circle, Trophy, Brain, Zap } from "lucide-react"

export default function LearningPathPage() {
  const modules = [
    {
      id: "1",
      title: "Foundations",
      skills: ["Basic Algebra", "Functions", "Equations"],
      masteryScore: 95,
      isUnlocked: true,
      isCompleted: true,
    },
    {
      id: "2",
      title: "Derivatives",
      skills: ["Limits", "Differentiation Rules", "Chain Rule"],
      masteryScore: 88,
      isUnlocked: true,
      isCompleted: true,
    },
    {
      id: "3",
      title: "Integration",
      skills: ["Definite Integrals", "U-Substitution", "Integration by Parts"],
      masteryScore: 72,
      isUnlocked: true,
      isCompleted: false,
    },
    {
      id: "4",
      title: "Applications",
      skills: ["Area Under Curve", "Volumes", "Arc Length"],
      masteryScore: 0,
      isUnlocked: true,
      isCompleted: false,
    },
    {
      id: "5",
      title: "Advanced Topics",
      skills: ["Differential Equations", "Series", "Taylor Series"],
      masteryScore: 0,
      isUnlocked: false,
      isCompleted: false,
    },
  ]

  const skillKnowledge = [
    { name: "Definite Integrals", state: "mastered", probability: 0.92 },
    { name: "U-Substitution", state: "practiced", probability: 0.78 },
    { name: "Integration by Parts", state: "learning", probability: 0.45 },
  ]

  const recommendations = [
    {
      title: "Practice Integration by Parts",
      description: "Complete 5 more problems to reach mastery",
      priority: "high",
      estimatedTime: "30 min",
    },
    {
      title: "Review U-Substitution",
      description: "Strengthen your understanding with mixed problems",
      priority: "medium",
      estimatedTime: "20 min",
    },
    {
      title: "Explore Applications Module",
      description: "You're ready to move to the next module!",
      priority: "low",
      estimatedTime: "45 min",
    },
  ]

  const getStateColor = (state: string) => {
    switch (state) {
      case "mastered":
        return "text-green-500"
      case "practiced":
        return "text-blue-500"
      case "learning":
        return "text-orange-500"
      default:
        return "text-muted-foreground"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Adaptive Learning Path</h1>
        <p className="text-muted-foreground">Personalized curriculum based on your knowledge and progress</p>
      </div>

      {/* Current Module */}
      <Card className="border-primary">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Current Focus: Integration
              </CardTitle>
              <CardDescription>Master these concepts to progress</CardDescription>
            </div>
            <Badge className="gap-1">
              <Zap className="h-3 w-3" />
              72% Mastery
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Module Progress</span>
                <span className="font-medium">72%</span>
              </div>
              <Progress value={72} className="h-3" />
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {skillKnowledge.map((skill) => (
                <Card key={skill.name} className="bg-secondary/50">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs font-medium ${getStateColor(skill.state)}`}>
                        {skill.state.toUpperCase()}
                      </span>
                      <span className="text-xs font-bold">{Math.round(skill.probability * 100)}%</span>
                    </div>
                    <p className="text-sm font-medium">{skill.name}</p>
                    <Progress value={skill.probability * 100} className="h-1.5 mt-2" />
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button className="w-full gap-2">
              <Brain className="h-4 w-4" />
              Continue Learning
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Learning Path */}
      <Card>
        <CardHeader>
          <CardTitle>Your Learning Journey</CardTitle>
          <CardDescription>Adaptive modules tailored to your progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {modules.map((module, index) => (
              <div
                key={module.id}
                className={`relative rounded-lg border p-4 transition-all ${
                  module.isUnlocked
                    ? "hover:bg-accent cursor-pointer"
                    : "opacity-50 cursor-not-allowed"
                }`}
              >
                {/* Connection Line */}
                {index < modules.length - 1 && (
                  <div className="absolute left-6 top-14 h-6 w-0.5 bg-border" />
                )}

                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`flex h-12 w-12 items-center justify-center rounded-full ${
                    module.isCompleted
                      ? "bg-green-500/10"
                      : module.isUnlocked
                      ? "bg-primary/10"
                      : "bg-muted"
                  }`}>
                    {module.isCompleted ? (
                      <CheckCircle2 className="h-6 w-6 text-green-500" />
                    ) : module.isUnlocked ? (
                      <Circle className="h-6 w-6 text-primary" />
                    ) : (
                      <Lock className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{module.title}</h4>
                      <div className="flex items-center gap-2">
                        {module.masteryScore > 0 && (
                          <span className="text-sm font-medium">{module.masteryScore}%</span>
                        )}
                        {module.isCompleted && (
                          <Badge variant="secondary">Completed</Badge>
                        )}
                        {!module.isUnlocked && (
                          <Badge variant="outline">Locked</Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-2">
                      {module.skills.map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    {module.masteryScore > 0 && (
                      <Progress value={module.masteryScore} className="h-2" />
                    )}
                  </div>

                  {/* Action */}
                  {module.isUnlocked && !module.isCompleted && (
                    <Button size="sm">
                      {module.masteryScore > 0 ? "Continue" : "Start"}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Personalized Recommendations
          </CardTitle>
          <CardDescription>AI-powered suggestions to optimize your learning</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recommendations.map((rec, index) => (
              <div
                key={index}
                className="flex items-start justify-between rounded-lg border p-4 hover:bg-accent transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">{rec.title}</h4>
                    <Badge variant={getPriorityColor(rec.priority) as any}>
                      {rec.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Trophy className="h-3 w-3" />
                    <span>Est. {rec.estimatedTime}</span>
                  </div>
                </div>
                <Button size="sm" variant="outline">Start</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
