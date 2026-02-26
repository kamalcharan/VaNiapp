import { supabase } from './supabase';
import type { PlanId } from '../constants/pricing';
import { PLANS, calculatePricing, RAZORPAY_KEY_ID } from '../constants/pricing';

// ── Save subscription ────────────────────────────────────────

export interface SaveSubscriptionParams {
  planType: PlanId;
  paymentStatus: 'paid' | 'coupon_free';
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  razorpaySignature?: string;
  couponCode?: string;
  amountPaidPaise: number;
  gstPaise: number;
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
    amount_paid: params.amountPaidPaise,
    gst_amount: params.gstPaise,
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

  // Track coupon usage
  if (params.couponCode) {
    await supabase.from('med_coupon_redemptions').insert({
      user_id: user.id,
      coupon_code: params.couponCode,
      plan_type: params.planType,
    }).catch(() => {}); // non-critical
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
): Promise<CreateOrderResult> {
  if (!supabase) throw new Error('Supabase is not configured.');

  const plan = PLANS[planType];
  const pricing = calculatePricing(plan.basePrice, discountPercent);
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
    throw new Error(`Failed to create order: ${error.message}`);
  }

  return {
    orderId: data.id,
    amount: data.amount,
    currency: data.currency,
  };
}

// ── Open Razorpay checkout via browser ───────────────────────

export async function openRazorpayCheckout(params: {
  orderId: string;
  amount: number;
  planName: string;
  userEmail: string;
  userName: string;
}): Promise<{ paymentId: string; orderId: string; signature: string } | null> {
  const WebBrowser = require('expo-web-browser');

  // checkout-page must be deployed with --no-verify-jwt since a browser opens it
  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
  const checkoutUrl =
    `${supabaseUrl}/functions/v1/checkout-page` +
    `?order_id=${encodeURIComponent(params.orderId)}` +
    `&amount=${params.amount}` +
    `&key=${RAZORPAY_KEY_ID}` +
    `&name=${encodeURIComponent(params.planName)}` +
    `&email=${encodeURIComponent(params.userEmail)}` +
    `&prefill_name=${encodeURIComponent(params.userName)}`;

  const result = await WebBrowser.openAuthSessionAsync(
    checkoutUrl,
    'vani://payment',
    { showInRecents: false },
  );

  if (result.type === 'success' && result.url) {
    const url = result.url;
    const paymentId = extractParam(url, 'razorpay_payment_id');
    const orderId = extractParam(url, 'razorpay_order_id');
    const signature = extractParam(url, 'razorpay_signature');

    if (paymentId && orderId && signature) {
      return { paymentId, orderId, signature };
    }
  }

  return null; // cancelled or failed
}

function extractParam(url: string, param: string): string | null {
  const qIdx = url.indexOf('?');
  if (qIdx === -1) return null;
  const qs = url.substring(qIdx + 1);
  for (const part of qs.split('&')) {
    const [key, ...rest] = part.split('=');
    if (decodeURIComponent(key) === param) {
      return decodeURIComponent(rest.join('='));
    }
  }
  return null;
}
