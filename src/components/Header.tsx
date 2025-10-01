'use client';

import { Radar, Calendar, Search, Bell } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Header() {
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    const today = new Date();
    const date = today.toLocaleDateString(undefined, { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
    setFormattedDate(date);
  }, []);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-400/20 to-sky-400/10 ring-1 ring-white/10 flex items-center justify-center">
            <Radar className="w-5 h-5 text-emerald-400" strokeWidth={1.5} />
          </div>
          <h1 className="text-[22px] sm:text-2xl tracking-tight font-semibold">NYC Open Data</h1>
        </div>
        <div className="hidden md:flex items-center gap-2 text-sm text-neutral-400">
          <Calendar className="w-4 h-4" strokeWidth={1.5} />
          <span className="">{formattedDate}</span>
          <span className="ml-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rose-500/15 text-rose-300 px-1.5 text-[11px]">1</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {/* <div className="hidden sm:flex bg-neutral-900/70 ring-1 ring-white/10 rounded-xl p-1">
          <button className="px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-300 bg-neutral-800/70">Day</button>
          <button className="px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-400 hover:text-neutral-200">Week</button>
          <button className="px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-400 hover:text-neutral-200">Month</button>
          <button className="px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-400 hover:text-neutral-200">Year</button>
        </div> */}
        <button className="hidden sm:flex p-2 rounded-xl bg-neutral-900/70 ring-1 ring-white/10 hover:bg-neutral-800/70">
          <Search className="w-5 h-5 text-neutral-300" strokeWidth={1.5} />
        </button>
        <button className="relative p-2 rounded-xl bg-neutral-900/70 ring-1 ring-white/10 hover:bg-neutral-800/70">
          <Bell className="w-5 h-5 text-neutral-300" strokeWidth={1.5} />
          <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-neutral-950"></span>
        </button>
        <div className="flex items-center gap-2">
          <img 
            src="https://hoirqrkdgbmvpwutwuwj-all.supabase.co/storage/v1/object/public/assets/assets/0dd1790c-456a-4f93-bfce-911a2196719b_800w.jpg" 
            alt="Profile" 
            className="h-8 w-8 rounded-full object-cover ring-2 ring-white/10"
          />
          <div className="hidden sm:flex flex-col leading-tight">
            <span className="text-sm font-medium">Jackson Jesionowski</span>
            <span className="text-[11px] text-neutral-400">@NonProphet</span>
          </div>
        </div>
      </div>
    </div>
  );
}

