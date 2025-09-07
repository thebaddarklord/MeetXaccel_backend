/** @type {import('next-i18next').UserConfig} */
module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es', 'fr', 'de', 'it', 'pt', 'ja', 'ko', 'zh'],
    localeDetection: true,
  },
  localePath: './public/locales',
  reloadOnPrerender: process.env.NODE_ENV === 'development',
  
  // Namespace configuration
  ns: ['common', 'auth', 'dashboard', 'events', 'availability', 'integrations', 'workflows', 'notifications', 'contacts'],
  defaultNS: 'common',
  
  // Fallback configuration
  fallbackLng: {
    'zh-CN': ['zh', 'en'],
    'zh-TW': ['zh', 'en'],
    'pt-BR': ['pt', 'en'],
    'es-ES': ['es', 'en'],
    'fr-FR': ['fr', 'en'],
    'de-DE': ['de', 'en'],
    'it-IT': ['it', 'en'],
    'ja-JP': ['ja', 'en'],
    'ko-KR': ['ko', 'en'],
    default: ['en'],
  },
  
  // Interpolation configuration
  interpolation: {
    escapeValue: false, // React already escapes values
  },
  
  // Development configuration
  debug: process.env.NODE_ENV === 'development',
  saveMissing: process.env.NODE_ENV === 'development',
  
  // Server-side configuration
  serverLanguageDetection: true,
  detection: {
    order: ['cookie', 'header', 'querystring', 'path', 'subdomain'],
    caches: ['cookie'],
    cookieMinutes: 60 * 24 * 30, // 30 days
  },
};