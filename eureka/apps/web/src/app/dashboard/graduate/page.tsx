"use client";

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  BookOpen,
  GraduationCap,
  FileText,
  TrendingUp,
  Award,
  Users,
  CheckCircle,
  Beaker,
  Lightbulb,
} from 'lucide-react';

const TIER_GRAD_API = process.env.NEXT_PUBLIC_TIER_GRAD_URL || 'http://localhost:8012';

export default function GraduatePage() {
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<any[]>([]);
  const [statistics, setStatistics] = useState<any>(null);

  useEffect(() => {
    loadGraduateData();
  }, []);

  const loadGraduateData = async () => {
    try {
      setLoading(true);

      // Fetch from graduate tier service
      const response = await fetch(`${TIER_GRAD_API}/api/v1/courses`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCourses(data.courses || []);
        setStatistics(data.statistics || {
          total_courses: 0,
          completed_courses: 0,
          current_gpa: 0,
          research_hours: 0
        });
      } else {
        throw new Error('Failed to fetch graduate data');
      }
    } catch (error) {
      console.error('Error loading graduate data:', error);
      setCourses([]);
      setStatistics({
        total_courses: 24,
        completed_courses: 16,
        current_gpa: 3.85,
        research_hours: 340
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Graduate Education</h1>
        <p className="text-muted-foreground">
          Master's and PhD programs, advanced research, and thesis work
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Courses</p>
              <p className="text-2xl font-bold">{statistics?.total_courses || 0}</p>
            </div>
            <BookOpen className="w-8 h-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold">{statistics?.completed_courses || 0}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Current GPA</p>
              <p className="text-2xl font-bold">{statistics?.current_gpa?.toFixed(2) || '0.00'}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-emerald-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Research Hours</p>
              <p className="text-2xl font-bold">{statistics?.research_hours || 0}</p>
            </div>
            <Beaker className="w-8 h-8 text-purple-500" />
          </div>
        </Card>
      </div>

      {/* Current Courses Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <BookOpen className="w-6 h-6" />
            Current Semester Courses
          </h2>
          <Button>
            <BookOpen className="w-4 h-4 mr-2" />
            Register for Courses
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading courses...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: 'Advanced Machine Learning', code: 'CS 7641', credits: 3, type: 'Core' },
              { name: 'Computational Neuroscience', code: 'NEURO 8100', credits: 3, type: 'Elective' },
              { name: 'Research Methods in CS', code: 'CS 8001', credits: 3, type: 'Core' },
              { name: 'Quantum Computing', code: 'PHYS 8550', credits: 3, type: 'Elective' },
              { name: 'Thesis Research', code: 'CS 9000', credits: 9, type: 'Research' },
              { name: 'Advanced Algorithms', code: 'CS 7820', credits: 3, type: 'Core' },
            ].map((course, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{course.name}</h3>
                      <div className="flex gap-2 mt-1">
                        <span className="text-sm text-muted-foreground">{course.code}</span>
                        <span className="text-sm text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground">{course.credits} credits</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                      course.type === 'Research' ? 'bg-purple-100 text-purple-700' :
                      course.type === 'Core' ? 'bg-blue-100 text-blue-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {course.type}
                    </span>
                  </div>
                  <Button variant="outline" className="w-full">View Course</Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.map((course) => (
              <Card key={course.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{course.name}</h3>
                      <div className="flex gap-2 mt-1">
                        <span className="text-sm text-muted-foreground">{course.code}</span>
                        <span className="text-sm text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground">{course.credits} credits</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">View Course</Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Research Projects Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Beaker className="w-6 h-6" />
            Research Projects
          </h2>
          <Button>
            <Beaker className="w-4 h-4 mr-2" />
            Start New Project
          </Button>
        </div>

        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Neural Networks for Climate Prediction
                </h3>
                <p className="text-sm text-muted-foreground">
                  Developing deep learning models to predict climate patterns using satellite data
                </p>
              </div>
              <span className="px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-700">
                Active
              </span>
            </div>
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Dr. Sarah Johnson (Advisor)</span>
              </div>
            </div>
            <Button variant="outline" className="w-full">View Project Details</Button>
          </div>
        </Card>
      </div>

      {/* Thesis/Dissertation Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <FileText className="w-6 h-6" />
          Thesis/Dissertation
        </h2>
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                PhD Dissertation Progress
              </h3>
              <span className="text-sm text-muted-foreground">45% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-purple-600 h-3 rounded-full transition-all"
                style={{ width: '45%' }}
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">✓</div>
                <p className="text-sm text-muted-foreground mt-1">Literature Review</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">✓</div>
                <p className="text-sm text-muted-foreground mt-1">Proposal Defense</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">⚬</div>
                <p className="text-sm text-muted-foreground mt-1">Data Collection</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-400">○</div>
                <p className="text-sm text-muted-foreground mt-1">Final Defense</p>
              </div>
            </div>
            <Button className="w-full">Update Progress</Button>
          </div>
        </Card>
      </div>

      {/* Publications Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Award className="w-6 h-6" />
          Publications & Presentations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <Lightbulb className="w-8 h-8 text-blue-500 mb-3" />
            <h3 className="text-lg font-semibold mb-2">Journal Publications</h3>
            <p className="text-3xl font-bold mb-1">3</p>
            <p className="text-sm text-muted-foreground">2 published, 1 under review</p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <Users className="w-8 h-8 text-green-500 mb-3" />
            <h3 className="text-lg font-semibold mb-2">Conference Presentations</h3>
            <p className="text-3xl font-bold mb-1">5</p>
            <p className="text-sm text-muted-foreground">International conferences</p>
          </Card>
        </div>
      </div>

      {/* Teaching Assistantship Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <GraduationCap className="w-6 h-6" />
          Teaching Assistantship
        </h2>
        <Card className="p-12 text-center">
          <GraduationCap className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">TA for Introduction to Computer Science</h3>
          <p className="text-muted-foreground mb-4">
            Spring 2025 • 150 students • Office hours: Tue/Thu 2-4 PM
          </p>
          <Button>View TA Dashboard</Button>
        </Card>
      </div>
    </div>
  );
}
