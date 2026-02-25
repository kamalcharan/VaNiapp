import { supabase } from './supabase';
import type { QuestionV2, QuestionType, QuestionPayload, Difficulty, Option, EliminationHint } from '../types';
import { resolveLegacyChapterId } from './questionAdapter';

// ── Types for DB rows ────────────────────────────────────────

interface DbOption {
  option_key: string;
  option_text: string;
  option_text_te: string | null;
  is_correct: boolean;
  sort_order: number;
}

interface DbEliminationHint {
  option_key: string;
  hint_text: string;
  hint_text_te: string | null;
  misconception: string | null;
  misconception_te: string | null;
}

interface DbQuestion {
  id: string;
  subject_id: string;
  chapter_id: string;
  question_type: string;
  difficulty: string;
  question_text: string;
  question_text_te: string | null;
  explanation: string | null;
  explanation_te: string | null;
  correct_answer: string;
  payload: Record<string, unknown> | null;
  image_url: string | null;
  image_alt: string | null;
  med_question_options: DbOption[];
  med_elimination_hints: DbEliminationHint[];
}

// ── Result type ──────────────────────────────────────────────

export type FetchQuestionsResult =
  | { ok: true; questions: QuestionV2[] }
  | { ok: false; error: 'no-connection' | 'no-questions' | 'not-configured' };

// ── In-memory cache ──────────────────────────────────────────

const cache = new Map<string, QuestionV2[]>();

// ── Public API ───────────────────────────────────────────────

/**
 * Fetch questions for a chapter from Supabase.
 * Returns a result object with questions or a typed error.
 * No silent local fallback — errors surface to the UI.
 */
export async function fetchQuestionsByChapter(
  chapterId: string,
): Promise<FetchQuestionsResult> {
  const resolvedId = resolveLegacyChapterId(chapterId);

  // Check cache first
  if (cache.has(resolvedId)) {
    return { ok: true, questions: cache.get(resolvedId)! };
  }

  if (!supabase) {
    return { ok: false, error: 'not-configured' };
  }

  try {
    const { data, error } = await supabase
      .from('med_questions')
      .select(
        `id, subject_id, chapter_id, question_type, difficulty,
         question_text, question_text_te, explanation, explanation_te,
         correct_answer, payload, image_url, image_alt,
         med_question_options (option_key, option_text, option_text_te, is_correct, sort_order),
         med_elimination_hints (option_key, hint_text, hint_text_te, misconception, misconception_te)`,
      )
      .eq('chapter_id', resolvedId)
      .eq('status', 'active')
      .order('created_at');

    if (error) {
      console.warn(`[questions] Supabase error for ${resolvedId}:`, error.message);
      return { ok: false, error: 'no-connection' };
    }

    if (!data || data.length === 0) {
      return { ok: false, error: 'no-questions' };
    }

    const questions = (data as unknown as DbQuestion[]).map(dbToV2);
    cache.set(resolvedId, questions);
    return { ok: true, questions };
  } catch (err) {
    console.warn(`[questions] Fetch failed for ${resolvedId}:`, err);
    return { ok: false, error: 'no-connection' };
  }
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
    textTe: o.option_text_te || '',
  }));

  const correctOption = dbOptions.find((o) => o.is_correct);
  const correctOptionId = correctOption?.option_key || row.correct_answer;

  const questionId =
    (row.payload as Record<string, unknown>)?.question_id as string || row.id;

  // Map elimination hints from DB
  const eliminationHints: EliminationHint[] = (row.med_elimination_hints || []).map((h) => ({
    optionKey: h.option_key,
    hint: h.hint_text || '',
    hintTe: h.hint_text_te || '',
    misconception: h.misconception || '',
    misconceptionTe: h.misconception_te || '',
  }));

  // Build a combined elimination technique string from hints
  const eliminationText = eliminationHints
    .map((h) => `Option ${h.optionKey}: ${h.hint}`)
    .join('\n');

  const eliminationTextTe = eliminationHints
    .filter((h) => h.hintTe)
    .map((h) => `Option ${h.optionKey}: ${h.hintTe}`)
    .join('\n');

  return {
    id: questionId,
    type: row.question_type as QuestionType,
    chapterId: row.chapter_id,
    subjectId: row.subject_id as QuestionV2['subjectId'],
    difficulty: row.difficulty as Difficulty,
    text: row.question_text,
    textTe: row.question_text_te || '',
    explanation: row.explanation || '',
    explanationTe: row.explanation_te || '',
    eliminationTechnique: eliminationText,
    eliminationTechniqueTe: eliminationTextTe,
    eliminationHints,
    payload: buildPayload(row, options, correctOptionId),
  };
}

/**
 * Build the type-specific payload from DB row.
 * If the row has a stored payload with a matching type, use its fields.
 * Otherwise, fall back to constructing from options.
 */
function buildPayload(
  row: DbQuestion,
  options: Option[],
  correctOptionId: string,
): QuestionPayload {
  const p = (row.payload || {}) as Record<string, unknown>;
  const qType = row.question_type;

  switch (qType) {
    case 'diagram-based':
      return {
        type: 'diagram-based',
        imageUri: row.image_url || (p.imageUri as string) || '',
        imageAlt: row.image_alt || (p.imageAlt as string) || '',
        options,
        correctOptionId,
      };

    case 'true-false':
      return {
        type: 'true-false',
        statement: (p.statement as string) || row.question_text,
        statementTe: (p.statementTe as string) || row.question_text_te || '',
        correctAnswer: p.correctAnswer === true || row.correct_answer === 'true',
      };

    case 'assertion-reasoning':
      return {
        type: 'assertion-reasoning',
        assertion: (p.assertion as string) || '',
        assertionTe: (p.assertionTe as string) || '',
        reason: (p.reason as string) || '',
        reasonTe: (p.reasonTe as string) || '',
        options,
        correctOptionId,
      };

    case 'match-the-following':
      return {
        type: 'match-the-following',
        columnA: (p.columnA as { id: string; text: string; textTe: string }[]) || [],
        columnB: (p.columnB as { id: string; text: string; textTe: string }[]) || [],
        correctMapping: (p.correctMapping as Record<string, string>) || {},
        options,
        correctOptionId,
      };

    case 'logical-sequence':
      return {
        type: 'logical-sequence',
        items: (p.items as { id: string; text: string; textTe: string }[]) || [],
        correctOrder: (p.correctOrder as string[]) || [],
        options,
        correctOptionId,
      };

    case 'fill-in-blanks':
      return {
        type: 'fill-in-blanks',
        textWithBlanks: (p.textWithBlanks as string) || '',
        textWithBlanksTe: (p.textWithBlanksTe as string) || '',
        options,
        correctOptionId,
      };

    case 'scenario-based':
      return {
        type: 'scenario-based',
        scenario: (p.scenario as string) || '',
        scenarioTe: (p.scenarioTe as string) || '',
        options,
        correctOptionId,
      };

    case 'mcq':
    default:
      return {
        type: 'mcq',
        options,
        correctOptionId,
      };
  }
}
