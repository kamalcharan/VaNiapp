# VaNi AI Feature Spec — POC

> Version: 0.1 | Last updated: 2026-02-03
> Scope: NEET + CUET | Languages: English, Telugu

---

## 1. Product Overview

### 1.1 Two-Tier Model

| Tier | Price (Solo) | Squad of 4 | Includes |
|------|-------------|------------|----------|
| **VaNi Pro** | ₹299/mo | ₹240/mo per user | All question types, elimination technique, stage progression, adaptive practice, spaced repetition, squad leaderboard |
| **VaNi AI** | ₹499/mo | ₹400/mo per user | Everything in Pro + AI Doubt Solver, Wrong-Answer Analysis, AI Study Plan, AI Mock Analysis, AI Concept Explainer |

### 1.2 Supported Exams

| Exam | Subjects | Concept Pool | Question Bank Target |
|------|----------|-------------|---------------------|
| NEET | 4 (Phy, Chem, Botany, Zoology) | ~5,000–8,000 | 10,000–15,000 |
| CUET | 27 domain + General Test + Languages | ~25,000–40,000 | 40,000–60,000 |

---

## 2. AI Features

### 2.1 AI Doubt Solver

**What**: Student types a free-text question about any concept; AI returns a structured explanation.

**Trigger**: Tap "Ask VaNi" button available on dashboard, during review, and on concept screens.

**Input**:
```typescript
interface DoubtSolverRequest {
  userId: string;
  query: string;                    // free-text student question
  subjectId: SubjectId;             // context subject
  chapterId?: string;               // optional chapter context
  questionId?: string;              // if asked while reviewing a specific question
  exam: ExamType;                   // NEET | CUET
  language: Language;               // en | te
}
```

**Output**:
```typescript
interface DoubtSolverResponse {
  answer: string;                   // markdown-formatted explanation
  relatedConcepts: string[];        // up to 3 related concept tags
  difficulty: Difficulty;           // assessed difficulty of the doubt
  followUpSuggestions: string[];    // 2-3 follow-up questions student might ask
  source: 'cache' | 'generated';   // for analytics
  modelUsed: 'haiku' | 'sonnet';   // for cost tracking
}
```

**Routing Logic**:
- Check pre-generated cache (Layer 1) by questionId if available
- Check semantic cache (Layer 2) by query embedding similarity
- If cache miss → classify complexity:
  - Simple factual / definition → **Haiku**
  - Multi-step reasoning / cross-concept → **Sonnet**

**UI**: Chat-bubble interface in a bottom sheet. Student types query, sees typing indicator, receives markdown-rendered response. Shows "related concepts" as tappable chips.

**Rate Limit**: 50 queries/day per AI-tier user (soft limit, show "come back tomorrow" after).

---

### 2.2 Wrong-Answer Analysis

**What**: After answering a question incorrectly, AI explains *why* the student likely chose the wrong answer and how to think through it correctly.

**Trigger**: Automatic on wrong answer during practice (AI tier). Shows as expandable card in the feedback banner.

**Input**:
```typescript
interface WrongAnswerRequest {
  questionId: string;
  subjectId: SubjectId;
  selectedOptionId: string;         // what student picked
  correctOptionId: string;          // right answer
  eliminatedOptionIds: string[];    // options student eliminated
  timeSpentMs: number;              // time on this question
  exam: ExamType;
  language: Language;
}
```

**Output**:
```typescript
interface WrongAnswerResponse {
  misconception: string;            // what the student likely confused
  correctReasoning: string;         // step-by-step correct approach
  tip: string;                      // one-line exam tip
  conceptTag: string;               // weak concept identified
  source: 'pre-generated' | 'cache' | 'generated';
}
```

**Routing Logic**:
- **Layer 1 first**: Check pre-generated explanations by questionId + selectedOptionId (most hits here)
- Cache miss → **Haiku** (wrong-answer analysis is structured, rarely needs Sonnet)

**Pre-Generation Schema**:
```typescript
// Pre-generated for every (question × wrong option) combination
interface PreGeneratedWrongAnswer {
  questionId: string;
  selectedOptionId: string;         // the wrong option
  misconception: string;
  correctReasoning: string;
  tip: string;
  conceptTag: string;
}
// NEET: ~10,000 questions × 3 wrong options = 30,000 entries
// CUET: ~40,000 questions × 3 wrong options = 120,000 entries
```

---

### 2.3 AI Study Plan

**What**: Generates a personalized weekly study plan based on student's performance data, weak areas, and time until exam.

**Trigger**: Weekly auto-generate (every Monday) + manual "Refresh Plan" button in dashboard.

**Input**:
```typescript
interface StudyPlanRequest {
  userId: string;
  exam: ExamType;
  selectedSubjects: SubjectId[];
  examDate?: string;                // target exam date if set
  performanceData: {
    subjectScores: Record<SubjectId, {
      totalAttempted: number;
      accuracy: number;             // 0-100
      avgTimePerQuestion: number;   // ms
      weakChapters: string[];       // chapter IDs with < 50% accuracy
      strongChapters: string[];     // chapter IDs with > 80% accuracy
    }>;
    overallAccuracy: number;
    streakDays: number;
    avgDailyQuestions: number;
  };
  previousPlan?: WeeklyPlan;        // last week's plan for continuity
  language: Language;
}
```

**Output**:
```typescript
interface WeeklyPlan {
  weekOf: string;                   // ISO date string
  summary: string;                  // "Focus on Organic Chemistry and Human Physiology this week"
  dailyPlans: DailyPlan[];          // 7 days
  weeklyGoal: string;               // "Improve Organic Chem accuracy from 42% to 55%"
}

interface DailyPlan {
  day: string;                      // "Monday", "Tuesday", etc.
  focusSubject: SubjectId;
  chapters: string[];               // chapter IDs to practice
  targetQuestions: number;          // how many questions to attempt
  estimatedMinutes: number;
  tip: string;                      // motivational/strategic tip
}
```

**Routing**: Always **Sonnet** (requires reasoning about performance patterns). Low frequency (1x/week), cost is negligible.

**Cache**: Store generated plan in Redux + AsyncStorage. Only regenerate on manual refresh or weekly cycle.

---

### 2.4 AI Mock Analysis

**What**: After completing a full mock test, AI provides a detailed performance report with patterns, weak areas, and strategy recommendations.

**Trigger**: Automatically after completing a Practice Exam (full-length mock).

**Input**:
```typescript
interface MockAnalysisRequest {
  session: PracticeExamSession;     // full session data
  historicalSessions: PracticeExamSession[]; // last 5 mocks for trend analysis
  exam: ExamType;
  language: Language;
}
```

**Output**:
```typescript
interface MockAnalysisResponse {
  overallVerdict: string;           // "Strong improvement in Physics, Chemistry needs attention"
  scoreBreakdown: {
    subjectId: SubjectId;
    verdict: 'strong' | 'improving' | 'needs-work' | 'critical';
    insight: string;                // "Your Organic Chemistry accuracy dropped from 65% to 48%"
    recommendation: string;         // "Revise reaction mechanisms — Chapters 11-13"
  }[];
  timeManagement: {
    verdict: string;                // "You spent too long on Q31-Q45 (Botany Section B)"
    suggestion: string;
  };
  comparedToPrevious: {
    scoreDelta: number;             // +12 or -5
    trend: 'improving' | 'stable' | 'declining';
    message: string;
  } | null;
  topPriorityActions: string[];     // top 3 things to focus on next
}
```

**Routing**: Always **Sonnet** (complex multi-subject analysis). Low frequency (~2-4 mocks/month per user).

**Cache**: Store analysis alongside the session in history. Never regenerate for the same session.

---

### 2.5 AI Concept Explainer

**What**: Deep-dive explanation of a concept, with examples, analogies, and exam relevance. Goes beyond the basic textbook explanation.

**Trigger**: "Explain this concept" button on chapter screens and during question review.

**Input**:
```typescript
interface ConceptExplainerRequest {
  conceptTag: string;               // e.g., "mitosis-vs-meiosis", "newtons-third-law"
  subjectId: SubjectId;
  chapterId: string;
  exam: ExamType;
  studentLevel: Stage;              // current stage for appropriate depth
  language: Language;
}
```

**Output**:
```typescript
interface ConceptExplainerResponse {
  title: string;
  explanation: string;              // markdown, 200-400 words
  analogy: string;                  // relatable analogy for Gen-Z
  examRelevance: string;            // "Asked 3 times in last 5 years in NEET"
  commonMistakes: string[];         // 2-3 common mistakes
  quickRecap: string;               // 2-line summary for revision
  source: 'pre-generated' | 'cache' | 'generated';
}
```

**Routing**:
- Check pre-generated concept bank first (Layer 1)
- Cache miss → **Sonnet** (needs depth and quality for concept explanations)

**Pre-Generation**: Generate for all chapters in syllabus (~500 NEET concepts, ~2,000 CUET concepts across all subjects). One-time batch job.

---

## 3. Stage Progression System

Students progress through stages based on cumulative practice performance. Stages determine question difficulty mix, feature unlocks, and AI interaction depth.

### 3.1 Stage Definitions

```typescript
type Stage = 'rookie' | 'learner' | 'achiever' | 'pro' | 'neet-ready';

interface StageConfig {
  id: Stage;
  name: string;
  emoji: string;
  minAccuracy: number;           // overall accuracy threshold to enter
  minQuestionsAttempted: number; // minimum total questions attempted
  difficultyMix: {
    easy: number;                // percentage
    medium: number;
    hard: number;
  };
  features: string[];            // features unlocked at this stage
}

const STAGES: StageConfig[] = [
  {
    id: 'rookie',
    name: 'Rookie',
    emoji: '🌱',
    minAccuracy: 0,
    minQuestionsAttempted: 0,
    difficultyMix: { easy: 70, medium: 25, hard: 5 },
    features: ['basic-mcq', 'true-false'],
  },
  {
    id: 'learner',
    name: 'Learner',
    emoji: '📚',
    minAccuracy: 40,
    minQuestionsAttempted: 200,
    difficultyMix: { easy: 40, medium: 45, hard: 15 },
    features: ['assertion-reasoning', 'match-the-following', 'fill-in-blanks'],
  },
  {
    id: 'achiever',
    name: 'Achiever',
    emoji: '⚡',
    minAccuracy: 55,
    minQuestionsAttempted: 800,
    difficultyMix: { easy: 20, medium: 50, hard: 30 },
    features: ['scenario-based', 'diagram-based'],
  },
  {
    id: 'pro',
    name: 'Pro',
    emoji: '🔥',
    minAccuracy: 70,
    minQuestionsAttempted: 2000,
    difficultyMix: { easy: 10, medium: 40, hard: 50 },
    features: ['logical-sequence', 'previous-year-papers'],
  },
  {
    id: 'neet-ready',
    name: 'NEET Ready',
    emoji: '🏆',
    minAccuracy: 80,
    minQuestionsAttempted: 5000,
    difficultyMix: { easy: 5, medium: 30, hard: 65 },
    features: ['full-mock-simulation', 'competitive-ranking'],
  },
];
```

### 3.2 Stage Evaluation

- Evaluated after every 50 questions attempted
- Promotion requires **both** accuracy AND question count thresholds
- No demotion (once achieved, stage is permanent)
- Stage badge shown on profile, leaderboard, and in squad

---

## 4. Question Types

### 4.1 Type Definitions

```typescript
type QuestionType =
  | 'mcq'                   // Standard 4-option MCQ (existing)
  | 'assertion-reasoning'    // Assertion + Reason with evaluation
  | 'match-the-following'    // Column A ↔ Column B matching
  | 'true-false'             // Statement true or false
  | 'diagram-based'          // Question with image/diagram
  | 'logical-sequence'       // Arrange in correct order
  | 'fill-in-blanks'         // Complete the sentence
  | 'scenario-based';        // Paragraph + linked MCQ

// Extended question interface (backward compatible with existing Question)
interface QuestionV2 {
  id: string;
  type: QuestionType;
  chapterId: string;
  subjectId: SubjectId;
  difficulty: Difficulty;
  stage: Stage;                     // minimum stage required

  // Common fields (bilingual)
  text: string;
  textTe: string;
  explanation: string;
  explanationTe: string;
  eliminationTechnique: string;
  eliminationTechniqueTe: string;

  // Type-specific payloads
  payload: QuestionPayload;

  // AI-generated metadata (for AI tier)
  aiMeta?: {
    conceptTags: string[];
    commonMistakes: string[];
    preGeneratedWrongAnswerAnalysis: Record<string, PreGeneratedWrongAnswer>;
    preGeneratedConceptExplanation?: string;
  };
}

// ── Payloads per question type ──

interface McqPayload {
  type: 'mcq';
  options: Option[];
  correctOptionId: string;
}

interface AssertionReasoningPayload {
  type: 'assertion-reasoning';
  assertion: string;
  assertionTe: string;
  reason: string;
  reasonTe: string;
  options: Option[];                // "Both A and R are true...", etc.
  correctOptionId: string;
}

interface MatchTheFollowingPayload {
  type: 'match-the-following';
  columnA: { id: string; text: string; textTe: string }[];
  columnB: { id: string; text: string; textTe: string }[];
  correctMapping: Record<string, string>; // columnA.id → columnB.id
  options: Option[];                // pre-formed match combos as MCQ options
  correctOptionId: string;
}

interface TrueFalsePayload {
  type: 'true-false';
  statement: string;
  statementTe: string;
  correctAnswer: boolean;
}

interface DiagramBasedPayload {
  type: 'diagram-based';
  imageUri: string;                 // CDN URL or local asset path
  imageAlt: string;                 // accessibility description
  options: Option[];
  correctOptionId: string;
}

interface LogicalSequencePayload {
  type: 'logical-sequence';
  items: { id: string; text: string; textTe: string }[];
  correctOrder: string[];           // ordered item IDs
  options: Option[];                // pre-formed sequence combos as MCQ options
  correctOptionId: string;
}

interface FillInBlanksPayload {
  type: 'fill-in-blanks';
  textWithBlanks: string;           // "The process of ___ converts light energy..."
  textWithBlanksTe: string;
  options: Option[];
  correctOptionId: string;
}

interface ScenarioBasedPayload {
  type: 'scenario-based';
  scenario: string;                 // long-form paragraph
  scenarioTe: string;
  options: Option[];
  correctOptionId: string;
}

type QuestionPayload =
  | McqPayload
  | AssertionReasoningPayload
  | MatchTheFollowingPayload
  | TrueFalsePayload
  | DiagramBasedPayload
  | LogicalSequencePayload
  | FillInBlanksPayload
  | ScenarioBasedPayload;
```

### 4.2 Stage → Question Type Unlock Matrix

| Stage | Available Question Types |
|-------|------------------------|
| Rookie | mcq, true-false |
| Learner | + assertion-reasoning, match-the-following, fill-in-blanks |
| Achiever | + scenario-based, diagram-based |
| Pro | + logical-sequence |
| NEET Ready | All types, full mock simulation |

---

## 5. Caching Architecture

### 5.1 Three-Layer Cache

```
┌──────────────────────────────────────────────────┐
│              Student asks a question              │
└──────────────────┬───────────────────────────────┘
                   ▼
┌──────────────────────────────────────────────────┐
│  Layer 1: Pre-Generated Content Cache            │
│  ─────────────────────────────────               │
│  • Wrong-answer analysis per (question × option) │
│  • Concept explanations per chapter/topic        │
│  • Stored server-side in DB/S3                   │
│  • Loaded to device per selected subjects        │
│  • Hit rate: 70-80% for wrong-answer analysis    │
│  • Hit rate: 60-70% for concept explanations     │
│  └─ HIT → return immediately                     │
│  └─ MISS → proceed to Layer 2                    │
└──────────────────┬───────────────────────────────┘
                   ▼
┌──────────────────────────────────────────────────┐
│  Layer 2: Semantic Response Cache                │
│  ───────────────────────────────                 │
│  • Server-side Redis/DynamoDB                    │
│  • Key: hash(subjectId + chapterId + query_norm) │
│  • query_norm: lowercased, stopwords removed     │
│  • TTL: 30 days                                  │
│  • Hit rate: 40-60% (NEET), 15-30% (CUET)       │
│  └─ HIT → return cached response                 │
│  └─ MISS → proceed to Layer 3                    │
└──────────────────┬───────────────────────────────┘
                   ▼
┌──────────────────────────────────────────────────┐
│  Layer 3: Live AI Generation                     │
│  ──────────────────────────                      │
│  • Classify complexity (simple / complex)        │
│  • Simple → Claude Haiku (fast, cheap)           │
│  • Complex → Claude Sonnet (capable, pricier)    │
│  • Claude prompt caching enabled (system prompt) │
│  • Response stored in Layer 2 for future hits    │
│  • Cost tracked per user for analytics           │
└──────────────────────────────────────────────────┘
```

### 5.2 Pre-Generated Content Scope

| Content Type | NEET Volume | CUET Volume | Generation Model | One-Time Cost |
|-------------|-------------|-------------|-----------------|---------------|
| Wrong-answer analysis | 30,000 entries | 120,000 entries | Haiku | ₹5,000–8,000 |
| Concept explanations | 500 concepts | 2,000 concepts | Sonnet | ₹8,000–15,000 |
| Question explanations | 15,000 questions | 60,000 questions | Haiku | ₹4,000–6,000 |
| **Total one-time** | | | | **₹17,000–29,000** |

### 5.3 Subject-Scoped Loading (CUET optimization)

CUET has 27+ subjects but each student picks 3-5. Only load pre-generated content for the student's selected subjects.

```typescript
interface SubjectContentPack {
  subjectId: SubjectId;
  version: number;
  wrongAnswerAnalysis: PreGeneratedWrongAnswer[];
  conceptExplanations: ConceptExplainerResponse[];
  sizeKb: number;                  // estimated 200-500 KB per subject
}

// On login / subject selection change:
// 1. Fetch content packs for selected subjects
// 2. Store in AsyncStorage with version tracking
// 3. Check for updates weekly (delta sync)
```

### 5.4 Claude Prompt Caching

Every AI call shares a common system prompt with NEET/CUET syllabus context. Claude's prompt caching reduces input token cost by ~90% for repeated system prompts.

```typescript
// System prompt structure (cached across all calls)
const SYSTEM_PROMPT = `
You are VaNi, an AI tutor for Indian students preparing for ${exam} exam.
Respond in ${language === 'te' ? 'Telugu' : 'English'}.
Keep explanations concise, exam-focused, and age-appropriate (15-18 years).
Use analogies that Indian Gen-Z students relate to.

Subject context: ${subjectSyllabusSnippet}
Chapter context: ${chapterTopics}

Format: Use markdown. Keep under 300 words unless explicitly asked for detail.
`;
// Mark as cacheable via API header: anthropic-beta: prompt-caching-2024-07-31
// First call: full price. Subsequent calls within 5 min: 90% discount on input.
```

---

## 6. API Design

### 6.1 Backend Endpoints

```
POST /api/ai/doubt-solver
POST /api/ai/wrong-answer-analysis
POST /api/ai/study-plan
POST /api/ai/mock-analysis
POST /api/ai/concept-explain
GET  /api/ai/usage                    # current usage count for rate limiting
GET  /api/content-packs/:subjectId    # download pre-generated content
```

### 6.2 Request Flow

```
Mobile App                    Backend API                  Claude API
    │                              │                           │
    │  POST /ai/doubt-solver       │                           │
    │  { query, subjectId, ... }   │                           │
    │─────────────────────────────►│                           │
    │                              │                           │
    │                              │ 1. Check rate limit       │
    │                              │ 2. Check Layer 1 cache    │
    │                              │ 3. Check Layer 2 cache    │
    │                              │    (Redis lookup)         │
    │                              │                           │
    │                              │ 4. Cache miss →           │
    │                              │    classify complexity    │
    │                              │                           │
    │                              │ 5. Call Claude API        │
    │                              │────────────────────────► │
    │                              │                           │
    │                              │◄────────────────────────│
    │                              │ 6. Store in Layer 2       │
    │                              │ 7. Track usage + cost     │
    │                              │                           │
    │◄─────────────────────────────│                           │
    │  { answer, relatedConcepts } │                           │
```

### 6.3 Rate Limiting

```typescript
interface AIRateLimits {
  doubtSolver: { daily: 50, perHour: 15 };
  wrongAnswerAnalysis: { daily: 100, perHour: 30 };   // auto-triggered, needs headroom
  studyPlan: { daily: 2, perHour: 1 };                // weekly feature
  mockAnalysis: { daily: 5, perHour: 2 };             // after each mock
  conceptExplainer: { daily: 30, perHour: 10 };
}
// Exceeding limit → soft block with message: "You've used all your AI queries for today. Come back tomorrow!"
// No hard cutoff — allow 10% overflow to avoid mid-interaction cutoff.
```

---

## 7. Model Routing

### 7.1 Routing Decision Tree

```typescript
type ModelChoice = 'haiku' | 'sonnet';

function routeModel(feature: AIFeature, complexity?: 'simple' | 'complex'): ModelChoice {
  switch (feature) {
    case 'doubt-solver':
      return complexity === 'complex' ? 'sonnet' : 'haiku';
    case 'wrong-answer-analysis':
      return 'haiku';              // always structured, Haiku handles well
    case 'study-plan':
      return 'sonnet';            // needs reasoning about patterns
    case 'mock-analysis':
      return 'sonnet';            // complex multi-subject analysis
    case 'concept-explainer':
      return 'sonnet';            // needs depth and analogies
    default:
      return 'haiku';
  }
}
```

### 7.2 Complexity Classifier (for Doubt Solver)

Quick Haiku call to classify before routing:

```typescript
// Classification prompt (cheap — ~50 tokens in, ~5 tokens out)
const classifyPrompt = `
Classify this student question as SIMPLE or COMPLEX.
SIMPLE: factual recall, definitions, single-concept.
COMPLEX: multi-step reasoning, cross-concept, numerical problem solving.
Question: "${studentQuery}"
Reply with one word: SIMPLE or COMPLEX
`;
// Cost: ~₹0.003 per classification
// Alternative: keyword-based heuristic (free, 80% accurate)
//   - Contains "why", "how", "compare", "difference" → COMPLEX
//   - Contains "what is", "define", "name" → SIMPLE
```

---

## 8. Cost Projections

### 8.1 Per-User Monthly Cost (with full caching)

| User Type | NEET Cost | CUET Cost | Revenue (Solo) | Margin |
|-----------|-----------|-----------|----------------|--------|
| Light (15 AI calls/day) | ₹25-35 | ₹40-55 | ₹499 | ₹445-475 |
| Average (30 calls/day) | ₹45-65 | ₹75-110 | ₹499 | ₹390-455 |
| Heavy (50+ calls/day) | ₹70-100 | ₹120-170 | ₹499 | ₹330-430 |

### 8.2 Squad Pricing Margins (AI Tier)

| Squad Size | Price/User | Avg NEET Cost | Avg CUET Cost | Margin/User |
|------------|-----------|---------------|---------------|-------------|
| Solo | ₹499 | ₹55 | ₹90 | ₹410-445 |
| Duo | ₹460 | ₹55 | ₹90 | ₹370-405 |
| Trio | ₹440 | ₹55 | ₹90 | ₹350-385 |
| Squad (4) | ₹400 | ₹55 | ₹90 | ₹310-345 |

### 8.3 Infrastructure Costs (at scale)

| Component | 1,000 users | 10,000 users | 50,000 users |
|-----------|------------|-------------|-------------|
| Claude API | ₹55,000-90,000/mo | ₹5-8L/mo | ₹25-40L/mo |
| Redis cache (AWS) | ₹2,000/mo | ₹8,000/mo | ₹25,000/mo |
| Backend server | ₹3,000/mo | ₹15,000/mo | ₹60,000/mo |
| Content CDN | ₹500/mo | ₹3,000/mo | ₹12,000/mo |
| **Total infra** | **₹60,000-95,000/mo** | **₹5.3-8.3L/mo** | **₹26-41L/mo** |
| Revenue (AI tier) | ₹5L/mo | ₹50L/mo | ₹2.5Cr/mo |
| **Gross margin** | **~82-88%** | **~83-89%** | **~84-90%** |

---

## 9. Data Models (Redux Integration)

### 9.1 New Slice: aiSlice

```typescript
interface AIState {
  // Usage tracking
  dailyUsage: {
    date: string;                   // ISO date
    doubtSolver: number;
    wrongAnswerAnalysis: number;
    conceptExplainer: number;
    studyPlan: number;
    mockAnalysis: number;
  };

  // Current study plan
  currentPlan: WeeklyPlan | null;
  planGeneratedAt: string | null;

  // Doubt solver history (last 20 for context)
  doubtHistory: {
    id: string;
    query: string;
    response: DoubtSolverResponse;
    subjectId: SubjectId;
    timestamp: string;
  }[];

  // Mock analyses (linked to practice sessions)
  mockAnalyses: Record<string, MockAnalysisResponse>; // sessionId → analysis

  // Student stage
  stage: Stage;
  stageProgress: {
    totalAttempted: number;
    overallAccuracy: number;
    lastEvaluatedAt: string;
  };

  // Subscription tier
  tier: 'free' | 'pro' | 'ai';
}
```

### 9.2 Persisted Fields

Add to AsyncStorage persistence in `src/store/index.ts`:

```typescript
// In store.subscribe:
const { auth, practice, squad, ai } = store.getState();
AsyncStorage.setItem(PERSIST_KEY, JSON.stringify({ auth, practice, squad, ai }));

// In rehydrateStore:
if (saved.ai) store.dispatch({ type: 'ai/rehydrate', payload: saved.ai });
```

---

## 10. POC Scope

### Phase 1 — POC (build first)

| Feature | Priority | Complexity |
|---------|----------|-----------|
| Stage progression system | P0 | Medium |
| QuestionV2 type system | P0 | Medium |
| AI Doubt Solver (Haiku only) | P0 | Medium |
| Wrong-Answer Analysis (pre-generated) | P0 | Low |
| Basic rate limiting | P0 | Low |
| aiSlice + persistence | P0 | Low |

### Phase 2 — Post-POC

| Feature | Priority | Complexity |
|---------|----------|-----------|
| AI Study Plan | P1 | High |
| AI Mock Analysis | P1 | High |
| AI Concept Explainer | P1 | Medium |
| Semantic cache (Redis) | P1 | Medium |
| Sonnet routing for complex queries | P1 | Low |
| Full pre-generated content pipeline | P1 | High |

### Phase 3 — Scale

| Feature | Priority | Complexity |
|---------|----------|-----------|
| Subject-scoped content packs (CUET) | P2 | High |
| Usage analytics dashboard | P2 | Medium |
| Cost monitoring + alerts | P2 | Medium |
| A/B test Haiku vs Sonnet quality | P2 | Low |

---

## 11. Backend Tech Stack (Recommended)

| Layer | Technology | Reason |
|-------|-----------|--------|
| API Server | Node.js + Express or Fastify | Same language as mobile team (TypeScript) |
| Database | PostgreSQL (Supabase) | Already using Supabase for auth |
| Cache | Redis (Upstash or AWS ElastiCache) | Serverless Redis, pay per request |
| AI SDK | @anthropic-ai/sdk | Official Claude TypeScript SDK |
| Content Storage | Supabase Storage or S3 | Pre-generated content + diagrams |
| Queue (for batch jobs) | BullMQ or Supabase Edge Functions | Pre-generation pipeline |
| Hosting | Supabase Edge Functions or AWS Lambda | Serverless, scales to zero |

---

## 12. Security & Guardrails

### 12.1 Prompt Injection Protection

- System prompt is server-side only, never exposed to client
- Student queries are sanitized (strip markdown, limit to 500 chars for doubt solver)
- AI responses are post-processed: strip any system prompt leaks, enforce max length

### 12.2 Content Safety

- All AI responses pass through a content filter before returning to student
- Flag and log any response containing inappropriate content
- Pre-generated content is human-reviewed in batches

### 12.3 Cost Protection

- Hard per-user daily cost cap: ₹25 (if user somehow burns through cache)
- Circuit breaker: if Claude API errors > 50% in 5 min, fallback to cached-only mode
- Monthly budget alerts at 80% and 100% of projected spend
