import React, { createContext, useContext, useState } from 'react';
import { type Lang, type Translations, getTranslations } from '../i18n';

interface LanguageContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'nl',
  setLang: () => {},
  t: getTranslations('nl'),
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const stored = (typeof localStorage !== 'undefined'
    ? localStorage.getItem('pension-lang')
    : null) as Lang | null;
  const [lang, setLangState] = useState<Lang>(stored ?? 'nl');

  function setLang(l: Lang) {
    setLangState(l);
    localStorage.setItem('pension-lang', l);
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: getTranslations(lang) }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  return useContext(LanguageContext);
}
