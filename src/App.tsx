import { useState, useMemo } from 'react'
import { DEFAULT_PARAMS, SimParams } from './types'
import { runSimulation } from './logic/simulation'
import { LanguageProvider, useTranslation } from './context/LanguageContext'
import { InputPanel } from './components/InputPanel'
import { TaxLeveragePanel } from './components/TaxLeveragePanel'
import { CapitalChart } from './components/CapitalChart'
import { ContributionBreakdown } from './components/ContributionBreakdown'
import { SummaryTable } from './components/SummaryTable'
import { AISlopWarning } from './components/AISlopWarning'
import { FirstTimeGuide, shouldShowGuide } from './components/FirstTimeGuide'
import { IncomeComparisonPanel } from './components/IncomeComparisonPanel'
import { AboutModal } from './components/AboutModal'

function AppInner() {
  const { t, lang, setLang } = useTranslation()
  const [params, setParams] = useState<SimParams>(DEFAULT_PARAMS)
  const [realMode, setRealMode] = useState(false)
  const [showGuide, setShowGuide] = useState(shouldShowGuide)
  const [showAbout, setShowAbout] = useState(false)

  const results = useMemo(() => runSimulation(params), [params])
  const year1 = results[0]
  const hasThirdPillar = params.extraSavingsMonthly > 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Dismissable AI slop warning */}
      <AISlopWarning />

      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">{t.header.title}</h1>
              <p className="text-sm text-gray-500 mt-0.5">{t.header.tagline}</p>
            </div>

            {/* Controls row */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Language toggle */}
              <div className="flex items-center bg-gray-100 rounded-full p-0.5">
                {(['nl', 'en'] as const).map(l => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setLang(l)}
                    className={`px-3 py-1 text-xs font-semibold rounded-full transition-all ${
                      lang === l
                        ? 'bg-white text-blue-700 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {l === 'nl' ? '🇳🇱 NL' : '🇬🇧 EN'}
                  </button>
                ))}
              </div>

              {/* GitHub link */}
              <a
                href="https://github.com/mannes/pension-planner"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="GitHub repository"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.579.688.481C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                </svg>
              </a>

              {/* About button */}
              <button
                type="button"
                onClick={() => setShowAbout(true)}
                className="text-xs text-gray-500 hover:text-gray-700 border border-gray-200 hover:border-gray-400 px-3 py-1.5 rounded-full transition-colors"
              >
                {lang === 'nl' ? 'ℹ️ Over' : 'ℹ️ About'}
              </button>

              {/* Guided tour button */}
              <button
                type="button"
                onClick={() => setShowGuide(true)}
                className="text-xs text-blue-600 hover:text-blue-800 border border-blue-200 hover:border-blue-400 px-3 py-1.5 rounded-full transition-colors"
              >
                🗺️ {t.header.guideButton}
              </button>

              {/* Nominal / Real toggle */}
              <div data-guide-step="real-toggle" className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1.5">
                <span className={`text-xs font-medium ${!realMode ? 'text-blue-700' : 'text-gray-400'}`}>
                  {t.header.nominal}
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={realMode}
                  onClick={() => setRealMode(v => !v)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    realMode ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
                    realMode ? 'translate-x-4' : 'translate-x-1'
                  }`} />
                </button>
                <span className={`text-xs font-medium ${realMode ? 'text-blue-700' : 'text-gray-400'}`}>
                  {t.header.real}
                </span>
              </div>
            </div>
          </div>

          {/* Mission statement */}
          <div className="mt-3 p-3 bg-blue-50 rounded-xl border border-blue-100 text-sm text-blue-800">
            <strong>{lang === 'nl' ? 'Waarom deze tool?' : 'Why this tool?'}</strong>{' '}
            {t.header.whyTool}
          </div>
        </div>
      </header>

      {/* Main layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Left sidebar: inputs */}
          <div className="lg:w-72 xl:w-80 flex-shrink-0">
            <div className="lg:sticky lg:top-6">
              <InputPanel params={params} onChange={setParams} />
            </div>
          </div>

          {/* Right: result panels — summary first (most prominent) */}
          <div className="flex-1 min-w-0 space-y-6">
            {/* 1. RESULTS */}
            <SummaryTable
              results={results}
              realMode={realMode}
              inflationRate={params.inflationRate}
              hasThirdPillar={hasThirdPillar}
            />

            {/* 2. Income comparison */}
            <IncomeComparisonPanel
              results={results}
              params={params}
              realMode={realMode}
            />

            {/* 3. Tax leverage breakdown */}
            {year1 && <TaxLeveragePanel result={year1} realMode={realMode} />}

            {/* 4. Capital chart */}
            <CapitalChart
              results={results}
              realMode={realMode}
              inflationRate={params.inflationRate}
            />

            {/* 5. Annual breakdown */}
            <ContributionBreakdown
              results={results}
              realMode={realMode}
              inflationRate={params.inflationRate}
            />
          </div>
        </div>
      </main>

      <footer className="mt-8 border-t border-gray-200 bg-white py-4 text-center text-xs text-gray-400">
        {t.footer}
      </footer>

      {/* First-time guide modal */}
      {showGuide && <FirstTimeGuide onClose={() => setShowGuide(false)} />}

      {/* About modal */}
      {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
    </div>
  )
}

export default function App() {
  return (
    <LanguageProvider>
      <AppInner />
    </LanguageProvider>
  )
}
