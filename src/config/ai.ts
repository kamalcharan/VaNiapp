// ── OpenAI Configuration ──────────────────────────────────
// API key loaded from .env (EXPO_PUBLIC_OPENAI_API_KEY).
// For production, move to Supabase Edge Function.

export const AI_CONFIG = {
  apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY || '',

  // Model routing
  models: {
    fast: 'gpt-4o-mini',   // cheap, fast — used for 80% of queries
    smart: 'gpt-4o',       // capable — used for complex multi-step queries
  },

  // Rate limits (client-side, per day)
  limits: {
    doubtSolver: 50,
    perHour: 15,
  },

  // Generation params
  temperature: 0.3,
  maxTokens: 800,
} as const;

// Complexity keywords — if query contains these, route to the "smart" model
const COMPLEX_KEYWORDS = [
  'compare', 'difference between', 'why does', 'explain how',
  'derive', 'prove', 'calculate', 'step by step',
  'relationship between', 'what happens when', 'mechanism',
];

export function classifyComplexity(query: string): 'fast' | 'smart' {
  const lower = query.toLowerCase();
  return COMPLEX_KEYWORDS.some((kw) => lower.includes(kw)) ? 'smart' : 'fast';
}
