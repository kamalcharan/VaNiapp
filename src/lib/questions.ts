import { supabase } from './supabase';
import type { QuestionV2, QuestionType, Difficulty, Option, EliminationHint } from '../types';
import { resolveLegacyChapterId } from './questionAdapter';

// ── Types for DB rows ────────────────────────────────────────

interface DbOption {
  option_key: string;
  option_text: string;
  option_text_te: string | null;
  option_text_hi: string | null;
  is_correct: boolean;
  sort_order: number;
}

interface DbEliminationHint {
  option_key: string;
  hint_text: string;
  hint_text_te: string | null;
  hint_text_hi: string | null;
  misconception: string | null;
  misconception_te: string | null;
  misconception_hi: string | null;
}

interface DbTopic {
  name: string;
  name_te: string | null;
  name_hi: string | null;
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
  question_text_hi: string | null;
  explanation: string | null;
  explanation_te: string | null;
  explanation_hi: string | null;
  correct_answer: string;
  image_url: string | null;
  image_alt: string | null;
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
         question_text, question_text_te, question_text_hi, explanation, explanation_te, explanation_hi,
         correct_answer, image_url, image_alt, payload,
         med_question_options (option_key, option_text, option_text_te, option_text_hi, is_correct, sort_order),
         med_elimination_hints (option_key, hint_text, hint_text_te, hint_text_hi, misconception, misconception_te, misconception_hi),
         med_topics!topic_id (name, name_te, name_hi)`,
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

    const questions = (data as unknown as DbQuestion[]).map(dbToV2);
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
        `id, subject_id, chapter_id, topic_id, question_type, difficulty,
         question_text, question_text_te, question_text_hi, explanation, explanation_te, explanation_hi,
         correct_answer, image_url, image_alt, payload,
         med_question_options (option_key, option_text, option_text_te, option_text_hi, is_correct, sort_order),
         med_elimination_hints (option_key, hint_text, hint_text_te, hint_text_hi, misconception, misconception_te, misconception_hi),
         med_topics!topic_id (name, name_te, name_hi)`,
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

    const questions = (data as unknown as DbQuestion[]).map(dbToV2);
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

function dbToV2(row: DbQuestion): QuestionV2 {
  const dbOptions = (row.med_question_options || []).sort(
    (a, b) => a.sort_order - b.sort_order,
  );

  const options: Option[] = dbOptions.map((o, idx) => {
    const id = o.option_key;
    return {
      id,
      text: o.option_text,
      textTe: o.option_text_te || '',
      textHi: o.option_text_hi || '',
    };
  });

  // Deduplicate option IDs — if two options share the same key, append index
  const seenOptionIds = new Set<string>();
  for (let i = 0; i < options.length; i++) {
    if (seenOptionIds.has(options[i].id)) {
      options[i] = { ...options[i], id: `${options[i].id}_${i}` };
    }
    seenOptionIds.add(options[i].id);
  }

  const correctOption = dbOptions.find((o) => o.is_correct);
  const correctOptionId = correctOption?.option_key || row.correct_answer;

  const raw = (row.payload ?? {}) as Record<string, unknown>;
  const questionId = (raw.question_id as string) || row.id;

  // Map elimination hints from DB
  const eliminationHints: EliminationHint[] = (row.med_elimination_hints || []).map((h) => ({
    optionKey: h.option_key,
    hint: h.hint_text || '',
    hintTe: h.hint_text_te || '',
    hintHi: h.hint_text_hi || '',
    misconception: h.misconception || '',
    misconceptionTe: h.misconception_te || '',
    misconceptionHi: h.misconception_hi || '',
  }));

  // Build a combined elimination technique string from hints
  const eliminationText = eliminationHints
    .map((h) => `Option ${h.optionKey}: ${h.hint}`)
    .join('\n');

  const eliminationTextTe = eliminationHints
    .filter((h) => h.hintTe)
    .map((h) => `Option ${h.optionKey}: ${h.hintTe}`)
    .join('\n');

  const eliminationTextHi = eliminationHints
    .filter((h) => h.hintHi)
    .map((h) => `Option ${h.optionKey}: ${h.hintHi}`)
    .join('\n');

  const payload = buildPayload(row, options, correctOptionId);

  // Clean display text — strip embedded structured data that the component renders.
  // Each special type has its own card (scenario card, blanks card, etc.) so we
  // minimise the question-box text to avoid duplication.
  let displayText = row.question_text;
  if (row.question_type === 'match-the-following') {
    displayText = displayText.replace(/\n*column\s*(?:i|I|1|a|A)\s*[:\-][\s\S]*/i, '').trim();
    // Remove trailing ":" if leftover
    displayText = displayText.replace(/:\s*$/, '').trim();
  } else if (row.question_type === 'assertion-reasoning') {
    displayText = displayText.replace(/\n*assertion\s*(?:\(A\))?\s*[:\-][\s\S]*/i, '').trim();
    displayText = displayText.replace(/:\s*$/, '').trim();
    if (!displayText) displayText = 'Read the assertion and reason below and choose the correct option.';
  } else if (row.question_type === 'true-false') {
    // TrueFalseQuestion renders its own STATEMENT card; avoid showing the same text twice
    displayText = 'Is the following statement true or false?';
  } else if (row.question_type === 'scenario-based') {
    // ScenarioBasedQuestion renders a SCENARIO card from payload.scenario.
    // If a separate question stem exists in payload, use it; otherwise use a generic prompt.
    const scenarioPayload = (raw.scenario as string) || '';
    if (scenarioPayload && scenarioPayload !== row.question_text) {
      // payload.scenario is different from question_text → question_text IS the actual question stem
      // Keep displayText as-is (it's the question, not the scenario)
    } else {
      // scenario fell back to question_text → both would show the same text
      displayText = 'Based on the scenario below, select the correct answer.';
    }
  } else if (row.question_type === 'fill-in-blanks') {
    // FillInBlanksQuestion renders a FILL IN THE BLANK(S) card with highlighted blanks.
    // If payload has a separate text_with_blanks, keep the question_text for context.
    const blanksPayload = (raw.text_with_blanks as string) || '';
    if (blanksPayload && blanksPayload !== row.question_text) {
      // Keep displayText as-is (it's a different instruction text)
    } else {
      displayText = 'Fill in the blank(s) in the statement below.';
    }
  } else if (row.question_type === 'diagram-based') {
    // DiagramBasedQuestion renders its own diagram card
    // question_text typically IS the question about the diagram — keep it
  } else if (row.question_type === 'logical-sequence') {
    // LogicalSequenceQuestion renders an ARRANGE card — keep instruction as displayText
    if (!displayText || displayText === row.question_text) {
      displayText = 'Arrange the following in the correct order.';
    }
  }

  // Payload topic — bulk-import uses "topic", Gemini-generated uses "topic_name"
  const payloadTopic = (raw.topic as string) || (raw.topic_name as string) || undefined;

  return {
    id: questionId,
    type: row.question_type as QuestionType,
    chapterId: row.chapter_id,
    subjectId: row.subject_id as QuestionV2['subjectId'],
    difficulty: row.difficulty as Difficulty,
    topicId: row.topic_id || payloadTopic,
    topicName: row.med_topics?.name || payloadTopic,
    topicNameTe: row.med_topics?.name_te || undefined,
    topicNameHi: row.med_topics?.name_hi || undefined,
    text: displayText,
    textTe: row.question_text_te || '',
    textHi: row.question_text_hi || '',
    explanation: row.explanation || '',
    explanationTe: row.explanation_te || '',
    explanationHi: row.explanation_hi || '',
    eliminationTechnique: eliminationText,
    eliminationTechniqueTe: eliminationTextTe,
    eliminationTechniqueHi: eliminationTextHi,
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
        assertionHi: (raw.assertion_hi as string) || '',
        reason,
        reasonTe: (raw.reason_te as string) || '',
        reasonHi: (raw.reason_hi as string) || '',
        options,
        correctOptionId,
      };
    }

    case 'match-the-following': {
      // Try payload JSON first, fall back to parsing question_text
      let colA = parseColumnItemsFromJson(raw.column_a ?? raw.columnA);
      let colB = parseColumnItemsFromJson(raw.column_b ?? raw.columnB);
      let mapping = (raw.correct_mapping ?? raw.correctMapping) as Record<string, string> | undefined;

      // Detect garbled DB data: an earlier migration didn't strip MCQ option
      // lines from Column II text, producing many garbage items with tiny text
      // like ",", "–", or empty strings. If >50% of items have text ≤2 chars,
      // discard and re-parse from question_text.
      const isGarbled = (items: { text: string }[]) =>
        items.length > 0 &&
        items.filter((it) => it.text.trim().length <= 2).length > items.length * 0.3;

      if (isGarbled(colB)) {
        colB = [];
        mapping = undefined; // Reset mapping — it may reference garbled IDs
        // Also reset colA if it looks bad
        if (isGarbled(colA)) colA = [];
      }

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
        // Deduplicate: if any Column B ID collides with a Column A ID,
        // prefix ALL Column B IDs with "b-" so React keys stay unique.
        const aIdSet = new Set(colA.map((c) => c.id));
        const hasOverlap = colB.some((c) => aIdSet.has(c.id));
        if (hasOverlap) {
          for (const item of colB) {
            item.id = `b-${item.id}`;
          }
          // Update correctMapping values to match new B IDs
          if (mapping) {
            const updated: Record<string, string> = {};
            for (const [aId, bId] of Object.entries(mapping)) {
              updated[aId] = bId.startsWith('b-') ? bId : `b-${bId}`;
            }
            mapping = updated;
          }
        }

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

    case 'true-false': {
      // Correct answer is derived from whichever option has is_correct=true.
      // We tolerate option text like "TRUE — justification text" so generators
      // that append a justification to the option text are still classified
      // correctly (DB has ~9 such agri rows).
      const correctOpt = options.find((o) => o.id === correctOptionId);
      const tfCorrect = /^\s*(true|t)\b/i.test(correctOpt?.text || '');
      return {
        type: 'true-false',
        statement: (raw.statement as string) || text,
        statementTe: (raw.statement_te as string) || '',
        statementHi: (raw.statement_hi as string) || '',
        correctAnswer: tfCorrect,
      };
    }

    case 'fill-in-blanks':
      return {
        type: 'fill-in-blanks',
        textWithBlanks: (raw.text_with_blanks as string) || text,
        textWithBlanksTe: (raw.text_with_blanks_te as string) || '',
        textWithBlanksHi: (raw.text_with_blanks_hi as string) || '',
        options,
        correctOptionId,
      };

    case 'scenario-based':
      return {
        type: 'scenario-based',
        scenario: (raw.scenario as string) || text,
        scenarioTe: (raw.scenario_te as string) || '',
        scenarioHi: (raw.scenario_hi as string) || '',
        options,
        correctOptionId,
      };

    case 'diagram-based':
      return {
        type: 'diagram-based',
        imageUri: row.image_url || (raw.image_uri as string) || '',
        imageAlt: row.image_alt || (raw.image_alt as string) || '',
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
function parseColumnItemsFromJson(data: unknown): { id: string; text: string; textTe: string; textHi: string }[] {
  // Handle JSON string (e.g. Supabase returning stringified JSON)
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data);
    } catch {
      return [];
    }
  }
  if (!Array.isArray(data)) return [];
  return data.map((item: Record<string, unknown>) => ({
    id: String(item.id ?? ''),
    text: String(item.text ?? ''),
    textTe: String(item.text_te ?? item.textTe ?? ''),
    textHi: String(item.text_hi ?? item.textHi ?? ''),
  }));
}

/**
 * Strip trailing MCQ option text that sometimes appears at the end of
 * question_text after the column items.  Patterns removed:
 *   - "Select the correct match/option/answer:" and everything after
 *   - "Choose the correct ..." and everything after
 *   - "The correct combination is:" and everything after
 *   - Lines starting with (A)/(B)/(C)/(D) that contain mapping patterns
 */
function stripTrailingOptions(body: string): string {
  // Remove everything from a "Select/Choose/Correct combination" prompt onward
  body = body.replace(
    /\n\s*(?:select|choose|the correct|identify the correct|pick the correct|which of the following)[^\n]*(?:\n[\s\S]*)?$/i,
    ''
  );
  // Remove MCQ option lines: (A) ..., (B) ..., (C) ..., (D) ...
  // These contain mapping patterns like "(i)–(r), (ii)–(s)" that pollute column items.
  // IMPORTANT: Only match UPPERCASE A-D to avoid stripping actual column items like (a), (b).
  body = body.replace(/\n\s*\([A-D]\)\s*[\s\S]*$/, '');
  return body;
}

/**
 * Parse match-the-following columns from question_text.
 * Handles formats like:
 *   Column I:\n(P) Bulliform cells\n(Q) Palisade...\nColumn II:\n(i) Bean-shaped...\n(ii) Large...
 *   Column A:\n1. Item\n2. Item\nColumn B:\n(a) Item\n(b) Item
 */
function parseMatchColumns(text: string): {
  columnA: { id: string; text: string; textTe: string; textHi: string }[];
  columnB: { id: string; text: string; textTe: string; textHi: string }[];
} {
  type ColItem = { id: string; text: string; textTe: string; textHi: string };

  // ── Strategy 1: Pipe-delimited row pairs ──────────────────────
  // Format: "...Column I | Column II  A. leftText | 1. rightText  B. leftText | 2. rightText"
  // Strip everything up to the LAST "Column II" header (greedy .*), then match row pairs.
  const pipeResult = parsePipeDelimitedMtf(text);
  if (pipeResult.columnA.length >= 2 && pipeResult.columnB.length >= 2) {
    return pipeResult;
  }

  // ── Strategy 2: Separate Column I / Column II sections ────────
  const columnA: ColItem[] = [];
  const columnB: ColItem[] = [];

  // Split into Column I / Column II sections
  // Match headers like "Column I:", "Column-I:", "Column A:", "Column 1:", "List I:", "List-I"
  // Also handles parenthesized descriptions: "Column II (Definitions):"
  const colSplitRegex = /(?:column|list)\s*[-–]?\s*(?:ii|II|2|b|B)\s*(?:\([^)]*\))?\s*[:\-–]/i;
  const colSplit = text.split(colSplitRegex);
  if (colSplit.length < 2) return { columnA, columnB };

  // Use the LAST split if there are multiple "Column II" occurrences
  const col1Text = colSplit.length > 2 ? colSplit.slice(0, -1).join('') : colSplit[0];
  const col2Text = colSplit[colSplit.length - 1];

  // Remove the "Column I:" / "List I:" header from col1Text
  const col1Body = stripTrailingOptions(
    col1Text.replace(/.*(?:column|list)\s*[-–]?\s*(?:i|I|1|a|A)\s*(?:\([^)]*\))?\s*[:\-–]/is, '')
  );

  // Strip trailing MCQ option listing from Column II text (e.g.
  // "Select the correct match:\n(A) (i)–(r), (ii)–(s)..." that bleeds
  // into the column items and produces garbage entries).
  const col2TextClean = stripTrailingOptions(col2Text);

  // Extract labeled items in multiple formats:
  // 1. Parenthesized: (P), (Q), (1), (a), (i), (ii), (iii), (iv) etc.
  // 2. Dotted: A., B., C., 1., 2., 3. etc.
  // 3. Letter/number at line start: A  text, B  text
  function extractItems(body: string): ColItem[] {
    const items: ColItem[] = [];

    // Try parenthesized format first: (P) text, (Q) text
    const parenRegex = /\(([A-Za-z0-9]+(?:i{1,3}v?|v)?)\)\s*([^\n(]+)/g;
    let m;
    // eslint-disable-next-line no-cond-assign
    while ((m = parenRegex.exec(body)) !== null) {
      items.push({ id: m[1].trim(), text: m[2].trim(), textTe: '', textHi: '' });
    }
    if (items.length >= 2) return items;

    // Try dotted format (multiline): A. text\nB. text
    items.length = 0;
    const dotRegex = /(?:^|\n)\s*([A-Za-z0-9]+)\.\s+(.+?)(?=\n\s*[A-Za-z0-9]+\.|$)/gs;
    // eslint-disable-next-line no-cond-assign
    while ((m = dotRegex.exec(body)) !== null) {
      items.push({ id: m[1].trim(), text: m[2].trim(), textTe: '', textHi: '' });
    }
    if (items.length >= 2) return items;

    // Try dotted format (inline, no newlines): "A. text B. text C. text"
    items.length = 0;
    const inlineDotRegex = /([A-Z])\.\s+(.+?)(?=\s+[A-Z]\.\s|$)/gs;
    // eslint-disable-next-line no-cond-assign
    while ((m = inlineDotRegex.exec(body)) !== null) {
      items.push({ id: m[1].trim(), text: m[2].trim(), textTe: '', textHi: '' });
    }
    if (items.length >= 2) return items;

    // Try inline numbered format (no newlines): "1. text 2. text 3. text"
    items.length = 0;
    const inlineNumRegex = /(\d+)\.\s+(.+?)(?=\s+\d+\.\s|$)/gs;
    // eslint-disable-next-line no-cond-assign
    while ((m = inlineNumRegex.exec(body)) !== null) {
      items.push({ id: m[1].trim(), text: m[2].trim(), textTe: '', textHi: '' });
    }
    if (items.length >= 2) return items;

    // Try simple "A  text" format (letter + spaces + text on each line)
    items.length = 0;
    const simpleRegex = /(?:^|\n)\s*([A-Z])\s{2,}(.+?)(?=\n|$)/g;
    // eslint-disable-next-line no-cond-assign
    while ((m = simpleRegex.exec(body)) !== null) {
      items.push({ id: m[1].trim(), text: m[2].trim(), textTe: '', textHi: '' });
    }
    return items;
  }

  columnA.push(...extractItems(col1Body));
  columnB.push(...extractItems(col2TextClean));

  return { columnA, columnB };
}

/**
 * Parse pipe-delimited MTF format (all subjects).
 * Handles multiple format variants:
 *   - "Column I | Column II  A. left | 1. right  B. left | 2. right"
 *   - "Column A | Column B  (A) left | (1) right  (B) left | (2) right"
 *   - "List I | List II  (i) left | (P) right  (ii) left | (Q) right"
 *   - Any mix of letter/roman-numeral for colA and number/letter for colB
 * Uses greedy match to find the LAST column-2 header, then extracts items.
 */
function parsePipeDelimitedMtf(text: string): {
  columnA: { id: string; text: string; textTe: string; textHi: string }[];
  columnB: { id: string; text: string; textTe: string; textHi: string }[];
} {
  type ColItem = { id: string; text: string; textTe: string; textHi: string };
  const mkItem = (id: string, t: string): ColItem => ({ id, text: t.trim(), textTe: '', textHi: '' });

  // Only proceed if text contains pipes (quick bail-out for non-pipe formats)
  if (!text.includes('|')) return { columnA: [], columnB: [] };

  // GREEDY .* strips up to the LAST "Column II/B/2" or "List II/B/2" header
  // Handles: Column II, Column-II, Column B, Column 2, List II, List B, etc.
  // Also handles markdown bold **Column II**, parenthesized descriptions (Definition)
  const body = text.replace(
    /^.*(?:\*\*\s*)?(?:column|list)\s*[-–]?\s*(?:[Ii]{2}|II|2|[Bb])\s*(?:\*\*)?\s*(?:\([^)]*\))?\s*[:\-–|]?\s*/is,
    ''
  );

  if (body === text || body.trim().length < 5) return { columnA: [], columnB: [] };

  // ── Strategy A: match complete row pairs ────────────────────
  // "A. leftText | 1. rightText" or "(A) leftText | (1) rightText"
  // Letters/roman for colA, numbers for colB
  let columnA: ColItem[] = [];
  let columnB: ColItem[] = [];
  let m;

  // A1: "A. left | 1. right" (dotted letter + dotted number)
  const dotPairRegex = /([A-Z])\.\s+(.+?)\s*\|\s*(\d+)\.\s+(.+?)(?=\s+[A-Z]\.\s|$)/gs;
  // eslint-disable-next-line no-cond-assign
  while ((m = dotPairRegex.exec(body)) !== null) {
    columnA.push(mkItem(m[1], m[2]));
    columnB.push(mkItem(m[3], m[4]));
  }
  if (columnA.length >= 2) return { columnA, columnB };

  // A2: "(A) left | (1) right" (parenthesized letter + parenthesized number)
  columnA = []; columnB = [];
  const parenPairRegex = /\(([A-Za-z]+)\)\s+(.+?)\s*\|\s*\((\d+)\)\s+(.+?)(?=\s+\([A-Za-z]+\)\s|$)/gs;
  // eslint-disable-next-line no-cond-assign
  while ((m = parenPairRegex.exec(body)) !== null) {
    columnA.push(mkItem(m[1], m[2]));
    columnB.push(mkItem(m[3], m[4]));
  }
  if (columnA.length >= 2) return { columnA, columnB };

  // A3: "(i) left | (P) right" (roman/number colA + letter colB — reversed ID types)
  columnA = []; columnB = [];
  const reversePairRegex = /\(([ivxIVX0-9]+)\)\s+(.+?)\s*\|\s*\(([A-Za-z]+)\)\s+(.+?)(?=\s+\([ivxIVX0-9]+\)\s|$)/gs;
  // eslint-disable-next-line no-cond-assign
  while ((m = reversePairRegex.exec(body)) !== null) {
    columnA.push(mkItem(m[1], m[2]));
    columnB.push(mkItem(m[3], m[4]));
  }
  if (columnA.length >= 2) return { columnA, columnB };

  // ── Strategy B: split by pipe, classify each segment ────────
  columnA = []; columnB = [];
  const segments = body.split(/\s*\|\s*/);
  for (const seg of segments) {
    const trimmed = seg.trim();
    if (trimmed.length < 1) continue;

    // "(A) text" or "(iv) text" — parenthesized ID
    const parenMatch = trimmed.match(/^\s*\(([A-Za-z0-9]+(?:i{1,3}v?|v)?)\)\s+(.+)$/s);
    if (parenMatch) {
      const id = parenMatch[1].trim();
      const txt = parenMatch[2].trim();
      // Letters → colA, numbers → colB, roman numerals → colA
      if (/^\d+$/.test(id)) {
        columnB.push(mkItem(id, txt));
      } else {
        columnA.push(mkItem(id, txt));
      }
      continue;
    }

    // "A. text" — dotted letter → colA
    const dotLetterMatch = trimmed.match(/^\s*([A-Za-z])\.\s+(.+)$/s);
    if (dotLetterMatch) {
      columnA.push(mkItem(dotLetterMatch[1].toUpperCase(), dotLetterMatch[2].trim()));
      continue;
    }

    // "1. text" — dotted number → colB
    const dotNumberMatch = trimmed.match(/^\s*(\d+)\.\s+(.+)$/s);
    if (dotNumberMatch) {
      columnB.push(mkItem(dotNumberMatch[1], dotNumberMatch[2].trim()));
      continue;
    }
  }

  // If one column has items but the other doesn't, pipe classification may have
  // put everything into one side. In that case, bail out and let Strategy 2 handle it.
  if (columnA.length < 2 || columnB.length < 2) {
    return { columnA: [], columnB: [] };
  }

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
