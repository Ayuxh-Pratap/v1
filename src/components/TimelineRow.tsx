'use client';

import { Coffee } from 'lucide-react';

interface TimelineRowProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  tasks: Array<{
    name: string;
    duration: string;
    startPercent: number;
    widthPercent: number;
    color: string;
    avatars: string[];
    isBreak?: boolean;
  }>;
}

export default function TimelineRow({ icon, title, subtitle, tasks }: TimelineRowProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-3">
      <div className="md:col-span-3 flex items-center gap-3">
        <button className="hidden md:flex h-8 w-8 rounded-full items-center justify-center ring-1 ring-white/10">
          {icon}
        </button>
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-xs text-neutral-400">{subtitle}</p>
        </div>
      </div>
      <div className="md:col-span-9">
        <div className="relative h-10 w-full rounded-xl ring-1 ring-white/5 bg-neutral-950/40 overflow-hidden">
          {/* Grid guides */}
          <div className="absolute inset-0 grid grid-cols-9">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className={i < 8 ? "border-r border-white/5" : ""}></div>
            ))}
          </div>
          
          {/* Task bars */}
          {tasks.map((task, index) => (
            <div
              key={index}
              className={`absolute top-1/2 -translate-y-1/2 h-7 rounded-lg px-3 flex items-center justify-between ${
                task.isBreak 
                  ? "bg-neutral-800/80 ring-1 ring-white/10" 
                  : `bg-gradient-to-r ${task.color} ring-1 ring-opacity-30`
              }`}
              style={{
                left: `${task.startPercent}%`,
                width: `${task.widthPercent}%`
              }}
            >
              <span className="text-xs text-neutral-200">{task.name} ({task.duration})</span>
              <div className="flex -space-x-2">
                {task.isBreak ? (
                  <Coffee className="w-4 h-4 text-neutral-400" strokeWidth={1.5} />
                ) : (
                  task.avatars.map((avatar, i) => (
                    <img
                      key={i}
                      className="h-5 w-5 rounded-full ring-2 ring-neutral-900 object-cover"
                      src={avatar}
                      alt="avatar"
                    />
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

