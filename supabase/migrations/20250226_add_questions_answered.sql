-- Track how many questions a user has answered (for trial enforcement)
ALTER TABLE med_profiles
  ADD COLUMN IF NOT EXISTS questions_answered integer NOT NULL DEFAULT 0;

-- Index not needed — only queried per-user by PK
