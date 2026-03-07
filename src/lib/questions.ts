import { supabase } from './supabase';
import type { QuestionV2, QuestionType, Difficulty, Option, EliminationHint, L } from '../types';
import { resolveLegacyChapterId } from './questionAdapter';

// ── Dynamic L builder ────────────────────────────────────────
// Builds an L (localized text map) from a DB row by detecting _xx suffixed columns.
// Adding a new language column (e.g. question_text_ta) is automatically picked up.

function l(row: Record<string, unknown>, baseCol: string): L {
  const en = String(row[baseCol] ?? '');
  const result: L = { en };
  const prefix = baseCol + '_';
  for (const key of Object.keys(row)) {
    if (key.startsWith(prefix) && key.length === prefix.length + 2 && row[key]) {
      result[key.slice(prefix.length)] = String(row[key]);
    }
  }
  return result;
}

// Build L from payload JSON fields (e.g. raw.assertion, raw.assertion_te, raw.assertion_ta)
function lPayload(raw: Record<string, unknown>, baseKey: string, fallback?: string): L {
  const en = String(raw[baseKey] ?? fallback ?? '');
  const result: L = { en };
  const prefix = baseKey + '_';
  for (const key of Object.keys(raw)) {
    if (key.startsWith(prefix) && key.length === prefix.length + 2 && raw[key]) {
      result[key.slice(prefix.length)] = String(raw[key]);
    }
  }
  return result;
}

// ── DB row types (untyped — we use Record<string, unknown> for dynamic column detection) ──

type DbRow = Record<string, unknown>;
type DbOptionRow = Record<string, unknown>;
type DbHintRow = Record<string, unknown>;
type DbTopicRow = Record<string, unknown>;

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
        `*, med_question_options (*), med_elimination_hints (*), med_topics!topic_id (*)`,
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

    // DEBUG: log raw Supabase response for the first question
    if (data.length > 0) {
      const sample = data[0] as Record<string, unknown>;
      console.log(`[questions DEBUG] chapter=${resolvedId}, count=${data.length}`);
      console.log(`[questions DEBUG] question_text="${String(sample.question_text || '').slice(0, 80)}"`);
      const opts = sample.med_question_options as Array<Record<string, unknown>> | undefined;
      if (opts && opts.length > 0) {
        console.log(`[questions DEBUG] option_text[0]="${String(opts[0]?.option_text || '').slice(0, 80)}"`);
      } else {
        console.log(`[questions DEBUG] NO options returned by Supabase`);
      }
    }

    const questions = (data as DbRow[]).map(dbToV2);
    cache.set(resolvedId, questions);
    return { ok: true, questions };
  } catch (err) {
    console.warn(`[questions] Fetch failed for ${resolvedId}:`, err);
    return { ok: false, error: 'no-connection' };
  }
}

/**
 * Fetch a random set of questions for a subject from Supabase (for quick practice).
 * Returns up to `limit` questions across all chapters of the subject.
 */
export async function fetchQuestionsBySubject(
  subjectId: string,
  limit: number = 20,
): Promise<FetchQuestionsResult> {
  const cacheKey = `subject:${subjectId}:${limit}`;

  if (cache.has(cacheKey)) {
    return { ok: true, questions: cache.get(cacheKey)! };
  }

  if (!supabase) {
    return { ok: false, error: 'not-configured' };
  }

  try {
    const { data, error } = await supabase
      .from('med_questions')
      .select(
        `*, med_question_options (*), med_elimination_hints (*), med_topics!topic_id (*)`,
      )
      .eq('subject_id', subjectId)
      .eq('status', 'active')
      .limit(limit);

    if (error) {
      console.warn(`[questions] Supabase error for subject ${subjectId}:`, error.message);
      return { ok: false, error: 'no-connection' };
    }

    if (!data || data.length === 0) {
      return { ok: false, error: 'no-questions' };
    }

    const questions = (data as DbRow[]).map(dbToV2);
    cache.set(cacheKey, questions);
    return { ok: true, questions };
  } catch (err) {
    console.warn(`[questions] Subject fetch failed for ${subjectId}:`, err);
    return { ok: false, error: 'no-connection' };
  }
}

/** Clear cached questions (useful after imports). */
export function clearQuestionsCache(): void {
  cache.clear();
}

// ── Transform DB row → QuestionV2 ────────────────────────────

function dbToV2(row: DbRow): QuestionV2 {
  const dbOptions = ((row.med_question_options as DbOptionRow[]) || []).sort(
    (a, b) => (a.sort_order as number) - (b.sort_order as number),
  );

  const options: Option[] = dbOptions.map((o) => ({
    id: String(o.option_key),
    text: l(o, 'option_text'),
  }));

  const correctOption = dbOptions.find((o) => o.is_correct);
  const correctOptionId = String(correctOption?.option_key ?? row.correct_answer ?? '');

  const raw = (row.payload ?? {}) as Record<string, unknown>;
  const questionId = (raw.question_id as string) || String(row.id);
  const questionType = String(row.question_type);
  const questionText = String(row.question_text ?? '');

  // Map elimination hints from DB
  const hintRows = (row.med_elimination_hints as DbHintRow[]) || [];
  const eliminationHints: EliminationHint[] = hintRows.map((h) => ({
    optionKey: String(h.option_key),
    hint: l(h, 'hint_text'),
    misconception: l(h, 'misconception'),
  }));

  // Build combined elimination technique L from all hints
  const elimTechnique: L = { en: '' };
  const langCodes = new Set<string>();
  for (const h of eliminationHints) {
    for (const code of Object.keys(h.hint)) langCodes.add(code);
  }
  for (const code of langCodes) {
    const lines = eliminationHints
      .filter((h) => h.hint[code])
      .map((h) => `Option ${h.optionKey}: ${h.hint[code]}`);
    if (lines.length > 0) elimTechnique[code] = lines.join('\n');
  }

  const payload = buildPayload(row, options, correctOptionId, raw, questionText);

  // Clean display text (English) — strip embedded structured data
  let displayText = questionText;
  if (questionType === 'match-the-following') {
    displayText = displayText.replace(/\n*column\s*(?:i|I|1|a|A)\s*[:\-][\s\S]*/i, '').trim();
    displayText = displayText.replace(/:\s*$/, '').trim();
  } else if (questionType === 'assertion-reasoning') {
    displayText = displayText.replace(/\n*assertion\s*(?:\(A\))?\s*[:\-][\s\S]*/i, '').trim();
    displayText = displayText.replace(/:\s*$/, '').trim();
    if (!displayText) displayText = 'Read the assertion and reason below and choose the correct option.';
  } else if (questionType === 'true-false') {
    displayText = 'Is the following statement true or false?';
  } else if (questionType === 'scenario-based') {
    const scenarioPayload = (raw.scenario as string) || '';
    if (!scenarioPayload || scenarioPayload === questionText) {
      displayText = 'Based on the scenario below, select the correct answer.';
    }
  } else if (questionType === 'fill-in-blanks') {
    const blanksPayload = (raw.text_with_blanks as string) || '';
    if (!blanksPayload || blanksPayload === questionText) {
      displayText = 'Fill in the blank(s) in the statement below.';
    }
  } else if (questionType === 'logical-sequence') {
    if (!displayText || displayText === questionText) {
      displayText = 'Arrange the following in the correct order.';
    }
  }

  // Build text L: override English with cleaned display text
  const textL = l(row, 'question_text');
  textL.en = displayText;

  // Topic name
  const topicRow = row.med_topics as DbTopicRow | null;
  const payloadTopic = (raw.topic as string) || (raw.topic_name as string) || undefined;
  let topicName: L | undefined;
  if (topicRow) {
    topicName = l(topicRow, 'name');
  } else if (payloadTopic) {
    topicName = { en: payloadTopic };
  }

  return {
    id: questionId,
    type: questionType as QuestionType,
    chapterId: String(row.chapter_id),
    subjectId: String(row.subject_id) as QuestionV2['subjectId'],
    difficulty: String(row.difficulty) as Difficulty,
    topicId: String(row.topic_id ?? '') || payloadTopic,
    topicName,
    text: textL,
    explanation: l(row, 'explanation'),
    eliminationTechnique: elimTechnique,
    eliminationHints,
    payload,
  };
}

// ── Build type-specific payload ──────────────────────────────

function buildPayload(
  row: DbRow,
  options: Option[],
  correctOptionId: string,
  raw: Record<string, unknown>,
  questionText: string,
): QuestionV2['payload'] {
  const qType = String(row.question_type);

  switch (qType) {
    case 'assertion-reasoning': {
      let assertionEn = (raw.assertion as string) || '';
      let reasonEn = (raw.reason as string) || '';
      if (!assertionEn || !reasonEn) {
        const parsed = parseAssertionReason(questionText);
        assertionEn = assertionEn || parsed.assertion;
        reasonEn = reasonEn || parsed.reason;
      }
      const assertion = lPayload(raw, 'assertion', assertionEn);
      assertion.en = assertionEn;
      const reason = lPayload(raw, 'reason', reasonEn);
      reason.en = reasonEn;
      return { type: 'assertion-reasoning', assertion, reason, options, correctOptionId };
    }

    case 'match-the-following': {
      let colA = parseColumnItemsFromJson(raw.column_a ?? raw.columnA);
      let colB = parseColumnItemsFromJson(raw.column_b ?? raw.columnB);
      let mapping = (raw.correct_mapping ?? raw.correctMapping) as Record<string, string> | undefined;

      if (colA.length === 0 || colB.length === 0) {
        const parsed = parseMatchColumns(questionText);
        colA = colA.length > 0 ? colA : parsed.columnA;
        colB = colB.length > 0 ? colB : parsed.columnB;
      }

      if (!mapping || Object.keys(mapping).length === 0) {
        const correctOpt = options.find((o) => o.id === correctOptionId);
        if (correctOpt) mapping = parseOptionPairs(correctOpt.text.en);
      }

      if (colA.length > 0 && colB.length > 0) {
        return { type: 'match-the-following', columnA: colA, columnB: colB, correctMapping: mapping || {}, options, correctOptionId };
      }
      return { type: 'mcq', options, correctOptionId };
    }

    case 'true-false': {
      const correctOpt = options.find((o) => o.id === correctOptionId);
      const tfCorrect = (correctOpt?.text?.en ?? '').toLowerCase().trim() === 'true';
      return {
        type: 'true-false',
        statement: lPayload(raw, 'statement', questionText),
        correctAnswer: tfCorrect,
      };
    }

    case 'fill-in-blanks':
      return {
        type: 'fill-in-blanks',
        textWithBlanks: lPayload(raw, 'text_with_blanks', questionText),
        options,
        correctOptionId,
      };

    case 'scenario-based':
      return {
        type: 'scenario-based',
        scenario: lPayload(raw, 'scenario', questionText),
        options,
        correctOptionId,
      };

    case 'diagram-based':
      return {
        type: 'diagram-based',
        imageUri: String(row.image_url ?? raw.image_uri ?? ''),
        imageAlt: String(row.image_alt ?? raw.image_alt ?? ''),
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
function parseColumnItemsFromJson(data: unknown): { id: string; text: L }[] {
  if (!Array.isArray(data)) return [];
  return data.map((item: Record<string, unknown>) => ({
    id: String(item.id ?? ''),
    text: lPayload(item, 'text'),
  }));
}

/**
 * Parse match-the-following columns from question_text (English only — parsed from text).
 */
function parseMatchColumns(text: string): {
  columnA: { id: string; text: L }[];
  columnB: { id: string; text: L }[];
} {
  const columnA: { id: string; text: L }[] = [];
  const columnB: { id: string; text: L }[] = [];

  const colSplit = text.split(/column\s*[-–]?\s*(?:ii|II|2|b|B)\s*[:\-–]/i);
  if (colSplit.length < 2) return { columnA, columnB };

  const col1Text = colSplit[0];
  const col2Text = colSplit[1];
  const col1Body = col1Text.replace(/.*column\s*[-–]?\s*(?:i|I|1|a|A)\s*[:\-–]/i, '');

  function extractItems(body: string): { id: string; text: L }[] {
    const items: { id: string; text: L }[] = [];

    const parenRegex = /\(([A-Za-z0-9]+(?:i{1,3}v?|v)?)\)\s*([^\n(]+)/g;
    let m;
    // eslint-disable-next-line no-cond-assign
    while ((m = parenRegex.exec(body)) !== null) {
      items.push({ id: m[1].trim(), text: { en: m[2].trim() } });
    }
    if (items.length >= 2) return items;

    items.length = 0;
    const dotRegex = /(?:^|\n)\s*([A-Za-z0-9]+)\.\s+(.+?)(?=\n\s*[A-Za-z0-9]+\.|$)/gs;
    // eslint-disable-next-line no-cond-assign
    while ((m = dotRegex.exec(body)) !== null) {
      items.push({ id: m[1].trim(), text: { en: m[2].trim() } });
    }
    if (items.length >= 2) return items;

    items.length = 0;
    const simpleRegex = /(?:^|\n)\s*([A-Z])\s{2,}(.+?)(?=\n|$)/g;
    // eslint-disable-next-line no-cond-assign
    while ((m = simpleRegex.exec(body)) !== null) {
      items.push({ id: m[1].trim(), text: { en: m[2].trim() } });
    }
    return items;
  }

  columnA.push(...extractItems(col1Body));
  columnB.push(...extractItems(col2Text));

  return { columnA, columnB };
}

/**
 * Parse option text like "P-ii, Q-iii, R-iv, S-i" or "1-b, 2-c, 3-a"
 * into a mapping { P: 'ii', Q: 'iii', R: 'iv', S: 'i' }
 */
function parseOptionPairs(text: string): Record<string, string> {
  const mapping: Record<string, string> = {};
  // Match patterns: P-ii, Q-iii, 1-b, 2-c, (i)→Q, (ii)→P (with various separators)
  const pairs = text.split(/[,;]\s*/);
  for (const pair of pairs) {
    const m = pair.trim().match(/^\(?([A-Za-z0-9]+(?:i{1,3}v?|v)?)\)?\s*[-–→]\s*\(?([A-Za-z0-9]+(?:i{1,3}v?|v)?)\)?$/);
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
