'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import Button from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function HomePage() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [email, setEmail] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Refs for scroll animations
  const statsRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in-view');
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all sections
    const sections = [statsRef, featuresRef, cardsRef, footerRef];
    sections.forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => observer.disconnect();
  }, []);

  const handleExplorePlatform = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const demoUser = {
      id: 'demo-user-123',
      email: 'demo@eureka.edu',
      name: 'Demo User',
      role: 'student',
      tier: 'undergraduate',
    };
    localStorage.setItem('user', JSON.stringify(demoUser));
    localStorage.setItem('access_token', 'demo-token-123');
    router.push('/dashboard');
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Newsletter signup:', email);
    setEmail('');
    alert('Thank you for subscribing!');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search:', searchQuery);
  };

  const stats = [
    { label: 'Active Learners', value: '500K+', icon: 'fa-users' },
    { label: 'Courses', value: '10K+', icon: 'fa-book-open' },
    { label: 'Success Rate', value: '96%', icon: 'fa-trophy' },
    { label: 'Countries', value: '150+', icon: 'fa-globe' },
  ];

  const features = [
    {
      icon: 'fa-brain',
      title: 'AI-Powered Learning',
      description: 'Personalized learning paths with adaptive AI tutoring',
      badge: 'Popular',
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
    },
    {
      icon: 'fa-bullseye',
      title: 'Adaptive Assessments',
      description: 'Smart testing that adapts to your skill level',
      badge: 'New',
      color: 'bg-gradient-to-br from-purple-500 to-purple-600',
    },
    {
      icon: 'fa-chart-line',
      title: 'Real-Time Analytics',
      description: 'Track progress with detailed performance insights',
      badge: null,
      color: 'bg-gradient-to-br from-green-500 to-green-600',
    },
    {
      icon: 'fa-users-line',
      title: 'Collaborative Learning',
      description: 'Study groups, peer reviews, and community support',
      badge: null,
      color: 'bg-gradient-to-br from-orange-500 to-orange-600',
    },
    {
      icon: 'fa-shield-halved',
      title: 'Enterprise Security',
      description: 'FERPA/COPPA compliant with top-tier data protection',
      badge: 'Certified',
      color: 'bg-gradient-to-br from-red-500 to-red-600',
    },
    {
      icon: 'fa-bolt',
      title: 'Instant Feedback',
      description: 'Get immediate insights on your performance',
      badge: null,
      color: 'bg-gradient-to-br from-yellow-500 to-yellow-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100">
      {/* Sticky Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'bg-white shadow-xl backdrop-blur-lg' : 'bg-white/95 backdrop-blur-md shadow-md'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 sm:h-20 items-center">
            {/* Logo - Using Flexbox */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <i className="fas fa-graduation-cap text-3xl sm:text-4xl text-primary-600"></i>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                EUREKA
              </h1>
            </div>

            {/* Desktop Search - Flexbox */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <form onSubmit={handleSearch} className="w-full relative group">
                <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors"></i>
                <input
                  type="text"
                  placeholder="Search courses, topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
              </form>
            </div>

            {/* Desktop Navigation - Flexbox */}
            <div className="hidden md:flex gap-3 items-center">
              <Link href="/demo" className="text-sm font-medium text-gray-700 hover:text-primary-600 px-4 py-2 hover:bg-primary-50 rounded-lg transition-colors flex items-center">
                <i className="fas fa-play-circle mr-2"></i>
                Demo
              </Link>
              <Link href="/system-status" className="text-sm font-medium text-gray-700 hover:text-primary-600 px-4 py-2 hover:bg-primary-50 rounded-lg transition-colors flex items-center">
                <i className="fas fa-server mr-2"></i>
                Status
              </Link>
              <Link href="/auth/login" className="text-sm font-medium text-gray-700 hover:text-primary-600 px-4 py-2 hover:bg-primary-50 rounded-lg transition-colors flex items-center">
                <i className="fas fa-sign-in-alt mr-2"></i>
                Login
              </Link>
              <Link href="/auth/register" className="text-sm font-medium bg-primary-600 text-white px-6 py-2.5 rounded-lg shadow-lg hover:shadow-xl hover:bg-primary-700 transform hover:-translate-y-0.5 transition-all flex items-center">
                <i className="fas fa-user-plus mr-2"></i>
                Sign Up
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-white animate-slide-down">
            <div className="px-4 py-4 space-y-4">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative">
                <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                  type="text"
                  placeholder="Search courses, topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </form>

              <Link href="/demo" onClick={() => setMobileMenuOpen(false)} className="w-full text-left px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors flex items-center">
                <i className="fas fa-play-circle mr-2"></i>
                Interactive Demo
              </Link>
              <Link href="/system-status" onClick={() => setMobileMenuOpen(false)} className="w-full text-left px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors flex items-center">
                <i className="fas fa-server mr-2"></i>
                System Status
              </Link>
              <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)} className="w-full text-left px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors flex items-center">
                <i className="fas fa-sign-in-alt mr-2"></i>
                Login
              </Link>
              <Link href="/auth/register" onClick={() => setMobileMenuOpen(false)} className="w-full text-center px-4 py-3 bg-primary-600 text-white hover:bg-primary-700 rounded-lg transition-colors flex items-center justify-center shadow-lg">
                <i className="fas fa-user-plus mr-2"></i>
                Sign Up
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <main className="pt-28 sm:pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Content - Using Flexbox for centering */}
          <div className="text-center mb-16 space-y-6 animate-fade-in-up">
            <div className="inline-block">
              <i className="fas fa-sparkles text-4xl sm:text-5xl text-purple-500 mb-4 animate-pulse"></i>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
                EUREKA
              </span>
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto">
              Educational Universal Reasoning & Enhanced Knowledge Architecture
            </p>
            <p className="text-base sm:text-lg text-primary-600 font-semibold flex items-center justify-center gap-2">
              <i className="fas fa-rocket"></i>
              From high school to professional degrees
            </p>
          </div>

          {/* Stats Section - CSS Grid */}
          <div
            ref={statsRef}
            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-16 opacity-0 transition-opacity duration-1000 relative z-10"
          >
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:scale-105 group cursor-pointer"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-primary-500 to-purple-500 rounded-xl flex items-center justify-center mb-4 group-hover:rotate-6 transition-transform shadow-lg">
                    <i className={`fas ${stat.icon} text-2xl sm:text-3xl text-white`}></i>
                  </div>
                  <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm sm:text-base text-gray-600 font-medium">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Buttons - Flexbox */}
          <div className="text-center space-y-6 mb-24 animate-fade-in-up relative z-20" style={{ animationDelay: '600ms' }}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/dashboard"
                onClick={handleExplorePlatform}
                className="group inline-flex items-center justify-center text-base sm:text-lg px-8 py-6 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white rounded-lg font-medium"
              >
                <i className="fas fa-rocket mr-2"></i>
                Explore Platform (Full Access)
                <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
              </Link>
              <Link href="/auth/register" className="text-base sm:text-lg px-8 py-6 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all border-2 border-primary-600 text-primary-600 hover:bg-primary-50 rounded-lg font-medium flex items-center">
                <i className="fas fa-user-plus mr-2"></i>
                Get Started Free
              </Link>
            </div>
            <p className="text-sm sm:text-base text-gray-500 flex items-center justify-center gap-2">
              <i className="fas fa-check-circle text-green-500"></i>
              No login required - explore all features instantly
            </p>
          </div>

          {/* Enhanced Features Grid - CSS Grid with responsive columns */}
          <div ref={featuresRef} className="mb-24 opacity-0 transition-opacity duration-1000">
            <div className="text-center mb-12 space-y-3">
              <div className="inline-block">
                <i className="fas fa-stars text-4xl text-purple-500"></i>
              </div>
              <h3 className="text-3xl sm:text-4xl font-bold text-gray-900">Powerful Features</h3>
              <p className="text-lg sm:text-xl text-gray-600">Everything you need for successful learning</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 cursor-pointer relative overflow-hidden"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  {/* Animated Background Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Badge */}
                  {feature.badge && (
                    <div className="absolute top-6 right-6 z-10">
                      <span className="px-3 py-1 bg-gradient-to-r from-primary-500 to-purple-500 text-white text-xs font-bold rounded-full shadow-lg animate-pulse">
                        <i className="fas fa-star mr-1"></i>
                        {feature.badge}
                      </span>
                    </div>
                  )}

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Icon */}
                    <div className={`${feature.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform shadow-xl`}>
                      <i className={`fas ${feature.icon} text-2xl text-white`}></i>
                    </div>

                    {/* Title & Description */}
                    <h4 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                      {feature.title}
                    </h4>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>

                    {/* Hover Arrow */}
                    <div className="mt-6 flex items-center text-primary-600 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-2 transition-all">
                      <span className="font-semibold">Learn more</span>
                      <i className="fas fa-arrow-right ml-2"></i>
                    </div>
                  </div>

                  {/* Bottom Border Animation */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Original Three Cards - Enhanced with CSS Grid */}
          <div ref={cardsRef} className="mb-24 opacity-0 transition-opacity duration-1000">
            <div className="text-center mb-12 space-y-3">
              <div className="inline-block">
                <i className="fas fa-users-between-lines text-4xl text-purple-500"></i>
              </div>
              <h3 className="text-3xl sm:text-4xl font-bold text-gray-900">Built For Everyone</h3>
              <p className="text-lg sm:text-xl text-gray-600">From students to institutions</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card variant="elevated" className="hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader className="relative z-10">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                      <i className="fas fa-user-graduate text-white text-2xl"></i>
                    </div>
                    <CardTitle className="text-2xl">For Students</CardTitle>
                  </div>
                  <CardDescription className="text-base">
                    Personalized learning paths with AI-powered tutoring
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  <ul className="space-y-3 text-sm text-gray-700">
                    <li className="flex items-center gap-3 group/item hover:translate-x-2 transition-transform">
                      <i className="fas fa-check-circle text-blue-500 text-lg"></i>
                      <span>Adaptive assessments</span>
                    </li>
                    <li className="flex items-center gap-3 group/item hover:translate-x-2 transition-transform">
                      <i className="fas fa-check-circle text-blue-500 text-lg"></i>
                      <span>Real-time feedback</span>
                    </li>
                    <li className="flex items-center gap-3 group/item hover:translate-x-2 transition-transform">
                      <i className="fas fa-check-circle text-blue-500 text-lg"></i>
                      <span>Gamification & badges</span>
                    </li>
                    <li className="flex items-center gap-3 group/item hover:translate-x-2 transition-transform">
                      <i className="fas fa-check-circle text-blue-500 text-lg"></i>
                      <span>Track your progress</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card variant="elevated" className="hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-green-100 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader className="relative z-10">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                      <i className="fas fa-chalkboard-user text-white text-2xl"></i>
                    </div>
                    <CardTitle className="text-2xl">For Teachers</CardTitle>
                  </div>
                  <CardDescription className="text-base">
                    Powerful tools to create engaging courses
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  <ul className="space-y-3 text-sm text-gray-700">
                    <li className="flex items-center gap-3 group/item hover:translate-x-2 transition-transform">
                      <i className="fas fa-check-circle text-green-500 text-lg"></i>
                      <span>Course management</span>
                    </li>
                    <li className="flex items-center gap-3 group/item hover:translate-x-2 transition-transform">
                      <i className="fas fa-check-circle text-green-500 text-lg"></i>
                      <span>Analytics dashboard</span>
                    </li>
                    <li className="flex items-center gap-3 group/item hover:translate-x-2 transition-transform">
                      <i className="fas fa-check-circle text-green-500 text-lg"></i>
                      <span>Auto-grading tools</span>
                    </li>
                    <li className="flex items-center gap-3 group/item hover:translate-x-2 transition-transform">
                      <i className="fas fa-check-circle text-green-500 text-lg"></i>
                      <span>Collaboration features</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card variant="elevated" className="hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-purple-100 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader className="relative z-10">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                      <i className="fas fa-building-columns text-white text-2xl"></i>
                    </div>
                    <CardTitle className="text-2xl">For Institutions</CardTitle>
                  </div>
                  <CardDescription className="text-base">
                    Enterprise-grade platform for all tiers
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  <ul className="space-y-3 text-sm text-gray-700">
                    <li className="flex items-center gap-3 group/item hover:translate-x-2 transition-transform">
                      <i className="fas fa-check-circle text-purple-500 text-lg"></i>
                      <span>FERPA/COPPA compliant</span>
                    </li>
                    <li className="flex items-center gap-3 group/item hover:translate-x-2 transition-transform">
                      <i className="fas fa-check-circle text-purple-500 text-lg"></i>
                      <span>Multi-tenant architecture</span>
                    </li>
                    <li className="flex items-center gap-3 group/item hover:translate-x-2 transition-transform">
                      <i className="fas fa-check-circle text-purple-500 text-lg"></i>
                      <span>LTI 1.3 integration</span>
                    </li>
                    <li className="flex items-center gap-3 group/item hover:translate-x-2 transition-transform">
                      <i className="fas fa-check-circle text-purple-500 text-lg"></i>
                      <span>Custom tier features</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Get in Touch Section */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <i className="fas fa-envelope text-4xl text-primary-600 mb-4"></i>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Get in Touch</h2>
            <p className="text-lg text-gray-600">We'd love to hear from you. Reach out anytime!</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary-100 p-3 rounded-xl">
                      <i className="fas fa-envelope text-primary-600 text-xl"></i>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Email</p>
                      <a href="mailto:support@abplearning.com" className="text-primary-600 hover:text-primary-700 transition-colors">
                        support@abplearning.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-green-100 p-3 rounded-xl">
                      <i className="fas fa-phone text-green-600 text-xl"></i>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Phone</p>
                      <a href="tel:+15551234567" className="text-green-600 hover:text-green-700 transition-colors">
                        +1 (555) 123-4567
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-purple-100 p-3 rounded-xl">
                      <i className="fas fa-map-marker-alt text-purple-600 text-xl"></i>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Address</p>
                      <p className="text-gray-600">123 Learning Street<br />Education City, EC 12345</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert('Message sent! We will get back to you soon.'); }}>
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    placeholder="Your Name"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="your@email.com"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-900 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    placeholder="Your message..."
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                  ></textarea>
                </div>
                <Button type="submit" size="lg" className="w-full shadow-lg hover:shadow-xl">
                  <i className="fas fa-paper-plane mr-2"></i>
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - CSS Grid Layout */}
      <footer ref={footerRef} className="bg-gradient-to-br from-gray-900 to-gray-800 text-white opacity-0 transition-opacity duration-1000">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-12 mb-8">
            {/* Company Info */}
            <div className="sm:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <i className="fas fa-graduation-cap text-4xl text-primary-400"></i>
                <h3 className="text-3xl font-bold">E.U.R.E.K.A</h3>
              </div>
              <p className="text-xl text-primary-300 font-semibold mb-4">
                Explore Ideas. Master Knowledge. Drive Innovation.
              </p>
              <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
                Educational Universal Reasoning & Enhanced Knowledge Architecture.
                Empowering learners from high school to professional degrees.
              </p>

              {/* Download App Buttons - Flexbox */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <i className="fas fa-download"></i>
                  Download App
                </h4>
                <div className="flex gap-3 flex-wrap">
                  <a href="#" className="group bg-gray-800 hover:bg-gray-700 px-4 py-3 rounded-xl transition-all transform hover:-translate-y-1 shadow-lg flex items-center gap-3">
                    <i className="fab fa-google-play text-2xl group-hover:scale-110 transition-transform"></i>
                    <div className="text-left">
                      <p className="text-xs text-gray-400">GET IT ON</p>
                      <p className="text-sm font-semibold">Google Play</p>
                    </div>
                  </a>
                  <a href="#" className="group bg-gray-800 hover:bg-gray-700 px-4 py-3 rounded-xl transition-all transform hover:-translate-y-1 shadow-lg flex items-center gap-3">
                    <i className="fab fa-apple text-2xl group-hover:scale-110 transition-transform"></i>
                    <div className="text-left">
                      <p className="text-xs text-gray-400">Download on the</p>
                      <p className="text-sm font-semibold">App Store</p>
                    </div>
                  </a>
                </div>
              </div>

              {/* Social Icons - Flexbox */}
              <div className="flex gap-4 flex-wrap">
                <a href="#" className="group p-3 bg-gray-800 rounded-xl hover:bg-primary-600 transition-all transform hover:-translate-y-1 shadow-lg">
                  <i className="fab fa-github text-xl group-hover:scale-110 transition-transform"></i>
                </a>
                <a href="#" className="group p-3 bg-gray-800 rounded-xl hover:bg-blue-500 transition-all transform hover:-translate-y-1 shadow-lg">
                  <i className="fab fa-twitter text-xl group-hover:scale-110 transition-transform"></i>
                </a>
                <a href="#" className="group p-3 bg-gray-800 rounded-xl hover:bg-blue-600 transition-all transform hover:-translate-y-1 shadow-lg">
                  <i className="fab fa-linkedin text-xl group-hover:scale-110 transition-transform"></i>
                </a>
                <a href="#" className="group p-3 bg-gray-800 rounded-xl hover:bg-red-600 transition-all transform hover:-translate-y-1 shadow-lg">
                  <i className="fab fa-youtube text-xl group-hover:scale-110 transition-transform"></i>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <i className="fas fa-link"></i>
                Quick Links
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/dashboard" className="text-gray-400 hover:text-primary-400 transition-colors flex items-center gap-2 group">
                    <i className="fas fa-chevron-right text-xs group-hover:translate-x-1 transition-transform"></i>
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/demo" className="text-gray-400 hover:text-primary-400 transition-colors flex items-center gap-2 group">
                    <i className="fas fa-chevron-right text-xs group-hover:translate-x-1 transition-transform"></i>
                    Interactive Demo
                  </Link>
                </li>
                <li>
                  <Link href="/system-status" className="text-gray-400 hover:text-primary-400 transition-colors flex items-center gap-2 group">
                    <i className="fas fa-chevron-right text-xs group-hover:translate-x-1 transition-transform"></i>
                    System Status
                  </Link>
                </li>
                <li>
                  <Link href="/auth/register" className="text-gray-400 hover:text-primary-400 transition-colors flex items-center gap-2 group">
                    <i className="fas fa-chevron-right text-xs group-hover:translate-x-1 transition-transform"></i>
                    Sign Up
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <i className="fas fa-book"></i>
                Resources
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/help" className="text-gray-400 hover:text-primary-400 transition-colors flex items-center gap-2 group">
                    <i className="fas fa-chevron-right text-xs group-hover:translate-x-1 transition-transform"></i>
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/community" className="text-gray-400 hover:text-primary-400 transition-colors flex items-center gap-2 group">
                    <i className="fas fa-chevron-right text-xs group-hover:translate-x-1 transition-transform"></i>
                    Community
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-gray-400 hover:text-primary-400 transition-colors flex items-center gap-2 group">
                    <i className="fas fa-chevron-right text-xs group-hover:translate-x-1 transition-transform"></i>
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/api-docs" className="text-gray-400 hover:text-primary-400 transition-colors flex items-center gap-2 group">
                    <i className="fas fa-chevron-right text-xs group-hover:translate-x-1 transition-transform"></i>
                    API Documentation
                  </Link>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <i className="fas fa-envelope"></i>
                Newsletter
              </h4>
              <p className="text-gray-400 text-sm mb-4">Subscribe to get updates on new courses and features.</p>
              <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                <div className="relative group">
                  <i className="fas fa-envelope absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-400 transition-colors"></i>
                  <input
                    type="email"
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white placeholder-gray-500 transition-all"
                  />
                </div>
                <Button type="submit" className="w-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all">
                  <i className="fas fa-paper-plane mr-2"></i>
                  Subscribe
                </Button>
              </form>
            </div>
          </div>

          {/* Bottom Bar - Flexbox */}
          <div className="pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm flex items-center gap-2">
              <i className="fas fa-copyright"></i>
              2024 EUREKA. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-6 text-sm justify-center">
              <Link href="/privacy" className="text-gray-400 hover:text-primary-400 transition-colors flex items-center gap-2">
                <i className="fas fa-shield-alt"></i>
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-primary-400 transition-colors flex items-center gap-2">
                <i className="fas fa-file-contract"></i>
                Terms of Service
              </Link>
              <Link href="/contact" className="text-gray-400 hover:text-primary-400 transition-colors flex items-center gap-2">
                <i className="fas fa-envelope"></i>
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Global Styles for Advanced Animations */}
      <style jsx global>{`
        /* Scroll-triggered fade in */
        .animate-in-view {
          opacity: 1 !important;
        }

        /* Slide down animation for mobile menu */
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }

        /* Fade in up animation */
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }

        /* Gradient animation */
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        /* Smooth scroll */
        html {
          scroll-behavior: smooth;
        }

        /* Responsive improvements */
        @media (max-width: 640px) {
          .grid {
            gap: 1rem;
          }
        }

        @media (min-width: 768px) and (max-width: 1024px) {
          .grid {
            gap: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}
