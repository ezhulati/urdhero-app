import { useState, useEffect, createContext, useContext } from 'react';

export type Language = 'sq' | 'en' | 'it' | 'de' | 'fr' | 'es';

export interface LanguageInfo {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
}

export const languages: LanguageInfo[] = [
  { code: 'sq', name: 'Albanian', nativeName: 'Shqip', flag: '🇦🇱' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' }
];

interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, any>) => string;
  languages: LanguageInfo[];
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'tani-selected-language';

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};

// Simple translation hook for components that don't need the full context
export const useLanguage = () => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (saved && languages.find(l => l.code === saved)) {
        return saved as Language;
      }
    } catch (error) {
      console.error('Error loading language from localStorage:', error);
    }
    return 'sq'; // Default to Albanian
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
      // Update document language attribute
      document.documentElement.lang = lang;
    } catch (error) {
      console.error('Error saving language to localStorage:', error);
    }
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return { language, setLanguage, languages };
};