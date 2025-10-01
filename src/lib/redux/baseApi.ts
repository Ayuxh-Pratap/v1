import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

/**
 * Base API configuration for RTK Query
 * All API slices should extend from this base API
 */
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ 
    baseUrl: process.env.NEXT_PUBLIC_API_URL || '/api',
    // Customize headers, credentials, etc.
    prepareHeaders: (headers) => {
      // Add auth tokens, custom headers, etc.
      // const token = getToken();
      // if (token) headers.set('authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  // Tag types for cache invalidation
  tagTypes: ['Dashboard', 'Analytics', 'Users', 'NYCComplaints'],
  // Endpoints will be injected by API slices
  endpoints: () => ({}),
});
