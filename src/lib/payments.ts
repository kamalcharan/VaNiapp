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

  if (error) throw error;

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

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Not authenticated.');

  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
  const res = await fetch(`${supabaseUrl}/functions/v1/create-order`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({
      amount: amountPaise,
      currency: 'INR',
      receipt: `${planType}_${Date.now()}`,
      notes: { plan_type: planType },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to create order: ${err}`);
  }

  const order = await res.json();
  return {
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
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
