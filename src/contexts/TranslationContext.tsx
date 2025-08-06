import React, { createContext, useContext } from 'react';
import { useLanguage, Language, languages } from '../hooks/useTranslation';
import { getTranslation } from '../translations';

// Translation Context Type
interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, any>) => string;
  languages: typeof languages;
}

// Create Translation Context
const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

// Translation Hook
export const useTranslation = (): TranslationContextType => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};

// Translation Provider Component
export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { language, setLanguage } = useLanguage();
  
  const t = (key: string, params?: Record<string, any>) => {
    return getTranslation(language, key, params);
  };

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t, languages }}>
      {children}
    </TranslationContext.Provider>
  );
};