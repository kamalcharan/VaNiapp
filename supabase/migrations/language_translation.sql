-- ═══════════════════════════════════════════════════════════════════════════
-- Translation RPCs v2 — language-aware
-- Supports: te, hi (and future: ta, kn, ml, bn, mr, gu, pa, or, as)
--
-- Changes from v1:
--   get_untranslated_batch  → adds `lang` param, dynamic NULL check per lang
--   save_translations       → adds `lang` param, writes correct _xx columns
--   get_stale_translations  → NEW, same shape, uses corrected_at > last_translated_at
-- ═══════════════════════════════════════════════════════════════════════════


-- ───────────────────────────────────────────────────────────────────────────
-- 1. get_untranslated_batch
--    lang: 'te' | 'hi' | 'ta' | 'kn' | 'ml' | 'bn' | 'mr' | 'gu' | 'pa' | 'or' | 'as'
-- ───────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION get_untranslated_batch(
  batch_size  INT     DEFAULT 1,
  lang        TEXT    DEFAULT 'te'
)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
  result jsonb;
BEGIN
  -- Validate lang
  IF lang NOT IN ('te','hi','ta','kn','ml','bn','mr','gu','pa','or','as') THEN
    RAISE EXCEPTION 'Unsupported lang: %', lang;
  END IF;

  WITH batch_questions AS (
    SELECT id FROM med_questions
    WHERE is_active = true
      AND CASE lang
            WHEN 'te' THEN question_text_te IS NULL
            WHEN 'hi' THEN question_text_hi IS NULL
            WHEN 'ta' THEN question_text_ta IS NULL
            WHEN 'kn' THEN question_text_kn IS NULL
            WHEN 'ml' THEN question_text_ml IS NULL
            WHEN 'bn' THEN question_text_bn IS NULL
            WHEN 'mr' THEN question_text_mr IS NULL
            WHEN 'gu' THEN question_text_gu IS NULL
            WHEN 'pa' THEN question_text_pa IS NULL
            WHEN 'or' THEN question_text_or IS NULL
            WHEN 'as' THEN question_text_as IS NULL
          END
    ORDER BY chapter_id, id
    LIMIT batch_size
  ),
  q_data AS (
    SELECT
      q.id,
      q.question_text,
      q.explanation,
      q.chapter_id,
      q.question_type,
      json_agg(DISTINCT jsonb_build_object(
        'id',          o.id,
        'option_key',  o.option_key,
        'option_text', o.option_text
      )) FILTER (WHERE o.id IS NOT NULL) AS options,
      json_agg(DISTINCT jsonb_build_object(
        'id',            h.id,
        'option_key',    h.option_key,
        'hint_text',     h.hint_text,
        'misconception', h.misconception
      )) FILTER (WHERE h.id IS NOT NULL) AS hints
    FROM batch_questions bq
    JOIN med_questions q         ON q.id = bq.id
    LEFT JOIN med_question_options  o ON o.question_id = q.id
    LEFT JOIN med_elimination_hints h ON h.question_id = q.id
    GROUP BY q.id
  )
  SELECT jsonb_build_object(
    'remaining', (
      SELECT COUNT(*) FROM med_questions
      WHERE is_active = true
        AND CASE lang
              WHEN 'te' THEN question_text_te IS NULL
              WHEN 'hi' THEN question_text_hi IS NULL
              WHEN 'ta' THEN question_text_ta IS NULL
              WHEN 'kn' THEN question_text_kn IS NULL
              WHEN 'ml' THEN question_text_ml IS NULL
              WHEN 'bn' THEN question_text_bn IS NULL
              WHEN 'mr' THEN question_text_mr IS NULL
              WHEN 'gu' THEN question_text_gu IS NULL
              WHEN 'pa' THEN question_text_pa IS NULL
              WHEN 'or' THEN question_text_or IS NULL
              WHEN 'as' THEN question_text_as IS NULL
            END
    ),
    'questions', COALESCE(jsonb_agg(to_jsonb(q_data)), '[]'::jsonb)
  ) INTO result
  FROM q_data;

  RETURN result;
END;
$$;


-- ───────────────────────────────────────────────────────────────────────────
-- 2. get_stale_translations  (NEW)
--    Returns questions where corrected_at > last_translated_at for a given lang.
--    Same output shape as get_untranslated_batch so Python scripts are identical.
-- ───────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION get_stale_translations(
  batch_size  INT     DEFAULT 1,
  lang        TEXT    DEFAULT 'te'
)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
  result jsonb;
BEGIN
  IF lang NOT IN ('te','hi','ta','kn','ml','bn','mr','gu','pa','or','as') THEN
    RAISE EXCEPTION 'Unsupported lang: %', lang;
  END IF;

  WITH batch_questions AS (
    SELECT id FROM med_questions
    WHERE is_active       = true
      AND corrected_at    IS NOT NULL
      AND (
        last_translated_at IS NULL
        OR corrected_at > last_translated_at
      )
      -- Only re-translate if a translation already exists for this lang
      -- (no point reworking what was never translated in this lang)
      AND CASE lang
            WHEN 'te' THEN question_text_te IS NOT NULL
            WHEN 'hi' THEN question_text_hi IS NOT NULL
            WHEN 'ta' THEN question_text_ta IS NOT NULL
            WHEN 'kn' THEN question_text_kn IS NOT NULL
            WHEN 'ml' THEN question_text_ml IS NOT NULL
            WHEN 'bn' THEN question_text_bn IS NOT NULL
            WHEN 'mr' THEN question_text_mr IS NOT NULL
            WHEN 'gu' THEN question_text_gu IS NOT NULL
            WHEN 'pa' THEN question_text_pa IS NOT NULL
            WHEN 'or' THEN question_text_or IS NOT NULL
            WHEN 'as' THEN question_text_as IS NOT NULL
          END
    ORDER BY corrected_at ASC   -- oldest correction first
    LIMIT batch_size
  ),
  q_data AS (
    SELECT
      q.id,
      q.question_text,
      q.explanation,
      q.chapter_id,
      q.question_type,
      json_agg(DISTINCT jsonb_build_object(
        'id',          o.id,
        'option_key',  o.option_key,
        'option_text', o.option_text
      )) FILTER (WHERE o.id IS NOT NULL) AS options,
      json_agg(DISTINCT jsonb_build_object(
        'id',            h.id,
        'option_key',    h.option_key,
        'hint_text',     h.hint_text,
        'misconception', h.misconception
      )) FILTER (WHERE h.id IS NOT NULL) AS hints
    FROM batch_questions bq
    JOIN med_questions q         ON q.id = bq.id
    LEFT JOIN med_question_options  o ON o.question_id = q.id
    LEFT JOIN med_elimination_hints h ON h.question_id = q.id
    GROUP BY q.id
  )
  SELECT jsonb_build_object(
    'remaining', (
      SELECT COUNT(*) FROM med_questions
      WHERE is_active       = true
        AND corrected_at    IS NOT NULL
        AND (last_translated_at IS NULL OR corrected_at > last_translated_at)
        AND CASE lang
              WHEN 'te' THEN question_text_te IS NOT NULL
              WHEN 'hi' THEN question_text_hi IS NOT NULL
              WHEN 'ta' THEN question_text_ta IS NOT NULL
              WHEN 'kn' THEN question_text_kn IS NOT NULL
              WHEN 'ml' THEN question_text_ml IS NOT NULL
              WHEN 'bn' THEN question_text_bn IS NOT NULL
              WHEN 'mr' THEN question_text_mr IS NOT NULL
              WHEN 'gu' THEN question_text_gu IS NOT NULL
              WHEN 'pa' THEN question_text_pa IS NOT NULL
              WHEN 'or' THEN question_text_or IS NOT NULL
              WHEN 'as' THEN question_text_as IS NOT NULL
            END
    ),
    'questions', COALESCE(jsonb_agg(to_jsonb(q_data)), '[]'::jsonb)
  ) INTO result
  FROM q_data;

  RETURN result;
END;
$$;


-- ───────────────────────────────────────────────────────────────────────────
-- 3. save_translations
--    lang param routes writes to the correct _xx columns.
--    Also stamps last_translated_at = now() on every save.
-- ───────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION save_translations(
  translations  jsonb,
  lang          TEXT  DEFAULT 'te'
)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
  q        jsonb;
  opt      jsonb;
  hint     jsonb;
  q_count  int := 0;
  o_count  int := 0;
  h_count  int := 0;
BEGIN
  IF lang NOT IN ('te','hi','ta','kn','ml','bn','mr','gu','pa','or','as') THEN
    RAISE EXCEPTION 'Unsupported lang: %', lang;
  END IF;

  FOR q IN SELECT * FROM jsonb_array_elements(translations)
  LOOP
    -- ── med_questions ──────────────────────────────────────────────────────
    CASE lang
      WHEN 'te' THEN
        UPDATE med_questions SET
          question_text_te   = q->>'question_text_te',
          explanation_te     = q->>'explanation_te',
          last_translated_at = now(),
          updated_at         = now()
        WHERE id = (q->>'id')::uuid;
      WHEN 'hi' THEN
        UPDATE med_questions SET
          question_text_hi   = q->>'question_text_hi',
          explanation_hi     = q->>'explanation_hi',
          last_translated_at = now(),
          updated_at         = now()
        WHERE id = (q->>'id')::uuid;
      WHEN 'ta' THEN
        UPDATE med_questions SET
          question_text_ta   = q->>'question_text_ta',
          explanation_ta     = q->>'explanation_ta',
          last_translated_at = now(),
          updated_at         = now()
        WHERE id = (q->>'id')::uuid;
      WHEN 'kn' THEN
        UPDATE med_questions SET
          question_text_kn   = q->>'question_text_kn',
          explanation_kn     = q->>'explanation_kn',
          last_translated_at = now(),
          updated_at         = now()
        WHERE id = (q->>'id')::uuid;
      WHEN 'ml' THEN
        UPDATE med_questions SET
          question_text_ml   = q->>'question_text_ml',
          explanation_ml     = q->>'explanation_ml',
          last_translated_at = now(),
          updated_at         = now()
        WHERE id = (q->>'id')::uuid;
      WHEN 'bn' THEN
        UPDATE med_questions SET
          question_text_bn   = q->>'question_text_bn',
          explanation_bn     = q->>'explanation_bn',
          last_translated_at = now(),
          updated_at         = now()
        WHERE id = (q->>'id')::uuid;
      WHEN 'mr' THEN
        UPDATE med_questions SET
          question_text_mr   = q->>'question_text_mr',
          explanation_mr     = q->>'explanation_mr',
          last_translated_at = now(),
          updated_at         = now()
        WHERE id = (q->>'id')::uuid;
      WHEN 'gu' THEN
        UPDATE med_questions SET
          question_text_gu   = q->>'question_text_gu',
          explanation_gu     = q->>'explanation_gu',
          last_translated_at = now(),
          updated_at         = now()
        WHERE id = (q->>'id')::uuid;
      WHEN 'pa' THEN
        UPDATE med_questions SET
          question_text_pa   = q->>'question_text_pa',
          explanation_pa     = q->>'explanation_pa',
          last_translated_at = now(),
          updated_at         = now()
        WHERE id = (q->>'id')::uuid;
      WHEN 'or' THEN
        UPDATE med_questions SET
          question_text_or   = q->>'question_text_or',
          explanation_or     = q->>'explanation_or',
          last_translated_at = now(),
          updated_at         = now()
        WHERE id = (q->>'id')::uuid;
      WHEN 'as' THEN
        UPDATE med_questions SET
          question_text_as   = q->>'question_text_as',
          explanation_as     = q->>'explanation_as',
          last_translated_at = now(),
          updated_at         = now()
        WHERE id = (q->>'id')::uuid;
    END CASE;
    q_count := q_count + 1;

    -- ── med_question_options ───────────────────────────────────────────────
    IF q->'options' IS NOT NULL AND jsonb_typeof(q->'options') = 'array' THEN
      FOR opt IN SELECT * FROM jsonb_array_elements(q->'options')
      LOOP
        CASE lang
          WHEN 'te' THEN UPDATE med_question_options SET option_text_te = opt->>'option_text_te' WHERE id = (opt->>'id')::uuid;
          WHEN 'hi' THEN UPDATE med_question_options SET option_text_hi = opt->>'option_text_hi' WHERE id = (opt->>'id')::uuid;
          WHEN 'ta' THEN UPDATE med_question_options SET option_text_ta = opt->>'option_text_ta' WHERE id = (opt->>'id')::uuid;
          WHEN 'kn' THEN UPDATE med_question_options SET option_text_kn = opt->>'option_text_kn' WHERE id = (opt->>'id')::uuid;
          WHEN 'ml' THEN UPDATE med_question_options SET option_text_ml = opt->>'option_text_ml' WHERE id = (opt->>'id')::uuid;
          WHEN 'bn' THEN UPDATE med_question_options SET option_text_bn = opt->>'option_text_bn' WHERE id = (opt->>'id')::uuid;
          WHEN 'mr' THEN UPDATE med_question_options SET option_text_mr = opt->>'option_text_mr' WHERE id = (opt->>'id')::uuid;
          WHEN 'gu' THEN UPDATE med_question_options SET option_text_gu = opt->>'option_text_gu' WHERE id = (opt->>'id')::uuid;
          WHEN 'pa' THEN UPDATE med_question_options SET option_text_pa = opt->>'option_text_pa' WHERE id = (opt->>'id')::uuid;
          WHEN 'or' THEN UPDATE med_question_options SET option_text_or = opt->>'option_text_or' WHERE id = (opt->>'id')::uuid;
          WHEN 'as' THEN UPDATE med_question_options SET option_text_as = opt->>'option_text_as' WHERE id = (opt->>'id')::uuid;
        END CASE;
        o_count := o_count + 1;
      END LOOP;
    END IF;

    -- ── med_elimination_hints ──────────────────────────────────────────────
    IF q->'hints' IS NOT NULL AND jsonb_typeof(q->'hints') = 'array' THEN
      FOR hint IN SELECT * FROM jsonb_array_elements(q->'hints')
      LOOP
        CASE lang
          WHEN 'te' THEN UPDATE med_elimination_hints SET hint_text_te = hint->>'hint_text_te', misconception_te = hint->>'misconception_te' WHERE id = (hint->>'id')::uuid;
          WHEN 'hi' THEN UPDATE med_elimination_hints SET hint_text_hi = hint->>'hint_text_hi', misconception_hi = hint->>'misconception_hi' WHERE id = (hint->>'id')::uuid;
          WHEN 'ta' THEN UPDATE med_elimination_hints SET hint_text_ta = hint->>'hint_text_ta', misconception_ta = hint->>'misconception_ta' WHERE id = (hint->>'id')::uuid;
          WHEN 'kn' THEN UPDATE med_elimination_hints SET hint_text_kn = hint->>'hint_text_kn', misconception_kn = hint->>'misconception_kn' WHERE id = (hint->>'id')::uuid;
          WHEN 'ml' THEN UPDATE med_elimination_hints SET hint_text_ml = hint->>'hint_text_ml', misconception_ml = hint->>'misconception_ml' WHERE id = (hint->>'id')::uuid;
          WHEN 'bn' THEN UPDATE med_elimination_hints SET hint_text_bn = hint->>'hint_text_bn', misconception_bn = hint->>'misconception_bn' WHERE id = (hint->>'id')::uuid;
          WHEN 'mr' THEN UPDATE med_elimination_hints SET hint_text_mr = hint->>'hint_text_mr', misconception_mr = hint->>'misconception_mr' WHERE id = (hint->>'id')::uuid;
          WHEN 'gu' THEN UPDATE med_elimination_hints SET hint_text_gu = hint->>'hint_text_gu', misconception_gu = hint->>'misconception_gu' WHERE id = (hint->>'id')::uuid;
          WHEN 'pa' THEN UPDATE med_elimination_hints SET hint_text_pa = hint->>'hint_text_pa', misconception_pa = hint->>'misconception_pa' WHERE id = (hint->>'id')::uuid;
          WHEN 'or' THEN UPDATE med_elimination_hints SET hint_text_or = hint->>'hint_text_or', misconception_or = hint->>'misconception_or' WHERE id = (hint->>'id')::uuid;
          WHEN 'as' THEN UPDATE med_elimination_hints SET hint_text_as = hint->>'hint_text_as', misconception_as = hint->>'misconception_as' WHERE id = (hint->>'id')::uuid;
        END CASE;
        h_count := h_count + 1;
      END LOOP;
    END IF;

  END LOOP;

  RETURN jsonb_build_object(
    'questions_updated', q_count,
    'options_updated',   o_count,
    'hints_updated',     h_count
  );
END;
$$;