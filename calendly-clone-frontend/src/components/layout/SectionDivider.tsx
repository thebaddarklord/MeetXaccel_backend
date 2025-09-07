'use client';

import { ReactNode } from 'react';
import {
  Box,
  Divider,
  Typography,
  Chip,
  useTheme,
  alpha,
} from '@mui/material';

interface SectionDividerProps {
  label?: string;
  icon?: ReactNode;
  variant?: 'full' | 'inset' | 'middle';
  orientation?: 'horizontal' | 'vertical';
  spacing?: 'small' | 'medium' | 'large';
  color?: 'default' | 'primary' | 'secondary';
  style?: 'solid' | 'dashed' | 'dotted' | 'gradient';
  badge?: {
    label: string;
    color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  };
}

export function SectionDivider({
  label,
  icon,
  variant = 'full',
  orientation = 'horizontal',
  spacing = 'medium',
  color = 'default',
  style = 'solid',
  badge,
}: SectionDividerProps) {
  const theme = useTheme();

  const getSpacing = () => {
    switch (spacing) {
      case 'small':
        return theme.spacing(2);
      case 'large':
        return theme.spacing(4);
      default:
        return theme.spacing(3);
    }
  };

  const getDividerColor = () => {
    switch (color) {
      case 'primary':
        return theme.palette.primary.main;
      case 'secondary':
        return theme.palette.secondary.main;
      default:
        return theme.palette.divider;
    }
  };

  const getDividerStyle = () => {
    const baseStyle = {
      borderColor: getDividerColor(),
    };

    switch (style) {
      case 'dashed':
        return { ...baseStyle, borderStyle: 'dashed' };
      case 'dotted':
        return { ...baseStyle, borderStyle: 'dotted' };
      case 'gradient':
        return {
          border: 'none',
          height: '1px',
          background: `linear-gradient(90deg, transparent 0%, ${getDividerColor()} 50%, transparent 100%)`,
        };
      default:
        return baseStyle;
    }
  };

  if (orientation === 'vertical') {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          height: '100%',
          mx: getSpacing(),
        }}
      >
        <Divider
          orientation="vertical"
          variant={variant}
          sx={getDividerStyle()}
        />
      </Box>
    );
  }

  if (!label && !icon && !badge) {
    return (
      <Box sx={{ my: getSpacing() }}>
        <Divider variant={variant} sx={getDividerStyle()} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        my: getSpacing(),
        position: 'relative',
      }}
    >
      <Divider sx={{ flexGrow: 1, ...getDividerStyle() }} />
      
      {(label || icon || badge) && (
        <Box
          sx={{
            px: 2,
            backgroundColor: theme.palette.background.default,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          {icon}
          {label && (
            <Typography
              variant="body2"
              color={color === 'default' ? 'text.secondary' : `${color}.main`}
              fontWeight={500}
            >
              {label}
            </Typography>
          )}
          {badge && (
            <Chip
              label={badge.label}
              size="small"
              color={badge.color}
              sx={{ fontWeight: 500 }}
            />
          )}
        </Box>
      )}
      
      <Divider sx={{ flexGrow: 1, ...getDividerStyle() }} />
    </Box>
  );
}