import { useRef } from 'react';
import { useTranslation } from '../context/LanguageContext';
import { parsePensioenoverzicht, type PensioenoverzichtData } from '../logic/parsePensioenoverzicht';

interface PensioenoverzichtUploadProps {
  data: PensioenoverzichtData | null;
  onData: (data: PensioenoverzichtData | null) => void;
  error: string | null;
  onError: (err: string | null) => void;
}

const fmt = (n: number) =>
  n.toLocaleString('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });

export function PensioenoverzichtUpload({ data, onData, error, onError }: PensioenoverzichtUploadProps) {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const json = JSON.parse(ev.target?.result as string);
        const parsed = parsePensioenoverzicht(json);
        if (parsed) {
          onData(parsed);
          onError(null);
        } else {
          onData(null);
          onError(t.pensioenoverzicht.error);
        }
      } catch {
        onData(null);
        onError(t.pensioenoverzicht.error);
      }
    };
    reader.readAsText(file);
    // Reset the input so the same file can be re-uploaded
    e.target.value = '';
  }

  function handleClear() {
    onData(null);
    onError(null);
  }

  return (
    <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs">
      <p className="font-semibold text-gray-700 mb-2">{t.pensioenoverzicht.title}</p>
      <p className="text-gray-500 mb-2">{t.pensioenoverzicht.localNote}</p>

      {!data && (
        <>
          <input
            ref={inputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleFile}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="w-full text-center py-2 px-3 border-2 border-dashed border-blue-300 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
          >
            {t.pensioenoverzicht.uploadButton}
          </button>
        </>
      )}

      {error && (
        <p className="mt-2 text-red-600 bg-red-50 p-2 rounded">{error}</p>
      )}

      {data && (
        <div className="mt-2 space-y-1">
          <div className="flex justify-between">
            <span className="text-gray-600">{t.pensioenoverzicht.successProviders}:</span>
            <span className="font-medium">{data.providers.join(', ') || '—'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">{t.pensioenoverzicht.successTotal}:</span>
            <span className="font-medium">{fmt(data.totalAccruedMonthly)}/mnd</span>
          </div>
          {data.aowAlleenstaand > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">{t.pensioenoverzicht.successAow}:</span>
              <span className="font-medium">{fmt(data.aowAlleenstaand)}/mnd</span>
            </div>
          )}
          <button
            type="button"
            onClick={handleClear}
            className="mt-2 text-red-500 hover:text-red-700 underline"
          >
            {t.pensioenoverzicht.clear}
          </button>
        </div>
      )}
    </div>
  );
}
