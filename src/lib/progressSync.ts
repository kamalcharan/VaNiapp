import { supabase } from './supabase';
import { store } from '../store';
import { ChapterStrengthData } from '../store/slices/strengthSlice';
import { evaluateStrength } from './strengthEvaluator';

/**
 * Sync chapter progress to Supabase med_chapter_progress table.
 * Called after completing a chapter quiz session.
 * Uses upsert on (user_id, chapter_id) unique constraint.
 */
export async function syncChapterProgress(chapterId: string): Promise<void> {
  if (!supabase) return;

  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  // Get chapter strength data from Redux
  const state = store.getState();
  const chapter: ChapterStrengthData | undefined = state.strength.chapters[chapterId];
  if (!chapter) return;

  const { error } = await supabase
    .from('med_chapter_progress')
    .upsert(
      {
        user_id: user.id,
        chapter_id: chapterId,
        subject_id: chapter.subjectId,
        total_in_bank: chapter.totalInBank,
        unique_attempted: chapter.attemptedIds.length,
        total_answered: chapter.totalAnswered,
        correct_count: chapter.correctCount,
        last_practiced_at: chapter.lastPracticedAt ?? new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,chapter_id' },
    );

  if (error) {
    console.warn('[progressSync] Failed to sync chapter progress:', error.message);
  }
}

/**
 * Pull chapter progress from Supabase and merge into Redux.
 * Remote data wins only for chapters that are MORE advanced on the server
 * (higher unique_attempted), preserving local progress that hasn't synced yet.
 */
export async function pullRemoteProgress(): Promise<void> {
  if (!supabase) return;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { data, error } = await supabase
    .from('med_chapter_progress')
    .select('chapter_id, subject_id, total_in_bank, unique_attempted, total_answered, correct_count, last_practiced_at')
    .eq('user_id', user.id);

  if (error || !data || data.length === 0) return;

  const state = store.getState();
  const localChapters = state.strength.chapters;
  // Deep-clone local chapters to avoid frozen Immer references
  const merged: Record<string, ChapterStrengthData> = {};
  for (const [k, v] of Object.entries(localChapters)) {
    merged[k] = {
      ...v,
      questionResults: { ...(v.questionResults ?? {}) },
      attemptedIds: [...(v.attemptedIds ?? [])],
    };
  }

  for (const row of data) {
    const local = localChapters[row.chapter_id];
    const remoteUnique = row.unique_attempted ?? 0;

    // Skip if local has more unique questions attempted than remote
    if (local && local.attemptedIds.length >= remoteUnique) continue;

    // Build questionResults from remote counts
    // We don't have per-question data from remote, so create placeholder entries
    const questionResults: Record<string, boolean> = {};
    const correctCount = row.correct_count ?? 0;
    for (let i = 0; i < remoteUnique; i++) {
      const qid = local?.attemptedIds[i] ?? `remote-${row.chapter_id}-${i}`;
      questionResults[qid] = i < correctCount;
    }

    // Merge local questionResults on top (local data is more accurate per-question)
    if (local?.questionResults) {
      for (const [qid, result] of Object.entries(local.questionResults)) {
        questionResults[qid] = result;
      }
    }

    const attemptedIds = Object.keys(questionResults);
    const totalAnswered = attemptedIds.length;
    const mergedCorrect = attemptedIds.filter((id) => questionResults[id]).length;

    const result = evaluateStrength({
      totalInBank: row.total_in_bank ?? 25,
      uniqueAttempted: totalAnswered,
      totalAnswered,
      correctCount: mergedCorrect,
    });

    merged[row.chapter_id] = {
      chapterId: row.chapter_id,
      subjectId: row.subject_id,
      totalInBank: row.total_in_bank ?? 25,
      questionResults,
      attemptedIds,
      totalAnswered,
      correctCount: mergedCorrect,
      coverage: result.coverage,
      accuracy: result.accuracy,
      strengthLevel: result.level,
      lastPracticedAt: row.last_practiced_at ?? null,
    };
  }

  // Dispatch merged state
  store.dispatch({ type: 'strength/rehydrate', payload: { chapters: merged } });
}
