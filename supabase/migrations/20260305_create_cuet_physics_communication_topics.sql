-- ==========================================================================
-- Create topics for CUET Physics Chapter 10: Communication Systems
-- Chapter row already exists: cuet-phy-communication
-- ==========================================================================

INSERT INTO med_topics (id, chapter_id, name, is_active) VALUES
  ('cuet-phy-comm-elements',    'cuet-phy-communication', 'Elements of Communication System',           true),
  ('cuet-phy-comm-bandwidth',   'cuet-phy-communication', 'Bandwidth of Signals and Channels',          true),
  ('cuet-phy-comm-propagation', 'cuet-phy-communication', 'Propagation of EM Waves',                    true),
  ('cuet-phy-comm-modulation',  'cuet-phy-communication', 'Modulation and Amplitude Modulation',        true),
  ('cuet-phy-comm-detection',   'cuet-phy-communication', 'Detection and Demodulation',                 true)
ON CONFLICT (id) DO NOTHING;
