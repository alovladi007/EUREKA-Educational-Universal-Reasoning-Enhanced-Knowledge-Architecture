'use client';

import Link from 'next/link';
import Button from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary-600">EUREKA</h1>
            </div>
            <div className="flex gap-4">
              <Link href="/system-status">
                <Button variant="ghost">System Status</Button>
              </Link>
              <Link href="/auth/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/auth/register">
                <Button>Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            Welcome to EUREKA
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Educational Universal Reasoning & Enhanced Knowledge Architecture
            <br />
            <span className="text-primary-600">From high school to professional degrees</span>
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>For Students</CardTitle>
              <CardDescription>
                Personalized learning paths with AI-powered tutoring
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✓ Adaptive assessments</li>
                <li>✓ Real-time feedback</li>
                <li>✓ Gamification & badges</li>
                <li>✓ Track your progress</li>
              </ul>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle>For Teachers</CardTitle>
              <CardDescription>
                Powerful tools to create engaging courses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✓ Course management</li>
                <li>✓ Analytics dashboard</li>
                <li>✓ Auto-grading tools</li>
                <li>✓ Collaboration features</li>
              </ul>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle>For Institutions</CardTitle>
              <CardDescription>
                Enterprise-grade platform for all tiers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✓ FERPA/COPPA compliant</li>
                <li>✓ Multi-tenant architecture</li>
                <li>✓ LTI 1.3 integration</li>
                <li>✓ Custom tier features</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Link href="/auth/register">
            <Button size="lg">Get Started Free</Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
