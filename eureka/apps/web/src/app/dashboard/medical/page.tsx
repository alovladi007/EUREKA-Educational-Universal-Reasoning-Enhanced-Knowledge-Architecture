'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api-client';
// Tabs component not needed - using simple sections
import {
  BookOpen,
  Stethoscope,
  ClipboardList,
  Activity,
  TrendingUp,
  Award,
  Clock,
  CheckCircle,
  Bot,
  MessageCircle,
  Brain,
  FileText,
  PenTool,
} from 'lucide-react';

export default function MedicalEducationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [usmleQuestions, setUsmleQuestions] = useState<any[]>([]);
  const [clinicalCases, setClinicalCases] = useState<any[]>([]);
  const [statistics, setStatistics] = useState<any>(null);

  useEffect(() => {
    loadMedicalData();
  }, []);

  const loadMedicalData = async () => {
    try {
      setLoading(true);

      // Fetch USMLE questions - medical service is on port 8030
      const questions = await apiClient.getUSMLEQuestions({ limit: 10 });
      setUsmleQuestions(questions || []);

      // Fetch clinical cases
      const cases = await apiClient.getClinicalCases({ limit: 10 });
      setClinicalCases(cases || []);

      // Fetch statistics
      const stats = await apiClient.getUSMLEStatistics();
      setStatistics(stats || {
        total_questions_attempted: 0,
        correct_answers: 0,
        accuracy_rate: 0,
        average_time_per_question: 0
      });
    } catch (error) {
      console.error('Error loading medical data:', error);
      // Set empty defaults on error
      setUsmleQuestions([]);
      setClinicalCases([]);
      setStatistics({
        total_questions_attempted: 0,
        correct_answers: 0,
        accuracy_rate: 0,
        average_time_per_question: 0
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
          <div>
            <h1 className="text-3xl font-bold mb-2">Medical Education</h1>
            <p className="text-muted-foreground">
              USMLE preparation, clinical cases, and medical assessments
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Questions Completed</p>
                  <p className="text-2xl font-bold">{statistics?.total_questions_attempted || 0}</p>
                </div>
                <BookOpen className="w-8 h-8 text-blue-500" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Accuracy Rate</p>
                  <p className="text-2xl font-bold">
                    {statistics?.accuracy_rate
                      ? `${(statistics.accuracy_rate * 100).toFixed(1)}%`
                      : '0%'}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Correct Answers</p>
                  <p className="text-2xl font-bold">{statistics?.correct_answers || 0}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-emerald-500" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Time/Question</p>
                  <p className="text-2xl font-bold">
                    {statistics?.average_time_per_question
                      ? `${Math.round(statistics.average_time_per_question)}s`
                      : '0s'}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-orange-500" />
              </div>
            </Card>
          </div>

          {/* Content Studio Section */}
          <div className="space-y-4">
            <Card className="p-8 bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent border-purple-500/20">
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-purple-500/10">
                    <PenTool className="w-8 h-8 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold flex items-center gap-2 mb-2">
                      Content Studio
                    </h2>
                    <p className="text-muted-foreground max-w-2xl">
                      Create and manage educational content with rich formatting, citations, and version control.
                      Author modules, lessons, and learning objectives with a professional editor.
                    </p>
                    <div className="flex gap-3 mt-4">
                      <div className="flex items-center gap-2 text-sm">
                        <FileText className="w-4 h-4 text-purple-600" />
                        <span>Rich Text Editor</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <BookOpen className="w-4 h-4 text-purple-600" />
                        <span>Citations & Media</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <TrendingUp className="w-4 h-4 text-purple-600" />
                        <span>Version Control</span>
                      </div>
                    </div>
                  </div>
                </div>
                <Link href="/dashboard/medical/content-studio">
                  <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                    <PenTool className="w-4 h-4 mr-2" />
                    Create Content
                  </Button>
                </Link>
              </div>
            </Card>
          </div>

          {/* AI Tutor Section */}
          <div className="space-y-4">
            <Card className="p-8 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20">
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Bot className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold flex items-center gap-2 mb-2">
                      AI Medical Tutor
                    </h2>
                    <p className="text-muted-foreground max-w-2xl">
                      Get personalized help with medical concepts, clinical reasoning, and exam preparation.
                      Ask questions, receive evidence-based explanations, and learn with the Socratic method.
                    </p>
                    <div className="flex gap-3 mt-4">
                      <div className="flex items-center gap-2 text-sm">
                        <MessageCircle className="w-4 h-4 text-primary" />
                        <span>Interactive Chat</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Stethoscope className="w-4 h-4 text-primary" />
                        <span>Clinical Focus</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <TrendingUp className="w-4 h-4 text-primary" />
                        <span>Adaptive Learning</span>
                      </div>
                    </div>
                  </div>
                </div>
                <Link href="/dashboard/medical/ai-tutor">
                  <Button size="lg">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Start Conversation
                  </Button>
                </Link>
              </div>
            </Card>
          </div>

          {/* USMLE Questions Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <BookOpen className="w-6 h-6" />
                USMLE Question Bank
              </h2>
              <Button onClick={() => router.push('/dashboard/medical/qbank')}>
                <BookOpen className="w-4 h-4 mr-2" />
                Start Practice Session
              </Button>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading questions...</p>
              </div>
            ) : usmleQuestions.length === 0 ? (
              <Card className="p-12 text-center">
                <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Questions Available</h3>
                <p className="text-muted-foreground mb-4">
                  Start by adding USMLE questions to your question bank
                </p>
                <Button>Add Questions</Button>
              </Card>
            ) : (
              <div className="grid gap-4">
                {usmleQuestions.map((question) => (
                  <Card key={question.id} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="inline-block px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700 mr-2">
                            {question.difficulty_level}
                          </span>
                          <span className="inline-block px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-700">
                            {question.subject}
                          </span>
                        </div>
                        <Button variant="outline" size="sm">Practice</Button>
                      </div>
                      <p className="font-medium">{question.question_text}</p>
                      {question.vignette && (
                        <p className="text-sm text-muted-foreground">{question.vignette}</p>
                      )}
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span>Topic: {question.topic}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Clinical Cases Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <Stethoscope className="w-6 h-6" />
                Clinical Case Studies
              </h2>
              <Link href="/dashboard/medical/cases">
                <Button>
                  <Stethoscope className="w-4 h-4 mr-2" />
                  Browse All Cases
                </Button>
              </Link>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading cases...</p>
              </div>
            ) : clinicalCases.length === 0 ? (
              <Card className="p-12 text-center">
                <Stethoscope className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Clinical Cases Available</h3>
                <p className="text-muted-foreground mb-4">
                  Clinical cases help you practice diagnostic reasoning
                </p>
                <Link href="/dashboard/medical/cases">
                  <Button>Browse Cases</Button>
                </Link>
              </Card>
            ) : (
              <div className="grid gap-4">
                {clinicalCases.map((clinicalCase) => (
                  <Card key={clinicalCase.id} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold">{clinicalCase.title}</h3>
                        <Link href={`/dashboard/medical/cases/${clinicalCase.id}`}>
                          <Button variant="outline" size="sm">Start Case</Button>
                        </Link>
                      </div>
                      <p className="text-muted-foreground">{clinicalCase.description}</p>
                      <div className="flex gap-4 text-sm">
                        <span className="px-2 py-1 rounded-full bg-green-100 text-green-700">
                          {clinicalCase.specialty}
                        </span>
                        <span className="px-2 py-1 rounded-full bg-orange-100 text-orange-700">
                          {clinicalCase.complexity}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Patient: {clinicalCase.patient_age}y {clinicalCase.patient_sex}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* OSCE Section */}
          <div className="space-y-4">
            <Card className="p-8 bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent border-blue-500/20">
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-blue-500/10">
                    <ClipboardList className="w-8 h-8 text-blue-500" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold flex items-center gap-2 mb-2">
                      OSCE Practice Stations
                    </h2>
                    <p className="text-muted-foreground max-w-2xl">
                      Practice clinical skills with standardized OSCE scenarios. Comprehensive checklists,
                      timed examinations, and detailed feedback on history taking, physical exam, and communication skills.
                    </p>
                    <div className="flex gap-3 mt-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Stethoscope className="w-4 h-4 text-blue-500" />
                        <span>Multiple Domains</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-blue-500" />
                        <span>Timed Exams</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Award className="w-4 h-4 text-blue-500" />
                        <span>Performance Tracking</span>
                      </div>
                    </div>
                  </div>
                </div>
                <Link href="/dashboard/medical/osce">
                  <Button size="lg" className="bg-blue-500 hover:bg-blue-600">
                    <ClipboardList className="w-4 h-4 mr-2" />
                    Browse Stations
                  </Button>
                </Link>
              </div>
            </Card>
          </div>

          {/* 3D Anatomy Section */}
          <div className="space-y-4">
            <Card className="p-8 bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent border-purple-500/20">
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-purple-500/10">
                    <Activity className="w-8 h-8 text-purple-500" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold flex items-center gap-2 mb-2">
                      3D Anatomy Viewer
                    </h2>
                    <p className="text-muted-foreground max-w-2xl">
                      Interactive 3D visualization of human anatomy. Explore skeletal, cardiovascular, nervous, and organ systems
                      with real-time layer controls and multiple viewing angles.
                    </p>
                    <div className="flex gap-3 mt-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Activity className="w-4 h-4 text-purple-500" />
                        <span>Interactive 3D</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <BookOpen className="w-4 h-4 text-purple-500" />
                        <span>Multiple Systems</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Award className="w-4 h-4 text-purple-500" />
                        <span>Layer Controls</span>
                      </div>
                    </div>
                  </div>
                </div>
                <Link href="/dashboard/medical/anatomy">
                  <Button size="lg" className="bg-purple-500 hover:bg-purple-600">
                    <Activity className="w-4 h-4 mr-2" />
                    Open Viewer
                  </Button>
                </Link>
              </div>
            </Card>
          </div>

          {/* ML Demos Section */}
          <div className="space-y-4">
            <Card className="p-8 bg-gradient-to-br from-green-500/10 via-green-500/5 to-transparent border-green-500/20">
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-green-500/10">
                    <Brain className="w-8 h-8 text-green-500" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold flex items-center gap-2 mb-2">
                      AI/ML Model Demos
                    </h2>
                    <p className="text-muted-foreground max-w-2xl">
                      Explore state-of-the-art machine learning models for medical image analysis. Try ECG interpretation,
                      chest X-ray classification, and dermatology lesion detection with real-time predictions.
                    </p>
                    <div className="flex gap-3 mt-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Brain className="w-4 h-4 text-green-500" />
                        <span>Deep Learning</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Activity className="w-4 h-4 text-green-500" />
                        <span>Real-time Analysis</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span>3 Specialties</span>
                      </div>
                    </div>
                  </div>
                </div>
                <Link href="/dashboard/medical/ml-demos">
                  <Button size="lg" className="bg-green-500 hover:bg-green-600">
                    <Brain className="w-4 h-4 mr-2" />
                    Try Demos
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
    </div>
  );
}
