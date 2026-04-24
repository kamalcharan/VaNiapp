import type { QuestionV2, EliminationHint } from '../types';

// Deterministic per-session option shuffling.
//
// Seed source: hash(sessionId + '|' + questionId). Same session + same question
// -> same shuffle -> refresh-safe. New session -> new shuffle -> memorisation
// defeated on re-attempts.
//
// Shuffles payload.options in place of a fresh copy. Does NOT touch:
//   - true-false payloads (no options array)
//   - match-the-following columnA / columnB / correctMapping
//   - logical-sequence items / correctOrder
//   - payload.correctOptionId (it's an id, not a position reference)
//   - elimination hints metadata (optionKey stays stable)
//
// DOES regenerate the human-readable elimination text ("Option B: ...") so
// the displayed letter matches the new position, not the underlying stable id.

function hashString(s: string): number {
  // djb2 variant, returns unsigned 32-bit
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  }
  return h;
}

function mulberry32(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleWithSeed<T>(arr: readonly T[], seed: number): T[] {
  const out = arr.slice();
  const rand = mulberry32(seed);
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function rebuildEliminationText(
  hints: EliminationHint[] | undefined,
  displayLetterByOriginalId: Record<string, string>,
  lang: 'base' | 'te' | 'hi',
): string {
  if (!hints || hints.length === 0) return '';
  return hints
    .map((h) => {
      const text = lang === 'te' ? h.hintTe : lang === 'hi' ? h.hintHi : h.hint;
      if (!text) return '';
      const label = displayLetterByOriginalId[h.optionKey] ?? h.optionKey;
      return `Option ${label}: ${text}`;
    })
    .filter(Boolean)
    .join('\n');
}

export function applyOptionShuffle(q: QuestionV2, sessionId: string): QuestionV2 {
  // true-false has no options array to shuffle
  if (q.payload.type === 'true-false') return q;

  const seed = hashString(`${sessionId}|${q.id}`);
  const shuffledOptions = shuffleWithSeed(q.payload.options, seed);

  // Map stable option id (e.g. "B") -> new display letter (e.g. "A") for
  // rebuilding elimination text so hint prefixes match the new positions.
  const displayLetterByOriginalId: Record<string, string> = {};
  shuffledOptions.forEach((opt, idx) => {
    displayLetterByOriginalId[opt.id] = String.fromCharCode(65 + idx);
  });

  return {
    ...q,
    eliminationTechnique: rebuildEliminationText(q.eliminationHints, displayLetterByOriginalId, 'base'),
    eliminationTechniqueTe: rebuildEliminationText(q.eliminationHints, displayLetterByOriginalId, 'te'),
    eliminationTechniqueHi: rebuildEliminationText(q.eliminationHints, displayLetterByOriginalId, 'hi') || undefined,
    payload: { ...q.payload, options: shuffledOptions },
  };
}

export function applyOptionShuffleToBatch(
  questions: readonly QuestionV2[],
  sessionId: string,
): QuestionV2[] {
  return questions.map((q) => applyOptionShuffle(q, sessionId));
}
