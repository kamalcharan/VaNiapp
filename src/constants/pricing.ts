/**
 * Pricing types and pure helper functions.
 *
 * All concrete values (plans, coupons, GST rate, Razorpay key) are fetched
 * from med_app_config at runtime via getRazorpayConfig().
 * This file only contains types and stateless helpers.
 */

export type PlanId = 'crunch' | 'monthly' | 'yearly';

// ── Google Play product IDs (must match Play Console exactly) ──
export const PLAY_PRODUCT_IDS: Record<PlanId, string> = {
  monthly: 'vani_monthly',
  yearly:  'vani_yearly',
  crunch:  'vani_crunch',
};

export interface PricingPlan {
  id: PlanId;
  name: string;
  description: string;
  basePrice: number;          // INR — display only; actual charge set in Play Console
  period: string;             // display label
  badge?: string;
}

export interface CouponConfig {
  code: string;
  discountPercent: number;
  label: string;
}

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
  gstRate: number = 0.18,
): PriceBreakdown {
  const discount = Math.round(basePrice * discountPercent / 100);
  const discountedPrice = basePrice - discount;
  const gst = Math.round(discountedPrice * gstRate);
  const total = discountedPrice + gst;
  return { basePrice, discount, discountedPrice, gst, total };
}

export function validateCoupon(
  code: string,
  coupons: CouponConfig[],
): CouponConfig | null {
  const trimmed = code.trim();
  return coupons.find(
    (c) => c.code.toLowerCase() === trimmed.toLowerCase(),
  ) ?? null;
}

/** Returns the plan IDs a user should see based on their target year. */
export function getPlansForUser(targetYear: number | undefined): PlanId[] {
  const currentYear = new Date().getFullYear();
  if (targetYear === currentYear) return ['crunch'];
  return ['monthly', 'yearly'];
}
