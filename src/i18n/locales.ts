export type Locale = 'en' | 'ru' | 'es' | 'pt' | 'de' | 'fr' | 'zh' | 'ja';

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  ru: 'Русский',
  es: 'Español (España)',
  pt: 'Português (Portugal)',
  de: 'Deutsch',
  fr: 'Français',
  zh: '中文 (普通话)',
  ja: '日本語',
};

export const LOCALE_FLAGS: Record<Locale, string> = {
  en: '🇬🇧',
  ru: '🇷🇺',
  es: '🇪🇸',
  pt: '🇵🇹',
  de: '🇩🇪',
  fr: '🇫🇷',
  zh: '🇨🇳',
  ja: '🇯🇵',
};

export function detectLocale(): Locale {
  if (typeof navigator === 'undefined') return 'en';
  const lang = navigator.language || navigator.languages?.[0] || 'en';
  const code = lang.split('-')[0].toLowerCase();
  if (code in LOCALE_LABELS) return code as Locale;
  return 'en';
}
