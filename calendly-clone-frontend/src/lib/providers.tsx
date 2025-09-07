'use client';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Provider } from 'react-redux';
import { SessionProvider } from 'next-auth/react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { store } from '@/store';
import { lightTheme, darkTheme } from './theme';
import { useThemeMode } from '@/hooks/useThemeMode';
import { ReactNode } from 'react';

interface ProvidersProps {
  children: ReactNode;
  session?: any;
}

function ThemeWrapper({ children }: { children: ReactNode }) {
  const { mode } = useThemeMode();
  const theme = mode === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

export function Providers({ children, session }: ProvidersProps) {
  return (
    <SessionProvider session={session}>
      <Provider store={store}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <ThemeWrapper>
            {children}
          </ThemeWrapper>
        </LocalizationProvider>
      </Provider>
    </SessionProvider>
  );
}