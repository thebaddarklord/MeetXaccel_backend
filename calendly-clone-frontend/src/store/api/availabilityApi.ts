import { baseApi } from './baseApi';
import type { 
  AvailabilityRule, 
  DateOverrideRule,
  AvailableSlot,
  ApiResponse,
} from '@/types';

export interface CreateAvailabilityRuleRequest {
  day_of_week: number;
  start_time: string;
  end_time: string;
  event_types?: string[];
  is_active?: boolean;
}

export interface CreateDateOverrideRequest {
  date: string;
  is_available: boolean;
  start_time?: string;
  end_time?: string;
  event_types?: string[];
  reason?: string;
  is_active?: boolean;
}

export interface CreateRecurringBlockRequest {
  name: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  start_date?: string;
  end_date?: string;
  is_active?: boolean;
}

export interface CreateBlockedTimeRequest {
  start_datetime: string;
  end_datetime: string;
  reason?: string;
  is_active?: boolean;
}

export interface BufferTimeSettings {
  default_buffer_before: number;
  default_buffer_after: number;
  minimum_gap: number;
  slot_interval_minutes: number;
}

export interface CalculatedSlotsParams {
  organizer_slug: string;
  event_type_slug: string;
  start_date: string;
  end_date: string;
  invitee_timezone?: string;
  attendee_count?: number;
  invitee_timezones?: string[];
}

export const availabilityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Availability Rules
    getAvailabilityRules: builder.query<AvailabilityRule[], void>({
      query: () => '/availability/rules/',
      providesTags: ['AvailabilityRule'],
    }),
    
    createAvailabilityRule: builder.mutation<AvailabilityRule, CreateAvailabilityRuleRequest>({
      query: (ruleData) => ({
        url: '/availability/rules/',
        method: 'POST',
        body: ruleData,
      }),
      invalidatesTags: ['AvailabilityRule'],
    }),
    
    updateAvailabilityRule: builder.mutation<AvailabilityRule, { id: string; data: Partial<CreateAvailabilityRuleRequest> }>({
      query: ({ id, data }) => ({
        url: `/availability/rules/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'AvailabilityRule', id }],
    }),
    
    deleteAvailabilityRule: builder.mutation<void, string>({
      query: (id) => ({
        url: `/availability/rules/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['AvailabilityRule'],
    }),
    
    // Date Override Rules
    getDateOverrides: builder.query<DateOverrideRule[], void>({
      query: () => '/availability/overrides/',
      providesTags: ['DateOverride'],
    }),
    
    createDateOverride: builder.mutation<DateOverrideRule, CreateDateOverrideRequest>({
      query: (overrideData) => ({
        url: '/availability/overrides/',
        method: 'POST',
        body: overrideData,
      }),
      invalidatesTags: ['DateOverride'],
    }),
    
    updateDateOverride: builder.mutation<DateOverrideRule, { id: string; data: Partial<CreateDateOverrideRequest> }>({
      query: ({ id, data }) => ({
        url: `/availability/overrides/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'DateOverride', id }],
    }),
    
    deleteDateOverride: builder.mutation<void, string>({
      query: (id) => ({
        url: `/availability/overrides/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['DateOverride'],
    }),
    
    // Recurring Blocked Times
    getRecurringBlocks: builder.query<any[], void>({
      query: () => '/availability/recurring-blocks/',
    }),
    
    createRecurringBlock: builder.mutation<any, CreateRecurringBlockRequest>({
      query: (blockData) => ({
        url: '/availability/recurring-blocks/',
        method: 'POST',
        body: blockData,
      }),
    }),
    
    updateRecurringBlock: builder.mutation<any, { id: string; data: Partial<CreateRecurringBlockRequest> }>({
      query: ({ id, data }) => ({
        url: `/availability/recurring-blocks/${id}/`,
        method: 'PATCH',
        body: data,
      }),
    }),
    
    deleteRecurringBlock: builder.mutation<void, string>({
      query: (id) => ({
        url: `/availability/recurring-blocks/${id}/`,
        method: 'DELETE',
      }),
    }),
    
    // Blocked Times
    getBlockedTimes: builder.query<any[], void>({
      query: () => '/availability/blocked/',
    }),
    
    createBlockedTime: builder.mutation<any, CreateBlockedTimeRequest>({
      query: (blockData) => ({
        url: '/availability/blocked/',
        method: 'POST',
        body: blockData,
      }),
    }),
    
    updateBlockedTime: builder.mutation<any, { id: string; data: Partial<CreateBlockedTimeRequest> }>({
      query: ({ id, data }) => ({
        url: `/availability/blocked/${id}/`,
        method: 'PATCH',
        body: data,
      }),
    }),
    
    deleteBlockedTime: builder.mutation<void, string>({
      query: (id) => ({
        url: `/availability/blocked/${id}/`,
        method: 'DELETE',
      }),
    }),
    
    // Buffer Time Settings
    getBufferSettings: builder.query<BufferTimeSettings, void>({
      query: () => '/availability/buffer/',
      providesTags: ['BufferTime'],
    }),
    
    updateBufferSettings: builder.mutation<BufferTimeSettings, Partial<BufferTimeSettings>>({
      query: (bufferData) => ({
        url: '/availability/buffer/',
        method: 'PATCH',
        body: bufferData,
      }),
      invalidatesTags: ['BufferTime'],
    }),
    
    // Calculated Slots (Public)
    getCalculatedSlots: builder.query<any, CalculatedSlotsParams>({
      query: ({ organizer_slug, ...params }) => {
        const searchParams = new URLSearchParams(params as any).toString();
        return `/availability/calculated-slots/${organizer_slug}/?${searchParams}`;
      },
    }),
    
    // Statistics and Management
    getAvailabilityStats: builder.query<any, void>({
      query: () => '/availability/stats/',
    }),
    
    clearAvailabilityCache: builder.mutation<ApiResponse, void>({
      query: () => ({
        url: '/availability/cache/clear/',
        method: 'POST',
      }),
    }),
    
    precomputeAvailabilityCache: builder.mutation<ApiResponse, { days_ahead?: number }>({
      query: (data) => ({
        url: '/availability/cache/precompute/',
        method: 'POST',
        body: data,
      }),
    }),
    
    // Testing and Debugging
    testTimezoneHandling: builder.query<any, { timezone?: string; date?: string }>({
      query: (params = {}) => {
        const searchParams = new URLSearchParams(params as any).toString();
        return `/availability/test/timezone/${searchParams ? `?${searchParams}` : ''}`;
      },
    }),
  }),
});

export const {
  useGetAvailabilityRulesQuery,
  useCreateAvailabilityRuleMutation,
  useUpdateAvailabilityRuleMutation,
  useDeleteAvailabilityRuleMutation,
  useGetDateOverridesQuery,
  useCreateDateOverrideMutation,
  useUpdateDateOverrideMutation,
  useDeleteDateOverrideMutation,
  useGetRecurringBlocksQuery,
  useCreateRecurringBlockMutation,
  useUpdateRecurringBlockMutation,
  useDeleteRecurringBlockMutation,
  useGetBlockedTimesQuery,
  useCreateBlockedTimeMutation,
  useUpdateBlockedTimeMutation,
  useDeleteBlockedTimeMutation,
  useGetBufferSettingsQuery,
  useUpdateBufferSettingsMutation,
  useGetCalculatedSlotsQuery,
  useGetAvailabilityStatsQuery,
  useClearAvailabilityCacheMutation,
  usePrecomputeAvailabilityCacheMutation,
  useTestTimezoneHandlingQuery,
} = availabilityApi;