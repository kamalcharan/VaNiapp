# QBank Agent: Question Generation Methodology

> **Document Version:** 1.0
> **Last Updated:** February 2026
> **Status:** Foundation Document for Question Generation System

---

## 1. Current State Overview

### 1.1 What Exists

| Component | Status | Location |
|-----------|--------|----------|
| Question types (8) | Defined | `src/types/index.ts` |
| QuestionV2 structure | Defined | `src/types/index.ts` |
| Sample questions | 15 examples | `src/data/questions/sample-v2-questions.ts` |
| OpenAI client | POC ready | `src/lib/aiClient.ts` |
| Doubt solver | Working | `src/lib/aiClient.ts` |
| Question mix config | DB table exists | `med_question_mix_defaults` |
| Strength levels | Defined | `src/types/index.ts` |

### 1.2 What's Missing

- [ ] Question generation agent (this document)
- [ ] Prompt templates per question type
- [ ] Quality validation pipeline
- [ ] Batch generation & caching system
- [ ] Telugu generation or translation
- [ ] Diagram handling for diagram-based questions

---

## 2. Question Type Specifications

### 2.1 The 8 Question Types

```typescript
type QuestionType =
  | 'mcq'                    // Standard 4-option multiple choice
  | 'assertion-reasoning'    // Statement A is true, R is the reason
  | 'match-the-following'    // Column A ↔ Column B matching
  | 'true-false'             // Statement verification
  | 'diagram-based'          // Questions with images/diagrams
  | 'logical-sequence'       // Arrange in correct order
  | 'fill-in-blanks'         // Complete the statement
  | 'scenario-based';        // Case study / application
```

### 2.2 Unlock Progression

Questions unlock based on student's **strength level** in a chapter:

| Strength Level | Coverage | Accuracy | Unlocked Types |
|----------------|----------|----------|----------------|
| Just Started | 0% | 0% | mcq, true-false |
| Getting There | 20% | 40% | + assertion-reasoning, match-the-following, fill-in-blanks |
| On Track | 40% | 55% | + scenario-based, diagram-based |
| Strong | 60% | 70% | + logical-sequence (all types) |

### 2.3 Question Mix by Exam

**NEET Pattern:**
```
mcq: 60%
assertion_reasoning: 15%
match_following: 10%
true_false: 5%
diagram_based: 5%
scenario_based: 3%
fill_blanks: 2%
```

**CUET Pattern:**
```
mcq: 70%
assertion_reasoning: 10%
match_following: 5%
true_false: 5%
fill_blanks: 5%
scenario_based: 5%
```

---

## 3. Question Generation Pipeline

### 3.1 High-Level Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                    QUESTION GENERATION PIPELINE                   │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. REQUEST                                                      │
│     ↓                                                            │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ Input: chapter_id, question_type, difficulty, count     │    │
│  │        exam_style, avoid_similar_to[], student_context  │    │
│  └─────────────────────────────────────────────────────────┘    │
│     ↓                                                            │
│  2. CONTEXT ENRICHMENT                                           │
│     ↓                                                            │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ • Fetch chapter syllabus from med_chapters              │    │
│  │ • Get important_topics for this chapter                 │    │
│  │ • Load exam patterns (weightage, frequency)             │    │
│  │ • Check student weak topics (if personalized)           │    │
│  └─────────────────────────────────────────────────────────┘    │
│     ↓                                                            │
│  3. PROMPT CONSTRUCTION                                          │
│     ↓                                                            │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ • Select type-specific prompt template                  │    │
│  │ • Inject context (chapter, topics, difficulty)          │    │
│  │ • Add anti-patterns (avoid_similar_to)                  │    │
│  │ • Set output schema (JSON structure)                    │    │
│  └─────────────────────────────────────────────────────────┘    │
│     ↓                                                            │
│  4. LLM GENERATION                                               │
│     ↓                                                            │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ • Call Claude/GPT with constructed prompt               │    │
│  │ • Parse JSON response                                   │    │
│  │ • Validate schema compliance                            │    │
│  └─────────────────────────────────────────────────────────┘    │
│     ↓                                                            │
│  5. QUALITY VALIDATION                                           │
│     ↓                                                            │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ • Check correct answer is verifiable                    │    │
│  │ • Ensure all options are plausible                      │    │
│  │ • Validate difficulty matches request                   │    │
│  │ • Check for factual accuracy (optional LLM review)      │    │
│  │ • Flag if needs human review                            │    │
│  └─────────────────────────────────────────────────────────┘    │
│     ↓                                                            │
│  6. STORAGE & CACHE                                              │
│     ↓                                                            │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ • Store in ai_questions table                           │    │
│  │ • Index by chapter, type, difficulty                    │    │
│  │ • Pre-cache for offline use                             │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### 3.2 Request Interface

```typescript
interface QuestionGenerationRequest {
  // Required
  chapterId: string;
  questionType: QuestionType;
  difficulty: 'easy' | 'medium' | 'hard';
  examStyle: 'NEET' | 'CUET';
  count: number;                    // 1-10 questions per call

  // Optional - for personalization
  focusTopics?: string[];           // Specific topics to cover
  avoidSimilarTo?: string[];        // Question IDs to avoid duplicating
  studentWeakTopics?: string[];     // Topics student struggles with
  cognitiveLevel?: 'recall' | 'understand' | 'apply' | 'analyze';
}

interface GeneratedQuestion {
  id: string;                       // Generated UUID
  type: QuestionType;
  chapterId: string;
  subjectId: string;
  difficulty: 'easy' | 'medium' | 'hard';

  // Content
  text: string;                     // Question stem
  textTe?: string;                  // Telugu translation
  explanation: string;              // Detailed explanation
  explanationTe?: string;
  eliminationTechnique: string;     // How to eliminate wrong options
  eliminationTechniqueTe?: string;

  // Type-specific payload (varies by type)
  payload: QuestionPayload;

  // Metadata
  topics: string[];
  cognitiveLevel: string;
  estimatedTimeSeconds: number;
  generatedAt: string;
  generationModel: string;
}
```

---

## 4. Prompt Templates by Question Type

### 4.1 System Prompt (Common Base)

```
You are an expert question writer for the {exam_type} exam in India.

Your role is to create high-quality practice questions that:
1. Match the style and difficulty of actual {exam_type} papers
2. Test genuine understanding, not just memorization
3. Have plausible distractors (wrong options that test common misconceptions)
4. Include clear, educational explanations

CRITICAL RULES:
- Every question must have ONE unambiguous correct answer
- All scientific facts must be accurate and up-to-date
- Difficulty must match the requested level precisely
- Options should be roughly equal in length (no "obviously long" correct answer)
- Never use "All of the above" or "None of the above"

OUTPUT: Return valid JSON matching the exact schema provided.
```

### 4.2 MCQ Prompt Template

```
TASK: Generate {count} MCQ questions for {exam_type} exam.

CHAPTER: {chapter_name}
SUBJECT: {subject_name}
TOPICS TO COVER: {topics}
DIFFICULTY: {difficulty}

DIFFICULTY CALIBRATION:
- Easy: Direct recall of facts, single concept, straightforward calculation
- Medium: Application of concept, 2-step reasoning, compare/contrast
- Hard: Multi-concept integration, edge cases, common misconceptions as distractors

AVOID PATTERNS SIMILAR TO:
{recent_question_stems}

OUTPUT SCHEMA:
{
  "questions": [
    {
      "stem": "Question text here?",
      "options": [
        {"id": "A", "text": "Option A text"},
        {"id": "B", "text": "Option B text"},
        {"id": "C", "text": "Option C text"},
        {"id": "D", "text": "Option D text"}
      ],
      "correctOptionId": "B",
      "explanation": "Detailed explanation of why B is correct and others are wrong...",
      "eliminationTechnique": "A is wrong because X. C is wrong because Y. D is wrong because Z.",
      "topics": ["specific-topic-1", "specific-topic-2"],
      "cognitiveLevel": "understand"
    }
  ]
}
```

### 4.3 Assertion-Reasoning Prompt Template

```
TASK: Generate {count} Assertion-Reasoning questions for {exam_type} exam.

CHAPTER: {chapter_name}
SUBJECT: {subject_name}
DIFFICULTY: {difficulty}

FORMAT:
Assertion (A): [Statement that may be true or false]
Reason (R): [Statement that may be true or false and may or may not explain A]

STANDARD OPTIONS:
A) Both A and R are correct and R is the correct explanation of A
B) Both A and R are correct but R is NOT the correct explanation of A
C) A is correct but R is incorrect
D) A is incorrect but R is correct

DISTRIBUTION:
- Ensure variety: don't make all answers option A
- Include cases where both are true but unrelated (option B)
- Include cases with one false statement (options C, D)

OUTPUT SCHEMA:
{
  "questions": [
    {
      "assertion": "The assertion statement here.",
      "reason": "The reason statement here.",
      "correctOptionId": "B",
      "explanation": "Assertion is true because... Reason is true because... However, R does not explain A because...",
      "eliminationTechnique": "First verify A independently. Then verify R. Finally check if R explains A.",
      "topics": ["topic-1"],
      "cognitiveLevel": "analyze"
    }
  ]
}
```

### 4.4 Match-the-Following Prompt Template

```
TASK: Generate {count} Match-the-Following questions for {exam_type} exam.

CHAPTER: {chapter_name}
SUBJECT: {subject_name}

FORMAT:
Column A (4-5 items): Terms, processes, structures, scientists
Column B (4-5 items): Definitions, functions, discoveries, years

After matching, provide 4 MCQ options like:
A) A-1, B-2, C-3, D-4
B) A-2, B-1, C-4, D-3
...etc

RULES:
- Items should be clearly matchable (not ambiguous)
- Include at least one close pair that requires careful thinking
- All items in both columns must be used

OUTPUT SCHEMA:
{
  "questions": [
    {
      "stem": "Match Column A with Column B:",
      "columnA": [
        {"id": "A", "text": "Item A"},
        {"id": "B", "text": "Item B"},
        {"id": "C", "text": "Item C"},
        {"id": "D", "text": "Item D"}
      ],
      "columnB": [
        {"id": "1", "text": "Match 1"},
        {"id": "2", "text": "Match 2"},
        {"id": "3", "text": "Match 3"},
        {"id": "4", "text": "Match 4"}
      ],
      "correctMapping": {"A": "2", "B": "4", "C": "1", "D": "3"},
      "options": [
        {"id": "opt1", "text": "A-2, B-4, C-1, D-3"},
        {"id": "opt2", "text": "A-1, B-4, C-2, D-3"},
        {"id": "opt3", "text": "A-2, B-3, C-1, D-4"},
        {"id": "opt4", "text": "A-1, B-3, C-2, D-4"}
      ],
      "correctOptionId": "opt1",
      "explanation": "A matches with 2 because... B matches with 4 because...",
      "topics": ["topic-1"]
    }
  ]
}
```

### 4.5 True-False Prompt Template

```
TASK: Generate {count} True/False questions for {exam_type} exam.

CHAPTER: {chapter_name}
SUBJECT: {subject_name}
DIFFICULTY: {difficulty}

GUIDELINES:
- Statement should be clearly true OR clearly false (no ambiguity)
- False statements should contain a specific error (not vague)
- Mix of true and false (roughly 50-50)
- For false statements, the error should be subtle for hard difficulty

OUTPUT SCHEMA:
{
  "questions": [
    {
      "statement": "The statement to evaluate.",
      "correctAnswer": true,
      "explanation": "This is true because... The key concept here is...",
      "topics": ["topic-1"],
      "cognitiveLevel": "recall"
    }
  ]
}
```

### 4.6 Fill-in-Blanks Prompt Template

```
TASK: Generate {count} Fill-in-the-Blanks questions for {exam_type} exam.

CHAPTER: {chapter_name}
SUBJECT: {subject_name}

FORMAT:
Statement with _____ for the blank.
4 options to fill the blank.

RULES:
- The blank should test a key term/concept/value
- All options should be grammatically valid in the blank
- Distractors should be from the same category (e.g., all numbers, all organ names)

OUTPUT SCHEMA:
{
  "questions": [
    {
      "textWithBlanks": "The process of _____ is responsible for oxygen production.",
      "options": [
        {"id": "A", "text": "photosynthesis"},
        {"id": "B", "text": "respiration"},
        {"id": "C", "text": "fermentation"},
        {"id": "D", "text": "transpiration"}
      ],
      "correctOptionId": "A",
      "explanation": "Photosynthesis is the process where plants use sunlight to convert CO2 and water into glucose and oxygen...",
      "topics": ["photosynthesis"]
    }
  ]
}
```

### 4.7 Logical-Sequence Prompt Template

```
TASK: Generate {count} Logical Sequence questions for {exam_type} exam.

CHAPTER: {chapter_name}
SUBJECT: {subject_name}

FORMAT:
Given items that need to be arranged in correct order.
4 MCQ options showing different orderings.

TYPES OF SEQUENCES:
- Process steps (e.g., stages of mitosis)
- Historical timeline (e.g., discoveries in order)
- Increasing/decreasing order (e.g., electronegativity)
- Cause-effect chain

OUTPUT SCHEMA:
{
  "questions": [
    {
      "stem": "Arrange the following stages of mitosis in correct order:",
      "items": [
        {"id": "P", "text": "Metaphase"},
        {"id": "Q", "text": "Anaphase"},
        {"id": "R", "text": "Prophase"},
        {"id": "S", "text": "Telophase"}
      ],
      "correctOrder": ["R", "P", "Q", "S"],
      "options": [
        {"id": "A", "text": "R → P → Q → S"},
        {"id": "B", "text": "P → R → Q → S"},
        {"id": "C", "text": "R → Q → P → S"},
        {"id": "D", "text": "P → Q → R → S"}
      ],
      "correctOptionId": "A",
      "explanation": "Mitosis proceeds as: Prophase (chromosomes condense) → Metaphase (align at center) → Anaphase (separate) → Telophase (nuclear envelope reforms)...",
      "topics": ["cell-division", "mitosis"]
    }
  ]
}
```

### 4.8 Scenario-Based Prompt Template

```
TASK: Generate {count} Scenario-Based questions for {exam_type} exam.

CHAPTER: {chapter_name}
SUBJECT: {subject_name}
DIFFICULTY: {difficulty}

FORMAT:
A real-world scenario or case study (2-4 sentences).
Question based on the scenario.
4 MCQ options.

SCENARIO TYPES:
- Clinical case (for biology/medicine)
- Lab experiment observation
- Environmental situation
- Industrial application
- Daily life phenomenon

RULES:
- Scenario must be realistic and relevant
- Question should require applying knowledge, not just recall
- Answer should be derivable from the scenario + chapter concepts

OUTPUT SCHEMA:
{
  "questions": [
    {
      "scenario": "A farmer notices that his crop yield has decreased despite adequate watering. Upon testing, the soil pH is found to be 4.2. The crops are wheat, which grows best at pH 6-7.",
      "stem": "What is the most likely cause of reduced yield and the recommended solution?",
      "options": [
        {"id": "A", "text": "Soil is too acidic; add calcium carbonate"},
        {"id": "B", "text": "Soil is too alkaline; add sulfur"},
        {"id": "C", "text": "Nutrient deficiency; add NPK fertilizer"},
        {"id": "D", "text": "Waterlogging; improve drainage"}
      ],
      "correctOptionId": "A",
      "explanation": "pH 4.2 is acidic (below 7). Wheat requires pH 6-7. To raise soil pH, calcium carbonate (lime) is added. This neutralizes the acid...",
      "topics": ["soil-pH", "agriculture"]
    }
  ]
}
```

### 4.9 Diagram-Based (Special Handling)

Diagram-based questions require pre-existing diagrams. Two approaches:

**Approach A: Pre-made Diagram Library**
```
1. Curate a library of diagrams per chapter:
   - Cell structure, heart anatomy, circuit diagrams, etc.
2. Store diagram metadata:
   - diagram_id, chapter_id, labels, type
3. Generate questions referencing existing diagrams:
   - "In the diagram shown, identify part X"
   - "What is the function of the labeled structure?"
```

**Approach B: Text-Described Diagrams**
```
For POC, describe diagrams textually:
{
  "diagramDescription": "A diagram showing a plant cell with labeled parts A, B, C, D pointing to cell wall, chloroplast, vacuole, and nucleus respectively.",
  "stem": "Which labeled part is responsible for photosynthesis?",
  "options": [...],
  "correctOptionId": "B",
  "imageUri": null  // To be added later
}
```

---

## 5. Quality Validation Pipeline

### 5.1 Automated Checks

```typescript
interface QualityCheck {
  name: string;
  check: (question: GeneratedQuestion) => ValidationResult;
}

const QUALITY_CHECKS: QualityCheck[] = [
  {
    name: 'has_correct_answer',
    check: (q) => {
      // Ensure correctOptionId exists in options
      const optionIds = q.payload.options?.map(o => o.id) || [];
      return {
        passed: optionIds.includes(q.payload.correctOptionId),
        message: 'Correct answer must be one of the options'
      };
    }
  },
  {
    name: 'options_roughly_equal_length',
    check: (q) => {
      if (!q.payload.options) return { passed: true };
      const lengths = q.payload.options.map(o => o.text.length);
      const avg = lengths.reduce((a, b) => a + b, 0) / lengths.length;
      const maxDeviation = Math.max(...lengths.map(l => Math.abs(l - avg)));
      return {
        passed: maxDeviation < avg * 0.5, // No option 50% longer/shorter than avg
        message: 'Options should be roughly equal length'
      };
    }
  },
  {
    name: 'no_obviously_wrong',
    check: (q) => {
      // Check for patterns like "None of above", "All of above"
      const badPatterns = ['none of the above', 'all of the above', 'both a and b'];
      const hasBad = q.payload.options?.some(o =>
        badPatterns.some(p => o.text.toLowerCase().includes(p))
      );
      return {
        passed: !hasBad,
        message: 'Avoid "None/All of the above" options'
      };
    }
  },
  {
    name: 'has_explanation',
    check: (q) => ({
      passed: q.explanation && q.explanation.length > 50,
      message: 'Explanation must be substantial (>50 chars)'
    })
  },
  {
    name: 'has_topics',
    check: (q) => ({
      passed: q.topics && q.topics.length > 0,
      message: 'At least one topic must be tagged'
    })
  }
];
```

### 5.2 LLM-Based Fact Check (Optional)

For high-stakes questions (hard difficulty, exam mode):

```
TASK: Verify the following question for factual accuracy.

QUESTION:
{question_text}

CORRECT ANSWER: {correct_answer}
EXPLANATION: {explanation}

CHECK:
1. Is the correct answer factually accurate?
2. Is the explanation scientifically correct?
3. Are there any ambiguities that could make multiple answers valid?
4. Rate confidence: HIGH / MEDIUM / LOW

If LOW confidence or any issues found, explain what needs review.
```

### 5.3 Human Review Queue

Questions flagged for review:
- Fact-check confidence < HIGH
- Diagram-based questions
- Questions with negative marking impact (NEET)
- First 10 questions per chapter (calibration)

---

## 6. Difficulty Calibration

### 6.1 Difficulty Definitions

| Difficulty | Cognitive Load | Concepts | Time | Trap Level |
|------------|----------------|----------|------|------------|
| Easy | Recall | 1 concept | 30s | No traps |
| Medium | Understand/Apply | 1-2 concepts | 60s | 1 plausible distractor |
| Hard | Analyze/Evaluate | 2-3 concepts | 90s | 2 plausible distractors |

### 6.2 Subject-Specific Guidelines

**Physics:**
- Easy: Direct formula application, single-step calculation
- Medium: 2-step problems, unit conversion required
- Hard: Multi-concept (e.g., mechanics + energy), edge cases

**Chemistry:**
- Easy: Identify compound, name reaction type
- Medium: Predict products, balance equations
- Hard: Mechanism steps, compare reaction rates

**Biology (Botany/Zoology):**
- Easy: Name the structure, recall definition
- Medium: Compare structures, explain function
- Hard: Disease mechanism, evolutionary reasoning

### 6.3 Calibration Feedback Loop

```
1. Generate questions at requested difficulty
2. Track actual student accuracy on each question
3. If actual accuracy differs significantly from expected:
   - Easy: Expected 80%+, Actual < 60% → recalibrate as medium
   - Medium: Expected 50-70%, Actual > 85% → recalibrate as easy
   - Hard: Expected 30-50%, Actual > 70% → recalibrate as medium
4. Feed recalibrated difficulty back into prompt examples
```

---

## 7. Telugu Translation Strategy

### 7.1 Approach Options

| Approach | Quality | Cost | Speed |
|----------|---------|------|-------|
| LLM Translation | 70-80% | Low | Fast |
| Human Translation | 95%+ | High | Slow |
| Hybrid (LLM + Review) | 90% | Medium | Medium |

### 7.2 Recommended Hybrid Approach

```
1. Generate English question with high-quality LLM (Claude/GPT-4)
2. Translate to Telugu using LLM with specific prompt:

   "Translate the following {exam_type} question to Telugu.
    Keep scientific terms in English with Telugu transliteration.
    Maintain the exact meaning and difficulty.
    Use formal Telugu suitable for Class 11-12 students."

3. Queue for human review if:
   - Question is hard difficulty
   - Contains numerical calculations
   - Has technical terms

4. Build glossary of standard translations:
   - "Photosynthesis" → "ఫోటోసింథసిస్ (కిరణజన్య సంయోగక్రియ)"
   - Store in `med_translation_glossary` table
```

### 7.3 Fields to Translate

```typescript
interface BilingualQuestion {
  // Always translate
  text: string;
  textTe: string;
  explanation: string;
  explanationTe: string;

  // Translate option text
  options: {
    id: string;
    text: string;
    textTe: string;
  }[];

  // Usually keep in English (technical)
  eliminationTechnique: string;
  eliminationTechniqueTe: string;  // Optional
}
```

---

## 8. Caching & Storage Strategy

### 8.1 Pre-Generation Strategy

Instead of generating on-demand (slow, costly), pre-generate:

```
Per Chapter:
├── easy/
│   ├── mcq (30 questions)
│   ├── true-false (20 questions)
│   └── fill-blanks (20 questions)
├── medium/
│   ├── mcq (40 questions)
│   ├── assertion-reasoning (20 questions)
│   ├── match-following (15 questions)
│   └── scenario-based (10 questions)
└── hard/
    ├── mcq (30 questions)
    ├── assertion-reasoning (15 questions)
    ├── diagram-based (10 questions)
    └── logical-sequence (10 questions)

Total: ~220 questions per chapter
```

### 8.2 Database Schema

```sql
CREATE TABLE ai_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Classification
  chapter_id TEXT NOT NULL REFERENCES med_chapters(id),
  subject_id TEXT NOT NULL,
  question_type TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  exam_style TEXT NOT NULL,  -- 'NEET' or 'CUET'

  -- Content (English)
  stem TEXT NOT NULL,
  options JSONB,  -- Array of {id, text}
  correct_answer TEXT NOT NULL,
  explanation TEXT NOT NULL,
  elimination_technique TEXT,

  -- Content (Telugu)
  stem_te TEXT,
  options_te JSONB,
  explanation_te TEXT,
  elimination_technique_te TEXT,

  -- Type-specific data
  payload JSONB,  -- assertion/reason text, columns for match, scenario, etc.

  -- Metadata
  topics TEXT[] DEFAULT '{}',
  cognitive_level TEXT,
  estimated_time_seconds INT DEFAULT 60,

  -- Generation info
  generation_model TEXT,
  generation_prompt_version TEXT,
  generated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Quality tracking
  human_reviewed BOOLEAN DEFAULT FALSE,
  flagged BOOLEAN DEFAULT FALSE,
  flag_reason TEXT,
  usage_count INT DEFAULT 0,
  correct_count INT DEFAULT 0,
  avg_time_seconds FLOAT,

  -- Calculated accuracy (updated periodically)
  actual_accuracy FLOAT,  -- correct_count / usage_count
  calibrated_difficulty TEXT,  -- May differ from original difficulty

  -- Indexes
  is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_ai_questions_chapter ON ai_questions(chapter_id, is_active);
CREATE INDEX idx_ai_questions_type ON ai_questions(question_type, difficulty, is_active);
CREATE INDEX idx_ai_questions_topics ON ai_questions USING GIN(topics);
```

### 8.3 Cache Warming

Run batch generation job:

```python
# Pseudo-code for batch generation
for chapter in all_chapters:
    for difficulty in ['easy', 'medium', 'hard']:
        for qtype in get_types_for_difficulty(difficulty):
            count = get_target_count(difficulty, qtype)
            existing = count_existing(chapter, difficulty, qtype)

            if existing < count:
                generate_questions(
                    chapter=chapter,
                    difficulty=difficulty,
                    qtype=qtype,
                    count=count - existing
                )
```

---

## 9. Integration with App

### 9.1 Question Fetch Flow

```typescript
async function getQuestionsForSession(
  chapterId: string,
  studentStrength: StrengthLevel,
  targetCount: number,
  examStyle: ExamType
): Promise<QuestionV2[]> {

  // 1. Get difficulty mix for this strength level
  const mix = STRENGTH_LEVELS.find(s => s.id === studentStrength).difficultyMix;

  // 2. Get unlocked question types
  const types = STRENGTH_LEVELS.find(s => s.id === studentStrength).unlockedTypes;

  // 3. Calculate counts
  const easyCount = Math.round(targetCount * mix.easy / 100);
  const mediumCount = Math.round(targetCount * mix.medium / 100);
  const hardCount = targetCount - easyCount - mediumCount;

  // 4. Fetch from database with randomization
  const questions = await supabase
    .from('ai_questions')
    .select('*')
    .eq('chapter_id', chapterId)
    .eq('exam_style', examStyle)
    .in('question_type', types)
    .eq('is_active', true)
    .or(`difficulty.eq.easy,difficulty.eq.medium,difficulty.eq.hard`)
    .order('RANDOM()')
    .limit(targetCount);

  // 5. Ensure variety (not all same type)
  return balanceQuestionTypes(questions, types);
}
```

### 9.2 Answer Recording

```typescript
async function recordAnswer(
  questionId: string,
  studentAnswer: string,
  isCorrect: boolean,
  timeSpent: number
) {
  // 1. Record in student_answers
  await supabase.from('student_answers').insert({
    user_id: currentUser.id,
    question_id: questionId,
    answer_given: studentAnswer,
    is_correct: isCorrect,
    time_spent_seconds: Math.round(timeSpent / 1000),
  });

  // 2. Update question stats
  await supabase.rpc('update_question_stats', {
    q_id: questionId,
    was_correct: isCorrect,
    time_taken: timeSpent
  });
}
```

---

## 10. Metrics & Monitoring

### 10.1 Generation Quality Metrics

| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| Questions passing all checks | > 95% | < 90% |
| Fact-check confidence HIGH | > 80% | < 70% |
| Avg generation time | < 5s per question | > 10s |
| Generation cost per question | < $0.01 | > $0.02 |

### 10.2 Usage Quality Metrics

| Metric | Target | Action if Off |
|--------|--------|---------------|
| Easy accuracy | 75-85% | Recalibrate difficulty |
| Medium accuracy | 55-70% | Recalibrate difficulty |
| Hard accuracy | 35-50% | Recalibrate difficulty |
| Questions flagged by students | < 1% | Review flagged questions |
| Time per question vs estimate | ± 30% | Adjust time estimates |

### 10.3 Dashboard Queries

```sql
-- Questions per chapter coverage
SELECT
  c.id as chapter_id,
  c.name as chapter_name,
  COUNT(q.id) as total_questions,
  COUNT(q.id) FILTER (WHERE difficulty = 'easy') as easy,
  COUNT(q.id) FILTER (WHERE difficulty = 'medium') as medium,
  COUNT(q.id) FILTER (WHERE difficulty = 'hard') as hard
FROM med_chapters c
LEFT JOIN ai_questions q ON q.chapter_id = c.id AND q.is_active = true
GROUP BY c.id, c.name
ORDER BY total_questions ASC;

-- Question accuracy vs expected
SELECT
  question_type,
  difficulty,
  AVG(actual_accuracy) as avg_accuracy,
  CASE
    WHEN difficulty = 'easy' THEN 0.80
    WHEN difficulty = 'medium' THEN 0.65
    WHEN difficulty = 'hard' THEN 0.45
  END as expected_accuracy
FROM ai_questions
WHERE usage_count > 10 AND is_active = true
GROUP BY question_type, difficulty;
```

---

## 11. Implementation Phases

### Phase 1: Foundation (Week 1-2)
- [ ] Create `ai_questions` table
- [ ] Implement MCQ generation prompt
- [ ] Build basic quality validation
- [ ] Generate 50 MCQ questions for Physics Chapter 1

### Phase 2: All Types (Week 3-4)
- [ ] Add prompts for all 8 question types
- [ ] Implement type-specific validation
- [ ] Generate questions for all Physics chapters

### Phase 3: Scale (Week 5-6)
- [ ] Batch generation pipeline
- [ ] All subjects coverage
- [ ] Telugu translation integration

### Phase 4: Optimization (Week 7-8)
- [ ] Difficulty recalibration system
- [ ] LLM fact-checking
- [ ] Human review workflow

---

## 12. Open Questions

1. **Generation vs Curation:** What's the right balance between AI-generated and human-curated questions? 70/30?

2. **Diagram Source:** Where do diagrams come from? NCERT? Custom illustrations? Stock images?

3. **Negative Marking Sensitivity:** Should hard questions have a warning for NEET (wrong = -1)?

4. **Previous Year Questions:** Should we include actual PYQs? Legally? As reference style only?

5. **Regional Language Expansion:** After Telugu, which languages? Hindi? Tamil? How to scale translation?

---

*This document defines the question generation methodology for VaNi. It should be updated as we learn from actual usage and student feedback.*
