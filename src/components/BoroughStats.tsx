'use client';

import { useGetComplaintStatsQuery } from '@/lib/redux';
import { MapPin } from 'lucide-react';

interface BoroughStatsProps {
  filters: {
    complaint_type?: string;
    borough?: string;
    status?: string;
    limit?: number;
  };
}

export default function BoroughStats({ filters }: BoroughStatsProps) {
  const { data: stats, isLoading, error } = useGetComplaintStatsQuery(filters);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl bg-neutral-900/70 ring-1 ring-white/10 p-5 animate-pulse">
            <div className="h-4 bg-neutral-800 rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-neutral-800 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="rounded-2xl bg-neutral-900/70 ring-1 ring-white/10 p-5">
        <div className="text-center text-neutral-400">
          Error loading data
        </div>
      </div>
    );
  }

  const boroughData = Object.entries(stats.byBorough)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 4);

  const boroughColors = {
    'MANHATTAN': 'from-emerald-400/30 to-sky-400/20 ring-emerald-400/30',
    'BROOKLYN': 'from-blue-400/30 to-indigo-400/20 ring-blue-400/30',
    'QUEENS': 'from-purple-400/30 to-violet-400/20 ring-purple-400/30',
    'BRONX': 'from-amber-400/30 to-orange-400/20 ring-amber-400/30',
    'STATEN ISLAND': 'from-rose-400/30 to-pink-400/20 ring-rose-400/30',
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {boroughData.map(([borough, count]) => (
        <div 
          key={borough}
          className={`rounded-2xl p-5 ring-1 ring-opacity-30 bg-gradient-to-r ${
            boroughColors[borough as keyof typeof boroughColors] || 'from-neutral-400/30 to-neutral-500/20 ring-neutral-400/30'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-neutral-300" strokeWidth={1.5} />
            <p className="text-xs text-neutral-100 font-medium">{borough}</p>
          </div>
          <p className="text-2xl tracking-tight font-semibold text-neutral-100">
            {count.toLocaleString()}
          </p>
          <p className="text-xs text-neutral-200 mt-1">
            {((count / stats.total) * 100).toFixed(1)}% of total
          </p>
        </div>
      ))}
    </div>
  );
}
