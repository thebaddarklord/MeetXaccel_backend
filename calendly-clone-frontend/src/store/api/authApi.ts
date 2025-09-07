import { baseApi } from './baseApi';
import type { 
  User, 
  ApiResponse, 
  Role, 
  Permission,
  Profile,
} from '@/types';

export interface LoginRequest {
  email: string;
  password: string;
  remember_me?: boolean;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface RegisterRequest {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  password_confirm: string;
  terms_accepted: boolean;
}

export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
  new_password_confirm: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  new_password: string;
  new_password_confirm: string;
}

export interface MFASetupRequest {
  device_type: 'totp' | 'sms' | 'backup';
  device_name: string;
  phone_number?: string;
}

export interface MFAVerificationRequest {
  otp_code: string;
  device_id?: string;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Authentication
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/users/login/',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),
    
    register: builder.mutation<ApiResponse<{ user: User; token: string }>, RegisterRequest>({
      query: (userData) => ({
        url: '/users/register/',
        method: 'POST',
        body: userData,
      }),
    }),
    
    logout: builder.mutation<ApiResponse, void>({
      query: () => ({
        url: '/users/logout/',
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),
    
    // Profile Management
    getProfile: builder.query<Profile, void>({
      query: () => '/users/profile/',
      providesTags: ['Profile'],
    }),
    
    updateProfile: builder.mutation<Profile, Partial<Profile>>({
      query: (profileData) => ({
        url: '/users/profile/',
        method: 'PATCH',
        body: profileData,
      }),
      invalidatesTags: ['Profile', 'User'],
    }),
    
    // Password Management
    changePassword: builder.mutation<ApiResponse, ChangePasswordRequest>({
      query: (passwordData) => ({
        url: '/users/change-password/',
        method: 'POST',
        body: passwordData,
      }),
    }),
    
    forcePasswordChange: builder.mutation<ApiResponse<{ token: string }>, { new_password: string; new_password_confirm: string }>({
      query: (passwordData) => ({
        url: '/users/force-password-change/',
        method: 'POST',
        body: passwordData,
      }),
    }),
    
    requestPasswordReset: builder.mutation<ApiResponse, PasswordResetRequest>({
      query: (emailData) => ({
        url: '/users/request-password-reset/',
        method: 'POST',
        body: emailData,
      }),
    }),
    
    confirmPasswordReset: builder.mutation<ApiResponse, PasswordResetConfirm>({
      query: (resetData) => ({
        url: '/users/confirm-password-reset/',
        method: 'POST',
        body: resetData,
      }),
    }),
    
    // Email Verification
    verifyEmail: builder.mutation<ApiResponse, { token: string }>({
      query: (tokenData) => ({
        url: '/users/verify-email/',
        method: 'POST',
        body: tokenData,
      }),
      invalidatesTags: ['User'],
    }),
    
    resendVerification: builder.mutation<ApiResponse, { email: string }>({
      query: (emailData) => ({
        url: '/users/resend-verification/',
        method: 'POST',
        body: emailData,
      }),
    }),
    
    // Role and Permission Management
    getPermissions: builder.query<Permission[], void>({
      query: () => '/users/permissions/',
      providesTags: ['Permission'],
    }),
    
    getRoles: builder.query<Role[], void>({
      query: () => '/users/roles/',
      providesTags: ['Role'],
    }),
    
    // MFA Management
    getMFADevices: builder.query<any[], void>({
      query: () => '/users/mfa/devices/',
    }),
    
    setupMFA: builder.mutation<ApiResponse<{ secret?: string; qr_code?: string; backup_codes?: string[] }>, MFASetupRequest>({
      query: (mfaData) => ({
        url: '/users/mfa/setup/',
        method: 'POST',
        body: mfaData,
      }),
    }),
    
    verifyMFASetup: builder.mutation<ApiResponse<{ backup_codes: string[] }>, MFAVerificationRequest>({
      query: (verificationData) => ({
        url: '/users/mfa/verify/',
        method: 'POST',
        body: verificationData,
      }),
      invalidatesTags: ['User'],
    }),
    
    disableMFA: builder.mutation<ApiResponse, { password: string }>({
      query: (passwordData) => ({
        url: '/users/mfa/disable/',
        method: 'POST',
        body: passwordData,
      }),
      invalidatesTags: ['User'],
    }),
    
    regenerateBackupCodes: builder.mutation<ApiResponse<{ backup_codes: string[] }>, { password: string }>({
      query: (passwordData) => ({
        url: '/users/mfa/backup-codes/regenerate/',
        method: 'POST',
        body: passwordData,
      }),
    }),
    
    // Session Management
    getSessions: builder.query<any[], void>({
      query: () => '/users/sessions/',
    }),
    
    revokeSession: builder.mutation<ApiResponse, string>({
      query: (sessionId) => ({
        url: `/users/sessions/${sessionId}/revoke/`,
        method: 'POST',
      }),
    }),
    
    revokeAllSessions: builder.mutation<ApiResponse, void>({
      query: () => ({
        url: '/users/sessions/revoke-all/',
        method: 'POST',
      }),
    }),
    
    // Audit Logs
    getAuditLogs: builder.query<any[], void>({
      query: () => '/users/audit-logs/',
    }),
    
    // SSO Configuration (Admin)
    getSAMLConfigs: builder.query<any[], void>({
      query: () => '/users/sso/saml/',
    }),
    
    createSAMLConfig: builder.mutation<any, any>({
      query: (configData) => ({
        url: '/users/sso/saml/',
        method: 'POST',
        body: configData,
      }),
    }),
    
    getOIDCConfigs: builder.query<any[], void>({
      query: () => '/users/sso/oidc/',
    }),
    
    createOIDCConfig: builder.mutation<any, any>({
      query: (configData) => ({
        url: '/users/sso/oidc/',
        method: 'POST',
        body: configData,
      }),
    }),
    
    // SSO Discovery and Initiation
    discoverSSO: builder.query<any, string>({
      query: (domain) => `/users/sso/discovery/?domain=${domain}`,
    }),
    
    initiateSSO: builder.mutation<any, { sso_type: 'saml' | 'oidc'; organization_domain: string; redirect_url?: string }>({
      query: (ssoData) => ({
        url: '/users/sso/initiate/',
        method: 'POST',
        body: ssoData,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useForcePasswordChangeMutation,
  useRequestPasswordResetMutation,
  useConfirmPasswordResetMutation,
  useVerifyEmailMutation,
  useResendVerificationMutation,
  useGetPermissionsQuery,
  useGetRolesQuery,
  useGetMFADevicesQuery,
  useSetupMFAMutation,
  useVerifyMFASetupMutation,
  useDisableMFAMutation,
  useRegenerateBackupCodesMutation,
  useGetSessionsQuery,
  useRevokeSessionMutation,
  useRevokeAllSessionsMutation,
  useGetAuditLogsQuery,
  useGetSAMLConfigsQuery,
  useCreateSAMLConfigMutation,
  useGetOIDCConfigsQuery,
  useCreateOIDCConfigMutation,
  useDiscoverSSOQuery,
  useInitiateSSSOMutation,
} = authApi;