
import React from 'react';
import { UserProfile } from '../types';
import { TRIAL_LIMIT_QUESTIONS } from '../constants';

interface Props {
  profile: UserProfile;
  questionsUsed: number;
  onStartPractice: () => void;
  onToggleTheme: () => void;
  isDarkMode: boolean;
}

const Dashboard: React.FC<Props> = ({ profile, questionsUsed, onStartPractice, onToggleTheme, isDarkMode }) => {
  const progressPercent = Math.min((questionsUsed / TRIAL_LIMIT_QUESTIONS) * 100, 100);

  return (
    <div className="min-h-screen p-6 pb-24 no-scrollbar overflow-y-auto">
      {/* Header with Aesthetic Toggle */}
      <div className="flex justify-between items-start mb-12">
        <div className="space-y-1">
          <p className="font-hand text-xl text-indigo-600 dark:text-indigo-400">Study Log v1.0</p>
          <h2 className="text-4xl font-black tracking-tight dark:text-white">
            Hi, {profile.name.split(' ')[0]}! ✏️
          </h2>
        </div>
        <button 
          onClick={onToggleTheme}
          className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-xl shadow-md border border-slate-100 dark:border-slate-700 btn-aesthetic"
        >
          {isDarkMode ? '🌙' : '☀️'}
        </button>
      </div>

      {/* Progress Sticky Note */}
      <div className="relative mb-12 transform -rotate-1">
        <div className="w-full bg-yellow-100 dark:bg-yellow-900/40 p-8 rounded-3xl puffy-shadow border-t-8 border-yellow-200 dark:border-yellow-800">
          <div className="flex justify-between items-center mb-6">
            <span className="font-doodle text-xl text-yellow-800 dark:text-yellow-300">Goal: 25 Daily Qs</span>
            <span className="bg-white/50 dark:bg-black/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
              Status: Active
            </span>
          </div>

          <div className="flex justify-between items-end mb-4">
             <div>
               <p className="text-4xl font-black text-slate-900 dark:text-white">{TRIAL_LIMIT_QUESTIONS - questionsUsed}</p>
               <p className="font-hand text-lg text-slate-500">questions left today</p>
             </div>
             <div className="text-right">
                <p className="text-2xl font-black text-slate-900 dark:text-white">7/10</p>
                <p className="font-hand text-sm text-slate-500">focus score</p>
             </div>
          </div>

          <div className="h-3 bg-white/40 dark:bg-black/20 rounded-full overflow-hidden">
             <div 
               className="h-full bg-indigo-500 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(99,102,241,0.3)]"
               style={{ width: `${100 - progressPercent}%` }}
             ></div>
          </div>
        </div>
        {/* Doodle Sticker */}
        <div className="absolute -top-6 -right-4 w-16 h-16 bg-pink-100 dark:bg-pink-900/50 rounded-full flex items-center justify-center text-2xl shadow-lg border-2 border-white rotate-12">
          🦋
        </div>
      </div>

      {/* Action Sections */}
      <div className="space-y-8">
        <div className="flex justify-between items-center px-2">
           <h3 className="text-xl font-bold tracking-tight dark:text-white">My Study Board</h3>
           <span className="font-hand text-lg text-slate-400">see all</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={onStartPractice}
            className="col-span-2 h-44 bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 text-left relative overflow-hidden border border-slate-100 dark:border-slate-800 puffy-shadow group btn-aesthetic"
          >
            <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-100 transition-opacity">
               <span className="text-6xl grayscale group-hover:grayscale-0 transition-all">📓</span>
            </div>
            <div className="space-y-2">
               <span className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full">Primary Action</span>
               <h4 className="text-3xl font-black leading-none dark:text-white">Chapter<br/>Practice</h4>
               <p className="font-hand text-xl text-slate-500">20Q sets, timed</p>
            </div>
          </button>

          <button className="h-40 bg-pink-50 dark:bg-pink-900/20 rounded-[2.5rem] p-6 text-left relative group opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all btn-aesthetic border border-pink-100 dark:border-pink-900/50">
             <span className="text-3xl block mb-4">🧪</span>
             <h4 className="text-lg font-black dark:text-white">Full Mocks</h4>
             <p className="font-hand text-sm text-slate-500">locked</p>
          </button>

          <button className="h-40 bg-teal-50 dark:bg-teal-900/20 rounded-[2.5rem] p-6 text-left relative group opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all btn-aesthetic border border-teal-100 dark:border-teal-900/50">
             <span className="text-3xl block mb-4">🎨</span>
             <h4 className="text-lg font-black dark:text-white">Flashcards</h4>
             <p className="font-hand text-sm text-slate-500">coming soon</p>
          </button>
        </div>

        {/* Stats Notebook Page */}
        <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 border border-slate-100 dark:border-slate-800 puffy-shadow">
           <div className="flex items-center gap-3 mb-8">
              <span className="text-2xl">📊</span>
              <h3 className="text-xl font-bold dark:text-white">Progress Tracker</h3>
           </div>
           <div className="space-y-8">
              <StatRow label="Physics" value={68} icon="⚛️" color="bg-blue-400" />
              <StatRow label="Chemistry" value={74} icon="⚗️" color="bg-orange-400" />
              <StatRow label="Botany" value={92} icon="🌿" color="bg-emerald-400" />
           </div>
        </div>
      </div>
    </div>
  );
};

const StatRow: React.FC<{ label: string, value: number, icon: string, color: string }> = ({ label, value, icon, color }) => (
  <div>
    <div className="flex justify-between items-center mb-3">
       <div className="flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          <span className="text-sm font-bold dark:text-slate-300">{label}</span>
       </div>
       <span className="font-hand text-lg text-slate-500">{value}%</span>
    </div>
    <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
       <div 
         className={`h-full ${color} rounded-full transition-all duration-1000 ease-out`}
         style={{ width: `${value}%` }}
       />
    </div>
  </div>
);

export default Dashboard;
