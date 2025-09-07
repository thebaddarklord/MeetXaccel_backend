'use client';

import { useSelector, useDispatch } from 'react-redux';
import { useSession, signOut } from 'next-auth/react';
import { RootState } from '@/store';
import { setCredentials, clearCredentials, setUser } from '@/store/slices/authSlice';
import { useEffect } from 'react';

export function useAuth() {
  const dispatch = useDispatch();
  const { data: session, status } = useSession();
  const authState = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (session?.user && session?.accessToken) {
      dispatch(setCredentials({
        user: session.user as any,
        token: session.accessToken as string,
      }));
    } else if (status === 'unauthenticated') {
      dispatch(clearCredentials());
    }
  }, [session, status, dispatch]);

  const logout = async () => {
    await signOut({ redirect: false });
    dispatch(clearCredentials());
  };

  const hasPermission = (permission: string): boolean => {
    if (!authState.user) return false;
    
    // Check if user has the permission through their roles
    return authState.user.roles.some(role => 
      role.role_permissions.some(perm => perm.codename === permission)
    );
  };

  const hasRole = (roleName: string): boolean => {
    if (!authState.user) return false;
    return authState.user.roles.some(role => role.name === roleName);
  };

  const isOrganizer = (): boolean => {
    return authState.user?.is_organizer || false;
  };

  const requiresPasswordChange = (): boolean => {
    return authState.passwordChangeRequired || 
           authState.user?.account_status === 'password_expired_grace_period';
  };

  const requiresEmailVerification = (): boolean => {
    return authState.emailVerificationRequired || 
           !authState.user?.is_email_verified;
  };

  const requiresMFA = (): boolean => {
    return authState.mfaRequired;
  };

  return {
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    isLoading: status === 'loading' || authState.isLoading,
    error: authState.error,
    logout,
    hasPermission,
    hasRole,
    isOrganizer,
    requiresPasswordChange,
    requiresEmailVerification,
    requiresMFA,
    mfaDevices: authState.mfaDevices,
  };
}