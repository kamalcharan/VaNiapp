import { supabase } from './supabase';

/**
 * Auto-report a quality issue detected at runtime.
 * Fires once per question+issueType combination per session (deduped in-memory).
 * Silently fails — never interrupts the student experience.
 */

const _reported = new Set<string>();

export async function autoReportIssue(
  questionId: string,
  issueType: string,
  details: Record<string, unknown> = {},
  chapterId?: string
): Promise<void> {
  const key = `${questionId}|${issueType}`;
  if (_reported.has(key)) return;
  _reported.add(key);

  try {
    if (!supabase) return;

    await supabase.from('med_quality_issues').insert({
      question_id: questionId,
      chapter_id: chapterId || null,
      issue_type: issueType,
      severity: 'high',
      source: 'auto',
      status: 'open',
      details: {
        ...details,
        detectedAt: new Date().toISOString(),
        platform: 'mobile',
      },
    });
  } catch {
    // Silently swallow — never interrupt the student
  }
}
