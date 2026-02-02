
import React, { useState, useEffect, useRef } from 'react';
import { AppScreen, TestSession } from '../types';
import { SUBJECTS, CHAPTERS, MOCK_QUESTIONS } from '../constants';

interface Props {
  screen: AppScreen;
  session: TestSession | null;
  onNavigate: (screen: AppScreen) => void;
  onStartTest: (subject: string, chapter: string) => void;
  onFinishTest: (score: number, total: number, timeSpent: number) => void;
}

const PracticeFlow: React.FC<Props> = ({ screen, session, onNavigate, onStartTest, onFinishTest }) => {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);

  // Test State
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [marked, setMarked] = useState<Set<number>>(new Set());
  const [timeLeft, setTimeLeft] = useState(30 * 60); 
  const [isEliminationMode, setIsEliminationMode] = useState(false);
  const [eliminatedOptions, setEliminatedOptions] = useState<Record<number, Set<number>>>({});
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (screen === AppScreen.TEST_SCREEN) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 0) {
            clearInterval(timerRef.current);
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [screen]);

  const questions = MOCK_QUESTIONS.filter(q => q.chapter === session?.chapter || q.chapter === 'Laws of Motion').slice(0, 20);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (questionId: number, index: number) => {
    if (isEliminationMode) {
      setEliminatedOptions(prev => {
        const current = new Set(prev[questionId] || []);
        if (current.has(index)) current.delete(index);
        else current.add(index);
        return { ...prev, [questionId]: current };
      });
    } else {
      setAnswers(prev => ({ ...prev, [questionId]: index }));
    }
  };

  const toggleMark = (questionId: number) => {
    setMarked(prev => {
      const next = new Set(prev);
      if (next.has(questionId)) next.delete(questionId);
      else next.add(questionId);
      return next;
    });
  };

  const handleSubmit = () => {
    let score = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correctIndex) score++;
    });
    onFinishTest(score, questions.length, (30 * 60) - timeLeft);
  };

  if (screen === AppScreen.SUBJECT_SELECT) {
    return (
      <div className="p-8 min-h-screen no-scrollbar overflow-y-auto pb-24">
        <button 
          onClick={() => onNavigate(AppScreen.DASHBOARD)} 
          className="mb-8 w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-md btn-aesthetic"
        >
           <span className="text-xl">🏠</span>
        </button>
        <h1 className="text-5xl font-black tracking-tighter mb-4 dark:text-white">Today's Focus 🏹</h1>
        <p className="font-hand text-2xl text-slate-500 mb-10">Select a subject to begin session</p>
        
        <div className="grid grid-cols-1 gap-4">
          {SUBJECTS.map(s => (
            <button 
              key={s.id}
              onClick={() => { setSelectedSubject(s.id); onNavigate(AppScreen.CHAPTER_SELECT); }}
              className="w-full bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] flex items-center justify-between group border border-slate-100 dark:border-slate-800 puffy-shadow btn-aesthetic"
            >
              <div className="flex items-center gap-6">
                <div className={`w-16 h-16 ${s.color} rounded-3xl flex items-center justify-center text-3xl shadow-lg`}>
                  {s.icon}
                </div>
                <div className="text-left">
                  <h4 className="text-xl font-black dark:text-white">{s.name}</h4>
                  <p className="font-hand text-lg text-slate-500">{CHAPTERS[s.id].length} topics found</p>
                </div>
              </div>
              <span className="text-2xl opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all">✨</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (screen === AppScreen.TEST_SCREEN && questions.length > 0) {
    const q = questions[currentQIndex];
    const answeredCount = Object.keys(answers).length;
    const progress = ((currentQIndex + 1) / questions.length) * 100;

    return (
      <div className="h-screen flex flex-col bg-white dark:bg-slate-950 no-scrollbar overflow-hidden">
        {/* Exam Paper Header */}
        <div className="pt-12 px-8 pb-6 border-b border-slate-100 dark:border-slate-800">
           <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                 <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-black text-xs">
                    {currentQIndex + 1}
                 </div>
                 <span className="font-bold text-sm dark:text-slate-300">/ {questions.length}</span>
              </div>
              <div className="flex items-center gap-3">
                 <div className="px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 font-bold text-xs flex items-center gap-2 dark:text-slate-300">
                    ⏱️ {formatTime(timeLeft)}
                 </div>
              </div>
           </div>
           <div className="h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${progress}%` }}></div>
           </div>
        </div>

        {/* Focus Sheet */}
        <div className="flex-1 overflow-y-auto px-8 pt-10 pb-40 no-scrollbar relative">
           <div className="max-w-prose mx-auto">
             <div className="relative mb-12">
               <h2 className="text-2xl font-bold leading-relaxed dark:text-white">
                 {q.text}
               </h2>
               <div className="absolute -bottom-2 left-0 w-24 h-1 bg-indigo-500/30 rounded-full"></div>
             </div>

             <div className="space-y-4">
               {q.options.map((opt, idx) => {
                 const letter = String.fromCharCode(65 + idx);
                 const isSelected = answers[q.id] === idx;
                 const isEliminated = eliminatedOptions[q.id]?.has(idx);

                 return (
                   <button 
                     key={idx}
                     onClick={() => handleAnswer(q.id, idx)}
                     className={`w-full p-6 rounded-3xl border-2 text-left flex items-center gap-5 transition-all duration-300 btn-aesthetic ${
                       isSelected 
                        ? 'bg-white dark:bg-slate-800 border-indigo-500 shadow-xl scale-[1.02]' 
                        : isEliminated 
                          ? 'opacity-30 line-through grayscale italic border-transparent dark:text-slate-600' 
                          : 'bg-slate-50 dark:bg-slate-900 border-transparent text-slate-600 dark:text-slate-400'
                     }`}
                   >
                     <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black transition-all ${isSelected ? 'bg-indigo-500 text-white shadow-lg' : 'bg-white dark:bg-slate-800 text-slate-400'}`}>
                        {letter}
                     </div>
                     <span className={`flex-1 font-semibold text-lg ${isSelected ? 'dark:text-white' : ''}`}>{opt}</span>
                   </button>
                 );
               })}
             </div>
           </div>
        </div>

        {/* Paper Footer Controls */}
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-8 bg-gradient-to-t from-white dark:from-slate-950 via-white dark:via-slate-950/90 to-transparent flex items-end gap-3">
           <button 
             onClick={() => setIsEliminationMode(!isEliminationMode)}
             className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center transition-all btn-aesthetic border-2 ${isEliminationMode ? 'bg-orange-100 dark:bg-orange-900/30 border-orange-500 text-orange-600' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-400'}`}
           >
             <span className="text-xl">🖌️</span>
             <span className="text-[7px] font-black uppercase mt-0.5">Cross</span>
           </button>
           
           <div className="flex-1 flex gap-2">
             <button 
               onClick={() => {
                 if (currentQIndex < questions.length - 1) setCurrentQIndex(currentQIndex + 1);
                 else setShowSubmitModal(true);
               }}
               className="h-16 flex-1 bg-indigo-600 text-white rounded-3xl flex items-center justify-center font-black btn-aesthetic text-xl shadow-xl shadow-indigo-200 dark:shadow-none"
             >
               {currentQIndex === questions.length - 1 ? 'Turn In' : 'Next Question'}
             </button>
           </div>

           <button 
             onClick={() => toggleMark(q.id)}
             className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center transition-all btn-aesthetic border-2 ${marked.has(q.id) ? 'bg-teal-100 dark:bg-teal-900/30 border-teal-500 text-teal-600' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-400'}`}
           >
             <span className="text-xl">📍</span>
             <span className="text-[7px] font-black uppercase mt-0.5">Review</span>
           </button>
        </div>

        {/* Paper Modal for Submit */}
        {showSubmitModal && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-8 animate-in fade-in zoom-in duration-300">
             <div className="bg-white dark:bg-slate-900 w-full rounded-[3rem] p-10 space-y-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                   <span className="text-8xl">📝</span>
                </div>
                <div className="text-center space-y-2 relative z-10">
                  <h3 className="text-3xl font-black tracking-tight dark:text-white">Ready to Submit?</h3>
                  <p className="font-hand text-xl text-slate-500">take a breath, you did great</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                   <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-center">
                      <p className="text-2xl font-black text-indigo-600">{answeredCount}</p>
                      <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Answered</p>
                   </div>
                   <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-center">
                      <p className="text-2xl font-black text-teal-600">{marked.size}</p>
                      <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Marked</p>
                   </div>
                </div>

                <div className="flex flex-col gap-3">
                   <button 
                     onClick={handleSubmit}
                     className="w-full bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-black py-5 rounded-2xl btn-aesthetic text-lg shadow-xl"
                   >
                     Submit Journal
                   </button>
                   <button 
                     onClick={() => setShowSubmitModal(false)}
                     className="w-full text-slate-400 font-bold text-sm py-2 hover:text-slate-900 dark:hover:text-white"
                   >
                     Go Back
                   </button>
                </div>
             </div>
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default PracticeFlow;
