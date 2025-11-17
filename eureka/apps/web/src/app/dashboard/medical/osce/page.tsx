"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  ClipboardList,
  Clock,
  Play,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Award,
  Timer,
  Stethoscope,
  Activity,
  Users,
  Heart,
  Brain,
  MessageSquare,
  AlertTriangle,
  ChevronRight,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const API_BASE_URL = "http://localhost:8030/api/v1/osce";

interface ChecklistItem {
  description: string;
  type: "critical" | "important" | "optional";
  points: number;
}

interface Station {
  id: string;
  title: string;
  scenario: string;
  domain: string;
  durationMinutes: number;
  checklist: ChecklistItem[];
  maxScore: number;
  learningObjectives?: string;
  createdAt: string;
}

interface ExamSession {
  id: string;
  stationId: string;
  userId: string;
  startTime: string;
  endTime?: string;
  status: string;
  score?: number;
  maxScore?: number;
}

interface StationResult {
  sessionId: string;
  stationTitle: string;
  domain: string;
  score: number;
  maxScore: number;
  percentage: number;
  criticalItemsCompleted: number;
  criticalItemsTotal: number;
  importantItemsCompleted: number;
  importantItemsTotal: number;
  optionalItemsCompleted: number;
  optionalItemsTotal: number;
  communicationScore?: number;
  professionalismScore?: number;
  examinerFeedback?: string;
  strengths: string[];
  areasForImprovement: string[];
  completionTime: number;
}

interface UserPerformance {
  totalStationsCompleted: number;
  averageScore: number;
  domainBreakdown: Record<string, { completed: number; avgScore: number }>;
  recentSessions: ExamSession[];
  strengthDomains: string[];
  improvementDomains: string[];
}

const DOMAIN_ICONS: Record<string, any> = {
  history_taking: Stethoscope,
  physical_exam: Activity,
  communication: MessageSquare,
  procedural_skills: ClipboardList,
  clinical_reasoning: Brain,
  counseling: Users,
  emergency_management: AlertTriangle,
};

const DOMAIN_LABELS: Record<string, string> = {
  history_taking: "History Taking",
  physical_exam: "Physical Exam",
  communication: "Communication",
  procedural_skills: "Procedural Skills",
  clinical_reasoning: "Clinical Reasoning",
  counseling: "Counseling",
  emergency_management: "Emergency Management",
};

export default function OSCEPage() {
  const queryClient = useQueryClient();
  const [view, setView] = useState<"browse" | "exam" | "results" | "performance">("browse");
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [currentSession, setCurrentSession] = useState<ExamSession | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [checklistResponses, setChecklistResponses] = useState<Record<string, { completed: boolean; notes: string }>>({});
  const [examinerFeedback, setExaminerFeedback] = useState("");
  const [sessionResult, setSessionResult] = useState<StationResult | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);

  // Fetch stations
  const { data: stations = [], isLoading: loadingStations } = useQuery<Station[]>({
    queryKey: ["osce-stations", selectedDomain],
    queryFn: async () => {
      const url = selectedDomain
        ? `${API_BASE_URL}/stations?domain=${selectedDomain}`
        : `${API_BASE_URL}/stations`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch stations");
      return response.json();
    },
  });

  // Fetch domains
  const { data: domains = [] } = useQuery<string[]>({
    queryKey: ["osce-domains"],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/domains/list`);
      if (!response.ok) throw new Error("Failed to fetch domains");
      return response.json();
    },
  });

  // Fetch user performance
  const { data: performance } = useQuery<UserPerformance>({
    queryKey: ["osce-performance"],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/performance/mine`);
      if (!response.ok) throw new Error("Failed to fetch performance");
      return response.json();
    },
    enabled: view === "performance",
  });

  // Start session mutation
  const startSessionMutation = useMutation({
    mutationFn: async (stationId: string) => {
      const response = await fetch(`${API_BASE_URL}/sessions/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stationId }),
      });
      if (!response.ok) throw new Error("Failed to start session");
      return response.json();
    },
    onSuccess: (session) => {
      setCurrentSession(session);
      setView("exam");
      if (selectedStation) {
        setTimeRemaining(selectedStation.durationMinutes * 60);
      }
    },
  });

  // Submit score mutation
  const submitScoreMutation = useMutation({
    mutationFn: async () => {
      if (!currentSession) throw new Error("No active session");

      const responses = Object.entries(checklistResponses).map(([description, data]) => ({
        itemDescription: description,
        completed: data.completed,
        notes: data.notes,
      }));

      const response = await fetch(`${API_BASE_URL}/sessions/${currentSession.id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          checklistResponses: responses,
          examinerFeedback,
        }),
      });
      if (!response.ok) throw new Error("Failed to submit score");
      return response.json();
    },
    onSuccess: (result) => {
      setSessionResult(result);
      setView("results");
      queryClient.invalidateQueries({ queryKey: ["osce-performance"] });
    },
  });

  // Timer countdown
  useEffect(() => {
    if (view === "exam" && timeRemaining !== null && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => (prev !== null ? Math.max(0, prev - 1) : null));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [view, timeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStartStation = (station: Station) => {
    setSelectedStation(station);
    setChecklistResponses({});
    setExaminerFeedback("");
    startSessionMutation.mutate(station.id);
  };

  const handleChecklistChange = (description: string, completed: boolean) => {
    setChecklistResponses((prev) => ({
      ...prev,
      [description]: {
        completed,
        notes: prev[description]?.notes || "",
      },
    }));
  };

  const handleNotesChange = (description: string, notes: string) => {
    setChecklistResponses((prev) => ({
      ...prev,
      [description]: {
        completed: prev[description]?.completed || false,
        notes,
      },
    }));
  };

  const getChecklistItemsByType = (type: string) => {
    if (!selectedStation) return [];
    return selectedStation.checklist.filter((item) => item.type === type);
  };

  const getCompletedCount = (type: string) => {
    return getChecklistItemsByType(type).filter(
      (item) => checklistResponses[item.description]?.completed
    ).length;
  };

  // Browse View
  if (view === "browse") {
    return (
      <div>
        <div className="mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold">OSCE Stations</h1>
              <p className="text-muted-foreground mt-2">
                Practice clinical skills with objective structured clinical examinations
              </p>
            </div>
            <Button variant="outline" onClick={() => setView("performance")}>
              <TrendingUp className="w-4 h-4 mr-2" />
              My Performance
            </Button>
          </div>

          {/* Domain Filter */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedDomain === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedDomain(null)}
            >
              All Domains
            </Button>
            {domains.map((domain) => {
              const Icon = DOMAIN_ICONS[domain] || ClipboardList;
              return (
                <Button
                  key={domain}
                  variant={selectedDomain === domain ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedDomain(domain)}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {DOMAIN_LABELS[domain] || domain}
                </Button>
              );
            })}
          </div>
        </div>

        {loadingStations ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="grid gap-6">
            {stations.map((station) => {
              const Icon = DOMAIN_ICONS[station.domain] || ClipboardList;
              const criticalCount = station.checklist.filter((i) => i.type === "critical").length;
              const importantCount = station.checklist.filter((i) => i.type === "important").length;

              return (
                <Card key={station.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <Icon className="w-5 h-5 text-primary" />
                          </div>
                          <CardTitle className="text-xl">{station.title}</CardTitle>
                        </div>
                        <CardDescription className="mt-2">{station.scenario}</CardDescription>
                      </div>
                      <Button onClick={() => handleStartStation(station)}>
                        <Play className="w-4 h-4 mr-2" />
                        Start Station
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-4 gap-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Duration</p>
                          <p className="font-medium">{station.durationMinutes} min</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Max Score</p>
                          <p className="font-medium">{station.maxScore} pts</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-destructive" />
                        <div>
                          <p className="text-xs text-muted-foreground">Critical Items</p>
                          <p className="font-medium">{criticalCount}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        <div>
                          <p className="text-xs text-muted-foreground">Important Items</p>
                          <p className="font-medium">{importantCount}</p>
                        </div>
                      </div>
                    </div>

                    {station.learningObjectives && (
                      <div className="mt-4 p-3 rounded-lg bg-accent">
                        <p className="text-sm font-medium mb-1">Learning Objectives:</p>
                        <p className="text-sm text-muted-foreground">{station.learningObjectives}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Exam View
  if (view === "exam" && selectedStation) {
    const criticalItems = getChecklistItemsByType("critical");
    const importantItems = getChecklistItemsByType("important");
    const optionalItems = getChecklistItemsByType("optional");

    const totalCompleted = Object.values(checklistResponses).filter((r) => r.completed).length;
    const totalItems = selectedStation.checklist.length;

    return (
      <div>
        {/* Header with Timer */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">{selectedStation.title}</h1>
                <p className="text-muted-foreground mt-1">{selectedStation.scenario}</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Progress</p>
                  <p className="text-2xl font-bold">
                    {totalCompleted}/{totalItems}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Time Remaining</p>
                  <div
                    className={cn(
                      "text-3xl font-bold flex items-center gap-2",
                      timeRemaining !== null && timeRemaining < 60 && "text-destructive"
                    )}
                  >
                    <Timer className="w-6 h-6" />
                    {timeRemaining !== null ? formatTime(timeRemaining) : "--:--"}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-3 gap-6">
          {/* Checklist */}
          <div className="col-span-2 space-y-4">
            {/* Critical Items */}
            {criticalItems.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-destructive">
                    <AlertCircle className="w-5 h-5" />
                    Critical Items ({getCompletedCount("critical")}/{criticalItems.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {criticalItems.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-lg border bg-destructive/5 border-destructive/20">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={checklistResponses[item.description]?.completed || false}
                          onChange={(e) =>
                            handleChecklistChange(item.description, e.target.checked)
                          }
                          className="mt-0.5"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-medium text-sm">{item.description}</p>
                            <Badge variant="destructive" className="shrink-0">
                              {item.points} pts
                            </Badge>
                          </div>
                          <Textarea
                            placeholder="Notes..."
                            value={checklistResponses[item.description]?.notes || ""}
                            onChange={(e) => handleNotesChange(item.description, e.target.value)}
                            className="mt-2 text-sm"
                            rows={2}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Important Items */}
            {importantItems.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <CheckCircle2 className="w-5 h-5" />
                    Important Items ({getCompletedCount("important")}/{importantItems.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {importantItems.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-lg border bg-primary/5 border-primary/20">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={checklistResponses[item.description]?.completed || false}
                          onChange={(e) =>
                            handleChecklistChange(item.description, e.target.checked)
                          }
                          className="mt-0.5"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-medium text-sm">{item.description}</p>
                            <Badge variant="default" className="shrink-0">
                              {item.points} pts
                            </Badge>
                          </div>
                          <Textarea
                            placeholder="Notes..."
                            value={checklistResponses[item.description]?.notes || ""}
                            onChange={(e) => handleNotesChange(item.description, e.target.value)}
                            className="mt-2 text-sm"
                            rows={2}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Optional Items */}
            {optionalItems.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-muted-foreground">
                    <ChevronRight className="w-5 h-5" />
                    Optional Items ({getCompletedCount("optional")}/{optionalItems.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {optionalItems.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-lg border">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={checklistResponses[item.description]?.completed || false}
                          onChange={(e) =>
                            handleChecklistChange(item.description, e.target.checked)
                          }
                          className="mt-0.5"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-medium text-sm">{item.description}</p>
                            <Badge variant="secondary" className="shrink-0">
                              {item.points} pts
                            </Badge>
                          </div>
                          <Textarea
                            placeholder="Notes..."
                            value={checklistResponses[item.description]?.notes || ""}
                            onChange={(e) => handleNotesChange(item.description, e.target.value)}
                            className="mt-2 text-sm"
                            rows={2}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - Actions */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Examiner Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Overall Feedback</label>
                  <Textarea
                    placeholder="Enter examiner feedback and observations..."
                    value={examinerFeedback}
                    onChange={(e) => setExaminerFeedback(e.target.value)}
                    rows={6}
                  />
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => submitScoreMutation.mutate()}
                  disabled={submitScoreMutation.isPending}
                >
                  {submitScoreMutation.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                  )}
                  Complete & Submit
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setView("browse");
                    setSelectedStation(null);
                    setCurrentSession(null);
                  }}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Cancel Session
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Critical</span>
                  <span className="font-medium">
                    {getCompletedCount("critical")}/{criticalItems.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Important</span>
                  <span className="font-medium">
                    {getCompletedCount("important")}/{importantItems.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Optional</span>
                  <span className="font-medium">
                    {getCompletedCount("optional")}/{optionalItems.length}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Results View
  if (view === "results" && sessionResult) {
    const passThreshold = 70;
    const passed = sessionResult.percentage >= passThreshold;

    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <div className="text-center">
              <div
                className={cn(
                  "w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4",
                  passed ? "bg-green-500/10" : "bg-yellow-500/10"
                )}
              >
                {passed ? (
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                ) : (
                  <AlertCircle className="w-8 h-8 text-yellow-500" />
                )}
              </div>
              <CardTitle className="text-3xl mb-2">Examination Complete</CardTitle>
              <CardDescription>{sessionResult.stationTitle}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Score Overview */}
            <div className="text-center p-6 rounded-lg bg-accent">
              <p className="text-sm text-muted-foreground mb-2">Your Score</p>
              <p className="text-5xl font-bold mb-1">
                {sessionResult.score}/{sessionResult.maxScore}
              </p>
              <p className="text-2xl font-semibold text-primary">
                {sessionResult.percentage.toFixed(1)}%
              </p>
            </div>

            {/* Breakdown by Type */}
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-destructive" />
                    <p className="text-sm font-medium">Critical Items</p>
                  </div>
                  <p className="text-2xl font-bold">
                    {sessionResult.criticalItemsCompleted}/{sessionResult.criticalItemsTotal}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {((sessionResult.criticalItemsCompleted / sessionResult.criticalItemsTotal) * 100).toFixed(0)}%
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <p className="text-sm font-medium">Important Items</p>
                  </div>
                  <p className="text-2xl font-bold">
                    {sessionResult.importantItemsCompleted}/{sessionResult.importantItemsTotal}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {((sessionResult.importantItemsCompleted / sessionResult.importantItemsTotal) * 100).toFixed(0)}%
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    <p className="text-sm font-medium">Optional Items</p>
                  </div>
                  <p className="text-2xl font-bold">
                    {sessionResult.optionalItemsCompleted}/{sessionResult.optionalItemsTotal}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {sessionResult.optionalItemsTotal > 0
                      ? `${((sessionResult.optionalItemsCompleted / sessionResult.optionalItemsTotal) * 100).toFixed(0)}%`
                      : "N/A"}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Completion Time */}
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span className="text-sm">
                Completed in {Math.floor(sessionResult.completionTime / 60)}:
                {(sessionResult.completionTime % 60).toString().padStart(2, "0")}
              </span>
            </div>

            {/* Strengths */}
            {sessionResult.strengths.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  Strengths
                </h3>
                <div className="space-y-2">
                  {sessionResult.strengths.map((strength, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm">
                      <ChevronRight className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      <p>{strength}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Areas for Improvement */}
            {sessionResult.areasForImprovement.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Areas for Improvement
                </h3>
                <div className="space-y-2">
                  {sessionResult.areasForImprovement.map((area, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm">
                      <ChevronRight className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <p>{area}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Examiner Feedback */}
            {sessionResult.examinerFeedback && (
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Examiner Feedback
                </h3>
                <div className="p-4 rounded-lg bg-accent">
                  <p className="text-sm whitespace-pre-wrap">{sessionResult.examinerFeedback}</p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button className="flex-1" onClick={() => setView("browse")}>
                <ClipboardList className="w-4 h-4 mr-2" />
                Try Another Station
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => setView("performance")}>
                <TrendingUp className="w-4 h-4 mr-2" />
                View Performance
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Performance View
  if (view === "performance" && performance) {
    return (
      <div>
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">My OSCE Performance</h1>
              <p className="text-muted-foreground mt-2">Track your clinical skills development</p>
            </div>
            <Button variant="outline" onClick={() => setView("browse")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Stations
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Overall Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Stations Completed</p>
                <p className="text-3xl font-bold">{performance.totalStationsCompleted}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Average Score</p>
                <p className="text-3xl font-bold text-primary">{performance.averageScore.toFixed(1)}%</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Domain Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Strength Domains</p>
                <div className="flex flex-wrap gap-2">
                  {performance.strengthDomains.map((domain) => (
                    <Badge key={domain} variant="default" className="bg-green-500">
                      {DOMAIN_LABELS[domain] || domain}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Focus Areas</p>
                <div className="flex flex-wrap gap-2">
                  {performance.improvementDomains.map((domain) => (
                    <Badge key={domain} variant="secondary">
                      {DOMAIN_LABELS[domain] || domain}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Domain Breakdown */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Performance by Domain</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(performance.domainBreakdown).map(([domain, stats]) => {
                const Icon = DOMAIN_ICONS[domain] || ClipboardList;
                return (
                  <div key={domain} className="flex items-center gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      <Icon className="w-5 h-5 text-primary" />
                      <div className="flex-1">
                        <p className="font-medium">{DOMAIN_LABELS[domain] || domain}</p>
                        <p className="text-sm text-muted-foreground">{stats.completed} stations completed</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{stats.avgScore.toFixed(1)}%</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Sessions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {performance.recentSessions.map((session) => {
                const station = stations.find((s) => s.id === session.stationId);
                const Icon = station ? DOMAIN_ICONS[station.domain] || ClipboardList : ClipboardList;

                return (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium">{station?.title || "Unknown Station"}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(session.startTime).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {session.score !== undefined && session.maxScore && (
                      <div className="text-right">
                        <p className="font-bold">
                          {session.score}/{session.maxScore}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {((session.score / session.maxScore) * 100).toFixed(0)}%
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}
