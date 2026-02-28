import { useState } from 'react'
import { useTranslation } from '../context/LanguageContext'

const STORAGE_KEY = 'pension-planner-disclaimer-seen'

export function AISlopWarning() {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(() => localStorage.getItem(STORAGE_KEY) !== 'true')

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, 'true')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="bg-amber-50 border-b-2 border-amber-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-amber-900">{t.warning.title}</p>
          <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">{t.warning.body}</p>
        </div>
        <button
          type="button"
          onClick={dismiss}
          className="flex-shrink-0 text-xs font-medium bg-amber-200 hover:bg-amber-300 text-amber-900 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
        >
          {t.warning.dismiss}
        </button>
      </div>
    </div>
  )
}
