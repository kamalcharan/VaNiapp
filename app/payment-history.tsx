import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Share,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { DotGridBackground } from '../src/components/ui/DotGridBackground';
import { JournalCard } from '../src/components/ui/JournalCard';
import { HandwrittenText } from '../src/components/ui/HandwrittenText';
import { useTheme } from '../src/hooks/useTheme';
import { Typography, Spacing, BorderRadius } from '../src/constants/theme';
import { getPaymentHistory, type PaymentHistoryItem } from '../src/lib/payments';

export default function PaymentHistoryScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [items, setItems] = useState<PaymentHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPaymentHistory()
      .then(setItems)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleShareReceipt = async (item: PaymentHistoryItem) => {
    const date = new Date(item.createdAt).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'long', year: 'numeric',
    });
    const total = item.amountPaid + item.gstAmount;
    const receipt = [
      '--- VaNi Payment Receipt ---',
      '',
      `Date: ${date}`,
      `Plan: ${item.planType}`,
      `Status: ${item.status}`,
      '',
      item.paymentStatus === 'coupon_free'
        ? 'Amount: Free (Coupon)'
        : [
            `Base Amount: \u20B9${item.amountPaid}`,
            `GST (18%):   \u20B9${item.gstAmount}`,
            `Total Paid:  \u20B9${total}`,
          ].join('\n'),
      '',
      item.paymentMethod ? `Payment Method: ${item.paymentMethod.toUpperCase()}` : null,
      item.razorpayPaymentId ? `Transaction ID: ${item.razorpayPaymentId}` : null,
      item.couponCode ? `Coupon Applied: ${item.couponCode}` : null,
      '',
      'Vikuna Technologies',
      'connect@vikuna.io | www.vikuna.io',
      '---',
    ].filter(Boolean).join('\n');

    try {
      await Share.share({ message: receipt, title: 'VaNi Payment Receipt' });
    } catch { /* dismissed */ }
  };

  const renderItem = ({ item, index }: { item: PaymentHistoryItem; index: number }) => {
    const date = new Date(item.createdAt).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
    const total = item.amountPaid + item.gstAmount;
    const isActive = item.status === 'active';

    return (
      <JournalCard delay={index * 80}>
        <View style={{ gap: Spacing.sm }}>
          {/* Header: plan + status */}
          <View style={localStyles.row}>
            <Text style={[Typography.body, { color: colors.text, fontFamily: 'PlusJakartaSans_600SemiBold' }]}>
              {item.planType.charAt(0).toUpperCase() + item.planType.slice(1)} Plan
            </Text>
            <View style={[localStyles.badge, {
              backgroundColor: isActive ? colors.correctBg : colors.surfaceBorder,
            }]}>
              <Text style={[Typography.bodySm, {
                color: isActive ? colors.correct : colors.textTertiary,
                fontFamily: 'PlusJakartaSans_600SemiBold',
                fontSize: 11,
              }]}>
                {item.status.toUpperCase()}
              </Text>
            </View>
          </View>

          {/* Date */}
          <View style={localStyles.row}>
            <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>Date</Text>
            <Text style={[Typography.bodySm, { color: colors.text }]}>{date}</Text>
          </View>

          {/* Amount */}
          <View style={localStyles.row}>
            <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>Amount</Text>
            <Text style={[Typography.bodySm, { color: colors.text, fontFamily: 'PlusJakartaSans_600SemiBold' }]}>
              {item.paymentStatus === 'coupon_free'
                ? 'Free (Coupon)'
                : `\u20B9${item.amountPaid} + \u20B9${item.gstAmount} GST = \u20B9${total}`}
            </Text>
          </View>

          {/* Payment method */}
          {item.paymentMethod && (
            <View style={localStyles.row}>
              <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>Method</Text>
              <Text style={[Typography.bodySm, { color: colors.text }]}>
                {item.paymentMethod.toUpperCase()}
              </Text>
            </View>
          )}

          {/* Txn ID */}
          {item.razorpayPaymentId && (
            <View style={localStyles.row}>
              <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>Txn ID</Text>
              <Text style={[Typography.bodySm, { color: colors.textTertiary, fontSize: 11 }]}>
                {item.razorpayPaymentId}
              </Text>
            </View>
          )}

          {/* Coupon */}
          {item.couponCode && (
            <View style={localStyles.row}>
              <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>Coupon</Text>
              <View style={[localStyles.badge, { backgroundColor: colors.primaryLight }]}>
                <Text style={[Typography.bodySm, { color: colors.primary, fontFamily: 'PlusJakartaSans_600SemiBold' }]}>
                  {item.couponCode}
                </Text>
              </View>
            </View>
          )}

          {/* Expiry */}
          {item.expiresAt && (
            <View style={localStyles.row}>
              <Text style={[Typography.bodySm, { color: colors.textSecondary }]}>
                {item.status === 'active' ? 'Valid until' : 'Expired on'}
              </Text>
              <Text style={[Typography.bodySm, { color: colors.text }]}>
                {new Date(item.expiresAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </Text>
            </View>
          )}

          {/* Share receipt */}
          <Pressable
            onPress={() => handleShareReceipt(item)}
            style={localStyles.receiptBtn}
          >
            <Text style={{ fontSize: 14 }}>{'\uD83D\uDCC4'}</Text>
            <Text style={[Typography.bodySm, { color: colors.primary }]}>Share Receipt</Text>
          </Pressable>
        </View>
      </JournalCard>
    );
  };

  return (
    <DotGridBackground>
      <SafeAreaView style={localStyles.container} edges={['top', 'bottom']}>
        {/* Header */}
        <View style={localStyles.header}>
          <Pressable onPress={() => router.back()} style={localStyles.backBtn}>
            <Text style={[Typography.body, { color: colors.primary }]}>{'\u2039'} Back</Text>
          </Pressable>
          <HandwrittenText variant="handLg">Payment History</HandwrittenText>
        </View>

        {loading ? (
          <View style={localStyles.center}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : items.length === 0 ? (
          <View style={localStyles.center}>
            <Text style={[Typography.body, { color: colors.textSecondary, textAlign: 'center' }]}>
              No payment records found.
            </Text>
          </View>
        ) : (
          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ padding: Spacing.lg, gap: Spacing.md }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </SafeAreaView>
    </DotGridBackground>
  );
}

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
    gap: Spacing.xs,
  },
  backBtn: {
    alignSelf: 'flex-start',
    paddingVertical: Spacing.xs,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 3,
    borderRadius: BorderRadius.round,
  },
  receiptBtn: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: Spacing.xs,
  },
});
