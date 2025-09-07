'use client';

import { ReactNode } from 'react';
import {
  Box,
  Typography,
  Breadcrumbs,
  Link,
  Button,
  Chip,
  Stack,
  Divider,
  useTheme,
  alpha,
} from '@mui/material';
import { NavigateNext, Home } from '@mui/icons-material';
import NextLink from 'next/link';
import { FadeIn, SlideIn } from '@/components/utils/Animations';

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: ReactNode;
  status?: {
    label: string;
    color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  };
  tabs?: ReactNode;
  background?: 'default' | 'gradient' | 'transparent';
  size?: 'small' | 'medium' | 'large';
}

export function PageHeader({
  title,
  subtitle,
  breadcrumbs,
  actions,
  status,
  tabs,
  background = 'default',
  size = 'medium',
}: PageHeaderProps) {
  const theme = useTheme();

  const getBackgroundStyles = () => {
    switch (background) {
      case 'gradient':
        return {
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
          borderBottom: `1px solid ${theme.palette.divider}`,
        };
      case 'transparent':
        return {
          background: 'transparent',
        };
      default:
        return {
          backgroundColor: theme.palette.background.paper,
          borderBottom: `1px solid ${theme.palette.divider}`,
        };
    }
  };

  const getPadding = () => {
    switch (size) {
      case 'small':
        return theme.spacing(2, 3);
      case 'large':
        return theme.spacing(4, 3);
      default:
        return theme.spacing(3);
    }
  };

  return (
    <Box
      sx={{
        ...getBackgroundStyles(),
        padding: getPadding(),
        position: 'sticky',
        top: 64, // AppBar height
        zIndex: theme.zIndex.appBar - 1,
        backdropFilter: background !== 'transparent' ? 'blur(8px)' : 'none',
      }}
    >
      <FadeIn>
        <Stack spacing={2}>
          {/* Breadcrumbs */}
          {breadcrumbs && breadcrumbs.length > 0 && (
            <SlideIn direction="down" delay={100}>
              <Breadcrumbs
                separator={<NavigateNext fontSize="small" />}
                aria-label="breadcrumb"
              >
                <Link
                  component={NextLink}
                  href="/dashboard"
                  color="inherit"
                  underline="hover"
                  sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                >
                  <Home fontSize="small" />
                  Dashboard
                </Link>
                {breadcrumbs.map((crumb, index) => {
                  const isLast = index === breadcrumbs.length - 1;
                  
                  if (isLast || crumb.current) {
                    return (
                      <Typography key={index} color="text.primary" fontWeight={500}>
                        {crumb.label}
                      </Typography>
                    );
                  }
                  
                  return (
                    <Link
                      key={index}
                      component={NextLink}
                      href={crumb.href || '#'}
                      color="inherit"
                      underline="hover"
                    >
                      {crumb.label}
                    </Link>
                  );
                })}
              </Breadcrumbs>
            </SlideIn>
          )}

          {/* Title and Actions */}
          <Box display="flex" alignItems="flex-start" justifyContent="space-between" gap={2}>
            <SlideIn direction="left" delay={200}>
              <Box>
                <Box display="flex" alignItems="center" gap={2} mb={subtitle ? 1 : 0}>
                  <Typography
                    variant={size === 'large' ? 'h3' : size === 'small' ? 'h5' : 'h4'}
                    component="h1"
                    fontWeight={700}
                    color="text.primary"
                  >
                    {title}
                  </Typography>
                  {status && (
                    <Chip
                      label={status.label}
                      color={status.color}
                      size="small"
                      sx={{ fontWeight: 500 }}
                    />
                  )}
                </Box>
                {subtitle && (
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ maxWidth: 600 }}
                  >
                    {subtitle}
                  </Typography>
                )}
              </Box>
            </SlideIn>

            {actions && (
              <SlideIn direction="right" delay={300}>
                <Box display="flex" gap={1} flexWrap="wrap">
                  {actions}
                </Box>
              </SlideIn>
            )}
          </Box>

          {/* Tabs */}
          {tabs && (
            <SlideIn direction="up" delay={400}>
              <Box>
                <Divider sx={{ mb: 2 }} />
                {tabs}
              </Box>
            </SlideIn>
          )}
        </Stack>
      </FadeIn>
    </Box>
  );
}