'use client';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { addNotification, removeNotification, clearNotifications } from '@/store/slices/uiSlice';
import { useCallback } from 'react';

export function useNotifications() {
  const dispatch = useDispatch();
  const notifications = useSelector((state: RootState) => state.ui.notifications);

  const showNotification = useCallback((
    type: 'success' | 'error' | 'warning' | 'info',
    title: string,
    message: string,
    options?: {
      autoHide?: boolean;
      duration?: number;
      actions?: Array<{
        label: string;
        action: () => void;
      }>;
    }
  ) => {
    dispatch(addNotification({
      type,
      title,
      message,
      ...options,
    }));
  }, [dispatch]);

  const showSuccess = useCallback((title: string, message: string) => {
    showNotification('success', title, message);
  }, [showNotification]);

  const showError = useCallback((title: string, message: string) => {
    showNotification('error', title, message, { autoHide: false });
  }, [showNotification]);

  const showWarning = useCallback((title: string, message: string) => {
    showNotification('warning', title, message);
  }, [showNotification]);

  const showInfo = useCallback((title: string, message: string) => {
    showNotification('info', title, message);
  }, [showNotification]);

  const hideNotification = useCallback((id: string) => {
    dispatch(removeNotification(id));
  }, [dispatch]);

  const clearAll = useCallback(() => {
    dispatch(clearNotifications());
  }, [dispatch]);

  return {
    notifications,
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    hideNotification,
    clearAll,
  };
}