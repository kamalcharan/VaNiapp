-- ============================================================
-- Fix: amount_paid was storing base + GST combined.
-- Correct it to store base only (excl. GST).
-- gst_amount already has the correct GST value.
-- ============================================================

-- For paid rows: amount_paid currently = base + GST, so subtract gst_amount
UPDATE med_subscriptions
SET amount_paid = amount_paid - gst_amount,
    updated_at  = now()
WHERE payment_status = 'paid'
  AND gst_amount > 0
  AND amount_paid > gst_amount;
