import { ConceptEntry, SubjectId, Language } from '../types';
import { getConceptByTag, getConceptsByChapter } from '../data/concepts';
import { store } from '../store';
import {
  incrementConceptUsage,
  cacheConcept,
} from '../store/slices/aiSlice';
import { AI_CONFIG } from '../config/ai';

// ── Types ──

export interface ConceptLookupResult {
  entry: ConceptEntry;
  source: 'bundled' | 'cached' | 'generated';
}

// ── Rate Limit ──

const DAILY_LIMIT = 30;

function checkConceptRateLimit(): boolean {
  const { dailyUsage } = store.getState().ai;
  const today = new Date().toISOString().slice(0, 10);
  if (dailyUsage.date !== today) return true;
  return dailyUsage.conceptExplainer < DAILY_LIMIT;
}

// ── Cached fallback lookup (Redux) ──

function checkCachedConcept(conceptTag: string): ConceptEntry | null {
  const { cachedConcepts } = store.getState().ai;
  return cachedConcepts.find((c) => c.conceptTag === conceptTag) ?? null;
}

// ── Edge Function fallback ──

async function fetchConceptFromEdgeFunction(
  conceptTag: string,
  subjectId: SubjectId,
  chapterId: string,
  language: Language,
): Promise<ConceptEntry | null> {
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
        model: AI_CONFIG.models.smart, // Sonnet-equivalent: use smart model for concept depth
        messages: [
          {
            role: 'system',
            content: `You are VaNi, an AI tutor for Indian students (ages 15-18) preparing for NEET.
Provide a deep, exam-focused concept explanation.
Respond in ${language === 'te' ? 'Telugu (keep scientific terms in English)' : 'English'}.
Use analogies that Indian Gen-Z students relate to.
Output valid JSON only.`,
          },
          {
            role: 'user',
            content: `Explain the concept: "${conceptTag.replace(/-/g, ' ')}"
Subject: ${subjectId}
Chapter: ${chapterId}

Respond as JSON:
{
  "title": "Concept Title",
  "explanation": "200-400 word markdown explanation with **bold** key terms",
  "analogy": "relatable analogy for Indian teens",
  "examRelevance": "how often this appears in NEET exams",
  "commonMistakes": ["mistake 1", "mistake 2"],
  "quickRecap": "exactly 2-line summary"
}`,
          },
        ],
        temperature: 0.4,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) return null;

    const parsed = JSON.parse(content);
    return {
      conceptTag,
      subjectId,
      chapterId,
      title: parsed.title ?? conceptTag.replace(/-/g, ' '),
      explanation: parsed.explanation ?? 'Explanation not available.',
      analogy: parsed.analogy ?? '',
      examRelevance: parsed.examRelevance ?? 'Relevant for NEET preparation.',
      commonMistakes: parsed.commonMistakes ?? [],
      quickRecap: parsed.quickRecap ?? 'Review this concept for your exam preparation.',
    };
  } catch {
    return null;
  }
}

// ── Main Export ──

/**
 * Look up a concept explanation with 3-tier fallback:
 * 1. Bundled data (sync, instant, free)
 * 2. Redux cached fallback (sync, from previous Edge Function calls)
 * 3. Edge Function (async, costs API call — uses smart/Sonnet model)
 *
 * Returns null only if all 3 tiers miss AND Edge Function fails.
 */
export async function lookupConcept(
  conceptTag: string,
  subjectId: SubjectId,
  chapterId: string,
  language: Language = 'en',
): Promise<ConceptLookupResult | null> {
  // Layer 1: Bundled pre-generated data
  const bundled = getConceptByTag(conceptTag);
  if (bundled) {
    store.dispatch(incrementConceptUsage());
    return { entry: bundled, source: 'bundled' };
  }

  // Layer 2: Redux cached fallback
  const cached = checkCachedConcept(conceptTag);
  if (cached) {
    store.dispatch(incrementConceptUsage());
    return { entry: cached, source: 'cached' };
  }

  // Layer 3: Edge Function (rate-limited)
  if (!checkConceptRateLimit()) {
    return null;
  }

  const generated = await fetchConceptFromEdgeFunction(
    conceptTag,
    subjectId,
    chapterId,
    language,
  );

  if (generated) {
    store.dispatch(cacheConcept(generated));
    store.dispatch(incrementConceptUsage());
    return { entry: generated, source: 'generated' };
  }

  return null;
}

/**
 * Synchronous lookup — only checks bundled data and Redux cache.
 * Use this when you need an instant result without waiting for network.
 */
export function lookupConceptSync(conceptTag: string): ConceptLookupResult | null {
  const bundled = getConceptByTag(conceptTag);
  if (bundled) return { entry: bundled, source: 'bundled' };

  const cached = checkCachedConcept(conceptTag);
  if (cached) return { entry: cached, source: 'cached' };

  return null;
}

/**
 * Get all concepts for a chapter (bundled only — sync).
 * Useful for listing available concepts on a chapter screen.
 */
export function getChapterConcepts(chapterId: string): ConceptEntry[] {
  return getConceptsByChapter(chapterId);
}
