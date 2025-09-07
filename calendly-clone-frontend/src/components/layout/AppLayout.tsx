'use client';

import { ReactNode, useState } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Badge,
  Tooltip,
  useTheme,
  useMediaQuery,
  Collapse,
  alpha,
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  Notifications,
  Settings,
  Logout,
  Dashboard,
  Event,
  Schedule,
  Integration,
  Workflow,
  Contacts,
  Analytics,
  ChevronLeft,
  ChevronRight,
  LightMode,
  DarkMode,
  ExpandLess,
  ExpandMore,
  Person,
  Security,
  Business,
  NotificationsActive,
  Circle,
} from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';
import { useThemeMode } from '@/hooks/useThemeMode';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { toggleSidebar, toggleSidebarCollapsed } from '@/store/slices/uiSlice';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';

interface AppLayoutProps {
  children: ReactNode;
}

const drawerWidth = 280;
const collapsedDrawerWidth = 64;

const navigationItems = [
  { 
    label: 'Dashboard', 
    icon: Dashboard, 
    href: '/dashboard', 
    permission: null,
    translationKey: 'navigation.dashboard'
  },
  { 
    label: 'Event Types', 
    icon: Event, 
    href: '/event-types', 
    permission: 'can_create_events',
    translationKey: 'navigation.eventTypes'
  },
  { 
    label: 'Bookings', 
    icon: Schedule, 
    href: '/bookings', 
    permission: 'can_manage_bookings',
    translationKey: 'navigation.bookings'
  },
  { 
    label: 'Availability', 
    icon: Schedule, 
    href: '/availability', 
    permission: null,
    translationKey: 'navigation.availability'
  },
  { 
    label: 'Integrations', 
    icon: Integration, 
    href: '/integrations', 
    permission: 'can_manage_integrations',
    translationKey: 'navigation.integrations',
    children: [
      { label: 'Calendar', icon: Schedule, href: '/integrations/calendar', permission: null },
      { label: 'Video', icon: Schedule, href: '/integrations/video', permission: null },
      { label: 'Webhooks', icon: Schedule, href: '/integrations/webhooks', permission: null },
    ]
  },
  { 
    label: 'Workflows', 
    icon: Workflow, 
    href: '/workflows', 
    permission: null,
    translationKey: 'navigation.workflows'
  },
  { 
    label: 'Contacts', 
    icon: Contacts, 
    href: '/contacts', 
    permission: null,
    translationKey: 'navigation.contacts'
  },
  { 
    label: 'Analytics', 
    icon: Analytics, 
    href: '/analytics', 
    permission: 'can_view_reports',
    translationKey: 'navigation.analytics'
  },
];

export function AppLayout({ children }: AppLayoutProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, logout, hasPermission } = useAuth();
  const { mode, toggleTheme } = useThemeMode();
  const { t } = useTranslation('common');
  const dispatch = useDispatch();
  const router = useRouter();
  
  const { sidebarOpen, sidebarCollapsed } = useSelector((state: RootState) => state.ui);
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [notifications] = useState([
    { id: '1', title: 'New booking', message: 'John Doe booked a meeting', time: '2 min ago', read: false },
    { id: '2', title: 'Calendar synced', message: 'Google Calendar sync completed', time: '1 hour ago', read: true },
  ]);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    router.push('/auth/login');
    handleProfileMenuClose();
  };

  const handleSidebarToggle = () => {
    if (isMobile) {
      dispatch(toggleSidebar());
    } else {
      dispatch(toggleSidebarCollapsed());
    }
  };

  const handleExpandClick = (itemLabel: string) => {
    setExpandedItems(prev => 
      prev.includes(itemLabel) 
        ? prev.filter(item => item !== itemLabel)
        : [...prev, itemLabel]
    );
  };

  const unreadNotifications = notifications.filter(n => !n.read).length;

  const currentDrawerWidth = sidebarCollapsed && !isMobile ? collapsedDrawerWidth : drawerWidth;

  const renderNavigationItem = (item: any, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.label);
    const translatedLabel = item.translationKey ? t(item.translationKey) : item.label;

    // Check permissions
    if (item.permission && !hasPermission(item.permission)) {
      return null;
    }

    return (
      <Box key={item.label}>
        <ListItem disablePadding sx={{ mb: 0.5 }}>
          <ListItemButton
            component={hasChildren ? 'div' : Link}
            href={hasChildren ? undefined : item.href}
            onClick={hasChildren ? () => handleExpandClick(item.label) : undefined}
            sx={{
              borderRadius: 1,
              ml: depth * 2,
              pl: sidebarCollapsed ? 1.5 : 2,
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.08),
              },
              '&.active': {
                backgroundColor: alpha(theme.palette.primary.main, 0.12),
                color: 'primary.main',
                '& .MuiListItemIcon-root': {
                  color: 'primary.main',
                },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: sidebarCollapsed ? 'auto' : 40 }}>
              <item.icon />
            </ListItemIcon>
            {!sidebarCollapsed && (
              <>
                <ListItemText primary={translatedLabel} />
                {hasChildren && (
                  <IconButton size="small" edge="end">
                    {isExpanded ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                )}
              </>
            )}
          </ListItemButton>
        </ListItem>
        
        {hasChildren && !sidebarCollapsed && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children.map((child: any) => renderNavigationItem(child, depth + 1))}
            </List>
          </Collapse>
        )}
      </Box>
    );
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {!sidebarCollapsed && (
          <Typography variant="h6" component="div" sx={{ fontWeight: 700, color: 'primary.main' }}>
            {t('common:appName', 'Calendly Clone')}
          </Typography>
        )}
        {!isMobile && (
          <IconButton onClick={handleSidebarToggle} size="small">
            {sidebarCollapsed ? <ChevronRight /> : <ChevronLeft />}
          </IconButton>
        )}
      </Box>
      
      <Divider />
      
      <List sx={{ flexGrow: 1, px: 1 }}>
        {navigationItems.map((item) => renderNavigationItem(item))}
      </List>
      
      <Divider />
      
      <List sx={{ px: 1, pb: 1 }}>
        <ListItem disablePadding>
          <ListItemButton
            component={Link}
            href="/settings"
            sx={{ borderRadius: 1 }}
          >
            <ListItemIcon sx={{ minWidth: sidebarCollapsed ? 'auto' : 40 }}>
              <Settings />
            </ListItemIcon>
            {!sidebarCollapsed && <ListItemText primary={t('navigation.settings')} />}
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          ml: { md: `${currentDrawerWidth}px` },
          width: { md: `calc(100% - ${currentDrawerWidth}px)` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleSidebarToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {user?.profile?.display_name || `${user?.first_name} ${user?.last_name}`}
          </Typography>

          {/* Language Switcher */}
          <LanguageSwitcher variant="icon" size="medium" />

          {/* Theme Toggle */}
          <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
            <IconButton color="inherit" onClick={toggleTheme}>
              {mode === 'light' ? <DarkMode /> : <LightMode />}
            </IconButton>
          </Tooltip>

          {/* Notifications */}
          <Tooltip title={t('accessibility.notifications')}>
            <IconButton color="inherit" onClick={handleNotificationMenuOpen}>
              <Badge badgeContent={unreadNotifications} color="error">
                <Notifications />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Profile Menu */}
          <Tooltip title="Account settings">
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls="primary-search-account-menu"
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <Avatar
                src={user?.profile?.profile_picture || undefined}
                alt={user?.first_name}
                sx={{ width: 32, height: 32 }}
              >
                {user?.first_name?.[0]}{user?.last_name?.[0]}
              </Avatar>
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 200,
            boxShadow: theme.shadows[8],
            '& .MuiMenuItem-root': {
              px: 2,
              py: 1,
              borderRadius: 1,
              mx: 1,
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.08),
              },
            },
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="subtitle2" fontWeight={600}>
            {user?.first_name} {user?.last_name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {user?.email}
          </Typography>
        </Box>
        
        <MenuItem onClick={() => { router.push('/profile'); handleProfileMenuClose(); }}>
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          {t('navigation.profile')}
        </MenuItem>
        
        <MenuItem onClick={() => { router.push('/settings'); handleProfileMenuClose(); }}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          {t('navigation.settings')}
        </MenuItem>
        
        <MenuItem onClick={() => { router.push('/settings/security'); handleProfileMenuClose(); }}>
          <ListItemIcon>
            <Security fontSize="small" />
          </ListItemIcon>
          Security
        </MenuItem>
        
        <MenuItem onClick={() => { router.push('/settings/billing'); handleProfileMenuClose(); }}>
          <ListItemIcon>
            <Business fontSize="small" />
          </ListItemIcon>
          Billing
        </MenuItem>
        
        <Divider />
        
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          {t('navigation.logout')}
        </MenuItem>
      </Menu>

      {/* Notification Menu */}
      <Menu
        anchorEl={notificationAnchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(notificationAnchorEl)}
        onClose={handleNotificationMenuClose}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 320,
            maxWidth: 400,
            maxHeight: 400,
            boxShadow: theme.shadows[8],
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="subtitle2" fontWeight={600}>
            Notifications
          </Typography>
          {unreadNotifications > 0 && (
            <Typography variant="caption" color="primary.main">
              {unreadNotifications} unread
            </Typography>
          )}
        </Box>
        
        {notifications.length === 0 ? (
          <MenuItem disabled>
            <Typography variant="body2" color="text.secondary">
              No notifications
            </Typography>
          </MenuItem>
        ) : (
          notifications.map((notification) => (
            <MenuItem
              key={notification.id}
              onClick={handleNotificationMenuClose}
              sx={{
                flexDirection: 'column',
                alignItems: 'flex-start',
                py: 1.5,
                borderBottom: 1,
                borderColor: 'divider',
                '&:last-child': {
                  borderBottom: 0,
                },
              }}
            >
              <Box display="flex" alignItems="center" gap={1} width="100%">
                <Circle
                  sx={{
                    fontSize: 8,
                    color: notification.read ? 'transparent' : 'primary.main',
                  }}
                />
                <Typography variant="subtitle2" fontWeight={500} flexGrow={1}>
                  {notification.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {notification.time}
                </Typography>
              </Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5, ml: 2 }}
              >
                {notification.message}
              </Typography>
            </MenuItem>
          ))
        )}
        
        <Box sx={{ p: 1 }}>
          <MenuItem
            onClick={() => { router.push('/notifications'); handleNotificationMenuClose(); }}
            sx={{ justifyContent: 'center', fontWeight: 500 }}
          >
            View All Notifications
          </MenuItem>
        </Box>
      </Menu>

      {/* Sidebar */}
      <Box
        component="nav"
        sx={{ width: { md: currentDrawerWidth }, flexShrink: { md: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={sidebarOpen}
          onClose={() => dispatch(toggleSidebar())}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: `1px solid ${theme.palette.divider}`,
            },
          }}
        >
          {drawer}
        </Drawer>
        
        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: currentDrawerWidth,
              borderRight: `1px solid ${theme.palette.divider}`,
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${currentDrawerWidth}px)` },
          minHeight: '100vh',
          backgroundColor: 'background.default',
        }}
      >
        <Toolbar /> {/* Spacer for fixed AppBar */}
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}