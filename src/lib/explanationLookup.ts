import { WrongAnswerEntry, SubjectId, Language } from '../types';
import { getWrongAnswerExplanation } from '../data/explanations';
import { store } from '../store';
import {
  incrementWrongAnswerUsage,
  cacheExplanation,
} from '../store/slices/aiSlice';
import { AI_CONFIG } from '../config/ai';

// ── Types ──

export interface WrongAnswerLookupResult {
  entry: WrongAnswerEntry;
  source: 'bundled' | 'cached' | 'generated';
}

// ── Rate Limit ──

const DAILY_LIMIT = 100; // generous since most hits are from bundled data

function checkWrongAnswerRateLimit(): boolean {
  const { dailyUsage } = store.getState().ai;
  const today = new Date().toISOString().slice(0, 10);
  if (dailyUsage.date !== today) return true;
  return dailyUsage.wrongAnswerAnalysis < DAILY_LIMIT;
}

// ── Cached fallback lookup (Redux) ──

function checkCachedFallback(
  questionId: string,
  selectedOptionId: string,
): WrongAnswerEntry | null {
  const { cachedExplanations } = store.getState().ai;
  return (
    cachedExplanations.find(
      (e) =>
        e.questionId === questionId &&
        e.selectedOptionId === selectedOptionId
    ) ?? null
  );
}

// ── Edge Function fallback ──

async function fetchFromEdgeFunction(
  questionId: string,
  selectedOptionId: string,
  correctOptionId: string,
  questionText: string,
  subjectId: SubjectId,
  language: Language,
): Promise<WrongAnswerEntry | null> {
  try {
    // POC: call OpenAI directly (same pattern as aiClient.ts)
    // Production: replace with Supabase Edge Function call
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${AI_CONFIG.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: AI_CONFIG.models.fast, // Haiku-equivalent: always use fast model
        messages: [
          {
            role: 'system',
            content: `You are VaNi, an AI tutor for Indian students preparing for NEET.
Analyze why a student picked a wrong answer and explain the correct reasoning.
Respond in ${language === 'te' ? 'Telugu (keep scientific terms in English)' : 'English'}.
Be concise and exam-focused. Output valid JSON only.`,
          },
          {
            role: 'user',
            content: `Question: "${questionText}"
Student selected option: ${selectedOptionId} (wrong)
Correct answer: ${correctOptionId}
Subject: ${subjectId}

Respond as JSON:
{
  "misconception": "what the student likely confused (1-2 sentences)",
  "correctReasoning": "step-by-step correct approach (2-3 sentences)",
  "tip": "one-line exam tip",
  "conceptTag": "relevant-concept-tag"
}`,
          },
        ],
        temperature: 0.3,
        max_tokens: 400,
      }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) return null;

    const parsed = JSON.parse(content);
    return {
      questionId,
      selectedOptionId,
      misconception: parsed.misconception ?? 'Unable to determine misconception.',
      correctReasoning: parsed.correctReasoning ?? 'Review the concept and try again.',
      tip: parsed.tip ?? 'Read the question carefully before answering.',
      conceptTag: parsed.conceptTag ?? 'general',
    };
  } catch {
    return null;
  }
}

// ── Main Export ──

/**
 * Look up a wrong-answer explanation with 3-tier fallback:
 * 1. Bundled data (sync, instant, free)
 * 2. Redux cached fallback (sync, from previous Edge Function calls)
 * 3. Edge Function (async, costs API call)
 *
 * Returns null only if all 3 tiers miss AND Edge Function fails.
 */
export async function lookupWrongAnswer(
  questionId: string,
  selectedOptionId: string,
  correctOptionId: string,
  questionText: string,
  subjectId: SubjectId,
  language: Language = 'en',
): Promise<WrongAnswerLookupResult | null> {
  // Layer 1: Bundled pre-generated data
  const bundled = getWrongAnswerExplanation(questionId, selectedOptionId);
  if (bundled) {
    store.dispatch(incrementWrongAnswerUsage());
    return { entry: bundled, source: 'bundled' };
  }

  // Layer 2: Redux cached fallback
  const cached = checkCachedFallback(questionId, selectedOptionId);
  if (cached) {
    store.dispatch(incrementWrongAnswerUsage());
    return { entry: cached, source: 'cached' };
  }

  // Layer 3: Edge Function (rate-limited)
  if (!checkWrongAnswerRateLimit()) {
    return null;
  }

  const generated = await fetchFromEdgeFunction(
    questionId,
    selectedOptionId,
    correctOptionId,
    questionText,
    subjectId,
    language,
  );

  if (generated) {
    store.dispatch(cacheExplanation(generated));
    store.dispatch(incrementWrongAnswerUsage());
    return { entry: generated, source: 'generated' };
  }

  return null;
}

/**
 * Synchronous lookup — only checks bundled data and Redux cache.
 * Use this when you need an instant result without waiting for network.
 */
export function lookupWrongAnswerSync(
  questionId: string,
  selectedOptionId: string,
): WrongAnswerLookupResult | null {
  const bundled = getWrongAnswerExplanation(questionId, selectedOptionId);
  if (bundled) return { entry: bundled, source: 'bundled' };

  const cached = checkCachedFallback(questionId, selectedOptionId);
  if (cached) return { entry: cached, source: 'cached' };

  return null;
}
