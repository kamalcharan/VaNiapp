/**
 * Pricing plans, coupon codes, and Razorpay configuration.
 *
 * Plan routing by target_year:
 *   target_year === current year  → crunch plan (one-time Rs 499)
 *   target_year === next year     → monthly (Rs 199/mo) or yearly (Rs 1399/yr)
 */

export const GST_RATE = 0.18;

export type PlanId = 'crunch' | 'monthly' | 'yearly';

export interface PricingPlan {
  id: PlanId;
  name: string;
  description: string;
  basePrice: number;          // INR
  period: string;             // display label
  razorpayPlanId: string;
  badge?: string;
}

export const PLANS: Record<PlanId, PricingPlan> = {
  crunch: {
    id: 'crunch',
    name: 'Crunch Mode',
    description: 'Practice exams only — no stages',
    basePrice: 499,
    period: 'one-time',
    razorpayPlanId: 'plan_SKeuAORlFlY9nv',
  },
  monthly: {
    id: 'monthly',
    name: 'Monthly',
    description: 'Full access with stage-wise progression',
    basePrice: 199,
    period: '/month',
    razorpayPlanId: 'plan_SKeufdrgIwFRH7',
  },
  yearly: {
    id: 'yearly',
    name: 'Yearly',
    description: 'Full access — best value',
    basePrice: 1399,
    period: '/year',
    razorpayPlanId: 'plan_SKevPIDmnF6tCw',
    badge: 'BEST VALUE',
  },
};

export interface CouponConfig {
  code: string;
  discountPercent: number;
  label: string;
}

export const COUPONS: CouponConfig[] = [
  { code: 'VaNiGO',    discountPercent: 25,  label: '25% off' },
  { code: 'VaNiGem',   discountPercent: 10,  label: '10% off' },
  { code: 'VaNiValue', discountPercent: 100, label: 'Free access' },
];

export const RAZORPAY_KEY_ID = 'rzp_test_SBip7OyaGlp8TF';

// ── Helpers ──────────────────────────────────────────────────

export interface PriceBreakdown {
  basePrice: number;
  discount: number;
  discountedPrice: number;
  gst: number;
  total: number;
}

export function calculatePricing(
  basePrice: number,
  discountPercent: number = 0,
): PriceBreakdown {
  const discount = Math.round(basePrice * discountPercent / 100);
  const discountedPrice = basePrice - discount;
  const gst = Math.round(discountedPrice * GST_RATE);
  const total = discountedPrice + gst;
  return { basePrice, discount, discountedPrice, gst, total };
}

export function validateCoupon(code: string): CouponConfig | null {
  const trimmed = code.trim();
  return COUPONS.find(
    (c) => c.code.toLowerCase() === trimmed.toLowerCase(),
  ) ?? null;
}

/** Returns the plan IDs a user should see based on their target year. */
export function getPlansForUser(targetYear: number | undefined): PlanId[] {
  const currentYear = new Date().getFullYear();
  if (targetYear === currentYear) return ['crunch'];
  return ['monthly', 'yearly'];
}
