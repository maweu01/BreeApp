import React from 'react';
import { UserProfile } from '../lib/db';
import { CycleEngine } from '../lib/CycleEngine';
import { CalendarHeart, ArrowRight } from 'lucide-react';
import { formatDateStr } from '../lib/utils';
import { cn } from '../lib/utils';

export function HomeScreen({ profile, onLogClick }: { profile: UserProfile, onLogClick: (date: string) => void }) {
  const today = new Date();
  const cycleDay = CycleEngine.calculateCycleDay(today, profile.lastPeriodStart);
  
  const progressPercent = Math.min((cycleDay / profile.cycleLength) * 100, 100);
  
  const nextPeriod = CycleEngine.calculateNextPeriod(profile.lastPeriodStart, profile.cycleLength);
  const diffTime = nextPeriod.getTime() - today.getTime();
  const daysUntil = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const isPeriodPhase = cycleDay <= profile.periodDuration;
  
  return (
    <div className="flex-1 bg-[#FDFCFB] flex flex-col pt-16 px-6 overflow-y-auto pb-24 text-slate-800 border-x border-slate-100 relative">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Hi, {profile.name}</h1>
        <p className="text-slate-500 font-medium mt-1 text-sm">Ready to log your day?</p>
      </div>
      
      <div className="bg-white border border-slate-100 rounded-[32px] p-8 flex flex-col items-center justify-center shadow-sm relative overflow-hidden mb-6">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-rose-50 rounded-full opacity-50"></div>
        <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Current Status</span>
        
        {/* Circular Progress */}
        <div className="relative w-48 h-48 flex items-center justify-center mb-6">
          <svg className="absolute w-full h-full -rotate-90">
            <circle cx="96" cy="96" r="88" stroke="#F1F5F9" strokeWidth="12" fill="transparent" />
            <circle cx="96" cy="96" r="88" stroke={isPeriodPhase ? "#FB7185" : "#A7F3D0"} strokeWidth="12" fill="transparent" strokeDasharray="552.9" strokeDashoffset={552.9 - (552.9 * progressPercent) / 100} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
          </svg>
          <div className="flex flex-col items-center text-center z-10">
            <span className="text-5xl font-black text-slate-900">{cycleDay}</span>
            <span className="text-xs font-bold text-slate-500 uppercase mt-1">Cycle Day</span>
          </div>
        </div>

        <h3 className="text-xl font-bold text-slate-900">{isPeriodPhase ? 'Menstruation Phase' : 'Follicular Phase'}</h3>
        <p className="text-sm text-slate-500 mt-1 mb-6">{isPeriodPhase ? 'Keep logging your flows' : 'Energy levels rising'}</p>

        <div className="w-full flex justify-between bg-slate-50 rounded-2xl p-4">
          <div className="flex flex-col items-center flex-1 border-r border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 mb-1">Period</span>
            <span className="text-sm font-bold text-slate-700">{daysUntil > 0 ? `In ${daysUntil} days` : daysUntil === 0 ? 'Today' : `${Math.abs(daysUntil)} days late`}</span>
          </div>
          <div className="flex flex-col items-center flex-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 mb-1">Length</span>
            <span className="text-sm font-bold text-slate-700">{profile.cycleLength} days</span>
          </div>
        </div>
      </div>
      
      {isPeriodPhase && (
         <div className="bg-rose-50 rounded-[32px] p-6 text-center border-rose-100 border mb-6 relative overflow-hidden">
            <div className="absolute -bottom-4 right-0 opacity-20 text-rose-500">
               <CalendarHeart size={80} />
            </div>
            <p className="text-[10px] font-bold text-rose-400 uppercase tracking-widest mb-2">Notice</p>
            <p className="text-sm leading-relaxed text-rose-600 font-bold relative z-10">
              You're currently on your period.
            </p>
         </div>
      )}

      <button onClick={() => onLogClick(formatDateStr(today))} className="mt-auto mb-2 bg-rose-500 hover:bg-rose-600 text-white w-full rounded-2xl py-4 font-bold flex items-center justify-center gap-3 shadow-lg shadow-rose-200 active:scale-[0.98] transition-all">
        Log Symptoms <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
      </button>
    </div>
  );
}
