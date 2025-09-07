'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Link,
  Divider,
  FormControlLabel,
  Checkbox,
  Alert,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signIn } from 'next-auth/react';
import { useNotifications } from '@/hooks/useNotifications';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import NextLink from 'next/link';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  remember_me: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showError, showSuccess } = useNotifications();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      remember_me: false,
    },
    mode: 'onChange',
  });

  const email = watch('email');

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        remember_me: data.remember_me,
        redirect: false,
      });

      if (result?.error) {
        if (result.error === 'CredentialsSignin') {
          setError('Invalid email or password');
        } else if (result.error === 'AccountLocked') {
          setError('Account is temporarily locked due to multiple failed login attempts');
        } else if (result.error === 'EmailNotVerified') {
          setError('Please verify your email address before logging in');
          router.push(`/auth/verify-email?email=${encodeURIComponent(data.email)}`);
          return;
        } else if (result.error === 'PasswordExpired') {
          setError('Your password has expired. Please reset it to continue.');
          router.push('/auth/request-password-reset');
          return;
        } else if (result.error === 'MFARequired') {
          router.push(`/auth/mfa?email=${encodeURIComponent(data.email)}`);
          return;
        } else {
          setError(result.error);
        }
      } else {
        showSuccess('Login Successful', 'Welcome back!');
        const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
        router.push(callbackUrl);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSSODiscovery = async () => {
    if (!email) {
      setError('Please enter your email address first');
      return;
    }

    const domain = email.split('@')[1];
    if (!domain) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      // Check for SSO providers for this domain
      const response = await fetch(`/api/auth/sso/discovery?domain=${domain}`);
      const data = await response.json();

      if (data.providers && data.providers.length > 0) {
        router.push(`/auth/sso?domain=${domain}`);
      } else {
        showError('No SSO Provider', 'No SSO provider found for your organization');
      }
    } catch (error) {
      console.error('SSO discovery error:', error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'background.default',
        px: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 400,
          width: '100%',
          boxShadow: 3,
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box textAlign="center" mb={3}>
            <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
              Welcome Back
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Sign in to your account
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Email Address"
                  type="email"
                  autoComplete="email"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />
              )}
            />

            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Controller
                name="remember_me"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Checkbox {...field} checked={field.value} />}
                    label="Remember me"
                  />
                )}
              />
              
              <Link component={NextLink} href="/auth/request-password-reset" variant="body2">
                Forgot password?
              </Link>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={!isValid || isLoading}
              sx={{ mb: 2, py: 1.5 }}
            >
              {isLoading ? <LoadingSpinner size={24} message="" /> : 'Sign In'}
            </Button>

            <Button
              fullWidth
              variant="outlined"
              onClick={handleSSODiscovery}
              disabled={!email || isLoading}
              sx={{ mb: 2 }}
            >
              Sign in with SSO
            </Button>

            <Divider sx={{ my: 2 }}>
              <Typography variant="body2" color="text.secondary">
                or
              </Typography>
            </Divider>

            <Box textAlign="center">
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <Link component={NextLink} href="/auth/register" fontWeight={500}>
                  Sign up
                </Link>
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}