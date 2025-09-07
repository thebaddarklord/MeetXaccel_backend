'use client';

import { createTheme, ThemeOptions } from '@mui/material/styles';
import { Roboto } from 'next/font/google';
import { tokens } from './theme/tokens';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const baseTheme: ThemeOptions = {
  typography: {
    fontFamily: tokens.typography.fontFamily.primary,
    h1: {
      fontSize: tokens.typography.fontSize['4xl'],
      fontWeight: tokens.typography.fontWeight.bold,
      lineHeight: tokens.typography.lineHeight.tight,
      letterSpacing: tokens.typography.letterSpacing.tight,
    },
    h2: {
      fontSize: tokens.typography.fontSize['3xl'],
      fontWeight: tokens.typography.fontWeight.semibold,
      lineHeight: tokens.typography.lineHeight.tight,
      letterSpacing: tokens.typography.letterSpacing.tight,
    },
    h3: {
      fontSize: tokens.typography.fontSize['2xl'],
      fontWeight: tokens.typography.fontWeight.semibold,
      lineHeight: tokens.typography.lineHeight.tight,
    },
    h4: {
      fontSize: tokens.typography.fontSize.xl,
      fontWeight: tokens.typography.fontWeight.medium,
      lineHeight: tokens.typography.lineHeight.normal,
    },
    h5: {
      fontSize: tokens.typography.fontSize.lg,
      fontWeight: tokens.typography.fontWeight.medium,
      lineHeight: tokens.typography.lineHeight.normal,
    },
    h6: {
      fontSize: tokens.typography.fontSize.base,
      fontWeight: tokens.typography.fontWeight.medium,
      lineHeight: tokens.typography.lineHeight.normal,
    },
    body1: {
      fontSize: tokens.typography.fontSize.base,
      lineHeight: tokens.typography.lineHeight.normal,
    },
    body2: {
      fontSize: tokens.typography.fontSize.sm,
      lineHeight: tokens.typography.lineHeight.normal,
    },
    caption: {
      fontSize: tokens.typography.fontSize.xs,
      lineHeight: tokens.typography.lineHeight.tight,
    },
    button: {
      fontWeight: tokens.typography.fontWeight.medium,
      textTransform: 'none',
      letterSpacing: tokens.typography.letterSpacing.wide,
    },
  },
  spacing: 8,
  shape: {
    borderRadius: parseInt(tokens.borderRadius.base),
  },
  transitions: {
    duration: {
      shortest: parseInt(tokens.transitions.duration.fastest),
      shorter: parseInt(tokens.transitions.duration.fast),
      short: parseInt(tokens.transitions.duration.normal),
      standard: parseInt(tokens.transitions.duration.normal),
      complex: parseInt(tokens.transitions.duration.slow),
      enteringScreen: parseInt(tokens.transitions.duration.normal),
      leavingScreen: parseInt(tokens.transitions.duration.fast),
    },
    easing: {
      easeInOut: tokens.transitions.easing.easeInOut,
      easeOut: tokens.transitions.easing.easeOut,
      easeIn: tokens.transitions.easing.easeIn,
      sharp: tokens.transitions.easing.linear,
    },
  },
};

export const lightTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'light',
    primary: {
      main: tokens.colors.primary[500],
      light: tokens.colors.primary[300],
      dark: tokens.colors.primary[700],
      contrastText: '#ffffff',
    },
    secondary: {
      main: tokens.colors.secondary[500],
      light: tokens.colors.secondary[300],
      dark: tokens.colors.secondary[700],
      contrastText: '#ffffff',
    },
    success: {
      main: tokens.colors.success[500],
      light: tokens.colors.success[300],
      dark: tokens.colors.success[700],
      contrastText: '#ffffff',
    },
    warning: {
      main: tokens.colors.warning[500],
      light: tokens.colors.warning[300],
      dark: tokens.colors.warning[700],
      contrastText: '#ffffff',
    },
    error: {
      main: tokens.colors.error[500],
      light: tokens.colors.error[300],
      dark: tokens.colors.error[700],
      contrastText: '#ffffff',
    },
    background: {
      default: '#fafafa',
      paper: '#ffffff',
    },
    text: {
      primary: tokens.colors.neutral[900],
      secondary: tokens.colors.neutral[600],
    },
    divider: tokens.colors.neutral[200],
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: tokens.borderRadius.base,
          padding: tokens.spacing[2] + ' ' + tokens.spacing[3],
          fontSize: tokens.typography.fontSize.sm,
          fontWeight: tokens.typography.fontWeight.medium,
          boxShadow: 'none',
          transition: `all ${tokens.transitions.duration.fast} ${tokens.transitions.easing.easeInOut}`,
          '&:hover': {
            boxShadow: tokens.shadows.md,
            transform: 'translateY(-1px)',
          },
          '&:focus': {
            outline: `2px solid ${tokens.colors.primary[500]}`,
            outlineOffset: '2px',
          },
          '&:disabled': {
            opacity: 0.6,
            cursor: 'not-allowed',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: tokens.shadows.lg,
          },
        },
        outlined: {
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
        },
        text: {
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: `all ${tokens.transitions.duration.fast} ${tokens.transitions.easing.easeInOut}`,
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
            transform: 'scale(1.05)',
          },
          '&:focus': {
            outline: `2px solid ${tokens.colors.primary[500]}`,
            outlineOffset: '2px',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: tokens.borderRadius.md,
          boxShadow: tokens.shadows.base,
          border: `1px solid ${tokens.colors.neutral[200]}`,
          transition: `all ${tokens.transitions.duration.fast} ${tokens.transitions.easing.easeInOut}`,
          '&:hover': {
            boxShadow: tokens.shadows.md,
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: tokens.borderRadius.base,
            transition: `all ${tokens.transitions.duration.fast} ${tokens.transitions.easing.easeInOut}`,
            '&:hover': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: tokens.colors.primary[300],
              },
            },
            '&.Mui-focused': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderWidth: '2px',
              },
            },
            '&.Mui-error': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: tokens.colors.error[500],
              },
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: tokens.borderRadius.sm,
          fontWeight: tokens.typography.fontWeight.medium,
          transition: `all ${tokens.transitions.duration.fast} ${tokens.transitions.easing.easeInOut}`,
          '&:hover': {
            transform: 'scale(1.02)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: tokens.colors.neutral[900],
          boxShadow: tokens.shadows.base,
          borderBottom: `1px solid ${tokens.colors.neutral[200]}`,
          backdropFilter: 'blur(8px)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: `1px solid ${tokens.colors.neutral[200]}`,
          backgroundColor: '#ffffff',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: tokens.borderRadius.base,
          transition: `all ${tokens.transitions.duration.fast} ${tokens.transitions.easing.easeInOut}`,
          '&:hover': {
            backgroundColor: `rgba(${tokens.colors.primary[500]}, 0.08)`,
            transform: 'translateX(2px)',
          },
          '&.Mui-selected': {
            backgroundColor: `rgba(${tokens.colors.primary[500]}, 0.12)`,
            color: tokens.colors.primary[700],
            '&:hover': {
              backgroundColor: `rgba(${tokens.colors.primary[500]}, 0.16)`,
            },
          },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: tokens.borderRadius.base,
          transition: `all ${tokens.transitions.duration.fast} ${tokens.transitions.easing.easeInOut}`,
          '&:hover': {
            backgroundColor: `rgba(${tokens.colors.primary[500]}, 0.08)`,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: tokens.shadows.sm,
        },
        elevation2: {
          boxShadow: tokens.shadows.base,
        },
        elevation3: {
          boxShadow: tokens.shadows.md,
        },
        elevation8: {
          boxShadow: tokens.shadows.xl,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: tokens.colors.neutral[800],
          fontSize: tokens.typography.fontSize.sm,
          borderRadius: tokens.borderRadius.base,
          padding: `${tokens.spacing[1]} ${tokens.spacing[2]}`,
        },
        arrow: {
          color: tokens.colors.neutral[800],
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: tokens.borderRadius.base,
          '& .MuiAlert-icon': {
            fontSize: '1.25rem',
          },
        },
      },
    },
    MuiSnackbar: {
      styleOverrides: {
        root: {
          '& .MuiAlert-root': {
            boxShadow: tokens.shadows.lg,
          },
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'dark',
    primary: {
      main: tokens.colors.primary[400],
      light: tokens.colors.primary[300],
      dark: tokens.colors.primary[600],
      contrastText: '#ffffff',
    },
    secondary: {
      main: tokens.colors.secondary[400],
      light: tokens.colors.secondary[300],
      dark: tokens.colors.secondary[600],
      contrastText: '#ffffff',
    },
    success: {
      main: tokens.colors.success[400],
      light: tokens.colors.success[300],
      dark: tokens.colors.success[600],
      contrastText: '#ffffff',
    },
    warning: {
      main: tokens.colors.warning[400],
      light: tokens.colors.warning[300],
      dark: tokens.colors.warning[600],
      contrastText: '#ffffff',
    },
    error: {
      main: tokens.colors.error[400],
      light: tokens.colors.error[300],
      dark: tokens.colors.error[600],
      contrastText: '#ffffff',
    },
    background: {
      default: '#0f172a',
      paper: '#1e293b',
    },
    text: {
      primary: tokens.colors.neutral[100],
      secondary: tokens.colors.neutral[400],
    },
    divider: tokens.colors.neutral[700],
  },
  components: {
    ...baseTheme.components,
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1e293b',
          color: tokens.colors.neutral[100],
          boxShadow: tokens.shadows.md,
          borderBottom: `1px solid ${tokens.colors.neutral[700]}`,
          backdropFilter: 'blur(8px)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1e293b',
          borderRight: `1px solid ${tokens.colors.neutral[700]}`,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#1e293b',
          border: `1px solid ${tokens.colors.neutral[700]}`,
          '&:hover': {
            boxShadow: tokens.shadows.lg,
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: tokens.colors.neutral[200],
          color: tokens.colors.neutral[900],
        },
        arrow: {
          color: tokens.colors.neutral[200],
        },
      },
    },
  },
});

export default lightTheme;