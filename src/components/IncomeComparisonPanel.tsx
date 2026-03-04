import { useTranslation } from '../context/LanguageContext';
import { InfoBox } from './InfoBox';
import { estimateMonthlyPension, toReal } from '../logic/simulation';
import { calculateRetirementTax, calculateTax } from '../logic/tax';
import type { YearlyResult, SimParams } from '../types';
import type { PensioenoverzichtData } from '../logic/parsePensioenoverzicht';

interface IncomeComparisonPanelProps {
  results: YearlyResult[];
  params: SimParams;
  pensioenoverzicht: PensioenoverzichtData | null;
  showReal: boolean;
  selectedScenario: 'bad' | 'normal' | 'good';
  annuityRate: number;
  payoutYears: number;
}

const fmt = (n: number) =>
  n.toLocaleString('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });

interface IncomeBarProps {
  label: string;
  sublabel?: string;
  value: number;
  maxValue: number;
  color: string;
}

function IncomeBar({ label, sublabel, value, maxValue, color }: IncomeBarProps) {
  const pct = maxValue > 0 ? Math.min(100, (value / maxValue) * 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-baseline text-xs">
        <span className="text-gray-600">
          {label}
          {sublabel && <span className="text-gray-400 ml-1">{sublabel}</span>}
        </span>
        <span className="font-semibold text-gray-800 ml-2 whitespace-nowrap">{fmt(value)}/mnd</span>
      </div>
      <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function ReplacementGauge({ pct }: { pct: number }) {
  const clamped = Math.min(120, Math.max(0, pct));
  const displayPct = Math.min(100, clamped);
  const color = clamped >= 70 ? '#10b981' : clamped >= 50 ? '#f59e0b' : '#ef4444';
  const trackColor = clamped >= 70 ? '#d1fae5' : clamped >= 50 ? '#fef3c7' : '#fee2e2';

  const R = 54;
  const cx = 70;
  const cy = 70;

  function arc(angleDeg: number) {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + R * Math.cos(rad), y: cy + R * Math.sin(rad) };
  }

  const start = arc(-90);
  const end = arc(90);
  const needle = arc(-90 + (displayPct / 100) * 180);
  const t70 = arc(-90 + 0.70 * 180);
  const t80 = arc(-90 + 0.80 * 180);

  return (
    <svg width="140" height="80" viewBox="0 0 140 80">
      <path
        d={`M ${start.x} ${start.y} A ${R} ${R} 0 0 1 ${end.x} ${end.y}`}
        fill="none" stroke={trackColor} strokeWidth="14" strokeLinecap="round"
      />
      <path
        d={`M ${t70.x} ${t70.y} A ${R} ${R} 0 0 1 ${t80.x} ${t80.y}`}
        fill="none" stroke="#86efac" strokeWidth="14" strokeLinecap="butt" opacity="0.7"
      />
      {displayPct > 0 && (
        <path
          d={`M ${start.x} ${start.y} A ${R} ${R} 0 0 1 ${needle.x} ${needle.y}`}
          fill="none" stroke={color} strokeWidth="14" strokeLinecap="round"
        />
      )}
      <circle cx={needle.x} cy={needle.y} r="5" fill="white" stroke={color} strokeWidth="2.5" />
      <text x={cx} y={cy - 4} textAnchor="middle" fontSize="18" fontWeight="700" fill={color}>
        {Math.round(clamped)}%
      </text>
      <text x="14" y="78" fontSize="9" fill="#9ca3af">0%</text>
      <text x="112" y="78" fontSize="9" fill="#9ca3af">100%</text>
    </svg>
  );
}

const SCENARIO_LABELS: Record<'bad' | 'normal' | 'good', string> = {
  bad: 'pessimistisch',
  normal: 'gemiddeld',
  good: 'optimistisch',
};

export function IncomeComparisonPanel({
  results,
  params,
  pensioenoverzicht,
  showReal,
  selectedScenario,
  annuityRate,
  payoutYears,
}: IncomeComparisonPanelProps) {
  const { t } = useTranslation();

  if (results.length === 0) return null;

  const last = results[results.length - 1];
  const years = results.length;
  const real = showReal ? (v: number) => toReal(v, params.inflationRate, years) : (v: number) => v;

  const cap2 = real(
    selectedScenario === 'bad' ? last.capital2Bad :
    selectedScenario === 'good' ? last.capital2Good :
    last.capital2Normal
  );
  const cap3 = real(
    selectedScenario === 'bad' ? last.capital3Bad :
    selectedScenario === 'good' ? last.capital3Good :
    last.capital3Normal
  );
  const pension2Monthly = estimateMonthlyPension(cap2, annuityRate, payoutYears);
  const pension3Monthly = estimateMonthlyPension(cap3, annuityRate, payoutYears);

  const accruedMonthly = pensioenoverzicht ? real(pensioenoverzicht.totalAccruedMonthly) : 0;

  const aowMonthly = pensioenoverzicht
    ? (params.aowPartnerStatus === 'partner'
        ? (pensioenoverzicht.aowSamenwonend ?? pensioenoverzicht.aowAlleenstaand)
        : pensioenoverzicht.aowAlleenstaand) || params.aowMonthly
    : params.aowMonthly;

  const grossTotalMonthly = pension2Monthly + pension3Monthly + accruedMonthly + aowMonthly;
  const grossTotalAnnual = grossTotalMonthly * 12;
  const taxAnnual = calculateRetirementTax(grossTotalAnnual);
  const netMonthly = (grossTotalAnnual - taxAnnual) / 12;

  const refGross = showReal ? params.grossSalary : last.grossSalary;
  const refTax = calculateTax(refGross);
  const refNetMonthly = (refGross - refTax) / 12;

  const replacementRate = refNetMonthly > 0 ? (netMonthly / refNetMonthly) * 100 : 0;
  const rateLabel = replacementRate >= 70 ? t.income.good : replacementRate >= 50 ? t.income.moderate : t.income.low;
  const rateColor = replacementRate >= 70 ? 'text-emerald-600' : replacementRate >= 50 ? 'text-amber-500' : 'text-red-500';

  const maxBar = Math.max(refNetMonthly, netMonthly, grossTotalMonthly) * 1.05;

  const aowLabel = params.aowPartnerStatus === 'partner'
    ? `${t.income.aowLabel} (samenwonend)`
    : `${t.income.aowLabel} (alleenstaand)`;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5" data-guide-step="4">
      <h2 className="font-semibold text-gray-800 mb-5 text-base">{t.income.title}</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: income bars */}
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              {t.income.referenceSalary}
            </p>
            <IncomeBar
              label={showReal ? 'Huidig netto salaris' : 'Netto salaris (eindejaar)'}
              value={refNetMonthly}
              maxValue={maxBar}
              color="bg-gray-300"
            />
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Pensioeninkomen ({SCENARIO_LABELS[selectedScenario]} scenario)
            </p>
            <IncomeBar label={t.income.pension2nd} value={pension2Monthly} maxValue={maxBar} color="bg-blue-500" />
            {pension3Monthly > 0 && (
              <IncomeBar label={t.income.pension3rd} value={pension3Monthly} maxValue={maxBar} color="bg-violet-500" />
            )}
            {accruedMonthly > 0 && (
              <IncomeBar
                label={t.income.accrued}
                sublabel={`(${t.income.aowFromFile})`}
                value={accruedMonthly}
                maxValue={maxBar}
                color="bg-amber-400"
              />
            )}
            <IncomeBar
              label={aowLabel}
              sublabel={pensioenoverzicht ? undefined : `(${t.income.aowEstimate})`}
              value={aowMonthly}
              maxValue={maxBar}
              color="bg-sky-400"
            />
          </div>

          <div className="border-t border-gray-200 pt-3 space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500">{t.income.grossTotal}</span>
              <span className="font-semibold">{fmt(grossTotalMonthly)}/mnd</span>
            </div>
            <div className="flex justify-between">
              <span className="text-red-400">{t.income.tax}</span>
              <span className="text-red-400">−{fmt(taxAnnual / 12)}/mnd</span>
            </div>
            <div className="flex justify-between font-bold text-sm pt-1.5 border-t border-gray-200">
              <span className="text-gray-800">{t.income.netPension}</span>
              <span className="text-blue-700">{fmt(netMonthly)}/mnd</span>
            </div>
          </div>
        </div>

        {/* Right: gauge */}
        <div className="flex flex-col items-center justify-center gap-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{t.income.replacementRate}</p>
          <ReplacementGauge pct={replacementRate} />
          <p className={`text-lg font-bold ${rateColor}`}>{rateLabel}</p>
          <p className="text-xs text-gray-400 mt-0.5 max-w-[200px] text-center">{t.income.targetNote}</p>

          <div className="flex flex-col gap-1 text-xs mt-3 self-start w-full max-w-[200px]">
            <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 flex-shrink-0" /><span className="text-gray-500">{t.income.pension2nd}</span></div>
            {pension3Monthly > 0 && <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-violet-500 flex-shrink-0" /><span className="text-gray-500">{t.income.pension3rd}</span></div>}
            {accruedMonthly > 0 && <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-amber-400 flex-shrink-0" /><span className="text-gray-500">{t.income.accrued}</span></div>}
            <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-sky-400 flex-shrink-0" /><span className="text-gray-500">AOW</span></div>
          </div>
        </div>
      </div>

      <InfoBox title={t.infoBoxes.retirementCosts.title} content={t.infoBoxes.retirementCosts.content} />
      <InfoBox title={t.infoBoxes.aowPillars.title} content={t.infoBoxes.aowPillars.content} />
    </div>
  );
}
