import { supabase } from './supabase';
import type { QuestionV2, QuestionType, Difficulty, Option } from '../types';

// ── Types for DB rows ────────────────────────────────────────

interface DbOption {
  option_key: string;
  option_text: string;
  is_correct: boolean;
  sort_order: number;
}

interface DbQuestion {
  id: string;
  subject_id: string;
  chapter_id: string;
  question_type: string;
  difficulty: string;
  question_text: string;
  explanation: string | null;
  correct_answer: string;
  payload: Record<string, unknown> | null;
  med_question_options: DbOption[];
}

// ── In-memory cache ──────────────────────────────────────────

const cache = new Map<string, QuestionV2[]>();

// ── Public API ───────────────────────────────────────────────

/**
 * Fetch questions for a chapter from Supabase.
 * Returns QuestionV2[] ready for the quiz screen UI.
 */
export async function fetchQuestionsByChapter(
  chapterId: string,
): Promise<QuestionV2[]> {
  // Check cache first
  if (cache.has(chapterId)) return cache.get(chapterId)!;

  if (!supabase) return [];

  const { data, error } = await supabase
    .from('med_questions')
    .select(
      `id, subject_id, chapter_id, question_type, difficulty,
       question_text, explanation, correct_answer, payload,
       med_question_options (option_key, option_text, is_correct, sort_order)`,
    )
    .eq('chapter_id', chapterId)
    .eq('is_active', true)
    .eq('status', 'active')
    .order('created_at');

  if (error || !data || data.length === 0) return [];

  const questions = (data as unknown as DbQuestion[]).map(dbToV2);
  cache.set(chapterId, questions);
  return questions;
}

/** Clear cached questions (useful after imports). */
export function clearQuestionsCache(): void {
  cache.clear();
}

// ── Transform DB row → QuestionV2 ────────────────────────────

function dbToV2(row: DbQuestion): QuestionV2 {
  const dbOptions = (row.med_question_options || []).sort(
    (a, b) => a.sort_order - b.sort_order,
  );

  const options: Option[] = dbOptions.map((o) => ({
    id: o.option_key,
    text: o.option_text,
    textTe: '',
  }));

  const correctOption = dbOptions.find((o) => o.is_correct);
  const correctOptionId = correctOption?.option_key || row.correct_answer;

  const questionId =
    (row.payload as Record<string, unknown>)?.question_id as string || row.id;

  return {
    id: questionId,
    type: row.question_type as QuestionType,
    chapterId: row.chapter_id,
    subjectId: row.subject_id as QuestionV2['subjectId'],
    difficulty: row.difficulty as Difficulty,
    text: row.question_text,
    textTe: '',
    explanation: row.explanation || '',
    explanationTe: '',
    eliminationTechnique: '',
    eliminationTechniqueTe: '',
    // Map all DB questions as MCQ payload since all types have A/B/C/D options
    payload: {
      type: 'mcq',
      options,
      correctOptionId,
    },
  };
}
