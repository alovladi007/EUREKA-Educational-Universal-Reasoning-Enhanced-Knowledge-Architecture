'use client';

import { useState, useEffect } from 'react';
import { Check, X, Sparkles, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { EXAM_TYPE_LIST, getExamConfig } from '@/lib/exam-config';

interface PlanFeatures {
  video_access: boolean;
  notes_access: boolean;
  qbank_access: boolean;
  practice_exams: number;
  tutor_hours: number;
  analytics_access: boolean;
  mobile_app: boolean;
  downloadable_content: boolean;
  live_sessions: boolean;
}

interface Plan {
  id: string;
  plan_name: string;
  plan_type: 'test_prep_only' | 'qbank_only' | 'complete_bundle';
  price_usd: number;
  original_price_usd?: number;
  billing_period: string;
  features: PlanFeatures;
  question_bank_size?: number;
  video_hours?: number;
  description: string;
  highlights: string[];
  is_featured: boolean;
}

function buildPlans(examId: string): Plan[] {
  const cfg = getExamConfig(examId);
  const name = cfg.shortName;

  return [
    {
      id: `${examId}_prep`,
      plan_name: `${name} Test Prep`,
      plan_type: 'test_prep_only',
      price_usd: 49,
      original_price_usd: 79,
      billing_period: 'month',
      description: `Video lectures and study notes for the ${name}`,
      highlights: [
        `${cfg.sections.length * 8}+ video lessons across all sections`,
        'Detailed study notes for every topic',
        'Downloadable cheat sheets & summaries',
        'Progress tracking per section',
      ],
      features: {
        video_access: true,
        notes_access: true,
        qbank_access: false,
        practice_exams: 0,
        tutor_hours: 0,
        analytics_access: true,
        mobile_app: true,
        downloadable_content: true,
        live_sessions: false,
      },
      is_featured: false,
    },
    {
      id: `${examId}_qbank`,
      plan_name: `${name} QBank`,
      plan_type: 'qbank_only',
      price_usd: 59,
      original_price_usd: 89,
      billing_period: 'month',
      description: `${cfg.totalQuestions * 20}+ practice questions for the ${name}`,
      highlights: [
        `${cfg.totalQuestions * 20}+ exam-style questions`,
        'Tutor, Timed, and Review modes',
        `${cfg.sections.length} section-specific question banks`,
        'Detailed explanations for every answer',
        'Performance analytics & weak-area tracking',
      ],
      question_bank_size: cfg.totalQuestions * 20,
      features: {
        video_access: false,
        notes_access: false,
        qbank_access: true,
        practice_exams: 5,
        tutor_hours: 0,
        analytics_access: true,
        mobile_app: true,
        downloadable_content: false,
        live_sessions: false,
      },
      is_featured: false,
    },
    {
      id: `${examId}_bundle`,
      plan_name: `${name} Complete Bundle`,
      plan_type: 'complete_bundle',
      price_usd: 89,
      original_price_usd: 149,
      billing_period: 'month',
      description: `Everything you need to ace the ${name}`,
      highlights: [
        'All video lectures & study notes',
        `${cfg.totalQuestions * 20}+ QBank questions`,
        'Unlimited practice exams',
        'AI-powered study plan',
        'Performance analytics & predictions',
        '1-on-1 tutor support (2 hrs/month)',
      ],
      question_bank_size: cfg.totalQuestions * 20,
      video_hours: cfg.sections.length * 6,
      features: {
        video_access: true,
        notes_access: true,
        qbank_access: true,
        practice_exams: 99,
        tutor_hours: 2,
        analytics_access: true,
        mobile_app: true,
        downloadable_content: true,
        live_sessions: true,
      },
      is_featured: true,
    },
  ];
}

export default function TestPrepPricingPage() {
  const [selectedExam, setSelectedExam] = useState(EXAM_TYPE_LIST[0]?.id || 'SAT');
  const [plans, setPlans] = useState<Plan[]>([]);
  const [subscribing, setSubscribing] = useState<string | null>(null);

  useEffect(() => {
    setPlans(buildPlans(selectedExam));
  }, [selectedExam]);

  const handleSubscribe = async (planId: string) => {
    setSubscribing(planId);
    // TODO: wire to Stripe checkout when backend is ready
    setTimeout(() => {
      setSubscribing(null);
      window.location.href = `/dashboard/test-prep/${selectedExam.toLowerCase()}`;
    }, 1200);
  };

  const getPlanColor = (type: string) => {
    switch (type) {
      case 'test_prep_only': return 'bg-blue-600';
      case 'qbank_only': return 'bg-emerald-600';
      case 'complete_bundle': return 'bg-gradient-to-r from-violet-600 to-pink-600';
      default: return 'bg-gray-600';
    }
  };

  const getPlanLabel = (type: string) => {
    switch (type) {
      case 'test_prep_only': return 'Videos + Notes';
      case 'qbank_only': return 'QBank Only';
      case 'complete_bundle': return 'Complete Bundle';
      default: return type;
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      {/* Back link */}
      <Link href="/dashboard/test-prep" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Test Prep
      </Link>

      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-3">Choose Your Test Prep Plan</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Select the perfect package for your exam preparation journey
        </p>

        {/* Exam Selection */}
        <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
          {EXAM_TYPE_LIST.map((exam) => (
            <button
              key={exam.id}
              onClick={() => setSelectedExam(exam.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedExam === exam.id
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              {exam.shortName}
            </button>
          ))}
        </div>
      </div>

      {/* Exam info */}
      <div className="text-center mb-8">
        <p className="text-sm text-muted-foreground">
          {getExamConfig(selectedExam).name} &middot; {getExamConfig(selectedExam).sections.length} sections &middot; Score range: {getExamConfig(selectedExam).scoreRange.label}
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`relative flex flex-col ${
              plan.is_featured ? 'border-violet-500 border-2 shadow-xl md:scale-105' : ''
            }`}
          >
            {plan.is_featured && (
              <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-violet-600 to-pink-600 text-white px-3 py-1">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Best Value
                </Badge>
              </div>
            )}

            <CardHeader className="pb-4">
              <div className={`inline-block px-3 py-1 rounded-full text-white text-xs font-medium mb-3 w-fit ${getPlanColor(plan.plan_type)}`}>
                {getPlanLabel(plan.plan_type)}
              </div>
              <CardTitle className="text-xl">{plan.plan_name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>

            <CardContent className="flex-1">
              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl font-bold">${plan.price_usd}</span>
                  <span className="text-muted-foreground text-sm">/{plan.billing_period}</span>
                </div>
                {plan.original_price_usd && plan.original_price_usd > plan.price_usd && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm line-through text-muted-foreground">${plan.original_price_usd}</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 text-xs">
                      Save ${plan.original_price_usd - plan.price_usd}/mo
                    </Badge>
                  </div>
                )}
              </div>

              {/* Highlights */}
              <div className="space-y-2.5 mb-6">
                {plan.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{h}</span>
                  </div>
                ))}
              </div>

              {/* Feature grid */}
              <div className="border-t pt-4 space-y-2">
                {([
                  ['Video Lectures', plan.features.video_access],
                  ['Study Notes', plan.features.notes_access],
                  ['Question Bank', plan.features.qbank_access],
                  ['Practice Exams', plan.features.practice_exams > 0 ? (plan.features.practice_exams >= 99 ? 'Unlimited' : plan.features.practice_exams) : false],
                  ['Analytics Dashboard', plan.features.analytics_access],
                  ['Tutor Support', plan.features.tutor_hours > 0 ? `${plan.features.tutor_hours} hrs/mo` : false],
                  ['Mobile App', plan.features.mobile_app],
                  ['Downloadable Content', plan.features.downloadable_content],
                  ['Live Sessions', plan.features.live_sessions],
                ] as [string, boolean | string | number][]).map(([label, value]) => (
                  <div key={label as string} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{label as string}</span>
                    {value === true ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : value === false ? (
                      <X className="w-4 h-4 text-muted-foreground/30" />
                    ) : (
                      <span className="font-medium text-foreground">{value as string}</span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>

            <CardFooter className="pt-4">
              <Button
                className="w-full"
                size="lg"
                onClick={() => handleSubscribe(plan.id)}
                disabled={subscribing === plan.id}
                variant={plan.is_featured ? 'default' : 'outline'}
              >
                {subscribing === plan.id ? 'Processing...' : plan.is_featured ? 'Get Started' : 'Choose Plan'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            {
              q: "What's the difference between plans?",
              a: "Videos + Notes gives you access to all video lectures and downloadable study notes. QBank Only gives you the full question bank with tutor, timed, and review modes plus practice exams. The Complete Bundle includes everything — videos, notes, QBank, AI study plans, and tutor support."
            },
            {
              q: "Can I switch plans later?",
              a: "Yes! You can upgrade or downgrade your plan at any time. When upgrading, you'll only pay the prorated difference. Downgrades take effect at the next billing cycle."
            },
            {
              q: "Is there a money-back guarantee?",
              a: "Absolutely. We offer a 7-day money-back guarantee on all plans. If you're not satisfied, contact us for a full refund — no questions asked."
            },
            {
              q: "Do plans cover all sections of the exam?",
              a: `Yes. Every plan covers all ${getExamConfig(selectedExam).sections.length} sections of the ${getExamConfig(selectedExam).shortName}: ${getExamConfig(selectedExam).sections.map(s => s.name).join(', ')}.`
            },
            {
              q: "Can I access content on mobile?",
              a: "Yes, all plans include mobile access. Study on the go with our responsive web app — works on any phone, tablet, or computer."
            },
          ].map((faq, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{faq.q}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{faq.a}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
