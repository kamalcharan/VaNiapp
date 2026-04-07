/**
 * Fetches Razorpay + pricing configuration from med_app_config.
 *
 * All values (key, plans, coupons, GST) live in the DB so they can be
 * changed from the Supabase dashboard without an app update.
 *
 * Uses in-memory caching — one fetch per session.
 */

import { supabase } from './supabase';
import type { PlanId, PricingPlan, CouponConfig } from '../constants/pricing';

// ── Types ──────────────────────────────────────────────────────

export interface RazorpayConfig {
  razorpay_key_id: string;
  gst_rate: number;
  plans: Record<PlanId, PricingPlan>;
  coupons: CouponConfig[];
}

// ── Fallback (used when offline or DB unreachable) ─────────────

const FALLBACK_CONFIG: RazorpayConfig = {
  razorpay_key_id: '',
  gst_rate: 0.18,
  plans: {
    crunch: {
      id: 'crunch',
      name: 'Crunch Mode',
      description: 'Practice exams only — no stages',
      basePrice: 499,
      period: 'one-time',
    },
    monthly: {
      id: 'monthly',
      name: 'Monthly',
      description: 'Full access with stage-wise progression',
      basePrice: 199,
      period: '/month',
    },
    yearly: {
      id: 'yearly',
      name: 'Yearly',
      description: 'Full access — best value',
      basePrice: 1399,
      period: '/year',
      badge: 'BEST VALUE',
    },
  },
  coupons: [],
};

// ── Cache ──────────────────────────────────────────────────────

let _cached: RazorpayConfig | null = null;

/**
 * Fetch Razorpay config from med_app_config.
 * Cached in-memory for the session — call clearRazorpayConfigCache() to refresh.
 */
export async function getRazorpayConfig(): Promise<RazorpayConfig> {
  if (_cached) return _cached;
  if (!supabase) return FALLBACK_CONFIG;

  try {
    const { data, error } = await supabase
      .from('med_app_config')
      .select('value')
      .eq('key', 'razorpay_config')
      .single();

    if (error || !data?.value) return FALLBACK_CONFIG;

    const val = data.value as RazorpayConfig;

    // Sanity check — must have a key and at least one plan
    if (!val.razorpay_key_id || !val.plans) return FALLBACK_CONFIG;

    _cached = val;
    return _cached;
  } catch {
    return FALLBACK_CONFIG;
  }
}

export function clearRazorpayConfigCache(): void {
  _cached = null;
}
