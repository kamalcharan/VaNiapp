
import React, { useEffect, useState } from 'react';

interface Props {
  result: { score: number, total: number, timeSpent: number };
  onNext: () => void;
}

const Results: React.FC<Props> = ({ result, onNext }) => {
  const [showContent, setShowContent] = useState(false);
  const scorePercent = Math.round((result.score / result.total) * 100);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col overflow-hidden relative">
      {/* Confetti Animation Layer (Pure CSS) */}
      <div className="absolute inset-0 pointer-events-none opacity-50 z-0">
          {[...Array(20)].map((_, i) => (
              <div 
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  background: ['#4F46E5', '#10B981', '#F59E0B', '#EF4444'][i % 4],
                  left: `${Math.random() * 100}%`,
                  top: '-10%',
                  animation: `float ${3 + Math.random() * 5}s linear infinite`,
                  animationDelay: `${Math.random() * 5}s`
                }}
              />
          ))}
      </div>

      <div className="flex-1 flex flex-col relative z-10 pt-24">
        {/* Header Hero */}
        <div className="text-center px-10 pb-16">
            <div className={`w-32 h-32 bg-white/10 backdrop-blur-3xl border border-white/20 rounded-[3rem] mx-auto mb-10 flex items-center justify-center text-7xl shadow-2xl transition-all duration-1000 ${showContent ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
                {scorePercent > 80 ? '👑' : scorePercent > 50 ? '🥈' : '⚡'}
            </div>
            
            <div className={`transition-all duration-700 delay-300 ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <p className="text-indigo-400 font-extrabold uppercase tracking-[0.4em] text-[10px] mb-4">Final Score</p>
                <h1 className="text-8xl font-black text-white tracking-tighter leading-none mb-8">
                    {scorePercent}<span className="text-indigo-500 text-4xl">%</span>
                </h1>
                
                <div className="flex justify-center gap-12">
                   <div className="text-center">
                      <p className="text-2xl font-black text-white">{result.score}</p>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Correct</p>
                   </div>
                   <div className="w-px h-10 bg-white/10"></div>
                   <div className="text-center">
                      <p className="text-2xl font-black text-white">{Math.floor(result.timeSpent / 60)}m</p>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Time</p>
                   </div>
                </div>
            </div>
        </div>

        {/* Dynamic Card Container */}
        <div className={`flex-1 bg-white rounded-t-[5rem] p-10 pb-32 shadow-[0_-40px_100px_rgba(0,0,0,0.5)] transition-all duration-700 delay-500 ${showContent ? 'translate-y-0' : 'translate-y-full'}`}>
            <h3 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">Performance Deep-Dive</h3>
            
            <div className="space-y-6">
                <InsightBox 
                    title="Concept Mastery" 
                    desc="Newton's Third Law" 
                    stat="Elite" 
                    color="text-emerald-500" 
                    bg="bg-emerald-50"
                    icon="🎓"
                />
                <InsightBox 
                    title="Speed Analysis" 
                    desc="Avg. 14s per Question" 
                    stat="Fast" 
                    color="text-indigo-600" 
                    bg="bg-indigo-50"
                    icon="🚀"
                />
                <InsightBox 
                    title="Action Required" 
                    desc="Review Vector Addition" 
                    stat="Alert" 
                    color="text-rose-500" 
                    bg="bg-rose-50"
                    icon="⚠️"
                />
            </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className={`fixed bottom-0 left-0 right-0 max-w-md mx-auto p-10 bg-white/80 backdrop-blur-xl z-50 transition-all duration-700 delay-700 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
        <button 
           onClick={onNext}
           className="w-full bg-slate-900 text-white font-black py-6 rounded-[2.5rem] shadow-2xl active:scale-95 transition-all text-xl"
        >
          Return to Hub
        </button>
      </div>
    </div>
  );
};

const InsightBox: React.FC<{ title: string, desc: string, stat: string, color: string, bg: string, icon: string }> = ({ title, desc, stat, color, bg, icon }) => (
    <div className={`p-7 rounded-[2.5rem] flex items-center justify-between border-2 border-transparent hover:border-slate-100 transition-all ${bg}`}>
        <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-2xl shadow-sm">
                {icon}
            </div>
            <div>
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">{title}</p>
                <p className="font-extrabold text-slate-800 text-lg leading-tight">{desc}</p>
            </div>
        </div>
        <div className={`font-black text-sm uppercase tracking-widest ${color}`}>
            {stat}
        </div>
    </div>
);

export default Results;
