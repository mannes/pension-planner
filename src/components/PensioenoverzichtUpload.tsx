import { useRef, useState } from 'react'
import { PensioenoverzichtData } from '../types'
import { parsePensioenoverzicht } from '../logic/parsePensioenoverzicht'
import { useTranslation } from '../context/LanguageContext'

const euro = (v: number) =>
  v.toLocaleString('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })

interface Props {
  data: PensioenoverzichtData | null
  onData: (data: PensioenoverzichtData | null) => void
  aowPartnerStatus: 'single' | 'partner'
}

export function PensioenoverzichtUpload({ data, onData, aowPartnerStatus }: Props) {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)

  function handleFile(file: File) {
    setError(null)
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string)
        const parsed = parsePensioenoverzicht(json)
        if (!parsed) {
          setError(t.pensioenoverzicht.errorInvalid)
          return
        }
        onData(parsed)
      } catch {
        setError(t.pensioenoverzicht.errorInvalid)
      }
    }
    reader.readAsText(file)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    // Reset input so the same file can be re-uploaded
    e.target.value = ''
  }

  function handleClear() {
    onData(null)
    setError(null)
  }

  return (
    <div className="border-t border-gray-200 pt-4 mt-2">
      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
        {t.pensioenoverzicht.sectionTitle}
      </div>

      {!data ? (
        <div>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="w-full text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg px-3 py-2.5 text-left transition-colors"
          >
            📂 {t.pensioenoverzicht.uploadButton}
          </button>
          <div className="flex items-start gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-2.5 py-2 mt-1.5 leading-snug">
            <span className="mt-px shrink-0">🔒</span>
            <span>{t.pensioenoverzicht.uploadNote}</span>
          </div>
          {error && (
            <p className="text-xs text-red-600 mt-1.5 bg-red-50 rounded p-2">{error}</p>
          )}
          <input
            ref={inputRef}
            type="file"
            accept=".json,application/json"
            className="hidden"
            onChange={handleChange}
          />
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-green-800">
              ✓ {t.pensioenoverzicht.standPer} {data.standPer}
            </span>
            <button
              type="button"
              onClick={handleClear}
              className="text-xs text-gray-400 hover:text-red-500 transition-colors"
            >
              {t.pensioenoverzicht.clearButton}
            </button>
          </div>

          {/* Provider list */}
          <div className="space-y-1">
            {data.providers.map((p) => (
              <div key={p.name} className="flex justify-between text-xs">
                <span className="text-gray-600 truncate mr-2" title={p.name}>
                  {p.name}
                </span>
                <span className="font-mono text-gray-800 shrink-0">
                  {euro(p.opgebouwdAnnual / 12)}{t.pensioenoverzicht.perMonth}
                </span>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="border-t border-green-200 pt-2 flex justify-between text-xs font-semibold text-green-900">
            <span>{t.pensioenoverzicht.totalAccrued}</span>
            <span className="font-mono">
              {euro(data.alreadyAccruedAnnual / 12)}{t.pensioenoverzicht.perMonth}
            </span>
          </div>

          {/* AOW info */}
          {(() => {
            const aowAnnual = aowPartnerStatus === 'partner'
              ? (data.aowTeBereikenSamenwonend ?? data.aowTeBereikenAlleenstaand)
              : data.aowTeBereikenAlleenstaand
            const label = aowPartnerStatus === 'partner'
              ? t.pensioenoverzicht.aowProjectionPartner
              : t.pensioenoverzicht.aowProjectionSingle
            return aowAnnual ? (
              <div className="text-xs text-blue-700 bg-blue-50 rounded p-2 mt-1 leading-snug">
                {label}:{' '}
                <span className="font-mono font-semibold">
                  {euro(aowAnnual / 12)}{t.pensioenoverzicht.perMonth}
                </span>
              </div>
            ) : null
          })()}
        </div>
      )}
    </div>
  )
}
