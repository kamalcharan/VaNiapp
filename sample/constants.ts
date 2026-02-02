
import { Question } from './types';

export const TRIAL_LIMIT_QUESTIONS = 25;
export const TRIAL_LIMIT_DAYS = 3;

export const SUBJECTS = [
  { id: 'physics', name: 'Physics', icon: '⚛️', color: 'bg-blue-500' },
  { id: 'chemistry', name: 'Chemistry', icon: '⚗️', color: 'bg-orange-500' },
  { id: 'botany', name: 'Botany', icon: '🌿', color: 'bg-green-500' },
  { id: 'zoology', name: 'Zoology', icon: '🦋', color: 'bg-purple-500' }
];

export const CHAPTERS: Record<string, string[]> = {
  physics: ['Kinematics', 'Laws of Motion', 'Work, Energy & Power'],
  chemistry: ['Atomic Structure', 'Chemical Bonding', 'Thermodynamics'],
  botany: ['Cell Biology', 'Plant Kingdom', 'Genetics'],
  zoology: ['Animal Kingdom', 'Human Physiology', 'Evolution']
};

export const MOCK_QUESTIONS: Question[] = [
  {
    id: 1,
    subject: 'physics',
    chapter: 'Laws of Motion',
    text: 'A passenger in a moving bus is thrown forward when the bus is suddenly stopped. This is explained by:',
    options: ['Newton\'s First Law', 'Newton\'s Second Law', 'Newton\'s Third Law', 'Principle of Conservation of Momentum'],
    correctIndex: 0,
    explanation: 'According to Newton\'s first law (law of inertia), an object continues to stay in its state of motion unless acted upon by an external force.'
  },
  {
    id: 2,
    subject: 'physics',
    chapter: 'Laws of Motion',
    text: 'Which of the following forces is a non-contact force?',
    options: ['Friction', 'Tension', 'Gravitational force', 'Normal force'],
    correctIndex: 2,
    explanation: 'Gravitational force acts over a distance without physical contact, unlike friction or tension.'
  },
  {
    id: 3,
    subject: 'physics',
    chapter: 'Laws of Motion',
    text: 'The rate of change of momentum is proportional to:',
    options: ['Applied force', 'Mass', 'Velocity', 'Acceleration'],
    correctIndex: 0,
    explanation: 'Newton\'s Second Law states that F = dp/dt.'
  },
  // Add more mock questions as needed for the POC scope
];
