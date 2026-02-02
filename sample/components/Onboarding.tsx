
import React, { useState, useEffect } from 'react';
import { AppScreen, ExamType, Language, UserProfile } from '../types';

interface Props {
  screen: AppScreen;
  onNext: (screen: AppScreen) => void;
  onComplete: (profile: UserProfile) => void;
}

const Onboarding: React.FC<Props> = ({ screen, onNext, onComplete }) => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    exam: ExamType.NEET,
    language: Language.ENGLISH
  });

  const handleProfileChange = (field: keyof UserProfile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const renderPhone = () => (
    <div className="p-10 h-screen flex flex-col justify-between bg-slate-950 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 blur-[120px] rounded-full"></div>
      
      <div className="relative z-10 space-y-12 mt-20 stagger-in">
        <div className="space-y-4">
          <h1 className="text-5xl font-extrabold text-white tracking-tighter leading-[0.9]">Start Your <br/><span className="text-indigo-500">Ascent.</span></h1>
          <p className="text-slate-500 font-bold text-sm tracking-wide">Enter your number to verify identity.</p>
        </div>

        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl blur opacity-20 group-focus-within:opacity-100 transition duration-500"></div>
          <div className="relative flex items-center bg-slate-900 rounded-[1.5rem] border border-white/5">
            <span className="pl-6 text-indigo-400 font-black text-lg">+91</span>
            <input 
              type="tel"
              autoFocus
              placeholder="9876543210"
              className="w-full bg-transparent py-6 px-4 text-xl font-bold text-white placeholder:text-slate-700 focus:outline-none"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
            />
          </div>
        </div>
      </div>

      <div className="relative z-10 pb-10">
        <button 
          disabled={phone.length < 10}
          onClick={() => onNext(AppScreen.ONBOARDING_OTP)}
          className="w-full bg-indigo-600 text-white font-extrabold py-6 rounded-[2rem] shadow-2xl shadow-indigo-900/40 disabled:opacity-20 transition-all btn-tactile text-xl"
        >
          Verify Number
        </button>
      </div>
    </div>
  );

  const renderOtp = () => (
    <div className="p-10 h-screen flex flex-col justify-between bg-slate-950 stagger-in">
      <div className="mt-20 space-y-12">
        <div className="space-y-4">
          <h1 className="text-5xl font-extrabold text-white tracking-tighter">Security <br/>Check.</h1>
          <p className="text-slate-500 font-bold text-sm">Sent to <span className="text-indigo-400">+91 {phone}</span></p>
        </div>

        <div className="flex justify-between gap-3">
          {[0, 1, 2, 3].map(i => (
            <input 
              key={i}
              type="text"
              maxLength={1}
              autoFocus={i === 0}
              className="w-full h-20 bg-slate-900 border border-white/5 rounded-2xl text-center text-3xl font-black text-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
              value={otp[i] || ''}
              onChange={(e) => {
                const val = e.target.value;
                if (val.length <= 1) setOtp(otp + val);
              }}
            />
          ))}
        </div>
      </div>
      <div className="pb-10">
        <button 
          disabled={otp.length < 4}
          onClick={() => onNext(AppScreen.ONBOARDING_PROFILE)}
          className="w-full bg-white text-slate-950 font-extrabold py-6 rounded-[2rem] shadow-2xl disabled:opacity-20 transition-all btn-tactile text-xl"
        >
          Confirm OTP
        </button>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="p-10 h-screen overflow-y-auto no-scrollbar pb-40 bg-slate-950 stagger-in">
      <div className="mt-20 space-y-12">
        <div className="space-y-4">
          <h1 className="text-5xl font-extrabold text-white tracking-tighter">Identity <br/>Setup.</h1>
          <p className="text-slate-500 font-bold text-sm">Let us know who's practicing today.</p>
        </div>
        
        <div className="space-y-8">
          <ProfileInput label="Full Name" placeholder="e.g. Rahul Sharma" onChange={(v) => handleProfileChange('name', v)} />
          <ProfileInput label="Email Address" placeholder="rahul@example.com" onChange={(v) => handleProfileChange('email', v)} />
          <div className="grid grid-cols-2 gap-4">
             <ProfileInput label="Age" placeholder="18" onChange={(v) => handleProfileChange('age', v)} />
             <ProfileInput label="College" placeholder="XYZ School" onChange={(v) => handleProfileChange('college', v)} />
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-10 bg-gradient-to-t from-slate-950 via-slate-950 to-transparent">
        <button 
          onClick={() => onNext(AppScreen.ONBOARDING_EXAM)}
          className="w-full bg-indigo-600 text-white font-extrabold py-6 rounded-[2rem] shadow-2xl shadow-indigo-900/40 btn-tactile text-xl"
        >
          Proceed to Preferences
        </button>
      </div>
    </div>
  );

  const renderExam = () => (
    <div className="p-10 h-screen flex flex-col justify-between bg-slate-950 stagger-in">
      <div className="mt-20 space-y-12">
        <div className="space-y-4">
          <h1 className="text-5xl font-extrabold text-white tracking-tighter">Mission <br/>Target.</h1>
          <p className="text-slate-500 font-bold text-sm">Tailoring your neural path.</p>
        </div>

        <div className="space-y-10">
          <div className="space-y-4">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Primary Exam</p>
            <div className="grid grid-cols-3 gap-3">
              {[ExamType.NEET, ExamType.CUET, ExamType.BOTH].map(e => (
                <button 
                  key={e}
                  onClick={() => handleProfileChange('exam', e)}
                  className={`py-4 rounded-2xl font-black text-xs transition-all border-2 ${profile.exam === e ? 'bg-white text-slate-950 border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]' : 'bg-slate-900 text-slate-500 border-white/5'}`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Language Node</p>
            <div className="grid grid-cols-2 gap-3">
              {[Language.ENGLISH, Language.TELUGU].map(l => (
                <button 
                  key={l}
                  onClick={() => handleProfileChange('language', l)}
                  className={`py-4 rounded-2xl font-black text-xs transition-all border-2 ${profile.language === l ? 'bg-indigo-600 text-white border-indigo-600 shadow-[0_0_20px_rgba(79,70,229,0.3)]' : 'bg-slate-900 text-slate-500 border-white/5'}`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="pb-10 space-y-6">
        <div className="glass-premium p-6 rounded-[2rem] border border-white/5 flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center text-xl">✨</div>
            <div>
                <p className="text-indigo-400 text-xs font-black uppercase tracking-widest">Genesis Pack</p>
                <p className="text-slate-400 text-[10px] font-bold">25Q Trial Access Unlocked</p>
            </div>
        </div>
        <button 
          onClick={() => onComplete({ ...profile, phone } as UserProfile)}
          className="w-full bg-white text-slate-950 font-extrabold py-6 rounded-[2rem] shadow-2xl btn-tactile text-xl"
        >
          Initialize Academy
        </button>
      </div>
    </div>
  );

  switch (screen) {
    case AppScreen.ONBOARDING_PHONE: return renderPhone();
    case AppScreen.ONBOARDING_OTP: return renderOtp();
    case AppScreen.ONBOARDING_PROFILE: return renderProfile();
    case AppScreen.ONBOARDING_EXAM: return renderExam();
    default: return null;
  }
};

const ProfileInput: React.FC<{ label: string, placeholder: string, onChange: (v: string) => void }> = ({ label, placeholder, onChange }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">{label}</label>
    <input 
      className="w-full bg-slate-900 border border-white/5 rounded-2xl py-5 px-6 font-bold text-white placeholder:text-slate-700 focus:outline-none focus:border-indigo-500 transition-all"
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

export default Onboarding;
