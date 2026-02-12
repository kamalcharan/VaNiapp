/**
 * Fetch questions from Supabase and convert to QuestionV2 format.
 * Replaces the local-data approach for chapter-based practice.
 */
import { supabase } from './supabase';
import { QuestionV2, QuestionPayload, QuestionType, Difficulty, SubjectId } from '../types';

// ── DB row types ────────────────────────────────────────────

interface DbQuestion {
  id: string;
  subject_id: string;
  chapter_id: string;
  question_type: string;
  difficulty: string;
  question_text: string;
  question_text_te: string | null;
  explanation: string;
  explanation_te: string | null;
  payload: Record<string, unknown> | null;
  correct_answer: string | null;
  concept_tags: string[] | null;
}

interface DbOption {
  id: string;
  question_id: string;
  option_key: string;
  option_text: string;
  option_text_te: string | null;
  is_correct: boolean;
  sort_order: number;
}

interface DbHint {
  question_id: string;
  option_key: string;
  hint_text: string;
  hint_text_te: string | null;
  misconception: string | null;
  misconception_te: string | null;
}

// ── Public API ──────────────────────────────────────────────

/**
 * Fetch questions for a chapter from Supabase and convert to QuestionV2[].
 * Returns empty array if Supabase is unavailable or no questions found.
 */
export async function fetchChapterQuestions(
  chapterId: string,
  unlockedTypes?: QuestionType[],
): Promise<QuestionV2[]> {
  if (!supabase) return [];

  // 1. Fetch questions
  const { data: questions, error: qErr } = await supabase
    .from('med_questions')
    .select('id, subject_id, chapter_id, question_type, difficulty, question_text, question_text_te, explanation, explanation_te, payload, correct_answer, concept_tags')
    .eq('chapter_id', chapterId)
    .eq('is_active', true)
    .in('status', ['active', 'draft'])
    .order('created_at');

  if (qErr || !questions || questions.length === 0) return [];

  const questionIds = questions.map((q: DbQuestion) => q.id);

  // 2. Fetch options + hints in parallel
  const [optResult, hintResult] = await Promise.all([
    supabase
      .from('med_question_options')
      .select('id, question_id, option_key, option_text, option_text_te, is_correct, sort_order')
      .in('question_id', questionIds)
      .order('sort_order'),
    supabase
      .from('med_elimination_hints')
      .select('question_id, option_key, hint_text, hint_text_te, misconception, misconception_te')
      .in('question_id', questionIds),
  ]);

  const options: DbOption[] = optResult.data ?? [];
  const hints: DbHint[] = hintResult.data ?? [];

  // Group by question_id
  const optionsByQ = groupBy(options, 'question_id');
  const hintsByQ = groupBy(hints, 'question_id');

  // 3. Convert each DB row → QuestionV2
  const result: QuestionV2[] = [];
  for (const q of questions as DbQuestion[]) {
    const qOptions = (optionsByQ[q.id] || []).sort((a, b) => a.sort_order - b.sort_order);
    const qHints = hintsByQ[q.id] || [];

    const v2 = dbToQuestionV2(q, qOptions, qHints);
    if (v2) result.push(v2);
  }

  // 4. Filter by unlocked types if specified
  if (unlockedTypes && unlockedTypes.length > 0) {
    return result.filter((q) => unlockedTypes.includes(q.type));
  }

  return result;
}

// ── Conversion ──────────────────────────────────────────────

function dbToQuestionV2(
  q: DbQuestion,
  options: DbOption[],
  hints: DbHint[],
): QuestionV2 | null {
  const type = q.question_type as QuestionType;
  const payload = buildPayload(type, q, options);
  if (!payload) return null;

  // Build elimination technique text from hints
  const elimEn = hints.map((h) => h.hint_text).filter(Boolean).join(' ');
  const elimTe = hints.map((h) => h.hint_text_te || h.hint_text).filter(Boolean).join(' ');

  return {
    id: q.id,
    type,
    chapterId: q.chapter_id,
    subjectId: q.subject_id as SubjectId,
    difficulty: (q.difficulty || 'medium') as Difficulty,
    text: q.question_text,
    textTe: q.question_text_te || q.question_text,
    explanation: q.explanation || '',
    explanationTe: q.explanation_te || q.explanation || '',
    eliminationTechnique: elimEn,
    eliminationTechniqueTe: elimTe,
    payload,
  };
}

function buildPayload(
  type: QuestionType,
  q: DbQuestion,
  options: DbOption[],
): QuestionPayload | null {
  const v2Options = options.map((o) => ({
    id: o.option_key,
    text: o.option_text,
    textTe: o.option_text_te || o.option_text,
  }));

  const correctOpt = options.find((o) => o.is_correct);
  const correctOptionId = correctOpt?.option_key || q.correct_answer || 'A';

  switch (type) {
    case 'mcq':
      return { type: 'mcq', options: v2Options, correctOptionId };

    case 'assertion-reasoning':
      return {
        type: 'assertion-reasoning',
        assertion: (q.payload as any)?.assertion || '',
        assertionTe: (q.payload as any)?.assertion_te || (q.payload as any)?.assertion || '',
        reason: (q.payload as any)?.reason || '',
        reasonTe: (q.payload as any)?.reason_te || (q.payload as any)?.reason || '',
        options: v2Options,
        correctOptionId,
      };

    case 'match-the-following':
      return {
        type: 'match-the-following',
        columnA: (q.payload as any)?.column_a || [],
        columnB: (q.payload as any)?.column_b || [],
        correctMapping: (q.payload as any)?.correct_mapping || {},
        options: v2Options,
        correctOptionId,
      };

    case 'true-false':
      return {
        type: 'true-false',
        statement: (q.payload as any)?.statement || q.question_text,
        statementTe: (q.payload as any)?.statement_te || q.question_text_te || q.question_text,
        correctAnswer: q.correct_answer === 'true' || q.correct_answer === 'True',
      };

    case 'diagram-based':
      return {
        type: 'diagram-based',
        imageUri: (q.payload as any)?.image_url || '',
        imageAlt: (q.payload as any)?.image_alt || '',
        options: v2Options,
        correctOptionId,
      };

    case 'logical-sequence':
      return {
        type: 'logical-sequence',
        items: (q.payload as any)?.items || [],
        correctOrder: (q.payload as any)?.correct_order || [],
        options: v2Options,
        correctOptionId,
      };

    case 'fill-in-blanks':
      return {
        type: 'fill-in-blanks',
        textWithBlanks: (q.payload as any)?.text_with_blanks || q.question_text,
        textWithBlanksTe: (q.payload as any)?.text_with_blanks_te || q.question_text_te || q.question_text,
        options: v2Options,
        correctOptionId,
      };

    case 'scenario-based':
      return {
        type: 'scenario-based',
        scenario: (q.payload as any)?.scenario || '',
        scenarioTe: (q.payload as any)?.scenario_te || (q.payload as any)?.scenario || '',
        options: v2Options,
        correctOptionId,
      };

    default:
      return null;
  }
}

// ── Helpers ─────────────────────────────────────────────────

function groupBy<T extends Record<string, any>>(arr: T[], key: string): Record<string, T[]> {
  const map: Record<string, T[]> = {};
  for (const item of arr) {
    const k = item[key];
    if (!map[k]) map[k] = [];
    map[k].push(item);
  }
  return map;
}
