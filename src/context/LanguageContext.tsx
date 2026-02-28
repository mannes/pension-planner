import { createContext, useContext, useState, ReactNode } from 'react'
import { Language, Translations, translations } from '../i18n'

interface LanguageContextValue {
  lang: Language
  setLang: (l: Language) => void
  t: Translations
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'nl',
  setLang: () => {},
  t: translations.nl,
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const stored = localStorage.getItem('pension-lang') as Language | null
  const [lang, setLangState] = useState<Language>(stored ?? 'nl')

  function setLang(l: Language) {
    setLangState(l)
    localStorage.setItem('pension-lang', l)
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useTranslation = () => useContext(LanguageContext)
