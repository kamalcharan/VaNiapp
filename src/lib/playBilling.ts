/**
 * playBilling.ts
 * Wraps react-native-iap for Google Play Billing.
 *
 * Usage flow:
 *   1. Call initPlayBilling() once on app start (or before upgrade screen opens)
 *   2. Call fetchPlayProducts() to get localised prices from Play Store
 *   3. Call purchaseSubscription(planId) to trigger Play purchase sheet
 *   4. Listen via purchaseUpdateListener — on success, call verifyAndActivate()
 *   5. Call endPlayBilling() on cleanup
 */

import {
  initConnection,
  endConnection,
  getSubscriptions,
  requestSubscription,
  purchaseUpdatedListener,
  purchaseErrorListener,
  finishTransaction,
  type Subscription,
  type SubscriptionPurchase,
  type PurchaseError,
} from 'react-native-iap';
import { Platform } from 'react-native';
import { supabase } from './supabase';
import { saveSubscription } from './payments';
import { PLAY_PRODUCT_IDS, type PlanId } from '../constants/pricing';

// ── Types ────────────────────────────────────────────────────

export interface PlayProduct {
  planId: PlanId;
  productId: string;
  localizedPrice: string;   // e.g. "₹199.00" — comes from Play Store
  title: string;
}

export type PurchaseResult =
  | { success: true }
  | { success: false; cancelled: boolean; message: string };

// ── Internal state ───────────────────────────────────────────

let _connected = false;
let _updateListener: ReturnType<typeof purchaseUpdatedListener> | null = null;
let _errorListener:  ReturnType<typeof purchaseErrorListener>  | null = null;

// ── Init / teardown ──────────────────────────────────────────

export async function initPlayBilling(): Promise<void> {
  if (Platform.OS !== 'android') return;
  if (_connected) return;
  try {
    await initConnection();
    _connected = true;
  } catch (e) {
    console.warn('[PlayBilling] initConnection failed:', e);
  }
}

export function endPlayBilling(): void {
  _updateListener?.remove();
  _errorListener?.remove();
  _updateListener = null;
  _errorListener  = null;
  if (_connected) {
    endConnection();
    _connected = false;
  }
}

// ── Fetch products ───────────────────────────────────────────

export async function fetchPlayProducts(planIds: PlanId[]): Promise<PlayProduct[]> {
  if (Platform.OS !== 'android') return [];
  if (!_connected) await initPlayBilling();

  const skus = planIds.map((id) => PLAY_PRODUCT_IDS[id]);

  let subs: Subscription[] = [];
  try {
    subs = await getSubscriptions({ skus });
  } catch (e) {
    console.warn('[PlayBilling] getSubscriptions failed:', e);
    return [];
  }

  return subs.map((sub) => {
    const planId = (Object.keys(PLAY_PRODUCT_IDS) as PlanId[]).find(
      (k) => PLAY_PRODUCT_IDS[k] === sub.productId,
    ) ?? ('monthly' as PlanId);

    // Localised price lives on the first subscription offer for Play Billing 5
    const offerPrice =
      sub.subscriptionOfferDetails?.[0]?.pricingPhases?.pricingPhaseList?.[0]
        ?.formattedPrice ?? '';

    return {
      planId,
      productId: sub.productId,
      localizedPrice: offerPrice || (sub as any).localizedPrice || '',
      title: sub.title ?? sub.productId,
    };
  });
}

// ── Purchase ─────────────────────────────────────────────────

/**
 * Launches the Play Store subscription sheet.
 * Returns a promise that resolves after the purchase is verified & saved,
 * or rejects with a PurchaseResult describing the failure.
 */
export function purchaseSubscription(planId: PlanId): Promise<PurchaseResult> {
  return new Promise((resolve) => {
    if (Platform.OS !== 'android') {
      resolve({ success: false, cancelled: false, message: 'Not Android' });
      return;
    }

    // Clean up any previous listeners before attaching new ones
    _updateListener?.remove();
    _errorListener?.remove();

    _updateListener = purchaseUpdatedListener(async (purchase: SubscriptionPurchase) => {
      _updateListener?.remove();
      _errorListener?.remove();
      _updateListener = null;
      _errorListener  = null;

      try {
        await verifyAndActivate(purchase, planId);
        await finishTransaction({ purchase, isConsumable: false });
        resolve({ success: true });
      } catch (e: any) {
        resolve({ success: false, cancelled: false, message: e?.message ?? 'Verification failed' });
      }
    });

    _errorListener = purchaseErrorListener((error: PurchaseError) => {
      _updateListener?.remove();
      _errorListener?.remove();
      _updateListener = null;
      _errorListener  = null;

      const cancelled = error.code === 'E_USER_CANCELLED';
      resolve({
        success: false,
        cancelled,
        message: cancelled ? 'Purchase cancelled' : (error.message ?? 'Purchase failed'),
      });
    });

    const sku = PLAY_PRODUCT_IDS[planId];
    requestSubscription({ sku }).catch((e: any) => {
      _updateListener?.remove();
      _errorListener?.remove();
      _updateListener = null;
      _errorListener  = null;
      resolve({ success: false, cancelled: false, message: e?.message ?? 'Failed to open Play Store' });
    });
  });
}

// ── Verify & activate ─────────────────────────────────────────

/**
 * Sends the Play purchase token to our Supabase edge function for
 * server-side verification, then saves the subscription locally.
 */
async function verifyAndActivate(
  purchase: SubscriptionPurchase,
  planId: PlanId,
): Promise<void> {
  if (!supabase) throw new Error('Supabase not configured');

  const { data, error } = await supabase.functions.invoke('verify-play-purchase', {
    body: {
      purchaseToken: purchase.purchaseToken,
      productId: purchase.productId,
      packageName: purchase.packageNameAndroid,
    },
  });

  if (error || !data?.valid) {
    let detail = error?.message ?? 'Invalid purchase';
    try {
      if (error?.context instanceof Response) {
        const body = await error.context.json();
        detail = body?.error ?? detail;
      }
    } catch { /* use default */ }
    throw new Error(`Purchase verification failed: ${detail}`);
  }

  await saveSubscription({
    planType: planId,
    paymentStatus: 'paid',
    amountPaidRupees: 0,   // actual amount managed by Play Store
    gstRupees: 0,
    paymentMethod: 'google_play',
  });
}

// ── Restore purchases ─────────────────────────────────────────

/**
 * Call this on "Restore purchases" tap.
 * Checks Play Store for any existing active subscription and re-activates.
 */
export async function restorePlayPurchases(planId: PlanId): Promise<PurchaseResult> {
  if (Platform.OS !== 'android') {
    return { success: false, cancelled: false, message: 'Not Android' };
  }
  if (!_connected) await initPlayBilling();

  try {
    const { getAvailablePurchases } = await import('react-native-iap');
    const purchases = await getAvailablePurchases();
    const match = purchases.find((p) => p.productId === PLAY_PRODUCT_IDS[planId]);

    if (!match) {
      return { success: false, cancelled: false, message: 'No active subscription found' };
    }

    await verifyAndActivate(match as SubscriptionPurchase, planId);
    return { success: true };
  } catch (e: any) {
    return { success: false, cancelled: false, message: e?.message ?? 'Restore failed' };
  }
}
