'use client';

import { useEffect, useState } from 'react';
import { useGetNYCComplaintsQuery } from '@/lib/redux';
import { MapPin } from 'lucide-react';

export default function SimpleNYCMap() {
  const { data: complaints, isLoading, error } = useGetNYCComplaintsQuery({ limit: 1000 });
  const [isClient, setIsClient] = useState(false);
  const [selectedComplaintType, setSelectedComplaintType] = useState('');
  const [selectedBorough, setSelectedBorough] = useState('');
  const [mapInstance, setMapInstance] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [mapId] = useState(() => `map-container-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Initialize map only once
  useEffect(() => {
    if (!isClient) return;

    const initMap = async () => {
      const L = (await import('leaflet')).default;
      
      // Fix for default markers
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });

      // Check if container exists
      const container = document.getElementById(mapId);
      if (!container) {
        console.error('Map container not found');
        return;
      }

      // Clear any existing content
      container.innerHTML = '';

      const map = L.map(mapId).setView([40.7128, -74.0060], 11);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      setMapInstance(map);
    };

    initMap();

    // Cleanup on unmount
    return () => {
      if (mapInstance) {
        try {
          mapInstance.remove();
        } catch (error) {
          console.warn('Error removing map instance on unmount:', error);
        }
        setMapInstance(null);
      }
    };
  }, [isClient, mapId]);

  // Update markers when data or filters change
  useEffect(() => {
    if (!mapInstance || !complaints) return;

    // Clear existing markers
    mapInstance.eachLayer((layer: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
      if (layer instanceof window.L.Marker) {
        mapInstance.removeLayer(layer);
      }
    });

    // Filter complaints with valid coordinates
    const validComplaints = complaints.filter(
      (complaint) => 
        complaint.latitude && 
        complaint.longitude && 
        !isNaN(parseFloat(complaint.latitude)) && 
        !isNaN(parseFloat(complaint.longitude))
    );

    // Filter complaints based on selected filters
    const filteredComplaints = validComplaints.filter(complaint => {
      const typeMatch = !selectedComplaintType || complaint.complaint_type === selectedComplaintType;
      const boroughMatch = !selectedBorough || complaint.borough === selectedBorough;
      return typeMatch && boroughMatch;
    });

    // Get status color for markers
    const getStatusColor = (status: string) => {
      switch (status.toLowerCase()) {
        case 'closed': return '#10b981'; // emerald
        case 'open': return '#f43f5e'; // rose
        case 'in progress': return '#f59e0b'; // amber
        default: return '#6b7280'; // neutral
      }
    };

    // Create custom marker icon
    const createCustomIcon = (color: string) => {
      return window.L.divIcon({
        className: 'custom-marker',
        html: `<div style="
          background-color: ${color};
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        "></div>`,
        iconSize: [12, 12],
        iconAnchor: [6, 6]
      });
    };

    // Add markers for each complaint
    filteredComplaints.forEach((complaint) => {
      const lat = parseFloat(complaint.latitude!);
      const lng = parseFloat(complaint.longitude!);
      const statusColor = getStatusColor(complaint.status);
      
      const marker = window.L.marker([lat, lng], { icon: createCustomIcon(statusColor) })
        .addTo(mapInstance);
      
      marker.bindPopup(`
        <div style="min-width: 250px; padding: 12px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <span style="color: #dc2626;">⚠️</span>
            <strong style="font-size: 14px; color: #1f2937;">${complaint.complaint_type}</strong>
          </div>
          <div style="font-size: 12px; color: #4b5563; line-height: 1.4;">
            <p><strong>Status:</strong> <span style="padding: 2px 8px; border-radius: 12px; font-size: 11px; ${
              complaint.status === 'Closed' ? 'background: #dcfce7; color: #166534;' :
              complaint.status === 'Open' ? 'background: #fef2f2; color: #991b1b;' :
              'background: #fef3c7; color: #92400e;'
            }">${complaint.status}</span></p>
            <p><strong>Borough:</strong> ${complaint.borough}</p>
            ${complaint.incident_address ? `<p><strong>Address:</strong> ${complaint.incident_address}</p>` : ''}
            <p><strong>Descriptor:</strong> ${complaint.descriptor}</p>
            <p style="display: flex; align-items: center; gap: 4px; margin-top: 8px;">
              🕒 ${new Date(complaint.created_date).toLocaleDateString()}
            </p>
          </div>
        </div>
      `);
    });
  }, [mapInstance, complaints, selectedComplaintType, selectedBorough]);

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
        <h3 className="text-lg tracking-tight font-semibold mb-4">NYC Complaints Map</h3>
        <div className="text-center text-neutral-400 h-80 flex items-center justify-center">
          Error loading map data
        </div>
      </div>
    );
  }

  if (!complaints || complaints.length === 0) {
    return (
      <div className="rounded-2xl bg-neutral-900/70 ring-1 ring-white/10 p-5">
        <h3 className="text-lg tracking-tight font-semibold mb-4">NYC Complaints Map</h3>
        <div className="text-center text-neutral-400 h-80 flex items-center justify-center">
          No complaint data available
        </div>
      </div>
    );
  }

  // Get unique complaint types and boroughs for filtering
  const complaintTypes = [...new Set(complaints.map(c => c.complaint_type))].sort();
  const boroughs = [...new Set(complaints.map(c => c.borough))].sort();

  // Filter complaints with valid coordinates
  const validComplaints = complaints.filter(
    (complaint) => 
      complaint.latitude && 
      complaint.longitude && 
      !isNaN(parseFloat(complaint.latitude)) && 
      !isNaN(parseFloat(complaint.longitude))
  );

  // Filter complaints based on selected filters
  const filteredComplaints = validComplaints.filter(complaint => {
    const typeMatch = !selectedComplaintType || complaint.complaint_type === selectedComplaintType;
    const boroughMatch = !selectedBorough || complaint.borough === selectedBorough;
    return typeMatch && boroughMatch;
  });

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
        </div>
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
      
      <div className="h-96 rounded-xl overflow-hidden ring-1 ring-white/5">
        <div id={mapId} className="h-full w-full"></div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
          <span className="text-neutral-400">Closed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-rose-500"></div>
          <span className="text-neutral-400">Open</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500"></div>
          <span className="text-neutral-400">In Progress</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-neutral-500"></div>
          <span className="text-neutral-400">Other</span>
        </div>
      </div>
    </div>
  );
}
