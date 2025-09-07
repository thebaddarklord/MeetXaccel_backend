import { z } from 'zod';

// User Authentication Schemas
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  remember_me: z.boolean().optional(),
});

export const registerSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  first_name: z.string().min(1, 'First name is required').max(30, 'First name is too long'),
  last_name: z.string().min(1, 'Last name is required').max(30, 'Last name is too long'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/\d/, 'Password must contain at least one number')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
  password_confirm: z.string(),
  terms_accepted: z.boolean().refine(val => val === true, 'You must accept the terms and conditions'),
}).refine(data => data.password === data.password_confirm, {
  message: "Passwords don't match",
  path: ['password_confirm'],
});

export const changePasswordSchema = z.object({
  old_password: z.string().min(1, 'Current password is required'),
  new_password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/\d/, 'Password must contain at least one number')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
  new_password_confirm: z.string(),
}).refine(data => data.new_password === data.new_password_confirm, {
  message: "New passwords don't match",
  path: ['new_password_confirm'],
});

export const passwordResetRequestSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export const passwordResetConfirmSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  new_password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/\d/, 'Password must contain at least one number')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
  new_password_confirm: z.string(),
}).refine(data => data.new_password === data.new_password_confirm, {
  message: "Passwords don't match",
  path: ['new_password_confirm'],
});

// Profile Schemas
export const profileUpdateSchema = z.object({
  display_name: z.string().max(100, 'Display name is too long').optional(),
  bio: z.string().max(500, 'Bio is too long').optional(),
  phone: z.string().regex(/^\+?1?\d{9,15}$/, 'Please enter a valid phone number').optional().or(z.literal('')),
  website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  company: z.string().max(100, 'Company name is too long').optional(),
  job_title: z.string().max(100, 'Job title is too long').optional(),
  timezone_name: z.string().min(1, 'Timezone is required'),
  language: z.string().min(1, 'Language is required'),
  date_format: z.string().min(1, 'Date format is required'),
  time_format: z.enum(['12h', '24h']),
  brand_color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Please enter a valid hex color'),
  public_profile: z.boolean(),
  show_phone: z.boolean(),
  show_email: z.boolean(),
  reasonable_hours_start: z.number().min(0).max(23),
  reasonable_hours_end: z.number().min(1).max(24),
});

// Event Type Schemas
export const eventTypeSchema = z.object({
  name: z.string().min(1, 'Event name is required').max(200, 'Event name is too long'),
  description: z.string().max(1000, 'Description is too long').optional(),
  duration: z.number().min(5, 'Duration must be at least 5 minutes').max(480, 'Duration cannot exceed 8 hours'),
  max_attendees: z.number().min(1, 'Must allow at least 1 attendee').max(100, 'Cannot exceed 100 attendees'),
  enable_waitlist: z.boolean().optional(),
  is_active: z.boolean().optional(),
  is_private: z.boolean().optional(),
  min_scheduling_notice: z.number().min(0, 'Minimum notice cannot be negative'),
  max_scheduling_horizon: z.number().min(60, 'Maximum horizon must be at least 1 hour'),
  buffer_time_before: z.number().min(0).max(120),
  buffer_time_after: z.number().min(0).max(120),
  max_bookings_per_day: z.number().min(1).max(50).optional().nullable(),
  slot_interval_minutes: z.number().min(0).max(60),
  recurrence_type: z.enum(['none', 'daily', 'weekly', 'monthly']),
  recurrence_rule: z.string().optional(),
  max_occurrences: z.number().min(1).max(365).optional().nullable(),
  recurrence_end_date: z.string().optional().nullable(),
  location_type: z.enum(['video_call', 'phone_call', 'in_person', 'custom']),
  location_details: z.string().max(500, 'Location details are too long').optional(),
  redirect_url_after_booking: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
});

// Custom Question Schema
export const customQuestionSchema = z.object({
  question_text: z.string().min(1, 'Question text is required').max(500, 'Question text is too long'),
  question_type: z.enum(['text', 'textarea', 'select', 'multiselect', 'checkbox', 'radio', 'email', 'phone', 'number', 'date', 'time', 'url']),
  is_required: z.boolean(),
  order: z.number().min(0),
  options: z.array(z.string()).optional(),
  conditions: z.array(z.any()).optional(),
  validation_rules: z.record(z.any()).optional(),
});

// Booking Schemas
export const bookingSchema = z.object({
  invitee_name: z.string().min(1, 'Name is required').max(200, 'Name is too long'),
  invitee_email: z.string().email('Please enter a valid email address'),
  invitee_phone: z.string().regex(/^\+?1?\d{9,15}$/, 'Please enter a valid phone number').optional().or(z.literal('')),
  invitee_timezone: z.string().min(1, 'Timezone is required'),
  attendee_count: z.number().min(1, 'Must have at least 1 attendee'),
  start_time: z.string().min(1, 'Start time is required'),
  custom_answers: z.record(z.any()).optional(),
  attendees_data: z.array(z.object({
    name: z.string().min(1, 'Attendee name is required'),
    email: z.string().email('Please enter a valid email address'),
    phone: z.string().optional(),
    custom_answers: z.record(z.any()).optional(),
  })).optional(),
});

// Availability Schemas
export const availabilityRuleSchema = z.object({
  day_of_week: z.number().min(0).max(6),
  start_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time'),
  end_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time'),
  event_types: z.array(z.string()).optional(),
  is_active: z.boolean().optional(),
});

export const dateOverrideSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Please enter a valid date'),
  is_available: z.boolean(),
  start_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time').optional().nullable(),
  end_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time').optional().nullable(),
  event_types: z.array(z.string()).optional(),
  reason: z.string().max(200, 'Reason is too long').optional(),
  is_active: z.boolean().optional(),
}).refine(data => {
  if (data.is_available && (!data.start_time || !data.end_time)) {
    return false;
  }
  return true;
}, {
  message: 'Start time and end time are required when available',
  path: ['start_time'],
});

// Integration Schemas
export const webhookIntegrationSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  webhook_url: z.string().url('Please enter a valid URL'),
  events: z.array(z.string()).min(1, 'At least one event must be selected'),
  secret_key: z.string().max(200, 'Secret key is too long').optional(),
  headers: z.record(z.string()).optional(),
  is_active: z.boolean().optional(),
  retry_failed: z.boolean().optional(),
  max_retries: z.number().min(0).max(10).optional(),
});

// Workflow Schemas
export const workflowSchema = z.object({
  name: z.string().min(1, 'Workflow name is required').max(200, 'Workflow name is too long'),
  description: z.string().max(1000, 'Description is too long').optional(),
  trigger: z.enum(['booking_created', 'booking_cancelled', 'booking_completed', 'before_meeting', 'after_meeting']),
  event_types: z.array(z.string()).optional(),
  delay_minutes: z.number().min(0, 'Delay cannot be negative'),
  is_active: z.boolean().optional(),
});

export const workflowActionSchema = z.object({
  name: z.string().min(1, 'Action name is required').max(200, 'Action name is too long'),
  action_type: z.enum(['send_email', 'send_sms', 'webhook', 'update_booking']),
  order: z.number().min(0),
  recipient: z.enum(['organizer', 'invitee', 'both', 'custom']),
  custom_email: z.string().email('Please enter a valid email address').optional().or(z.literal('')),
  subject: z.string().max(200, 'Subject is too long').optional(),
  message: z.string().max(2000, 'Message is too long').optional(),
  webhook_url: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  webhook_data: z.record(z.any()).optional(),
  conditions: z.array(z.any()).optional(),
  update_booking_fields: z.record(z.any()).optional(),
  is_active: z.boolean().optional(),
}).refine(data => {
  // Custom validation based on action type
  if (data.action_type === 'send_email' || data.action_type === 'send_sms') {
    if (data.recipient === 'custom' && !data.custom_email) {
      return false;
    }
  }
  if (data.action_type === 'webhook' && !data.webhook_url) {
    return false;
  }
  if (data.action_type === 'update_booking' && !data.update_booking_fields) {
    return false;
  }
  return true;
}, {
  message: 'Required fields missing for selected action type',
});

// Contact Schemas
export const contactSchema = z.object({
  first_name: z.string().min(1, 'First name is required').max(100, 'First name is too long'),
  last_name: z.string().max(100, 'Last name is too long').optional(),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().regex(/^\+?1?\d{9,15}$/, 'Please enter a valid phone number').optional().or(z.literal('')),
  company: z.string().max(200, 'Company name is too long').optional(),
  job_title: z.string().max(200, 'Job title is too long').optional(),
  notes: z.string().max(1000, 'Notes are too long').optional(),
  tags: z.array(z.string()).optional(),
  is_active: z.boolean().optional(),
});

export const contactGroupSchema = z.object({
  name: z.string().min(1, 'Group name is required').max(100, 'Group name is too long'),
  description: z.string().max(500, 'Description is too long').optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Please enter a valid hex color'),
  contact_ids: z.array(z.string()).optional(),
});

// Notification Schemas
export const notificationTemplateSchema = z.object({
  name: z.string().min(1, 'Template name is required').max(200, 'Template name is too long'),
  template_type: z.enum(['booking_confirmation', 'booking_reminder', 'booking_cancellation', 'booking_rescheduled', 'follow_up', 'custom']),
  notification_type: z.enum(['email', 'sms']),
  subject: z.string().max(200, 'Subject is too long').optional(),
  message: z.string().min(1, 'Message is required').max(2000, 'Message is too long'),
  is_active: z.boolean().optional(),
  is_default: z.boolean().optional(),
});

// Validation helper functions
export function validateTimeRange(startTime: string, endTime: string): boolean {
  const start = new Date(`2000-01-01T${startTime}`);
  const end = new Date(`2000-01-01T${endTime}`);
  
  // Allow midnight-spanning times
  if (end < start) {
    // This is a midnight-spanning time range, which is valid
    return true;
  }
  
  return end > start;
}

export function validateDateRange(startDate: string, endDate: string): boolean {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return end >= start;
}

export function validateTimezone(timezone: string): boolean {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: timezone });
    return true;
  } catch (error) {
    return false;
  }
}

export function validatePhoneNumber(phone: string): boolean {
  const phoneRegex = /^\+?1?\d{9,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}

export function validateHexColor(color: string): boolean {
  const hexRegex = /^#[0-9A-F]{6}$/i;
  return hexRegex.test(color);
}