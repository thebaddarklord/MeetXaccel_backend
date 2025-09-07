import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define route patterns
const publicRoutes = [
  '/',
  '/auth/login',
  '/auth/register',
  '/auth/verify-email',
  '/auth/request-password-reset',
  '/auth/reset-password',
  '/auth/sso',
  '/auth/error',
  '/api/auth',
  '/api/backend',
];

const authRoutes = [
  '/auth/login',
  '/auth/register',
  '/auth/sso',
];

const protectedRoutes = [
  '/dashboard',
  '/event-types',
  '/bookings',
  '/availability',
  '/integrations',
  '/workflows',
  '/notifications',
  '/contacts',
  '/analytics',
  '/settings',
  '/profile',
];

const adminRoutes = [
  '/admin',
  '/users/manage',
  '/system',
];

function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some(route => {
    if (route === '/') return pathname === '/';
    return pathname.startsWith(route);
  });
}

function isAuthRoute(pathname: string): boolean {
  return authRoutes.some(route => pathname.startsWith(route));
}

function isProtectedRoute(pathname: string): boolean {
  return protectedRoutes.some(route => pathname.startsWith(route));
}

function isAdminRoute(pathname: string): boolean {
  return adminRoutes.some(route => pathname.startsWith(route));
}

function isPublicBookingRoute(pathname: string): boolean {
  // Match patterns like /{organizer_slug} or /{organizer_slug}/{event_type_slug}
  const segments = pathname.split('/').filter(Boolean);
  
  // Skip if it's already a known route
  if (isPublicRoute(pathname) || isProtectedRoute(pathname) || isAdminRoute(pathname)) {
    return false;
  }
  
  // Check for organizer slug pattern (1-2 segments)
  if (segments.length >= 1 && segments.length <= 2) {
    // Basic validation for organizer slug format
    const organizerSlug = segments[0];
    if (organizerSlug && /^[a-z0-9-]+$/.test(organizerSlug)) {
      return true;
    }
  }
  
  return false;
}

export default withAuth(
  function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Handle public booking routes (/{organizer_slug}/{event_type_slug})
    if (isPublicBookingRoute(pathname)) {
      return NextResponse.next();
    }

    // Allow public routes
    if (isPublicRoute(pathname)) {
      return NextResponse.next();
    }

    // Redirect authenticated users away from auth pages
    if (isAuthRoute(pathname) && token) {
      const callbackUrl = req.nextUrl.searchParams.get('callbackUrl') || '/dashboard';
      return NextResponse.redirect(new URL(callbackUrl, req.url));
    }

    // Check for special authentication states
    if (token) {
      const user = token.user as any;
      
      // Handle password change requirements
      if (user?.account_status === 'password_expired_grace_period' && pathname !== '/auth/force-password-change') {
        return NextResponse.redirect(new URL('/auth/force-password-change', req.url));
      }
      
      // Handle email verification requirements
      if (!user?.is_email_verified && pathname !== '/auth/verify-email' && !isAuthRoute(pathname)) {
        return NextResponse.redirect(new URL('/auth/verify-email', req.url));
      }
      
      // Handle MFA requirements (if implemented)
      if (user?.requires_mfa && pathname !== '/auth/mfa' && !isAuthRoute(pathname)) {
        return NextResponse.redirect(new URL('/auth/mfa', req.url));
      }
      
      // Check admin routes
      if (isAdminRoute(pathname)) {
        const hasAdminRole = user?.roles?.some((role: any) => 
          role.role_type === 'admin' || role.name === 'admin'
        );
        
        if (!hasAdminRole) {
          return NextResponse.redirect(new URL('/dashboard?error=insufficient_permissions', req.url));
        }
      }
    }

    // Protect routes that require authentication
    if (isProtectedRoute(pathname) && !token) {
      const loginUrl = new URL('/auth/login', req.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Allow public routes and public booking routes
        if (isPublicRoute(pathname) || isPublicBookingRoute(pathname)) {
          return true;
        }
        
        // Require token for protected routes
        if (isProtectedRoute(pathname) || isAdminRoute(pathname)) {
          return !!token;
        }
        
        // Allow auth routes regardless of token status
        if (isAuthRoute(pathname)) {
          return true;
        }
        
        // Default to requiring authentication
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth.js API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|manifest.json|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)',
  ],
};