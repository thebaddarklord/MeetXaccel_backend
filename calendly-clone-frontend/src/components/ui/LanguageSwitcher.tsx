'use client';

import { useState } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Box,
  Typography,
} from '@mui/material';
import { Language, Check } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'next-i18next';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
];

interface LanguageSwitcherProps {
  variant?: 'icon' | 'text' | 'full';
  size?: 'small' | 'medium' | 'large';
}

export function LanguageSwitcher({ variant = 'icon', size = 'medium' }: LanguageSwitcherProps) {
  const router = useRouter();
  const { i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = async (languageCode: string) => {
    try {
      // Change language using next-i18next
      await i18n.changeLanguage(languageCode);
      
      // Update URL to reflect language change
      const currentPath = window.location.pathname;
      const newPath = currentPath.replace(/^\/[a-z]{2}(\/|$)/, `/${languageCode}$1`);
      
      if (newPath !== currentPath) {
        router.push(newPath);
      }
      
      handleClose();
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  const renderTrigger = () => {
    switch (variant) {
      case 'text':
        return (
          <Box
            component="button"
            onClick={handleClick}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              p: 1,
              borderRadius: 1,
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            <Typography variant="body2">
              {currentLanguage.flag} {currentLanguage.nativeName}
            </Typography>
          </Box>
        );
      
      case 'full':
        return (
          <Box
            component="button"
            onClick={handleClick}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              border: 1,
              borderColor: 'divider',
              background: 'background.paper',
              cursor: 'pointer',
              p: 1.5,
              borderRadius: 1,
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            <Typography variant="body2">
              {currentLanguage.flag} {currentLanguage.name}
            </Typography>
          </Box>
        );
      
      default: // icon
        return (
          <Tooltip title="Change language">
            <IconButton onClick={handleClick} size={size}>
              <Language />
            </IconButton>
          </Tooltip>
        );
    }
  };

  return (
    <>
      {renderTrigger()}
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            minWidth: 200,
            maxHeight: 400,
          },
        }}
      >
        {languages.map((language) => (
          <MenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            selected={language.code === currentLanguage.code}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              {language.code === currentLanguage.code ? (
                <Check fontSize="small" />
              ) : (
                <Box sx={{ width: 20, textAlign: 'center' }}>
                  {language.flag}
                </Box>
              )}
            </ListItemIcon>
            <ListItemText>
              <Box>
                <Typography variant="body2" fontWeight={500}>
                  {language.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {language.nativeName}
                </Typography>
              </Box>
            </ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}