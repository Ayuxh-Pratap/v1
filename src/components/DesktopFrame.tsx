'use client';

import { ReactNode } from 'react';
import { Minus, Square, X } from 'lucide-react';

interface DesktopFrameProps {
  children: ReactNode;
}

export default function DesktopFrame({ children }: DesktopFrameProps) {
  return (
    <div className="sm:my-8 max-w-[1200px] lg:max-w-[1280px] xl:max-w-[1400px] 2xl:max-w-[1600px] h-screen flex mt-4 mr-auto mb-4 ml-auto items-center">
      <div className="ring-1 ring-white/10 supports-[backdrop-filter]:bg-neutral-950/60 outline outline-1 outline-white/5 overflow-hidden bg-neutral-950/70 rounded-2xl mx-8 shadow-2xl backdrop-blur">
        {/* Frame Title Bar */}
        <div className="h-10 flex items-center justify-between px-3 sm:px-4 border-b border-white/10 bg-neutral-900/70">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-rose-500"></span>
            <span className="h-3 w-3 rounded-full bg-amber-400"></span>
            <span className="h-3 w-3 rounded-full bg-emerald-400"></span>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs text-neutral-300">Flow Pilot — Work Timeline</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button className="p-1.5 rounded-md hover:bg-neutral-800/70">
              <Minus className="w-[18px] h-[18px] text-neutral-300" strokeWidth={1.5} />
            </button>
            <button className="p-1.5 rounded-md hover:bg-neutral-800/70">
              <Square className="w-[18px] h-[18px] text-neutral-300" strokeWidth={1.5} />
            </button>
            <button className="p-1.5 rounded-md hover:bg-neutral-800/70">
              <X className="w-[18px] h-[18px] text-neutral-300" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* App Shell */}
        <div className="flex flex-col lg:flex-row">
          {children}
        </div>
      </div>
    </div>
  );
}

