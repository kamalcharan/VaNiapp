import React from 'react';
import { QuestionV2 } from '../../types';
import { McqQuestion } from './McqQuestion';
import { TrueFalseQuestion } from './TrueFalseQuestion';

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
    // Future types — render as MCQ fallback for now
    case 'assertion-reasoning':
    case 'match-the-following':
    case 'fill-in-blanks':
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
