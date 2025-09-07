import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  mfaRequired: boolean;
  mfaDevices: any[];
  passwordChangeRequired: boolean;
  emailVerificationRequired: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  mfaRequired: false,
  mfaDevices: [],
  passwordChangeRequired: false,
  emailVerificationRequired: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;
      state.mfaRequired = false;
      state.passwordChangeRequired = action.payload.user.account_status === 'password_expired_grace_period';
      state.emailVerificationRequired = !action.payload.user.is_email_verified;
    },
    
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.passwordChangeRequired = action.payload.account_status === 'password_expired_grace_period';
      state.emailVerificationRequired = !action.payload.is_email_verified;
    },
    
    setMFARequired: (state, action: PayloadAction<{ required: boolean; devices?: any[] }>) => {
      state.mfaRequired = action.payload.required;
      if (action.payload.devices) {
        state.mfaDevices = action.payload.devices;
      }
    },
    
    setPasswordChangeRequired: (state, action: PayloadAction<boolean>) => {
      state.passwordChangeRequired = action.payload;
    },
    
    setEmailVerificationRequired: (state, action: PayloadAction<boolean>) => {
      state.emailVerificationRequired = action.payload;
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    
    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.mfaRequired = false;
      state.mfaDevices = [];
      state.passwordChangeRequired = false;
      state.emailVerificationRequired = false;
    },
    
    updateUserProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const {
  setCredentials,
  setUser,
  setMFARequired,
  setPasswordChangeRequired,
  setEmailVerificationRequired,
  setLoading,
  setError,
  clearCredentials,
  updateUserProfile,
} = authSlice.actions;

export default authSlice.reducer;