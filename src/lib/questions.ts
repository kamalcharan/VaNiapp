import { supabase } from './supabase';
import type { QuestionV2, QuestionType, Difficulty, Option, EliminationHint } from '../types';
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

interface DbTopic {
  name: string;
  name_te: string | null;
}

interface DbQuestion {
  id: string;
  subject_id: string;
  chapter_id: string;
  topic_id: string | null;
  question_type: string;
  difficulty: string;
  question_text: string;
  question_text_te: string | null;
  explanation: string | null;
  explanation_te: string | null;
  correct_answer: string;
  payload: Record<string, unknown> | null;
  med_question_options: DbOption[];
  med_elimination_hints: DbEliminationHint[];
  med_topics: DbTopic | null;
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
        `id, subject_id, chapter_id, topic_id, question_type, difficulty,
         question_text, question_text_te, explanation, explanation_te,
         correct_answer, payload,
         med_question_options (option_key, option_text, option_text_te, is_correct, sort_order),
         med_elimination_hints (option_key, hint_text, hint_text_te, misconception, misconception_te),
         med_topics!topic_id (name, name_te)`,
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

  const raw = (row.payload ?? {}) as Record<string, unknown>;
  const questionId = (raw.question_id as string) || row.id;

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

  const payload = buildPayload(row, options, correctOptionId);

  // Clean display text — strip embedded structured data that the component renders
  let displayText = row.question_text;
  if (row.question_type === 'match-the-following') {
    displayText = displayText.replace(/\n*column\s*(?:i|I|1|a|A)\s*[:\-][\s\S]*/i, '').trim();
    // Remove trailing ":" if leftover
    displayText = displayText.replace(/:\s*$/, '').trim();
  } else if (row.question_type === 'assertion-reasoning') {
    displayText = displayText.replace(/\n*assertion\s*(?:\(A\))?\s*[:\-][\s\S]*/i, '').trim();
    displayText = displayText.replace(/:\s*$/, '').trim();
    if (!displayText) displayText = 'Read the assertion and reason below and choose the correct option.';
  }

  return {
    id: questionId,
    type: row.question_type as QuestionType,
    chapterId: row.chapter_id,
    subjectId: row.subject_id as QuestionV2['subjectId'],
    difficulty: row.difficulty as Difficulty,
    topicId: row.topic_id || (raw.topic as string) || undefined,
    topicName: row.med_topics?.name || (raw.topic as string) || undefined,
    topicNameTe: row.med_topics?.name_te || undefined,
    text: displayText,
    textTe: row.question_text_te || '',
    explanation: row.explanation || '',
    explanationTe: row.explanation_te || '',
    eliminationTechnique: eliminationText,
    eliminationTechniqueTe: eliminationTextTe,
    eliminationHints,
    payload,
  };
}

// ── Build type-specific payload ──────────────────────────────
// Extracts structured data from DB payload JSON first, then falls
// back to parsing question_text (the bulk-import only stores metadata
// in payload, so the actual column/assertion data lives in question_text).

function buildPayload(
  row: DbQuestion,
  options: Option[],
  correctOptionId: string,
): QuestionV2['payload'] {
  const raw = (row.payload ?? {}) as Record<string, unknown>;
  const text = row.question_text || '';

  switch (row.question_type) {
    case 'assertion-reasoning': {
      // Try payload JSON first, fall back to parsing question_text
      let assertion = (raw.assertion as string) || '';
      let reason = (raw.reason as string) || '';
      if (!assertion || !reason) {
        const parsed = parseAssertionReason(text);
        assertion = assertion || parsed.assertion;
        reason = reason || parsed.reason;
      }
      return {
        type: 'assertion-reasoning',
        assertion,
        assertionTe: (raw.assertion_te as string) || '',
        reason,
        reasonTe: (raw.reason_te as string) || '',
        options,
        correctOptionId,
      };
    }

    case 'match-the-following': {
      // Try payload JSON first, fall back to parsing question_text
      let colA = parseColumnItemsFromJson(raw.column_a ?? raw.columnA);
      let colB = parseColumnItemsFromJson(raw.column_b ?? raw.columnB);
      let mapping = (raw.correct_mapping ?? raw.correctMapping) as Record<string, string> | undefined;

      if (colA.length === 0 || colB.length === 0) {
        const parsed = parseMatchColumns(text);
        colA = colA.length > 0 ? colA : parsed.columnA;
        colB = colB.length > 0 ? colB : parsed.columnB;
      }

      // Build correctMapping from the correct option text if not in payload
      if (!mapping || Object.keys(mapping).length === 0) {
        const correctOpt = options.find((o) => o.id === correctOptionId);
        if (correctOpt) {
          mapping = parseOptionPairs(correctOpt.text);
        }
      }

      // If we still have column data, return match-the-following
      if (colA.length > 0 && colB.length > 0) {
        return {
          type: 'match-the-following',
          columnA: colA,
          columnB: colB,
          correctMapping: mapping || {},
          options,
          correctOptionId,
        };
      }
      // Fall back to MCQ if parsing failed
      return { type: 'mcq', options, correctOptionId };
    }

    case 'true-false':
      return {
        type: 'true-false',
        statement: (raw.statement as string) || text,
        statementTe: (raw.statement_te as string) || '',
        correctAnswer: raw.correct_answer === true || raw.correct_answer === 'true',
      };

    case 'fill-in-blanks':
      return {
        type: 'fill-in-blanks',
        textWithBlanks: (raw.text_with_blanks as string) || text,
        textWithBlanksTe: (raw.text_with_blanks_te as string) || '',
        options,
        correctOptionId,
      };

    case 'scenario-based':
      return {
        type: 'scenario-based',
        scenario: (raw.scenario as string) || text,
        scenarioTe: (raw.scenario_te as string) || '',
        options,
        correctOptionId,
      };

    case 'diagram-based':
      return {
        type: 'diagram-based',
        imageUri: (raw.image_uri as string) || '',
        imageAlt: (raw.image_alt as string) || '',
        options,
        correctOptionId,
      };

    case 'logical-sequence':
      return {
        type: 'logical-sequence',
        items: parseColumnItemsFromJson(raw.items),
        correctOrder: Array.isArray(raw.correct_order) ? raw.correct_order as string[] : [],
        options,
        correctOptionId,
      };

    default:
      return { type: 'mcq', options, correctOptionId };
  }
}

// ── Text parsers ─────────────────────────────────────────────

/** Parse array of column/sequence items from DB payload JSON */
function parseColumnItemsFromJson(data: unknown): { id: string; text: string; textTe: string }[] {
  if (!Array.isArray(data)) return [];
  return data.map((item: Record<string, unknown>) => ({
    id: String(item.id ?? ''),
    text: String(item.text ?? ''),
    textTe: String(item.text_te ?? item.textTe ?? ''),
  }));
}

/**
 * Parse match-the-following columns from question_text.
 * Handles formats like:
 *   Column I:\n(P) Bulliform cells\n(Q) Palisade...\nColumn II:\n(i) Bean-shaped...\n(ii) Large...
 *   Column A:\n1. Item\n2. Item\nColumn B:\n(a) Item\n(b) Item
 */
function parseMatchColumns(text: string): {
  columnA: { id: string; text: string; textTe: string }[];
  columnB: { id: string; text: string; textTe: string }[];
} {
  const columnA: { id: string; text: string; textTe: string }[] = [];
  const columnB: { id: string; text: string; textTe: string }[] = [];

  // Split into Column I / Column II sections
  // Match headers like "Column I:", "Column A:", "Column 1:", "List I:", "List-I"
  const colSplit = text.split(/column\s*(?:ii|II|2|b|B)\s*[:\-]/i);
  if (colSplit.length < 2) return { columnA, columnB };

  const col1Text = colSplit[0];
  const col2Text = colSplit[1];

  // Remove the "Column I:" header from col1Text
  const col1Body = col1Text.replace(/.*column\s*(?:i|I|1|a|A)\s*[:\-]/i, '');

  // Extract labeled items: (P), (Q), (1), (a), (i), (ii) etc.
  const itemRegex = /\(([A-Za-z0-9]+(?:i{1,3}v?|v)?)\)\s*([^\n(]+)/g;

  let match;
  // eslint-disable-next-line no-cond-assign
  while ((match = itemRegex.exec(col1Body)) !== null) {
    columnA.push({ id: match[1].trim(), text: match[2].trim(), textTe: '' });
  }

  itemRegex.lastIndex = 0;
  // eslint-disable-next-line no-cond-assign
  while ((match = itemRegex.exec(col2Text)) !== null) {
    columnB.push({ id: match[1].trim(), text: match[2].trim(), textTe: '' });
  }

  return { columnA, columnB };
}

/**
 * Parse option text like "P-ii, Q-iii, R-iv, S-i" or "1-b, 2-c, 3-a"
 * into a mapping { P: 'ii', Q: 'iii', R: 'iv', S: 'i' }
 */
function parseOptionPairs(text: string): Record<string, string> {
  const mapping: Record<string, string> = {};
  // Match patterns: P-ii, Q-iii or 1-b, 2-c (with various separators)
  const pairs = text.split(/[,;]\s*/);
  for (const pair of pairs) {
    const m = pair.trim().match(/^([A-Za-z0-9]+)\s*[-–→]\s*\(?([A-Za-z0-9]+(?:i{1,3}v?|v)?)\)?$/);
    if (m) mapping[m[1].trim()] = m[2].trim();
  }
  return mapping;
}

/**
 * Parse assertion and reason from question_text.
 * Handles: "Assertion (A): text\nReason (R): text"
 */
function parseAssertionReason(text: string): { assertion: string; reason: string } {
  let assertion = '';
  let reason = '';

  // Match "Assertion (A):" or "Assertion:" followed by text
  const assertMatch = text.match(/assertion\s*(?:\(A\))?\s*[:\-]\s*([\s\S]*?)(?=\nreason\s*(?:\(R\))?\s*[:\-]|$)/i);
  if (assertMatch) assertion = assertMatch[1].trim();

  // Match "Reason (R):" followed by text
  const reasonMatch = text.match(/reason\s*(?:\(R\))?\s*[:\-]\s*([\s\S]*?)(?=\n\s*(?:select|choose|$))/i);
  if (reasonMatch) reason = reasonMatch[1].trim();
  // If no "select" terminator, take everything after "Reason (R):"
  if (!reason) {
    const fallback = text.match(/reason\s*(?:\(R\))?\s*[:\-]\s*([\s\S]*)/i);
    if (fallback) reason = fallback[1].trim();
  }

  return { assertion, reason };
}
