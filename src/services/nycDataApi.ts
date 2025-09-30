import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Complaint {
  unique_key: string;
  created_date: string;
  closed_date?: string;
  agency: string;
  agency_name: string;
  complaint_type: string;
  descriptor: string;
  location_type: string;
  incident_zip?: string;
  incident_address?: string;
  street_name?: string;
  cross_street_1?: string;
  cross_street_2?: string;
  intersection_street_1?: string;
  intersection_street_2?: string;
  address_type: string;
  city: string;
  landmark?: string;
  facility_type?: string;
  status: string;
  due_date?: string;
  resolution_description?: string;
  resolution_action_updated_date?: string;
  community_board?: string;
  bbl?: string;
  borough: string;
  x_coordinate_state_plane?: string;
  y_coordinate_state_plane?: string;
  open_data_channel_type: string;
  park_facility_name?: string;
  park_borough?: string;
  vehicle_type?: string;
  taxi_company_borough?: string;
  taxi_pick_up_location?: string;
  bridge_highway_name?: string;
  bridge_highway_direction?: string;
  road_ramp?: string;
  bridge_highway_segment?: string;
  latitude?: string;
  longitude?: string;
  location: {
    latitude: string;
    longitude: string;
    human_address: string;
  };
}

export interface ComplaintsResponse {
  data: Complaint[];
  total: number;
}

export const nycDataApi = createApi({
  reducerPath: 'nycDataApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://data.cityofnewyork.us/resource/erm2-nwe9.json',
  }),
  tagTypes: ['Complaints'],
  endpoints: (builder) => ({
    getComplaints: builder.query<Complaint[], { limit?: number; offset?: number; complaint_type?: string; borough?: string }>({
      query: ({ limit = 1000, offset = 0, complaint_type, borough }) => {
        const params = new URLSearchParams({
          $limit: limit.toString(),
          $offset: offset.toString(),
          $order: 'created_date DESC',
        });
        
        if (complaint_type) {
          params.append('complaint_type', complaint_type);
        }
        
        if (borough) {
          params.append('borough', borough);
        }
        
        return `?${params.toString()}`;
      },
      providesTags: ['Complaints'],
    }),
    getComplaintStats: builder.query<{
      totalComplaints: number;
      complaintsByType: Record<string, number>;
      complaintsByBorough: Record<string, number>;
      complaintsByStatus: Record<string, number>;
    }, void>({
      query: () => ({
        url: '',
        params: {
          $select: 'complaint_type,borough,status',
          $limit: 50000,
        },
      }),
      transformResponse: (response: Complaint[]) => {
        const totalComplaints = response.length;
        const complaintsByType: Record<string, number> = {};
        const complaintsByBorough: Record<string, number> = {};
        const complaintsByStatus: Record<string, number> = {};

        response.forEach((complaint) => {
          complaintsByType[complaint.complaint_type] = (complaintsByType[complaint.complaint_type] || 0) + 1;
          complaintsByBorough[complaint.borough] = (complaintsByBorough[complaint.borough] || 0) + 1;
          complaintsByStatus[complaint.status] = (complaintsByStatus[complaint.status] || 0) + 1;
        });

        return {
          totalComplaints,
          complaintsByType,
          complaintsByBorough,
          complaintsByStatus,
        };
      },
      providesTags: ['Complaints'],
    }),
  }),
});

export const { useGetComplaintsQuery, useGetComplaintStatsQuery } = nycDataApi;
