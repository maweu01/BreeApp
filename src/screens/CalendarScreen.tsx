import React, { useState } from 'react';
import { UserProfile, db } from '../lib/db';
import { CycleEngine } from '../lib/CycleEngine';
import { formatDateStr, cn } from '../lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';

export function CalendarScreen({ profile, onLogClick }: { profile: UserProfile, onLogClick: (date: string) => void }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

  // Query logs
  const logs = useLiveQuery(() => db.dailyLogs.toArray()) || [];
  
  const logMap = React.useMemo(() => {
    const map: Record<string, any> = {};
    logs.forEach(log => map[log.date] = log);
    return map;
  }, [logs]);

  function isPredictedPeriod(dateStr: string) {
     const date = new Date(dateStr + "T00:00:00");
     const [ly, lm, ld] = profile.lastPeriodStart.split('-').map(Number);
     const basePeriod = new Date(ly, lm - 1, ld);
     
     if (date.getTime() < basePeriod.getTime()) return false;
     
     const diffMs = date.getTime() - basePeriod.getTime();
     const daysDiff = Math.floor(diffMs / CycleEngine.MS_PER_DAY);
     
     const cycleDay = (daysDiff % profile.cycleLength) + 1;
     return cycleDay <= profile.periodDuration;
  }
  
  function getOvulationFertileData(dateStr: string) {
     const date = new Date(dateStr + "T00:00:00");
     const [ly, lm, ld] = profile.lastPeriodStart.split('-').map(Number);
     const basePeriod = new Date(ly, lm - 1, ld);
     
     if (date.getTime() < basePeriod.getTime()) return { isOvulation: false, isFertile: false };
     
     const diffMs = date.getTime() - basePeriod.getTime();
     const daysDiff = Math.floor(diffMs / CycleEngine.MS_PER_DAY);
     
     const cycleOffset = Math.floor(daysDiff / profile.cycleLength);
     const cycleStartDay = new Date(basePeriod.getTime() + cycleOffset * profile.cycleLength * CycleEngine.MS_PER_DAY);
     
     const nextCycleStart = new Date(cycleStartDay.getTime() + profile.cycleLength * CycleEngine.MS_PER_DAY);
     const ovulation = CycleEngine.calculateOvulation(nextCycleStart);
     const fertileWindow = CycleEngine.calculateFertileWindow(ovulation);
     
     const isOvulation = date.getTime() === ovulation.getTime();
     const isFertile = date.getTime() >= fertileWindow.start.getTime() && date.getTime() <= fertileWindow.end.getTime();
     
     return { isOvulation, isFertile };
  }

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);
  const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="flex-1 bg-[#FDFCFB] flex flex-col pt-16 px-6 overflow-y-auto pb-24 text-slate-800 border-x border-slate-100">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Calendar</h1>
      </div>

      <div className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-6 px-2">
          <h4 className="text-lg font-bold">{monthName}</h4>
          <div className="flex gap-2">
            <button onClick={prevMonth} className="w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 cursor-pointer hover:bg-slate-50"><ChevronLeft size={16}/></button>
            <button onClick={nextMonth} className="w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 cursor-pointer hover:bg-slate-50"><ChevronRight size={16}/></button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <span key={day} className="text-[10px] font-bold text-slate-300 uppercase">{day}</span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-y-2 text-center">
          {blanks.map(b => <span key={`blank-${b}`} className="h-10 flex items-center justify-center text-slate-300"></span>)}
          {days.map(d => {
            const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const log = logMap[dateStr];
            
            const predictedPeriod = isPredictedPeriod(dateStr);
            const { isOvulation, isFertile } = getOvulationFertileData(dateStr);
            
            const isLoggedPeriod = log && log.flowIntensity !== 'None';
            const isPeriod = isLoggedPeriod || predictedPeriod;
            
            return (
              <button 
                key={d} 
                onClick={() => onLogClick(dateStr)}
                className={cn(
                  "h-10 w-full flex items-center justify-center text-sm font-medium relative transition-transform active:scale-95 mx-auto max-w-[40px] rounded-xl shadow-none",
                  isPeriod ? "bg-rose-500 text-white" : 
                  isOvulation ? "bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-100 scale-110" : 
                  isFertile ? "bg-emerald-50 text-emerald-600 rounded-xl" : "hover:bg-slate-50 text-slate-800"
                )}
              >
                {d}
                {log && !isPeriod && <div className="absolute bottom-1 w-1 h-1 bg-slate-300 rounded-full"></div>}
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex gap-4 justify-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-rose-500"></div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Period</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Fertile</span>
          </div>
        </div>
      </div>
      
      <div className="bg-slate-900 text-white rounded-[32px] p-6 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Upcoming Notification</p>
          <h5 className="text-lg font-bold">Ovulation Reminder</h5>
          <p className="text-xs text-slate-400 mt-1">Scheduled via WorkManager</p>
        </div>
        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
        </div>
      </div>
    </div>
  );
}
