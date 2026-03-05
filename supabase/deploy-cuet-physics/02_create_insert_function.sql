-- ==========================================================================
-- MIGRATION 2: Create helper function for batch question insertion
-- Run this SECOND. This function inserts questions + options + hints atomically.
-- ==========================================================================

CREATE OR REPLACE FUNCTION insert_batch_questions(questions jsonb, batch_source text)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  q jsonb;
  new_id uuid;
  opt jsonb;
  hint jsonb;
  idx int;
  total int := 0;
BEGIN
  FOR q IN SELECT * FROM jsonb_array_elements(questions)
  LOOP
    -- Insert the question
    INSERT INTO med_questions (
      subject_id, chapter_id, topic_id, exam_ids, question_type, difficulty,
      strength_required, question_text, explanation, payload,
      image_url, image_alt, correct_answer, concept_tags,
      status, is_active, source
    ) VALUES (
      'cuet-physics',
      q->>'chapter_id',
      q->>'topic_id',
      ARRAY(SELECT jsonb_array_elements_text(q->'exam_ids')),
      q->>'question_type',
      q->>'difficulty',
      'just-started',
      q->>'question_text',
      q->>'explanation',
      q->'payload',
      NULL,
      q->>'image_alt',
      q->>'correct_answer',
      ARRAY(SELECT jsonb_array_elements_text(q->'concept_tags')),
      'active',
      true,
      batch_source
    )
    RETURNING id INTO new_id;

    -- Insert options from payload
    idx := 0;
    FOR opt IN SELECT * FROM jsonb_array_elements(q->'payload'->'options')
    LOOP
      INSERT INTO med_question_options (question_id, option_key, option_text, is_correct, sort_order)
      VALUES (new_id, opt->>'key', opt->>'text', (opt->>'is_correct')::boolean, idx);
      idx := idx + 1;
    END LOOP;

    -- Insert elimination hints from payload
    IF q->'payload'->'elimination_hints' IS NOT NULL THEN
      FOR hint IN SELECT * FROM jsonb_array_elements(q->'payload'->'elimination_hints')
      LOOP
        IF (hint->>'hint') IS NOT NULL AND (hint->>'hint') != '' THEN
          INSERT INTO med_elimination_hints (question_id, option_key, hint_text, misconception)
          VALUES (new_id, hint->>'option_key', hint->>'hint', hint->>'misconception');
        END IF;
      END LOOP;
    END IF;

    total := total + 1;
  END LOOP;

  RETURN total;
END;
$$;
