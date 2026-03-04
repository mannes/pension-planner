import { useState, useEffect, useCallback } from 'react';
import { LanguageProvider, useTranslation } from './context/LanguageContext';
import { InputPanel } from './components/InputPanel';
import { CapitalChart } from './components/CapitalChart';
import { ContributionBreakdown } from './components/ContributionBreakdown';
import { SummaryTable } from './components/SummaryTable';
import { TaxLeveragePanel } from './components/TaxLeveragePanel';
import { IncomeComparisonPanel } from './components/IncomeComparisonPanel';
import { GlossaryPanel } from './components/GlossaryPanel';
import { AnnuityChart } from './components/AnnuityChart';
import { AISlopWarning } from './components/AISlopWarning';
import { FirstTimeGuide, useStartGuide } from './components/FirstTimeGuide';
import { runSimulation } from './logic/simulation';
import { DEFAULT_PARAMS, type SimParams } from './types';
import type { PensioenoverzichtData } from './logic/parsePensioenoverzicht';

const STORAGE_KEY = 'pension-planner-params';
const FILE_STORAGE_KEY = 'pension-planner-file';

function loadParams(): SimParams {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return { ...DEFAULT_PARAMS, ...JSON.parse(raw) };
    }
  } catch {
    // ignore
  }
  return DEFAULT_PARAMS;
}

function loadFile(): PensioenoverzichtData | null {
  try {
    const raw = localStorage.getItem(FILE_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return null;
}

function AppInner() {
  const { t, lang, setLang } = useTranslation();
  const [params, setParams] = useState<SimParams>(loadParams);
  const [persist, setPersist] = useState(() => !!localStorage.getItem(STORAGE_KEY));
  const [showReal, setShowReal] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<'bad' | 'normal' | 'good'>('normal');
  const [pensioenoverzicht, setPensioenoverzicht] = useState<PensioenoverzichtData | null>(
    () => (localStorage.getItem(STORAGE_KEY) ? loadFile() : null)
  );
  const startGuide = useStartGuide();

  const results = runSimulation(params);

  const handleParamsChange = useCallback((p: SimParams) => {
    let finalParams = p;
    // If partner status changed and we have a file, sync aowMonthly from the file
    if (pensioenoverzicht && p.aowPartnerStatus !== params.aowPartnerStatus) {
      const aow = p.aowPartnerStatus === 'partner' && pensioenoverzicht.aowSamenwonend != null
        ? pensioenoverzicht.aowSamenwonend
        : pensioenoverzicht.aowAlleenstaand;
      if (aow > 0) finalParams = { ...p, aowMonthly: Math.round(aow) };
    }
    setParams(finalParams);
    if (persist) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(finalParams));
    }
  }, [persist, pensioenoverzicht, params.aowPartnerStatus]);

  const handlePensioenoverzichtData = useCallback((data: PensioenoverzichtData | null) => {
    setPensioenoverzicht(data);
    if (persist) {
      if (data) localStorage.setItem(FILE_STORAGE_KEY, JSON.stringify(data));
      else localStorage.removeItem(FILE_STORAGE_KEY);
    }
    if (data) {
      const aow = params.aowPartnerStatus === 'partner' && data.aowSamenwonend != null
        ? data.aowSamenwonend
        : data.aowAlleenstaand;
      if (aow > 0) {
        const newParams = { ...params, aowMonthly: Math.round(aow) };
        setParams(newParams);
        if (persist) localStorage.setItem(STORAGE_KEY, JSON.stringify(newParams));
      }
    }
  }, [params, persist]);

  const handlePersistChange = useCallback((v: boolean) => {
    setPersist(v);
    if (v) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(params));
      if (pensioenoverzicht) localStorage.setItem(FILE_STORAGE_KEY, JSON.stringify(pensioenoverzicht));
    } else {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(FILE_STORAGE_KEY);
    }
  }, [params, pensioenoverzicht]);

  // Keep params in sync with persist flag
  useEffect(() => {
    if (persist) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(params));
    }
  }, [params, persist]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
              <span className="text-base leading-none">📊</span>
            </div>
            <div className="min-w-0">
              <h1 className="text-sm font-bold text-gray-900 leading-tight truncate">{t.header.title}</h1>
              <p className="text-xs text-gray-400 hidden sm:block leading-tight">{t.header.subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Real/Nominal toggle */}
            <button
              type="button"
              data-guide-step="real-toggle"
              onClick={() => setShowReal((v) => !v)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-xs text-gray-500 hidden sm:inline">{t.realToggle}</span>
              <span className="text-xs text-gray-500 sm:hidden">{showReal ? t.real : t.nominal}</span>
              <div className={`relative w-7 h-4 rounded-full transition-colors duration-200 ${showReal ? 'bg-purple-500' : 'bg-gray-300'}`}>
                <span className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white shadow transition-transform duration-200 ${showReal ? 'translate-x-3' : 'translate-x-0'}`} />
              </div>
            </button>

            {/* Guided tour button */}
            <button
              type="button"
              onClick={startGuide}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-100 transition-colors"
            >
              {t.header.guidedTour}
            </button>

            {/* Language switcher */}
            <div className="flex rounded-lg overflow-hidden border border-gray-200">
              {([['nl', '🇳🇱'], ['en', '🇬🇧']] as const).map(([l, flag]) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLang(l)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium transition-colors ${
                    lang === l
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span>{flag}</span>
                  <span className="hidden sm:inline">{l.toUpperCase()}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main layout */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <AISlopWarning />

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left sidebar: inputs */}
          <div className="lg:w-80 flex-shrink-0" data-guide-step="inputs">
            <InputPanel
              params={params}
              onChange={handleParamsChange}
              persist={persist}
              onPersistChange={handlePersistChange}
              pensioenoverzicht={pensioenoverzicht}
              onPensioenoverzichtData={handlePensioenoverzichtData}
            />
          </div>

          {/* Right content area */}
          <div className="flex-1 space-y-6">
            {/* Summary table */}
            <div data-guide-step="results">
              <SummaryTable
                results={results}
                showReal={showReal}
                inflationRate={params.inflationRate}
                selectedScenario={selectedScenario}
                onScenarioChange={setSelectedScenario}
                annuityRate={params.annuityRate}
                payoutYears={params.payoutYears}
              />
            </div>

            {/* Income comparison */}
            <IncomeComparisonPanel
              results={results}
              params={params}
              pensioenoverzicht={pensioenoverzicht}
              showReal={showReal}
              selectedScenario={selectedScenario}
              annuityRate={params.annuityRate}
              payoutYears={params.payoutYears}
            />

            {/* Tax leverage */}
            <div data-guide-step="tax">
              <TaxLeveragePanel params={params} />
            </div>

            {/* Contribution breakdown chart */}
            <ContributionBreakdown results={results} />

            {/* Capital chart */}
            <CapitalChart
              results={results}
              showReal={showReal}
              inflationRate={params.inflationRate}
            />

            {/* Annuity payout chart */}
            <AnnuityChart
              results={results}
              selectedScenario={selectedScenario}
              showReal={showReal}
              inflationRate={params.inflationRate}
              annuityRate={params.annuityRate}
              payoutYears={params.payoutYears}
            />

            {/* Pension glossary */}
            <div data-guide-step="glossary">
              <GlossaryPanel />
            </div>
          </div>
        </div>
      </main>

      {/* First-time guide */}
      <FirstTimeGuide />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppInner />
    </LanguageProvider>
  );
}
