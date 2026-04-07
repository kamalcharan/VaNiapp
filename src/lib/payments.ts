import { supabase } from './supabase';
import type { PlanId } from '../constants/pricing';

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
  paymentMethod?: string;
  targetYear?: number;
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
  } else if (params.planType === 'crunch') {
    const year = params.targetYear ?? now.getFullYear();
    expiresAt = new Date(year, 5, 15).toISOString(); // June 15 of exam year
  }

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
    payment_method: params.paymentMethod ?? null,
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

// ── Payment history ──────────────────────────────────────────

export interface PaymentHistoryItem {
  id: string;
  planType: PlanId;
  paymentStatus: 'paid' | 'coupon_free' | 'pending';
  amountPaid: number;
  gstAmount: number;
  paymentMethod: string | null;
  couponCode: string | null;
  razorpayPaymentId: string | null;
  status: string;
  startsAt: string;
  expiresAt: string | null;
  createdAt: string;
}

export async function getPaymentHistory(): Promise<PaymentHistoryItem[]> {
  if (!supabase) return [];
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('med_subscriptions')
    .select('id, plan_type, payment_status, amount_paid, gst_amount, payment_method, coupon_code, razorpay_payment_id, status, starts_at, expires_at, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error || !data) return [];

  return data.map((row: any) => ({
    id: row.id,
    planType: row.plan_type as PlanId,
    paymentStatus: row.payment_status,
    amountPaid: row.amount_paid,
    gstAmount: row.gst_amount,
    paymentMethod: row.payment_method,
    couponCode: row.coupon_code,
    razorpayPaymentId: row.razorpay_payment_id,
    status: row.status,
    startsAt: row.starts_at,
    expiresAt: row.expires_at,
    createdAt: row.created_at,
  }));
}

// ── Log failed payment ──────────────────────────────────────

export async function logFailedPayment(params: {
  planType: PlanId;
  errorCode: string;
  errorDescription: string;
  razorpayOrderId?: string;
  amountRupees: number;
}): Promise<void> {
  if (!supabase) return;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from('med_failed_payments').insert({
    user_id: user.id,
    plan_type: params.planType,
    error_code: params.errorCode,
    error_description: params.errorDescription,
    razorpay_order_id: params.razorpayOrderId ?? null,
    amount: params.amountRupees,
  }).then(null, () => {});
}

// ── Cancel subscription ──────────────────────────────────────

export async function cancelSubscription(): Promise<void> {
  if (!supabase) throw new Error('Supabase is not configured.');
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated.');

  const { error } = await supabase
    .from('med_subscriptions')
    .update({ status: 'cancelled', updated_at: new Date().toISOString() })
    .eq('user_id', user.id)
    .eq('status', 'active');

  if (error) throw error;
}

