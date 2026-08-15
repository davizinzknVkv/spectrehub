import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import ptJSON from './locales/pt/translation.json';
import enJSON from './locales/en/translation.json';
import esJSON from './locales/es/translation.json';
import deJSON from './locales/de/translation.json';
import itJSON from './locales/it/translation.json';
import ruJSON from './locales/ru/translation.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      pt: { translation: ptJSON },
      en: { translation: enJSON },
      es: { translation: esJSON },
      de: { translation: deJSON },
      it: { translation: itJSON },
      ru: { translation: ruJSON }
    },
    lng: 'pt',
    fallbackLng: 'pt',
    supportedLngs: ['pt', 'en', 'es', 'de', 'it', 'ru'],
    nonExplicitSupportedLngs: true,
    interpolation: {
      escapeValue: false,
    },
    defaultNS: 'translation',
    nsSeparator: ':',
    keySeparator: '.',
    returnEmptyString: false,
    returnNull: false,
    returnObjects: true,
    joinArrays: ' ',
    react: {
      useSuspense: false,
      bindI18n: 'languageChanged loaded',
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    }
  });

export default i18n;
