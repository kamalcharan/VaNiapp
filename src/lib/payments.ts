import { supabase } from './supabase';
import type { PlanId, PricingPlan } from '../constants/pricing';
import { calculatePricing } from '../constants/pricing';

// ── Save subscription ────────────────────────────────────────

export interface SaveSubscriptionParams {
  planType: PlanId;
  paymentStatus: 'paid' | 'coupon_free';
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  razorpaySignature?: string;
  couponCode?: string;
  amountPaidRupees: number;
  gstRupees: number;
}

export async function saveSubscription(params: SaveSubscriptionParams): Promise<void> {
  if (!supabase) throw new Error('Supabase is not configured.');
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated.');

  // Calculate expiry
  let expiresAt: string | null = null;
  const now = new Date();

  if (params.paymentStatus === 'coupon_free') {
    // VaNiValue always gets yearly
    expiresAt = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000).toISOString();
  } else if (params.planType === 'monthly') {
    expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
  } else if (params.planType === 'yearly') {
    expiresAt = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000).toISOString();
  }
  // crunch: no expiry (valid until exam season ends)

  const { error } = await supabase.from('med_subscriptions').insert({
    user_id: user.id,
    plan_type: params.planType,
    status: 'active',
    payment_status: params.paymentStatus,
    razorpay_payment_id: params.razorpayPaymentId ?? null,
    razorpay_order_id: params.razorpayOrderId ?? null,
    razorpay_signature: params.razorpaySignature ?? null,
    coupon_code: params.couponCode ?? null,
    amount_paid: params.amountPaidRupees,
    gst_amount: params.gstRupees,
    expires_at: expiresAt,
  });

  if (error) {
    // Provide a clear message if the table hasn't been created yet
    if (error.code === '42P01' || error.message?.includes('schema cache')) {
      throw new Error(
        'Subscriptions table not found. Please run the database migration first.',
      );
    }
    throw error;
  }

  // Track coupon usage (non-critical — don't block if it fails)
  if (params.couponCode) {
    try {
      await supabase.from('med_coupon_redemptions').insert({
        user_id: user.id,
        coupon_code: params.couponCode,
        plan_type: params.planType,
      });
    } catch {
      // ignore — redemption tracking is best-effort
    }
  }
}

// ── Query active subscription ────────────────────────────────

export interface ActiveSubscription {
  planType: PlanId;
  status: string;
  expiresAt: string | null;
  couponCode: string | null;
}

export async function getActiveSubscription(): Promise<ActiveSubscription | null> {
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('med_subscriptions')
    .select('plan_type, status, expires_at, coupon_code')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;

  // Auto-expire if past expiry date
  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    await supabase
      .from('med_subscriptions')
      .update({ status: 'expired', updated_at: new Date().toISOString() })
      .eq('user_id', user.id)
      .eq('status', 'active');
    return null;
  }

  return {
    planType: data.plan_type as PlanId,
    status: data.status,
    expiresAt: data.expires_at,
    couponCode: data.coupon_code,
  };
}

// ── Create Razorpay order via Supabase Edge Function ─────────

interface CreateOrderResult {
  orderId: string;
  amount: number;     // paise
  currency: string;
}

export async function createRazorpayOrder(
  planType: PlanId,
  discountPercent: number = 0,
  plans: Record<PlanId, PricingPlan>,
  gstRate: number = 0.18,
): Promise<CreateOrderResult> {
  if (!supabase) throw new Error('Supabase is not configured.');

  const plan = plans[planType];
  if (!plan) throw new Error(`Unknown plan: ${planType}`);
  const pricing = calculatePricing(plan.basePrice, discountPercent, gstRate);
  const amountPaise = pricing.total * 100;

  // supabase.functions.invoke() automatically:
  // - includes the current user's JWT (refreshed if expired)
  // - adds the apikey header
  const { data, error } = await supabase.functions.invoke('create-order', {
    body: {
      amount: amountPaise,
      currency: 'INR',
      receipt: `${planType}_${Date.now()}`,
      notes: { plan_type: planType },
    },
  });

  if (error) {
    // supabase.functions.invoke wraps the real error — extract it
    let detail = error.message;
    try {
      if (error.context instanceof Response) {
        const body = await error.context.json();
        detail = body?.error || JSON.stringify(body);
      }
    } catch { /* use default message */ }
    throw new Error(`Failed to create order: ${detail}`);
  }

  return {
    orderId: data.id,
    amount: data.amount,
    currency: data.currency,
  };
}

