/**
 * Environment variables utility with type safety and validation
 */

interface EnvironmentConfig {
  // API Configuration
  API_BASE_URL: string;
  SITE_URL: string;
  
  // Feature Flags
  ENABLE_SSO: boolean;
  ENABLE_MFA: boolean;
  ENABLE_PWA: boolean;
  ENABLE_ANALYTICS: boolean;
  
  // Availability Settings
  AVAILABILITY_CACHE_DAYS_AHEAD: number;
  AVAILABILITY_CACHE_TIMEOUT: number;
  AVAILABILITY_REASONABLE_HOURS_START: number;
  AVAILABILITY_REASONABLE_HOURS_END: number;
  AVAILABILITY_SLOT_INTERVAL_MINUTES: number;
  
  // Integration Rate Limits
  INTEGRATION_RATE_LIMIT_GOOGLE: number;
  INTEGRATION_RATE_LIMIT_MICROSOFT: number;
  INTEGRATION_RATE_LIMIT_ZOOM: number;
  
  // Calendar Sync Settings
  CALENDAR_SYNC_DAYS_AHEAD: number;
  CALENDAR_SYNC_DAYS_BEHIND: number;
  CALENDAR_SYNC_BATCH_SIZE: number;
  
  // Password Policy
  PASSWORD_EXPIRY_DAYS: number;
  PASSWORD_EXPIRY_WARNING_DAYS: number;
  PASSWORD_EXPIRY_GRACE_PERIOD_HOURS: number;
  
  // Site Configuration
  SITE_NAME: string;
  
  // Environment
  NODE_ENV: string;
  IS_DEVELOPMENT: boolean;
  IS_PRODUCTION: boolean;
}

function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key];
  if (value === undefined) {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    console.warn(`Environment variable ${key} is not defined`);
    return '';
  }
  return value;
}

function getEnvVarAsNumber(key: string, defaultValue: number): number {
  const value = process.env[key];
  if (value === undefined) {
    return defaultValue;
  }
  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) {
    console.warn(`Environment variable ${key} is not a valid number, using default: ${defaultValue}`);
    return defaultValue;
  }
  return parsed;
}

function getEnvVarAsBoolean(key: string, defaultValue: boolean): boolean {
  const value = process.env[key];
  if (value === undefined) {
    return defaultValue;
  }
  return value.toLowerCase() === 'true';
}

// Create the environment configuration object
export const env: EnvironmentConfig = {
  // API Configuration
  API_BASE_URL: getEnvVar('NEXT_PUBLIC_API_BASE_URL', 'http://localhost:8000/api/v1'),
  SITE_URL: getEnvVar('NEXT_PUBLIC_SITE_URL', 'http://localhost:3000'),
  
  // Feature Flags
  ENABLE_SSO: getEnvVarAsBoolean('NEXT_PUBLIC_ENABLE_SSO', true),
  ENABLE_MFA: getEnvVarAsBoolean('NEXT_PUBLIC_ENABLE_MFA', true),
  ENABLE_PWA: getEnvVarAsBoolean('NEXT_PUBLIC_ENABLE_PWA', true),
  ENABLE_ANALYTICS: getEnvVarAsBoolean('NEXT_PUBLIC_ENABLE_ANALYTICS', true),
  
  // Availability Settings
  AVAILABILITY_CACHE_DAYS_AHEAD: getEnvVarAsNumber('NEXT_PUBLIC_AVAILABILITY_CACHE_DAYS_AHEAD', 14),
  AVAILABILITY_CACHE_TIMEOUT: getEnvVarAsNumber('NEXT_PUBLIC_AVAILABILITY_CACHE_TIMEOUT', 3600),
  AVAILABILITY_REASONABLE_HOURS_START: getEnvVarAsNumber('NEXT_PUBLIC_AVAILABILITY_REASONABLE_HOURS_START', 7),
  AVAILABILITY_REASONABLE_HOURS_END: getEnvVarAsNumber('NEXT_PUBLIC_AVAILABILITY_REASONABLE_HOURS_END', 22),
  AVAILABILITY_SLOT_INTERVAL_MINUTES: getEnvVarAsNumber('NEXT_PUBLIC_AVAILABILITY_SLOT_INTERVAL_MINUTES', 15),
  
  // Integration Rate Limits
  INTEGRATION_RATE_LIMIT_GOOGLE: getEnvVarAsNumber('NEXT_PUBLIC_INTEGRATION_RATE_LIMIT_GOOGLE', 100),
  INTEGRATION_RATE_LIMIT_MICROSOFT: getEnvVarAsNumber('NEXT_PUBLIC_INTEGRATION_RATE_LIMIT_MICROSOFT', 60),
  INTEGRATION_RATE_LIMIT_ZOOM: getEnvVarAsNumber('NEXT_PUBLIC_INTEGRATION_RATE_LIMIT_ZOOM', 80),
  
  // Calendar Sync Settings
  CALENDAR_SYNC_DAYS_AHEAD: getEnvVarAsNumber('NEXT_PUBLIC_CALENDAR_SYNC_DAYS_AHEAD', 90),
  CALENDAR_SYNC_DAYS_BEHIND: getEnvVarAsNumber('NEXT_PUBLIC_CALENDAR_SYNC_DAYS_BEHIND', 7),
  CALENDAR_SYNC_BATCH_SIZE: getEnvVarAsNumber('NEXT_PUBLIC_CALENDAR_SYNC_BATCH_SIZE', 50),
  
  // Password Policy
  PASSWORD_EXPIRY_DAYS: getEnvVarAsNumber('NEXT_PUBLIC_PASSWORD_EXPIRY_DAYS', 90),
  PASSWORD_EXPIRY_WARNING_DAYS: getEnvVarAsNumber('NEXT_PUBLIC_PASSWORD_EXPIRY_WARNING_DAYS', 7),
  PASSWORD_EXPIRY_GRACE_PERIOD_HOURS: getEnvVarAsNumber('NEXT_PUBLIC_PASSWORD_EXPIRY_GRACE_PERIOD_HOURS', 24),
  
  // Site Configuration
  SITE_NAME: getEnvVar('NEXT_PUBLIC_SITE_NAME', 'Calendly Clone'),
  
  // Environment
  NODE_ENV: getEnvVar('NODE_ENV', 'development'),
  IS_DEVELOPMENT: getEnvVar('NODE_ENV', 'development') === 'development',
  IS_PRODUCTION: getEnvVar('NODE_ENV', 'development') === 'production',
};

// Validation function to check if all required environment variables are present
export function validateEnvironmentVariables(): { valid: boolean; missing: string[] } {
  const requiredVars = [
    'NEXT_PUBLIC_API_BASE_URL',
    'NEXT_PUBLIC_SITE_URL',
    'NEXTAUTH_SECRET',
  ];
  
  const missing: string[] = [];
  
  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  }
  
  return {
    valid: missing.length === 0,
    missing,
  };
}

// Helper functions for specific environment checks
export function isFeatureEnabled(feature: keyof Pick<EnvironmentConfig, 'ENABLE_SSO' | 'ENABLE_MFA' | 'ENABLE_PWA' | 'ENABLE_ANALYTICS'>): boolean {
  return env[feature];
}

export function getAPIBaseURL(): string {
  return env.API_BASE_URL;
}

export function getSiteURL(): string {
  return env.SITE_URL;
}

export function isDevelopment(): boolean {
  return env.IS_DEVELOPMENT;
}

export function isProduction(): boolean {
  return env.IS_PRODUCTION;
}

// Log environment validation on module load (development only)
if (env.IS_DEVELOPMENT) {
  const validation = validateEnvironmentVariables();
  if (!validation.valid) {
    console.warn('Missing required environment variables:', validation.missing);
  } else {
    console.log('✅ All required environment variables are configured');
  }
}