-- Fix business-studies questions that were inserted with wrong subject_id
-- bulk-import mapped 'business-studies' → 'cuet-business-studies' but DB has 'business-studies'

UPDATE med_questions
SET subject_id = 'business-studies'
WHERE subject_id = 'cuet-business-studies';
