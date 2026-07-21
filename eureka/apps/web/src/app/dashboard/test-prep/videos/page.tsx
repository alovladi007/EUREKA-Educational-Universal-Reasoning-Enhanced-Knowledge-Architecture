'use client';

/**
 * /dashboard/test-prep/videos — subscription-gated video course portal.
 *
 * Migrated from (dashboard)/test-prep/page.tsx (which used to live at
 * /test-prep) into the dashboard test-prep tree so there's no longer
 * a URL collision with /dashboard/test-prep (the adaptive QBank). The
 * two products are distinct (QBank = day-to-day question practice;
 * Videos = paid video courses + content viewing) but they belong in
 * the same module's sub-nav. The "Videos" tab in ./layout.tsx now
 * points here.
 *
 * Internal sub-routes:
 *   /dashboard/test-prep/videos/pricing — subscription plan picker
 *   /dashboard/test-prep/videos/watch/[contentId] — video player
 *
 * Post-payment flow lands the user on /dashboard/test-prep/{EXAM_CODE}
 * (the QBank's per-exam page), which is intentional cross-product UX.
 */

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Video,
  BookOpen,
  FileQuestion,
  TrendingUp,
  Clock,
  CheckCircle2,
  PlayCircle,
  Award,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface UserAccess {
  exam_category: string;
  plan_type: string;
  has_video_access: boolean;
  has_notes_access: boolean;
  has_qbank_access: boolean;
  practice_exams_available: number;
  status: string;
  end_date: string | null;
}

interface ContentPackage {
  id: string;
  package_name: string;
  exam_category: string;
  package_type: string;
  subject: string;
  topic: string;
  total_videos: number;
  total_questions: number;
  total_duration_minutes: number;
  difficulty_level: string;
  thumbnail_url: string;
  description: string;
}

interface UserProgress {
  package_id: string;
  videos_watched_count: number;
  questions_attempted: number;
  questions_correct: number;
  completion_percentage: number;
  total_study_time_minutes: number;
  accuracy_percentage: number;
}

function TestPrepDashboardInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [access, setAccess] = useState<UserAccess | null>(null);
  const [packages, setPackages] = useState<ContentPackage[]>([]);
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    // Check for success message from payment
    if (searchParams.get('success') === 'true') {
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 5000);
    }

    fetchUserAccess();
    fetchPackages();
    fetchProgress();
  }, []);

  const fetchUserAccess = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:3010/api/my-access', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.hasAccess) {
        setAccess(data.access);
      }
    } catch (error) {
      console.error('Failed to fetch access:', error);
    }
  };

  const fetchPackages = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:3010/api/packages', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setPackages(data.packages || []);
    } catch (error) {
      console.error('Failed to fetch packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProgress = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:3010/api/progress', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setProgress(data.progress || []);
    } catch (error) {
      console.error('Failed to fetch progress:', error);
    }
  };

  const getProgressForPackage = (packageId: string) => {
    return progress.find(p => p.package_id === packageId);
  };

  const totalStudyHours = progress.reduce((acc, p) => acc + (p.total_study_time_minutes || 0), 0) / 60;
  const totalQuestionsAttempted = progress.reduce((acc, p) => acc + (p.questions_attempted || 0), 0);
  const avgAccuracy = progress.length > 0
    ? progress.reduce((acc, p) => acc + (p.accuracy_percentage || 0), 0) / progress.length
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!access) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-2xl mx-auto text-center">
          <CardHeader>
            <CardTitle className="text-2xl">No Active Subscription</CardTitle>
            <CardDescription>
              You need an active subscription to access test prep content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild size="lg">
              <Link href="/dashboard/test-prep/videos/pricing">
                View Pricing Plans
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          <span>Subscription activated successfully! Welcome to {access.exam_category} Test Prep.</span>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{access.exam_category} Test Prep Dashboard</h1>
        <p className="text-muted-foreground">
          Plan: <Badge variant="secondary">{access.plan_type.replace('_', ' ').toUpperCase()}</Badge>
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Study Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{totalStudyHours.toFixed(1)}h</p>
                <p className="text-xs text-muted-foreground">Total hours</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <FileQuestion className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{totalQuestionsAttempted}</p>
                <p className="text-xs text-muted-foreground">Attempted</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Accuracy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Target className="w-8 h-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{avgAccuracy.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground">Average</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Practice Exams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Award className="w-8 h-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{access.practice_exams_available}</p>
                <p className="text-xs text-muted-foreground">Available</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Content</TabsTrigger>
          {access.has_video_access && <TabsTrigger value="videos">Videos</TabsTrigger>}
          {access.has_qbank_access && <TabsTrigger value="qbank">Question Bank</TabsTrigger>}
          <TabsTrigger value="progress">My Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => {
              const pkgProgress = getProgressForPackage(pkg.id);
              const canAccess =
                (pkg.package_type === 'videos' && access.has_video_access) ||
                (pkg.package_type === 'qbank' && access.has_qbank_access) ||
                (pkg.package_type === 'bundle' && (access.has_video_access || access.has_qbank_access));

              return (
                <Card key={pkg.id} className={!canAccess ? 'opacity-50' : ''}>
                  <CardHeader>
                    <div className="aspect-video bg-muted rounded-md mb-3 flex items-center justify-center">
                      {pkg.package_type === 'videos' ? (
                        <Video className="w-12 h-12 text-muted-foreground" />
                      ) : (
                        <FileQuestion className="w-12 h-12 text-muted-foreground" />
                      )}
                    </div>
                    <CardTitle className="text-lg">{pkg.package_name}</CardTitle>
                    <CardDescription>{pkg.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subject:</span>
                        <span className="font-medium">{pkg.subject}</span>
                      </div>
                      {pkg.total_videos > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Videos:</span>
                          <span className="font-medium">{pkg.total_videos}</span>
                        </div>
                      )}
                      {pkg.total_questions > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Questions:</span>
                          <span className="font-medium">{pkg.total_questions}</span>
                        </div>
                      )}

                      {pkgProgress && (
                        <div className="pt-2">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium">{pkgProgress.completion_percentage?.toFixed(0) || 0}%</span>
                          </div>
                          <Progress value={pkgProgress.completion_percentage || 0} />
                        </div>
                      )}

                      {canAccess ? (
                        <Button asChild className="w-full mt-4">
                          <Link href={`/dashboard/test-prep/videos/watch/${pkg.id}`}>
                            <PlayCircle className="w-4 h-4 mr-2" />
                            {pkgProgress ? 'Continue' : 'Start'}
                          </Link>
                        </Button>
                      ) : (
                        <Button className="w-full mt-4" disabled>
                          Upgrade to Access
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="videos">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages
              .filter(pkg => pkg.package_type === 'videos' || pkg.package_type === 'bundle')
              .map((pkg) => (
                <Card key={pkg.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{pkg.package_name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button asChild className="w-full">
                      <Link href={`/dashboard/test-prep/videos/watch/${pkg.id}`}>
                        <PlayCircle className="w-4 h-4 mr-2" />
                        Watch
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="qbank">
          <div className="text-center py-12">
            <FileQuestion className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">Question Bank</h3>
            <p className="text-muted-foreground mb-4">
              Practice with thousands of questions tailored to your exam
            </p>
            <Button size="lg">
              Start Practice Session
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="progress">
          <div className="space-y-4">
            {progress.map((p) => {
              const pkg = packages.find(pk => pk.id === p.package_id);
              if (!pkg) return null;

              return (
                <Card key={p.package_id}>
                  <CardHeader>
                    <CardTitle>{pkg.package_name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Completion</p>
                        <p className="text-2xl font-bold">{p.completion_percentage?.toFixed(0) || 0}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Study Time</p>
                        <p className="text-2xl font-bold">{(p.total_study_time_minutes / 60).toFixed(1)}h</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Questions</p>
                        <p className="text-2xl font-bold">{p.questions_attempted || 0}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Accuracy</p>
                        <p className="text-2xl font-bold">{p.accuracy_percentage?.toFixed(0) || 0}%</p>
                      </div>
                    </div>
                    <Progress value={p.completion_percentage || 0} />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}


// Wrap the page that calls useSearchParams() in a Suspense boundary
// so Next 14 static export doesn't bail out. (Session 3.6, 2026-05.)
import { Suspense } from 'react';
export default function TestPrepDashboard() {
  return (
    <Suspense fallback={null}>
      <TestPrepDashboardInner />
    </Suspense>
  );
}
