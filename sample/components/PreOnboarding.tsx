
import React, { useState } from 'react';

interface Props {
  onFinish: () => void;
}

const PreOnboarding: React.FC<Props> = ({ onFinish }) => {
  const [step, setStep] = useState(0);

  const slides = [
    {
      label: "ENTRY_01",
      title: "My Exam.\nMy Way.",
      description: "A personalized study ecosystem that actually gets you. No boring stuff, just pure focus.",
      icon: "📒",
      bg: "bg-[#fdfcf0] dark:bg-slate-900",
      accent: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
    },
    {
      label: "ENTRY_02",
      title: "Language?\nIt's NBD.",
      description: "Switch between English and Telugu like a pro. Conceptual clarity in your own vibe.",
      icon: "✨",
      bg: "bg-[#fdfcf0] dark:bg-slate-900",
      accent: "bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400"
    },
    {
      label: "ENTRY_03",
      title: "Smart Tools.\nAIR 1 Vibe.",
      description: "Top-tier analytics and unlimited practice for just ₹200. Less than a fancy coffee.",
      icon: "💎",
      bg: "bg-[#fdfcf0] dark:bg-slate-900",
      accent: "bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400"
    }
  ];

  const handleNext = () => {
    if (step < slides.length - 1) setStep(step + 1);
    else onFinish();
  };

  return (
    <div className={`h-screen flex flex-col transition-colors duration-500 ${slides[step].bg} no-scrollbar overflow-hidden`}>
      <div className="flex-1 flex flex-col items-center justify-center p-10 text-center relative">
        {/* Notebook Tape Decor */}
        <div className="washi-tape bg-indigo-200 dark:bg-indigo-800 rotate-3 top-20 left-1/4"></div>
        <div className="washi-tape bg-pink-200 dark:bg-pink-800 -rotate-3 top-32 right-1/4"></div>

        <div className="relative mb-16 animate-float-subtle">
            <div className={`w-40 h-40 rounded-[3rem] flex items-center justify-center text-8xl puffy-shadow border-4 border-white dark:border-slate-800 ${slides[step].bg}`}>
               {slides[step].icon}
            </div>
            <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-xl shadow-lg border-2 border-slate-50">
               🔖
            </div>
        </div>

        <div className="space-y-6 stagger-in">
            <span className={`inline-block px-4 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${slides[step].accent}`}>
                {slides[step].label}
            </span>
            <h2 className="text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter leading-none whitespace-pre-line italic">
              {slides[step].title}
            </h2>
            <p className="font-hand text-2xl text-slate-500 dark:text-slate-400 leading-tight max-w-[280px] mx-auto">
              {slides[step].description}
            </p>
        </div>
      </div>

      <div className="p-10 pb-20 flex flex-col items-center gap-10">
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 transition-all duration-500 rounded-full ${step === i ? 'w-10 bg-indigo-600' : 'w-2 bg-slate-200 dark:bg-slate-700'}`}
            />
          ))}
        </div>
        
        <div className="w-full space-y-4">
          <button 
            onClick={handleNext}
            className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black py-6 rounded-[2rem] btn-aesthetic text-2xl shadow-xl flex items-center justify-center gap-3"
          >
            {step === slides.length - 1 ? 'Get Started' : 'Next Page'}
            <span className="text-xl">✍️</span>
          </button>
          
          <button 
            onClick={onFinish}
            className="w-full text-slate-400 font-bold text-xs uppercase tracking-widest py-2"
          >
            Skip Intro
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreOnboarding;
