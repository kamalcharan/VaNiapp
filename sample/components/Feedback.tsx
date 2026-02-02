
import React, { useState } from 'react';

interface Props {
  onComplete: () => void;
}

const Feedback: React.FC<Props> = ({ onComplete }) => {
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');

  const emojis = ['😞', '😕', '😐', '😊', '😃'];

  return (
    <div className="p-8 h-screen flex flex-col justify-center animate-in fade-in duration-500">
      <div className="text-center space-y-8">
        <h2 className="text-3xl font-bold text-slate-900 leading-tight">How was your practice experience?</h2>
        
        <div className="flex justify-center gap-2">
           {emojis.map((emoji, idx) => (
             <button 
               key={idx}
               onClick={() => setRating(idx + 1)}
               className={`w-14 h-14 rounded-2xl text-2xl transition-all ${rating === idx + 1 ? 'bg-indigo-600 scale-110 shadow-lg' : 'bg-white border border-slate-100 hover:border-indigo-300'}`}
             >
               {emoji}
             </button>
           ))}
        </div>

        <textarea 
          placeholder="Anything else you'd like to tell us? (Optional)"
          className="w-full h-32 bg-white border border-slate-200 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <button 
          disabled={!rating}
          onClick={onComplete}
          className="w-full bg-indigo-600 text-white font-bold py-5 rounded-2xl disabled:opacity-30 active:scale-[0.98] shadow-lg shadow-indigo-100"
        >
          Submit Feedback
        </button>

        <button 
          onClick={onComplete}
          className="text-slate-400 font-medium hover:text-slate-600 transition-all"
        >
          Skip
        </button>
      </div>
    </div>
  );
};

export default Feedback;
