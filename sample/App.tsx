
import React, { useState, useEffect } from 'react';
import { AppScreen, UserProfile, TestSession } from './types';
import { TRIAL_LIMIT_QUESTIONS } from './constants';
import PreOnboarding from './components/PreOnboarding';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import PracticeFlow from './components/PracticeFlow';
import Results from './components/Results';
import Feedback from './components/Feedback';
import Paywall from './components/Paywall';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(AppScreen.SPLASH);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [questionsUsed, setQuestionsUsed] = useState(0);
  const [testSession, setTestSession] = useState<TestSession | null>(null);
  const [lastResult, setLastResult] = useState<{ score: number, total: number, timeSpent: number } | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (currentScreen === AppScreen.SPLASH) {
      const timer = setTimeout(() => setCurrentScreen(AppScreen.PRE_ONBOARDING), 2500);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleOnboardingComplete = (profile: UserProfile) => {
    setUserProfile(profile);
    setCurrentScreen(AppScreen.DASHBOARD);
  };

  const startTest = (subject: string, chapter: string) => {
    setTestSession({
      subject,
      chapter,
      startTime: Date.now(),
      answers: {},
      marked: new Set(),
      eliminatedOptions: {}
    });
    setCurrentScreen(AppScreen.TEST_SCREEN);
  };

  const finishTest = (score: number, total: number, timeSpent: number) => {
    setLastResult({ score, total, timeSpent });
    setQuestionsUsed(prev => prev + total);
    setCurrentScreen(AppScreen.RESULTS);
  };

  const navigateTo = (screen: AppScreen) => {
    if (questionsUsed >= TRIAL_LIMIT_QUESTIONS && screen !== AppScreen.PAYWALL && screen !== AppScreen.RESULTS) {
       setCurrentScreen(AppScreen.PAYWALL);
       return;
    }
    setCurrentScreen(screen);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case AppScreen.SPLASH:
        return (
          <div className="flex flex-col items-center justify-center h-screen p-8 text-center bg-white dark:bg-[#121212]">
            <div className="relative mb-12 animate-bounce">
              <div className="w-32 h-32 bg-indigo-100 dark:bg-indigo-900/30 rounded-[2.5rem] flex items-center justify-center shadow-xl">
                 <span className="text-6xl">📖</span>
              </div>
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-yellow-200 dark:bg-yellow-600 rounded-full flex items-center justify-center text-xl shadow-lg rotate-12">
                 ✨
              </div>
            </div>
            <h1 className="text-5xl font-black tracking-tighter text-slate-900 dark:text-white mb-2">
              ExamPrep<span className="text-indigo-600 italic">Journal</span>
            </h1>
            <p className="font-hand text-2xl text-slate-500 dark:text-slate-400">writing my own future...</p>
          </div>
        );

      case AppScreen.PRE_ONBOARDING:
        return <PreOnboarding onFinish={() => setCurrentScreen(AppScreen.ONBOARDING_PHONE)} />;

      case AppScreen.ONBOARDING_PHONE:
      case AppScreen.ONBOARDING_OTP:
      case AppScreen.ONBOARDING_PROFILE:
      case AppScreen.ONBOARDING_EXAM:
        return (
          <Onboarding 
            screen={currentScreen} 
            onNext={(screen) => setCurrentScreen(screen)}
            onComplete={handleOnboardingComplete}
          />
        );

      case AppScreen.DASHBOARD:
        return (
          <Dashboard 
            profile={userProfile!} 
            questionsUsed={questionsUsed}
            onStartPractice={() => navigateTo(AppScreen.SUBJECT_SELECT)}
            onToggleTheme={toggleTheme}
            isDarkMode={isDarkMode}
          />
        );

      case AppScreen.SUBJECT_SELECT:
      case AppScreen.CHAPTER_SELECT:
      case AppScreen.PRACTICE_INFO:
      case AppScreen.TEST_SCREEN:
        return (
          <PracticeFlow 
            screen={currentScreen}
            session={testSession}
            onNavigate={navigateTo}
            onStartTest={startTest}
            onFinishTest={finishTest}
          />
        );

      case AppScreen.RESULTS:
        return (
          <Results 
            result={lastResult!} 
            onNext={() => navigateTo(AppScreen.FEEDBACK)}
          />
        );

      case AppScreen.FEEDBACK:
        return (
          <Feedback onComplete={() => navigateTo(AppScreen.DASHBOARD)} />
        );

      case AppScreen.PAYWALL:
        return (
          <Paywall 
            questionsUsed={questionsUsed}
            onComplete={() => alert('Journal Entry Saved! See you in college.')}
          />
        );

      default:
        return <div className="p-10 text-center">Protocol Error: {currentScreen}</div>;
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen relative overflow-hidden paper-bg">
      {renderScreen()}
    </div>
  );
};

export default App;
