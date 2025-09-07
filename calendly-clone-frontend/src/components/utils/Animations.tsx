'use client';

import { ReactNode, forwardRef } from 'react';
import { Box, Fade, Slide, Grow, Zoom, Collapse } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { transitions } from '@/lib/theme/tokens';

// Animation wrapper components using MUI transitions

interface AnimationProps {
  children: ReactNode;
  in?: boolean;
  timeout?: number;
  delay?: number;
  unmountOnExit?: boolean;
}

// Fade In Animation
export const FadeIn = forwardRef<HTMLDivElement, AnimationProps>(
  ({ children, in: inProp = true, timeout = 300, delay = 0, unmountOnExit = false }, ref) => (
    <Fade
      in={inProp}
      timeout={timeout}
      style={{ transitionDelay: `${delay}ms` }}
      unmountOnExit={unmountOnExit}
      ref={ref}
    >
      <Box>{children}</Box>
    </Fade>
  )
);
FadeIn.displayName = 'FadeIn';

// Slide In Animation
interface SlideInProps extends AnimationProps {
  direction?: 'up' | 'down' | 'left' | 'right';
}

export const SlideIn = forwardRef<HTMLDivElement, SlideInProps>(
  ({ children, direction = 'up', in: inProp = true, timeout = 300, delay = 0, unmountOnExit = false }, ref) => (
    <Slide
      direction={direction}
      in={inProp}
      timeout={timeout}
      style={{ transitionDelay: `${delay}ms` }}
      unmountOnExit={unmountOnExit}
      ref={ref}
    >
      <Box>{children}</Box>
    </Slide>
  )
);
SlideIn.displayName = 'SlideIn';

// Grow Animation
export const GrowIn = forwardRef<HTMLDivElement, AnimationProps>(
  ({ children, in: inProp = true, timeout = 300, delay = 0, unmountOnExit = false }, ref) => (
    <Grow
      in={inProp}
      timeout={timeout}
      style={{ transitionDelay: `${delay}ms` }}
      unmountOnExit={unmountOnExit}
      ref={ref}
    >
      <Box>{children}</Box>
    </Grow>
  )
);
GrowIn.displayName = 'GrowIn';

// Zoom Animation
export const ZoomIn = forwardRef<HTMLDivElement, AnimationProps>(
  ({ children, in: inProp = true, timeout = 300, delay = 0, unmountOnExit = false }, ref) => (
    <Zoom
      in={inProp}
      timeout={timeout}
      style={{ transitionDelay: `${delay}ms` }}
      unmountOnExit={unmountOnExit}
      ref={ref}
    >
      <Box>{children}</Box>
    </Zoom>
  )
);
ZoomIn.displayName = 'ZoomIn';

// Collapse Animation
export const CollapseIn = forwardRef<HTMLDivElement, AnimationProps>(
  ({ children, in: inProp = true, timeout = 300, delay = 0, unmountOnExit = false }, ref) => (
    <Collapse
      in={inProp}
      timeout={timeout}
      style={{ transitionDelay: `${delay}ms` }}
      unmountOnExit={unmountOnExit}
      ref={ref}
    >
      <Box>{children}</Box>
    </Collapse>
  )
);
CollapseIn.displayName = 'CollapseIn';

// Staggered Animation Container
interface StaggeredAnimationProps {
  children: ReactNode[];
  staggerDelay?: number;
  animation?: 'fade' | 'slide' | 'grow' | 'zoom';
  direction?: 'up' | 'down' | 'left' | 'right';
  in?: boolean;
}

export function StaggeredAnimation({
  children,
  staggerDelay = 100,
  animation = 'fade',
  direction = 'up',
  in: inProp = true,
}: StaggeredAnimationProps) {
  const AnimationComponent = {
    fade: FadeIn,
    slide: SlideIn,
    grow: GrowIn,
    zoom: ZoomIn,
  }[animation];

  return (
    <>
      {children.map((child, index) => (
        <AnimationComponent
          key={index}
          in={inProp}
          delay={index * staggerDelay}
          direction={animation === 'slide' ? direction : undefined}
        >
          {child}
        </AnimationComponent>
      ))}
    </>
  );
}

// Page Transition Wrapper
interface PageTransitionProps {
  children: ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
}

export function PageTransition({ children, direction = 'up' }: PageTransitionProps) {
  return (
    <SlideIn direction={direction} timeout={400}>
      <FadeIn timeout={400}>
        {children}
      </FadeIn>
    </SlideIn>
  );
}

// Hover Animation Hook
export function useHoverAnimation() {
  const hoverStyles = {
    transition: `all ${transitions.duration.fast} ${transitions.easing.easeInOut}`,
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    },
  };

  return hoverStyles;
}

// Loading Animation
interface LoadingAnimationProps {
  size?: number;
  color?: string;
}

export function LoadingAnimation({ size = 40, color = 'primary' }: LoadingAnimationProps) {
  return (
    <Box
      sx={{
        display: 'inline-block',
        width: size,
        height: size,
        border: `3px solid`,
        borderColor: `${color}.light`,
        borderTopColor: `${color}.main`,
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        '@keyframes spin': {
          '0%': {
            transform: 'rotate(0deg)',
          },
          '100%': {
            transform: 'rotate(360deg)',
          },
        },
      }}
    />
  );
}

// Pulse Animation
export function PulseAnimation({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        '@keyframes pulse': {
          '0%, 100%': {
            opacity: 1,
          },
          '50%': {
            opacity: 0.5,
          },
        },
      }}
    >
      {children}
    </Box>
  );
}

// Bounce Animation
export function BounceAnimation({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        animation: 'bounce 1s infinite',
        '@keyframes bounce': {
          '0%, 20%, 53%, 80%, 100%': {
            animationTimingFunction: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
            transform: 'translate3d(0, 0, 0)',
          },
          '40%, 43%': {
            animationTimingFunction: 'cubic-bezier(0.755, 0.05, 0.855, 0.06)',
            transform: 'translate3d(0, -30px, 0)',
          },
          '70%': {
            animationTimingFunction: 'cubic-bezier(0.755, 0.05, 0.855, 0.06)',
            transform: 'translate3d(0, -15px, 0)',
          },
          '90%': {
            transform: 'translate3d(0, -4px, 0)',
          },
        },
      }}
    >
      {children}
    </Box>
  );
}