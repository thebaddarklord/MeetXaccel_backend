// Core API Response Types
export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// User Types (from users app)
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  is_organizer: boolean;
  is_email_verified: boolean;
  is_phone_verified: boolean;
  is_mfa_enabled: boolean;
  account_status: 'active' | 'inactive' | 'suspended' | 'pending_verification' | 'password_expired' | 'password_expired_grace_period';
  roles: Role[];
  profile: Profile;
  last_login: string | null;
  date_joined: string;
}

export interface Profile {
  organizer_slug: string;
  display_name: string;
  bio: string;
  profile_picture: string | null;
  phone: string;
  website: string;
  company: string;
  job_title: string;
  timezone_name: string;
  language: string;
  date_format: string;
  time_format: string;
  brand_color: string;
  brand_logo: string | null;
  public_profile: boolean;
  show_phone: boolean;
  show_email: boolean;
  reasonable_hours_start: number;
  reasonable_hours_end: number;
}

export interface Role {
  id: string;
  name: string;
  role_type: 'admin' | 'organizer' | 'team_member' | 'billing_manager' | 'viewer';
  description: string;
  parent: string | null;
  parent_name: string;
  children_count: number;
  role_permissions: Permission[];
  total_permissions: number;
  is_system_role: boolean;
}

export interface Permission {
  id: string;
  codename: string;
  name: string;
  description: string;
  category: string;
}

// Event Types (from events app)
export interface EventType {
  id: string;
  organizer: User;
  name: string;
  event_type_slug: string;
  description: string;
  duration: number;
  max_attendees: number;
  enable_waitlist: boolean;
  is_active: boolean;
  is_private: boolean;
  min_scheduling_notice: number;
  max_scheduling_horizon: number;
  buffer_time_before: number;
  buffer_time_after: number;
  max_bookings_per_day: number | null;
  slot_interval_minutes: number;
  recurrence_type: 'none' | 'daily' | 'weekly' | 'monthly';
  recurrence_rule: string;
  max_occurrences: number | null;
  recurrence_end_date: string | null;
  location_type: 'video_call' | 'phone_call' | 'in_person' | 'custom';
  location_details: string;
  redirect_url_after_booking: string;
  confirmation_workflow: string | null;
  reminder_workflow: string | null;
  cancellation_workflow: string | null;
  questions: CustomQuestion[];
  is_group_event: boolean;
  total_duration_with_buffers: number;
  created_at: string;
  updated_at: string;
}

export interface CustomQuestion {
  id: string;
  question_text: string;
  question_type: 'text' | 'textarea' | 'select' | 'multiselect' | 'checkbox' | 'radio' | 'email' | 'phone' | 'number' | 'date' | 'time' | 'url';
  question_type_display: string;
  is_required: boolean;
  order: number;
  options: string[];
  conditions: any[];
  validation_rules: Record<string, any>;
}

// Booking Types
export interface Booking {
  id: string;
  event_type: EventType;
  organizer: User;
  invitee_name: string;
  invitee_email: string;
  invitee_phone: string;
  invitee_timezone: string;
  attendee_count: number;
  start_time: string;
  end_time: string;
  status: 'confirmed' | 'cancelled' | 'rescheduled' | 'completed' | 'no_show';
  status_display: string;
  recurrence_id: string | null;
  is_recurring_exception: boolean;
  recurrence_sequence: number | null;
  custom_answers: Record<string, any>;
  meeting_link: string;
  meeting_id: string;
  meeting_password: string;
  calendar_sync_status: 'pending' | 'succeeded' | 'failed' | 'not_required';
  attendees: Attendee[];
  duration_minutes: number;
  can_cancel: boolean;
  can_reschedule: boolean;
  is_access_token_valid: boolean;
  cancelled_at: string | null;
  cancelled_by: 'organizer' | 'invitee' | 'system' | null;
  cancellation_reason: string;
  rescheduled_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Attendee {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'confirmed' | 'cancelled' | 'no_show';
  status_display: string;
  custom_answers: Record<string, any>;
  joined_at: string;
  cancelled_at: string | null;
  cancellation_reason: string;
}

// Availability Types
export interface AvailabilityRule {
  id: string;
  day_of_week: number;
  day_of_week_display: string;
  start_time: string;
  end_time: string;
  event_types: string[];
  event_types_count: number;
  spans_midnight: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DateOverrideRule {
  id: string;
  date: string;
  is_available: boolean;
  start_time: string | null;
  end_time: string | null;
  event_types: string[];
  event_types_count: number;
  spans_midnight: boolean;
  reason: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AvailableSlot {
  start_time: string;
  end_time: string;
  duration_minutes: number;
  local_start_time?: string;
  local_end_time?: string;
  invitee_times?: Record<string, any>;
  fairness_score?: number;
}

// Integration Types
export interface CalendarIntegration {
  id: string;
  provider: 'google' | 'outlook' | 'apple';
  provider_display: string;
  provider_email: string;
  calendar_id: string;
  is_active: boolean;
  sync_enabled: boolean;
  is_token_expired: boolean;
  created_at: string;
  updated_at: string;
}

export interface VideoConferenceIntegration {
  id: string;
  provider: 'zoom' | 'google_meet' | 'microsoft_teams' | 'webex';
  provider_display: string;
  provider_email: string;
  is_active: boolean;
  auto_generate_links: boolean;
  is_token_expired: boolean;
  created_at: string;
  updated_at: string;
}

// Workflow Types
export interface Workflow {
  id: string;
  name: string;
  description: string;
  trigger: 'booking_created' | 'booking_cancelled' | 'booking_completed' | 'before_meeting' | 'after_meeting';
  trigger_display: string;
  event_types_count: number;
  delay_minutes: number;
  is_active: boolean;
  success_rate: number;
  execution_stats: {
    total_executions: number;
    successful_executions: number;
    failed_executions: number;
    last_executed_at: string | null;
  };
  actions: WorkflowAction[];
  created_at: string;
  updated_at: string;
}

export interface WorkflowAction {
  id: string;
  name: string;
  action_type: 'send_email' | 'send_sms' | 'webhook' | 'update_booking';
  action_type_display: string;
  order: number;
  recipient: 'organizer' | 'invitee' | 'both' | 'custom';
  recipient_display: string;
  custom_email: string;
  subject: string;
  message: string;
  webhook_url: string;
  webhook_data: Record<string, any>;
  conditions: any[];
  update_booking_fields: Record<string, any>;
  is_active: boolean;
  success_rate: number;
  execution_stats: {
    total_executions: number;
    successful_executions: number;
    failed_executions: number;
    last_executed_at: string | null;
  };
  created_at: string;
  updated_at: string;
}

// Notification Types
export interface NotificationTemplate {
  id: string;
  name: string;
  template_type: 'booking_confirmation' | 'booking_reminder' | 'booking_cancellation' | 'booking_rescheduled' | 'follow_up' | 'custom';
  template_type_display: string;
  notification_type: 'email' | 'sms';
  notification_type_display: string;
  subject: string;
  message: string;
  is_active: boolean;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface NotificationLog {
  id: string;
  booking_id: string | null;
  template_name: string | null;
  notification_type: 'email' | 'sms';
  notification_type_display: string;
  recipient_email: string;
  recipient_phone: string;
  subject: string;
  status: 'pending' | 'sent' | 'failed' | 'bounced' | 'delivered' | 'opened' | 'clicked';
  status_display: string;
  sent_at: string | null;
  delivered_at: string | null;
  opened_at: string | null;
  clicked_at: string | null;
  error_message: string;
  retry_count: number;
  created_at: string;
  updated_at: string;
}

// Contact Types
export interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  phone: string;
  company: string;
  job_title: string;
  notes: string;
  tags: string[];
  total_bookings: number;
  last_booking_date: string | null;
  groups_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContactGroup {
  id: string;
  name: string;
  description: string;
  color: string;
  contact_count: number;
  contacts: Contact[];
  created_at: string;
  updated_at: string;
}

// Common UI Types
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface FormErrors {
  [key: string]: string | string[];
}

export interface TableColumn<T = any> {
  id: keyof T;
  label: string;
  minWidth?: number;
  align?: 'left' | 'right' | 'center';
  format?: (value: any) => string;
  sortable?: boolean;
}

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface DateRange {
  start: Date;
  end: Date;
}

export interface TimeSlot {
  start: Date;
  end: Date;
  available: boolean;
  reason?: string;
}

// Theme Types
export interface ThemeMode {
  mode: 'light' | 'dark';
}

export interface BrandColors {
  primary: string;
  secondary: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
}