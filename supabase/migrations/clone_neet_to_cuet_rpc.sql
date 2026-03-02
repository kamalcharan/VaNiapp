-- RPC: Clone NEET questions into CUET chapters
-- Usage:
--   DRY RUN (preview only):  SELECT * FROM clone_neet_questions_to_cuet(dry_run := true);
--   REAL RUN (insert data):  SELECT * FROM clone_neet_questions_to_cuet(dry_run := false);
--   RE-RUN SAFE: tracks cloned_from in payload, skips already-cloned questions
--
-- Covers 32 chapter mappings:
--   Physics (9):  phy-* → cuet-phy-*
--   Chemistry (10): chem-* → cuet-chem-*
--   Botany → Biology (7): bot-* → cuet-bio-*
--   Zoology → Biology (6): zoo-* → cuet-bio-*
--
-- NOT covered (CUET-only, no NEET source):
--   cuet-phy-communication (Communication Systems)

CREATE OR REPLACE FUNCTION clone_neet_questions_to_cuet(
  dry_run boolean DEFAULT true
)
RETURNS TABLE(
  src_chapter text,
  dst_chapter text,
  dst_subject text,
  questions_cloned bigint,
  options_cloned bigint,
  hints_cloned bigint
)
LANGUAGE plpgsql
AS $$
DECLARE
  m RECORD;
  q_src RECORD;
  new_q_id uuid;
  q_cnt bigint;
  o_cnt bigint;
  h_cnt bigint;
  o_inserted bigint;
  h_inserted bigint;
BEGIN
  -- 32-pair explicit mapping: NEET chapter → CUET chapter + target subject
  FOR m IN
    SELECT * FROM (VALUES
      -- Physics (9)
      ('phy-electrostatics',       'cuet-phy-electrostatics',       'cuet-physics'),
      ('phy-current-electricity',  'cuet-phy-current-electricity',  'cuet-physics'),
      ('phy-magnetic-effects',     'cuet-phy-magnetic-effects',     'cuet-physics'),
      ('phy-em-induction',         'cuet-phy-em-induction',         'cuet-physics'),
      ('phy-em-waves',             'cuet-phy-em-waves',             'cuet-physics'),
      ('phy-optics',               'cuet-phy-optics',               'cuet-physics'),
      ('phy-dual-nature',          'cuet-phy-dual-nature',          'cuet-physics'),
      ('phy-atoms-nuclei',         'cuet-phy-atoms-nuclei',         'cuet-physics'),
      ('phy-electronic-devices',   'cuet-phy-electronic-devices',   'cuet-physics'),
      -- Chemistry (10)
      ('chem-solutions',           'cuet-chem-solutions',           'cuet-chemistry'),
      ('chem-electrochemistry',    'cuet-chem-electrochemistry',    'cuet-chemistry'),
      ('chem-kinetics',            'cuet-chem-kinetics',            'cuet-chemistry'),
      ('chem-d-f-block',           'cuet-chem-d-f-block',           'cuet-chemistry'),
      ('chem-coordination',        'cuet-chem-coordination',        'cuet-chemistry'),
      ('chem-haloalkanes',         'cuet-chem-haloalkanes',         'cuet-chemistry'),
      ('chem-alcohols-ethers',     'cuet-chem-alcohols-phenols',    'cuet-chemistry'),
      ('chem-aldehydes-ketones',   'cuet-chem-aldehydes-ketones',   'cuet-chemistry'),
      ('chem-amines',              'cuet-chem-amines',              'cuet-chemistry'),
      ('chem-biomolecules',        'cuet-chem-biomolecules',        'cuet-chemistry'),
      -- Botany → CUET Biology (7)
      ('bot-sexual-reproduction',  'cuet-bio-sexual-repro-plants',  'biology'),
      ('bot-inheritance',          'cuet-bio-inheritance',          'biology'),
      ('bot-molecular-inheritance','cuet-bio-molecular-inheritance','biology'),
      ('bot-microbes-welfare',     'cuet-bio-microbes-welfare',     'biology'),
      ('bot-organisms-populations','cuet-bio-organisms-populations','biology'),
      ('bot-ecosystem',            'cuet-bio-ecosystem',            'biology'),
      ('bot-biodiversity',         'cuet-bio-biodiversity',         'biology'),
      -- Zoology → CUET Biology (6)
      ('zoo-human-reproduction',        'cuet-bio-human-repro',          'biology'),
      ('zoo-reproductive-health',       'cuet-bio-repro-health',         'biology'),
      ('zoo-evolution',                 'cuet-bio-evolution',            'biology'),
      ('zoo-human-health',              'cuet-bio-human-health',         'biology'),
      ('zoo-biotechnology-principles',  'cuet-bio-biotech-principles',   'biology'),
      ('zoo-biotechnology-applications','cuet-bio-biotech-applications', 'biology')
    ) AS t(neet_ch, cuet_ch, cuet_subj)
  LOOP
    q_cnt := 0;
    o_cnt := 0;
    h_cnt := 0;

    -- Loop through each NEET question not yet cloned to this CUET chapter
    FOR q_src IN
      SELECT q.*
      FROM med_questions q
      WHERE q.chapter_id = m.neet_ch
        AND q.status = 'active'
        AND NOT EXISTS (
          SELECT 1 FROM med_questions cq
          WHERE cq.chapter_id = m.cuet_ch
            AND cq.payload->>'cloned_from' = q.id::text
        )
    LOOP
      new_q_id := gen_random_uuid();

      IF NOT dry_run THEN
        INSERT INTO med_questions (
          id, subject_id, chapter_id, topic_id, exam_ids,
          question_type, difficulty, strength_required,
          question_text, explanation, question_text_te, explanation_te,
          payload, image_url, image_alt, correct_answer,
          source, concept_tags, status, is_active
        ) VALUES (
          new_q_id,
          m.cuet_subj,
          m.cuet_ch,
          q_src.topic_id,
          '{CUET}'::text[],
          q_src.question_type,
          q_src.difficulty,
          q_src.strength_required,
          q_src.question_text,
          q_src.explanation,
          q_src.question_text_te,
          q_src.explanation_te,
          q_src.payload || jsonb_build_object('cloned_from', q_src.id::text),
          q_src.image_url,
          q_src.image_alt,
          q_src.correct_answer,
          'cloned',
          q_src.concept_tags,
          'active',
          true
        );

        INSERT INTO med_question_options (question_id, option_key, option_text, option_text_te, is_correct, sort_order)
        SELECT new_q_id, option_key, option_text, option_text_te, is_correct, sort_order
        FROM med_question_options
        WHERE question_id = q_src.id;
        GET DIAGNOSTICS o_inserted = ROW_COUNT;
        o_cnt := o_cnt + o_inserted;

        INSERT INTO med_elimination_hints (question_id, option_key, hint_text, hint_text_te, misconception, misconception_te)
        SELECT new_q_id, option_key, hint_text, hint_text_te, misconception, misconception_te
        FROM med_elimination_hints
        WHERE question_id = q_src.id;
        GET DIAGNOSTICS h_inserted = ROW_COUNT;
        h_cnt := h_cnt + h_inserted;
      END IF;

      q_cnt := q_cnt + 1;
    END LOOP;

    src_chapter := m.neet_ch;
    dst_chapter := m.cuet_ch;
    dst_subject := m.cuet_subj;
    questions_cloned := q_cnt;
    options_cloned := o_cnt;
    hints_cloned := h_cnt;
    RETURN NEXT;
  END LOOP;
END;
$$;
