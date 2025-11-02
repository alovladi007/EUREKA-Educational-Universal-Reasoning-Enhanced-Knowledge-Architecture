'use client';

import { useState, useEffect } from 'react';
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
} from 'lucide-react';

export default function MedicalEducationPage() {
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

          {/* USMLE Questions Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <BookOpen className="w-6 h-6" />
                USMLE Question Bank
              </h2>
              <Button>
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
              <Button>
                <Stethoscope className="w-4 h-4 mr-2" />
                Start New Case
              </Button>
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
                <Button>Browse Cases</Button>
              </Card>
            ) : (
              <div className="grid gap-4">
                {clinicalCases.map((clinicalCase) => (
                  <Card key={clinicalCase.id} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold">{clinicalCase.title}</h3>
                        <Button variant="outline" size="sm">Start Case</Button>
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
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <ClipboardList className="w-6 h-6" />
              OSCE Simulation
            </h2>
            <Card className="p-12 text-center">
              <ClipboardList className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">OSCE Practice Stations</h3>
              <p className="text-muted-foreground mb-4">
                Objective Structured Clinical Examination practice stations
              </p>
              <Button>Browse OSCE Stations</Button>
            </Card>
          </div>

          {/* Diagnostic Reasoning Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <Activity className="w-6 h-6" />
              Diagnostic Reasoning
            </h2>
            <Card className="p-12 text-center">
              <Activity className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Clinical Decision Making</h3>
              <p className="text-muted-foreground mb-4">
                Practice clinical decision making and differential diagnosis
              </p>
              <Button>Start Diagnostic Session</Button>
            </Card>
          </div>
    </div>
  );
}
