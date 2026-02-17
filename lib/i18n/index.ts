import { en } from './translations/en';
import { pt } from './translations/pt';

export type Language = 'en' | 'pt';
export type TranslationKey = keyof typeof en;

const translations = {
  en,
  pt,
};

/**
 * Detect user's language from browser/system settings
 */
export function detectLanguage(): Language {
  if (typeof window === 'undefined') return 'en';

  try {
    // Check localStorage first (user preference)
    const savedLang = localStorage.getItem('app_language');
    if (savedLang === 'en' || savedLang === 'pt') {
      return savedLang;
    }

    // Detect from browser language
    const browserLang = navigator.language || (navigator as any).userLanguage || 'en';
    
    // Check if Portuguese (pt, pt-BR, pt-PT, etc.)
    if (browserLang.toLowerCase().startsWith('pt')) {
      return 'pt';
    }
    
    // Default to English
    return 'en';
  } catch (error) {
    console.warn('Error detecting language:', error);
    return 'en';
  }
}

/**
 * Get translation for a key
 */
export function getTranslation(lang: Language, key: string): string {
  const keys = key.split('.');
  let value: any = translations[lang];
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      // Fallback to English if key not found
      value = translations.en;
      for (const k2 of keys) {
        if (value && typeof value === 'object' && k2 in value) {
          value = value[k2];
        } else {
          return key; // Return key if translation not found
        }
      }
      break;
    }
  }
  
  return typeof value === 'string' ? value : key;
}

/**
 * Set user's language preference
 */
export function setLanguage(lang: Language): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('app_language', lang);
  }
}

/**
 * Get all translations for a language
 */
export function getTranslations(lang: Language) {
  return translations[lang];
}
