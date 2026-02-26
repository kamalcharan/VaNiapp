/**
 * Edge Function: checkout-page
 *
 * Serves an HTML page with Razorpay Standard Checkout.
 * On successful payment, redirects to vani://payment-success?... deep link.
 * On dismiss, redirects to vani://payment-cancelled.
 *
 * Query params:
 *   order_id  — Razorpay order ID
 *   amount    — amount in paise
 *   key       — Razorpay public key ID
 *   name      — plan name (display)
 *   email     — user email (prefill)
 *   prefill_name — user name (prefill)
 *
 * Deploy:
 *   supabase functions deploy checkout-page
 */

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

serve(async (req) => {
  const url = new URL(req.url);
  const orderId = url.searchParams.get('order_id') || '';
  const amount = url.searchParams.get('amount') || '0';
  const key = url.searchParams.get('key') || '';
  const planName = url.searchParams.get('name') || 'VaNi Subscription';
  const email = url.searchParams.get('email') || '';
  const prefillName = url.searchParams.get('prefill_name') || '';

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>VaNi Checkout</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
      background: #fdfcf0;
      color: #0F172A;
    }
    .loading {
      text-align: center;
    }
    .spinner {
      width: 40px; height: 40px;
      border: 3px solid #E5E7EB;
      border-top: 3px solid #2563EB;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
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
  <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
  <script>
    var options = {
      key: "${key}",
      amount: "${amount}",
      currency: "INR",
      order_id: "${orderId}",
      name: "VaNi",
      description: "${planName}",
      prefill: {
        email: "${email}",
        name: "${prefillName}"
      },
      theme: { color: "#2563EB" },
      handler: function(response) {
        window.location.href =
          "vani://payment-success" +
          "?razorpay_payment_id=" + encodeURIComponent(response.razorpay_payment_id) +
          "&razorpay_order_id=" + encodeURIComponent(response.razorpay_order_id) +
          "&razorpay_signature=" + encodeURIComponent(response.razorpay_signature);
      },
      modal: {
        ondismiss: function() {
          window.location.href = "vani://payment-cancelled";
        },
        escape: false,
        confirm_close: true
      }
    };

    var rzp = new Razorpay(options);
    rzp.on("payment.failed", function(response) {
      window.location.href =
        "vani://payment-failed" +
        "?error_code=" + encodeURIComponent(response.error.code) +
        "&error_description=" + encodeURIComponent(response.error.description);
    });
    rzp.open();
  </script>
</body>
</html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
});
