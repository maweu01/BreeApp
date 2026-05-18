import React, { useState } from 'react';
import { UserProfile, db } from '../lib/db';

export function SettingsScreen({ profile, onUpdate }: { profile: UserProfile, onUpdate: () => void }) {
  const [data, setData] = useState({ ...profile });
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    await db.userProfile.put(data);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    onUpdate();
  };

  const handleReset = async () => {
    if (window.confirm("Are you sure you want to delete all your logged data? This cannot be undone.")) {
      await db.dailyLogs.clear();
      alert("All logs deleted.");
      onUpdate();
    }
  };

  return (
    <div className="flex-1 bg-[#FDFCFB] flex flex-col pt-16 px-6 overflow-y-auto pb-24 text-slate-800 border-x border-slate-100">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Settings</h1>
      </div>

      <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100 mb-6 space-y-6">
        <div>
          <label className="block text-[10px] uppercase font-bold text-slate-400 mb-2">Name</label>
          <input type="text" value={data.name} onChange={e => setData({...data, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:ring-2 focus:ring-rose-500 font-medium outline-none text-slate-800" />
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-2">Cycle Length</label>
            <input type="number" value={data.cycleLength} onChange={e => setData({...data, cycleLength: parseInt(e.target.value) || 28})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:ring-2 focus:ring-rose-500 font-medium outline-none text-slate-800" />
          </div>
          <div className="flex-1">
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-2">Period Length</label>
            <input type="number" value={data.periodDuration} onChange={e => setData({...data, periodDuration: parseInt(e.target.value) || 5})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:ring-2 focus:ring-rose-500 font-medium outline-none text-slate-800" />
          </div>
        </div>
        <div>
          <label className="block text-[10px] uppercase font-bold text-slate-400 mb-2">Base Period Start</label>
          <input type="date" value={data.lastPeriodStart} onChange={e => setData({...data, lastPeriodStart: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:ring-2 focus:ring-rose-500 font-medium outline-none text-slate-800" />
        </div>
        
        <button onClick={handleSave} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-colors shadow-sm">
          {saved ? 'Saved!' : 'Save Profile'}
        </button>
      </div>

      <div className="bg-rose-50 rounded-[32px] p-6 text-center shadow-sm">
        <p className="text-[10px] font-bold text-rose-300 uppercase tracking-widest mb-2">Privacy Focus</p>
        <p className="text-xs leading-relaxed text-rose-600 font-medium italic mb-4">
          "Your data never leaves this device. Securely encrypted in local Room storage."
        </p>
        <button onClick={handleReset} className="w-full py-3 bg-white text-rose-600 border border-rose-100 rounded-2xl font-bold hover:bg-rose-50 transition-colors shadow-sm text-sm">
           Wipe Log History
        </button>
      </div>
    </div>
  );
}
