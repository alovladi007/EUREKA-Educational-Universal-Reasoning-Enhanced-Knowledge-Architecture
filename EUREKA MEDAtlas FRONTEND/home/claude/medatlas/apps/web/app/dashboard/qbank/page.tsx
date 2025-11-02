"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BookOpen,
  Clock,
  ArrowRight,
  CheckCircle,
  XCircle,
  Timer,
  Target,
  TrendingUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { formatTime, formatPercentage } from "@/lib/utils";

export default function QBankPage() {
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [sessionData, setSessionData] = useState<any>(null);
  const [answers, setAnswers] = useState<any[]>([]);

  // Configuration state
  const [mode, setMode] = useState<"tutor" | "timed" | "test">("tutor");
  const [category, setCategory] = useState<string>("");
  const [itemCount, setItemCount] = useState(20);

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ["qbank-categories"],
    queryFn: () => apiClient.getQBankItems({ limit: 1 }),
  });

  // Start practice session mutation
  const startSessionMutation = useMutation({
    mutationFn: (data: any) => apiClient.startPracticeSession(data),
    onSuccess: (data) => {
      setSessionId(data.session_id);
      setSessionData(data);
      setCurrentQuestionIndex(0);
      setShowExplanation(false);
      setTimeSpent(0);
    },
  });

  // Submit answer mutation
  const submitAnswerMutation = useMutation({
    mutationFn: (data: { sessionId: string; answer: any }) =>
      apiClient.submitAnswer(data.sessionId, data.answer),
    onSuccess: (data) => {
      setShowExplanation(true);
      setAnswers([...answers, data]);
    },
  });

  // Submit full session mutation
  const submitSessionMutation = useMutation({
    mutationFn: (data: { sessionId: string; answers: any[] }) =>
      apiClient.submitPracticeSession(data.sessionId, data.answers),
    onSuccess: (data) => {
      router.push(`/dashboard/qbank/results?session=${sessionId}`);
    },
  });

  const handleStartSession = () => {
    startSessionMutation.mutate({
      mode,
      item_count: itemCount,
      category: category || undefined,
      unused_only: true,
    });
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer || !sessionId || !sessionData) return;

    const currentItem = sessionData.items[currentQuestionIndex];

    if (mode === "tutor") {
      // Tutor mode: submit immediately and show explanation
      submitAnswerMutation.mutate({
        sessionId,
        answer: {
          item_id: currentItem.id,
          answer: selectedAnswer,
          time_spent_seconds: timeSpent,
        },
      });
    } else {
      // Timed/Test mode: store answer and move to next
      setAnswers([
        ...answers,
        {
          item_id: currentItem.id,
          answer: selectedAnswer,
          time_spent_seconds: timeSpent,
        },
      ]);
      handleNextQuestion();
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < sessionData.items.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer("");
      setShowExplanation(false);
      setTimeSpent(0);
    } else if (mode !== "tutor") {
      // Submit all answers at the end
      submitSessionMutation.mutate({
        sessionId: sessionId!,
        answers,
      });
    }
  };

  const currentItem = sessionData?.items?.[currentQuestionIndex];
  const progress = sessionData
    ? ((currentQuestionIndex + 1) / sessionData.items.length) * 100
    : 0;

  // If no session, show setup screen
  if (!sessionId || !sessionData) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Question Bank</h1>
          <p className="text-muted-foreground mt-2">
            Practice USMLE-style questions with instant feedback
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Configure Your Practice Session</CardTitle>
            <CardDescription>
              Choose your practice mode and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Practice Mode */}
            <div className="space-y-3">
              <Label>Practice Mode</Label>
              <RadioGroup value={mode} onValueChange={(v: any) => setMode(v)}>
                <div className="flex items-center space-x-2 p-3 rounded-lg border cursor-pointer hover:bg-accent">
                  <RadioGroupItem value="tutor" id="tutor" />
                  <Label htmlFor="tutor" className="flex-1 cursor-pointer">
                    <div className="font-medium">Tutor Mode</div>
                    <div className="text-sm text-muted-foreground">
                      Get immediate feedback after each question
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded-lg border cursor-pointer hover:bg-accent">
                  <RadioGroupItem value="timed" id="timed" />
                  <Label htmlFor="timed" className="flex-1 cursor-pointer">
                    <div className="font-medium">Timed Mode</div>
                    <div className="text-sm text-muted-foreground">
                      Practice with time pressure, feedback at end
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded-lg border cursor-pointer hover:bg-accent">
                  <RadioGroupItem value="test" id="test" />
                  <Label htmlFor="test" className="flex-1 cursor-pointer">
                    <div className="font-medium">Test Mode</div>
                    <div className="text-sm text-muted-foreground">
                      Simulate real exam conditions
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Category Selection */}
            <div className="space-y-2">
              <Label htmlFor="category">Subject (Optional)</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="All subjects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All subjects</SelectItem>
                  <SelectItem value="Cardiology">Cardiology</SelectItem>
                  <SelectItem value="Pulmonology">Pulmonology</SelectItem>
                  <SelectItem value="Gastroenterology">Gastroenterology</SelectItem>
                  <SelectItem value="Neurology">Neurology</SelectItem>
                  <SelectItem value="Endocrinology">Endocrinology</SelectItem>
                  <SelectItem value="Hematology/Oncology">Hematology/Oncology</SelectItem>
                  <SelectItem value="Renal/Genitourinary">Renal/Genitourinary</SelectItem>
                  <SelectItem value="Musculoskeletal">Musculoskeletal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Number of Questions */}
            <div className="space-y-2">
              <Label htmlFor="count">Number of Questions</Label>
              <Select
                value={itemCount.toString()}
                onValueChange={(v) => setItemCount(parseInt(v))}
              >
                <SelectTrigger id="count">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 questions</SelectItem>
                  <SelectItem value="20">20 questions</SelectItem>
                  <SelectItem value="40">40 questions</SelectItem>
                  <SelectItem value="50">50 questions</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              className="w-full"
              size="lg"
              onClick={handleStartSession}
              disabled={startSessionMutation.isPending}
            >
              {startSessionMutation.isPending ? (
                "Starting Session..."
              ) : (
                <>
                  <BookOpen className="mr-2 h-5 w-5" />
                  Start Practice
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Practice session interface
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            Question {currentQuestionIndex + 1} of {sessionData.items.length}
          </h2>
          <p className="text-sm text-muted-foreground">
            {category || "All subjects"} • {mode.charAt(0).toUpperCase() + mode.slice(1)} Mode
          </p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            {formatTime(timeSpent)}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-secondary rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg">Clinical Vignette</CardTitle>
              <CardDescription className="mt-2">
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                  <Target className="h-3 w-3" />
                  {currentItem?.category}
                </span>
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Question Stem */}
          <div className="prose prose-sm max-w-none">
            <p className="text-base leading-relaxed whitespace-pre-wrap">
              {currentItem?.stem}
            </p>
          </div>

          {/* Answer Options */}
          <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer}>
            <div className="space-y-3">
              {currentItem?.options?.map((option: any) => {
                const isSelected = selectedAnswer === option.id;
                const isCorrect = showExplanation && option.id === currentItem.correct_answer;
                const isWrong =
                  showExplanation && isSelected && option.id !== currentItem.correct_answer;

                return (
                  <div
                    key={option.id}
                    className={`flex items-start space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      isCorrect
                        ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                        : isWrong
                        ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                        : isSelected
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-accent"
                    }`}
                  >
                    <RadioGroupItem
                      value={option.id}
                      id={option.id}
                      disabled={showExplanation}
                    />
                    <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-sm">{option.text}</span>
                        {isCorrect && <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />}
                        {isWrong && <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />}
                      </div>
                    </Label>
                  </div>
                );
              })}
            </div>
          </RadioGroup>

          {/* Explanation (shown in tutor mode after answer) */}
          {showExplanation && (
            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-2 mb-2">
                <BookOpen className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <h4 className="font-semibold text-blue-900 dark:text-blue-100">Explanation</h4>
              </div>
              <p className="text-sm text-blue-900/80 dark:text-blue-100/80 leading-relaxed">
                {currentItem?.explanation}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            {!showExplanation ? (
              <Button
                className="flex-1"
                size="lg"
                onClick={handleSubmitAnswer}
                disabled={!selectedAnswer || submitAnswerMutation.isPending}
              >
                Submit Answer
              </Button>
            ) : (
              <Button className="flex-1" size="lg" onClick={handleNextQuestion}>
                {currentQuestionIndex < sessionData.items.length - 1 ? (
                  <>
                    Next Question
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                ) : (
                  "View Results"
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
