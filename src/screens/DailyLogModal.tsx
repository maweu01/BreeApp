import React, { useState, useEffect } from 'react';
import { db, DailyLog, FlowIntensity } from '../lib/db';
import { X, Save } from 'lucide-react';
import { cn } from '../lib/utils';

export function DailyLogModal({ date, onClose }: { date: string; onClose: () => void }) {
  const [log, setLog] = useState<Partial<DailyLog>>({ date, flowIntensity: 'None', mood: '', symptoms: [], notes: '' });

  useEffect(() => {
    db.dailyLogs.get(date).then(existing => {
      if (existing) setLog(existing);
    });
  }, [date]);

  const handleSave = async () => {
    await db.dailyLogs.put(log as DailyLog);
    onClose();
  };

  const toggleSymptom = (sym: string) => {
    const current = log.symptoms || [];
    setLog({ ...log, symptoms: current.includes(sym) ? current.filter(s => s !== sym) : [...current, sym] });
  };

  const flows: FlowIntensity[] = ['None', 'Light', 'Medium', 'Heavy'];
  const moods = ['Happy', 'Sad', 'Sensitive', 'Energetic', 'Tired', 'Anxious', 'Calm'];
  const commonSymptoms = ['Cramps', 'Headache', 'Bloating', 'Acne', 'Tender Breasts', 'Backache', 'Fatigue'];

  const dateObj = new Date(date + "T00:00:00");

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/40 p-0 sm:p-4 pb-0 backdrop-blur-sm">
      <div className="bg-[#FDFCFB] w-full max-w-md h-[95vh] sm:h-[85vh] rounded-t-[32px] sm:rounded-[32px] flex flex-col shadow-2xl overflow-hidden border border-slate-100 transition-all">
        <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-white shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">
            Log for {dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
          </h2>
          <button onClick={onClose} className="p-2 bg-slate-50 rounded-full hover:bg-slate-100 text-slate-400 transition-colors border border-slate-100">
            <X size={20} className="stroke-[3]" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Flow Intensity</h3>
            <div className="flex gap-2">
              {flows.map(f => (
                <button key={f} onClick={() => setLog({ ...log, flowIntensity: f })} className={cn("flex-1 py-3 rounded-2xl text-xs font-bold border transition-all active:scale-95", log.flowIntensity === f ? "border-rose-200 bg-rose-50 text-rose-600 shadow-sm" : "border-slate-200 bg-white text-slate-500 hover:border-slate-300")}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Mood</h3>
            <div className="flex flex-wrap gap-2">
              {moods.map(m => (
                <button key={m} onClick={() => setLog({ ...log, mood: m })} className={cn("px-4 py-2 border rounded-2xl text-xs font-bold transition-all active:scale-95", log.mood === m ? "border-emerald-200 bg-emerald-50 text-emerald-600 shadow-sm" : "border-slate-200 bg-white text-slate-500 hover:border-slate-300")}>
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Symptoms</h3>
            <div className="flex flex-wrap gap-2">
              {commonSymptoms.map(s => (
                <button key={s} onClick={() => toggleSymptom(s)} className={cn("px-4 py-2 border rounded-2xl text-xs font-bold transition-all active:scale-95", log.symptoms?.includes(s) ? "border-rose-200 bg-rose-50 text-rose-600 shadow-sm" : "border-slate-200 bg-white text-slate-500 hover:border-slate-300")}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Notes</h3>
            <textarea value={log.notes || ''} onChange={e => setLog({...log, notes: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 min-h-[100px] outline-none focus:ring-2 focus:ring-rose-500 transition-colors font-medium text-sm text-slate-800 placeholder:text-slate-400 shadow-none"></textarea>
          </div>
        </div>
        
        <div className="p-6 bg-white border-t border-slate-100 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.03)] sm:rounded-b-[32px]">
          <button onClick={handleSave} className="w-full bg-rose-500 text-white rounded-2xl py-4 font-bold active:scale-95 transition-all shadow-lg shadow-rose-200 flex items-center justify-center gap-2 hover:bg-rose-600">
            <Save size={20} /> Save Log
          </button>
        </div>
      </div>
    </div>
  );
}
