import { baseApi } from '../baseApi';

/**
 * NYC Open Data API slice - handles NYC 311 complaints data
 * Uses RTK Query for automatic caching, refetching, and cache invalidation
 */

export interface NYCComplaint {
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
  borough?: string;
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
  garage_lot_name?: string;
  ferry_direction?: string;
  ferry_terminal_name?: string;
  latitude?: string;
  longitude?: string;
  location?: {
    latitude: string;
    longitude: string;
    human_address: string;
  };
}

export interface NYCComplaintsResponse {
  data: NYCComplaint[];
  total: number;
  page: number;
  limit: number;
}

export interface ComplaintsFilters {
  complaint_type?: string;
  borough?: string;
  status?: string;
  agency?: string;
  date_from?: string;
  date_to?: string;
  limit?: number;
  offset?: number;
}

export const nycOpenDataApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get NYC 311 complaints with filtering
    getNYCComplaints: builder.query<NYCComplaint[], ComplaintsFilters>({
      query: (filters = {}) => {
        const params = new URLSearchParams();
        
        // Add filters to query parameters
        if (filters.complaint_type) params.append('complaint_type', filters.complaint_type);
        if (filters.borough) params.append('borough', filters.borough);
        if (filters.status) params.append('status', filters.status);
        if (filters.agency) params.append('agency', filters.agency);
        if (filters.date_from) params.append('$where', `created_date >= '${filters.date_from}'`);
        if (filters.date_to) params.append('$where', `created_date <= '${filters.date_to}'`);
        
        // Limit results for performance
        const limit = filters.limit || 1000;
        params.append('$limit', limit.toString());
        
        // Add offset for pagination
        if (filters.offset) params.append('$offset', filters.offset.toString());
        
        return `/nyc-complaints?${params.toString()}`;
      },
      providesTags : (result) =>
        result
          ? [
              ...result.map(({ unique_key }) => ({ type: 'NYCComplaints' as const, id: unique_key })),
              { type: 'NYCComplaints', id: 'LIST' },
            ]
          : [{ type: 'NYCComplaints', id: 'LIST' }],
    }),

    // Get complaint statistics
    getComplaintStats: builder.query<{
      total: number;
      byType: Record<string, number>;
      byBorough: Record<string, number>;
      byStatus: Record<string, number>;
      byAgency: Record<string, number>;
    }, ComplaintsFilters>({
      query: (filters = {}) => {
        const params = new URLSearchParams();
        
        if (filters.complaint_type) params.append('complaint_type', filters.complaint_type);
        if (filters.borough) params.append('borough', filters.borough);
        if (filters.status) params.append('status', filters.status);
        if (filters.agency) params.append('agency', filters.agency);
        if (filters.date_from) params.append('$where', `created_date >= '${filters.date_from}'`);
        if (filters.date_to) params.append('$where', `created_date <= '${filters.date_to}'`);
        
        params.append('$limit', '50000'); // Get more data for stats
        
        return `/nyc-complaints?${params.toString()}`;
      },
      transformResponse: (response: NYCComplaint[]) => {
        const stats = {
          total: response.length,
          byType: {} as Record<string, number>,
          byBorough: {} as Record<string, number>,
          byStatus: {} as Record<string, number>,
          byAgency: {} as Record<string, number>,
        };

        response.forEach(complaint => {
          // Count by type
          stats.byType[complaint.complaint_type] = (stats.byType[complaint.complaint_type] || 0) + 1;
          
          // Count by borough
          if (complaint.borough) {
            stats.byBorough[complaint.borough] = (stats.byBorough[complaint.borough] || 0) + 1;
          }
          
          // Count by status
          stats.byStatus[complaint.status] = (stats.byStatus[complaint.status] || 0) + 1;
          
          // Count by agency
          stats.byAgency[complaint.agency_name] = (stats.byAgency[complaint.agency_name] || 0) + 1;
        });

        return stats;
      },
      providesTags: ['NYCComplaints'],
    }),

    // Get unique complaint types for filtering
    getComplaintTypes: builder.query<string[], void>({
      query: () => '/nyc-complaints',
      transformResponse: (response: NYCComplaint[]) => {
        const types = [...new Set(response.map(complaint => complaint.complaint_type))];
        return types.sort();
      },
      providesTags: ['NYCComplaints'],
    }),

    // Get unique boroughs for filtering
    getBoroughs: builder.query<string[], void>({
      query: () => '/nyc-complaints',
      transformResponse: (response: NYCComplaint[]) => {
        const boroughs = [...new Set(response.map(complaint => complaint.borough).filter(Boolean))] as string[];
        return boroughs.sort();
      },
      providesTags: ['NYCComplaints'],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetNYCComplaintsQuery,
  useGetComplaintStatsQuery,
  useGetComplaintTypesQuery,
  useGetBoroughsQuery,
  useLazyGetNYCComplaintsQuery,
} = nycOpenDataApi;
