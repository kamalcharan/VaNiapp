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
  type PriceBreakdown,
  calculatePricing,
  validateCoupon,
  getPlansForUser,
} from '../src/constants/pricing';
import {
  saveSubscription,
  createRazorpayOrder,
} from '../src/lib/payments';
import { getRazorpayConfig, type RazorpayConfig } from '../src/lib/appConfig';
import RazorpayCheckoutModal, {
  type RazorpayCheckoutParams,
  type RazorpayPaymentResult,
  type RazorpayPaymentError,
} from '../src/components/RazorpayCheckoutModal';

export default function UpgradeScreen() {
  const { colors, mode } = useTheme();
  const router = useRouter();
  const shadow = mode === 'dark' ? Shadows.puffyDark : Shadows.puffy;

  const authUser = useSelector((s: RootState) => s.auth.user);
  const userName = authUser?.name ?? '';
  const userEmail = authUser?.email ?? '';
  const targetYear = authUser?.targetYear;

  // ── DB config ────────────────────────────────────────────────
  const [config, setConfig] = useState<RazorpayConfig | null>(null);
  const [configLoading, setConfigLoading] = useState(true);

  useEffect(() => {
    getRazorpayConfig()
      .then(setConfig)
      .finally(() => setConfigLoading(false));
  }, []);

  // Determine which plans to show
  const availablePlanIds = getPlansForUser(targetYear);
  const [selectedPlan, setSelectedPlan] = useState<PlanId>(
    availablePlanIds.includes('yearly') ? 'yearly' : availablePlanIds[0],
  );

  // Coupon state
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountPercent: number;
    label: string;
  } | null>(null);
  const [couponError, setCouponError] = useState('');

  // Loading
  const [loading, setLoading] = useState(false);

  // Razorpay modal state
  const [checkoutVisible, setCheckoutVisible] = useState(false);
  const [checkoutParams, setCheckoutParams] = useState<RazorpayCheckoutParams | null>(null);

  // Price breakdown
  const plan = config?.plans[selectedPlan];
  const discountPercent = appliedCoupon?.discountPercent ?? 0;
  const isFree = discountPercent === 100;
  const pricing: PriceBreakdown = calculatePricing(
    plan?.basePrice ?? 0,
    discountPercent,
    config?.gst_rate,
  );

  // ── Coupon ─────────────────────────────────────────────────

  const handleApplyCoupon = useCallback(() => {
    if (!config) return;
    setCouponError('');
    const result = validateCoupon(couponInput, config.coupons);
    if (!result) {
      setCouponError('Invalid coupon code');
      setAppliedCoupon(null);
      return;
    }
    setAppliedCoupon(result);

    // VaNiValue always gives yearly access
    if (result.discountPercent === 100) {
      setSelectedPlan('yearly');
    }
  }, [couponInput, config]);

  const handleRemoveCoupon = useCallback(() => {
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponError('');
    // Reset plan to user's default
    setSelectedPlan(
      availablePlanIds.includes('yearly') ? 'yearly' : availablePlanIds[0],
    );
  }, [availablePlanIds]);

  // ── Checkout ───────────────────────────────────────────────

  const handlePay = useCallback(async () => {
    if (!config || !plan) return;
    setLoading(true);
    try {
      if (isFree) {
        // VaNiValue — skip Razorpay, activate directly
        await saveSubscription({
          planType: 'yearly',
          paymentStatus: 'coupon_free',
          couponCode: appliedCoupon!.code,
          amountPaidPaise: 0,
          gstPaise: 0,
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

      // Paid flow — create order via Edge Function, then open checkout modal
      const order = await createRazorpayOrder(
        selectedPlan,
        discountPercent,
        config.plans,
        config.gst_rate,
      );

      setCheckoutParams({
        orderId: order.orderId,
        amount: order.amount,
        planName: `VaNi ${plan.name}`,
        userEmail: userEmail || '',
        userName: userName || '',
        userPhone: '',
      });
      setCheckoutVisible(true);
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [isFree, selectedPlan, discountPercent, appliedCoupon, plan, config, pricing, userEmail, userName, router]);

  // ── Razorpay modal callbacks ────────────────────────────────

  const handlePaymentSuccess = useCallback(async (result: RazorpayPaymentResult) => {
    setCheckoutVisible(false);
    setCheckoutParams(null);
    setLoading(true);
    try {
      await saveSubscription({
        planType: selectedPlan,
        paymentStatus: 'paid',
        razorpayPaymentId: result.paymentId,
        razorpayOrderId: result.orderId,
        razorpaySignature: result.signature,
        couponCode: appliedCoupon?.code,
        amountPaidPaise: pricing.discountedPrice * 100,
        gstPaise: pricing.gst * 100,
      });
      // Cache full subscription info so isPaid persists across app restarts
      let expiresAt: string | null = null;
      if (selectedPlan === 'monthly') {
        expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      } else if (selectedPlan === 'yearly') {
        expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
      }
      store.dispatch(setSubscription({ plan: selectedPlan, expiresAt }));
      router.replace({
        pathname: '/payment-success',
        params: { planName: plan?.name ?? selectedPlan },
      });
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to save subscription.');
    } finally {
      setLoading(false);
    }
  }, [selectedPlan, appliedCoupon, pricing, plan, router]);

  const handlePaymentFailure = useCallback((error: RazorpayPaymentError) => {
    setCheckoutVisible(false);
    setCheckoutParams(null);
    setLoading(false);
    router.push({
      pathname: '/payment-failure',
      params: { errorDescription: error.errorDescription },
    });
  }, [router]);

  const handlePaymentDismiss = useCallback(() => {
    setCheckoutVisible(false);
    setCheckoutParams(null);
    setLoading(false);
  }, []);

  // ── Loading state ─────────────────────────────────────────

  if (configLoading || !config) {
    return (
      <DotGridBackground>
        <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color={colors.primary} />
        </SafeAreaView>
      </DotGridBackground>
    );
  }

  // ── Render ─────────────────────────────────────────────────

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
            const disabled = isFree; // Lock selection when VaNiValue applied
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
                  {/* Radio indicator — inline, not absolute */}
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
                      {'\u20B9'}{p.basePrice}
                    </Text>
                    <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>
                      {p.period}
                    </Text>
                  </View>
                </View>
              </Pressable>
            );
          })}

          {/* Coupon Section */}
          <JournalCard delay={100}>
            <Text style={[Typography.label, { color: colors.textTertiary, marginBottom: Spacing.md }]}>
              HAVE A COUPON CODE?
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

          {/* Price Breakdown */}
          <StickyNote color="teal" rotation={-0.5} delay={150}>
            <Text style={[Typography.label, { color: colors.text, marginBottom: Spacing.md }]}>
              PRICE BREAKDOWN
            </Text>

            <PriceRow label="Base price" value={`\u20B9${pricing.basePrice}`} colors={colors} />

            {pricing.discount > 0 && (
              <PriceRow
                label={`Discount (${discountPercent}%)`}
                value={`-\u20B9${pricing.discount}`}
                colors={colors}
                highlight
              />
            )}

            <PriceRow label={`GST (${Math.round((config.gst_rate) * 100)}%)`} value={`\u20B9${pricing.gst}`} colors={colors} />

            <View style={[styles.divider, { borderColor: colors.textTertiary }]} />

            <View style={styles.totalRow}>
              <Text style={[Typography.h3, { color: colors.text }]}>Total</Text>
              <Text style={[Typography.h2, { color: isFree ? colors.correct : colors.text }]}>
                {isFree ? 'FREE' : `\u20B9${pricing.total}`}
              </Text>
            </View>
          </StickyNote>

          {/* VaNiValue info note */}
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
                    : `Pay \u20B9${pricing.total}`
              }
              icon={isFree ? '\u2728' : '\uD83D\uDD12'}
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

          {/* GST note */}
          <Text style={[Typography.bodySm, { color: colors.textTertiary, textAlign: 'center' }]}>
            All prices include {Math.round(config.gst_rate * 100)}% GST. Payments secured by Razorpay.
          </Text>
        </ScrollView>

        {loading && (
          <View style={styles.overlay}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        )}
      </SafeAreaView>
      <RazorpayCheckoutModal
        visible={checkoutVisible}
        params={checkoutParams}
        razorpayKeyId={config.razorpay_key_id}
        onSuccess={handlePaymentSuccess}
        onFailure={handlePaymentFailure}
        onDismiss={handlePaymentDismiss}
      />
    </DotGridBackground>
  );
}

// ── Sub-components ───────────────────────────────────────────

function PriceRow({
  label,
  value,
  colors,
  highlight,
}: {
  label: string;
  value: string;
  colors: any;
  highlight?: boolean;
}) {
  return (
    <View style={styles.priceRow}>
      <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>{label}</Text>
      <Text
        style={[
          Typography.body,
          { color: highlight ? colors.correct : colors.text },
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

// ── Styles ───────────────────────────────────────────────────

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

  // Price breakdown
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.xs,
  },
  divider: {
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    marginVertical: Spacing.sm,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  // Actions
  actions: {
    gap: Spacing.md,
    marginTop: Spacing.md,
  },

  // Loading overlay
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
