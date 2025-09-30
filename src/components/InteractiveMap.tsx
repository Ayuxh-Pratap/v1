'use client';

import { useEffect, useState } from 'react';
import { useGetComplaintsQuery } from '@/services/nycDataApi';
import { MapPin, Clock, AlertCircle } from 'lucide-react';

export default function InteractiveMap() {
  const { data: complaints, isLoading, error } = useGetComplaintsQuery({ limit: 1000 });
  const [isClient, setIsClient] = useState(false);
  const [selectedComplaintType, setSelectedComplaintType] = useState('');
  const [selectedBorough, setSelectedBorough] = useState('');

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="rounded-2xl bg-neutral-900/70 ring-1 ring-white/10 p-5">
        <div className="animate-pulse">
          <div className="h-4 bg-neutral-800 rounded w-1/3 mb-4"></div>
          <div className="h-80 bg-neutral-800 rounded"></div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="rounded-2xl bg-neutral-900/70 ring-1 ring-white/10 p-5">
        <div className="animate-pulse">
          <div className="h-4 bg-neutral-800 rounded w-1/3 mb-4"></div>
          <div className="h-80 bg-neutral-800 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-neutral-900/70 ring-1 ring-white/10 p-5">
        <h3 className="text-lg tracking-tight font-semibold mb-4">Complaints Map</h3>
        <div className="text-center text-neutral-400 h-80 flex items-center justify-center">
          Error loading map data
        </div>
      </div>
    );
  }

  if (!complaints || complaints.length === 0) {
    return (
      <div className="rounded-2xl bg-neutral-900/70 ring-1 ring-white/10 p-5">
        <h3 className="text-lg tracking-tight font-semibold mb-4">Complaints Map</h3>
        <div className="text-center text-neutral-400 h-80 flex items-center justify-center">
          No complaint data available
        </div>
      </div>
    );
  }

  // Filter complaints with valid coordinates
  const validComplaints = complaints.filter(
    (complaint) => 
      complaint.latitude && 
      complaint.longitude && 
      !isNaN(parseFloat(complaint.latitude)) && 
      !isNaN(parseFloat(complaint.longitude))
  );

  // Get unique complaint types and boroughs for filtering
  const complaintTypes = [...new Set(complaints.map(c => c.complaint_type))].sort();
  const boroughs = [...new Set(complaints.map(c => c.borough))].sort();

  // Filter complaints based on selected filters
  const filteredComplaints = validComplaints.filter(complaint => {
    const typeMatch = !selectedComplaintType || complaint.complaint_type === selectedComplaintType;
    const boroughMatch = !selectedBorough || complaint.borough === selectedBorough;
    return typeMatch && boroughMatch;
  });

  // Get center coordinates (NYC center) - for future map implementation
  // const center: [number, number] = [40.7128, -74.0060];

  return (
    <div className="rounded-2xl bg-neutral-900/70 ring-1 ring-white/10 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-neutral-300" strokeWidth={1.5} />
          <h3 className="text-lg tracking-tight font-semibold">Interactive Map</h3>
        </div>
        <span className="text-xs text-neutral-400">
          {filteredComplaints.length} locations
        </span>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4">
        <select
          value={selectedComplaintType}
          onChange={(e) => setSelectedComplaintType(e.target.value)}
          className="px-3 py-2 bg-neutral-800/70 ring-1 ring-white/10 rounded-lg text-neutral-100 text-sm focus:ring-2 focus:ring-emerald-400/50 focus:outline-none"
        >
          <option value="">All Types</option>
          {complaintTypes.slice(0, 10).map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        
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
      </div>
      
      <div className="h-80 rounded-xl overflow-hidden ring-1 ring-white/5 bg-neutral-950/40">
        <div className="h-full w-full relative">
          {/* Map placeholder with data visualization */}
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 to-neutral-800 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-16 h-16 text-emerald-400 mx-auto mb-4" strokeWidth={1.5} />
              <p className="text-neutral-300 text-lg font-semibold mb-2">NYC 311 Complaints Map</p>
              <p className="text-neutral-400 text-sm mb-4">
                {filteredComplaints.length} complaints found
              </p>
              
              {/* Show sample data points */}
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                {filteredComplaints.slice(0, 8).map((complaint) => (
                  <div key={complaint.unique_key} className="p-3 bg-neutral-800/50 rounded-lg text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertCircle className="w-3 h-3 text-rose-400" strokeWidth={1.5} />
                      <span className="text-xs font-medium text-neutral-200 truncate">
                        {complaint.complaint_type}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 truncate">{complaint.borough}</p>
                    <p className="text-xs text-neutral-500">
                      <Clock className="w-3 h-3 inline mr-1" strokeWidth={1.5} />
                      {new Date(complaint.created_date).toLocaleDateString()}
                    </p>
                    {complaint.incident_address && (
                      <p className="text-xs text-neutral-500 truncate mt-1">
                        {complaint.incident_address}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              
              {filteredComplaints.length > 8 && (
                <p className="text-xs text-neutral-500 mt-2">
                  +{filteredComplaints.length - 8} more complaints
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
