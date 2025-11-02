"use client";

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  BookOpen,
  GraduationCap,
  Briefcase,
  TrendingUp,
  Award,
  Users,
  CheckCircle,
  Activity,
  Target,
} from 'lucide-react';

const TIER_UG_API = process.env.NEXT_PUBLIC_TIER_UG_URL || 'http://localhost:8011';

export default function UndergraduatePage() {
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<any[]>([]);
  const [statistics, setStatistics] = useState<any>(null);

  useEffect(() => {
    loadUndergraduateData();
  }, []);

  const loadUndergraduateData = async () => {
    try {
      setLoading(true);

      // Fetch from undergraduate tier service
      const response = await fetch(`${TIER_UG_API}/api/v1/courses`, {
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
          credits_earned: 0
        });
      } else {
        throw new Error('Failed to fetch undergraduate data');
      }
    } catch (error) {
      console.error('Error loading undergraduate data:', error);
      setCourses([]);
      setStatistics({
        total_courses: 32,
        completed_courses: 24,
        current_gpa: 3.65,
        credits_earned: 96
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Undergraduate Education</h1>
        <p className="text-muted-foreground">
          Bachelor's degree programs, major coursework, and career preparation
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
              <p className="text-sm text-muted-foreground">Credits Earned</p>
              <p className="text-2xl font-bold">{statistics?.credits_earned || 0}</p>
            </div>
            <Award className="w-8 h-8 text-orange-500" />
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
              { name: 'Data Structures & Algorithms', code: 'CS 201', credits: 4, grade: 'A' },
              { name: 'Advanced Calculus', code: 'MATH 301', credits: 3, grade: 'A-' },
              { name: 'Modern American Literature', code: 'ENG 250', credits: 3, grade: 'B+' },
              { name: 'Organic Chemistry I', code: 'CHEM 341', credits: 4, grade: 'B' },
              { name: 'Microeconomics', code: 'ECON 201', credits: 3, grade: 'A' },
              { name: 'World History', code: 'HIST 102', credits: 3, grade: 'A-' },
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
                    <span className="px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-700">
                      {course.grade}
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
                    <span className="px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-700">
                      {course.grade}
                    </span>
                  </div>
                  <Button variant="outline" className="w-full">View Course</Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Major Requirements Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <GraduationCap className="w-6 h-6" />
          Major Requirements
        </h2>
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Computer Science Major</h3>
              <span className="text-sm text-muted-foreground">75% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all"
                style={{ width: '75%' }}
              />
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-green-600">18</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-600">4</p>
                <p className="text-sm text-muted-foreground">In Progress</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-600">6</p>
                <p className="text-sm text-muted-foreground">Remaining</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Career Development Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Briefcase className="w-6 h-6" />
          Career Development
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <Target className="w-12 h-12 text-blue-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Internships</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Find and apply for internship opportunities
            </p>
            <Button className="w-full">Browse Internships</Button>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <Users className="w-12 h-12 text-green-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Career Counseling</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Schedule a meeting with a career advisor
            </p>
            <Button className="w-full">Book Appointment</Button>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <Activity className="w-12 h-12 text-orange-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Resume Builder</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create and update your professional resume
            </p>
            <Button className="w-full">Build Resume</Button>
          </Card>
        </div>
      </div>

      {/* Research Opportunities Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Award className="w-6 h-6" />
          Research Opportunities
        </h2>
        <Card className="p-12 text-center">
          <Award className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Undergraduate Research Programs</h3>
          <p className="text-muted-foreground mb-4">
            Get involved in cutting-edge research projects with faculty mentors
          </p>
          <Button>Explore Research Projects</Button>
        </Card>
      </div>
    </div>
  );
}
