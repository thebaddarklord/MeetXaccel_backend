import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  themeMode: 'light' | 'dark';
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  notifications: NotificationState[];
  loading: {
    global: boolean;
    [key: string]: boolean;
  };
  modals: {
    [key: string]: boolean;
  };
  breadcrumbs: BreadcrumbItem[];
  pageTitle: string;
  timezone: string;
  language: string;
}

interface NotificationState {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  autoHide?: boolean;
  duration?: number;
  actions?: Array<{
    label: string;
    action: () => void;
  }>;
}

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

const initialState: UIState = {
  themeMode: 'light',
  sidebarOpen: true,
  sidebarCollapsed: false,
  notifications: [],
  loading: {
    global: false,
  },
  modals: {},
  breadcrumbs: [],
  pageTitle: '',
  timezone: 'UTC',
  language: 'en',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setThemeMode: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.themeMode = action.payload;
      // Persist to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('themeMode', action.payload);
      }
    },
    
    toggleTheme: (state) => {
      state.themeMode = state.themeMode === 'light' ? 'dark' : 'light';
      if (typeof window !== 'undefined') {
        localStorage.setItem('themeMode', state.themeMode);
      }
    },
    
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('sidebarCollapsed', action.payload.toString());
      }
    },
    
    toggleSidebarCollapsed: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
      if (typeof window !== 'undefined') {
        localStorage.setItem('sidebarCollapsed', state.sidebarCollapsed.toString());
      }
    },
    
    addNotification: (state, action: PayloadAction<Omit<NotificationState, 'id'>>) => {
      const notification: NotificationState = {
        id: Date.now().toString(),
        autoHide: true,
        duration: 5000,
        ...action.payload,
      };
      state.notifications.push(notification);
    },
    
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
    
    clearNotifications: (state) => {
      state.notifications = [];
    },
    
    setLoading: (state, action: PayloadAction<{ key: string; loading: boolean }>) => {
      state.loading[action.payload.key] = action.payload.loading;
    },
    
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.global = action.payload;
    },
    
    setModal: (state, action: PayloadAction<{ key: string; open: boolean }>) => {
      state.modals[action.payload.key] = action.payload.open;
    },
    
    setBreadcrumbs: (state, action: PayloadAction<BreadcrumbItem[]>) => {
      state.breadcrumbs = action.payload;
    },
    
    setPageTitle: (state, action: PayloadAction<string>) => {
      state.pageTitle = action.payload;
    },
    
    setTimezone: (state, action: PayloadAction<string>) => {
      state.timezone = action.payload;
    },
    
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
  },
});

export const {
  setThemeMode,
  toggleTheme,
  setSidebarOpen,
  toggleSidebar,
  setSidebarCollapsed,
  toggleSidebarCollapsed,
  addNotification,
  removeNotification,
  clearNotifications,
  setLoading,
  setGlobalLoading,
  setModal,
  setBreadcrumbs,
  setPageTitle,
  setTimezone,
  setLanguage,
} = uiSlice.actions;

export default uiSlice.reducer;