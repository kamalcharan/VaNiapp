-- Add payment_method column to med_subscriptions
ALTER TABLE med_subscriptions
  ADD COLUMN IF NOT EXISTS payment_method text;  -- e.g. 'upi', 'card', 'netbanking', 'wallet'

-- Table to log failed payment attempts (for support debugging)
CREATE TABLE IF NOT EXISTS med_failed_payments (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_type       text        NOT NULL,
  error_code      text,
  error_description text,
  razorpay_order_id text,
  amount          integer     NOT NULL DEFAULT 0,  -- INR
  created_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE med_failed_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own failed payments"
  ON med_failed_payments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own failed payments"
  ON med_failed_payments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_med_failed_payments_user ON med_failed_payments(user_id);
