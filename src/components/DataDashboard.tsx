'use client';

import { useState } from 'react';
import { useGetComplaintStatsQuery } from '@/services/nycDataApi';
import { Search, RefreshCw, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import ComplaintsChart from './ComplaintsChart';
import BoroughStats from './BoroughStats';
import SimpleNYCMap from './SimpleNYCMap';
import ComplaintsTable from './ComplaintsTable';

export default function DataDashboard() {
  const { data: stats, refetch } = useGetComplaintStatsQuery();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBorough, setSelectedBorough] = useState('');

  const boroughs = [
    'MANHATTAN',
    'BROOKLYN', 
    'QUEENS',
    'BRONX',
    'STATEN ISLAND'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-400/20 to-sky-400/10 ring-1 ring-white/10 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-emerald-400" strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-[22px] sm:text-2xl tracking-tight font-semibold">311 Service Requests</h1>
            <p className="text-sm text-neutral-400">Real-time NYC complaint data analysis</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => refetch()}
            className="p-2 rounded-xl bg-neutral-900/70 ring-1 ring-white/10 hover:bg-neutral-800/70"
          >
            <RefreshCw className="w-5 h-5 text-neutral-300" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="rounded-2xl bg-neutral-900/70 ring-1 ring-white/10 p-5">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" strokeWidth={1.5} />
              <p className="text-xs text-neutral-400">Total Complaints</p>
            </div>
            <p className="text-2xl tracking-tight font-semibold">
              {stats.totalComplaints.toLocaleString()}
            </p>
          </div>
          
          <div className="rounded-2xl bg-neutral-900/70 ring-1 ring-white/10 p-5">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" strokeWidth={1.5} />
              <p className="text-xs text-neutral-400">Resolved</p>
            </div>
            <p className="text-2xl tracking-tight font-semibold">
              {stats.complaintsByStatus['Closed']?.toLocaleString() || '0'}
            </p>
          </div>
          
          <div className="rounded-2xl bg-neutral-900/70 ring-1 ring-white/10 p-5">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-amber-400" strokeWidth={1.5} />
              <p className="text-xs text-neutral-400">In Progress</p>
            </div>
            <p className="text-2xl tracking-tight font-semibold">
              {stats.complaintsByStatus['In Progress']?.toLocaleString() || '0'}
            </p>
          </div>
          
          <div className="rounded-2xl bg-neutral-900/70 ring-1 ring-white/10 p-5">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-sky-400" strokeWidth={1.5} />
              <p className="text-xs text-neutral-400">Open</p>
            </div>
            <p className="text-2xl tracking-tight font-semibold">
              {stats.complaintsByStatus['Open']?.toLocaleString() || '0'}
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" strokeWidth={1.5} />
          <input
            type="text"
            placeholder="Search complaints..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-neutral-900/70 ring-1 ring-white/10 rounded-xl text-neutral-100 placeholder-neutral-400 focus:ring-2 focus:ring-emerald-400/50 focus:outline-none"
          />
        </div>
        
        <div className="flex gap-2">
          <select
            value={selectedBorough}
            onChange={(e) => setSelectedBorough(e.target.value)}
            className="px-4 py-2 bg-neutral-900/70 ring-1 ring-white/10 rounded-xl text-neutral-100 focus:ring-2 focus:ring-emerald-400/50 focus:outline-none"
          >
            <option value="">All Boroughs</option>
            {boroughs.map((borough) => (
              <option key={borough} value={borough}>{borough}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Charts and Stats */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8">
          <ComplaintsChart />
        </div>
        
        <div className="xl:col-span-4 space-y-6">
          <BoroughStats />
        </div>
      </div>

      {/* Simple NYC Map */}
      <SimpleNYCMap />

      {/* Complaints Table */}
      <ComplaintsTable />
    </div>
  );
}
