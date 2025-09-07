'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, requiresPasswordChange, requiresEmailVerification } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/auth/login');
      } else if (requiresPasswordChange) {
        router.push('/auth/force-password-change');
      } else if (requiresEmailVerification) {
        router.push('/auth/verify-email');
      } else {
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, isLoading, requiresPasswordChange, requiresEmailVerification, router]);

  return <LoadingSpinner fullScreen message="Redirecting..." />;
}