import { format, parseISO, formatInTimeZone, zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz';
import { isToday, isTomorrow, isYesterday, differenceInDays } from 'date-fns';

export function formatDateForAPI(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function formatTimeForAPI(date: Date): string {
  return format(date, 'HH:mm:ss');
}

export function formatDateTimeForAPI(date: Date, timezone: string = 'UTC'): string {
  return zonedTimeToUtc(date, timezone).toISOString();
}

export function parseAPIDateTime(dateTimeString: string, timezone: string = 'UTC'): Date {
  const utcDate = parseISO(dateTimeString);
  return utcToZonedTime(utcDate, timezone);
}

export function formatDisplayDate(date: Date | string, timezone: string = 'UTC'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  if (isToday(dateObj)) {
    return 'Today';
  } else if (isTomorrow(dateObj)) {
    return 'Tomorrow';
  } else if (isYesterday(dateObj)) {
    return 'Yesterday';
  } else {
    const daysDiff = differenceInDays(dateObj, new Date());
    if (Math.abs(daysDiff) < 7) {
      return formatInTimeZone(dateObj, timezone, 'EEEE'); // Day name
    } else {
      return formatInTimeZone(dateObj, timezone, 'MMM d, yyyy');
    }
  }
}

export function formatDisplayTime(date: Date | string, timezone: string = 'UTC', format12Hour: boolean = true): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const timeFormat = format12Hour ? 'h:mm a' : 'HH:mm';
  return formatInTimeZone(dateObj, timezone, timeFormat);
}

export function formatDisplayDateTime(date: Date | string, timezone: string = 'UTC', format12Hour: boolean = true): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const dateStr = formatDisplayDate(dateObj, timezone);
  const timeStr = formatDisplayTime(dateObj, timezone, format12Hour);
  return `${dateStr} at ${timeStr}`;
}

export function getTimezoneOffset(timezone: string): string {
  const now = new Date();
  const utcDate = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
  const targetDate = utcToZonedTime(utcDate, timezone);
  const offset = (targetDate.getTime() - utcDate.getTime()) / (1000 * 60 * 60);
  
  const sign = offset >= 0 ? '+' : '-';
  const hours = Math.floor(Math.abs(offset));
  const minutes = Math.round((Math.abs(offset) - hours) * 60);
  
  return `${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

export function getTimezoneDisplayName(timezone: string): string {
  try {
    const formatter = new Intl.DisplayNames(['en'], { type: 'region' });
    const parts = timezone.split('/');
    
    if (parts.length >= 2) {
      const city = parts[parts.length - 1].replace(/_/g, ' ');
      const region = parts[0];
      
      return `${city} (${getTimezoneOffset(timezone)})`;
    }
    
    return timezone;
  } catch (error) {
    return timezone;
  }
}

export function getUserTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
}

export function isValidTimezone(timezone: string): boolean {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: timezone });
    return true;
  } catch (error) {
    return false;
  }
}

export function getCommonTimezones(): Array<{ value: string; label: string; offset: string }> {
  const timezones = [
    'UTC',
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Europe/Berlin',
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Asia/Kolkata',
    'Australia/Sydney',
  ];

  return timezones.map(tz => ({
    value: tz,
    label: getTimezoneDisplayName(tz),
    offset: getTimezoneOffset(tz),
  }));
}

export function calculateDuration(startTime: Date | string, endTime: Date | string): number {
  const start = typeof startTime === 'string' ? parseISO(startTime) : startTime;
  const end = typeof endTime === 'string' ? parseISO(endTime) : endTime;
  
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60)); // minutes
}

export function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60000);
}

export function isSameDay(date1: Date | string, date2: Date | string): boolean {
  const d1 = typeof date1 === 'string' ? parseISO(date1) : date1;
  const d2 = typeof date2 === 'string' ? parseISO(date2) : date2;
  
  return d1.toDateString() === d2.toDateString();
}

export function getWeekDays(): Array<{ value: number; label: string; short: string }> {
  return [
    { value: 0, label: 'Monday', short: 'Mon' },
    { value: 1, label: 'Tuesday', short: 'Tue' },
    { value: 2, label: 'Wednesday', short: 'Wed' },
    { value: 3, label: 'Thursday', short: 'Thu' },
    { value: 4, label: 'Friday', short: 'Fri' },
    { value: 5, label: 'Saturday', short: 'Sat' },
    { value: 6, label: 'Sunday', short: 'Sun' },
  ];
}