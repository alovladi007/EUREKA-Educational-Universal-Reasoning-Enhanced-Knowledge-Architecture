'use client';

import { useEffect, useState } from 'react';
import { notebookAPI } from '@/lib/notebook/api-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { DollarSign, CreditCard, CheckCircle, XCircle } from 'lucide-react';

// Initialize Stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || ''
);

interface Payment {
  id: number;
  amount: number;
  currency: string;
  status: string;
  description: string;
  project_id: number;
  project_name?: string;
  stripe_payment_intent_id: string;
  created_at: string;
}

function PaymentForm({ onSuccess }: { onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState('');
  const [projects, setProjects] = useState<any[]>([]);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await notebookAPI.projects.getAll();
      setProjects(response.data.projects || []);
    } catch (error) {
      console.error('Failed to load projects:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // Create payment on backend
      const response = await notebookAPI.payments.createPayment({
        amount: parseFloat(amount),
        currency: 'usd',
        description,
        project_id: parseInt(projectId),
      });

      const { clientSecret } = response.data;

      // Confirm payment with Stripe
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (result.error) {
        setError(result.error.message || 'Payment failed');
      } else {
        // Payment succeeded
        setAmount('');
        setDescription('');
        setProjectId('');
        cardElement.clear();
        onSuccess();
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Project
        </label>
        <Select value={projectId} onValueChange={setProjectId}>
          <SelectTrigger>
            <SelectValue placeholder="Select a project" />
          </SelectTrigger>
          <SelectContent>
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.id.toString()}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Amount (USD)
        </label>
        <Input
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Payment description"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Card Details
        </label>
        <div className="border border-gray-300 rounded-lg p-3">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
          {error}
        </div>
      )}

      <Button
        type="submit"
        disabled={!stripe || processing || !projectId || !amount}
        className="w-full"
      >
        {processing ? 'Processing...' : `Pay $${amount || '0.00'}`}
      </Button>

      <p className="text-xs text-gray-500 text-center">
        Test card: 4242 4242 4242 4242 (any future date, any CVC)
      </p>
    </form>
  );
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('');

  useEffect(() => {
    loadPayments();
  }, [statusFilter]);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (statusFilter) params.status = statusFilter;

      const response = await notebookAPI.payments.getAll(params);
      setPayments(response.data.payments || []);
    } catch (error) {
      console.error('Failed to load payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'succeeded':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'failed':
      case 'canceled':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <DollarSign className="h-5 w-5 text-yellow-600" />;
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'succeeded':
        return 'bg-green-100 text-green-800';
      case 'failed':
      case 'canceled':
        return 'bg-red-100 text-red-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading payments...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Payments</h1>
          <p className="text-gray-600 mt-2">
            Manage and process payments for your projects
          </p>
        </div>
        <Button onClick={() => setShowPaymentForm(!showPaymentForm)}>
          <CreditCard className="h-4 w-4 mr-2" />
          {showPaymentForm ? 'View Payments' : 'New Payment'}
        </Button>
      </div>

      {/* Payment Form */}
      {showPaymentForm && (
        <Card>
          <CardHeader>
            <CardTitle>Process New Payment</CardTitle>
          </CardHeader>
          <CardContent>
            <Elements stripe={stripePromise}>
              <PaymentForm
                onSuccess={() => {
                  setShowPaymentForm(false);
                  loadPayments();
                }}
              />
            </Elements>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card className="p-4">
        <div className="flex gap-4 items-center">
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700 mr-2">
              Status:
            </label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All statuses</SelectItem>
                <SelectItem value="succeeded">Succeeded</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="requires_payment_method">
                  Requires Payment
                </SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="canceled">Canceled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Payments List */}
      <div className="space-y-4">
        {payments.length === 0 ? (
          <Card className="p-12">
            <div className="text-center text-gray-500">
              <CreditCard className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No payments found</p>
              {!showPaymentForm && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setShowPaymentForm(true)}
                >
                  Create First Payment
                </Button>
              )}
            </div>
          </Card>
        ) : (
          payments.map((payment) => (
            <Card key={payment.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="mt-1">{getStatusIcon(payment.status)}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">
                          ${payment.amount.toFixed(2)}
                        </h3>
                        <span className="text-gray-500 text-sm uppercase">
                          {payment.currency}
                        </span>
                      </div>
                      <p className="text-gray-600 mt-1">
                        {payment.description}
                      </p>
                      {payment.project_name && (
                        <p className="text-sm text-gray-500 mt-1">
                          Project: {payment.project_name}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(payment.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(
                        payment.status
                      )}`}
                    >
                      {payment.status}
                    </span>
                    {payment.stripe_payment_intent_id && (
                      <p className="text-xs text-gray-400">
                        ID: {payment.stripe_payment_intent_id.slice(0, 20)}...
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
