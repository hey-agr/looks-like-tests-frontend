import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Locale } from './locales';
import { LOCALE_LABELS, LOCALE_FLAGS, detectLocale } from './locales';
import translations from './translations';

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

const STORAGE_KEY = 'app-locale';

function loadLocale(): Locale {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && stored in LOCALE_LABELS) return stored as Locale;
  } catch {}
  return detectLocale();
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(loadLocale);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try { localStorage.setItem(STORAGE_KEY, l); } catch {}
  }, []);

  const t = useCallback(
    (key: string): string => {
      const translation = translations[locale]?.[key] ?? translations.en?.[key];
      if (translation) return translation;
      
      // Fallback: return prettified key if it starts with 'tests.status.'
      if (key.startsWith('tests.status.')) {
        return key.split('.').pop()?.replace(/_/g, ' ') ?? key;
      }
      return key;
    },
    [locale],
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}

const locales: Locale[] = ['en', 'ru', 'es', 'pt', 'de', 'fr', 'zh', 'ja'];

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-gray-600 hover:bg-gray-100"
      >
        <span>{LOCALE_FLAGS[locale]}</span>
        <span className="hidden sm:inline">{LOCALE_LABELS[locale]}</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-20 mt-1 w-52 rounded-lg bg-white shadow-lg ring-1 ring-black/5">
            {locales.map((l) => (
              <button
                key={l}
                onClick={() => { setLocale(l); setOpen(false); }}
                className={`flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 ${locale === l ? 'bg-blue-50 font-medium text-blue-700' : 'text-gray-700'}`}
              >
                <span>{LOCALE_FLAGS[l]}</span>
                <span>{LOCALE_LABELS[l]}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
