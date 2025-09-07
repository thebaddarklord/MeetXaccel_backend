'use client';

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { setThemeMode } from '@/store/slices/uiSlice';

export function useThemeMode() {
  const dispatch = useDispatch();
  const mode = useSelector((state: RootState) => state.ui.themeMode);

  useEffect(() => {
    // Initialize theme from localStorage or system preference
    const savedTheme = localStorage.getItem('themeMode') as 'light' | 'dark' | null;
    
    if (savedTheme) {
      dispatch(setThemeMode(savedTheme));
    } else {
      // Use system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      dispatch(setThemeMode(prefersDark ? 'dark' : 'light'));
    }
  }, [dispatch]);

  const toggleTheme = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    dispatch(setThemeMode(newMode));
  };

  return { mode, toggleTheme };
}