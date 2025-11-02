"use client";

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  BookOpen,
  GraduationCap,
  Target,
  TrendingUp,
  Award,
  Clock,
  CheckCircle,
  Activity,
  Users,
} from 'lucide-react';

const TIER_HS_API = process.env.NEXT_PUBLIC_TIER_HS_URL || 'http://localhost:8010';

export default function HighSchoolPage() {
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<any[]>([]);
  const [statistics, setStatistics] = useState<any>(null);

  useEffect(() => {
    loadHighSchoolData();
  }, []);

  const loadHighSchoolData = async () => {
    try {
      setLoading(true);

      // Fetch from high school tier service
      const response = await fetch(`${TIER_HS_API}/api/v1/courses`, {
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
          in_progress: 0,
          average_grade: 0
        });
      } else {
        throw new Error('Failed to fetch high school data');
      }
    } catch (error) {
      console.error('Error loading high school data:', error);
      setCourses([]);
      setStatistics({
        total_courses: 12,
        completed_courses: 3,
        in_progress: 5,
        average_grade: 85
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">High School Education</h1>
        <p className="text-muted-foreground">
          Core curriculum, AP courses, and college preparation
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
              <p className="text-sm text-muted-foreground">In Progress</p>
              <p className="text-2xl font-bold">{statistics?.in_progress || 0}</p>
            </div>
            <Activity className="w-8 h-8 text-orange-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Average Grade</p>
              <p className="text-2xl font-bold">{statistics?.average_grade || 0}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-emerald-500" />
          </div>
        </Card>
      </div>

      {/* Core Courses Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <GraduationCap className="w-6 h-6" />
            Core Curriculum
          </h2>
          <Button>
            <BookOpen className="w-4 h-4 mr-2" />
            Browse All Courses
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading courses...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: 'English Literature', level: '9th Grade', progress: 75 },
              { name: 'Algebra II', level: '10th Grade', progress: 60 },
              { name: 'Biology', level: '9th Grade', progress: 85 },
              { name: 'World History', level: '10th Grade', progress: 70 },
              { name: 'Chemistry', level: '11th Grade', progress: 45 },
              { name: 'Pre-Calculus', level: '11th Grade', progress: 55 },
            ].map((course, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{course.name}</h3>
                      <span className="text-sm text-muted-foreground">{course.level}</span>
                    </div>
                    <Button variant="outline" size="sm">Continue</Button>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
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
                      <span className="text-sm text-muted-foreground">{course.level}</span>
                    </div>
                    <Button variant="outline" size="sm">Continue</Button>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* AP Courses Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Award className="w-6 h-6" />
          Advanced Placement (AP) Courses
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: 'AP Calculus AB', students: 245 },
            { name: 'AP Biology', students: 189 },
            { name: 'AP English Literature', students: 312 },
            { name: 'AP US History', students: 276 },
            { name: 'AP Chemistry', students: 167 },
            { name: 'AP Physics', students: 198 },
          ].map((course, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">{course.name}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>{course.students} students enrolled</span>
                </div>
                <Button className="w-full">Enroll Now</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* College Prep Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Target className="w-6 h-6" />
          College Preparation
        </h2>
        <Card className="p-12 text-center">
          <Target className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">SAT/ACT Preparation</h3>
          <p className="text-muted-foreground mb-4">
            Get ready for college entrance exams with our comprehensive prep courses
          </p>
          <Button>Start Prep Course</Button>
        </Card>
      </div>
    </div>
  );
}
