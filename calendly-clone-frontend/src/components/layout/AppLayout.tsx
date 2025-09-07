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
} from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';
import { useThemeMode } from '@/hooks/useThemeMode';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { toggleSidebar, toggleSidebarCollapsed } from '@/store/slices/uiSlice';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface AppLayoutProps {
  children: ReactNode;
}

const drawerWidth = 280;
const collapsedDrawerWidth = 64;

const navigationItems = [
  { label: 'Dashboard', icon: Dashboard, href: '/dashboard', permission: null },
  { label: 'Event Types', icon: Event, href: '/event-types', permission: 'can_create_events' },
  { label: 'Bookings', icon: Schedule, href: '/bookings', permission: 'can_manage_bookings' },
  { label: 'Availability', icon: Schedule, href: '/availability', permission: null },
  { label: 'Integrations', icon: Integration, href: '/integrations', permission: 'can_manage_integrations' },
  { label: 'Workflows', icon: Workflow, href: '/workflows', permission: null },
  { label: 'Contacts', icon: Contacts, href: '/contacts', permission: null },
  { label: 'Analytics', icon: Analytics, href: '/analytics', permission: 'can_view_reports' },
];

export function AppLayout({ children }: AppLayoutProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, logout, hasPermission } = useAuth();
  const { mode, toggleTheme } = useThemeMode();
  const dispatch = useDispatch();
  const router = useRouter();
  
  const { sidebarOpen, sidebarCollapsed } = useSelector((state: RootState) => state.ui);
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);

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

  const currentDrawerWidth = sidebarCollapsed && !isMobile ? collapsedDrawerWidth : drawerWidth;

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {!sidebarCollapsed && (
          <Typography variant="h6" component="div" sx={{ fontWeight: 700, color: 'primary.main' }}>
            Calendly Clone
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
        {navigationItems.map((item) => {
          // Check permissions
          if (item.permission && !hasPermission(item.permission)) {
            return null;
          }

          return (
            <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={Link}
                href={item.href}
                sx={{
                  borderRadius: 1,
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: sidebarCollapsed ? 'auto' : 40 }}>
                  <item.icon />
                </ListItemIcon>
                {!sidebarCollapsed && <ListItemText primary={item.label} />}
              </ListItemButton>
            </ListItem>
          );
        })}
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
            {!sidebarCollapsed && <ListItemText primary="Settings" />}
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

          {/* Theme Toggle */}
          <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
            <IconButton color="inherit" onClick={toggleTheme}>
              {mode === 'light' ? <DarkMode /> : <LightMode />}
            </IconButton>
          </Tooltip>

          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton color="inherit" onClick={handleNotificationMenuOpen}>
              <Badge badgeContent={0} color="error">
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
      >
        <MenuItem onClick={() => { router.push('/profile'); handleProfileMenuClose(); }}>
          <ListItemIcon>
            <AccountCircle fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={() => { router.push('/settings'); handleProfileMenuClose(); }}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
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
      >
        <MenuItem>
          <Typography variant="body2" color="text.secondary">
            No new notifications
          </Typography>
        </MenuItem>
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