import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useSelector } from 'react-redux';

import { DotGridBackground } from '../src/components/ui/DotGridBackground';
import { JournalCard } from '../src/components/ui/JournalCard';
import { StickyNote } from '../src/components/ui/StickyNote';
import { HandwrittenText } from '../src/components/ui/HandwrittenText';
import { PuffyButton } from '../src/components/ui/PuffyButton';
import { useTheme } from '../src/hooks/useTheme';
import { Typography, Spacing, BorderRadius, Shadows } from '../src/constants/theme';
import { RootState } from '../src/store';
import { store } from '../src/store';
import { setSubscription } from '../src/store/slices/trialSlice';
import {
  type PlanId,
  validateCoupon,
  getPlansForUser,
} from '../src/constants/pricing';
import { saveSubscription } from '../src/lib/payments';
import { getPlansConfig, type PlansConfig } from '../src/lib/appConfig';
import {
  initPlayBilling,
  fetchPlayProducts,
  purchaseSubscription,
  restorePlayPurchases,
  type PlayProduct,
} from '../src/lib/playBilling';

export default function UpgradeScreen() {
  const { colors, mode } = useTheme();
  const router = useRouter();
  const shadow = mode === 'dark' ? Shadows.puffyDark : Shadows.puffy;

  const authUser = useSelector((s: RootState) => s.auth.user);
  const targetYear = authUser?.targetYear;

  // ── Config & Play products ───────────────────────────────────
  const [config, setConfig] = useState<PlansConfig | null>(null);
  const [playProducts, setPlayProducts] = useState<PlayProduct[]>([]);
  const [configLoading, setConfigLoading] = useState(true);

  const availablePlanIds = getPlansForUser(targetYear);
  const [selectedPlan, setSelectedPlan] = useState<PlanId>(
    availablePlanIds.includes('yearly') ? 'yearly' : availablePlanIds[0],
  );

  useEffect(() => {
    async function load() {
      const cfg = await getPlansConfig();
      setConfig(cfg);
      // Init Play Billing and fetch real prices from Play Store
      await initPlayBilling();
      const products = await fetchPlayProducts(availablePlanIds);
      setPlayProducts(products);
      setConfigLoading(false);
    }
    load();
  }, []);

  // ── Coupon state (VaNiValue — 100% free only) ────────────────
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountPercent: number;
    label: string;
  } | null>(null);
  const [couponError, setCouponError] = useState('');

  const isFree = (appliedCoupon?.discountPercent ?? 0) === 100;

  // ── Loading ──────────────────────────────────────────────────
  const [loading, setLoading] = useState(false);

  // ── Helpers ──────────────────────────────────────────────────

  function getDisplayPrice(planId: PlanId): string {
    const playProduct = playProducts.find((p) => p.planId === planId);
    if (playProduct?.localizedPrice) return playProduct.localizedPrice;
    const fallback = config?.plans[planId]?.basePrice;
    return fallback != null ? `\u20B9${fallback}` : '';
  }

  // ── Coupon ───────────────────────────────────────────────────

  const handleApplyCoupon = useCallback(() => {
    if (!config) return;
    setCouponError('');
    const result = validateCoupon(couponInput, config.coupons);
    if (!result) {
      setCouponError('Invalid coupon code');
      setAppliedCoupon(null);
      return;
    }
    if (result.discountPercent !== 100) {
      setCouponError('Discount coupons are redeemed via the Play Store. Only free-access codes can be entered here.');
      setAppliedCoupon(null);
      return;
    }
    setAppliedCoupon(result);
    setSelectedPlan('yearly');
  }, [couponInput, config]);

  const handleRemoveCoupon = useCallback(() => {
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponError('');
    setSelectedPlan(
      availablePlanIds.includes('yearly') ? 'yearly' : availablePlanIds[0],
    );
  }, [availablePlanIds]);

  // ── Checkout ─────────────────────────────────────────────────

  const handlePay = useCallback(async () => {
    if (!config) return;
    setLoading(true);
    try {
      if (isFree) {
        // VaNiValue — no payment, activate directly
        await saveSubscription({
          planType: 'yearly',
          paymentStatus: 'coupon_free',
          couponCode: appliedCoupon!.code,
          amountPaidRupees: 0,
          gstRupees: 0,
        });
        store.dispatch(setSubscription({
          plan: 'yearly',
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        }));
        router.replace({
          pathname: '/payment-success',
          params: { planName: 'Yearly' },
        });
        return;
      }

      // Paid flow — Google Play Billing
      const result = await purchaseSubscription(selectedPlan);

      if (result.success) {
        // Subscription already saved inside purchaseSubscription → verifyAndActivate
        let expiresAt: string | null = null;
        if (selectedPlan === 'monthly') {
          expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
        } else if (selectedPlan === 'yearly') {
          expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
        } else if (selectedPlan === 'crunch') {
          const year = targetYear ?? new Date().getFullYear();
          expiresAt = new Date(year, 5, 15).toISOString();
        }
        store.dispatch(setSubscription({ plan: selectedPlan, expiresAt }));
        router.replace({
          pathname: '/payment-success',
          params: { planName: config.plans[selectedPlan]?.name ?? selectedPlan },
        });
      } else if (!result.cancelled) {
        Alert.alert('Payment Failed', result.message || 'Something went wrong. Please try again.');
      }
      // cancelled → user closed Play sheet, do nothing
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [isFree, selectedPlan, appliedCoupon, config, targetYear, router]);

  // ── Restore purchases ─────────────────────────────────────────

  const handleRestore = useCallback(async () => {
    setLoading(true);
    try {
      const result = await restorePlayPurchases(selectedPlan);
      if (result.success) {
        Alert.alert('Restored', 'Your subscription has been restored.');
        router.replace({ pathname: '/payment-success', params: { planName: 'Restored' } });
      } else {
        Alert.alert('Nothing to restore', result.message);
      }
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Restore failed.');
    } finally {
      setLoading(false);
    }
  }, [selectedPlan, router]);

  // ── Loading state ─────────────────────────────────────────────

  if (configLoading || !config) {
    return (
      <DotGridBackground>
        <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color={colors.primary} />
        </SafeAreaView>
      </DotGridBackground>
    );
  }

  // ── Render ────────────────────────────────────────────────────

  return (
    <DotGridBackground>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <HandwrittenText variant="handLg">Choose Your Plan</HandwrittenText>
            <Text style={[Typography.bodySm, { color: colors.textSecondary, textAlign: 'center', marginTop: Spacing.sm }]}>
              {availablePlanIds.includes('crunch')
                ? 'One-time access for your upcoming exam'
                : 'Unlock full access to VaNi'}
            </Text>
          </View>

          {/* Plan Cards */}
          {availablePlanIds.map((planId) => {
            const p = config.plans[planId];
            if (!p) return null;
            const isSelected = selectedPlan === planId;
            const disabled = isFree;
            return (
              <Pressable
                key={planId}
                onPress={() => !disabled && setSelectedPlan(planId)}
                disabled={disabled}
                style={[
                  styles.planCard,
                  shadow,
                  {
                    backgroundColor: isSelected ? colors.primaryLight : colors.card,
                    borderColor: isSelected ? colors.primary : colors.cardBorder,
                    borderWidth: isSelected ? 2 : 1,
                    opacity: disabled && !isSelected ? 0.5 : 1,
                  },
                ]}
              >
                {p.badge && (
                  <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                    <Text style={[Typography.label, { color: '#FFFFFF', letterSpacing: 1 }]}>
                      {p.badge}
                    </Text>
                  </View>
                )}

                <View style={styles.planRow}>
                  <View style={[
                    styles.radio,
                    {
                      borderColor: isSelected ? colors.primary : colors.textTertiary,
                      backgroundColor: isSelected ? colors.primary : 'transparent',
                    },
                  ]}>
                    {isSelected && <View style={styles.radioInner} />}
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={[Typography.h3, { color: colors.text }]}>{p.name}</Text>
                    <Text style={[Typography.bodySm, { color: colors.textSecondary, marginTop: 2 }]}>
                      {p.description}
                    </Text>
                  </View>
                  <View style={styles.priceCol}>
                    <Text style={[Typography.h2, { color: colors.text }]}>
                      {isFree && isSelected ? 'FREE' : getDisplayPrice(planId)}
                    </Text>
                    <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>
                      {p.period}
                    </Text>
                  </View>
                </View>
              </Pressable>
            );
          })}

          {/* Coupon — VaNiValue (free access) only */}
          <JournalCard delay={100}>
            <Text style={[Typography.label, { color: colors.textTertiary, marginBottom: Spacing.md }]}>
              HAVE A FREE ACCESS CODE?
            </Text>

            {appliedCoupon ? (
              <View style={styles.couponApplied}>
                <View style={[styles.couponTag, { backgroundColor: colors.correctBg }]}>
                  <Text style={[Typography.body, { color: colors.correct }]}>
                    {appliedCoupon.code} — {appliedCoupon.label}
                  </Text>
                </View>
                <Pressable onPress={handleRemoveCoupon}>
                  <Text style={[Typography.bodySm, { color: colors.incorrect }]}>Remove</Text>
                </Pressable>
              </View>
            ) : (
              <View style={styles.couponRow}>
                <TextInput
                  value={couponInput}
                  onChangeText={(t) => {
                    setCouponInput(t);
                    setCouponError('');
                  }}
                  placeholder="Enter code"
                  placeholderTextColor={colors.textTertiary}
                  autoCapitalize="characters"
                  style={[
                    styles.couponInput,
                    {
                      borderColor: couponError ? colors.incorrect : colors.surfaceBorder,
                      color: colors.text,
                      backgroundColor: colors.surface,
                    },
                  ]}
                />
                <PuffyButton
                  title="Apply"
                  variant="secondary"
                  onPress={handleApplyCoupon}
                  disabled={couponInput.trim().length === 0}
                  style={{ paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md }}
                />
              </View>
            )}
            {couponError !== '' && (
              <Text style={[Typography.bodySm, { color: colors.incorrect, marginTop: Spacing.sm }]}>
                {couponError}
              </Text>
            )}
          </JournalCard>

          {/* Free access note */}
          {isFree && (
            <StickyNote color="pink" rotation={0.5} delay={200}>
              <Text style={[Typography.bodySm, { color: colors.text }]}>
                Full yearly access activated with {appliedCoupon!.code}. No payment required — enjoy VaNi!
              </Text>
            </StickyNote>
          )}

          {/* CTA */}
          <View style={styles.actions}>
            <PuffyButton
              title={
                loading
                  ? 'Processing...'
                  : isFree
                    ? 'Activate Free Access'
                    : 'Subscribe with Google Play'
              }
              icon={isFree ? '\u2728' : undefined}
              onPress={handlePay}
              disabled={loading}
            />
            <PuffyButton
              title="Back"
              onPress={() => router.back()}
              variant="ghost"
              disabled={loading}
            />
          </View>

          {/* Restore purchases */}
          {!isFree && (
            <Pressable onPress={handleRestore} disabled={loading} style={styles.restoreBtn}>
              <Text style={[Typography.bodySm, { color: colors.textTertiary, textDecorationLine: 'underline' }]}>
                Restore previous purchase
              </Text>
            </Pressable>
          )}

          <Text style={[Typography.bodySm, { color: colors.textTertiary, textAlign: 'center' }]}>
            Payments processed securely by Google Play.
          </Text>
        </ScrollView>

        {loading && (
          <View style={styles.overlay}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        )}
      </SafeAreaView>
    </DotGridBackground>
  );
}

// ── Styles ────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    padding: Spacing.lg,
    gap: Spacing.lg,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },

  // Plan card
  planCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    position: 'relative',
    overflow: 'hidden',
  },
  planRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  priceCol: {
    alignItems: 'flex-end',
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderBottomLeftRadius: BorderRadius.sm,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },

  // Coupon
  couponRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    alignItems: 'center',
  },
  couponInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    ...Typography.body,
  },
  couponApplied: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  couponTag: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },

  // Actions
  actions: {
    gap: Spacing.md,
    marginTop: Spacing.md,
  },

  restoreBtn: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },

  // Loading overlay
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
