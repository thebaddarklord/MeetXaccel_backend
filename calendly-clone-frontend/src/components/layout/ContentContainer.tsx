'use client';

import { ReactNode } from 'react';
import { Box, Container, Paper, useTheme } from '@mui/material';

interface ContentContainerProps {
  children: ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  padding?: 'none' | 'small' | 'medium' | 'large';
  elevation?: 'none' | 'low' | 'medium' | 'high';
  background?: 'default' | 'paper' | 'transparent';
  fullHeight?: boolean;
  centered?: boolean;
}

export function ContentContainer({
  children,
  maxWidth = 'lg',
  padding = 'medium',
  elevation = 'none',
  background = 'default',
  fullHeight = false,
  centered = false,
}: ContentContainerProps) {
  const theme = useTheme();

  const getPadding = () => {
    switch (padding) {
      case 'none':
        return 0;
      case 'small':
        return theme.spacing(2);
      case 'large':
        return theme.spacing(4);
      default:
        return theme.spacing(3);
    }
  };

  const getElevation = () => {
    switch (elevation) {
      case 'low':
        return 1;
      case 'medium':
        return 3;
      case 'high':
        return 8;
      default:
        return 0;
    }
  };

  const getBackgroundColor = () => {
    switch (background) {
      case 'paper':
        return theme.palette.background.paper;
      case 'transparent':
        return 'transparent';
      default:
        return theme.palette.background.default;
    }
  };

  const content = (
    <Box
      sx={{
        padding: getPadding(),
        backgroundColor: getBackgroundColor(),
        minHeight: fullHeight ? '100vh' : 'auto',
        display: centered ? 'flex' : 'block',
        alignItems: centered ? 'center' : 'stretch',
        justifyContent: centered ? 'center' : 'flex-start',
      }}
    >
      {children}
    </Box>
  );

  if (elevation !== 'none') {
    return (
      <Container maxWidth={maxWidth} disableGutters>
        <Paper elevation={getElevation()}>
          {content}
        </Paper>
      </Container>
    );
  }

  if (maxWidth === false) {
    return content;
  }

  return (
    <Container maxWidth={maxWidth} disableGutters>
      {content}
    </Container>
  );
}