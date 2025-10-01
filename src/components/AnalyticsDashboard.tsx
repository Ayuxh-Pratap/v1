'use client';

import { useGetComplaintStatsQuery } from '@/lib/redux';
import { Clock, CheckCircle, AlertTriangle, Users } from 'lucide-react';

interface AnalyticsDashboardProps {
  filters: {
    complaint_type?: string;
    borough?: string;
    status?: string;
    limit?: number;
  };
}

export default function AnalyticsDashboard({ filters }: AnalyticsDashboardProps) {
  const { data: stats, isLoading, error } = useGetComplaintStatsQuery(filters);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
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
          Error loading analytics data
        </div>
      </div>
    );
  }

  // Calculate performance metrics
  const totalComplaints = stats.total;
  const closedComplaints = stats.byStatus['Closed'] || 0;
  const openComplaints = stats.byStatus['Open'] || 0;
  const inProgressComplaints = stats.byStatus['In Progress'] || 0;
  
  const resolutionRate = totalComplaints > 0 ? ((closedComplaints / totalComplaints) * 100).toFixed(1) : '0';
  const openRate = totalComplaints > 0 ? ((openComplaints / totalComplaints) * 100).toFixed(1) : '0';
  
  // Get top agencies
  const topAgencies = Object.entries(stats.byAgency)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  // Get top complaint types
  const topComplaintTypes = Object.entries(stats.byType)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-gradient-to-r from-emerald-400/20 to-sky-400/10 ring-1 ring-emerald-400/30 p-5">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" strokeWidth={1.5} />
            <p className="text-xs text-neutral-100 font-medium">Resolution Rate</p>
          </div>
          <p className="text-2xl tracking-tight font-semibold text-neutral-100">
            {resolutionRate}%
          </p>
          <p className="text-xs text-neutral-200 mt-1">
            {closedComplaints.toLocaleString()} resolved
          </p>
        </div>

        <div className="rounded-2xl bg-gradient-to-r from-rose-400/20 to-pink-400/10 ring-1 ring-rose-400/30 p-5">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" strokeWidth={1.5} />
            <p className="text-xs text-neutral-100 font-medium">Open Rate</p>
          </div>
          <p className="text-2xl tracking-tight font-semibold text-neutral-100">
            {openRate}%
          </p>
          <p className="text-xs text-neutral-200 mt-1">
            {openComplaints.toLocaleString()} open
          </p>
        </div>

        <div className="rounded-2xl bg-gradient-to-r from-amber-400/20 to-orange-400/10 ring-1 ring-amber-400/30 p-5">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-amber-400" strokeWidth={1.5} />
            <p className="text-xs text-neutral-100 font-medium">In Progress</p>
          </div>
          <p className="text-2xl tracking-tight font-semibold text-neutral-100">
            {inProgressComplaints.toLocaleString()}
          </p>
          <p className="text-xs text-neutral-200 mt-1">
            {totalComplaints > 0 ? (((inProgressComplaints / totalComplaints) * 100).toFixed(1)) : '0'}% of total
          </p>
        </div>

        <div className="rounded-2xl bg-gradient-to-r from-blue-400/20 to-indigo-400/10 ring-1 ring-blue-400/30 p-5">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-blue-400" strokeWidth={1.5} />
            <p className="text-xs text-neutral-100 font-medium">Total Agencies</p>
          </div>
          <p className="text-2xl tracking-tight font-semibold text-neutral-100">
            {Object.keys(stats.byAgency).length}
          </p>
          <p className="text-xs text-neutral-200 mt-1">
            Active agencies
          </p>
        </div>
      </div>

      {/* Top Agencies Performance */}
      <div className="rounded-2xl bg-neutral-900/70 ring-1 ring-white/10 p-5">
        <h3 className="text-lg tracking-tight font-semibold mb-4">Top Agencies by Complaint Volume</h3>
        <div className="space-y-3">
          {topAgencies.map(([agency, count], index) => (
            <div key={agency} className="flex items-center justify-between p-3 bg-neutral-800/50 rounded-xl ring-1 ring-white/5">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-emerald-400/20 to-sky-400/10 ring-1 ring-emerald-400/30">
                  <span className="text-sm font-semibold text-emerald-400">#{index + 1}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-200">{agency}</p>
                  <p className="text-xs text-neutral-400">
                    {((count / totalComplaints) * 100).toFixed(1)}% of total complaints
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-neutral-100">{count.toLocaleString()}</p>
                <p className="text-xs text-neutral-400">complaints</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Complaint Types */}
      <div className="rounded-2xl bg-neutral-900/70 ring-1 ring-white/10 p-5">
        <h3 className="text-lg tracking-tight font-semibold mb-4">Most Common Complaint Types</h3>
        <div className="space-y-3">
          {topComplaintTypes.map(([type, count], index) => (
            <div key={type} className="flex items-center justify-between p-3 bg-neutral-800/50 rounded-xl ring-1 ring-white/5">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-rose-400/20 to-pink-400/10 ring-1 ring-rose-400/30">
                  <span className="text-sm font-semibold text-rose-400">#{index + 1}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-200">{type}</p>
                  <p className="text-xs text-neutral-400">
                    {((count / totalComplaints) * 100).toFixed(1)}% of total complaints
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-neutral-100">{count.toLocaleString()}</p>
                <p className="text-xs text-neutral-400">complaints</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Borough Performance */}
      <div className="rounded-2xl bg-neutral-900/70 ring-1 ring-white/10 p-5">
        <h3 className="text-lg tracking-tight font-semibold mb-4">Borough Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(stats.byBorough)
            .sort(([,a], [,b]) => b - a)
            .map(([borough, count]) => (
              <div key={borough} className="p-4 bg-neutral-800/50 rounded-xl ring-1 ring-white/5">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-neutral-200">{borough}</h4>
                  <span className="text-xs text-neutral-400">
                    {((count / totalComplaints) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-neutral-700/50 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-emerald-400 to-sky-400 h-2 rounded-full"
                      style={{ width: `${(count / Math.max(...Object.values(stats.byBorough))) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-neutral-100">{count.toLocaleString()}</span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
