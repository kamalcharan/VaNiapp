import { supabase } from './supabase';

// ── Types ────────────────────────────────────────────────────

export interface CatalogExam {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  emoji: string;
  color: string;
  light_bg: string;
  sort_order: number;
}

export interface CatalogSubject {
  id: string;
  name: string;
  emoji: string;
  color: string;
  category: string;
  exam_id: string;
  sort_order: number;
}

export interface CatalogLanguage {
  id: string;
  label: string;
  native: string;
  emoji: string;
  description: string;
  sort_order: number;
}

export interface CatalogChapter {
  id: string;
  subject_id: string;
  exam_ids: string[];
  branch: string | null;
  name: string;
  name_te: string | null;
  name_hi: string | null;
  chapter_number: number | null;
  class_level: number | null;
  weightage: number;
  avg_questions: number;
  important_topics: string[];
}


// ── In-memory cache ──────────────────────────────────────────

let cachedExams: CatalogExam[] | null = null;
let cachedSubjects: CatalogSubject[] | null = null;
let cachedLanguages: CatalogLanguage[] | null = null;
let cachedChapters: Map<string, CatalogChapter[]> = new Map();

// ── Fetch functions ──────────────────────────────────────────

export async function getExams(): Promise<CatalogExam[]> {
  if (cachedExams) return cachedExams;
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('med_exams')
      .select('id, title, subtitle, description, emoji, color, light_bg, sort_order')
      .eq('is_active', true)
      .order('sort_order');

    if (error || !data) {
      console.warn('[catalog] Failed to fetch exams:', error?.message);
      return [];
    }
    cachedExams = data as CatalogExam[];
    return cachedExams;
  } catch (err) {
    console.warn('[catalog] Exception fetching exams:', err);
    return [];
  }
}

export async function getSubjects(examId?: string): Promise<CatalogSubject[]> {
  if (!cachedSubjects) {
    if (!supabase) return [];
    try {
      const { data, error } = await supabase
        .from('med_subjects')
        .select('id, name, emoji, color, category, exam_id, sort_order')
        .eq('is_active', true)
        .order('sort_order');

      if (error || !data) {
        console.warn('[catalog] Failed to fetch subjects:', error?.message);
        return [];
      }
      cachedSubjects = data as CatalogSubject[];
    } catch (err) {
      console.warn('[catalog] Exception fetching subjects:', err);
      return [];
    }
  }

  if (examId) {
    return cachedSubjects.filter((s) => s.exam_id === examId);
  }
  return cachedSubjects;
}

export async function getLanguages(): Promise<CatalogLanguage[]> {
  if (cachedLanguages) return cachedLanguages;
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('med_languages')
      .select('id, label, native, emoji, description, sort_order')
      .eq('is_active', true)
      .order('sort_order');

    if (error || !data) {
      console.warn('[catalog] Failed to fetch languages:', error?.message);
      return [];
    }
    cachedLanguages = data as CatalogLanguage[];
    return cachedLanguages;
  } catch (err) {
    console.warn('[catalog] Exception fetching languages:', err);
    return [];
  }
}

/**
 * Fetch chapters for a subject from the database.
 * @param subjectId - The subject ID to fetch chapters for
 * @param examId - Optional exam ID to filter chapters (e.g., 'NEET', 'CUET')
 *                 If provided, only returns chapters that include this exam in their exam_ids array
 */
export async function getChapters(subjectId: string, examId?: string): Promise<CatalogChapter[]> {
  // Create cache key that includes exam filter
  const cacheKey = examId ? `${subjectId}:${examId}` : subjectId;

  // Check cache first
  if (cachedChapters.has(cacheKey)) {
    return cachedChapters.get(cacheKey)!;
  }

  if (!supabase) {
    console.warn('[catalog] Supabase not configured — cannot fetch chapters');
    return [];
  }

  try {
    let query = supabase
      .from('med_chapters')
      .select('id, subject_id, exam_ids, branch, name, name_te, name_hi, chapter_number, class_level, weightage, avg_questions, important_topics')
      .eq('subject_id', subjectId)
      .eq('is_active', true);

    // Filter by exam_ids if provided (uses PostgreSQL array contains operator)
    if (examId) {
      query = query.contains('exam_ids', [examId]);
    }

    const { data, error } = await query.order('chapter_number');

    if (error) {
      console.warn(`[catalog] Failed to fetch chapters for ${subjectId}:`, error.message, error.details);
      return [];
    }

    if (!data || data.length === 0) {
      console.warn(`[catalog] No chapters found for subject=${subjectId}, examId=${examId ?? 'any'}`);
      return [];
    }

    const chapters = data as CatalogChapter[];
    cachedChapters.set(cacheKey, chapters);
    return chapters;
  } catch (err) {
    console.warn(`[catalog] Exception fetching chapters for ${subjectId}:`, err);
    return [];
  }
}

/** Get NEET subject IDs from catalog. */
export async function getNeetSubjectIds(): Promise<string[]> {
  const neetSubjects = await getSubjects('NEET');
  return neetSubjects.map((s) => s.id);
}

// ── All-chapters lookup (used by results screens for chapter name display) ──

let cachedAllChapters: CatalogChapter[] | null = null;
let cachedAllChaptersById: Map<string, CatalogChapter> | null = null;

/** Fetch every chapter from med_chapters in one query, cached. */
export async function getAllChapters(): Promise<CatalogChapter[]> {
  if (cachedAllChapters) return cachedAllChapters;
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('med_chapters')
      .select('id, subject_id, exam_ids, branch, name, name_te, name_hi, chapter_number, class_level, weightage, avg_questions, important_topics')
      .eq('is_active', true)
      .order('chapter_number');

    if (error || !data) {
      console.warn('[catalog] Failed to fetch all chapters:', error?.message);
      return [];
    }

    cachedAllChapters = data as CatalogChapter[];
    cachedAllChaptersById = new Map(cachedAllChapters.map((c) => [c.id, c]));
    return cachedAllChapters;
  } catch (err) {
    console.warn('[catalog] Exception fetching all chapters:', err);
    return [];
  }
}

/** Look up a chapter by id from the all-chapters cache. */
export async function getChapterById(chapterId: string): Promise<CatalogChapter | null> {
  if (!cachedAllChaptersById) {
    await getAllChapters();
  }
  return cachedAllChaptersById?.get(chapterId) ?? null;
}

// ── Question counts per chapter (batched by subject) ────────

let cachedQuestionCounts: Map<string, Record<string, number>> = new Map();

/**
 * Fetch total question counts per chapter for a subject in a single query.
 * Returns a map of chapterId -> questionCount.
 */
export async function getChapterQuestionCounts(subjectId: string): Promise<Record<string, number>> {
  if (cachedQuestionCounts.has(subjectId)) {
    return cachedQuestionCounts.get(subjectId)!;
  }

  if (!supabase) return {};

  try {
    const { data, error } = await supabase
      .from('med_questions')
      .select('chapter_id')
      .eq('subject_id', subjectId)
      .eq('is_active', true);

    if (error || !data) {
      console.warn('[catalog] Failed to fetch question counts:', error?.message);
      return {};
    }

    const counts: Record<string, number> = {};
    for (const row of data) {
      counts[row.chapter_id] = (counts[row.chapter_id] || 0) + 1;
    }

    cachedQuestionCounts.set(subjectId, counts);
    return counts;
  } catch (err) {
    console.warn('[catalog] Exception fetching question counts:', err);
    return {};
  }
}

/** Clear cache (useful after admin changes). */
export function clearCatalogCache(): void {
  cachedExams = null;
  cachedSubjects = null;
  cachedLanguages = null;
  cachedChapters.clear();
  cachedQuestionCounts.clear();
  cachedAllChapters = null;
  cachedAllChaptersById = null;
}
