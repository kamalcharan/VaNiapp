export type ThemeMode = 'light' | 'dark';
export type ExamType = 'NEET' | 'CUET' | 'BOTH';
export type Language = string;

/** Localized text map — language code → translated string. */
export type L = Record<string, string>;

/**
 * Localized text helper — picks the right translation for the active language.
 * Accepts an L map (parameterized) or legacy positional strings.
 */
export function t(lang: string, text: L): string;
export function t(lang: string, en: string, te?: string | null, hi?: string | null): string;
export function t(
  lang: string,
  textOrEn: L | string,
  te?: string | null,
  hi?: string | null,
): string {
  if (typeof textOrEn === 'object') {
    return textOrEn[lang] || textOrEn.en || '';
  }
  if (lang === 'hi' && hi) return hi;
  if (lang === 'te' && te) return te;
  return textOrEn;
}

// ── Onboarding Flow Config (from med_app_config) ────────────

export interface OnboardingFlowConfig {
  mode: string;
  quick_until: string;
  default_exam: ExamType;
  auto_assign_subjects: boolean;
  default_language: Language;
}

// NEET fixed subjects
export type NeetSubjectId = 'physics' | 'chemistry' | 'botany' | 'zoology';

// All CUET domain subject IDs
export type CuetSubjectId =
  // Science
  | 'physics'
  | 'chemistry'
  | 'mathematics'
  | 'biology'
  // Commerce
  | 'accountancy'
  | 'business-studies'
  | 'economics'
  // Arts / Humanities
  | 'history'
  | 'geography'
  | 'political-science'
  | 'sociology'
  | 'psychology'
  | 'philosophy'
  | 'anthropology'
  // Other Domain
  | 'computer-science'
  | 'environmental-studies'
  | 'physical-education'
  | 'fine-arts'
  | 'home-science'
  | 'mass-media'
  // General Test
  | 'general-test';

export type SubjectId = NeetSubjectId | CuetSubjectId;

export type SubjectCategory =
  | 'Science'
  | 'Commerce'
  | 'Arts / Humanities'
  | 'Other'
  | 'General Test';

export interface SubjectOption {
  id: CuetSubjectId;
  name: string;
  emoji: string;
  category: SubjectCategory;
}

// Full CUET subject catalog
export const CUET_SUBJECTS: SubjectOption[] = [
  // Science
  { id: 'physics', name: 'Physics', emoji: '\u269B\uFE0F', category: 'Science' },
  { id: 'chemistry', name: 'Chemistry', emoji: '\uD83E\uDDEA', category: 'Science' },
  { id: 'mathematics', name: 'Mathematics', emoji: '\uD83D\uDCCF', category: 'Science' },
  { id: 'biology', name: 'Biology / Biotech', emoji: '\uD83E\uDDEC', category: 'Science' },
  // Commerce
  { id: 'accountancy', name: 'Accountancy', emoji: '\uD83D\uDCCA', category: 'Commerce' },
  { id: 'business-studies', name: 'Business Studies', emoji: '\uD83D\uDCBC', category: 'Commerce' },
  { id: 'economics', name: 'Economics', emoji: '\uD83D\uDCB9', category: 'Commerce' },
  // Arts / Humanities
  { id: 'history', name: 'History', emoji: '\uD83C\uDFDB\uFE0F', category: 'Arts / Humanities' },
  { id: 'geography', name: 'Geography', emoji: '\uD83C\uDF0D', category: 'Arts / Humanities' },
  { id: 'political-science', name: 'Political Science', emoji: '\uD83D\uDDF3\uFE0F', category: 'Arts / Humanities' },
  { id: 'sociology', name: 'Sociology', emoji: '\uD83D\uDC65', category: 'Arts / Humanities' },
  { id: 'psychology', name: 'Psychology', emoji: '\uD83E\uDDE0', category: 'Arts / Humanities' },
  { id: 'philosophy', name: 'Philosophy', emoji: '\uD83D\uDCA1', category: 'Arts / Humanities' },
  { id: 'anthropology', name: 'Anthropology', emoji: '\uD83D\uDD2C', category: 'Arts / Humanities' },
  // Other Domain
  { id: 'computer-science', name: 'Computer Science', emoji: '\uD83D\uDCBB', category: 'Other' },
  { id: 'environmental-studies', name: 'Environmental Studies', emoji: '\uD83C\uDF3F', category: 'Other' },
  { id: 'physical-education', name: 'Physical Education', emoji: '\uD83C\uDFC3', category: 'Other' },
  { id: 'fine-arts', name: 'Fine Arts', emoji: '\uD83C\uDFA8', category: 'Other' },
  { id: 'home-science', name: 'Home Science', emoji: '\uD83C\uDFE0', category: 'Other' },
  { id: 'mass-media', name: 'Mass Media / Journalism', emoji: '\uD83D\uDCF0', category: 'Other' },
  // General Test
  { id: 'general-test', name: 'General Test', emoji: '\uD83D\uDDD2\uFE0F', category: 'General Test' },
];

export const NEET_SUBJECT_IDS: NeetSubjectId[] = ['physics', 'chemistry', 'botany', 'zoology'];

export const CUET_MAX_SUBJECTS = 6;

export interface Subject {
  id: SubjectId;
  name: string;
  nameTe: string;
  nameHi?: string;
  icon: string;
  chapters: Chapter[];
}

export interface Chapter {
  id: string;
  name: string;
  nameTe: string;
  nameHi?: string;
  subjectId: SubjectId;
  questionCount: number;
  timeMinutes: number;
}

export type Difficulty = 'easy' | 'medium' | 'hard';
export type ExamMode = 'chapter' | 'practice';
export type NeetSection = 'A' | 'B';

// NEET scoring constants
export const NEET_SCORING = {
  correct: 4,
  wrong: -1,
  unanswered: 0,
  maxMarks: 720,           // 180 scored × 4
  totalQuestions: 200,      // 50 per subject
  scoredQuestions: 180,     // 45 per subject
  sectionA: 35,             // per subject, all mandatory
  sectionB: 15,             // per subject, attempt 10
  sectionBAttempt: 10,
  timeLimitMs: 200 * 60 * 1000, // 3hr 20min
} as const;

// Legacy format — used by local fallback data files (src/data/questions/*.ts)
export interface LegacyOption {
  id: string;
  text: string;
  textTe: string;
  textHi?: string;
}

export interface Question {
  id: string;
  chapterId: string;
  subjectId: NeetSubjectId;
  text: string;
  textTe: string;
  textHi?: string;
  options: LegacyOption[];
  correctOptionId: string;
  explanation: string;
  explanationTe: string;
  explanationHi?: string;
  eliminationTechnique: string;
  eliminationTechniqueTe: string;
  eliminationTechniqueHi?: string;
  difficulty: Difficulty;
}

// Parameterized option — used by QuestionV2 payloads
export interface Option {
  id: string;
  text: L;
}

export interface UserAnswer {
  questionId: string;
  selectedOptionId: string | null;
  isMarked: boolean;
  eliminatedOptionIds: string[];
  timeSpentMs: number;
}

export interface ChapterExamSession {
  id: string;
  mode: 'chapter';
  chapterId: string;
  subjectId: NeetSubjectId;
  startedAt: string;
  completedAt: string | null;
  answers: UserAnswer[];
  totalQuestions: number;
  correctCount: number | null;
  timeUsedMs: number | null;
}

export interface PracticeExamSession {
  id: string;
  mode: 'practice';
  startedAt: string;
  completedAt: string | null;
  answers: UserAnswer[];
  totalQuestions: number;
  timeLimitMs: number;
  score: number | null;
  maxMarks: number;
  subjectScores: Record<NeetSubjectId, { correct: number; wrong: number; unanswered: number; score: number }> | null;
  timeUsedMs: number | null;
}

export type ExamSession = ChapterExamSession | PracticeExamSession;

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  exam: ExamType;
  language: Language;
  selectedSubjects: SubjectId[];
  targetYear?: number; // 2026 = crunch mode, 2027 = levels/progression
}

export type AppScreen =
  | 'splash'
  | 'onboarding'
  | 'auth'
  | 'dashboard'
  | 'subject-select'
  | 'chapter-select'
  | 'practice'
  | 'results'
  | 'review'
  | 'feedback'
  | 'paywall'
  | 'profile'
  | 'history';

// ── Squad / Study Gang ──────────────────────────────────────

export type PlanType = 'solo' | 'squad';

export interface SquadMember {
  userId: string;
  name: string;
  role: 'leader' | 'member';
  joinedAt: string;
}

export interface Squad {
  id: string;
  name: string;
  emoji: string;
  inviteCode: string;
  createdBy: string;
  members: SquadMember[];
  maxMembers: number;
  createdAt: string;
}

export const SQUAD_PRICING = [
  { size: 1, label: 'Solo', pricePerUser: 200, discount: 0 },
  { size: 2, label: 'Duo', pricePerUser: 185, discount: 7.5 },
  { size: 3, label: 'Trio', pricePerUser: 170, discount: 15 },
  { size: 4, label: 'Squad', pricePerUser: 160, discount: 20 },
] as const;

export const GANG_NAME_SUGGESTIONS = [
  'Brain Squad',
  'Neuro Gang',
  'NEET Ninjas',
  'Study Mafias',
  'Topper Tribe',
  'Exam Avengers',
  'Med Mavericks',
  'Score Squad',
] as const;

// ── Chapter Strength System ─────────────────────────────────

export type StrengthLevel =
  | 'just-started'
  | 'getting-there'
  | 'on-track'
  | 'strong'
  | 'needs-focus';

export interface StrengthConfig {
  id: StrengthLevel;
  label: string;
  color: string;
  minCoverage: number;     // % of question bank attempted
  minAccuracy: number;     // % correct
  difficultyMix: { easy: number; medium: number; hard: number };
  unlockedTypes: QuestionType[];
}

export const STRENGTH_LEVELS: StrengthConfig[] = [
  {
    id: 'just-started',
    label: 'Just Started',
    color: '#94A3B8',
    minCoverage: 0,
    minAccuracy: 0,
    difficultyMix: { easy: 70, medium: 25, hard: 5 },
    unlockedTypes: ['mcq', 'true-false'],
  },
  {
    id: 'getting-there',
    label: 'Getting There',
    color: '#3B82F6',
    minCoverage: 20,
    minAccuracy: 40,
    difficultyMix: { easy: 40, medium: 45, hard: 15 },
    unlockedTypes: ['mcq', 'true-false', 'assertion-reasoning', 'match-the-following', 'fill-in-blanks'],
  },
  {
    id: 'on-track',
    label: 'On Track',
    color: '#F59E0B',
    minCoverage: 40,
    minAccuracy: 55,
    difficultyMix: { easy: 20, medium: 50, hard: 30 },
    unlockedTypes: ['mcq', 'true-false', 'assertion-reasoning', 'match-the-following', 'fill-in-blanks', 'scenario-based', 'diagram-based'],
  },
  {
    id: 'strong',
    label: 'Strong',
    color: '#22C55E',
    minCoverage: 60,
    minAccuracy: 70,
    difficultyMix: { easy: 10, medium: 40, hard: 50 },
    unlockedTypes: ['mcq', 'true-false', 'assertion-reasoning', 'match-the-following', 'fill-in-blanks', 'scenario-based', 'diagram-based', 'logical-sequence'],
  },
];

// "Needs Focus" is a separate flag, not a stage in the progression
export const NEEDS_FOCUS_CONFIG: StrengthConfig = {
  id: 'needs-focus',
  label: 'Needs Focus',
  color: '#EF4444',
  minCoverage: 20,       // only flagged after ≥20% coverage
  minAccuracy: 0,        // triggered when accuracy < 40%
  difficultyMix: { easy: 50, medium: 35, hard: 15 },
  unlockedTypes: ['mcq', 'true-false', 'assertion-reasoning', 'match-the-following', 'fill-in-blanks', 'scenario-based', 'diagram-based', 'logical-sequence'],
};

export const NEEDS_FOCUS_ACCURACY_THRESHOLD = 40; // below this → "Needs Focus"

/** Per-chapter tracking data stored in Redux */
export interface ChapterStrength {
  chapterId: string;
  subjectId: SubjectId;
  totalInBank: number;           // total questions available in question bank
  uniqueAttempted: Set<string> extends never ? number : number; // count of unique question IDs attempted
  attemptedIds: string[];        // list of unique question IDs attempted
  totalAnswered: number;         // total attempts (can re-attempt same question)
  correctCount: number;          // total correct across all attempts
  coverage: number;              // uniqueAttempted / totalInBank * 100
  accuracy: number;              // correctCount / totalAnswered * 100 (0 if none)
  strengthLevel: StrengthLevel;
  lastPracticedAt: string | null;
}

// ── QuestionV2 Type System ──────────────────────────────────

export type QuestionType =
  | 'mcq'
  | 'assertion-reasoning'
  | 'match-the-following'
  | 'true-false'
  | 'diagram-based'
  | 'logical-sequence'
  | 'fill-in-blanks'
  | 'scenario-based';

export interface EliminationHint {
  optionKey: string;
  hint: L;
  misconception: L;
}

export interface QuestionV2 {
  id: string;
  type: QuestionType;
  chapterId: string;
  subjectId: SubjectId;
  difficulty: Difficulty;

  topicId?: string;
  topicName?: L;

  text: L;
  explanation: L;
  eliminationTechnique: L;
  eliminationHints?: EliminationHint[];

  payload: QuestionPayload;
}

// ── Type-specific payloads ──

interface McqPayload {
  type: 'mcq';
  options: Option[];
  correctOptionId: string;
}

interface AssertionReasoningPayload {
  type: 'assertion-reasoning';
  assertion: L;
  reason: L;
  options: Option[];
  correctOptionId: string;
}

interface MatchTheFollowingPayload {
  type: 'match-the-following';
  columnA: { id: string; text: L }[];
  columnB: { id: string; text: L }[];
  correctMapping: Record<string, string>;
  options: Option[];
  correctOptionId: string;
}

interface TrueFalsePayload {
  type: 'true-false';
  statement: L;
  correctAnswer: boolean;
}

interface DiagramBasedPayload {
  type: 'diagram-based';
  imageUri: string;
  imageAlt: string;
  options: Option[];
  correctOptionId: string;
}

interface LogicalSequencePayload {
  type: 'logical-sequence';
  items: { id: string; text: L }[];
  correctOrder: string[];
  options: Option[];
  correctOptionId: string;
}

interface FillInBlanksPayload {
  type: 'fill-in-blanks';
  textWithBlanks: L;
  options: Option[];
  correctOptionId: string;
}

interface ScenarioBasedPayload {
  type: 'scenario-based';
  scenario: L;
  options: Option[];
  correctOptionId: string;
}

export type QuestionPayload =
  | McqPayload
  | AssertionReasoningPayload
  | MatchTheFollowingPayload
  | TrueFalsePayload
  | DiagramBasedPayload
  | LogicalSequencePayload
  | FillInBlanksPayload
  | ScenarioBasedPayload;

// ── R10: Wrong-Answer Analysis ────────────────────────────────

/** Pre-generated analysis for a specific (question × wrong option) pair */
export interface WrongAnswerEntry {
  questionId: string;
  selectedOptionId: string;       // the wrong option the student picked
  misconception: string;          // what the student likely confused
  correctReasoning: string;       // step-by-step correct approach
  tip: string;                    // one-line exam tip
  conceptTag: string;             // weak concept identified (links to ConceptEntry)
}

/** Per-chapter collection of wrong-answer explanations */
export interface ChapterExplanations {
  chapterId: string;
  subjectId: SubjectId;
  entries: WrongAnswerEntry[];
}

// ── R10: Concept Explainer ────────────────────────────────────

/** Deep-dive explanation for a concept */
export interface ConceptEntry {
  conceptTag: string;             // e.g. 'newtons-first-law', 'ionic-bonding'
  subjectId: SubjectId;
  chapterId: string;
  title: string;
  explanation: string;            // markdown, 200-400 words
  analogy: string;                // relatable analogy for Gen-Z Indian students
  examRelevance: string;          // e.g. "Asked 3 times in last 5 years in NEET"
  commonMistakes: string[];       // 2-3 common mistakes
  quickRecap: string;             // 2-line summary for revision
}

/** Per-subject collection of concept explanations */
export interface SubjectConcepts {
  subjectId: SubjectId;
  concepts: ConceptEntry[];
}
