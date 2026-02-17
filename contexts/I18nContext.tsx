"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, detectLanguage, getTranslation, setLanguage as saveLanguage } from '@/lib/i18n';

interface I18nContextType {
  language: Language;
  t: (key: string) => string;
  setLanguage: (lang: Language) => void;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Detect language on mount
    const detected = detectLanguage();
    setLanguageState(detected);
    setMounted(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    saveLanguage(lang);
    // Update HTML lang attribute
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
  };

  const t = (key: string): string => {
    return getTranslation(language, key);
  };

  // Update HTML lang attribute when language changes
  useEffect(() => {
    if (mounted && typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language, mounted]);

  return (
    <I18nContext.Provider value={{ language, t, setLanguage }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
