/**
 * EUREKA Test Prep - Payment & Subscription Service
 * Stripe integration for subscriptions, one-time purchases, and usage-based billing
 */

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@eureka/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import Stripe from 'stripe';

interface SubscriptionPlan {
  id: string;
  name: string;
  tier: 'free' | 'basic' | 'premium' | 'enterprise';
  price: {
    monthly: number;
    yearly: number;
    currency: string;
  };
  features: PlanFeature[];
  limits: PlanLimits;
  stripeProductId: string;
  stripePrices: {
    monthly: string;
    yearly: string;
  };
  isActive: boolean;
  metadata: Record<string, any>;
}

interface PlanFeature {
  name: string;
  included: boolean;
  value?: string | number;
  description?: string;
}

interface PlanLimits {
  questionsPerMonth: number;
  mockExamsPerMonth: number;
  adaptiveSessionsPerDay: number;
  studyGroupsPerMonth: number;
  aiTutorHours: number;
  storageGB: number;
  videoCallMinutes: number;
  customQuestions: number;
  teamMembers: number;
}

interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status: SubscriptionStatus;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  usage: UsageMetrics;
  stripeSubscriptionId: string;
  stripeCustomerId: string;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

enum SubscriptionStatus {
  ACTIVE = 'active',
  PAST_DUE = 'past_due',
  CANCELED = 'canceled',
  INCOMPLETE = 'incomplete',
  INCOMPLETE_EXPIRED = 'incomplete_expired',
  TRIALING = 'trialing',
  UNPAID = 'unpaid',
  PAUSED = 'paused'
}

interface UsageMetrics {
  questionsAnswered: number;
  mockExamsTaken: number;
  adaptiveSessions: number;
  studyGroupsJoined: number;
  aiTutorMinutes: number;
  storageUsedMB: number;
  videoCallMinutes: number;
  customQuestionsCreated: number;
}

interface Purchase {
  id: string;
  userId: string;
  type: PurchaseType;
  itemId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  stripePaymentIntentId: string;
  metadata: Record<string, any>;
  createdAt: Date;
}

enum PurchaseType {
  MOCK_EXAM = 'mock_exam',
  QUESTION_PACK = 'question_pack',
  STUDY_GUIDE = 'study_guide',
  TUTORING_SESSION = 'tutoring_session',
  COURSE = 'course',
  CREDITS = 'credits'
}

interface PaymentMethod {
  id: string;
  userId: string;
  type: 'card' | 'bank_account' | 'paypal';
  last4: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
  stripePaymentMethodId: string;
  createdAt: Date;
}

interface Invoice {
  id: string;
  userId: string;
  subscriptionId?: string;
  amount: number;
  currency: string;
  status: 'draft' | 'open' | 'paid' | 'void' | 'uncollectible';
  dueDate?: Date;
  paidAt?: Date;
  items: InvoiceItem[];
  stripeInvoiceId: string;
  pdfUrl?: string;
  createdAt: Date;
}

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  metadata?: Record<string, any>;
}

interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  bonusCredits: number;
  validityDays: number;
  stripePriceId: string;
}

interface UserCredits {
  userId: string;
  balance: number;
  transactions: CreditTransaction[];
  expiringCredits: ExpiringCredit[];
}

interface CreditTransaction {
  id: string;
  type: 'purchase' | 'earned' | 'spent' | 'expired' | 'refunded';
  amount: number;
  balance: number;
  description: string;
  referenceId?: string;
  createdAt: Date;
}

interface ExpiringCredit {
  amount: number;
  expiresAt: Date;
  source: string;
}

@Injectable()
export class PaymentService {
  private stripe: Stripe;
  private plans: Map<string, SubscriptionPlan>;
  private webhookSecret: string;

  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2
  ) {
    this.stripe = new Stripe(this.config.get('STRIPE_SECRET_KEY')!, {
      apiVersion: '2023-10-16'
    });
    this.webhookSecret = this.config.get('STRIPE_WEBHOOK_SECRET')!;
    this.initializePlans();
  }

  private async initializePlans() {
    this.plans = new Map([
      ['free', {
        id: 'free',
        name: 'Free Plan',
        tier: 'free',
        price: { monthly: 0, yearly: 0, currency: 'usd' },
        features: [
          { name: 'Basic Practice Questions', included: true, value: 50 },
          { name: 'Performance Analytics', included: true, value: 'Basic' },
          { name: 'Study Groups', included: false },
          { name: 'AI Tutor', included: false },
          { name: 'Mock Exams', included: false }
        ],
        limits: {
          questionsPerMonth: 50,
          mockExamsPerMonth: 0,
          adaptiveSessionsPerDay: 1,
          studyGroupsPerMonth: 0,
          aiTutorHours: 0,
          storageGB: 0.5,
          videoCallMinutes: 0,
          customQuestions: 0,
          teamMembers: 1
        },
        stripeProductId: '',
        stripePrices: { monthly: '', yearly: '' },
        isActive: true,
        metadata: {}
      }],
      ['basic', {
        id: 'basic',
        name: 'Basic Plan',
        tier: 'basic',
        price: { monthly: 29, yearly: 290, currency: 'usd' },
        features: [
          { name: 'Unlimited Practice Questions', included: true },
          { name: 'Advanced Analytics', included: true },
          { name: 'Study Groups', included: true, value: 5 },
          { name: 'AI Tutor', included: true, value: '5 hours' },
          { name: 'Mock Exams', included: true, value: 3 }
        ],
        limits: {
          questionsPerMonth: -1, // unlimited
          mockExamsPerMonth: 3,
          adaptiveSessionsPerDay: 10,
          studyGroupsPerMonth: 5,
          aiTutorHours: 5,
          storageGB: 5,
          videoCallMinutes: 100,
          customQuestions: 50,
          teamMembers: 1
        },
        stripeProductId: 'prod_basic',
        stripePrices: {
          monthly: 'price_basic_monthly',
          yearly: 'price_basic_yearly'
        },
        isActive: true,
        metadata: {}
      }],
      ['premium', {
        id: 'premium',
        name: 'Premium Plan',
        tier: 'premium',
        price: { monthly: 59, yearly: 590, currency: 'usd' },
        features: [
          { name: 'Everything in Basic', included: true },
          { name: 'Unlimited Mock Exams', included: true },
          { name: 'Priority AI Tutor', included: true },
          { name: 'Custom Study Plans', included: true },
          { name: '1-on-1 Tutoring', included: true, value: '2 sessions' }
        ],
        limits: {
          questionsPerMonth: -1,
          mockExamsPerMonth: -1,
          adaptiveSessionsPerDay: -1,
          studyGroupsPerMonth: -1,
          aiTutorHours: 20,
          storageGB: 20,
          videoCallMinutes: 500,
          customQuestions: 200,
          teamMembers: 3
        },
        stripeProductId: 'prod_premium',
        stripePrices: {
          monthly: 'price_premium_monthly',
          yearly: 'price_premium_yearly'
        },
        isActive: true,
        metadata: {}
      }]
    ]);
  }

  /**
   * Create a new subscription
   */
  async createSubscription(params: {
    userId: string;
    planId: string;
    paymentMethodId?: string;
    billingInterval: 'monthly' | 'yearly';
    couponCode?: string;
  }): Promise<Subscription> {
    const plan = this.plans.get(params.planId);
    if (!plan) {
      throw new Error('Invalid plan');
    }

    // Get or create Stripe customer
    const customer = await this.getOrCreateCustomer(params.userId);

    // Attach payment method if provided
    if (params.paymentMethodId) {
      await this.stripe.paymentMethods.attach(params.paymentMethodId, {
        customer: customer.id
      });
      
      await this.stripe.customers.update(customer.id, {
        invoice_settings: {
          default_payment_method: params.paymentMethodId
        }
      });
    }

    // Apply coupon if provided
    const subscriptionParams: Stripe.SubscriptionCreateParams = {
      customer: customer.id,
      items: [{
        price: plan.stripePrices[params.billingInterval]
      }],
      payment_behavior: 'default_incomplete',
      payment_settings: {
        save_default_payment_method: 'on_subscription'
      },
      expand: ['latest_invoice.payment_intent'],
      metadata: {
        userId: params.userId,
        planId: params.planId
      }
    };

    if (params.couponCode) {
      const coupon = await this.validateCoupon(params.couponCode);
      if (coupon) {
        subscriptionParams.coupon = coupon.id;
      }
    }

    // Create Stripe subscription
    const stripeSubscription = await this.stripe.subscriptions.create(subscriptionParams);

    // Save to database
    const subscription = await this.prisma.subscription.create({
      data: {
        userId: params.userId,
        planId: params.planId,
        status: this.mapStripeStatus(stripeSubscription.status),
        currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
        currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
        cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
        stripeSubscriptionId: stripeSubscription.id,
        stripeCustomerId: customer.id,
        metadata: {
          billingInterval: params.billingInterval
        }
      }
    });

    // Initialize usage metrics
    await this.initializeUsageMetrics(params.userId);

    // Emit event
    this.eventEmitter.emit('subscription.created', {
      userId: params.userId,
      planId: params.planId,
      subscription
    });

    return this.mapPrismaToSubscription(subscription);
  }

  /**
   * Update subscription (upgrade/downgrade)
   */
  async updateSubscription(params: {
    subscriptionId: string;
    newPlanId: string;
    prorationBehavior?: 'create_prorations' | 'none' | 'always_invoice';
  }): Promise<Subscription> {
    const subscription = await this.getSubscription(params.subscriptionId);
    const newPlan = this.plans.get(params.newPlanId);

    if (!subscription || !newPlan) {
      throw new Error('Invalid subscription or plan');
    }

    // Get current billing interval
    const billingInterval = subscription.metadata.billingInterval as 'monthly' | 'yearly';

    // Update Stripe subscription
    const stripeSubscription = await this.stripe.subscriptions.retrieve(
      subscription.stripeSubscriptionId
    );

    const updatedStripeSubscription = await this.stripe.subscriptions.update(
      stripeSubscription.id,
      {
        items: [{
          id: stripeSubscription.items.data[0].id,
          price: newPlan.stripePrices[billingInterval]
        }],
        proration_behavior: params.prorationBehavior || 'create_prorations'
      }
    );

    // Update database
    const updated = await this.prisma.subscription.update({
      where: { id: params.subscriptionId },
      data: {
        planId: params.newPlanId,
        updatedAt: new Date()
      }
    });

    // Handle upgrade/downgrade logic
    await this.handlePlanChange(subscription, newPlan);

    // Emit event
    this.eventEmitter.emit('subscription.updated', {
      subscriptionId: params.subscriptionId,
      oldPlanId: subscription.planId,
      newPlanId: params.newPlanId
    });

    return this.mapPrismaToSubscription(updated);
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(
    subscriptionId: string,
    immediately: boolean = false
  ): Promise<Subscription> {
    const subscription = await this.getSubscription(subscriptionId);
    
    if (!subscription) {
      throw new Error('Subscription not found');
    }

    // Cancel in Stripe
    const stripeSubscription = await this.stripe.subscriptions.update(
      subscription.stripeSubscriptionId,
      {
        cancel_at_period_end: !immediately
      }
    );

    if (immediately) {
      await this.stripe.subscriptions.cancel(subscription.stripeSubscriptionId);
    }

    // Update database
    const updated = await this.prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        status: immediately ? 'canceled' : subscription.status,
        cancelAtPeriodEnd: !immediately,
        updatedAt: new Date()
      }
    });

    // Emit event
    this.eventEmitter.emit('subscription.canceled', {
      subscriptionId,
      immediately,
      userId: subscription.userId
    });

    return this.mapPrismaToSubscription(updated);
  }

  /**
   * Process one-time purchase
   */
  async createPurchase(params: {
    userId: string;
    type: PurchaseType;
    itemId: string;
    paymentMethodId?: string;
  }): Promise<Purchase> {
    // Get item details and price
    const { amount, currency, description } = await this.getItemDetails(
      params.type,
      params.itemId
    );

    // Get customer
    const customer = await this.getOrCreateCustomer(params.userId);

    // Create payment intent
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      customer: customer.id,
      payment_method: params.paymentMethodId,
      confirm: !!params.paymentMethodId,
      metadata: {
        userId: params.userId,
        type: params.type,
        itemId: params.itemId
      }
    });

    // Save purchase record
    const purchase = await this.prisma.purchase.create({
      data: {
        userId: params.userId,
        type: params.type,
        itemId: params.itemId,
        amount,
        currency,
        status: paymentIntent.status === 'succeeded' ? 'completed' : 'pending',
        stripePaymentIntentId: paymentIntent.id,
        metadata: { description }
      }
    });

    // Grant access if payment successful
    if (paymentIntent.status === 'succeeded') {
      await this.grantPurchaseAccess(purchase);
    }

    return this.mapPrismaToPurchase(purchase);
  }

  /**
   * Purchase credits
   */
  async purchaseCredits(params: {
    userId: string;
    packageId: string;
    paymentMethodId?: string;
  }): Promise<{
    purchase: Purchase;
    credits: UserCredits;
  }> {
    const package = await this.getCreditPackage(params.packageId);
    
    if (!package) {
      throw new Error('Invalid credit package');
    }

    // Process payment
    const purchase = await this.createPurchase({
      userId: params.userId,
      type: PurchaseType.CREDITS,
      itemId: params.packageId,
      paymentMethodId: params.paymentMethodId
    });

    // Add credits to user account
    const totalCredits = package.credits + package.bonusCredits;
    const credits = await this.addCredits(
      params.userId,
      totalCredits,
      `Purchased ${package.name}`,
      purchase.id,
      package.validityDays
    );

    // Emit event
    this.eventEmitter.emit('credits.purchased', {
      userId: params.userId,
      packageId: params.packageId,
      credits: totalCredits
    });

    return { purchase, credits };
  }

  /**
   * Add credits to user account
   */
  async addCredits(
    userId: string,
    amount: number,
    description: string,
    referenceId?: string,
    validityDays?: number
  ): Promise<UserCredits> {
    // Get current balance
    let userCredits = await this.getUserCredits(userId);
    
    if (!userCredits) {
      userCredits = await this.initializeUserCredits(userId);
    }

    // Add transaction
    const transaction: CreditTransaction = {
      id: this.generateTransactionId(),
      type: 'purchase',
      amount,
      balance: userCredits.balance + amount,
      description,
      referenceId,
      createdAt: new Date()
    };

    userCredits.balance += amount;
    userCredits.transactions.push(transaction);

    // Add expiring credits if validity specified
    if (validityDays) {
      userCredits.expiringCredits.push({
        amount,
        expiresAt: new Date(Date.now() + validityDays * 86400000),
        source: description
      });
    }

    // Save to database
    await this.prisma.userCredits.update({
      where: { userId },
      data: {
        balance: userCredits.balance,
        transactions: userCredits.transactions,
        expiringCredits: userCredits.expiringCredits
      }
    });

    return userCredits;
  }

  /**
   * Deduct credits from user account
   */
  async deductCredits(
    userId: string,
    amount: number,
    description: string,
    referenceId?: string
  ): Promise<UserCredits> {
    const userCredits = await this.getUserCredits(userId);
    
    if (!userCredits || userCredits.balance < amount) {
      throw new Error('Insufficient credits');
    }

    // First use expiring credits
    let remainingToDeduct = amount;
    const now = new Date();
    
    userCredits.expiringCredits = userCredits.expiringCredits
      .filter(credit => credit.expiresAt > now)
      .map(credit => {
        if (remainingToDeduct <= 0) return credit;
        
        if (credit.amount <= remainingToDeduct) {
          remainingToDeduct -= credit.amount;
          return null;
        } else {
          credit.amount -= remainingToDeduct;
          remainingToDeduct = 0;
          return credit;
        }
      })
      .filter(credit => credit !== null) as ExpiringCredit[];

    // Add transaction
    const transaction: CreditTransaction = {
      id: this.generateTransactionId(),
      type: 'spent',
      amount: -amount,
      balance: userCredits.balance - amount,
      description,
      referenceId,
      createdAt: new Date()
    };

    userCredits.balance -= amount;
    userCredits.transactions.push(transaction);

    // Save to database
    await this.prisma.userCredits.update({
      where: { userId },
      data: {
        balance: userCredits.balance,
        transactions: userCredits.transactions,
        expiringCredits: userCredits.expiringCredits
      }
    });

    return userCredits;
  }

  /**
   * Handle Stripe webhooks
   */
  async handleWebhook(signature: string, body: Buffer): Promise<void> {
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        body,
        signature,
        this.webhookSecret
      );
    } catch (err: any) {
      throw new Error(`Webhook signature verification failed: ${err.message}`);
    }

    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.handlePaymentSuccess(event.data.object as Stripe.PaymentIntent);
        break;

      case 'payment_intent.payment_failed':
        await this.handlePaymentFailure(event.data.object as Stripe.PaymentIntent);
        break;

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await this.handleSubscriptionUpdate(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await this.handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.paid':
        await this.handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await this.handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      case 'customer.subscription.trial_will_end':
        await this.handleTrialEnding(event.data.object as Stripe.Subscription);
        break;
    }
  }

  /**
   * Track usage for metered billing
   */
  async trackUsage(userId: string, metric: keyof UsageMetrics, quantity: number = 1): Promise<void> {
    const subscription = await this.getUserSubscription(userId);
    
    if (!subscription) return;

    // Update usage metrics
    const usage = subscription.usage || this.initializeUsageObject();
    usage[metric] = (usage[metric] || 0) + quantity;

    // Check against limits
    const plan = this.plans.get(subscription.planId);
    if (plan) {
      await this.checkUsageLimits(userId, plan, usage);
    }

    // Save usage
    await this.prisma.subscription.update({
      where: { id: subscription.id },
      data: { usage }
    });

    // Report metered usage to Stripe if applicable
    if (this.isMeteredMetric(metric)) {
      await this.reportMeteredUsage(subscription.stripeSubscriptionId, metric, quantity);
    }
  }

  /**
   * Get user's billing history
   */
  async getBillingHistory(userId: string): Promise<{
    invoices: Invoice[];
    purchases: Purchase[];
    subscriptions: Subscription[];
  }> {
    const [invoices, purchases, subscriptions] = await Promise.all([
      this.getUserInvoices(userId),
      this.getUserPurchases(userId),
      this.getUserSubscriptions(userId)
    ]);

    return {
      invoices,
      purchases,
      subscriptions
    };
  }

  // Private helper methods

  private async getOrCreateCustomer(userId: string): Promise<Stripe.Customer> {
    // Check if customer exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { stripeCustomerId: true, email: true, name: true }
    });

    if (user?.stripeCustomerId) {
      return await this.stripe.customers.retrieve(user.stripeCustomerId) as Stripe.Customer;
    }

    // Create new customer
    const customer = await this.stripe.customers.create({
      email: user?.email,
      name: user?.name,
      metadata: { userId }
    });

    // Save customer ID
    await this.prisma.user.update({
      where: { id: userId },
      data: { stripeCustomerId: customer.id }
    });

    return customer;
  }

  private async handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    const purchase = await this.prisma.purchase.findFirst({
      where: { stripePaymentIntentId: paymentIntent.id }
    });

    if (purchase) {
      await this.prisma.purchase.update({
        where: { id: purchase.id },
        data: { status: 'completed' }
      });

      await this.grantPurchaseAccess(purchase);
    }
  }

  private async handlePaymentFailure(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    const purchase = await this.prisma.purchase.findFirst({
      where: { stripePaymentIntentId: paymentIntent.id }
    });

    if (purchase) {
      await this.prisma.purchase.update({
        where: { id: purchase.id },
        data: { status: 'failed' }
      });

      this.eventEmitter.emit('payment.failed', {
        userId: purchase.userId,
        purchaseId: purchase.id,
        reason: paymentIntent.last_payment_error?.message
      });
    }
  }

  private async handleSubscriptionUpdate(stripeSubscription: Stripe.Subscription): Promise<void> {
    await this.prisma.subscription.update({
      where: { stripeSubscriptionId: stripeSubscription.id },
      data: {
        status: this.mapStripeStatus(stripeSubscription.status),
        currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
        currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
        cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end
      }
    });
  }

  private async handleSubscriptionDeleted(stripeSubscription: Stripe.Subscription): Promise<void> {
    const subscription = await this.prisma.subscription.update({
      where: { stripeSubscriptionId: stripeSubscription.id },
      data: { status: 'canceled' }
    });

    this.eventEmitter.emit('subscription.ended', {
      userId: subscription.userId,
      subscriptionId: subscription.id
    });
  }

  private async handleInvoicePaid(invoice: Stripe.Invoice): Promise<void> {
    // Record invoice payment
    await this.recordInvoice(invoice, 'paid');
  }

  private async handleInvoicePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
    // Record failed payment
    await this.recordInvoice(invoice, 'open');

    // Notify user
    this.eventEmitter.emit('invoice.payment_failed', {
      customerId: invoice.customer,
      amount: invoice.amount_due,
      attemptCount: invoice.attempt_count
    });
  }

  private async handleTrialEnding(subscription: Stripe.Subscription): Promise<void> {
    this.eventEmitter.emit('trial.ending', {
      subscriptionId: subscription.id,
      trialEnd: new Date(subscription.trial_end! * 1000)
    });
  }

  private async grantPurchaseAccess(purchase: any): Promise<void> {
    // Grant access based on purchase type
    switch (purchase.type) {
      case PurchaseType.MOCK_EXAM:
        await this.grantMockExamAccess(purchase.userId, purchase.itemId);
        break;
      case PurchaseType.QUESTION_PACK:
        await this.grantQuestionPackAccess(purchase.userId, purchase.itemId);
        break;
      // ... other types
    }
  }

  private async grantMockExamAccess(userId: string, examId: string): Promise<void> {
    // Implementation
  }

  private async grantQuestionPackAccess(userId: string, packId: string): Promise<void> {
    // Implementation
  }

  private mapStripeStatus(status: Stripe.Subscription.Status): SubscriptionStatus {
    const mapping: Record<Stripe.Subscription.Status, SubscriptionStatus> = {
      'active': SubscriptionStatus.ACTIVE,
      'past_due': SubscriptionStatus.PAST_DUE,
      'canceled': SubscriptionStatus.CANCELED,
      'incomplete': SubscriptionStatus.INCOMPLETE,
      'incomplete_expired': SubscriptionStatus.INCOMPLETE_EXPIRED,
      'trialing': SubscriptionStatus.TRIALING,
      'unpaid': SubscriptionStatus.UNPAID,
      'paused': SubscriptionStatus.PAUSED
    };
    return mapping[status] || SubscriptionStatus.INCOMPLETE;
  }

  private async getSubscription(id: string): Promise<Subscription | null> {
    const sub = await this.prisma.subscription.findUnique({ where: { id } });
    return sub ? this.mapPrismaToSubscription(sub) : null;
  }

  private async getUserSubscription(userId: string): Promise<Subscription | null> {
    const sub = await this.prisma.subscription.findFirst({
      where: { userId, status: 'active' }
    });
    return sub ? this.mapPrismaToSubscription(sub) : null;
  }

  private async getUserSubscriptions(userId: string): Promise<Subscription[]> {
    const subs = await this.prisma.subscription.findMany({ where: { userId } });
    return subs.map(sub => this.mapPrismaToSubscription(sub));
  }

  private mapPrismaToSubscription(data: any): Subscription {
    return data as Subscription;
  }

  private mapPrismaToPurchase(data: any): Purchase {
    return data as Purchase;
  }

  private async getUserInvoices(userId: string): Promise<Invoice[]> {
    return [];
  }

  private async getUserPurchases(userId: string): Promise<Purchase[]> {
    return [];
  }

  private async getUserCredits(userId: string): Promise<UserCredits | null> {
    return null;
  }

  private async initializeUserCredits(userId: string): Promise<UserCredits> {
    return {
      userId,
      balance: 0,
      transactions: [],
      expiringCredits: []
    };
  }

  private async initializeUsageMetrics(userId: string): Promise<void> {
    // Initialize usage tracking
  }

  private initializeUsageObject(): UsageMetrics {
    return {
      questionsAnswered: 0,
      mockExamsTaken: 0,
      adaptiveSessions: 0,
      studyGroupsJoined: 0,
      aiTutorMinutes: 0,
      storageUsedMB: 0,
      videoCallMinutes: 0,
      customQuestionsCreated: 0
    };
  }

  private async handlePlanChange(oldSub: Subscription, newPlan: SubscriptionPlan): Promise<void> {
    // Handle upgrade/downgrade logic
  }

  private async validateCoupon(code: string): Promise<Stripe.Coupon | null> {
    try {
      const coupon = await this.stripe.coupons.retrieve(code);
      return coupon.valid ? coupon : null;
    } catch {
      return null;
    }
  }

  private async getItemDetails(type: PurchaseType, itemId: string): Promise<{
    amount: number;
    currency: string;
    description: string;
  }> {
    // Get pricing details based on type and item
    return {
      amount: 29.99,
      currency: 'usd',
      description: 'Mock Exam'
    };
  }

  private async getCreditPackage(id: string): Promise<CreditPackage | null> {
    // Get credit package details
    return null;
  }

  private async checkUsageLimits(userId: string, plan: SubscriptionPlan, usage: UsageMetrics): Promise<void> {
    // Check if user exceeded limits
    const limits = plan.limits;
    
    if (limits.questionsPerMonth !== -1 && usage.questionsAnswered >= limits.questionsPerMonth) {
      this.eventEmitter.emit('usage.limit_reached', {
        userId,
        metric: 'questionsPerMonth',
        limit: limits.questionsPerMonth
      });
    }
    // ... check other limits
  }

  private isMeteredMetric(metric: keyof UsageMetrics): boolean {
    return ['aiTutorMinutes', 'videoCallMinutes'].includes(metric);
  }

  private async reportMeteredUsage(
    subscriptionId: string,
    metric: keyof UsageMetrics,
    quantity: number
  ): Promise<void> {
    // Report usage to Stripe for metered billing
  }

  private async recordInvoice(stripeInvoice: Stripe.Invoice, status: string): Promise<void> {
    // Record invoice in database
  }

  private generateTransactionId(): string {
    return `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
