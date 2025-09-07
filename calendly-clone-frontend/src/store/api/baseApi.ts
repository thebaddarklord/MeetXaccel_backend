import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getSession } from 'next-auth/react';

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  prepareHeaders: async (headers, { getState }) => {
    // Get session token
    const session = await getSession();
    
    if (session?.accessToken) {
      headers.set('Authorization', `Token ${session.accessToken}`);
    }
    
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);
  
  if (result.error && result.error.status === 401) {
    // Token expired, redirect to login
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login';
    }
  }
  
  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'User',
    'Profile',
    'Role',
    'Permission',
    'EventType',
    'Booking',
    'AvailabilityRule',
    'DateOverride',
    'BlockedTime',
    'BufferTime',
    'CalendarIntegration',
    'VideoIntegration',
    'WebhookIntegration',
    'Workflow',
    'WorkflowAction',
    'NotificationTemplate',
    'NotificationLog',
    'Contact',
    'ContactGroup',
  ],
  endpoints: () => ({}),
});