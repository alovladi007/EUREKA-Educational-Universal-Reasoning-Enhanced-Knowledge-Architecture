'use client';

/**
 * XR Learning Labs - Enhanced Dashboard
 *
 * Complete interface matching the design specifications:
 * - Real-time dashboard statistics
 * - Simulation cards with categories and ratings
 * - VR Experience Center monitoring
 * - AR Features section
 * - Hardware compatibility
 * - Content Creation Studio access
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// =====================================================
// TYPES
// =====================================================

interface DashboardStats {
  activeSimulations: number;
  totalUsers: number;
  avgEngagement: string;
  vrSessions: number;
}

interface Simulation {
  id: string;
  title: string;
  description: string;
  category: string;
  experience_type: string;
  difficulty_level: string;
  thumbnail_url?: string;
  user_count: number;
  avg_rating: number;
  rating_count: number;
  tags: string[];
  duration_minutes: number;
}

interface ExperienceCenterStats {
  activeSessions: number;
  avgSessionTime: number;
  completionRate: number;
}

interface Category {
  value: string;
  label: string;
  icon: string;
  count: number;
}

// =====================================================
// CONSTANTS
// =====================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_XR_API_URL || 'http://localhost:3005/api/xr';

const TYPE_BADGES = {
  vr_lab: { label: 'VR', color: 'bg-purple-500' },
  ar_overlay: { label: 'AR', color: 'bg-blue-500' },
  mixed_reality: { label: 'MR', color: 'bg-pink-500' },
  '3d_model': { label: '3D', color: 'bg-green-500' },
  simulation: { label: 'SIM', color: 'bg-orange-500' },
  virtual_tour: { label: 'TOUR', color: 'bg-cyan-500' },
  '360_video': { label: '360°', color: 'bg-yellow-500' },
  hologram: { label: 'HOLO', color: 'bg-indigo-500' }
};

// =====================================================
// MAIN COMPONENT
// =====================================================

export default function XRLabsEnhancedDashboard() {
  const router = useRouter();

  // State
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    activeSimulations: 0,
    totalUsers: 0,
    avgEngagement: '0',
    vrSessions: 0
  });

  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const [experienceCenterStats, setExperienceCenterStats] = useState<ExperienceCenterStats>({
    activeSessions: 0,
    avgSessionTime: 0,
    completionRate: 0
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('popular');
  const [loading, setLoading] = useState(true);

  // =====================================================
  // DATA FETCHING
  // =====================================================

  useEffect(() => {
    fetchDashboardStats();
    fetchCategories();
    fetchExperienceCenterStats();

    // Refresh stats every 30 seconds
    const interval = setInterval(() => {
      fetchDashboardStats();
      fetchExperienceCenterStats();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchSimulations();
  }, [selectedCategory, selectedType, sortBy]);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/stats`);
      const data = await response.json();
      setDashboardStats(data.stats);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  const fetchSimulations = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (selectedType !== 'all') params.append('type', selectedType);
      params.append('sort', sortBy);
      params.append('limit', '12');

      const response = await fetch(`${API_BASE_URL}/simulations?${params}`);
      const data = await response.json();
      setSimulations(data.simulations || []);
    } catch (error) {
      console.error('Error fetching simulations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchExperienceCenterStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/monitoring/experience-center-stats`);
      const data = await response.json();
      setExperienceCenterStats(data.stats);
    } catch (error) {
      console.error('Error fetching experience center stats:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`);
      const data = await response.json();
      setCategories([
        { value: 'all', label: 'All Categories', icon: '🎮', count: 0 },
        ...data.categories
      ]);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const launchSimulation = (simulationId: string) => {
    router.push(`/xr-labs/experience/${simulationId}`);
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <span className="text-5xl">🥽</span>
              XR Learning Labs
            </h1>
            <p className="text-gray-300">Virtual Reality, Augmented Reality, and immersive learning simulations</p>
          </div>

          <Link
            href="/xr-labs/scene-builder"
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg"
          >
            <span className="mr-2">🎨</span>
            Create New Simulation
          </Link>
        </div>

        {/* DASHBOARD STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard
            label="Active Simulations"
            value={dashboardStats.activeSimulations}
            bgColor="from-purple-600 to-pink-600"
          />
          <StatCard
            label="Total Users"
            value={dashboardStats.totalUsers.toLocaleString()}
            bgColor="from-blue-600 to-cyan-600"
          />
          <StatCard
            label="Avg Engagement"
            value={`${dashboardStats.avgEngagement}%`}
            bgColor="from-green-600 to-emerald-600"
          />
          <StatCard
            label="VR Sessions"
            value={dashboardStats.vrSessions.toLocaleString()}
            bgColor="from-orange-600 to-red-600"
          />
        </div>

        {/* AVAILABLE SIMULATIONS */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Available Simulations</h2>

            <div className="flex gap-4">
              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 bg-white/10 border border-white/30 rounded-lg backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value} className="bg-gray-900">
                    {cat.icon} {cat.label} {cat.count > 0 && `(${cat.count})`}
                  </option>
                ))}
              </select>

              {/* Type Filter */}
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-2 bg-white/10 border border-white/30 rounded-lg backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all" className="bg-gray-900">All Types</option>
                <option value="vr_lab" className="bg-gray-900">🥽 VR Lab</option>
                <option value="ar_overlay" className="bg-gray-900">📱 AR Overlay</option>
                <option value="mixed_reality" className="bg-gray-900">👓 Mixed Reality</option>
                <option value="simulation" className="bg-gray-900">⚛️ Simulation</option>
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-white/10 border border-white/30 rounded-lg backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="popular" className="bg-gray-900">Most Popular</option>
                <option value="rating" className="bg-gray-900">Highest Rated</option>
                <option value="recent" className="bg-gray-900">Most Recent</option>
              </select>
            </div>
          </div>

          {/* Simulation Grid */}
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin text-6xl mb-4">🥽</div>
              <p className="text-xl">Loading simulations...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {simulations.map((sim) => (
                <SimulationCard
                  key={sim.id}
                  simulation={sim}
                  onLaunch={() => launchSimulation(sim.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* VR EXPERIENCE CENTER */}
        <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-xl p-8 border border-white/20 backdrop-blur-sm">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="text-3xl">🎯</span>
            VR Experience Center
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-5xl font-bold text-blue-400 mb-2">
                {experienceCenterStats.activeSessions}
              </div>
              <div className="text-sm text-gray-300">Active Sessions</div>
              <div className="text-xs text-gray-400 mt-1">Currently in VR</div>
            </div>

            <div className="text-center">
              <div className="text-5xl font-bold text-green-400 mb-2">
                {experienceCenterStats.avgSessionTime}min
              </div>
              <div className="text-sm text-gray-300">Avg Session Time</div>
              <div className="text-xs text-gray-400 mt-1">Per learning session</div>
            </div>

            <div className="text-center">
              <div className="text-5xl font-bold text-orange-400 mb-2">
                {experienceCenterStats.completionRate}%
              </div>
              <div className="text-sm text-gray-300">Completion Rate</div>
              <div className="text-xs text-gray-400 mt-1">Finish simulations</div>
            </div>
          </div>
        </div>

        {/* AUGMENTED REALITY FEATURES */}
        <div className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 rounded-xl p-8 border border-white/20 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
                <span className="text-3xl">📱</span>
                Augmented Reality Features
              </h2>
              <p className="text-gray-300">Mixed Reality Learning</p>
              <p className="text-sm text-gray-400">Overlay digital content onto the physical world for enhanced learning experiences</p>
            </div>

            <button className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all">
              Explore AR Content
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="text-center p-6 bg-white/5 rounded-lg">
              <div className="text-4xl font-bold text-cyan-400 mb-2">15+</div>
              <div className="text-sm text-gray-300">AR Modules</div>
            </div>

            <div className="text-center p-6 bg-white/5 rounded-lg">
              <div className="text-4xl font-bold text-green-400 mb-2">95%</div>
              <div className="text-sm text-gray-300">Satisfaction</div>
            </div>

            <div className="text-center p-6 bg-white/5 rounded-lg">
              <div className="text-4xl font-bold text-purple-400 mb-2">2.3K</div>
              <div className="text-sm text-gray-300">Active Users</div>
            </div>
          </div>
        </div>

        {/* SUPPORTED HARDWARE */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Supported Hardware</h2>
            <Link
              href="/xr-labs/compatibility"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              View Compatibility Guide →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <HardwareCard
              name="Meta Quest"
              icon="🥽"
              description="Quest 2 & 3"
              supported={true}
            />
            <HardwareCard
              name="HTC Vive"
              icon="🎮"
              description="All models"
              supported={true}
            />
            <HardwareCard
              name="Valve Index"
              icon="🎯"
              description="Full support"
              supported={true}
            />
            <HardwareCard
              name="WebXR"
              icon="🌐"
              description="Browser-based"
              supported={true}
            />
          </div>
        </div>

        {/* CONTENT CREATION STUDIO CTA */}
        <div className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 rounded-xl p-8 border border-green-500/30 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
                <span className="text-3xl">🎨</span>
                Content Creation Studio
              </h2>
              <p className="text-gray-300 mb-4">Create custom VR/AR experiences with our no-code builder</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">🏗️</div>
                  <div>
                    <div className="font-semibold">Scene Builder</div>
                    <div className="text-sm text-gray-400">Drag-and-drop 3D environment creation</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-3xl">📚</div>
                  <div>
                    <div className="font-semibold">Asset Library</div>
                    <div className="text-sm text-gray-400">10,000+ 3D models and textures</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-3xl">🚀</div>
                  <div>
                    <div className="font-semibold">One-Click Publish</div>
                    <div className="text-sm text-gray-400">Deploy to all platforms instantly</div>
                  </div>
                </div>
              </div>
            </div>

            <Link
              href="/xr-labs/scene-builder"
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg whitespace-nowrap"
            >
              Open Studio →
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

// =====================================================
// SUB-COMPONENTS
// =====================================================

function StatCard({ label, value, bgColor }: { label: string; value: string | number; bgColor: string }) {
  return (
    <div className={`bg-gradient-to-br ${bgColor} rounded-xl p-6 shadow-lg`}>
      <div className="text-5xl font-bold mb-2">{value}</div>
      <div className="text-sm opacity-90">{label}</div>
    </div>
  );
}

function SimulationCard({ simulation, onLaunch }: { simulation: Simulation; onLaunch: () => void }) {
  const typeBadge = TYPE_BADGES[simulation.experience_type as keyof typeof TYPE_BADGES] || { label: 'LAB', color: 'bg-gray-500' };

  return (
    <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl overflow-hidden border border-white/20 hover:border-blue-500 transition-all hover:shadow-2xl hover:shadow-blue-500/50 cursor-pointer group">
      {/* Thumbnail */}
      <div className="h-48 bg-gradient-to-br from-purple-600 to-pink-600 relative overflow-hidden">
        {simulation.thumbnail_url ? (
          <img src={simulation.thumbnail_url} alt={simulation.title} className="w-full h-full object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full text-6xl">
            {simulation.category === 'medical' && '🏥'}
            {simulation.category === 'science' && '🔬'}
            {simulation.category === 'history' && '🏛️'}
            {simulation.category === 'engineering' && '⚙️'}
            {!['medical', 'science', 'history', 'engineering'].includes(simulation.category) && '🎮'}
          </div>
        )}

        {/* Type Badge */}
        <div className={`absolute top-3 right-3 px-3 py-1 ${typeBadge.color} rounded-full text-xs font-bold`}>
          {typeBadge.label}
        </div>

        {/* Category */}
        <div className="absolute top-3 left-3 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full text-xs font-semibold capitalize">
          {simulation.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">{simulation.title}</h3>
        <p className="text-sm text-gray-300 mb-4 line-clamp-2">{simulation.description}</p>

        {/* Rating & Users */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1">
            <span className="text-yellow-400">★</span>
            <span className="font-semibold">{simulation.avg_rating.toFixed(1)}</span>
            <span className="text-xs text-gray-400">({simulation.rating_count})</span>
          </div>
          <div className="text-sm text-gray-400">
            {simulation.user_count.toLocaleString()} users
          </div>
        </div>

        {/* Tags */}
        {simulation.tags && simulation.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {simulation.tags.slice(0, 3).map((tag, idx) => (
              <span key={idx} className="px-2 py-1 bg-white/10 rounded-full text-xs">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Launch Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onLaunch();
          }}
          className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg"
        >
          Launch
        </button>
      </div>
    </div>
  );
}

function HardwareCard({ name, icon, description, supported }: { name: string; icon: string; description: string; supported: boolean }) {
  return (
    <div className={`p-6 rounded-xl border ${supported ? 'bg-green-900/20 border-green-500/30' : 'bg-red-900/20 border-red-500/30'} text-center`}>
      <div className="text-4xl mb-3">{icon}</div>
      <div className="font-bold mb-1">{name}</div>
      <div className="text-sm text-gray-400 mb-3">{description}</div>
      <div className={`text-xs font-semibold ${supported ? 'text-green-400' : 'text-red-400'}`}>
        {supported ? '✓ Supported' : '✗ Not Supported'}
      </div>
    </div>
  );
}
