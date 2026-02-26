-- ============================================================
-- R10: Subscriptions & Coupon Redemptions
-- ============================================================

-- Subscriptions table — tracks every paid or coupon-activated subscription
CREATE TABLE IF NOT EXISTS med_subscriptions (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_type    text        NOT NULL CHECK (plan_type IN ('crunch', 'monthly', 'yearly')),
  status       text        NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
  payment_status text      NOT NULL CHECK (payment_status IN ('paid', 'coupon_free', 'pending')),

  -- Razorpay fields (null for coupon_free)
  razorpay_payment_id   text,
  razorpay_order_id     text,
  razorpay_signature    text,

  -- Coupon tracking
  coupon_code  text,

  -- Amounts in paise (100 paise = 1 INR)
  amount_paid  integer    NOT NULL DEFAULT 0,
  gst_amount   integer    NOT NULL DEFAULT 0,

  -- Validity
  starts_at    timestamptz NOT NULL DEFAULT now(),
  expires_at   timestamptz,          -- null for crunch (no expiry until exam)

  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE med_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own subscriptions"
  ON med_subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscriptions"
  ON med_subscriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_med_subscriptions_user   ON med_subscriptions(user_id);
CREATE INDEX idx_med_subscriptions_active ON med_subscriptions(user_id, status) WHERE status = 'active';

-- ── Coupon redemptions — basic tracking for analytics ────────
CREATE TABLE IF NOT EXISTS med_coupon_redemptions (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  coupon_code text        NOT NULL,
  plan_type   text        NOT NULL,
  redeemed_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE med_coupon_redemptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own redemptions"
  ON med_coupon_redemptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own redemptions"
  ON med_coupon_redemptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);
