import { supabase } from './supabase';
import { store } from '../store';
import { ChapterStrengthData } from '../store/slices/strengthSlice';

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
