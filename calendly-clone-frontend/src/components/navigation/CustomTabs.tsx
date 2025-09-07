'use client';

import { ReactNode, useState, useEffect } from 'react';
import {
  Tabs,
  Tab,
  Box,
  Badge,
  Chip,
  useTheme,
  alpha,
} from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';

interface TabItem {
  id: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
  badge?: {
    count: number;
    color?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
    showZero?: boolean;
  };
  chip?: {
    label: string;
    color?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  };
}

interface CustomTabsProps {
  tabs: TabItem[];
  value?: string;
  onChange?: (value: string) => void;
  variant?: 'standard' | 'scrollable' | 'fullWidth';
  orientation?: 'horizontal' | 'vertical';
  centered?: boolean;
  indicatorColor?: 'primary' | 'secondary';
  textColor?: 'primary' | 'secondary' | 'inherit';
  size?: 'small' | 'medium' | 'large';
  urlSync?: boolean; // Sync with URL search params
  urlParam?: string; // URL parameter name for syncing
}

export function CustomTabs({
  tabs,
  value,
  onChange,
  variant = 'standard',
  orientation = 'horizontal',
  centered = false,
  indicatorColor = 'primary',
  textColor = 'primary',
  size = 'medium',
  urlSync = false,
  urlParam = 'tab',
}: CustomTabsProps) {
  const theme = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get initial value from URL if urlSync is enabled
  const getInitialValue = () => {
    if (urlSync && searchParams.get(urlParam)) {
      return searchParams.get(urlParam) || tabs[0]?.id;
    }
    return value || tabs[0]?.id;
  };

  const [currentValue, setCurrentValue] = useState(getInitialValue);

  useEffect(() => {
    if (value !== undefined) {
      setCurrentValue(value);
    }
  }, [value]);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setCurrentValue(newValue);
    
    if (onChange) {
      onChange(newValue);
    }
    
    if (urlSync) {
      const params = new URLSearchParams(searchParams.toString());
      params.set(urlParam, newValue);
      router.push(`?${params.toString()}`, { scroll: false });
    }
  };

  const getTabHeight = () => {
    switch (size) {
      case 'small':
        return 40;
      case 'large':
        return 56;
      default:
        return 48;
    }
  };

  return (
    <Box
      sx={{
        borderBottom: orientation === 'horizontal' ? 1 : 0,
        borderRight: orientation === 'vertical' ? 1 : 0,
        borderColor: 'divider',
        backgroundColor: alpha(theme.palette.background.paper, 0.8),
        backdropFilter: 'blur(8px)',
      }}
    >
      <Tabs
        value={currentValue}
        onChange={handleChange}
        variant={variant}
        orientation={orientation}
        centered={centered}
        indicatorColor={indicatorColor}
        textColor={textColor}
        sx={{
          minHeight: orientation === 'horizontal' ? getTabHeight() : 'auto',
          '& .MuiTab-root': {
            minHeight: getTabHeight(),
            fontSize: size === 'small' ? '0.875rem' : size === 'large' ? '1rem' : '0.9375rem',
            fontWeight: 500,
            textTransform: 'none',
            transition: theme.transitions.create(['color', 'background-color'], {
              duration: theme.transitions.duration.short,
            }),
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.04),
              color: theme.palette.primary.main,
            },
            '&.Mui-selected': {
              fontWeight: 600,
            },
          },
          '& .MuiTabs-indicator': {
            height: 3,
            borderRadius: '3px 3px 0 0',
          },
        }}
      >
        {tabs.map((tab) => {
          let tabLabel: ReactNode = (
            <Box display="flex" alignItems="center" gap={1}>
              {tab.icon}
              <span>{tab.label}</span>
              {tab.chip && (
                <Chip
                  label={tab.chip.label}
                  size="small"
                  color={tab.chip.color}
                  sx={{
                    height: 20,
                    fontSize: '0.75rem',
                    fontWeight: 500,
                  }}
                />
              )}
            </Box>
          );

          if (tab.badge) {
            tabLabel = (
              <Badge
                badgeContent={tab.badge.count}
                color={tab.badge.color}
                showZero={tab.badge.showZero}
                sx={{
                  '& .MuiBadge-badge': {
                    fontSize: '0.75rem',
                    fontWeight: 600,
                  },
                }}
              >
                {tabLabel}
              </Badge>
            );
          }

          return (
            <Tab
              key={tab.id}
              value={tab.id}
              label={tabLabel}
              disabled={tab.disabled}
              sx={{
                opacity: tab.disabled ? 0.5 : 1,
              }}
            />
          );
        })}
      </Tabs>
    </Box>
  );
}

// Tab Panel component for content
interface TabPanelProps {
  children?: ReactNode;
  value: string;
  currentValue: string;
  padding?: 'none' | 'small' | 'medium' | 'large';
  keepMounted?: boolean;
}

export function TabPanel({
  children,
  value,
  currentValue,
  padding = 'medium',
  keepMounted = false,
}: TabPanelProps) {
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

  const isActive = value === currentValue;

  if (!isActive && !keepMounted) {
    return null;
  }

  return (
    <Box
      role="tabpanel"
      hidden={!isActive}
      id={`tabpanel-${value}`}
      aria-labelledby={`tab-${value}`}
      sx={{
        padding: getPadding(),
        display: isActive ? 'block' : 'none',
      }}
    >
      {children}
    </Box>
  );
}