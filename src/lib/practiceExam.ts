/**
 * Practice Exam Logic
 *
 * VaNi's question selection follows 3 scenarios:
 * 1. Nothing completed → Use default question mix
 * 2. Chapters completed → Pull from "ready" chapters only
 * 3. AI strength-based → VaNi decides based on student performance
 *
 * Trial users: 30 questions
 * Paid users: 200 questions (full NEET format)
 */

import { supabase } from './supabase';
import { getProfile, getQuestionMixConfig, QuestionMixConfig } from './database';
import { evaluateSubjectStrength } from './strengthEvaluator';
import type { QuestionType, StrengthLevel } from '../types';

// ── Types ────────────────────────────────────────────────────

export interface ChapterProgress {
  chapterId: string;
  subjectId: string;
  coverage: number;       // % of questions attempted
  accuracy: number;       // % correct
  totalInBank: number;    // total questions available
  isReady: boolean;       // whether chapter is "ready" for practice exam
}

export interface PracticeExamConfig {
  totalQuestions: number;
  isTrial: boolean;
  scenario: 'default' | 'chapters-based' | 'strength-based';
  readyChapters: ChapterProgress[];
  questionMix: QuestionMixConfig;
}

export interface SelectedQuestion {
  questionId: string;
  chapterId: string;
  subjectId: string;
  questionType: QuestionType;
  difficulty: 'easy' | 'medium' | 'hard';
}

// ── Constants ────────────────────────────────────────────────

const TRIAL_QUESTION_COUNT = 30;
const PAID_QUESTION_COUNT = 200;
const CHAPTER_READY_THRESHOLD = 20; // % coverage to be "ready"

// ── Main Functions ───────────────────────────────────────────

/**
 * Determine which scenario applies for the current user.
 */
export async function determinePracticeScenario(): Promise<PracticeExamConfig['scenario']> {
  if (!supabase) return 'default';

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return 'default';

  // Check if user has any chapter progress
  const { data: progress, error } = await supabase
    .from('med_chapter_progress')
    .select('chapter_id, coverage, accuracy')
    .eq('user_id', user.id);

  if (error || !progress || progress.length === 0) {
    return 'default';
  }

  // Check if any chapters meet the "ready" threshold
  const readyChapters = progress.filter((p: any) => p.coverage >= CHAPTER_READY_THRESHOLD);

  if (readyChapters.length === 0) {
    return 'default';
  }

  // If we have strength data (accuracy + coverage), use AI strength-based
  const hasStrengthData = progress.some((p: any) => p.accuracy > 0 && p.coverage >= 20);

  if (hasStrengthData) {
    return 'strength-based';
  }

  return 'chapters-based';
}

/**
 * Get ready chapters for the current user.
 * A chapter is "ready" if coverage >= 20%.
 */
export async function getReadyChapters(): Promise<ChapterProgress[]> {
  if (!supabase) return [];

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('med_chapter_progress')
    .select('chapter_id, subject_id, coverage, accuracy, total_in_bank')
    .eq('user_id', user.id)
    .gte('coverage', CHAPTER_READY_THRESHOLD);

  if (error || !data) return [];

  return data.map((row: any) => ({
    chapterId: row.chapter_id,
    subjectId: row.subject_id,
    coverage: row.coverage,
    accuracy: row.accuracy,
    totalInBank: row.total_in_bank,
    isReady: true,
  }));
}

/**
 * Build the practice exam configuration.
 * VaNi decides the best approach based on student progress.
 */
export async function buildPracticeExamConfig(): Promise<PracticeExamConfig> {
  const profile = await getProfile();
  const isTrial = true; // TODO: Check subscription status
  const totalQuestions = isTrial ? TRIAL_QUESTION_COUNT : PAID_QUESTION_COUNT;

  const scenario = await determinePracticeScenario();
  const readyChapters = await getReadyChapters();
  const questionMix = await getQuestionMixConfig();

  return {
    totalQuestions,
    isTrial,
    scenario,
    readyChapters,
    questionMix,
  };
}

/**
 * Select questions for practice exam based on the config.
 * This is the core VaNi decision engine.
 */
export async function selectPracticeQuestions(
  config: PracticeExamConfig
): Promise<SelectedQuestion[]> {
  if (!supabase) return [];

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  // Get user's subjects
  const { data: userSubjects } = await supabase
    .from('med_user_subjects')
    .select('subject_id')
    .eq('user_id', user.id);

  if (!userSubjects || userSubjects.length === 0) return [];

  const subjectIds = userSubjects.map((s: any) => s.subject_id);
  const selectedQuestions: SelectedQuestion[] = [];

  // Calculate questions per difficulty based on mix
  const easyCount = Math.round(config.totalQuestions * config.questionMix.easy_pct / 100);
  const mediumCount = Math.round(config.totalQuestions * config.questionMix.medium_pct / 100);
  const hardCount = config.totalQuestions - easyCount - mediumCount;

  // Build base query
  let query = supabase
    .from('med_questions')
    .select('id, chapter_id, subject_id, question_type, difficulty')
    .in('subject_id', subjectIds)
    .eq('status', 'active');

  // Apply scenario-specific filtering
  if (config.scenario === 'chapters-based' || config.scenario === 'strength-based') {
    // Only select from ready chapters
    if (config.readyChapters.length > 0) {
      const readyChapterIds = config.readyChapters.map(c => c.chapterId);
      query = query.in('chapter_id', readyChapterIds);
    }
  }

  // Fetch questions for each difficulty level
  const difficulties: Array<{ level: 'easy' | 'medium' | 'hard'; count: number }> = [
    { level: 'easy', count: easyCount },
    { level: 'medium', count: mediumCount },
    { level: 'hard', count: hardCount },
  ];

  for (const { level, count } of difficulties) {
    if (count <= 0) continue;

    const { data: questions, error } = await supabase
      .from('med_questions')
      .select('id, chapter_id, subject_id, question_type, difficulty')
      .in('subject_id', subjectIds)
      .eq('status', 'active')
      .eq('difficulty', level)
      .limit(count * 2); // Fetch extra for randomization

    if (error || !questions) continue;

    // Shuffle and take required count
    const shuffled = shuffleArray(questions);
    const selected = shuffled.slice(0, count);

    for (const q of selected) {
      selectedQuestions.push({
        questionId: q.id,
        chapterId: q.chapter_id,
        subjectId: q.subject_id,
        questionType: q.question_type as QuestionType,
        difficulty: q.difficulty as 'easy' | 'medium' | 'hard',
      });
    }
  }

  // Final shuffle to mix up the order
  return shuffleArray(selectedQuestions);
}

/**
 * Get a VaNi coaching message based on the practice scenario.
 */
export function getVaniPracticeMessage(scenario: PracticeExamConfig['scenario']): string {
  switch (scenario) {
    case 'default':
      return "I've put together a balanced mix of questions to help you get started. Let's see where you shine!";
    case 'chapters-based':
      return "I'm focusing on the chapters you've been working on. This will help reinforce what you've learned!";
    case 'strength-based':
      return "Based on your progress, I've customized this practice to help you grow where you need it most!";
    default:
      return "Let's practice together and build your confidence!";
  }
}

// ── Helpers ──────────────────────────────────────────────────

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
