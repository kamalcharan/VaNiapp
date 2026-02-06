# VaNi AI & Agent Architecture Vision

> **Document Version:** 1.0
> **Last Updated:** February 2026
> **Status:** Foundation Document for AI Implementation

---

## Executive Summary

VaNi is not a question bank—it's an **AI-powered coaching system** that understands each student's unique learning journey. This document outlines the architecture, agents, and data flows that will power VaNi's intelligent capabilities.

**Core Philosophy:** "My Exam. My Way." — Every student gets a personalized path to exam success.

---

## 1. AI Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        VaNi AI Platform                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │   Student   │  │   Content   │  │   Exam      │            │
│  │   Profile   │  │   Catalog   │  │   Patterns  │            │
│  │   Store     │  │   Store     │  │   Store     │            │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘            │
│         │                │                │                    │
│         └────────────────┼────────────────┘                    │
│                          │                                     │
│                          ▼                                     │
│              ┌───────────────────────┐                         │
│              │   VaNi Brain (LLM)    │                         │
│              │   Claude / GPT-4o     │                         │
│              └───────────┬───────────┘                         │
│                          │                                     │
│         ┌────────────────┼────────────────┐                    │
│         ▼                ▼                ▼                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │  Question   │  │  Coaching   │  │  Analytics  │            │
│  │  Agent      │  │  Agent      │  │  Agent      │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Data Stores

### 2.1 Student Profile Store

Everything we know about a student that influences their learning.

```typescript
interface StudentProfile {
  // Identity
  id: string;
  exam: 'NEET' | 'CUET' | 'BOTH';
  subjects: string[];
  language: 'en' | 'te';

  // Learning State
  strengthByChapter: Map<ChapterId, StrengthLevel>;
  weakTopics: string[];
  strongTopics: string[];

  // Behavioral Patterns
  averageSessionDuration: number;  // minutes
  preferredQuestionTypes: QuestionType[];
  mistakePatterns: MistakePattern[];

  // Goals
  targetExamDate: Date | null;
  dailyQuestionGoal: number;
  weeklyHoursGoal: number;
}

type StrengthLevel =
  | 'just-started'    // 0-20% coverage
  | 'needs-focus'     // Low accuracy, needs attention
  | 'emerging'        // 20-40% with improving accuracy
  | 'developing'      // 40-60% coverage
  | 'proficient'      // 60-80% coverage
  | 'strong';         // 80%+ with high accuracy
```

### 2.2 Content Catalog Store

The syllabus, chapters, and topic hierarchy.

```typescript
interface ContentCatalog {
  exams: {
    NEET: NEETSyllabus;
    CUET: CUETSyllabus;
  };

  subjects: Map<SubjectId, {
    chapters: Chapter[];
    topicGraph: TopicDependencyGraph;
  }>;

  chapters: Map<ChapterId, {
    id: string;
    name: string;
    examIds: string[];           // Which exams include this
    branch: string;              // e.g., "Mechanics", "Organic Chemistry"
    classLevel: 11 | 12;
    weightage: number;           // % of exam marks
    avgQuestions: number;        // Historical exam frequency
    importantTopics: string[];
    prerequisites: ChapterId[];  // Must complete before this
    conceptMap: ConceptNode[];   // Topic hierarchy within chapter
  }>;
}
```

### 2.3 Exam Patterns Store

Historical patterns from actual exams.

```typescript
interface ExamPatterns {
  // Question distribution by year
  yearlyPatterns: Map<Year, {
    chapterFrequency: Map<ChapterId, number>;
    difficultyDistribution: DifficultyBreakdown;
    questionTypeDistribution: QuestionTypeBreakdown;
    repeatTopics: string[];  // Topics asked multiple years
  }>;

  // High-yield topics
  mustPrepareTopics: Map<ChapterId, string[]>;

  // Question templates
  commonQuestionPatterns: QuestionTemplate[];
}
```

---

## 3. Agent Specifications

### 3.1 Question Generation Agent

**Purpose:** Generate exam-quality questions that match real exam patterns.

```typescript
interface QuestionGenerationAgent {
  // Core function
  generateQuestions(request: QuestionRequest): Promise<Question[]>;

  // Request structure
  interface QuestionRequest {
    chapterId: string;
    topics?: string[];           // Specific topics, or null for chapter-wide
    difficulty: 'easy' | 'medium' | 'hard';
    questionType: QuestionType;
    count: number;

    // Context for personalization
    studentWeaknesses?: string[];
    avoidSimilarTo?: QuestionId[];  // Don't repeat recent questions
    examStyle: 'NEET' | 'CUET';
  }

  // Output structure
  interface Question {
    id: string;
    type: QuestionType;
    stem: string;                // Question text
    stemTe?: string;             // Telugu translation
    options: Option[];
    correctAnswer: string;
    explanation: string;
    explanationTe?: string;

    // Metadata
    chapterId: string;
    topics: string[];
    difficulty: 'easy' | 'medium' | 'hard';
    cognitiveLevel: 'recall' | 'understand' | 'apply' | 'analyze';
    estimatedTime: number;       // seconds

    // For diagram-based
    diagramUrl?: string;
    diagramAlt?: string;
  }
}
```

**Question Types Supported:**

| Type | Code | Description |
|------|------|-------------|
| Multiple Choice | `mcq` | Standard 4-option MCQ |
| Assertion-Reasoning | `assertion_reasoning` | Statement A and Reason R |
| Match the Following | `match_following` | Column matching |
| True/False | `true_false` | Statement verification |
| Diagram-Based | `diagram_based` | Questions with images |
| Logical Sequence | `logical_sequence` | Order/sequence questions |
| Fill in the Blanks | `fill_blanks` | Complete the statement |
| Scenario-Based | `scenario_based` | Case study questions |

**Generation Strategy:**

```
1. Retrieve chapter content and important topics
2. Check exam patterns for this chapter
3. Apply difficulty calibration based on student level
4. Generate question using LLM with exam-style prompt
5. Validate question quality (no ambiguity, correct answer verifiable)
6. Generate explanation with step-by-step reasoning
7. Translate to Telugu if student prefers bilingual
```

---

### 3.2 VaNi Coaching Agent

**Purpose:** The conversational AI coach that guides, motivates, and explains.

```typescript
interface CoachingAgent {
  // Personality
  personality: {
    name: 'VaNi';
    tone: 'warm' | 'encouraging' | 'focused';
    style: 'big-sister-mentor';  // Not teacher, not friend
  };

  // Core capabilities

  // 1. Explain wrong answers
  explainMistake(
    question: Question,
    studentAnswer: string,
    correctAnswer: string
  ): Promise<Explanation>;

  // 2. Generate study recommendations
  recommendNextAction(
    studentProfile: StudentProfile,
    recentPerformance: SessionStats
  ): Promise<Recommendation>;

  // 3. Motivational messages
  generateMotivation(
    context: 'session_start' | 'after_mistake' | 'streak_achieved' | 'daily_goal'
  ): Promise<string>;

  // 4. Answer student questions
  answerDoubt(
    question: string,
    context: {
      currentChapter: string;
      recentQuestions: Question[];
    }
  ): Promise<string>;
}

interface Explanation {
  summary: string;           // One-line takeaway
  stepByStep: string[];      // Detailed reasoning
  conceptsToReview: string[];
  similarQuestionHint: string;

  // Translations
  summaryTe?: string;
  stepByStepTe?: string[];
}

interface Recommendation {
  action: 'continue_chapter' | 'review_weak' | 'try_harder' | 'take_break';
  chapterId?: string;
  message: string;
  reason: string;
}
```

**VaNi's Voice Examples:**

| Context | Message Style |
|---------|---------------|
| First time on chapter | "Welcome to {chapter}! This one's fun — let's start with the basics." |
| After wrong answer | "Hmm, not quite. Let me show you how to think about this..." |
| After 5 correct streak | "You're on fire! 5 in a row — let's keep this momentum!" |
| Low accuracy session | "Tough session, but that's how we grow. Review these 3 concepts tomorrow." |
| Returning after break | "Welcome back! You were working on {chapter}. Ready to continue?" |

---

### 3.3 Adaptive Difficulty Agent

**Purpose:** Calibrate question difficulty to keep students in the "learning zone."

```typescript
interface AdaptiveDifficultyAgent {
  // Calculate next question difficulty
  getNextDifficulty(
    recentPerformance: AnswerHistory[],
    targetAccuracy: number  // Usually 70%
  ): 'easy' | 'medium' | 'hard';

  // Adjust question mix for a session
  calibrateSession(
    studentProfile: StudentProfile,
    sessionGoal: 'build_confidence' | 'challenge' | 'balanced'
  ): QuestionMixConfig;
}

interface QuestionMixConfig {
  // Difficulty percentages (sum to 100)
  easy_pct: number;
  medium_pct: number;
  hard_pct: number;

  // Question type percentages (sum to 100)
  mcq_pct: number;
  assertion_reasoning_pct: number;
  match_following_pct: number;
  // ... etc
}
```

**Calibration Algorithm:**

```
Target Accuracy = 70% (optimal learning zone)

If recent_accuracy > 85%:
  → Increase difficulty (student is ready for challenge)

If recent_accuracy < 50%:
  → Decrease difficulty (student needs confidence building)

If recent_accuracy 50-85%:
  → Maintain current level (optimal learning)

Special cases:
- New chapter: Start with 60% easy, 30% medium, 10% hard
- Returning to weak chapter: Start with 80% easy
- Pre-exam mode: Match actual exam distribution
```

---

### 3.4 Progress Analytics Agent

**Purpose:** Analyze patterns, predict outcomes, and identify intervention needs.

```typescript
interface AnalyticsAgent {
  // Strength assessment
  calculateChapterStrength(
    chapterId: string,
    answerHistory: AnswerHistory[]
  ): StrengthLevel;

  // Weakness detection
  identifyWeakTopics(
    studentId: string,
    timeRange: DateRange
  ): WeakTopic[];

  // Prediction
  predictExamReadiness(
    studentProfile: StudentProfile,
    examDate: Date
  ): ReadinessReport;

  // Intervention triggers
  detectAtRiskPatterns(
    studentId: string
  ): RiskAlert[];
}

interface WeakTopic {
  chapterId: string;
  topicName: string;
  accuracy: number;
  attemptCount: number;
  lastAttempted: Date;
  recommendedAction: string;
}

interface ReadinessReport {
  overallScore: number;        // 0-100
  subjectScores: Map<SubjectId, number>;
  strongChapters: ChapterId[];
  weakChapters: ChapterId[];
  coverageGaps: ChapterId[];   // Not practiced at all
  timeToReady: number;         // Estimated days
  recommendations: string[];
}

interface RiskAlert {
  type: 'inactivity' | 'declining_accuracy' | 'stuck_on_chapter' | 'cramming';
  severity: 'low' | 'medium' | 'high';
  message: string;
  suggestedIntervention: string;
}
```

---

### 3.5 Study Plan Agent

**Purpose:** Create and maintain personalized study schedules.

```typescript
interface StudyPlanAgent {
  // Generate initial plan
  createStudyPlan(
    studentProfile: StudentProfile,
    examDate: Date,
    hoursPerDay: number
  ): StudyPlan;

  // Daily adjustments
  adjustDailyPlan(
    originalPlan: StudyPlan,
    completedToday: CompletedItem[],
    availableTime: number
  ): DailyPlan;

  // Recovery from missed days
  recoverPlan(
    originalPlan: StudyPlan,
    missedDays: number
  ): RecoveryPlan;
}

interface StudyPlan {
  startDate: Date;
  examDate: Date;
  phases: StudyPhase[];
  dailyTargets: Map<Date, DailyTarget>;
}

interface StudyPhase {
  name: 'Foundation' | 'Building' | 'Practice' | 'Revision' | 'Mock Tests';
  startDate: Date;
  endDate: Date;
  focus: string;
  chapters: ChapterId[];
}

interface DailyTarget {
  date: Date;
  chapters: {
    chapterId: string;
    activity: 'new_learning' | 'practice' | 'revision';
    questionCount: number;
    estimatedMinutes: number;
  }[];
  totalQuestions: number;
  totalMinutes: number;
}
```

---

## 4. Integration Points

### 4.1 App ↔ AI Communication

```typescript
// API endpoints structure

// Question generation
POST /api/ai/questions/generate
Body: QuestionRequest
Response: Question[]

// Get VaNi's recommendation
POST /api/ai/vani/recommend
Body: { studentId, context }
Response: Recommendation

// Explain a mistake
POST /api/ai/vani/explain
Body: { questionId, studentAnswer }
Response: Explanation

// Analytics
GET /api/ai/analytics/strength/:chapterId
GET /api/ai/analytics/weak-topics
GET /api/ai/analytics/readiness
```

### 4.2 Real-time vs Batch Processing

| Operation | Mode | Latency Target |
|-----------|------|----------------|
| Generate next question | Real-time | < 2s |
| Explain mistake | Real-time | < 3s |
| VaNi motivation message | Real-time | < 1s |
| Calculate chapter strength | Batch | Daily |
| Update weak topics | Batch | After each session |
| Generate study plan | Batch | On-demand |
| Exam readiness report | Batch | Weekly |

### 4.3 Offline Considerations

For areas with poor connectivity:

```typescript
interface OfflineCapability {
  // Pre-cached content
  cachedQuestions: Map<ChapterId, Question[]>;  // 50 per chapter
  cachedExplanations: Map<QuestionId, Explanation>;

  // Sync on reconnect
  pendingAnswers: Answer[];       // Sync when online
  pendingProgress: ProgressDelta[];

  // Offline VaNi (rule-based fallback)
  offlineMessages: Map<Context, string[]>;
}
```

---

## 5. Data Flow Examples

### 5.1 Student Answers a Question

```
1. Student taps answer option
   ↓
2. App records: { questionId, studentAnswer, timeSpent }
   ↓
3. If WRONG:
   → Request explanation from Coaching Agent
   → Display VaNi's explanation with step-by-step
   → Update mistake patterns in profile
   ↓
4. If CORRECT:
   → Show brief positive feedback
   → If streak, celebrate
   ↓
5. Request next question from Question Agent
   → Considers updated difficulty calibration
   → Avoids recently seen question patterns
   ↓
6. Batch update (end of session):
   → Recalculate chapter strength
   → Update weak topics
   → Adjust study plan if needed
```

### 5.2 Student Opens the App (Returning User)

```
1. Fetch student profile and recent activity
   ↓
2. Analytics Agent calculates:
   → Days since last session
   → Current streak status
   → Any risk alerts
   ↓
3. Coaching Agent generates:
   → Personalized greeting
   → Today's recommendation
   ↓
4. App displays:
   → "Welcome back, {name}!"
   → VaNi's message with recommendation
   → Quick action to continue or review
```

---

## 6. Prompt Engineering Guidelines

### 6.1 Question Generation Prompt Structure

```
You are an expert {exam_type} exam question writer.

CONTEXT:
- Subject: {subject}
- Chapter: {chapter_name}
- Topics to cover: {topics}
- Difficulty: {difficulty}
- Question type: {question_type}

REQUIREMENTS:
1. Match the style of actual {exam_type} questions
2. Difficulty calibration:
   - Easy: Direct recall, single concept
   - Medium: Application of 1-2 concepts
   - Hard: Multi-step reasoning, common misconceptions
3. All options must be plausible (no obvious wrong answers)
4. Explanation must teach, not just state the answer

STUDENT CONTEXT:
- Weak areas: {weak_topics}
- Avoid similar to: {recent_question_patterns}

Generate {count} questions in the following JSON format:
{schema}
```

### 6.2 VaNi Coaching Voice Prompt

```
You are VaNi, an AI study coach for Indian students preparing for {exam_type}.

YOUR PERSONALITY:
- Warm and encouraging, like a supportive older sister
- Uses simple language, avoids jargon
- Celebrates small wins enthusiastically
- Frames failures as learning opportunities
- Occasionally uses light humor
- Understands the pressure of competitive exams

CURRENT CONTEXT:
- Student name: {name}
- Current chapter: {chapter}
- Recent accuracy: {accuracy}%
- Mood indicator: {session_going_well ? 'confident' : 'struggling'}

TASK: {specific_task}

Keep response under {max_words} words. Be genuine, not robotic.
```

---

## 7. Success Metrics

### 7.1 AI Quality Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Question relevance | > 95% | Human review sample |
| Explanation clarity | > 4.5/5 | Student ratings |
| Difficulty calibration accuracy | ± 10% | Predicted vs actual accuracy |
| VaNi message helpfulness | > 4/5 | Student ratings |
| Recommendation follow-through | > 60% | Clicks on recommendations |

### 7.2 Learning Outcome Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Accuracy improvement over 30 days | +15% | Before/after comparison |
| Chapter completion rate | > 70% | Started vs completed |
| Daily retention | > 40% | DAU / MAU |
| Exam score correlation | r > 0.7 | VaNi predicted vs actual |

---

## 8. Implementation Phases

### Phase 1: Foundation (Current → +2 months)
- [ ] Question generation for NEET Physics (all chapters)
- [ ] Basic VaNi coaching messages (pre-written templates)
- [ ] Simple difficulty calibration (3 levels)
- [ ] Chapter strength calculation

### Phase 2: Intelligence (+2 → +4 months)
- [ ] Full question generation (all subjects, both exams)
- [ ] Dynamic VaNi powered by LLM
- [ ] Adaptive difficulty with ML calibration
- [ ] Weak topic detection

### Phase 3: Personalization (+4 → +6 months)
- [ ] Study plan generation
- [ ] Exam readiness prediction
- [ ] Risk detection and intervention
- [ ] Telugu language support for all AI features

### Phase 4: Scale (+6 → +8 months)
- [ ] Real-time question generation (no pre-generation)
- [ ] Multi-turn VaNi conversations (doubt clearing)
- [ ] Peer comparison insights
- [ ] Parent/teacher dashboards

---

## 9. Technical Requirements

### 9.1 LLM Selection

| Use Case | Recommended Model | Fallback |
|----------|-------------------|----------|
| Question generation | Claude 3.5 Sonnet | GPT-4o |
| Explanations | Claude 3.5 Sonnet | GPT-4o |
| VaNi coaching | Claude 3 Haiku | GPT-4o-mini |
| Analytics/Classification | Fine-tuned smaller model | Rule-based |

### 9.2 Infrastructure

```
┌─────────────────────────────────────────────────────┐
│                    Edge (App)                       │
│  - Cached questions                                 │
│  - Offline VaNi templates                          │
│  - Local answer recording                          │
└────────────────────┬────────────────────────────────┘
                     │ HTTPS
                     ▼
┌─────────────────────────────────────────────────────┐
│                  API Gateway                        │
│  - Rate limiting                                    │
│  - Authentication                                   │
│  - Request routing                                  │
└────────────────────┬────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│  Question    │ │   Coaching   │ │  Analytics   │
│  Service     │ │   Service    │ │  Service     │
│              │ │              │ │              │
│  - Generate  │ │  - VaNi LLM  │ │  - Strength  │
│  - Validate  │ │  - Templates │ │  - Patterns  │
│  - Cache     │ │  - Context   │ │  - Predict   │
└──────┬───────┘ └──────┬───────┘ └──────┬───────┘
       │                │                │
       └────────────────┼────────────────┘
                        ▼
              ┌──────────────────┐
              │   LLM Gateway    │
              │  (Claude API)    │
              └──────────────────┘
```

### 9.3 Cost Estimation

| Operation | Tokens (avg) | Cost/1000 ops | Daily volume | Daily cost |
|-----------|--------------|---------------|--------------|------------|
| Generate question | 800 | $0.024 | 10,000 | $0.24 |
| Explain mistake | 500 | $0.015 | 5,000 | $0.075 |
| VaNi message | 150 | $0.003 | 20,000 | $0.06 |
| **Total** | | | | **~$0.38/day** |

*At 1000 DAU. Scales linearly.*

---

## 10. Open Questions

1. **Question Bank vs Pure Generation:** Should we pre-generate and cache questions, or generate fully on-demand? Trade-off between cost and freshness.

2. **VaNi Memory:** How much conversation history should VaNi remember? Full session? Last 5 interactions? Summarized context?

3. **Telugu Generation Quality:** Can LLMs generate quality Telugu content, or do we need human translation + LLM adaptation?

4. **Diagram Questions:** How do we handle diagram-based questions? Pre-made diagrams with templated questions? AI-generated diagrams?

5. **Cheating Prevention:** How do we prevent students from using ChatGPT to answer VaNi's questions? Does it matter if they learn in the process?

---

## Appendix A: Database Schema (AI-Related)

```sql
-- AI-generated questions cache
CREATE TABLE ai_questions (
  id UUID PRIMARY KEY,
  chapter_id TEXT NOT NULL,
  question_type TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  exam_style TEXT NOT NULL,
  stem TEXT NOT NULL,
  stem_te TEXT,
  options JSONB NOT NULL,
  correct_answer TEXT NOT NULL,
  explanation TEXT NOT NULL,
  explanation_te TEXT,
  topics TEXT[],
  cognitive_level TEXT,
  estimated_time_seconds INT,
  generation_model TEXT,
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  usage_count INT DEFAULT 0,
  avg_accuracy FLOAT,
  flagged BOOLEAN DEFAULT FALSE
);

-- Student answer history (for analytics)
CREATE TABLE student_answers (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  question_id UUID REFERENCES ai_questions,
  session_id UUID,
  answer_given TEXT,
  is_correct BOOLEAN,
  time_spent_seconds INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chapter strength snapshots
CREATE TABLE chapter_strength (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  chapter_id TEXT NOT NULL,
  strength_level TEXT NOT NULL,
  accuracy FLOAT,
  questions_attempted INT,
  last_practiced TIMESTAMPTZ,
  calculated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, chapter_id)
);

-- VaNi interaction logs
CREATE TABLE vani_interactions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  interaction_type TEXT,  -- 'greeting', 'explanation', 'motivation', 'recommendation'
  context JSONB,
  vani_message TEXT,
  user_feedback INT,  -- 1-5 rating, null if not rated
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Appendix B: Sample VaNi Messages

### Session Start
```
Just started: "Ready to tackle {chapter}? Let's warm up with some basics!"
Returning: "Welcome back! You were crushing {chapter} last time. Pick up where you left off?"
After break: "I missed you! It's been {days} days. No worries, let's ease back in."
```

### After Correct Answer
```
Normal: "Correct! ✓"
Streak 3: "That's 3 in a row! You're getting the hang of this."
Streak 5: "5 correct! You're on fire! 🔥"
Streak 10: "10 streak! You're absolutely nailing this chapter!"
Hard question: "Wow, that was a tough one and you got it! Impressive."
```

### After Wrong Answer
```
First mistake: "Not quite, but that's okay! Here's how to think about it..."
Common mistake: "Ah, this trips up a lot of students. The key thing to remember is..."
After explanation: "Make sense? This concept will definitely show up in the exam."
Repeated mistake: "Hmm, let's try a different approach to understand this..."
```

### End of Session
```
Good session: "Great session! You attempted {n} questions with {acc}% accuracy. See you tomorrow!"
Tough session: "Tough one today, but you pushed through. Tomorrow's a new day!"
Goal achieved: "Daily goal smashed! 🎯 You're building great habits."
Short session: "Quick session today! Every question counts. See you soon!"
```

---

*This document serves as the foundation for VaNi's AI capabilities. It should be updated as we learn from real student interactions and refine our approach.*
