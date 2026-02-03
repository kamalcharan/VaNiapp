import React from 'react';
import { QuestionV2 } from '../../types';
import { McqQuestion } from './McqQuestion';
import { TrueFalseQuestion } from './TrueFalseQuestion';
import { AssertionReasoningQuestion } from './AssertionReasoningQuestion';
import { MatchTheFollowingQuestion } from './MatchTheFollowingQuestion';
import { FillInBlanksQuestion } from './FillInBlanksQuestion';

export interface QuestionRendererProps {
  question: QuestionV2;
  language: 'en' | 'te';
  selectedOptionId: string | null;
  showFeedback: boolean;
  onSelect: (optionId: string) => void;
  colors: Record<string, string>;
}

export function QuestionRenderer(props: QuestionRendererProps) {
  const { question } = props;

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
    // Future types — render as MCQ fallback for now
    case 'scenario-based':
    case 'diagram-based':
    case 'logical-sequence':
      if ('options' in question.payload && 'correctOptionId' in question.payload) {
        return (
          <McqQuestion
            {...props}
            payload={{ type: 'mcq', options: question.payload.options, correctOptionId: question.payload.correctOptionId }}
          />
        );
      }
      return null;
    default:
      return null;
  }
}
