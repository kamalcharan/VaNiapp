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
  chapter_number: number | null;
  class_level: number | null;
  weightage: number;
  avg_questions: number;
  important_topics: string[];
}

// ── Local fallbacks (used offline or if DB fetch fails) ──────

const FALLBACK_EXAMS: CatalogExam[] = [
  { id: 'NEET', title: 'NEET', subtitle: 'Medical Entrance', description: '4 subjects \u2014 Physics, Chemistry, Botany, Zoology', emoji: '\uD83E\uDE7A', color: '#3B82F6', light_bg: '#E8F0FE', sort_order: 1 },
  { id: 'CUET', title: 'CUET', subtitle: 'University Entrance', description: 'Pick up to 6 domain subjects + General Test', emoji: '\uD83C\uDF93', color: '#8B5CF6', light_bg: '#EDEBFE', sort_order: 2 },
  { id: 'BOTH', title: 'Both', subtitle: 'NEET + CUET', description: 'NEET 4 auto-included + pick CUET subjects', emoji: '\uD83D\uDCAA', color: '#F59E0B', light_bg: '#FEF3E0', sort_order: 3 },
];

const FALLBACK_SUBJECTS: CatalogSubject[] = [
  // NEET
  { id: 'physics', name: 'Physics', emoji: '\u269B\uFE0F', color: '#3B82F6', category: 'Science', exam_id: 'NEET', sort_order: 1 },
  { id: 'chemistry', name: 'Chemistry', emoji: '\uD83E\uDDEA', color: '#F97316', category: 'Science', exam_id: 'NEET', sort_order: 2 },
  { id: 'botany', name: 'Botany', emoji: '\uD83C\uDF3F', color: '#22C55E', category: 'Science', exam_id: 'NEET', sort_order: 3 },
  { id: 'zoology', name: 'Zoology', emoji: '\uD83E\uDD8B', color: '#A855F7', category: 'Science', exam_id: 'NEET', sort_order: 4 },
  // CUET Science
  { id: 'cuet-physics', name: 'Physics', emoji: '\u269B\uFE0F', color: '#3B82F6', category: 'Science', exam_id: 'CUET', sort_order: 10 },
  { id: 'cuet-chemistry', name: 'Chemistry', emoji: '\uD83E\uDDEA', color: '#F97316', category: 'Science', exam_id: 'CUET', sort_order: 11 },
  { id: 'mathematics', name: 'Mathematics', emoji: '\uD83D\uDCCF', color: '#EF4444', category: 'Science', exam_id: 'CUET', sort_order: 12 },
  { id: 'biology', name: 'Biology / Biotech', emoji: '\uD83E\uDDEC', color: '#22C55E', category: 'Science', exam_id: 'CUET', sort_order: 13 },
  // CUET Commerce
  { id: 'accountancy', name: 'Accountancy', emoji: '\uD83D\uDCCA', color: '#14B8A6', category: 'Commerce', exam_id: 'CUET', sort_order: 20 },
  { id: 'business-studies', name: 'Business Studies', emoji: '\uD83D\uDCBC', color: '#8B5CF6', category: 'Commerce', exam_id: 'CUET', sort_order: 21 },
  { id: 'economics', name: 'Economics', emoji: '\uD83D\uDCB9', color: '#F59E0B', category: 'Commerce', exam_id: 'CUET', sort_order: 22 },
  // CUET Arts
  { id: 'history', name: 'History', emoji: '\uD83C\uDFDB\uFE0F', color: '#92400E', category: 'Arts / Humanities', exam_id: 'CUET', sort_order: 30 },
  { id: 'geography', name: 'Geography', emoji: '\uD83C\uDF0D', color: '#059669', category: 'Arts / Humanities', exam_id: 'CUET', sort_order: 31 },
  { id: 'political-science', name: 'Political Science', emoji: '\uD83D\uDDF3\uFE0F', color: '#6366F1', category: 'Arts / Humanities', exam_id: 'CUET', sort_order: 32 },
  { id: 'sociology', name: 'Sociology', emoji: '\uD83D\uDC65', color: '#EC4899', category: 'Arts / Humanities', exam_id: 'CUET', sort_order: 33 },
  { id: 'psychology', name: 'Psychology', emoji: '\uD83E\uDDE0', color: '#F472B6', category: 'Arts / Humanities', exam_id: 'CUET', sort_order: 34 },
  { id: 'philosophy', name: 'Philosophy', emoji: '\uD83D\uDCA1', color: '#A78BFA', category: 'Arts / Humanities', exam_id: 'CUET', sort_order: 35 },
  { id: 'anthropology', name: 'Anthropology', emoji: '\uD83D\uDD2C', color: '#78716C', category: 'Arts / Humanities', exam_id: 'CUET', sort_order: 36 },
  // CUET Other
  { id: 'computer-science', name: 'Computer Science', emoji: '\uD83D\uDCBB', color: '#0EA5E9', category: 'Other', exam_id: 'CUET', sort_order: 40 },
  { id: 'environmental-studies', name: 'Environmental Studies', emoji: '\uD83C\uDF3F', color: '#16A34A', category: 'Other', exam_id: 'CUET', sort_order: 41 },
  { id: 'physical-education', name: 'Physical Education', emoji: '\uD83C\uDFC3', color: '#EA580C', category: 'Other', exam_id: 'CUET', sort_order: 42 },
  { id: 'fine-arts', name: 'Fine Arts', emoji: '\uD83C\uDFA8', color: '#DB2777', category: 'Other', exam_id: 'CUET', sort_order: 43 },
  { id: 'home-science', name: 'Home Science', emoji: '\uD83C\uDFE0', color: '#D97706', category: 'Other', exam_id: 'CUET', sort_order: 44 },
  { id: 'mass-media', name: 'Mass Media / Journalism', emoji: '\uD83D\uDCF0', color: '#4F46E5', category: 'Other', exam_id: 'CUET', sort_order: 45 },
  // General Test
  { id: 'general-test', name: 'General Test', emoji: '\uD83D\uDDD2\uFE0F', color: '#64748B', category: 'General Test', exam_id: 'CUET', sort_order: 50 },
];

const FALLBACK_LANGUAGES: CatalogLanguage[] = [
  { id: 'en', label: 'English', native: 'English', emoji: '\uD83C\uDDEC\uD83C\uDDE7', description: 'Questions, explanations & UI in English', sort_order: 1 },
  { id: 'te', label: 'Telugu', native: '\u0C24\u0C46\u0C32\u0C41\u0C17\u0C41', emoji: '\uD83C\uDDEE\uD83C\uDDF3', description: 'Questions & explanations in Telugu, UI in English', sort_order: 2 },
];

// ── In-memory cache ──────────────────────────────────────────

let cachedExams: CatalogExam[] | null = null;
let cachedSubjects: CatalogSubject[] | null = null;
let cachedLanguages: CatalogLanguage[] | null = null;
let cachedChapters: Map<string, CatalogChapter[]> = new Map();

// ── Fetch functions ──────────────────────────────────────────

export async function getExams(): Promise<CatalogExam[]> {
  if (cachedExams) return cachedExams;

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('med_exams')
        .select('id, title, subtitle, description, emoji, color, light_bg, sort_order')
        .eq('is_active', true)
        .order('sort_order');

      if (!error && data && data.length > 0) {
        cachedExams = data as CatalogExam[];
        return cachedExams;
      }
    } catch {}
  }

  cachedExams = FALLBACK_EXAMS;
  return cachedExams;
}

export async function getSubjects(examId?: string): Promise<CatalogSubject[]> {
  if (!cachedSubjects) {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('med_subjects')
          .select('id, name, emoji, color, category, exam_id, sort_order')
          .eq('is_active', true)
          .order('sort_order');

        if (!error && data && data.length > 0) {
          cachedSubjects = data as CatalogSubject[];
        }
      } catch {}
    }

    if (!cachedSubjects) {
      cachedSubjects = FALLBACK_SUBJECTS;
    }
  }

  if (examId) {
    return cachedSubjects.filter((s) => s.exam_id === examId);
  }
  return cachedSubjects;
}

export async function getLanguages(): Promise<CatalogLanguage[]> {
  if (cachedLanguages) return cachedLanguages;

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('med_languages')
        .select('id, label, native, emoji, description, sort_order')
        .eq('is_active', true)
        .order('sort_order');

      if (!error && data && data.length > 0) {
        cachedLanguages = data as CatalogLanguage[];
        return cachedLanguages;
      }
    } catch {}
  }

  cachedLanguages = FALLBACK_LANGUAGES;
  return cachedLanguages;
}

/** Fetch chapters for a subject from the database. */
export async function getChapters(subjectId: string): Promise<CatalogChapter[]> {
  // Check cache first
  if (cachedChapters.has(subjectId)) {
    return cachedChapters.get(subjectId)!;
  }

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('med_chapters')
        .select('id, subject_id, exam_ids, branch, name, name_te, chapter_number, class_level, weightage, avg_questions, important_topics')
        .eq('subject_id', subjectId)
        .eq('is_active', true)
        .order('chapter_number');

      if (!error && data && data.length > 0) {
        const chapters = data as CatalogChapter[];
        cachedChapters.set(subjectId, chapters);
        return chapters;
      }
    } catch {}
  }

  // Return empty array if no chapters found (no fallback for chapters)
  return [];
}

/** Get NEET subject IDs from catalog. */
export async function getNeetSubjectIds(): Promise<string[]> {
  const neetSubjects = await getSubjects('NEET');
  return neetSubjects.map((s) => s.id);
}

/** Clear cache (useful after admin changes). */
export function clearCatalogCache(): void {
  cachedExams = null;
  cachedSubjects = null;
  cachedLanguages = null;
  cachedChapters.clear();
}
