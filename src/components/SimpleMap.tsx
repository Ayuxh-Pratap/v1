'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useGetNYCComplaintsQuery } from '@/lib/redux';

// Dynamically import the map component to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

export default function SimpleMap() {
  const { data: complaints, isLoading, error } = useGetNYCComplaintsQuery({ limit: 100 });

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
      <h3 className="text-lg tracking-tight font-semibold mb-4">NYC Complaints Map</h3>
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
          {validComplaints.slice(0, 50).map((complaint) => {
            const lat = parseFloat(complaint.latitude!);
            const lng = parseFloat(complaint.longitude!);
            
            return (
              <Marker
                key={complaint.unique_key}
                position={[lat, lng]}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-semibold">{complaint.complaint_type}</h3>
                    <p className="text-sm text-gray-600">{complaint.descriptor}</p>
                    <p className="text-sm">
                      <strong>Status:</strong> {complaint.status}
                    </p>
                    <p className="text-sm">
                      <strong>Borough:</strong> {complaint.borough}
                    </p>
                    <p className="text-sm">
                      <strong>Created:</strong> {new Date(complaint.created_date).toLocaleDateString()}
                    </p>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}
