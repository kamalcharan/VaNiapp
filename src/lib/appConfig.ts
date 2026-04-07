/**
 * Fetches plans + pricing configuration from med_app_config.
 *
 * All values (plans, coupons, GST) live in the DB so they can be
 * changed from the Supabase dashboard without an app update.
 *
 * Uses in-memory caching — one fetch per session.
 */

import { supabase } from './supabase';
import type { PlanId, PricingPlan, CouponConfig } from '../constants/pricing';

// ── Types ──────────────────────────────────────────────────────

export interface PlansConfig {
  gst_rate: number;
  plans: Record<PlanId, PricingPlan>;
  coupons: CouponConfig[];
}

// Keep old name as alias so any future references don't hard-break
export type RazorpayConfig = PlansConfig;

// ── Fallback (used when offline or DB unreachable) ─────────────

const FALLBACK_CONFIG: PlansConfig = {
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

let _cached: PlansConfig | null = null;

/**
 * Fetch plans config from med_app_config.
 * Cached in-memory for the session — call clearPlansConfigCache() to refresh.
 */
export async function getPlansConfig(): Promise<PlansConfig> {
  if (_cached) return _cached;
  if (!supabase) return FALLBACK_CONFIG;

  try {
    const { data, error } = await supabase
      .from('med_app_config')
      .select('value')
      .eq('key', 'razorpay_config')   // DB key unchanged — no migration needed
      .single();

    if (error || !data?.value) return FALLBACK_CONFIG;

    const val = data.value as PlansConfig;
    if (!val.plans) return FALLBACK_CONFIG;

    _cached = val;
    return _cached;
  } catch {
    return FALLBACK_CONFIG;
  }
}

/** @deprecated Use getPlansConfig() */
export const getRazorpayConfig = getPlansConfig;

export function clearPlansConfigCache(): void {
  _cached = null;
}

/** @deprecated Use clearPlansConfigCache() */
export const clearRazorpayConfigCache = clearPlansConfigCache;
