import React from 'react';
import { QuestionV2 } from '../../types';
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
