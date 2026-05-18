import React, { useState } from 'react';
import { db } from '../lib/db';
import { formatDateStr } from '../lib/utils';

export function Onboarding({ onComplete }: { onComplete: () => void }) {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [cycleLength, setCycleLength] = useState('28');
  const [periodDuration, setPeriodDuration] = useState('5');
  const [lastPeriodStart, setLastPeriodStart] = useState(formatDateStr(new Date()));

  const handleSave = async () => {
    if (!name || !dob || !lastPeriodStart) return;
    try {
      await db.userProfile.put({
        id: 1,
        name,
        dob,
        cycleLength: parseInt(cycleLength, 10),
        periodDuration: parseInt(periodDuration, 10),
        lastPeriodStart,
      });
      onComplete();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#FDFCFB] px-6 pt-12 pb-6 absolute inset-0 z-50 overflow-y-auto text-slate-800 border-x border-slate-100">
      <div className="flex flex-col gap-2 mb-8 mt-4">
        <div className="w-12 h-12 bg-rose-400 rounded-full flex items-center justify-center text-white mb-2 shadow-lg shadow-rose-200">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Welcome to Bree</h1>
        <p className="text-slate-500 font-medium text-sm">Your simple, offline menstrual tracker. Data never leaves your device.</p>
      </div>
      
      <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100 space-y-5 flex-1">
        <div>
          <label className="block text-[10px] uppercase font-bold text-slate-400 mb-2">Your Name</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:ring-2 focus:ring-rose-500 outline-none shadow-sm text-slate-800" placeholder="Jane" />
        </div>
        <div>
          <label className="block text-[10px] uppercase font-bold text-slate-400 mb-2">Date of Birth</label>
          <input type="date" value={dob} onChange={e => setDob(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:ring-2 focus:ring-rose-500 outline-none shadow-sm text-slate-800" />
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-2 line-clamp-1">Cycle Length</label>
            <input type="number" value={cycleLength} onChange={e => setCycleLength(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:ring-2 focus:ring-rose-500 outline-none shadow-sm text-slate-800" min="20" max="60" />
          </div>
          <div className="flex-1">
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-2 line-clamp-1">Period Length</label>
            <input type="number" value={periodDuration} onChange={e => setPeriodDuration(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:ring-2 focus:ring-rose-500 outline-none shadow-sm text-slate-800" min="1" max="15" />
          </div>
        </div>
        <div>
          <label className="block text-[10px] uppercase font-bold text-slate-400 mb-2">Last Period Start Date</label>
          <input type="date" value={lastPeriodStart} onChange={e => setLastPeriodStart(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:ring-2 focus:ring-rose-500 outline-none shadow-sm text-slate-800" />
        </div>
      </div>
      <div className="pt-6 mt-4 mb-safe">
        <button onClick={handleSave} disabled={!name || !dob || !lastPeriodStart} className="w-full bg-rose-500 hover:bg-rose-600 text-white rounded-2xl py-4 font-bold flex items-center justify-center gap-3 shadow-lg shadow-rose-200 active:scale-[0.98] transition-all disabled:opacity-50 disabled:shadow-none">Start Tracking</button>
      </div>
    </div>
  );
}
