import {
  StrengthLevel,
  STRENGTH_LEVELS,
  NEEDS_FOCUS_ACCURACY_THRESHOLD,
} from '../types';

interface ChapterStats {
  totalInBank: number;
  uniqueAttempted: number;
  totalAnswered: number;
  correctCount: number;
}

/**
 * Evaluate chapter strength level from raw stats.
 *
 * Logic:
 * 1. Compute coverage (% unique attempted) and accuracy (% correct)
 * 2. If coverage ≥ 20% AND accuracy < 40% → "needs-focus"
 * 3. Otherwise, find the highest strength level where both thresholds are met
 * 4. Default to "just-started"
 */
export function evaluateStrength(stats: ChapterStats): {
  level: StrengthLevel;
  coverage: number;
  accuracy: number;
} {
  const coverage =
    stats.totalInBank > 0
      ? (stats.uniqueAttempted / stats.totalInBank) * 100
      : 0;

  const accuracy =
    stats.totalAnswered > 0
      ? (stats.correctCount / stats.totalAnswered) * 100
      : 0;

  // Check "Needs Focus" flag first
  if (coverage >= 20 && accuracy < NEEDS_FOCUS_ACCURACY_THRESHOLD) {
    return { level: 'needs-focus', coverage, accuracy };
  }

  // Walk the levels in reverse (highest first) to find the best match
  for (let i = STRENGTH_LEVELS.length - 1; i >= 0; i--) {
    const config = STRENGTH_LEVELS[i];
    if (coverage >= config.minCoverage && accuracy >= config.minAccuracy) {
      return { level: config.id, coverage, accuracy };
    }
  }

  return { level: 'just-started', coverage, accuracy };
}

/**
 * Compute subject-level strength as weighted average of chapter strengths.
 * Weight = totalInBank per chapter (bigger chapters count more).
 */
export function evaluateSubjectStrength(
  chapters: { coverage: number; accuracy: number; totalInBank: number }[]
): { coverage: number; accuracy: number; level: StrengthLevel } {
  if (chapters.length === 0) {
    return { coverage: 0, accuracy: 0, level: 'just-started' };
  }

  let totalWeight = 0;
  let weightedCoverage = 0;
  let weightedAccuracy = 0;

  for (const ch of chapters) {
    totalWeight += ch.totalInBank;
    weightedCoverage += ch.coverage * ch.totalInBank;
    weightedAccuracy += ch.accuracy * ch.totalInBank;
  }

  const coverage = totalWeight > 0 ? weightedCoverage / totalWeight : 0;
  const accuracy = totalWeight > 0 ? weightedAccuracy / totalWeight : 0;

  // Reuse same evaluation logic for the rolled-up numbers
  const { level } = evaluateStrength({
    totalInBank: 100, // normalized
    uniqueAttempted: coverage, // already a percentage, so use as count out of 100
    totalAnswered: 100,
    correctCount: accuracy, // same trick
  });

  return { coverage, accuracy, level };
}
