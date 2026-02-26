import React, { useRef, useCallback } from 'react';
import { Modal, View, StyleSheet, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { RAZORPAY_KEY_ID } from '../constants/pricing';

export interface RazorpayCheckoutParams {
  orderId: string;
  amount: number; // paise
  planName: string;
  userEmail: string;
  userName: string;
}

export interface RazorpayPaymentResult {
  paymentId: string;
  orderId: string;
  signature: string;
}

export interface RazorpayPaymentError {
  errorCode: string;
  errorDescription: string;
}

interface Props {
  visible: boolean;
  params: RazorpayCheckoutParams | null;
  onSuccess: (result: RazorpayPaymentResult) => void;
  onFailure: (error: RazorpayPaymentError) => void;
  onDismiss: () => void;
}

function buildCheckoutHtml(params: RazorpayCheckoutParams): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>VaNi Checkout</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      display: flex; align-items: center; justify-content: center;
      height: 100vh; margin: 0;
      background: #fdfcf0; color: #0F172A;
    }
    .loading { text-align: center; }
    .spinner {
      width: 40px; height: 40px;
      border: 3px solid #E5E7EB; border-top: 3px solid #2563EB;
      border-radius: 50%; animation: spin 0.8s linear infinite;
      margin: 0 auto 16px;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  </style>
</head>
<body>
  <div class="loading">
    <div class="spinner"></div>
    <p>Opening payment...</p>
  </div>
  <script src="https://checkout.razorpay.com/v1/checkout.js"><\/script>
  <script>
    var options = {
      key: "${RAZORPAY_KEY_ID}",
      amount: "${params.amount}",
      currency: "INR",
      order_id: "${params.orderId}",
      name: "VaNi",
      description: "${params.planName.replace(/"/g, '\\"')}",
      prefill: {
        email: "${params.userEmail.replace(/"/g, '\\"')}",
        name: "${params.userName.replace(/"/g, '\\"')}"
      },
      theme: { color: "#2563EB" },
      handler: function(response) {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: "success",
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature
        }));
      },
      modal: {
        ondismiss: function() {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: "dismissed" }));
        },
        escape: false,
        confirm_close: true
      }
    };

    var rzp = new Razorpay(options);
    rzp.on("payment.failed", function(response) {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: "failed",
        error_code: response.error.code,
        error_description: response.error.description
      }));
    });
    rzp.open();
  <\/script>
</body>
</html>`;
}

export default function RazorpayCheckoutModal({ visible, params, onSuccess, onFailure, onDismiss }: Props) {
  const webviewRef = useRef<WebView>(null);

  const handleMessage = useCallback((event: { nativeEvent: { data: string } }) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'success') {
        onSuccess({
          paymentId: data.razorpay_payment_id,
          orderId: data.razorpay_order_id,
          signature: data.razorpay_signature,
        });
      } else if (data.type === 'failed') {
        onFailure({
          errorCode: data.error_code || 'UNKNOWN',
          errorDescription: data.error_description || 'Payment failed. Please try again.',
        });
      } else if (data.type === 'dismissed') {
        onDismiss();
      }
    } catch {
      // ignore malformed messages
    }
  }, [onSuccess, onFailure, onDismiss]);

  if (!params) return null;

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onDismiss}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onDismiss} style={styles.closeBtn}>
            <Text style={styles.closeTxt}>Cancel</Text>
          </TouchableOpacity>
        </View>
        <WebView
          ref={webviewRef}
          source={{ html: buildCheckoutHtml(params) }}
          originWhitelist={['*']}
          javaScriptEnabled
          domStorageEnabled
          onMessage={handleMessage}
          startInLoadingState
          renderLoading={() => (
            <ActivityIndicator style={StyleSheet.absoluteFill} size="large" color="#2563EB" />
          )}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fdfcf0' },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 48,
    paddingHorizontal: 16,
    paddingBottom: 8,
    backgroundColor: '#fdfcf0',
  },
  closeBtn: { padding: 8 },
  closeTxt: { fontSize: 16, color: '#2563EB', fontWeight: '600' },
});
