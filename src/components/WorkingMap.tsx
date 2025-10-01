'use client';

import React, { useState, useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useGetNYCComplaintsQuery, useGetComplaintTypesQuery, useGetBoroughsQuery } from '@/lib/redux';
import { MapPin, Filter, X, Search, RefreshCw } from 'lucide-react';
import SearchModal from './SearchModal';

// Dynamically import the map component to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

interface WorkingMapProps {
  filters: {
    complaint_type?: string;
    borough?: string;
    status?: string;
    limit?: number;
  };
  searchTerm: string;
  onSearchChange: (searchTerm: string) => void;
}

export default function WorkingMap({ filters, searchTerm, onSearchChange }: WorkingMapProps) {
  const { data: complaints, isLoading, error, refetch } = useGetNYCComplaintsQuery(filters);
  const { data: complaintTypes } = useGetComplaintTypesQuery();
  const { data: boroughs } = useGetBoroughsQuery();
  
  const [selectedComplaintType, setSelectedComplaintType] = useState('');
  const [selectedBorough, setSelectedBorough] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [isLeafletLoaded, setIsLeafletLoaded] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);

  // Load Leaflet and create custom icons
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('leaflet').then((L) => {
        // Fix default markers
        delete (L.default.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
        L.default.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });
        setIsLeafletLoaded(true);
      });
    }
  }, []);

  // Filter complaints based on selected filters
  const filteredComplaints = useMemo(() => {
    if (!complaints) return [];
    
    return complaints.filter(complaint => {
      const hasValidCoords = complaint.latitude && 
        complaint.longitude && 
        !isNaN(parseFloat(complaint.latitude)) && 
        !isNaN(parseFloat(complaint.longitude));
      
      const typeMatch = !selectedComplaintType || complaint.complaint_type === selectedComplaintType;
      const boroughMatch = !selectedBorough || complaint.borough === selectedBorough;
      const statusMatch = !selectedStatus || complaint.status === selectedStatus;
      const searchMatch = !searchTerm || 
        complaint.complaint_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.descriptor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (complaint.incident_address && complaint.incident_address.toLowerCase().includes(searchTerm.toLowerCase()));
      
      return hasValidCoords && typeMatch && boroughMatch && statusMatch && searchMatch;
    });
  }, [complaints, selectedComplaintType, selectedBorough, selectedStatus, searchTerm]);

  const clearFilters = () => {
    setSelectedComplaintType('');
    setSelectedBorough('');
    setSelectedStatus('');
  };

  // Create beautiful custom markers
  const createCustomMarker = (status: string) => {
    if (!isLeafletLoaded || typeof window === 'undefined' || !window.L) {
      return undefined;
    }

    const getStatusColor = (status: string) => {
      switch (status.toLowerCase()) {
        case 'closed': return '#10b981'; // emerald
        case 'open': return '#ef4444'; // red
        case 'in progress': return '#f59e0b'; // amber
        default: return '#6b7280'; // neutral
      }
    };

    const color = getStatusColor(status);
    
    return new window.L.DivIcon({
      className: 'custom-marker',
      html: `
        <div style="
          background: linear-gradient(135deg, ${color}, ${color}dd);
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        ">
          <div style="
            width: 6px;
            height: 6px;
            background: white;
            border-radius: 50%;
            opacity: 0.9;
          "></div>
        </div>
      `,
      iconSize: [16, 16],
      iconAnchor: [8, 8],
      popupAnchor: [0, -8]
    });
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl bg-neutral-900/70 ring-1 ring-white/10 p-5">
        <div className="animate-pulse">
          <div className="h-4 bg-neutral-800 rounded w-1/3 mb-4"></div>
          <div className="h-96 bg-neutral-800 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-neutral-900/70 ring-1 ring-white/10 p-5">
        <h3 className="text-lg tracking-tight font-semibold mb-4">NYC Complaints Map</h3>
        <div className="text-center text-neutral-400 h-96 flex items-center justify-center">
          Error loading map data
        </div>
      </div>
    );
  }

  if (!complaints || complaints.length === 0) {
    return (
      <div className="rounded-2xl bg-neutral-900/70 ring-1 ring-white/10 p-5">
        <h3 className="text-lg tracking-tight font-semibold mb-4">NYC Complaints Map</h3>
        <div className="text-center text-neutral-400 h-96 flex items-center justify-center">
          No complaint data available
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-neutral-900/70 ring-1 ring-white/10 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-neutral-300" strokeWidth={1.5} />
          <h3 className="text-lg tracking-tight font-semibold">NYC Complaints Map</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-400">
            {filteredComplaints.length} locations
          </span>
          <button
            onClick={() => refetch()}
            className="p-2 rounded-xl bg-neutral-800/70 ring-1 ring-white/10 hover:bg-neutral-700/70"
          >
            <RefreshCw className="w-4 h-4 text-neutral-300" strokeWidth={1.5} />
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 rounded-xl bg-neutral-800/70 ring-1 ring-white/10 hover:bg-neutral-700/70"
          >
            <Filter className="w-4 h-4 text-neutral-300" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              console.log('Search button clicked, opening modal');
              setShowSearchModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-800/70 ring-1 ring-white/10 rounded-xl text-neutral-100 hover:bg-neutral-700/70 focus:ring-2 focus:ring-emerald-400/50 focus:outline-none"
          >
            <Search className="w-4 h-4 text-neutral-400" strokeWidth={1.5} />
            <span className="text-sm">
              {searchTerm ? `"${searchTerm}"` : 'Search complaints...'}
            </span>
            {searchTerm && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSearchChange('');
                }}
                className="ml-2 p-1 rounded hover:bg-neutral-600/50"
              >
                <X className="w-3 h-3 text-neutral-400" strokeWidth={1.5} />
              </button>
            )}
          </button>
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="mb-4 p-4 bg-neutral-800/50 rounded-xl ring-1 ring-white/5">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-neutral-200">Filters</h4>
            <div className="flex items-center gap-2">
              <button
                onClick={clearFilters}
                className="px-3 py-1 text-xs bg-neutral-700/50 hover:bg-neutral-600/50 rounded-lg text-neutral-300"
              >
                Clear All
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="p-1 rounded hover:bg-neutral-700/50"
              >
                <X className="w-4 h-4 text-neutral-400" strokeWidth={1.5} />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <select
              value={selectedComplaintType}
              onChange={(e) => setSelectedComplaintType(e.target.value)}
              className="px-3 py-2 bg-neutral-900/70 ring-1 ring-white/10 rounded-lg text-neutral-100 text-sm focus:ring-2 focus:ring-emerald-400/50 focus:outline-none"
            >
              <option value="">All Types</option>
              {complaintTypes?.slice(0, 15).map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            
            <select
              value={selectedBorough}
              onChange={(e) => setSelectedBorough(e.target.value)}
              className="px-3 py-2 bg-neutral-900/70 ring-1 ring-white/10 rounded-lg text-neutral-100 text-sm focus:ring-2 focus:ring-emerald-400/50 focus:outline-none"
            >
              <option value="">All Boroughs</option>
              {boroughs?.map((borough) => (
                <option key={borough} value={borough}>{borough}</option>
              ))}
            </select>
            
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 bg-neutral-900/70 ring-1 ring-white/10 rounded-lg text-neutral-100 text-sm focus:ring-2 focus:ring-emerald-400/50 focus:outline-none"
            >
              <option value="">All Statuses</option>
              <option value="Open">Open</option>
              <option value="Closed">Closed</option>
              <option value="In Progress">In Progress</option>
            </select>
          </div>
        </div>
      )}
      
      <div className="h-96 rounded-xl overflow-hidden ring-1 ring-white/5">
        <MapContainer
          center={[40.7128, -74.0060]}
          zoom={11}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {filteredComplaints.slice(0, 200).map((complaint) => {
            const lat = parseFloat(complaint.latitude!);
            const lng = parseFloat(complaint.longitude!);
            
            return (
              <Marker
                key={complaint.unique_key}
                position={[lat, lng]}
                icon={createCustomMarker(complaint.status)}
              >
                <Popup>
                  <div className="p-2 min-w-[250px]">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-red-500">⚠️</span>
                      <h3 className="font-semibold text-gray-900">{complaint.complaint_type}</h3>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>Status:</strong> 
                        <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
                          complaint.status === 'Closed' ? 'bg-green-100 text-green-800' :
                          complaint.status === 'Open' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {complaint.status}
                        </span>
                      </p>
                      <p><strong>Borough:</strong> {complaint.borough}</p>
                      {complaint.incident_address && (
                        <p><strong>Address:</strong> {complaint.incident_address}</p>
                      )}
                      <p><strong>Descriptor:</strong> {complaint.descriptor}</p>
                      <p className="flex items-center gap-1 mt-2">
                        🕒 {new Date(complaint.created_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-sm"></div>
          <span className="text-neutral-400">Closed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-white shadow-sm"></div>
          <span className="text-neutral-400">Open</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-amber-500 border-2 border-white shadow-sm"></div>
          <span className="text-neutral-400">In Progress</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-neutral-500 border-2 border-white shadow-sm"></div>
          <span className="text-neutral-400">Other</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-neutral-400">Click markers for details</span>
        </div>
      </div>

      {/* Search Modal */}
      <SearchModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        onSearch={onSearchChange}
        currentSearch={searchTerm}
      />
    </div>
  );
}
