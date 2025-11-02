"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Stethoscope,
  MessageSquare,
  TrendingUp,
  Clock,
  Target,
  Award,
  ArrowRight,
  Activity,
} from "lucide-react";
import Link from "next/link";
import { formatPercentage } from "@/lib/utils";

export default function DashboardPage() {
  // Fetch QBank statistics
  const { data: qbankStats } = useQuery({
    queryKey: ["qbank-stats"],
    queryFn: () => apiClient.getQBankStatistics(),
  });

  // Fetch QBank performance
  const { data: qbankPerformance } = useQuery({
    queryKey: ["qbank-performance"],
    queryFn: () => apiClient.getQBankPerformance(),
  });

  // Fetch weak areas
  const { data: weakAreas } = useQuery({
    queryKey: ["weak-areas"],
    queryFn: () => apiClient.getWeakAreas(),
  });

  // Fetch case performance
  const { data: casePerformance } = useQuery({
    queryKey: ["case-performance"],
    queryFn: () => apiClient.getCasePerformance(),
  });

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome Back!</h1>
        <p className="text-muted-foreground mt-2">
          Here's your learning progress and recommendations
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Questions Answered</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {qbankStats?.total_questions_answered || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {qbankStats?.completion_percentage || 0}% of total bank
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Accuracy</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPercentage(qbankStats?.overall_accuracy || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {qbankStats?.correct_answers || 0} correct answers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cases Completed</CardTitle>
            <Stethoscope className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {casePerformance?.totalCasesCompleted || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatPercentage(casePerformance?.averageScore || 0)} avg score
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((qbankStats?.total_study_time_hours || 0) * 10) / 10}h
            </div>
            <p className="text-xs text-muted-foreground">
              Total time invested
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <Link href="/dashboard/qbank">
            <CardHeader>
              <div className="flex items-center justify-between">
                <BookOpen className="h-8 w-8 text-primary" />
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>
              <CardTitle className="mt-4">Question Bank</CardTitle>
              <CardDescription>
                Practice USMLE-style questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                Start Practice
              </Button>
            </CardContent>
          </Link>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <Link href="/dashboard/cases">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Stethoscope className="h-8 w-8 text-primary" />
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>
              <CardTitle className="mt-4">Clinical Cases</CardTitle>
              <CardDescription>
                Work through virtual patients
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                Browse Cases
              </Button>
            </CardContent>
          </Link>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <Link href="/dashboard/tutor">
            <CardHeader>
              <div className="flex items-center justify-between">
                <MessageSquare className="h-8 w-8 text-primary" />
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>
              <CardTitle className="mt-4">AI Tutor</CardTitle>
              <CardDescription>
                Get personalized help
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">
                Start Chat
              </Button>
            </CardContent>
          </Link>
        </Card>
      </div>

      {/* Performance Insights */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Top Performing Topics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Strong Topics
            </CardTitle>
            <CardDescription>
              Topics where you're excelling
            </CardDescription>
          </CardHeader>
          <CardContent>
            {qbankPerformance && qbankPerformance.length > 0 ? (
              <div className="space-y-3">
                {qbankPerformance
                  .filter((t: any) => t.accuracy >= 70)
                  .slice(0, 5)
                  .map((topic: any) => (
                    <div key={topic.category} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium">{topic.category}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {formatPercentage(topic.accuracy)}
                      </span>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Start practicing to see your strong topics
              </p>
            )}
          </CardContent>
        </Card>

        {/* Weak Areas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-orange-500" />
              Focus Areas
            </CardTitle>
            <CardDescription>
              Topics that need more practice
            </CardDescription>
          </CardHeader>
          <CardContent>
            {weakAreas && weakAreas.length > 0 ? (
              <div className="space-y-3">
                {weakAreas.slice(0, 5).map((area: any) => (
                  <div key={`${area.category}-${area.subcategory}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">
                        {area.subcategory || area.category}
                      </span>
                      <span className="text-sm text-orange-500">
                        {formatPercentage(area.accuracy)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {area.recommendation}
                    </p>
                  </div>
                ))}
                <Link href="/dashboard/qbank">
                  <Button variant="outline" size="sm" className="w-full mt-2">
                    Practice Weak Areas
                  </Button>
                </Link>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Complete more questions to identify weak areas
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Your latest learning sessions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
              <BookOpen className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <p className="text-sm font-medium">QBank Practice</p>
                <p className="text-xs text-muted-foreground">20 questions • Cardiology</p>
              </div>
              <span className="text-sm text-muted-foreground">2 hours ago</span>
            </div>
            <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
              <Stethoscope className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <p className="text-sm font-medium">Clinical Case</p>
                <p className="text-xs text-muted-foreground">Chest Pain Case</p>
              </div>
              <span className="text-sm text-muted-foreground">Yesterday</span>
            </div>
            <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
              <MessageSquare className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <p className="text-sm font-medium">AI Tutor Session</p>
                <p className="text-xs text-muted-foreground">Cardiac Physiology</p>
              </div>
              <span className="text-sm text-muted-foreground">2 days ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
