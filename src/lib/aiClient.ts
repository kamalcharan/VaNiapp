import { AI_CONFIG, classifyComplexity } from '../config/ai';
import { store } from '../store';
import { addDoubtEntry, setLoading, DoubtEntry } from '../store/slices/aiSlice';
import { SubjectId, ExamType, Language } from '../types';
import { SUBJECT_META } from '../constants/subjects';

// ── Types ──

interface DoubtRequest {
  query: string;
  subjectId: SubjectId;
  exam: ExamType;
  language: Language;
  chapterId?: string;
  questionContext?: string; // e.g. question text for context
}

interface DoubtResponse {
  answer: string;
  relatedConcepts: string[];
  model: 'fast' | 'smart';
  source: 'cache' | 'generated';
}

// ── Cache Check ──

function normalizeQuery(q: string): string {
  return q.toLowerCase().trim().replace(/\s+/g, ' ');
}

function checkLocalCache(query: string, subjectId: SubjectId): DoubtEntry | null {
  const state = store.getState();
  const normalized = normalizeQuery(query);
  return (
    state.ai.doubtHistory.find(
      (e) => e.subjectId === subjectId && normalizeQuery(e.query) === normalized
    ) ?? null
  );
}

// ── System Prompt Builder ──

function buildSystemPrompt(exam: ExamType, subjectId: SubjectId, language: Language): string {
  const subjectName = SUBJECT_META[subjectId]?.name ?? subjectId;
  const langInstruction =
    language === 'te'
      ? 'Respond in Telugu script. Use Telugu for explanations but keep scientific terms in English.'
      : 'Respond in English.';

  return `You are VaNi, a friendly and sharp AI tutor helping Indian students (ages 15-18) prepare for the ${exam} exam.

Subject context: ${subjectName}
${langInstruction}

Guidelines:
- Keep explanations concise and exam-focused (under 250 words)
- Use simple language with relatable analogies
- Highlight key points with bold text
- For numerical problems, show step-by-step working
- Mention exam relevance when applicable (e.g., "This topic appears frequently in NEET")
- End with 2-3 related concepts the student should review

Format your response as:
**Answer:**
[Your explanation here]

**Related Concepts:**
- concept 1
- concept 2
- concept 3`;
}

// ── OpenAI API Call ──

async function callOpenAI(
  systemPrompt: string,
  userQuery: string,
  modelTier: 'fast' | 'smart'
): Promise<{ content: string }> {
  const model = modelTier === 'smart' ? AI_CONFIG.models.smart : AI_CONFIG.models.fast;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${AI_CONFIG.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userQuery },
      ],
      temperature: AI_CONFIG.temperature,
      max_tokens: AI_CONFIG.maxTokens,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => 'Unknown error');
    throw new Error(`OpenAI API error (${response.status}): ${errorBody}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error('Empty response from OpenAI');
  return { content };
}

// ── Parse Response ──

function parseResponse(raw: string): { answer: string; relatedConcepts: string[] } {
  const concepts: string[] = [];

  // Try to extract related concepts section
  const conceptMatch = raw.match(/\*\*Related Concepts:\*\*\s*([\s\S]*?)$/i);
  if (conceptMatch) {
    const lines = conceptMatch[1].split('\n');
    for (const line of lines) {
      const cleaned = line.replace(/^[-*•]\s*/, '').trim();
      if (cleaned.length > 0 && cleaned.length < 100) {
        concepts.push(cleaned);
      }
    }
  }

  // Remove the related concepts section from the answer
  let answer = raw;
  if (conceptMatch) {
    answer = raw.slice(0, conceptMatch.index).trim();
  }
  // Remove the "Answer:" prefix if present
  answer = answer.replace(/^\*\*Answer:\*\*\s*/i, '').trim();

  return {
    answer: answer || raw.trim(),
    relatedConcepts: concepts.slice(0, 3),
  };
}

// ── Rate Limit Check ──

function checkRateLimit(): { allowed: boolean; remaining: number } {
  const state = store.getState();
  const { dailyUsage } = state.ai;
  const today = new Date().toISOString().slice(0, 10);

  if (dailyUsage.date !== today) {
    return { allowed: true, remaining: AI_CONFIG.limits.doubtSolver };
  }

  const remaining = AI_CONFIG.limits.doubtSolver - dailyUsage.doubtSolver;
  return { allowed: remaining > 0, remaining: Math.max(0, remaining) };
}

// ── Main Export ──

export async function askDoubt(request: DoubtRequest): Promise<DoubtResponse> {
  // 1. Rate limit check
  const { allowed, remaining } = checkRateLimit();
  if (!allowed) {
    throw new Error(
      'You\'ve used all your AI queries for today. Come back tomorrow! (50/day limit)'
    );
  }

  // 2. Check local cache
  const cached = checkLocalCache(request.query, request.subjectId);
  if (cached) {
    return {
      answer: cached.response,
      relatedConcepts: cached.relatedConcepts,
      model: cached.model,
      source: 'cache',
    };
  }

  // 3. Classify complexity
  const modelTier = classifyComplexity(request.query);

  // 4. Build prompt
  const systemPrompt = buildSystemPrompt(request.exam, request.subjectId, request.language);

  let userMessage = request.query;
  if (request.questionContext) {
    userMessage = `Context question: "${request.questionContext}"\n\nStudent's doubt: ${request.query}`;
  }

  // 5. Call OpenAI
  store.dispatch(setLoading(true));
  try {
    const { content } = await callOpenAI(systemPrompt, userMessage, modelTier);
    const parsed = parseResponse(content);

    // 6. Store in Redux (acts as cache + history)
    const entry: DoubtEntry = {
      id: `d-${Date.now()}`,
      query: request.query,
      subjectId: request.subjectId,
      response: parsed.answer,
      relatedConcepts: parsed.relatedConcepts,
      model: modelTier,
      timestamp: new Date().toISOString(),
    };
    store.dispatch(addDoubtEntry(entry));

    return {
      answer: parsed.answer,
      relatedConcepts: parsed.relatedConcepts,
      model: modelTier,
      source: 'generated',
    };
  } finally {
    store.dispatch(setLoading(false));
  }
}

export { checkRateLimit };
