import { Chapter, NeetSubjectId } from '../types';

export interface ChapterMeta extends Chapter {
  subjectId: NeetSubjectId;
}

/**
 * Local fallback chapters — IDs MUST match med_chapters in Supabase.
 * Only used when the DB fetch fails. Covers a representative sample per subject.
 */
export const NEET_CHAPTERS: ChapterMeta[] = [
  // Physics (sample — full 20 in DB)
  {
    id: 'phy-laws-of-motion',
    name: 'Laws of Motion',
    nameTe: 'చలన నియమాలు',
    subjectId: 'physics',
    questionCount: 25,
    timeMinutes: 30,
  },
  {
    id: 'phy-thermodynamics',
    name: 'Thermodynamics',
    nameTe: 'ఉష్ణగతిశాస్త్రం',
    subjectId: 'physics',
    questionCount: 25,
    timeMinutes: 30,
  },
  // Chemistry (sample — full 20 in DB)
  {
    id: 'chem-chemical-bonding',
    name: 'Chemical Bonding',
    nameTe: 'రసాయన బంధం',
    subjectId: 'chemistry',
    questionCount: 25,
    timeMinutes: 30,
  },
  {
    id: 'chem-hydrocarbons',
    name: 'Hydrocarbons',
    nameTe: 'హైడ్రోకార్బన్లు',
    subjectId: 'chemistry',
    questionCount: 25,
    timeMinutes: 30,
  },
  // Botany (sample — full 17 in DB)
  {
    id: 'bot-cell-unit',
    name: 'Cell: The Unit of Life',
    nameTe: 'కణ జీవశాస్త్రం',
    subjectId: 'botany',
    questionCount: 25,
    timeMinutes: 30,
  },
  {
    id: 'bot-anatomy-flowering',
    name: 'Anatomy of Flowering Plants',
    nameTe: 'మొక్కల శరీర నిర్మాణ శాస్త్రం',
    subjectId: 'botany',
    questionCount: 25,
    timeMinutes: 30,
  },
  // Zoology (sample — full 15 in DB)
  {
    id: 'zoo-animal-kingdom',
    name: 'Animal Kingdom',
    nameTe: 'జంతు రాజ్యం',
    subjectId: 'zoology',
    questionCount: 25,
    timeMinutes: 30,
  },
  {
    id: 'zoo-human-reproduction',
    name: 'Human Reproduction',
    nameTe: 'మానవ ప్రత్యుత్పత్తి',
    subjectId: 'zoology',
    questionCount: 25,
    timeMinutes: 30,
  },
];

export function getChaptersBySubject(subjectId: NeetSubjectId): ChapterMeta[] {
  return NEET_CHAPTERS.filter((c) => c.subjectId === subjectId);
}

export function getChapterById(chapterId: string): ChapterMeta | undefined {
  return NEET_CHAPTERS.find((c) => c.id === chapterId);
}
