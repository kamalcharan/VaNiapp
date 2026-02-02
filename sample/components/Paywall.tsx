
import React, { useState } from 'react';

interface Props {
  questionsUsed: number;
  onComplete: () => void;
}

const Paywall: React.FC<Props> = ({ questionsUsed, onComplete }) => {
  const [intent, setIntent] = useState<string | null>(null);
  const [reason, setReason] = useState<string>('');

  const options = [
    { id: 'yes', label: 'Yes, I want to subscribe!', sub: 'Unlock full access now', color: 'bg-indigo-600' },
    { id: 'maybe', label: 'Maybe later', sub: 'I have some questions', color: 'bg-slate-800' },
    { id: 'no', label: 'No, not for me', sub: 'I prefer other ways', color: 'bg-slate-400' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white animate-in slide-in-from-bottom duration-700">
      <div className="p-10 pt-20 text-center space-y-6">
        <div className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full font-black text-[10px] uppercase tracking-widest border border-indigo-100">
          Trial Completed
        </div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-[0.9]">
          Unlock Your <br/><span className="text-indigo-600">Full Potential.</span>
        </h1>
        <p className="text-slate-400 font-bold leading-relaxed px-4">
          You've already solved {questionsUsed} questions with great accuracy. Don't stop now.
        </p>
      </div>

      <div className="px-8 space-y-8 flex-1">
        {/* Premium Value Card */}
        <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
           <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/20 blur-3xl rounded-full"></div>
           <div className="flex justify-between items-start mb-10">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-[1.5rem] flex items-center justify-center text-3xl">💎</div>
              <div className="text-right">
                 <p className="text-3xl font-black leading-none">₹200</p>
                 <p className="text-[10px] font-black uppercase text-indigo-400 tracking-widest">per month</p>
              </div>
           </div>
           
           <ul className="space-y-5">
              {[
                "Unlimited Chapter-wise Practice",
                "Full-Length Mock Test Papers",
                "Personalized AI Analytics",
                "Bilingual Support (English + Telugu)"
              ].map((text, i) => (
                <li key={i} className="flex items-center gap-4">
                  <span className="w-6 h-6 bg-white/10 rounded-lg flex items-center justify-center text-xs text-indigo-400 font-bold">✓</span>
                  <span className="text-sm font-bold text-indigo-100">{text}</span>
                </li>
              ))}
           </ul>
        </div>

        <div className="space-y-4 pb-20">
           <p className="text-center text-sm font-black text-slate-400 uppercase tracking-widest">Would you subscribe today?</p>
           <div className="space-y-3">
              {options.map(opt => (
                <button 
                  key={opt.id}
                  onClick={() => setIntent(opt.id)}
                  className={`w-full p-6 rounded-[2rem] border-2 text-left transition-all group flex items-center justify-between ${intent === opt.id ? 'bg-slate-50 border-indigo-600' : 'bg-white border-slate-100 hover:border-indigo-200'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full border-2 transition-all ${intent === opt.id ? 'bg-indigo-600 border-indigo-600' : 'border-slate-200'}`}></div>
                    <div>
                      <p className={`font-black text-lg ${intent === opt.id ? 'text-indigo-600' : 'text-slate-800'}`}>{opt.label}</p>
                      <p className="text-xs font-bold text-slate-400">{opt.sub}</p>
                    </div>
                  </div>
                  {intent === opt.id && <span className="text-indigo-600 font-black">✔</span>}
                </button>
              ))}
           </div>
           
           {intent && (intent === 'maybe' || intent === 'no') && (
             <div className="animate-in slide-in-from-top duration-300">
               <textarea 
                 placeholder="Help us improve: Why not subscribe?"
                 className="w-full h-32 bg-slate-50 border-2 border-slate-100 rounded-[2rem] p-6 focus:outline-none focus:border-indigo-600 transition-all font-bold text-slate-800 placeholder:text-slate-300"
                 onChange={(e) => setReason(e.target.value)}
               />
             </div>
           )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-8 bg-white/80 backdrop-blur-xl z-50">
        <button 
          disabled={!intent}
          onClick={onComplete}
          className="w-full bg-indigo-600 text-white font-black py-6 rounded-[2.5rem] shadow-2xl active:scale-95 disabled:opacity-20 transition-all text-xl"
        >
          Confirm My Choice
        </button>
      </div>
    </div>
  );
};

export default Paywall;
