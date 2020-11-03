import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

const currentLanguage = localStorage.getItem('i18nextLng');

if (currentLanguage === null) {
  localStorage.setItem('i18nextLng', 'en');
}

i18n
  .use(Backend) // load translation using http -> see /public/locales
  .use(LanguageDetector) // detect user language
  .use(initReactI18next) // pass the i18n instance to react-i18next.
  .init({ // init i18next
    fallbackLng: 'en',
    keySeparator: false, // we do not use keys in form messages.welcome
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  });

export default i18n;
