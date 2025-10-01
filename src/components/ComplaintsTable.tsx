'use client';

import { useState } from 'react';
import { useGetNYCComplaintsQuery } from '@/lib/redux';
import { Search, ChevronDown, ChevronUp, Clock, AlertCircle } from 'lucide-react';

interface ComplaintsTableProps {
  filters: {
    complaint_type?: string;
    borough?: string;
    status?: string;
    limit?: number;
  };
  searchTerm: string;
  isLoading?: boolean;
}

export default function ComplaintsTable({ filters, searchTerm, isLoading: externalLoading }: ComplaintsTableProps) {
  const { data: complaints, isLoading, error } = useGetNYCComplaintsQuery(filters);
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [selectedBorough, setSelectedBorough] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [sortField, setSortField] = useState('created_date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="rounded-2xl bg-neutral-900/70 ring-1 ring-white/10 p-5">
        <div className="animate-pulse">
          <div className="h-4 bg-neutral-800 rounded w-1/3 mb-4"></div>
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 bg-neutral-800 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-neutral-900/70 ring-1 ring-white/10 p-5">
        <h3 className="text-lg tracking-tight font-semibold mb-4">Complaints Table</h3>
        <div className="text-center text-neutral-400">
          Error loading data
        </div>
      </div>
    );
  }

  if (!complaints || complaints.length === 0) {
    return (
      <div className="rounded-2xl bg-neutral-900/70 ring-1 ring-white/10 p-5">
        <h3 className="text-lg tracking-tight font-semibold mb-4">Complaints Table</h3>
        <div className="text-center text-neutral-400">
          No complaints found
        </div>
      </div>
    );
  }

  // Get unique values for filters
  const boroughs = [...new Set(complaints.map(c => c.borough))].sort();
  const statuses = [...new Set(complaints.map(c => c.status))].sort();

  // Filter and sort data
  const filteredComplaints = complaints
    .filter(complaint => {
      const globalSearch = !searchTerm || 
        complaint.complaint_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.descriptor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (complaint.incident_address && complaint.incident_address.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const localSearch = !localSearchTerm || 
        complaint.complaint_type.toLowerCase().includes(localSearchTerm.toLowerCase()) ||
        complaint.descriptor.toLowerCase().includes(localSearchTerm.toLowerCase()) ||
        (complaint.incident_address && complaint.incident_address.toLowerCase().includes(localSearchTerm.toLowerCase()));
      
      const matchesBorough = !selectedBorough || complaint.borough === selectedBorough;
      const matchesStatus = !selectedStatus || complaint.status === selectedStatus;
      return globalSearch && localSearch && matchesBorough && matchesStatus;
    })
    .sort((a, b) => {
      const aValue = a[sortField as keyof typeof a] || '';
      const bValue = b[sortField as keyof typeof b] || '';
      
      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'closed': return 'text-emerald-400 bg-emerald-400/15';
      case 'open': return 'text-rose-400 bg-rose-400/15';
      case 'in progress': return 'text-amber-400 bg-amber-400/15';
      default: return 'text-neutral-400 bg-neutral-400/15';
    }
  };

  return (
    <div className="rounded-2xl bg-neutral-900/70 ring-1 ring-white/10 p-5 relative">
      {/* Loading Overlay */}
      {externalLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-neutral-900/80 backdrop-blur-sm rounded-2xl">
          <div className="flex items-center gap-3 p-4 bg-neutral-800/90 ring-1 ring-white/10 rounded-xl">
            <div className="w-4 h-4 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
            <span className="text-sm text-emerald-400 font-medium">Updating table...</span>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg tracking-tight font-semibold">Recent Complaints</h3>
        <span className="text-xs text-neutral-400">{filteredComplaints.length} complaints</span>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" strokeWidth={1.5} />
          <input
            type="text"
            placeholder="Search complaints..."
            value={localSearchTerm}
            onChange={(e) => setLocalSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-neutral-800/70 ring-1 ring-white/10 rounded-lg text-neutral-100 placeholder-neutral-400 focus:ring-2 focus:ring-emerald-400/50 focus:outline-none text-sm"
          />
          {searchTerm && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-emerald-400">
              Global Filter Active
            </div>
          )}
        </div>
        
        <select
          value={selectedBorough}
          onChange={(e) => setSelectedBorough(e.target.value)}
          className="px-3 py-2 bg-neutral-800/70 ring-1 ring-white/10 rounded-lg text-neutral-100 text-sm focus:ring-2 focus:ring-emerald-400/50 focus:outline-none"
        >
          <option value="">All Boroughs</option>
          {boroughs.map((borough) => (
            <option key={borough} value={borough}>{borough}</option>
          ))}
        </select>
        
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-2 bg-neutral-800/70 ring-1 ring-white/10 rounded-lg text-neutral-100 text-sm focus:ring-2 focus:ring-emerald-400/50 focus:outline-none"
        >
          <option value="">All Statuses</option>
          {statuses.map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th 
                className="text-left py-3 px-2 text-xs font-medium text-neutral-400 cursor-pointer hover:text-neutral-200"
                onClick={() => handleSort('complaint_type')}
              >
                <div className="flex items-center gap-1">
                  Type
                  {sortField === 'complaint_type' && (
                    sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                  )}
                </div>
              </th>
              <th 
                className="text-left py-3 px-2 text-xs font-medium text-neutral-400 cursor-pointer hover:text-neutral-200"
                onClick={() => handleSort('borough')}
              >
                <div className="flex items-center gap-1">
                  Borough
                  {sortField === 'borough' && (
                    sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                  )}
                </div>
              </th>
              <th 
                className="text-left py-3 px-2 text-xs font-medium text-neutral-400 cursor-pointer hover:text-neutral-200"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center gap-1">
                  Status
                  {sortField === 'status' && (
                    sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                  )}
                </div>
              </th>
              <th 
                className="text-left py-3 px-2 text-xs font-medium text-neutral-400 cursor-pointer hover:text-neutral-200"
                onClick={() => handleSort('created_date')}
              >
                <div className="flex items-center gap-1">
                  Date
                  {sortField === 'created_date' && (
                    sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                  )}
                </div>
              </th>
              <th className="text-left py-3 px-2 text-xs font-medium text-neutral-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredComplaints.slice(0, 20).map((complaint) => (
              <tr key={complaint.unique_key} className="border-b border-white/5 hover:bg-neutral-800/30">
                <td className="py-3 px-2">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-400" strokeWidth={1.5} />
                    <div>
                      <p className="text-sm font-medium text-neutral-200">{complaint.complaint_type}</p>
                      <p className="text-xs text-neutral-400 truncate max-w-[200px]">{complaint.descriptor}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-2">
                  <span className="text-sm text-neutral-300">{complaint.borough}</span>
                </td>
                <td className="py-3 px-2">
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
                    {complaint.status}
                  </span>
                </td>
                <td className="py-3 px-2">
                  <div className="flex items-center gap-1 text-sm text-neutral-400">
                    <Clock className="w-3 h-3" strokeWidth={1.5} />
                    {new Date(complaint.created_date).toLocaleDateString()}
                  </div>
                </td>
                <td className="py-3 px-2">
                  <button
                    onClick={() => setExpandedRow(expandedRow === complaint.unique_key ? null : complaint.unique_key)}
                    className="p-1 rounded hover:bg-neutral-700/50"
                  >
                    {expandedRow === complaint.unique_key ? (
                      <ChevronUp className="w-4 h-4 text-neutral-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-neutral-400" />
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredComplaints.length > 20 && (
        <div className="mt-4 text-center">
          <p className="text-xs text-neutral-500">
            Showing 20 of {filteredComplaints.length} complaints
          </p>
        </div>
      )}
    </div>
  );
}
