import { useState } from 'react';
import { useTranslation } from '../context/LanguageContext';

const STORAGE_KEY = 'pension-planner-disclaimer-seen';

export function AISlopWarning() {
  const { t } = useTranslation();
  const [dismissed, setDismissed] = useState(() => {
    return typeof localStorage !== 'undefined'
      ? localStorage.getItem(STORAGE_KEY) === 'true'
      : false;
  });

  if (dismissed) return null;

  function handleDismiss() {
    setDismissed(true);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, 'true');
    }
  }

  return (
    <div className="bg-amber-50 border border-amber-300 rounded-lg p-3 mb-4 flex items-start gap-3">
      <span className="text-amber-500 text-lg flex-shrink-0">⚠</span>
      <p className="text-amber-800 text-sm flex-1">{t.slopWarning.text}</p>
      <button
        type="button"
        onClick={handleDismiss}
        className="flex-shrink-0 text-xs bg-amber-200 hover:bg-amber-300 text-amber-800 px-2 py-1 rounded font-medium"
      >
        {t.slopWarning.dismiss}
      </button>
    </div>
  );
}
