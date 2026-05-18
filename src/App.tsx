/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from './lib/db';
import { Onboarding } from './screens/Onboarding';
import { HomeScreen } from './screens/HomeScreen';
import { CalendarScreen } from './screens/CalendarScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { DailyLogModal } from './screens/DailyLogModal';
import { Home, Calendar as CalendarIcon, Settings } from 'lucide-react';
import { cn } from './lib/utils';

export default function App() {
  const profiles = useLiveQuery(() => db.userProfile.toArray());
  const [currentTab, setCurrentTab] = useState<'home' | 'calendar' | 'settings'>('home');
  const [logModalDate, setLogModalDate] = useState<string | null>(null);

  // Loading state
  if (profiles === undefined) {
    return <div className="h-screen flex items-center justify-center bg-[#FDFCFB]"><p className="text-slate-400 font-medium animate-pulse">Loading...</p></div>;
  }

  const profile = profiles[0] || null;

  // Not setup yet
  if (profile === null) {
    return (
      <div className="max-w-[440px] mx-auto h-screen relative bg-[#FDFCFB] overflow-hidden shadow-2xl sm:rounded-[32px] sm:h-[95vh] sm:my-[2.5vh] border border-slate-100 text-slate-800 font-sans">
         <Onboarding onComplete={() => setCurrentTab('home')} />
      </div>
    );
  }

  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'calendar', icon: CalendarIcon, label: 'Calendar' },
    { id: 'settings', icon: Settings, label: 'Settings' }
  ] as const;

  return (
    <div className="max-w-[440px] mx-auto h-screen relative bg-[#FDFCFB] overflow-hidden flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-[32px] sm:h-[95vh] sm:my-[2.5vh] border border-slate-100 text-slate-800 font-sans">
      
      {currentTab === 'home' && <HomeScreen profile={profile} onLogClick={setLogModalDate} />}
      {currentTab === 'calendar' && <CalendarScreen profile={profile} onLogClick={setLogModalDate} />}
      {currentTab === 'settings' && <SettingsScreen profile={profile} onUpdate={() => {}} />}
      
      {/* Bottom Nav */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100 flex justify-around items-center px-6 pt-3 pb-8 shadow-[0_-10px_40px_rgba(0,0,0,0.03)] z-40 sm:rounded-b-[32px] sm:pb-4 border-x">
        {tabs.map(tab => (
           <button 
             key={tab.id}
             onClick={() => setCurrentTab(tab.id)}
             className="flex flex-col items-center p-2 rounded-2xl active:scale-95 transition-transform"
           >
             <tab.icon size={24} className={cn("mb-1 transition-colors", currentTab === tab.id ? "text-slate-800" : "text-slate-400")} strokeWidth={currentTab === tab.id ? 2.5 : 2} />
             <span className={cn("text-[10px] uppercase tracking-widest font-bold", currentTab === tab.id ? "text-slate-800" : "text-slate-400")}>{tab.label}</span>
           </button>
        ))}
      </div>

      {logModalDate && (
        <DailyLogModal date={logModalDate} onClose={() => setLogModalDate(null)} />
      )}
    </div>
  );
}
