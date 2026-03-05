-- ============================================================
-- Fix: amount_paid and gst_amount were stored in paise (19900).
-- Convert to rupees (199) for readability.
-- Also ensure amount_paid excludes GST.
-- ============================================================

-- Step 1: For rows where amount_paid incorrectly included GST, fix that first
UPDATE med_subscriptions
SET amount_paid = amount_paid - gst_amount
WHERE payment_status = 'paid'
  AND gst_amount > 0
  AND amount_paid > gst_amount
  AND amount_paid > 1000;  -- only paise-scale values (> ₹10)

-- Step 2: Convert paise to rupees (divide by 100)
UPDATE med_subscriptions
SET amount_paid = amount_paid / 100,
    gst_amount  = gst_amount / 100,
    updated_at  = now()
WHERE amount_paid >= 100;  -- still in paise if >= 100 (i.e. >= ₹1)
