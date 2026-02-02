
export enum AppScreen {
  SPLASH = 'SPLASH',
  PRE_ONBOARDING = 'PRE_ONBOARDING',
  ONBOARDING_PHONE = 'ONBOARDING_PHONE',
  ONBOARDING_OTP = 'ONBOARDING_OTP',
  ONBOARDING_PROFILE = 'ONBOARDING_PROFILE',
  ONBOARDING_EXAM = 'ONBOARDING_EXAM',
  DASHBOARD = 'DASHBOARD',
  SUBJECT_SELECT = 'SUBJECT_SELECT',
  CHAPTER_SELECT = 'CHAPTER_SELECT',
  PRACTICE_INFO = 'PRACTICE_INFO',
  TEST_SCREEN = 'TEST_SCREEN',
  RESULTS = 'RESULTS',
  FEEDBACK = 'FEEDBACK',
  PAYWALL = 'PAYWALL'
}

export enum ExamType {
  NEET = 'NEET',
  CUET = 'CUET',
  BOTH = 'Both'
}

export enum Language {
  ENGLISH = 'English',
  TELUGU = 'Telugu'
}

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  subject: string;
  chapter: string;
}

export interface UserProfile {
  name: string;
  phone: string;
  email: string;
  age: string;
  college: string;
  exam: ExamType;
  language: Language;
}

export interface TestSession {
  subject: string;
  chapter: string;
  startTime: number;
  endTime?: number;
  answers: Record<number, number>; // questionId: selectedIndex
  marked: Set<number>;
  eliminatedOptions: Record<number, Set<number>>; // questionId: Set of indices
}
