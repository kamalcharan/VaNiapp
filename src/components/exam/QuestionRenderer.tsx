import React, { useEffect, useRef } from 'react';
import { QuestionV2 } from '../../types';
import { reportError } from '../../lib/errorReporting';
import { McqQuestion } from './McqQuestion';
import { TrueFalseQuestion } from './TrueFalseQuestion';
import { AssertionReasoningQuestion } from './AssertionReasoningQuestion';
import { MatchTheFollowingQuestion } from './MatchTheFollowingQuestion';
import { FillInBlanksQuestion } from './FillInBlanksQuestion';
import { ScenarioBasedQuestion } from './ScenarioBasedQuestion';
import { DiagramBasedQuestion } from './DiagramBasedQuestion';
import { LogicalSequenceQuestion } from './LogicalSequenceQuestion';

export interface QuestionRendererProps {
  question: QuestionV2;
  language: 'en' | 'te';
  selectedOptionId: string | null;
  showFeedback: boolean;
  onSelect: (optionId: string) => void;
  colors: Record<string, string>;
}

/**
 * Validate question data at render time and report issues to Sentry.
 * This catches broken data that users actually encounter at runtime.
 */
function validateAndReport(question: QuestionV2, reportedRef: React.MutableRefObject<Set<string>>): void {
  const qId = question.id;
  const payload = question.payload as any;
  const type = payload?.type || question.type;

  const report = (issueType: string, severity: 'high' | 'medium' = 'high', extra?: Record<string, unknown>) => {
    const key = `${qId}:${issueType}`;
    if (reportedRef.current.has(key)) return;
    reportedRef.current.add(key);
    reportError(
      new Error(`[QualityIssue] ${issueType}: question ${qId}`),
      severity,
      'QuestionRenderer.validate',
      { questionId: qId, questionType: type, issueType, chapterId: question.chapterId, ...extra },
    );
  };

  // No question text
  if (!question.text?.trim()) {
    report('EMPTY_QUESTION_TEXT');
  }

  // No topic_id
  if (!question.topicId) {
    report('MISSING_TOPIC_ID');
  }

  // MTF: missing column data → custom drag UI can't render
  if (type === 'match-the-following') {
    const colA = payload.columnA;
    const colB = payload.columnB;
    if (!Array.isArray(colA) || colA.length === 0 || !Array.isArray(colB) || colB.length === 0) {
      report('MTF_NO_COLUMN_DATA');
    }
    // Duplicate column/option IDs → drag broken
    if (Array.isArray(colA) && Array.isArray(colB)) {
      const allIds = [...colA.map((c: any) => c.id), ...colB.map((c: any) => c.id)];
      const dupes = allIds.filter((id: string, i: number) => allIds.indexOf(id) !== i);
      if (dupes.length > 0) {
        report('MTF_DUPLICATE_KEYS', 'high', { duplicateIds: [...new Set(dupes)] });
      }
    }
  }

  // Logical-sequence: missing items → "Arrange the following" with nothing to arrange
  if (type === 'logical-sequence') {
    const items = payload.items;
    if (!Array.isArray(items) || items.length === 0) {
      report('SEQ_NO_ITEMS');
    }
  }

  // Diagram: no image
  if (type === 'diagram-based') {
    const uri = payload.imageUri;
    if (!uri) {
      report('IMAGE_URI_EMPTY');
    }
  }

  // No hints at all
  if (!question.eliminationHints || question.eliminationHints.length === 0) {
    report('NO_HINTS', 'medium');
  }
}

export function QuestionRenderer(props: QuestionRendererProps) {
  const { question } = props;
  // Track which issues were already reported to avoid duplicate Sentry events
  const reportedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    validateAndReport(question, reportedRef);
  }, [question.id]);

  switch (question.payload.type) {
    case 'mcq':
      return <McqQuestion {...props} payload={question.payload} />;
    case 'true-false':
      return <TrueFalseQuestion {...props} payload={question.payload} />;
    case 'assertion-reasoning':
      return <AssertionReasoningQuestion {...props} payload={question.payload} />;
    case 'match-the-following':
      return <MatchTheFollowingQuestion {...props} payload={question.payload} />;
    case 'fill-in-blanks':
      return <FillInBlanksQuestion {...props} payload={question.payload} />;
    case 'scenario-based':
      return <ScenarioBasedQuestion {...props} payload={question.payload} />;
    case 'diagram-based':
      return <DiagramBasedQuestion {...props} payload={question.payload} />;
    case 'logical-sequence':
      return <LogicalSequenceQuestion {...props} payload={question.payload} />;
    default:
      return null;
  }
}
