/**
 * playBilling.ts
 * Wraps react-native-iap v14 for Google Play Billing.
 *
 * Usage flow:
 *   1. Call initPlayBilling() once before the upgrade screen opens
 *   2. Call fetchPlayProducts() to get localised prices from Play Store
 *   3. Call purchaseSubscription(planId) to trigger the Play purchase sheet
 *   4. On success, verifyAndActivate() is called automatically
 *   5. Call endPlayBilling() on cleanup
 */

import {
  initConnection,
  endConnection,
  fetchProducts,
  requestPurchase,
  purchaseUpdatedListener,
  purchaseErrorListener,
  finishTransaction,
  getAvailablePurchases,
  ErrorCode,
  type Purchase,
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
  localizedPrice: string;
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

  let rawProducts: any[] = [];
  try {
    const result = await fetchProducts({ skus, type: 'subs' });
    rawProducts = result ?? [];
  } catch (e) {
    console.warn('[PlayBilling] fetchProducts failed:', e);
    return [];
  }

  return rawProducts.map((product: any) => {
    // v14 uses product.id (not productId) on the Product shape
    const productId: string = product.id ?? product.productId ?? '';
    const planId = (Object.keys(PLAY_PRODUCT_IDS) as PlanId[]).find(
      (k) => PLAY_PRODUCT_IDS[k] === productId,
    ) ?? ('monthly' as PlanId);

    // subscriptionOfferDetailsAndroid may be a JSON string in v14
    let offerPrice = '';
    try {
      const details = typeof product.subscriptionOfferDetailsAndroid === 'string'
        ? JSON.parse(product.subscriptionOfferDetailsAndroid)
        : product.subscriptionOfferDetailsAndroid;
      offerPrice = details?.[0]?.pricingPhases?.pricingPhaseList?.[0]?.formattedPrice ?? '';
    } catch { /* ignore parse errors */ }

    const price = offerPrice || product.displayPrice || product.localizedPrice || '';

    return {
      planId,
      productId,
      localizedPrice: price,
      title: product.title ?? productId,
    };
  });
}

// ── Purchase ─────────────────────────────────────────────────

/**
 * Launches the Play Store subscription sheet.
 * Resolves after purchase is verified & saved, or with failure details.
 */
export function purchaseSubscription(planId: PlanId): Promise<PurchaseResult> {
  return new Promise((resolve) => {
    if (Platform.OS !== 'android') {
      resolve({ success: false, cancelled: false, message: 'Not Android' });
      return;
    }

    _updateListener?.remove();
    _errorListener?.remove();

    _updateListener = purchaseUpdatedListener(async (purchase: Purchase) => {
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

      const cancelled = error.code === ErrorCode.UserCancelled;
      resolve({
        success: false,
        cancelled,
        message: cancelled ? 'Purchase cancelled' : (error.message ?? 'Purchase failed'),
      });
    });

    const sku = PLAY_PRODUCT_IDS[planId];
    requestPurchase({ request: { android: { skus: [sku] } }, type: 'subs' }).catch((e: any) => {
      _updateListener?.remove();
      _errorListener?.remove();
      _updateListener = null;
      _errorListener  = null;
      resolve({ success: false, cancelled: false, message: e?.message ?? 'Failed to open Play Store' });
    });
  });
}

// ── Verify & activate ─────────────────────────────────────────

async function verifyAndActivate(purchase: Purchase, planId: PlanId): Promise<void> {
  if (!supabase) throw new Error('Supabase not configured');

  // v14: purchaseToken is the unified token; purchaseTokenAndroid is Android-specific
  const token = (purchase as any).purchaseTokenAndroid || purchase.purchaseToken;

  const { data, error } = await supabase.functions.invoke('verify-play-purchase', {
    body: {
      purchaseToken: token,
      productId: purchase.productId,
      packageName: (purchase as any).packageNameAndroid,
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
    amountPaidRupees: 0,   // managed by Play Store
    gstRupees: 0,
    paymentMethod: 'google_play',
  });
}

// ── Restore purchases ─────────────────────────────────────────

export async function restorePlayPurchases(planId: PlanId): Promise<PurchaseResult> {
  if (Platform.OS !== 'android') {
    return { success: false, cancelled: false, message: 'Not Android' };
  }
  if (!_connected) await initPlayBilling();

  try {
    const purchases = await getAvailablePurchases({});
    const match = purchases.find((p) => p.productId === PLAY_PRODUCT_IDS[planId]);

    if (!match) {
      return { success: false, cancelled: false, message: 'No active subscription found' };
    }

    await verifyAndActivate(match, planId);
    return { success: true };
  } catch (e: any) {
    return { success: false, cancelled: false, message: e?.message ?? 'Restore failed' };
  }
}
