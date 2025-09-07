'use client';

import { useEffect } from 'react';
import { Snackbar, Alert, AlertTitle, IconButton, Box } from '@mui/material';
import { Close } from '@mui/icons-material';
import { useNotifications } from '@/hooks/useNotifications';

export function NotificationSystem() {
  const { notifications, hideNotification } = useNotifications();

  useEffect(() => {
    // Auto-hide notifications
    notifications.forEach((notification) => {
      if (notification.autoHide) {
        const timer = setTimeout(() => {
          hideNotification(notification.id);
        }, notification.duration || 5000);

        return () => clearTimeout(timer);
      }
    });
  }, [notifications, hideNotification]);

  return (
    <Box>
      {notifications.map((notification, index) => (
        <Snackbar
          key={notification.id}
          open={true}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          sx={{
            mt: index * 8, // Stack notifications
          }}
        >
          <Alert
            severity={notification.type}
            action={
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={() => hideNotification(notification.id)}
              >
                <Close fontSize="small" />
              </IconButton>
            }
            sx={{ minWidth: 300 }}
          >
            <AlertTitle>{notification.title}</AlertTitle>
            {notification.message}
            
            {notification.actions && (
              <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                {notification.actions.map((action, actionIndex) => (
                  <IconButton
                    key={actionIndex}
                    size="small"
                    onClick={() => {
                      action.action();
                      hideNotification(notification.id);
                    }}
                  >
                    {action.label}
                  </IconButton>
                ))}
              </Box>
            )}
          </Alert>
        </Snackbar>
      ))}
    </Box>
  );
}