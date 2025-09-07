import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AvailableSlot, EventType } from '@/types';

interface BookingState {
  // Current booking flow state
  selectedEventType: EventType | null;
  selectedSlot: AvailableSlot | null;
  inviteeInfo: {
    name: string;
    email: string;
    phone: string;
    timezone: string;
  };
  customAnswers: Record<string, any>;
  attendees: Array<{
    name: string;
    email: string;
    phone: string;
    custom_answers: Record<string, any>;
  }>;
  
  // Booking flow progress
  currentStep: number;
  totalSteps: number;
  canProceed: boolean;
  
  // Availability data
  availableSlots: AvailableSlot[];
  selectedDate: string | null;
  selectedTimezone: string;
  isLoadingSlots: boolean;
  
  // Multi-invitee scheduling
  inviteeTimezones: string[];
  fairnessMode: boolean;
  
  // Booking management
  accessToken: string | null;
  managementUrl: string | null;
  
  // UI state
  showTimezonePicker: boolean;
  showMultiInviteeOptions: boolean;
  calendarView: 'month' | 'week' | 'day';
}

const initialState: BookingState = {
  selectedEventType: null,
  selectedSlot: null,
  inviteeInfo: {
    name: '',
    email: '',
    phone: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
  },
  customAnswers: {},
  attendees: [],
  currentStep: 0,
  totalSteps: 3,
  canProceed: false,
  availableSlots: [],
  selectedDate: null,
  selectedTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
  isLoadingSlots: false,
  inviteeTimezones: [],
  fairnessMode: false,
  accessToken: null,
  managementUrl: null,
  showTimezonePicker: false,
  showMultiInviteeOptions: false,
  calendarView: 'month',
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setSelectedEventType: (state, action: PayloadAction<EventType | null>) => {
      state.selectedEventType = action.payload;
      // Reset dependent state
      state.selectedSlot = null;
      state.customAnswers = {};
      state.attendees = [];
      state.currentStep = 0;
    },
    
    setSelectedSlot: (state, action: PayloadAction<AvailableSlot | null>) => {
      state.selectedSlot = action.payload;
    },
    
    setInviteeInfo: (state, action: PayloadAction<Partial<BookingState['inviteeInfo']>>) => {
      state.inviteeInfo = { ...state.inviteeInfo, ...action.payload };
    },
    
    setCustomAnswers: (state, action: PayloadAction<Record<string, any>>) => {
      state.customAnswers = action.payload;
    },
    
    updateCustomAnswer: (state, action: PayloadAction<{ questionId: string; answer: any }>) => {
      state.customAnswers[action.payload.questionId] = action.payload.answer;
    },
    
    setAttendees: (state, action: PayloadAction<BookingState['attendees']>) => {
      state.attendees = action.payload;
    },
    
    addAttendee: (state, action: PayloadAction<BookingState['attendees'][0]>) => {
      state.attendees.push(action.payload);
    },
    
    removeAttendee: (state, action: PayloadAction<number>) => {
      state.attendees.splice(action.payload, 1);
    },
    
    updateAttendee: (state, action: PayloadAction<{ index: number; attendee: Partial<BookingState['attendees'][0]> }>) => {
      const { index, attendee } = action.payload;
      if (state.attendees[index]) {
        state.attendees[index] = { ...state.attendees[index], ...attendee };
      }
    },
    
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    
    nextStep: (state) => {
      if (state.currentStep < state.totalSteps - 1) {
        state.currentStep += 1;
      }
    },
    
    previousStep: (state) => {
      if (state.currentStep > 0) {
        state.currentStep -= 1;
      }
    },
    
    setCanProceed: (state, action: PayloadAction<boolean>) => {
      state.canProceed = action.payload;
    },
    
    setAvailableSlots: (state, action: PayloadAction<AvailableSlot[]>) => {
      state.availableSlots = action.payload;
    },
    
    setSelectedDate: (state, action: PayloadAction<string | null>) => {
      state.selectedDate = action.payload;
      // Reset selected slot when date changes
      state.selectedSlot = null;
    },
    
    setSelectedTimezone: (state, action: PayloadAction<string>) => {
      state.selectedTimezone = action.payload;
      state.inviteeInfo.timezone = action.payload;
    },
    
    setIsLoadingSlots: (state, action: PayloadAction<boolean>) => {
      state.isLoadingSlots = action.payload;
    },
    
    setInviteeTimezones: (state, action: PayloadAction<string[]>) => {
      state.inviteeTimezones = action.payload;
    },
    
    addInviteeTimezone: (state, action: PayloadAction<string>) => {
      if (!state.inviteeTimezones.includes(action.payload)) {
        state.inviteeTimezones.push(action.payload);
      }
    },
    
    removeInviteeTimezone: (state, action: PayloadAction<string>) => {
      state.inviteeTimezones = state.inviteeTimezones.filter(tz => tz !== action.payload);
    },
    
    setFairnessMode: (state, action: PayloadAction<boolean>) => {
      state.fairnessMode = action.payload;
    },
    
    setAccessToken: (state, action: PayloadAction<string | null>) => {
      state.accessToken = action.payload;
    },
    
    setManagementUrl: (state, action: PayloadAction<string | null>) => {
      state.managementUrl = action.payload;
    },
    
    setShowTimezonePicker: (state, action: PayloadAction<boolean>) => {
      state.showTimezonePicker = action.payload;
    },
    
    setShowMultiInviteeOptions: (state, action: PayloadAction<boolean>) => {
      state.showMultiInviteeOptions = action.payload;
    },
    
    setCalendarView: (state, action: PayloadAction<'month' | 'week' | 'day'>) => {
      state.calendarView = action.payload;
    },
    
    resetBookingFlow: (state) => {
      state.selectedEventType = null;
      state.selectedSlot = null;
      state.inviteeInfo = {
        name: '',
        email: '',
        phone: '',
        timezone: state.selectedTimezone,
      };
      state.customAnswers = {};
      state.attendees = [];
      state.currentStep = 0;
      state.canProceed = false;
      state.availableSlots = [];
      state.selectedDate = null;
      state.accessToken = null;
      state.managementUrl = null;
    },
  },
});

export const {
  setSelectedEventType,
  setSelectedSlot,
  setInviteeInfo,
  setCustomAnswers,
  updateCustomAnswer,
  setAttendees,
  addAttendee,
  removeAttendee,
  updateAttendee,
  setCurrentStep,
  nextStep,
  previousStep,
  setCanProceed,
  setAvailableSlots,
  setSelectedDate,
  setSelectedTimezone,
  setIsLoadingSlots,
  setInviteeTimezones,
  addInviteeTimezone,
  removeInviteeTimezone,
  setFairnessMode,
  setAccessToken,
  setManagementUrl,
  setShowTimezonePicker,
  setShowMultiInviteeOptions,
  setCalendarView,
  resetBookingFlow,
} = bookingSlice.actions;

export default bookingSlice.reducer;