import { YearlyResult, SimParams } from '../types'
import { calculateTaxWithPensionDeduction, calculateRetirementTax } from '../logic/tax'
import { estimateMonthlyPension, toReal, ANNUITY_RATE } from '../logic/simulation'
import { useTranslation } from '../context/LanguageContext'
import { InfoBox } from './InfoBox'

interface Props {
  results: YearlyResult[]
  params: SimParams
  realMode: boolean
}

const euro = (v: number) =>
  v.toLocaleString('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })

interface BarProps {
  label: string
  value: number
  total: number
  color: string
  note?: string
}

function Bar({ label, value, total, color, note }: BarProps) {
  const pct = total > 0 ? Math.min(100, (value / total) * 100) : 0
  return (
    <div className="mb-2">
      <div className="flex justify-between text-xs mb-0.5">
        <span className="text-gray-600">{label}</span>
        <span className="font-mono font-medium text-gray-800">{euro(value)}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      {note && <p className="text-xs text-gray-400 mt-0.5">{note}</p>}
    </div>
  )
}

export function IncomeComparisonPanel({ results, params, realMode }: Props) {
  const { t } = useTranslation()

  if (results.length === 0) return null

  const lastYear = results[results.length - 1]
  const years = results.length

  const year1 = results[0]

  // Reference salary: nominal → final year (both sides in future €), real → year 1 (both sides in today's €)
  const refYear = realMode ? year1 : lastYear
  const annualTax = calculateTaxWithPensionDeduction(
    refYear.grossSalary,
    refYear.employeeContributionGross
  )
  const currentNetMonthly = (refYear.grossSalary - annualTax - refYear.employeeContributionGross) / 12

  // 2nd pillar capital (normal scenario) — nominal or real
  const cap2Normal = realMode
    ? toReal(lastYear.capitalNormal, years, params.inflationRate)
    : lastYear.capitalNormal

  // 3rd pillar capital (normal scenario) — nominal or real
  const cap3Normal = realMode
    ? toReal(lastYear.capitalNormalThird, years, params.inflationRate)
    : lastYear.capitalNormalThird

  const monthly2nd = estimateMonthlyPension(cap2Normal, ANNUITY_RATE)
  const monthly3rd = estimateMonthlyPension(cap3Normal, ANNUITY_RATE)
  const monthlyAow = params.aowMonthly

  // Gross pension total — all three pillars are taxed as Box 1 income at retirement
  const grossTotalMonthly = monthly2nd + monthly3rd + monthlyAow

  // Tax at pension-age rates (no AOW premium, bracket 1 ≈ 19.07% instead of 36.97%)
  const monthlyPensionTax = calculateRetirementTax(grossTotalMonthly * 12) / 12

  // Net pension used for replacement rate — compare net/net
  const netTotalMonthly = grossTotalMonthly - monthlyPensionTax

  const replacementRate = currentNetMonthly > 0 ? netTotalMonthly / currentNetMonthly : 0
  const replacementPct = Math.round(replacementRate * 100)

  const isGood = replacementPct >= 70
  const isModerate = replacementPct >= 50 && replacementPct < 70

  const statusColor = isGood ? '#10b981' : isModerate ? '#f59e0b' : '#ef4444'
  const statusLabel = isGood ? t.incomeComparison.statusGood : isModerate ? t.incomeComparison.statusModerate : t.incomeComparison.statusLow
  const statusNote = isGood ? t.incomeComparison.statusGoodNote : isModerate ? t.incomeComparison.statusModerateNote : t.incomeComparison.statusLowNote

  // Gauge arc SVG parameters
  const radius = 52
  const cx = 70
  const cy = 68
  const startAngle = -180
  const endAngle = 0
  const angleRange = endAngle - startAngle
  const filledAngle = startAngle + angleRange * Math.min(1, replacementRate)
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const arcPath = (from: number, to: number, r: number) => {
    const x1 = cx + r * Math.cos(toRad(from))
    const y1 = cy + r * Math.sin(toRad(from))
    const x2 = cx + r * Math.cos(toRad(to))
    const y2 = cy + r * Math.sin(toRad(to))
    const large = to - from > 180 ? 1 : 0
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`
  }

  return (
    <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
      <h2 className="text-base font-bold text-gray-900 mb-1">
        {t.incomeComparison.title}
      </h2>
      <p className="text-xs text-gray-500 mb-2">
        {t.incomeComparison.subtitle} ({t.incomeComparison.normalScenario}
        {realMode ? ', reëel' : ', nominaal'})
      </p>
      <div className="mb-4" />

      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Gauge */}
        <div className="flex-shrink-0 flex flex-col items-center">
          <svg width="140" height="80" viewBox="0 0 140 80">
            {/* Background arc */}
            <path d={arcPath(startAngle, endAngle, radius)} fill="none" stroke="#e5e7eb" strokeWidth="12" strokeLinecap="round" />
            {/* Target zone (70–80%) */}
            <path d={arcPath(startAngle + angleRange * 0.70, startAngle + angleRange * 0.80, radius)} fill="none" stroke="#d1fae5" strokeWidth="12" />
            {/* Filled arc */}
            <path d={arcPath(startAngle, filledAngle, radius)} fill="none" stroke={statusColor} strokeWidth="12" strokeLinecap="round" />
            {/* Percentage text */}
            <text x={cx} y={cy - 8} textAnchor="middle" fontSize="20" fontWeight="bold" fill="#111827">{replacementPct}%</text>
            <text x={cx} y={cy + 8} textAnchor="middle" fontSize="9" fill={statusColor} fontWeight="600">{statusLabel}</text>
            {/* Scale labels */}
            <text x="8" y={cy + 4} fontSize="8" fill="#9ca3af">0%</text>
            <text x="114" y={cy + 4} fontSize="8" fill="#9ca3af">100%</text>
          </svg>
          <p className="text-xs text-gray-400 text-center mt-1 max-w-28">{t.incomeComparison.targetNote}</p>
        </div>

        {/* Breakdown */}
        <div className="flex-1 min-w-0 space-y-3">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{t.incomeComparison.replacementRate}</div>

          <div className="bg-gray-50 rounded-lg p-3 mb-3">
            <div className="flex justify-between text-sm mb-0.5">
              <span className="text-gray-600 font-medium">
                {realMode ? t.incomeComparison.currentNetMonthly : t.incomeComparison.finalNetMonthly}
              </span>
              <span className="font-mono font-bold text-gray-800">{euro(currentNetMonthly)}</span>
            </div>
            <p className="text-xs text-gray-400">
              {realMode ? t.incomeComparison.refNoteReal : t.incomeComparison.refNoteNominal}
            </p>
          </div>

          <Bar label={`${t.incomeComparison.pillar2} ${t.incomeComparison.grossNote}`} value={monthly2nd} total={currentNetMonthly} color="#3b82f6" />
          {params.extraSavingsMonthly > 0 ? (
            <Bar label={`${t.incomeComparison.pillar3} ${t.incomeComparison.grossNote}`} value={monthly3rd} total={currentNetMonthly} color="#8b5cf6"
              note={`${euro(params.extraSavingsMonthly * 12)}/jaar extra inleg`} />
          ) : (
            <div className="text-xs text-gray-400 italic">{t.incomeComparison.pillar3None}</div>
          )}
          <Bar label={`${t.incomeComparison.aow}`} value={monthlyAow} total={currentNetMonthly} color="#10b981"
            note={t.incomeComparison.aowNote} />

          <div className="border-t border-gray-200 pt-2 mt-2 space-y-1">
            <div className="flex justify-between text-xs text-gray-500">
              <span>{t.incomeComparison.totalMonthly}</span>
              <span className="font-mono">{euro(grossTotalMonthly)}</span>
            </div>
            <div className="flex justify-between text-xs text-red-600">
              <span title={t.incomeComparison.pensionTaxNote}>
                − {t.incomeComparison.pensionTaxLabel}
              </span>
              <span className="font-mono">{euro(monthlyPensionTax)}</span>
            </div>
            <div className="flex justify-between text-sm border-t border-gray-200 pt-1.5">
              <span className="font-bold text-gray-900">{t.incomeComparison.netTotalLabel}</span>
              <span className="font-mono font-bold text-gray-900">{euro(netTotalMonthly)}</span>
            </div>
          </div>

          <div
            className="rounded-lg p-2.5 text-xs mt-2"
            style={{ backgroundColor: statusColor + '15', borderLeft: `3px solid ${statusColor}` }}
          >
            <span className="font-semibold" style={{ color: statusColor }}>{statusLabel}:</span>{' '}
            <span className="text-gray-700">{statusNote}</span>
          </div>
        </div>
      </div>
      <InfoBox
        title={t.infoBoxes.retirementCosts.title}
        content={t.infoBoxes.retirementCosts.content}
      />
    </section>
  )
}
