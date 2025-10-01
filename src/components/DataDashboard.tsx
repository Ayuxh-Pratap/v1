'use client';

import { useState } from 'react';
import { useGetComplaintStatsQuery, useGetComplaintTypesQuery, useGetBoroughsQuery } from '@/lib/redux';
import { RefreshCw, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import BoroughStats from './BoroughStats';
import WorkingMap from './WorkingMap';
import EnhancedCharts from './EnhancedCharts';
import AnalyticsDashboard from './AnalyticsDashboard';
import ComplaintsTable from './ComplaintsTable';

export default function DataDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBorough, setSelectedBorough] = useState('');
  const [selectedComplaintType, setSelectedComplaintType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Create filter object for API calls
  const filters = {
    complaint_type: selectedComplaintType || undefined,
    borough: selectedBorough || undefined,
    status: selectedStatus || undefined,
    limit: 2000
  };

  const { data: stats, refetch, isFetching: statsFetching } = useGetComplaintStatsQuery(filters);
  const { data: complaintTypes } = useGetComplaintTypesQuery();
  const { data: boroughs } = useGetBoroughsQuery();

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
              {stats.total.toLocaleString()}
            </p>
          </div>
          
          <div className="rounded-2xl bg-neutral-900/70 ring-1 ring-white/10 p-5">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" strokeWidth={1.5} />
              <p className="text-xs text-neutral-400">Resolved</p>
            </div>
            <p className="text-2xl tracking-tight font-semibold">
              {stats.byStatus['Closed']?.toLocaleString() || '0'}
            </p>
          </div>
          
          <div className="rounded-2xl bg-neutral-900/70 ring-1 ring-white/10 p-5">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-amber-400" strokeWidth={1.5} />
              <p className="text-xs text-neutral-400">In Progress</p>
            </div>
            <p className="text-2xl tracking-tight font-semibold">
              {stats.byStatus['In Progress']?.toLocaleString() || '0'}
            </p>
          </div>
          
          <div className="rounded-2xl bg-neutral-900/70 ring-1 ring-white/10 p-5">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-sky-400" strokeWidth={1.5} />
              <p className="text-xs text-neutral-400">Open</p>
            </div>
            <p className="text-2xl tracking-tight font-semibold">
              {stats.byStatus['Open']?.toLocaleString() || '0'}
            </p>
          </div>
        </div>
      )}

      {/* Active Filters Indicator */}
      {(selectedComplaintType || selectedBorough || selectedStatus) && (
        <div className="flex items-center gap-2 p-3 bg-emerald-500/10 ring-1 ring-emerald-500/20 rounded-xl">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-emerald-400 font-medium">
            Filters Active: 
            {selectedComplaintType && ` Type: ${selectedComplaintType}`}
            {selectedBorough && ` Borough: ${selectedBorough}`}
            {selectedStatus && ` Status: ${selectedStatus}`}
          </span>
        </div>
      )}

      {/* Loading Indicator */}
      {/* {statsFetching && (
        <div className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-emerald-500/10 to-sky-500/10 ring-1 ring-emerald-500/20 rounded-xl">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
            <span className="text-sm text-emerald-400 font-medium">Updating data...</span>
          </div>
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-emerald-500/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-emerald-500/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-emerald-500/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      )} */}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex gap-2 flex-1">
          <select
            value={selectedComplaintType}
            onChange={(e) => setSelectedComplaintType(e.target.value)}
            className="px-4 py-2 bg-neutral-900/70 ring-1 ring-white/10 rounded-xl text-neutral-100 focus:ring-2 focus:ring-emerald-400/50 focus:outline-none"
          >
            <option value="">All Types</option>
            {complaintTypes?.slice(0, 10).map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          
          <select
            value={selectedBorough}
            onChange={(e) => setSelectedBorough(e.target.value)}
            className="px-4 py-2 bg-neutral-900/70 ring-1 ring-white/10 rounded-xl text-neutral-100 focus:ring-2 focus:ring-emerald-400/50 focus:outline-none"
          >
            <option value="">All Boroughs</option>
            {boroughs?.map((borough) => (
              <option key={borough} value={borough}>{borough}</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 bg-neutral-900/70 ring-1 ring-white/10 rounded-xl text-neutral-100 focus:ring-2 focus:ring-emerald-400/50 focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="Open">Open</option>
            <option value="Closed">Closed</option>
            <option value="In Progress">In Progress</option>
          </select>

          <button
            onClick={() => {
              setSelectedComplaintType('');
              setSelectedBorough('');
              setSelectedStatus('');
            }}
            className="ml-auto px-4 py-2 bg-neutral-800/70 ring-1 ring-white/10 rounded-xl text-neutral-300 hover:bg-neutral-700/70 focus:ring-2 focus:ring-emerald-400/50 focus:outline-none text-sm"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Enhanced Charts */}
      <EnhancedCharts filters={filters} isLoading={statsFetching} />

      {/* Analytics Dashboard */}
      <AnalyticsDashboard filters={filters} isLoading={statsFetching} />

      {/* Borough Stats */}
      <BoroughStats filters={filters} isLoading={statsFetching} />

      {/* Working NYC Map */}
      <WorkingMap 
        filters={filters} 
        searchTerm={searchTerm} 
        onSearchChange={setSearchTerm}
        isLoading={statsFetching}
      />

      {/* Complaints Table */}
      <ComplaintsTable filters={filters} searchTerm={searchTerm} isLoading={statsFetching} />
    </div>
  );
}
