'use client';

import { usePathname } from 'next/navigation';
import {
  Breadcrumbs as MUIBreadcrumbs,
  Link,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import { NavigateNext, Home } from '@mui/icons-material';
import NextLink from 'next/link';
import { useTranslation } from 'next-i18next';

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
  icon?: React.ReactNode;
  badge?: {
    label: string;
    color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  };
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  showHome?: boolean;
  maxItems?: number;
  separator?: React.ReactNode;
}

// Route to breadcrumb mapping
const routeMap: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/event-types': 'Event Types',
  '/bookings': 'Bookings',
  '/availability': 'Availability',
  '/integrations': 'Integrations',
  '/workflows': 'Workflows',
  '/notifications': 'Notifications',
  '/contacts': 'Contacts',
  '/analytics': 'Analytics',
  '/settings': 'Settings',
  '/profile': 'Profile',
};

export function Breadcrumbs({
  items,
  showHome = true,
  maxItems = 8,
  separator = <NavigateNext fontSize="small" />,
}: BreadcrumbsProps) {
  const pathname = usePathname();
  const { t } = useTranslation('common');

  // Generate breadcrumbs from current path if items not provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (items) return items;

    const pathSegments = pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];

    let currentPath = '';
    
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;
      
      // Get label from route map or format segment
      let label = routeMap[currentPath] || segment.replace(/-/g, ' ');
      
      // Capitalize first letter
      label = label.charAt(0).toUpperCase() + label.slice(1);
      
      breadcrumbs.push({
        label,
        href: isLast ? undefined : currentPath,
        current: isLast,
      });
    });

    return breadcrumbs;
  };

  const breadcrumbItems = generateBreadcrumbs();

  if (breadcrumbItems.length === 0 && !showHome) {
    return null;
  }

  return (
    <MUIBreadcrumbs
      separator={separator}
      maxItems={maxItems}
      aria-label="breadcrumb"
      sx={{
        '& .MuiBreadcrumbs-separator': {
          color: 'text.secondary',
        },
      }}
    >
      {showHome && (
        <Link
          component={NextLink}
          href="/dashboard"
          color="inherit"
          underline="hover"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            '&:hover': {
              color: 'primary.main',
            },
          }}
        >
          <Home fontSize="small" />
          {t('navigation.dashboard')}
        </Link>
      )}
      
      {breadcrumbItems.map((item, index) => {
        const isLast = index === breadcrumbItems.length - 1;
        
        if (isLast || item.current) {
          return (
            <Box key={index} display="flex" alignItems="center" gap={1}>
              {item.icon}
              <Typography color="text.primary" fontWeight={500}>
                {item.label}
              </Typography>
              {item.badge && (
                <Chip
                  label={item.badge.label}
                  size="small"
                  color={item.badge.color}
                  sx={{ height: 20, fontSize: '0.75rem' }}
                />
              )}
            </Box>
          );
        }
        
        return (
          <Link
            key={index}
            component={NextLink}
            href={item.href || '#'}
            color="inherit"
            underline="hover"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              '&:hover': {
                color: 'primary.main',
              },
            }}
          >
            {item.icon}
            {item.label}
            {item.badge && (
              <Chip
                label={item.badge.label}
                size="small"
                color={item.badge.color}
                sx={{ height: 20, fontSize: '0.75rem', ml: 0.5 }}
              />
            )}
          </Link>
        );
      })}
    </MUIBreadcrumbs>
  );
}