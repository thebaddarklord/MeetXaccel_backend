'use client';

import { useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  LinearProgress,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from '@mui/material';
import {
  Event,
  Schedule,
  TrendingUp,
  People,
  CalendarToday,
  VideoCall,
  Email,
  MoreVert,
  Add,
} from '@mui/icons-material';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/hooks/useAuth';
import { useGetEventTypesQuery } from '@/store/api/eventsApi';
import { useGetBookingsQuery } from '@/store/api/eventsApi';
import { useGetBookingAnalyticsQuery } from '@/store/api/eventsApi';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import Link from 'next/link';
import { format, isToday, isTomorrow } from 'date-fns';

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: eventTypes, isLoading: eventTypesLoading } = useGetEventTypesQuery();
  const { data: bookingsData, isLoading: bookingsLoading } = useGetBookingsQuery({});
  const { data: analytics, isLoading: analyticsLoading } = useGetBookingAnalyticsQuery({ days: 30 });

  const upcomingBookings = bookingsData?.results?.filter(booking => 
    new Date(booking.start_time) > new Date() && booking.status === 'confirmed'
  ).slice(0, 5) || [];

  const todayBookings = bookingsData?.results?.filter(booking => 
    isToday(new Date(booking.start_time)) && booking.status === 'confirmed'
  ) || [];

  const formatBookingTime = (dateTime: string) => {
    const date = new Date(dateTime);
    if (isToday(date)) {
      return `Today at ${format(date, 'h:mm a')}`;
    } else if (isTomorrow(date)) {
      return `Tomorrow at ${format(date, 'h:mm a')}`;
    } else {
      return format(date, 'MMM d, h:mm a');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'cancelled': return 'error';
      case 'completed': return 'info';
      default: return 'default';
    }
  };

  if (eventTypesLoading || bookingsLoading || analyticsLoading) {
    return (
      <AppLayout>
        <LoadingSpinner fullScreen message="Loading dashboard..." />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Box>
        {/* Header */}
        <Box mb={4}>
          <Typography variant="h4" component="h1" gutterBottom fontWeight={700}>
            Welcome back, {user?.first_name}!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Here's what's happening with your schedule today.
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h4" fontWeight={700}>
                      {analytics?.total_bookings || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Bookings
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <Event />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h4" fontWeight={700}>
                      {todayBookings.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Today's Meetings
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'success.main' }}>
                    <CalendarToday />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h4" fontWeight={700}>
                      {eventTypes?.length || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Event Types
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'warning.main' }}>
                    <Schedule />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h4" fontWeight={700}>
                      {analytics?.confirmed_bookings || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Confirmed
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'info.main' }}>
                    <TrendingUp />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {/* Upcoming Bookings */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Typography variant="h6" fontWeight={600}>
                    Upcoming Bookings
                  </Typography>
                  <Button
                    component={Link}
                    href="/bookings"
                    variant="outlined"
                    size="small"
                  >
                    View All
                  </Button>
                </Box>

                {upcomingBookings.length === 0 ? (
                  <Box textAlign="center" py={4}>
                    <Typography variant="body2" color="text.secondary">
                      No upcoming bookings
                    </Typography>
                  </Box>
                ) : (
                  <List>
                    {upcomingBookings.map((booking, index) => (
                      <ListItem
                        key={booking.id}
                        divider={index < upcomingBookings.length - 1}
                      >
                        <ListItemAvatar>
                          <Avatar>
                            {booking.invitee_name.charAt(0).toUpperCase()}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box display="flex" alignItems="center" gap={1}>
                              <Typography variant="subtitle2">
                                {booking.event_type.name}
                              </Typography>
                              <Chip
                                label={booking.status}
                                size="small"
                                color={getStatusColor(booking.status) as any}
                              />
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                {booking.invitee_name} • {formatBookingTime(booking.start_time)}
                              </Typography>
                              {booking.meeting_link && (
                                <Box display="flex" alignItems="center" gap={0.5} mt={0.5}>
                                  <VideoCall fontSize="small" color="action" />
                                  <Typography variant="caption" color="text.secondary">
                                    Video call
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                          }
                        />
                        <ListItemSecondaryAction>
                          <IconButton edge="end">
                            <MoreVert />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Quick Actions & Event Types */}
          <Grid item xs={12} md={4}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} mb={2}>
                  Quick Actions
                </Typography>
                <Box display="flex" flexDirection="column" gap={1}>
                  <Button
                    component={Link}
                    href="/event-types/create"
                    variant="contained"
                    startIcon={<Add />}
                    fullWidth
                  >
                    Create Event Type
                  </Button>
                  <Button
                    component={Link}
                    href="/availability"
                    variant="outlined"
                    startIcon={<Schedule />}
                    fullWidth
                  >
                    Set Availability
                  </Button>
                  <Button
                    component={Link}
                    href="/integrations"
                    variant="outlined"
                    startIcon={<VideoCall />}
                    fullWidth
                  >
                    Connect Calendar
                  </Button>
                </Box>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Typography variant="h6" fontWeight={600}>
                    Event Types
                  </Typography>
                  <Button
                    component={Link}
                    href="/event-types"
                    variant="text"
                    size="small"
                  >
                    Manage
                  </Button>
                </Box>

                {eventTypes && eventTypes.length > 0 ? (
                  <List dense>
                    {eventTypes.slice(0, 4).map((eventType) => (
                      <ListItem key={eventType.id} disablePadding>
                        <ListItemButton component={Link} href={`/event-types/${eventType.id}`}>
                          <ListItemText
                            primary={eventType.name}
                            secondary={`${eventType.duration} min • ${eventType.location_type}`}
                          />
                          <Chip
                            label={eventType.is_active ? 'Active' : 'Inactive'}
                            size="small"
                            color={eventType.is_active ? 'success' : 'default'}
                          />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Box textAlign="center" py={2}>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                      No event types yet
                    </Typography>
                    <Button
                      component={Link}
                      href="/event-types/create"
                      variant="contained"
                      size="small"
                      startIcon={<Add />}
                    >
                      Create Your First Event Type
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </AppLayout>
  );
}