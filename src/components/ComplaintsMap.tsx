'use client';

import { useEffect, useState } from 'react';
import { useGetComplaintsQuery } from '@/services/nycDataApi';
import { MapPin, Clock, AlertCircle } from 'lucide-react';

export default function ComplaintsMap() {
  const { data: complaints, isLoading, error } = useGetComplaintsQuery({ limit: 500 });
  const [isClient, setIsClient] = useState(false);

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

  return (
    <div className="rounded-2xl bg-neutral-900/70 ring-1 ring-white/10 p-5">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="w-5 h-5 text-neutral-300" strokeWidth={1.5} />
        <h3 className="text-lg tracking-tight font-semibold">Complaints Map</h3>
        <span className="text-xs text-neutral-400 ml-auto">
          {validComplaints.length} locations
        </span>
      </div>
      
      <div className="h-80 rounded-xl overflow-hidden ring-1 ring-white/5 bg-neutral-950/40 flex items-center justify-center">
        <div className="text-center">
          <MapPin className="w-12 h-12 text-neutral-400 mx-auto mb-4" strokeWidth={1.5} />
          <p className="text-neutral-400 mb-2">Interactive Map</p>
          <p className="text-sm text-neutral-500">
            {validComplaints.length} complaint locations found
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
            {validComplaints.slice(0, 6).map((complaint) => (
              <div key={complaint.unique_key} className="p-2 bg-neutral-800/50 rounded-lg">
                <p className="font-medium text-neutral-200 truncate">{complaint.complaint_type}</p>
                <p className="text-neutral-400 truncate">{complaint.borough}</p>
                <p className="text-neutral-500 text-[10px]">
                  <Clock className="w-3 h-3 inline mr-1" strokeWidth={1.5} />
                  {new Date(complaint.created_date).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}