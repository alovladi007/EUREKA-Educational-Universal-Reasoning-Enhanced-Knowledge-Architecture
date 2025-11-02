'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/stores/auth';
import {
  BookOpen,
  Users,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
} from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  subject: string;
  is_published: boolean;
  enrollment_count?: number;
  avg_progress?: number;
}

interface Stats {
  total_courses: number;
  total_students: number;
  active_enrollments: number;
  avg_completion: number;
}

export default function TeacherDashboard() {
  const { user } = useAuthStore();
  const [courses, setCourses] = useState<Course[]>([]);
  const [stats, setStats] = useState<Stats>({
    total_courses: 0,
    total_students: 0,
    active_enrollments: 0,
    avg_completion: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load courses taught by this teacher
      const coursesResponse = await apiClient.get('/courses', {
        params: {
          instructor_id: user?.id,
          limit: 10,
        },
      });
      const coursesData = coursesResponse.data.data || [];
      setCourses(coursesData);

      // Calculate stats
      const totalStudents = coursesData.reduce(
        (sum: number, course: Course) => sum + (course.enrollment_count || 0),
        0
      );
      const avgCompletion = coursesData.reduce(
        (sum: number, course: Course) => sum + (course.avg_progress || 0),
        0
      ) / coursesData.length || 0;

      setStats({
        total_courses: coursesData.length,
        total_students: totalStudents,
        active_enrollments: totalStudents,
        avg_completion: Math.round(avgCompletion),
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
              <p className="mt-2 text-sm text-gray-600">
                Manage your classes and track student progress.
              </p>
            </div>
            <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              <Plus className="h-5 w-5 mr-2" />
              Create Course
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BookOpen className="h-8 w-8 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">My Courses</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total_courses}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total_students}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Enrollments</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.active_enrollments}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg Completion</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.avg_completion}%</p>
                </div>
              </div>
            </Card>
          </div>

          {/* My Courses */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">My Courses</h2>
            {courses.length === 0 ? (
              <Card className="p-8 text-center">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">You haven't created any courses yet.</p>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                  Create Your First Course
                </button>
              </Card>
            ) : (
              <div className="space-y-4">
                {courses.map((course) => (
                  <Card key={course.id} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {course.title}
                          </h3>
                          {course.is_published ? (
                            <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                              Published
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-xs font-medium text-yellow-700 bg-yellow-100 rounded-full">
                              Draft
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-4">{course.description}</p>
                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            <span>{course.enrollment_count || 0} students</span>
                          </div>
                          <div className="flex items-center">
                            <TrendingUp className="h-4 w-4 mr-1" />
                            <span>{Math.round(course.avg_progress || 0)}% avg progress</span>
                          </div>
                          <div className="capitalize">
                            <span>{course.subject}</span>
                          </div>
                        </div>
                      </div>
                      <div className="ml-6 space-y-2">
                        <button className="px-4 py-2 text-sm text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50">
                          View Course
                        </button>
                        <button className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 block w-full">
                          Manage
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <Clock className="h-8 w-8 text-indigo-600 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">Pending Reviews</h3>
                <p className="text-sm text-gray-600">Review student submissions</p>
              </Card>
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <AlertCircle className="h-8 w-8 text-yellow-600 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">At-Risk Students</h3>
                <p className="text-sm text-gray-600">Students needing attention</p>
              </Card>
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <TrendingUp className="h-8 w-8 text-green-600 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">Analytics</h3>
                <p className="text-sm text-gray-600">View detailed insights</p>
              </Card>
            </div>
          </div>
    </div>
  );
}
