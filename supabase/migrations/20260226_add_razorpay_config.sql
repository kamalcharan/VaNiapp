-- ════════════════════════════════════════════════════════════════════════════
-- Razorpay + Pricing config in med_app_config
-- ════════════════════════════════════════════════════════════════════════════
--
-- Moves all hardcoded Razorpay keys, plan definitions, coupons, and GST
-- into the DB so they can be changed from the Supabase dashboard without
-- shipping an app update.
--
-- To switch from test to live:
--   UPDATE med_app_config
--   SET value = jsonb_set(value, '{razorpay_key_id}', '"rzp_live_xxx"')
--   WHERE key = 'razorpay_config';
--
-- To update a plan price:
--   UPDATE med_app_config
--   SET value = jsonb_set(value, '{plans,crunch,basePrice}', '599')
--   WHERE key = 'razorpay_config';
-- ════════════════════════════════════════════════════════════════════════════

INSERT INTO med_app_config (key, value, description) VALUES
(
  'razorpay_config',
  '{
    "razorpay_key_id": "rzp_test_SBip7OyaGlp8TF",
    "gst_rate": 0.18,
    "plans": {
      "crunch": {
        "id": "crunch",
        "name": "Crunch Mode",
        "description": "Practice exams only — no stages",
        "basePrice": 499,
        "period": "one-time",
        "razorpayPlanId": "plan_SKeuAORlFlY9nv"
      },
      "monthly": {
        "id": "monthly",
        "name": "Monthly",
        "description": "Full access with stage-wise progression",
        "basePrice": 199,
        "period": "/month",
        "razorpayPlanId": "plan_SKeufdrgIwFRH7"
      },
      "yearly": {
        "id": "yearly",
        "name": "Yearly",
        "description": "Full access — best value",
        "basePrice": 1399,
        "period": "/year",
        "razorpayPlanId": "plan_SKevPIDmnF6tCw",
        "badge": "BEST VALUE"
      }
    },
    "coupons": [
      { "code": "VaNiGO",    "discountPercent": 25,  "label": "25% off" },
      { "code": "VaNiGem",   "discountPercent": 10,  "label": "10% off" },
      { "code": "VaNiValue", "discountPercent": 100, "label": "Free access" }
    ]
  }',
  'Razorpay keys, pricing plans, coupon codes, and GST rate. Update razorpay_key_id to rzp_live_xxx for production.'
)
ON CONFLICT (key) DO NOTHING;
