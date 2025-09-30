'use client';

import { MoreHorizontal, Calendar } from 'lucide-react';

interface ProjectCardProps {
  title: string;
  subtitle: string;
  image: string;
  avatars: string[];
  timeLeft: string;
  progress: number;
}

export default function ProjectCard({ title, subtitle, image, avatars, timeLeft, progress }: ProjectCardProps) {
  return (
    <div className="rounded-2xl bg-neutral-900/70 ring-1 ring-white/10 p-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg tracking-tight font-semibold">{title}</h3>
          <p className="text-xs text-neutral-400">{subtitle}</p>
        </div>
        <button className="p-1.5 rounded-lg hover:bg-neutral-800/70">
          <MoreHorizontal className="w-4 h-4 text-neutral-400" strokeWidth={1.5} />
        </button>
      </div>
      <img 
        className="h-28 w-full ring-1 ring-white/10 object-cover rounded-xl mt-3" 
        src={image} 
        alt="project cover" 
      />
      <div className="mt-4 flex items-center justify-between">
        <div className="flex -space-x-2">
          {avatars.map((avatar, index) => (
            <img
              key={index}
              className="h-6 w-6 rounded-full ring-2 ring-neutral-900 object-cover"
              src={avatar}
              alt="avatar"
            />
          ))}
        </div>
        <span className="text-xs text-neutral-400 flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" strokeWidth={1.5} />
          {timeLeft}
        </span>
      </div>
      <div className="mt-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-neutral-300">Progress</span>
          <span className="text-neutral-400">{progress}%</span>
        </div>
        <div className="mt-1 h-2 rounded-full bg-neutral-800 ring-1 ring-white/5">
          <div 
            className="h-2 rounded-full bg-gradient-to-r from-emerald-400 to-sky-400"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

