import { useTranslation } from '../context/LanguageContext';
import { InfoBox } from './InfoBox';
import type { YearlyResult } from '../types';
import { estimateMonthlyPension, toReal } from '../logic/simulation';

interface SummaryTableProps {
  results: YearlyResult[];
  showReal: boolean;
  inflationRate: number;
  selectedScenario: 'bad' | 'normal' | 'good';
  onScenarioChange: (s: 'bad' | 'normal' | 'good') => void;
  annuityRate: number;
  payoutYears: number;
}

const fmt = (n: number) =>
  n.toLocaleString('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });

const fmtCompact = (n: number) => {
  if (n >= 1_000_000) return `€${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `€${(n / 1_000).toFixed(0)}k`;
  return fmt(n);
};

interface ScenarioConfig {
  key: 'bad' | 'normal' | 'good';
  label: string;
  rate: string;
  gradient: string;
  badgeColor: string;
  barColor: string;
  ringColor: string;
}

interface ScenarioCardProps {
  config: ScenarioConfig;
  cap2: number;
  cap3: number;
  employerTotal: number;
  employeeTotal: number;
  taxSavingTotal: number;
  netCostTotal: number;
  extraTotal: number;
  extraTaxSaving: number;
  extraNetCost: number;
  maxCapital: number;
  selected?: boolean;
  annuityRate: number;
  payoutYears: number;
}

function ScenarioCard({
  config,
  cap2,
  cap3,
  employerTotal,
  employeeTotal,
  taxSavingTotal,
  netCostTotal,
  extraTotal,
  extraTaxSaving,
  extraNetCost,
  maxCapital,
  selected = false,
  annuityRate,
  payoutYears,
}: ScenarioCardProps) {
  const { t } = useTranslation();
  const total = cap2 + cap3;
  const monthlyPension = estimateMonthlyPension(total, annuityRate, payoutYears);
  const barWidth = maxCapital > 0 ? Math.round((total / maxCapital) * 100) : 0;

  return (
    <div className={`rounded-2xl overflow-hidden border shadow-sm flex flex-col transition-all duration-200 ${selected ? `border-2 ${config.ringColor} shadow-md` : 'border-gray-200'}`}>
      {/* Colored header */}
      <div className={`${config.gradient} px-4 pt-4 pb-5`}>
        <div className="flex items-center justify-between mb-2">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${config.badgeColor}`}>
            {config.label}
          </span>
          <span className="text-xs font-medium text-white/70">{config.rate}</span>
        </div>
        {/* Hero: monthly pension */}
        <p className="text-3xl font-bold text-white mt-1">
          {fmt(monthlyPension)}
          <span className="text-sm font-normal text-white/70">/mnd</span>
        </p>
        <p className="text-xs text-white/70 mt-0.5">{t.summary.monthlyPension}</p>
        {/* Capital bar */}
        <div className="mt-3">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-white/70">{t.summary.capitalTotal}</span>
            <span className="font-semibold text-white">{fmtCompact(total)}</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/30 overflow-hidden">
            <div
              className={`h-full rounded-full ${config.barColor} transition-all duration-500`}
              style={{ width: `${barWidth}%` }}
            />
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="bg-white px-4 py-3 flex-1 space-y-1.5 text-xs">
        <div className="flex justify-between py-1 border-b border-gray-100">
          <span className="text-gray-500">{t.summary.capital2nd}</span>
          <span className="font-medium">{fmt(cap2)}</span>
        </div>
        {cap3 > 0 && (
          <div className="flex justify-between py-1 border-b border-gray-100">
            <span className="text-gray-500">{t.summary.capital3rd}</span>
            <span className="font-medium">{fmt(cap3)}</span>
          </div>
        )}

        <p className="font-semibold text-gray-700 pt-1.5">{t.summary.deposits2nd}</p>
        <div className="flex justify-between pl-3">
          <span className="text-gray-400">{t.summary.employerGross}</span>
          <span>{fmt(employerTotal)}</span>
        </div>
        <div className="flex justify-between pl-3">
          <span className="text-gray-400">{t.summary.employeeGross}</span>
          <span>{fmt(employeeTotal)}</span>
        </div>
        <div className="flex justify-between pl-3">
          <span className="text-emerald-600">{t.summary.taxSaving}</span>
          <span className="text-emerald-600">−{fmt(taxSavingTotal)}</span>
        </div>
        <div className="flex justify-between pl-3 font-medium border-t border-gray-100 pt-1">
          <span className="text-gray-600">{t.summary.netCost}</span>
          <span>{fmt(netCostTotal)}</span>
        </div>

        {extraTotal > 0 && (
          <>
            <div className="flex justify-between pt-1.5 border-t border-gray-100">
              <span className="font-semibold text-gray-700">{t.summary.deposits3rd}</span>
              <span>{fmt(extraTotal)}</span>
            </div>
            <div className="flex justify-between pl-3">
              <span className="text-emerald-600">{t.summary.taxSaving}</span>
              <span className="text-emerald-600">−{fmt(extraTaxSaving)}</span>
            </div>
            <div className="flex justify-between pl-3 font-medium border-t border-gray-100 pt-1">
              <span className="text-gray-600">{t.summary.netCost}</span>
              <span>{fmt(extraNetCost)}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const SCENARIO_CONFIGS: ScenarioConfig[] = [
  {
    key: 'bad',
    label: 'Pessimistisch',
    rate: '2% rendement',
    gradient: 'bg-gradient-to-br from-rose-500 to-rose-600',
    badgeColor: 'bg-rose-700/40 text-white',
    barColor: 'bg-white/80',
    ringColor: 'border-rose-400',
  },
  {
    key: 'normal',
    label: 'Gemiddeld',
    rate: '5% rendement',
    gradient: 'bg-gradient-to-br from-blue-500 to-blue-600',
    badgeColor: 'bg-blue-700/40 text-white',
    barColor: 'bg-white/80',
    ringColor: 'border-blue-400',
  },
  {
    key: 'good',
    label: 'Optimistisch',
    rate: '8% rendement',
    gradient: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
    badgeColor: 'bg-emerald-700/40 text-white',
    barColor: 'bg-white/80',
    ringColor: 'border-emerald-400',
  },
];

export function SummaryTable({ results, showReal, inflationRate, selectedScenario, onScenarioChange, annuityRate, payoutYears }: SummaryTableProps) {
  const { t } = useTranslation();
  const activeIdx = SCENARIO_CONFIGS.findIndex((c) => c.key === selectedScenario);

  if (results.length === 0) return null;

  const last = results[results.length - 1];
  const years = results.length;
  const real = showReal ? (v: number) => toReal(v, inflationRate, years) : (v: number) => v;

  const employerTotal = results.reduce((s, r) => s + r.employerContribution, 0);
  const employeeTotal = results.reduce((s, r) => s + r.employeeContribution, 0);
  const taxSavingTotal = results.reduce((s, r) => s + r.taxSaving, 0);
  const netCostTotal = employeeTotal - taxSavingTotal;
  const extraTotal = results.reduce((s, r) => s + r.extraSavingsGross, 0);
  const extraTaxSaving = results.reduce((s, r) => s + r.extraSavingsTaxSaving, 0);
  const extraNetCost = extraTotal - extraTaxSaving;

  const scenarios = [
    { cap2: real(last.capital2Bad), cap3: real(last.capital3Bad) },
    { cap2: real(last.capital2Normal), cap3: real(last.capital3Normal) },
    { cap2: real(last.capital2Good), cap3: real(last.capital3Good) },
  ];

  const maxCapital = Math.max(...scenarios.map((s) => s.cap2 + s.cap3));
  const sharedProps = { employerTotal, employeeTotal, taxSavingTotal, netCostTotal, extraTotal, extraTaxSaving, extraNetCost, maxCapital, annuityRate, payoutYears };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5" data-guide-step="results">
      <h2 className="font-semibold text-gray-800 mb-4 text-base">{t.summary.title}</h2>

      {/* Mobile: segmented control */}
      <div className="flex md:hidden gap-1 bg-gray-100 rounded-xl p-1 mb-4">
        {SCENARIO_CONFIGS.map((cfg) => (
          <button
            key={cfg.key}
            type="button"
            onClick={() => onScenarioChange(cfg.key)}
            className={`flex-1 text-xs font-medium py-1.5 rounded-lg transition-all ${
              selectedScenario === cfg.key ? 'bg-white shadow text-gray-900' : 'text-gray-500'
            }`}
          >
            {cfg.label}
          </button>
        ))}
      </div>

      {/* Mobile: single card */}
      <div className="md:hidden">
        <ScenarioCard config={SCENARIO_CONFIGS[activeIdx]} {...scenarios[activeIdx]} {...sharedProps} selected />
      </div>

      {/* Desktop: all 3 — click to select */}
      <div className="hidden md:grid grid-cols-3 gap-4">
        {SCENARIO_CONFIGS.map((cfg, i) => (
          <button
            key={cfg.key}
            type="button"
            onClick={() => onScenarioChange(cfg.key)}
            className="text-left focus:outline-none rounded-2xl"
          >
            <ScenarioCard config={cfg} {...scenarios[i]} {...sharedProps} selected={selectedScenario === cfg.key} />
          </button>
        ))}
      </div>

      <p className="text-xs text-gray-400 mt-4 italic">{t.summary.disclaimer}</p>
      <p className="text-xs text-blue-600 mt-1">{t.summary.pillarsNote}</p>
      <InfoBox title={t.infoBoxes.resultCapital.title} content={t.infoBoxes.resultCapital.content} />
    </div>
  );
}
