'use client';

import { Skeleton, Box, Card, CardContent, Stack } from '@mui/material';

interface SkeletonLoaderProps {
  variant?: 'text' | 'rectangular' | 'circular' | 'rounded';
  width?: number | string;
  height?: number | string;
  animation?: 'pulse' | 'wave' | false;
}

export function SkeletonLoader({ 
  variant = 'text', 
  width, 
  height, 
  animation = 'wave' 
}: SkeletonLoaderProps) {
  return (
    <Skeleton
      variant={variant}
      width={width}
      height={height}
      animation={animation}
    />
  );
}

// Skeleton variants for different content types
export function CardSkeleton() {
  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Skeleton variant="text" width="60%" height={24} />
          <Skeleton variant="text" width="100%" height={16} />
          <Skeleton variant="text" width="80%" height={16} />
          <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
            <Skeleton variant="rectangular" width={80} height={32} />
            <Skeleton variant="circular" width={24} height={24} />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

export function ListItemSkeleton() {
  return (
    <Box display="flex" alignItems="center" gap={2} py={1}>
      <Skeleton variant="circular" width={40} height={40} />
      <Box flexGrow={1}>
        <Skeleton variant="text" width="70%" height={20} />
        <Skeleton variant="text" width="50%" height={16} />
      </Box>
      <Skeleton variant="rectangular" width={60} height={24} />
    </Box>
  );
}

export function TableRowSkeleton({ columns = 4 }: { columns?: number }) {
  return (
    <Box display="flex" alignItems="center" gap={2} py={1}>
      {Array.from({ length: columns }).map((_, index) => (
        <Box key={index} flexGrow={1}>
          <Skeleton variant="text" width="80%" height={20} />
        </Box>
      ))}
    </Box>
  );
}

export function FormSkeleton() {
  return (
    <Stack spacing={3}>
      <Skeleton variant="text" width="40%" height={32} />
      <Stack spacing={2}>
        <Skeleton variant="rectangular" width="100%" height={56} />
        <Skeleton variant="rectangular" width="100%" height={56} />
        <Skeleton variant="rectangular" width="100%" height={120} />
      </Stack>
      <Box display="flex" gap={2} justifyContent="flex-end">
        <Skeleton variant="rectangular" width={80} height={36} />
        <Skeleton variant="rectangular" width={100} height={36} />
      </Box>
    </Stack>
  );
}

export function DashboardSkeleton() {
  return (
    <Stack spacing={4}>
      {/* Header */}
      <Box>
        <Skeleton variant="text" width="300px" height={40} />
        <Skeleton variant="text" width="500px" height={24} />
      </Box>
      
      {/* Stats Cards */}
      <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={3}>
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Skeleton variant="text" width={60} height={32} />
                  <Skeleton variant="text" width={120} height={20} />
                </Box>
                <Skeleton variant="circular" width={48} height={48} />
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
      
      {/* Content Grid */}
      <Box display="grid" gridTemplateColumns="2fr 1fr" gap={3}>
        <CardSkeleton />
        <CardSkeleton />
      </Box>
    </Stack>
  );
}

export function EventTypeSkeleton() {
  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Box display="flex" justifyContent="space-between" alignItems="start">
            <Box flexGrow={1}>
              <Skeleton variant="text" width="70%" height={24} />
              <Skeleton variant="text" width="100%" height={16} />
              <Skeleton variant="text" width="60%" height={16} />
            </Box>
            <Skeleton variant="rectangular" width={24} height={24} />
          </Box>
          
          <Box display="flex" gap={1}>
            <Skeleton variant="rectangular" width={60} height={24} />
            <Skeleton variant="rectangular" width={80} height={24} />
            <Skeleton variant="rectangular" width={70} height={24} />
          </Box>
          
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Skeleton variant="text" width="40%" height={16} />
            <Skeleton variant="rectangular" width={80} height={32} />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

export function BookingSkeleton() {
  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Box display="flex" alignItems="center" gap={2}>
            <Skeleton variant="circular" width={40} height={40} />
            <Box flexGrow={1}>
              <Skeleton variant="text" width="60%" height={20} />
              <Skeleton variant="text" width="40%" height={16} />
            </Box>
            <Skeleton variant="rectangular" width={80} height={24} />
          </Box>
          
          <Box display="flex" gap={2}>
            <Skeleton variant="rectangular" width={100} height={20} />
            <Skeleton variant="rectangular" width={120} height={20} />
          </Box>
          
          <Box display="flex" justifyContent="flex-end" gap={1}>
            <Skeleton variant="rectangular" width={60} height={32} />
            <Skeleton variant="rectangular" width={80} height={32} />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}