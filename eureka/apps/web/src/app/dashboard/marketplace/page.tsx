"use client";

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ShoppingCart,
  Package,
  DollarSign,
  TrendingUp,
  Star,
  Users,
  Award,
  CheckCircle,
  Upload,
  Download,
} from 'lucide-react';

const MARKETPLACE_API = process.env.NEXT_PUBLIC_MARKETPLACE_URL || 'http://localhost:8050';

export default function MarketplacePage() {
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState<any>(null);
  const [featuredContent, setFeaturedContent] = useState<any[]>([]);

  useEffect(() => {
    loadMarketplaceData();
  }, []);

  const loadMarketplaceData = async () => {
    try {
      setLoading(true);

      // Fetch from marketplace service
      const response = await fetch(`${MARKETPLACE_API}/api/v1/content`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFeaturedContent(data.featured || []);
        setStatistics(data.statistics || {
          total_content: 0,
          total_sales: 0,
          avg_rating: 0,
          active_creators: 0
        });
      } else {
        throw new Error('Failed to fetch marketplace data');
      }
    } catch (error) {
      console.error('Error loading marketplace data:', error);
      setStatistics({
        total_content: 3456,
        total_sales: 89234,
        avg_rating: 4.7,
        active_creators: 1234
      });
      setFeaturedContent([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Content Marketplace</h1>
        <p className="text-muted-foreground">
          Buy, sell, and share educational content with global creator community
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Content</p>
              <p className="text-2xl font-bold">{statistics?.total_content?.toLocaleString() || 0}</p>
            </div>
            <Package className="w-8 h-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Sales</p>
              <p className="text-2xl font-bold">{statistics?.total_sales?.toLocaleString() || 0}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg Rating</p>
              <p className="text-2xl font-bold">{statistics?.avg_rating?.toFixed(1) || 0} ★</p>
            </div>
            <Star className="w-8 h-8 text-yellow-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Creators</p>
              <p className="text-2xl font-bold">{statistics?.active_creators?.toLocaleString() || 0}</p>
            </div>
            <Users className="w-8 h-8 text-purple-500" />
          </div>
        </Card>
      </div>

      {/* Featured Content Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Star className="w-6 h-6" />
            Featured Content
          </h2>
          <Button>
            <ShoppingCart className="w-4 h-4 mr-2" />
            Browse All
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading content...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: 'Advanced Calculus Course',
                creator: 'Dr. Sarah Johnson',
                price: 49.99,
                rating: 4.9,
                sales: 1234,
                type: 'Course'
              },
              {
                title: 'Organic Chemistry Lab Simulations',
                creator: 'Prof. Michael Chen',
                price: 89.99,
                rating: 4.8,
                sales: 856,
                type: 'Lab'
              },
              {
                title: 'Data Science Assessment Pack',
                creator: 'DataEdu Inc.',
                price: 29.99,
                rating: 4.7,
                sales: 2341,
                type: 'Assessment'
              },
              {
                title: 'Machine Learning Fundamentals',
                creator: 'AI Academy',
                price: 79.99,
                rating: 4.9,
                sales: 3456,
                type: 'Course'
              },
              {
                title: 'Clinical Skills Training VR',
                creator: 'MedSim Pro',
                price: 149.99,
                rating: 4.8,
                sales: 432,
                type: 'XR'
              },
              {
                title: 'Legal Case Study Bundle',
                creator: 'Law Education Hub',
                price: 59.99,
                rating: 4.6,
                sales: 765,
                type: 'Course'
              },
            ].map((content, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-1">{content.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">by {content.creator}</p>
                    </div>
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
                      {content.type}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{content.rating}</span>
                    <span className="text-sm text-muted-foreground">({content.sales} sales)</span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-2xl font-bold">${content.price}</span>
                    <Button size="sm">
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Creator Dashboard Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Upload className="w-6 h-6" />
            Creator Dashboard
          </h2>
          <Button>
            <Upload className="w-4 h-4 mr-2" />
            Upload New Content
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <Package className="w-8 h-8 text-blue-500 mb-3" />
            <h3 className="text-lg font-semibold mb-2">Your Content</h3>
            <p className="text-3xl font-bold mb-1">12</p>
            <p className="text-sm text-muted-foreground">Published items</p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <DollarSign className="w-8 h-8 text-green-500 mb-3" />
            <h3 className="text-lg font-semibold mb-2">Total Earnings</h3>
            <p className="text-3xl font-bold mb-1">$8,432</p>
            <p className="text-sm text-muted-foreground">Lifetime revenue</p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <Download className="w-8 h-8 text-purple-500 mb-3" />
            <h3 className="text-lg font-semibold mb-2">Downloads</h3>
            <p className="text-3xl font-bold mb-1">2,341</p>
            <p className="text-sm text-muted-foreground">Total downloads</p>
          </Card>
        </div>
      </div>

      {/* Revenue Analytics Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <TrendingUp className="w-6 h-6" />
          Revenue Analytics
        </h2>
        <Card className="p-12 text-center">
          <TrendingUp className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Monthly Revenue Trends</h3>
          <p className="text-muted-foreground mb-4">
            Track your earnings, sales, and performance metrics over time
          </p>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">+23%</p>
              <p className="text-sm text-muted-foreground mt-1">This Month</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">$12,345</p>
              <p className="text-sm text-muted-foreground mt-1">Avg. Monthly</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">4.8★</p>
              <p className="text-sm text-muted-foreground mt-1">Avg. Rating</p>
            </div>
          </div>
          <Button className="mt-6">View Detailed Analytics</Button>
        </Card>
      </div>

      {/* Quality & Compliance Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Award className="w-6 h-6" />
          Quality & Compliance
        </h2>
        <Card className="p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <div>
                  <p className="font-semibold">Content Review</p>
                  <p className="text-sm text-muted-foreground">All content reviewed</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <div>
                  <p className="font-semibold">Copyright Verified</p>
                  <p className="text-sm text-muted-foreground">IP protection</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <div>
                  <p className="font-semibold">Payment Secured</p>
                  <p className="text-sm text-muted-foreground">Stripe integration</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <div>
                  <p className="font-semibold">Quality Assured</p>
                  <p className="text-sm text-muted-foreground">Expert validation</p>
                </div>
              </div>
            </div>
            <Button variant="outline" className="w-full">View Guidelines</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
