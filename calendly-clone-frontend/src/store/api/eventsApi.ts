import { baseApi } from './baseApi';
import type { 
  EventType, 
  Booking, 
  ApiResponse, 
  PaginatedResponse,
  AvailableSlot,
  CustomQuestion,
} from '@/types';

export interface CreateEventTypeRequest {
  name: string;
  description?: string;
  duration: number;
  max_attendees?: number;
  enable_waitlist?: boolean;
  is_active?: boolean;
  is_private?: boolean;
  min_scheduling_notice?: number;
  max_scheduling_horizon?: number;
  buffer_time_before?: number;
  buffer_time_after?: number;
  max_bookings_per_day?: number;
  slot_interval_minutes?: number;
  recurrence_type?: 'none' | 'daily' | 'weekly' | 'monthly';
  recurrence_rule?: string;
  max_occurrences?: number;
  recurrence_end_date?: string;
  location_type?: 'video_call' | 'phone_call' | 'in_person' | 'custom';
  location_details?: string;
  redirect_url_after_booking?: string;
  questions_data?: any[];
}

export interface CreateBookingRequest {
  organizer_slug: string;
  event_type_slug: string;
  invitee_name: string;
  invitee_email: string;
  invitee_phone?: string;
  invitee_timezone?: string;
  attendee_count?: number;
  start_time: string;
  custom_answers?: Record<string, any>;
  attendees_data?: any[];
}

export interface BookingFilters {
  status?: string;
  start_date?: string;
  end_date?: string;
  page?: number;
}

export interface AvailableSlotsParams {
  organizer_slug: string;
  event_type_slug: string;
  start_date: string;
  end_date: string;
  timezone?: string;
  attendee_count?: number;
  invitee_timezones?: string[];
}

export const eventsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Event Types
    getEventTypes: builder.query<EventType[], void>({
      query: () => '/events/event-types/',
      providesTags: ['EventType'],
    }),
    
    getEventType: builder.query<EventType, string>({
      query: (id) => `/events/event-types/${id}/`,
      providesTags: (result, error, id) => [{ type: 'EventType', id }],
    }),
    
    createEventType: builder.mutation<EventType, CreateEventTypeRequest>({
      query: (eventTypeData) => ({
        url: '/events/event-types/',
        method: 'POST',
        body: eventTypeData,
      }),
      invalidatesTags: ['EventType'],
    }),
    
    updateEventType: builder.mutation<EventType, { id: string; data: Partial<CreateEventTypeRequest> }>({
      query: ({ id, data }) => ({
        url: `/events/event-types/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'EventType', id }],
    }),
    
    deleteEventType: builder.mutation<void, string>({
      query: (id) => ({
        url: `/events/event-types/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['EventType'],
    }),
    
    // Public Event Type Pages
    getPublicOrganizerPage: builder.query<any, string>({
      query: (organizerSlug) => `/events/public/${organizerSlug}/`,
    }),
    
    getPublicEventTypePage: builder.query<any, { organizerSlug: string; eventTypeSlug: string; params?: any }>({
      query: ({ organizerSlug, eventTypeSlug, params = {} }) => {
        const searchParams = new URLSearchParams(params).toString();
        return `/events/public/${organizerSlug}/${eventTypeSlug}/${searchParams ? `?${searchParams}` : ''}`;
      },
    }),
    
    // Available Slots
    getAvailableSlots: builder.query<{ available_slots: AvailableSlot[]; cache_hit: boolean; total_slots: number }, AvailableSlotsParams>({
      query: ({ organizerSlug, eventTypeSlug, ...params }) => {
        const searchParams = new URLSearchParams(params as any).toString();
        return `/events/slots/${organizerSlug}/${eventTypeSlug}/?${searchParams}`;
      },
    }),
    
    // Bookings
    getBookings: builder.query<PaginatedResponse<Booking>, BookingFilters>({
      query: (filters = {}) => {
        const searchParams = new URLSearchParams(filters as any).toString();
        return `/events/bookings/${searchParams ? `?${searchParams}` : ''}`;
      },
      providesTags: ['Booking'],
    }),
    
    getBooking: builder.query<Booking, string>({
      query: (id) => `/events/bookings/${id}/`,
      providesTags: (result, error, id) => [{ type: 'Booking', id }],
    }),
    
    createBooking: builder.mutation<Booking & { access_token: string; management_url: string }, CreateBookingRequest>({
      query: (bookingData) => ({
        url: '/events/bookings/create/',
        method: 'POST',
        body: bookingData,
      }),
      invalidatesTags: ['Booking'],
    }),
    
    updateBooking: builder.mutation<Booking, { id: string; data: Partial<Booking> }>({
      query: ({ id, data }) => ({
        url: `/events/bookings/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Booking', id }],
    }),
    
    cancelBooking: builder.mutation<ApiResponse, { id: string; reason?: string }>({
      query: ({ id, reason }) => ({
        url: `/events/bookings/${id}/cancel/`,
        method: 'POST',
        body: { reason },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Booking', id }],
    }),
    
    // Booking Management (Public)
    getBookingManagement: builder.query<any, string>({
      query: (accessToken) => `/events/booking/${accessToken}/manage/`,
    }),
    
    manageBooking: builder.mutation<ApiResponse, { accessToken: string; action: string; data?: any }>({
      query: ({ accessToken, action, data = {} }) => ({
        url: `/events/booking/${accessToken}/manage/`,
        method: 'POST',
        body: { action, ...data },
      }),
    }),
    
    // Group Event Management
    addAttendeeToBooking: builder.mutation<any, { bookingId: string; attendeeData: any }>({
      query: ({ bookingId, attendeeData }) => ({
        url: `/events/bookings/${bookingId}/attendees/add/`,
        method: 'POST',
        body: attendeeData,
      }),
      invalidatesTags: (result, error, { bookingId }) => [{ type: 'Booking', id: bookingId }],
    }),
    
    removeAttendeeFromBooking: builder.mutation<ApiResponse, { bookingId: string; attendeeId: string; reason?: string }>({
      query: ({ bookingId, attendeeId, reason }) => ({
        url: `/events/bookings/${bookingId}/attendees/${attendeeId}/remove/`,
        method: 'POST',
        body: { reason },
      }),
      invalidatesTags: (result, error, { bookingId }) => [{ type: 'Booking', id: bookingId }],
    }),
    
    // Analytics
    getBookingAnalytics: builder.query<any, { days?: number }>({
      query: (params = {}) => {
        const searchParams = new URLSearchParams(params as any).toString();
        return `/events/analytics/${searchParams ? `?${searchParams}` : ''}`;
      },
    }),
    
    getBookingAuditLogs: builder.query<any, string>({
      query: (bookingId) => `/events/bookings/${bookingId}/audit/`,
    }),
  }),
});

export const {
  useGetEventTypesQuery,
  useGetEventTypeQuery,
  useCreateEventTypeMutation,
  useUpdateEventTypeMutation,
  useDeleteEventTypeMutation,
  useGetPublicOrganizerPageQuery,
  useGetPublicEventTypePageQuery,
  useGetAvailableSlotsQuery,
  useGetBookingsQuery,
  useGetBookingQuery,
  useCreateBookingMutation,
  useUpdateBookingMutation,
  useCancelBookingMutation,
  useGetBookingManagementQuery,
  useManageBookingMutation,
  useAddAttendeeToBookingMutation,
  useRemoveAttendeeFromBookingMutation,
  useGetBookingAnalyticsQuery,
  useGetBookingAuditLogsQuery,
} = eventsApi;