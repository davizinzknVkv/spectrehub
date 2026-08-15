import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import ptTranslation from './locales/pt/translation.json';
import enTranslation from './locales/en/translation.json';
import esTranslation from './locales/es/translation.json';
import deTranslation from './locales/de/translation.json';
import itTranslation from './locales/it/translation.json';
import ruTranslation from './locales/ru/translation.json';

const resources: Record<string, any> = {
  pt: { translation: ptTranslation },
  en: { translation: enTranslation },
  es: { translation: esTranslation },
  de: { translation: deTranslation },
  it: { translation: itTranslation },
  ru: { translation: ruTranslation },
};

// Add aliases for common variations
resources['pt-BR'] = resources.pt;
resources['en-US'] = resources.en;
resources['en-GB'] = resources.en;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'pt', // Force default language to PT to see if it works
    fallbackLng: 'pt',
    keySeparator: '.',
    nsSeparator: ':',
    interpolation: {
      escapeValue: false
    },
    load: 'languageOnly',
    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage', 'cookie']
    },
    react: {
      useSuspense: false
    }
  });

export default i18n;
