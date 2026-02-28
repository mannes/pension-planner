import { YearlyResult, RETURN_RATES } from '../types'
import { toReal, estimateMonthlyPension } from '../logic/simulation'
import { InfoBox } from './InfoBox'
import { useTranslation } from '../context/LanguageContext'

interface Props {
  results: YearlyResult[]
  realMode: boolean
  inflationRate: number
  hasThirdPillar: boolean
}

const euro = (v: number) =>
  v.toLocaleString('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })

interface ScenarioCardProps {
  label: string
  returnRate: number
  finalCapital2nd: number
  finalCapital3rd: number
  totalContributions: number
  totalTaxSavings: number
  totalNetCost: number
  monthlyPension: number
  accent: string
  bg: string
  perMonth: string
  endCapitalLabel: string
  totalDepositedLabel: string
  totalTaxLabel: string
  netCostLabel: string
  monthlyLabel: string
  rateLabel: string
  hasThirdPillar: boolean
}

function ScenarioCard({
  label, returnRate, finalCapital2nd, finalCapital3rd,
  totalContributions, totalTaxSavings, totalNetCost, monthlyPension,
  accent, bg, perMonth, endCapitalLabel, totalDepositedLabel,
  totalTaxLabel, netCostLabel, monthlyLabel, rateLabel, hasThirdPillar,
}: ScenarioCardProps) {
  const combinedCapital = finalCapital2nd + finalCapital3rd

  return (
    <div className={`rounded-xl border-2 ${bg} p-4`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className={`font-bold text-sm ${accent}`}>{label}</h3>
        <span className={`text-xs font-mono px-2 py-0.5 rounded-full bg-white ${accent}`}>
          {(returnRate * 100).toFixed(0)}{rateLabel}
        </span>
      </div>

      <div className="text-2xl font-bold text-gray-900 mb-0.5">{euro(finalCapital2nd)}</div>
      <div className="text-xs text-gray-500 mb-1">{endCapitalLabel}</div>
      {hasThirdPillar && (
        <div className="text-sm font-semibold text-purple-700 mb-0.5">
          + {euro(finalCapital3rd)} <span className="text-xs font-normal text-gray-500">(3e pijler)</span>
        </div>
      )}
      {hasThirdPillar && (
        <div className="text-xs font-bold text-gray-700 mb-3 border-t border-gray-200 pt-1">
          = {euro(combinedCapital)} totaal
        </div>
      )}
      {!hasThirdPillar && <div className="mb-3" />}

      <div className="space-y-1.5 text-xs">
        <div className="flex justify-between text-gray-600">
          <span>{totalDepositedLabel}</span>
          <span className="font-mono font-medium">{euro(totalContributions)}</span>
        </div>
        <div className="flex justify-between text-green-700">
          <span>{totalTaxLabel}</span>
          <span className="font-mono font-medium">{euro(totalTaxSavings)}</span>
        </div>
        <div className="flex justify-between text-gray-800 font-semibold border-t border-gray-200 pt-1.5">
          <span>{netCostLabel}</span>
          <span className="font-mono">{euro(totalNetCost)}</span>
        </div>
        <div className="flex justify-between text-gray-800 font-semibold border-t border-gray-200 pt-1.5">
          <span>{monthlyLabel}</span>
          <span className="font-mono">{euro(monthlyPension)}{perMonth}</span>
        </div>
      </div>
    </div>
  )
}

export function SummaryTable({ results, realMode, inflationRate, hasThirdPillar }: Props) {
  const { t } = useTranslation()

  if (results.length === 0) return null

  const lastYear = results[results.length - 1]
  const years = results.length

  const totals = results.reduce(
    (acc, r) => ({
      contributions: acc.contributions + r.totalAnnualContribution,
      taxSavings:    acc.taxSavings    + r.taxSaving,
      netCost:       acc.netCost       + r.netEmployeeCost,
    }),
    { contributions: 0, taxSavings: 0, netCost: 0 }
  )

  function getCapital2nd(key: 'Bad' | 'Normal' | 'Good') {
    const nominal = lastYear[`capital${key}` as keyof YearlyResult] as number
    return realMode ? toReal(nominal, years, inflationRate) : nominal
  }

  function getCapital3rd(key: 'Bad' | 'Normal' | 'Good') {
    const nominal = lastYear[`capital${key}Third` as keyof YearlyResult] as number
    return realMode ? toReal(nominal, years, inflationRate) : nominal
  }

  const scenarios: Array<{
    key: 'Bad' | 'Normal' | 'Good'
    label: string
    rate: number
    accent: string
    bg: string
  }> = [
    { key: 'Bad',    label: t.summary.badLabel,    rate: RETURN_RATES.bad,    accent: 'text-slate-600',   bg: 'border-slate-200 bg-slate-50' },
    { key: 'Normal', label: t.summary.normalLabel, rate: RETURN_RATES.normal, accent: 'text-blue-700',    bg: 'border-blue-200 bg-blue-50' },
    { key: 'Good',   label: t.summary.goodLabel,   rate: RETURN_RATES.good,   accent: 'text-emerald-700', bg: 'border-emerald-200 bg-emerald-50' },
  ]

  const cardProps = {
    perMonth: t.summary.perMonth,
    endCapitalLabel: t.summary.endCapital,
    totalDepositedLabel: t.summary.totalDeposited,
    totalTaxLabel: t.summary.totalTaxSavings,
    netCostLabel: t.summary.yourNetCost,
    monthlyLabel: t.summary.monthlyPension,
    rateLabel: `%/${t.inputs.yearsUnit.slice(0, 4)}`,
    hasThirdPillar,
  }

  return (
    <section className="bg-white rounded-2xl border-2 border-blue-200 shadow-md p-5">
      <div className="mb-1">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          {t.summary.title(years)}
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">
          {realMode ? t.summary.subtitleReal : t.summary.subtitleNominal}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
        {scenarios.map(s => (
          <ScenarioCard
            key={s.key}
            label={s.label}
            returnRate={s.rate}
            finalCapital2nd={getCapital2nd(s.key)}
            finalCapital3rd={getCapital3rd(s.key)}
            totalContributions={totals.contributions}
            totalTaxSavings={totals.taxSavings}
            totalNetCost={totals.netCost}
            monthlyPension={estimateMonthlyPension(getCapital2nd(s.key) + getCapital3rd(s.key), s.rate)}
            accent={s.accent}
            bg={s.bg}
            {...cardProps}
          />
        ))}
      </div>

      <div className="mt-4 rounded-lg bg-blue-50 border border-blue-200 p-3 text-xs text-blue-800">
        <strong>📌 {t.summary.pillarsNote}</strong>
      </div>

      <div className="mt-2 rounded-lg bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800">
        ⚠️ {t.summary.disclaimer}
      </div>

      <InfoBox title={t.infoBoxes.pillars.title} content={t.infoBoxes.pillars.content} />
      <InfoBox title={t.infoBoxes.aow.title} content={t.infoBoxes.aow.content} />
    </section>
  )
}
