'use client';

import { useState, useEffect } from 'react';
import { Check, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TEST_PREP_ENDPOINTS } from '@/lib/api-endpoints';

interface Plan {
  id: string;
  plan_name: string;
  plan_type: 'test_prep_only' | 'qbank_only' | 'complete_bundle';
  exam_category: string;
  billing_period: string;
  price_usd: number;
  original_price_usd?: number;
  features: {
    video_access: boolean;
    notes_access: boolean;
    qbank_access: boolean;
    practice_exams: number;
    tutor_hours: number;
    analytics_access: boolean;
    mobile_app: boolean;
    downloadable_content: boolean;
    live_sessions: boolean;
  };
  question_bank_size?: number;
  video_hours?: number;
  max_practice_exams?: number;
  description: string;
  highlights: string[];
  is_featured: boolean;
}

export default function TestPrepPricingPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedExam, setSelectedExam] = useState('MCAT');
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState<string | null>(null);

  const examCategories = ['MCAT', 'USMLE', 'LSAT', 'GRE', 'GMAT', 'FE'];

  useEffect(() => {
    fetchPlans();
  }, [selectedExam]);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await fetch(TEST_PREP_ENDPOINTS.PLANS + '?exam_category=' + selectedExam);
      const data = await response.json();
      setPlans(data.plans || []);
    } catch (error) {
      console.error('Failed to fetch plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planId: string) => {
    try {
      setSubscribing(planId);

      const token = localStorage.getItem('authToken'); // Get auth token

      const response = await fetch(TEST_PREP_ENDPOINTS.SUBSCRIBE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          planId,
          successUrl: `${window.location.origin}/dashboard/test-prep?success=true`,
          cancelUrl: `${window.location.origin}/test-prep/pricing?cancelled=true`,
        }),
      });

      const data = await response.json();

      if (data.success && data.checkoutUrl) {
        // Redirect to Stripe checkout
        window.location.href = data.checkoutUrl;
      } else {
        alert('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Failed to start subscription process');
    } finally {
      setSubscribing(null);
    }
  };

  const getPlanTypeLabel = (type: string) => {
    switch (type) {
      case 'test_prep_only':
        return 'Test Prep Only';
      case 'qbank_only':
        return 'QBank Only';
      case 'complete_bundle':
        return 'Complete Bundle';
      default:
        return type;
    }
  };

  const getPlanColor = (type: string) => {
    switch (type) {
      case 'test_prep_only':
        return 'bg-blue-500';
      case 'qbank_only':
        return 'bg-green-500';
      case 'complete_bundle':
        return 'bg-gradient-to-r from-purple-500 to-pink-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Choose Your Test Prep Plan</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Select the perfect package for your exam preparation journey
        </p>

        {/* Exam Selection */}
        <Tabs value={selectedExam} onValueChange={setSelectedExam} className="w-full max-w-2xl mx-auto">
          <TabsList className="grid w-full grid-cols-6">
            {examCategories.map((exam) => (
              <TabsTrigger key={exam} value={exam}>
                {exam}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`relative ${
              plan.is_featured ? 'border-purple-500 border-2 shadow-lg scale-105' : ''
            }`}
          >
            {plan.is_featured && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Most Popular
                </Badge>
              </div>
            )}

            <CardHeader>
              <div className={`inline-block px-3 py-1 rounded-full text-white text-sm mb-2 ${getPlanColor(plan.plan_type)}`}>
                {getPlanTypeLabel(plan.plan_type)}
              </div>
              <CardTitle className="text-2xl">{plan.plan_name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>

            <CardContent>
              {/* Pricing */}
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold">${plan.price_usd}</span>
                  <span className="text-muted-foreground">/{plan.billing_period}</span>
                </div>
                {plan.original_price_usd && plan.original_price_usd > plan.price_usd && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm line-through text-muted-foreground">
                      ${plan.original_price_usd}
                    </span>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      Save ${(plan.original_price_usd - plan.price_usd).toFixed(2)}
                    </Badge>
                  </div>
                )}
              </div>

              {/* Highlights */}
              <div className="space-y-3 mb-6">
                {plan.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{highlight}</span>
                  </div>
                ))}
              </div>

              {/* Detailed Features */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Video Access</span>
                  {plan.features.video_access ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <X className="w-4 h-4 text-red-500" />
                  )}
                </div>
                <div className="flex justify-between text-sm">
                  <span>Study Notes</span>
                  {plan.features.notes_access ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <X className="w-4 h-4 text-red-500" />
                  )}
                </div>
                <div className="flex justify-between text-sm">
                  <span>Question Bank</span>
                  {plan.features.qbank_access ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <X className="w-4 h-4 text-red-500" />
                  )}
                </div>
                <div className="flex justify-between text-sm">
                  <span>Practice Exams</span>
                  <span className="font-medium">
                    {plan.features.practice_exams > 0 ? plan.features.practice_exams : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Analytics Dashboard</span>
                  {plan.features.analytics_access ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <X className="w-4 h-4 text-red-500" />
                  )}
                </div>
                {plan.features.tutor_hours > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Tutor Support</span>
                    <span className="font-medium">{plan.features.tutor_hours}hrs/month</span>
                  </div>
                )}
              </div>
            </CardContent>

            <CardFooter>
              <Button
                className="w-full"
                size="lg"
                onClick={() => handleSubscribe(plan.id)}
                disabled={subscribing === plan.id}
                variant={plan.is_featured ? 'default' : 'outline'}
              >
                {subscribing === plan.id ? 'Processing...' : 'Get Started'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="mt-16 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">What's the difference between plans?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                <strong>Test Prep Only:</strong> Access to video lectures and study notes.<br />
                <strong>QBank Only:</strong> Access to practice questions and exams only.<br />
                <strong>Complete Bundle:</strong> Everything included - videos, notes, and question bank.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Can I switch plans later?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Yes! You can upgrade or downgrade your plan at any time. Contact support for assistance.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Is there a money-back guarantee?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We offer a 7-day money-back guarantee. If you're not satisfied, contact us for a full refund.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
