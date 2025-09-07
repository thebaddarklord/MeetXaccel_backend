import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { authApi } from './api/authApi';
import { eventsApi } from './api/eventsApi';
import { availabilityApi } from './api/availabilityApi';
import { integrationsApi } from './api/integrationsApi';
import { workflowsApi } from './api/workflowsApi';
import { notificationsApi } from './api/notificationsApi';
import { contactsApi } from './api/contactsApi';
import authSlice from './slices/authSlice';
import uiSlice from './slices/uiSlice';
import bookingSlice from './slices/bookingSlice';

export const store = configureStore({
  reducer: {
    // API slices
    [authApi.reducerPath]: authApi.reducer,
    [eventsApi.reducerPath]: eventsApi.reducer,
    [availabilityApi.reducerPath]: availabilityApi.reducer,
    [integrationsApi.reducerPath]: integrationsApi.reducer,
    [workflowsApi.reducerPath]: workflowsApi.reducer,
    [notificationsApi.reducerPath]: notificationsApi.reducer,
    [contactsApi.reducerPath]: contactsApi.reducer,
    
    // Regular slices
    auth: authSlice,
    ui: uiSlice,
    booking: bookingSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          // Ignore these action types
          'persist/PERSIST',
          'persist/REHYDRATE',
        ],
      },
    }).concat(
      authApi.middleware,
      eventsApi.middleware,
      availabilityApi.middleware,
      integrationsApi.middleware,
      workflowsApi.middleware,
      notificationsApi.middleware,
      contactsApi.middleware
    ),
  devTools: process.env.NODE_ENV !== 'production',
});

// Setup listeners for refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;