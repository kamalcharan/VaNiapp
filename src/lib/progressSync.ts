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
 * (higher totalAnswered), preserving local progress that hasn't synced yet.
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
  const merged: Record<string, ChapterStrengthData> = { ...localChapters };

  for (const row of data) {
    const local = localChapters[row.chapter_id];
    const remoteTotalAnswered = row.total_answered ?? 0;

    // Skip if local has more progress than remote
    if (local && local.totalAnswered >= remoteTotalAnswered) continue;

    // Build attemptedIds placeholder — we don't store individual IDs in Supabase,
    // so use the count to create placeholder entries for coverage calculation
    const attemptedIds = local?.attemptedIds ?? [];
    // Pad to match remote unique_attempted count if remote is ahead
    const remoteUnique = row.unique_attempted ?? 0;
    while (attemptedIds.length < remoteUnique) {
      attemptedIds.push(`remote-${row.chapter_id}-${attemptedIds.length}`);
    }

    const result = evaluateStrength({
      totalInBank: row.total_in_bank ?? 25,
      uniqueAttempted: remoteUnique,
      totalAnswered: remoteTotalAnswered,
      correctCount: row.correct_count ?? 0,
    });

    merged[row.chapter_id] = {
      chapterId: row.chapter_id,
      subjectId: row.subject_id,
      totalInBank: row.total_in_bank ?? 25,
      attemptedIds,
      totalAnswered: remoteTotalAnswered,
      correctCount: row.correct_count ?? 0,
      coverage: result.coverage,
      accuracy: result.accuracy,
      strengthLevel: result.level,
      lastPracticedAt: row.last_practiced_at ?? null,
    };
  }

  // Dispatch merged state
  store.dispatch({ type: 'strength/rehydrate', payload: { chapters: merged } });
}
