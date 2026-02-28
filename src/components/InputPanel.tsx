import { SimParams } from '../types'
import { useTranslation } from '../context/LanguageContext'
import { InfoTooltip } from './InfoTooltip'
import { InfoBox } from './InfoBox'

interface Props {
  params: SimParams
  onChange: (params: SimParams) => void
}

interface SliderInputProps {
  label: string
  tooltip: string
  value: number
  min: number
  max: number
  step: number
  format: (v: number) => string
  onChange: (v: number) => void
}

function SliderInput({ label, tooltip, value, min, max, step, format, onChange }: SliderInputProps) {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1">
        <label className="flex items-center text-sm font-medium text-gray-700">
          {label}
          <InfoTooltip text={tooltip} />
        </label>
        <span className="text-sm font-semibold text-blue-700 tabular-nums">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
      />
      <div className="flex justify-between text-xs text-gray-400 mt-0.5">
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
    </div>
  )
}

const euro = (v: number) => `€${Math.round(v).toLocaleString('nl-NL')}`
const pct = (v: number) => `${(v * 100).toFixed(1)}%`

export function InputPanel({ params, onChange }: Props) {
  const { t } = useTranslation()

  function set<K extends keyof SimParams>(key: K, value: SimParams[K]) {
    onChange({ ...params, [key]: value })
  }

  return (
    <aside className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
      <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
        {t.inputs.sectionTitle}
      </h2>

      <div data-guide-step="salary">
        <SliderInput
          label={t.inputs.salary}
          tooltip={t.tooltips.salary}
          value={params.startingSalary}
          min={20_000} max={150_000} step={500}
          format={euro}
          onChange={v => set('startingSalary', v)}
        />
        <SliderInput
          label={t.inputs.salaryGrowth}
          tooltip={t.tooltips.salaryGrowth}
          value={params.salaryGrowthRate}
          min={0} max={0.08} step={0.005}
          format={pct}
          onChange={v => set('salaryGrowthRate', v)}
        />
      </div>

      <div className="border-t border-gray-100 my-4" />
      <div data-guide-step="contributions">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          {t.inputs.premiesTitle}
        </h3>
        <SliderInput
          label={t.inputs.employerPct}
          tooltip={t.tooltips.employerPct}
          value={params.employerPct}
          min={0} max={0.30} step={0.005}
          format={pct}
          onChange={v => set('employerPct', v)}
        />
        <SliderInput
          label={t.inputs.employeePct}
          tooltip={t.tooltips.employeePct}
          value={params.employeePct}
          min={0} max={0.20} step={0.005}
          format={pct}
          onChange={v => set('employeePct', v)}
        />
      </div>

      <div className="border-t border-gray-100 my-4" />
      <div data-guide-step="extra-savings" className="mb-1">
        <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
          {t.inputs.extraSavings}
          <InfoTooltip text={t.tooltips.extraSavings} />
        </label>
        <p className="text-xs text-gray-400 mb-2">{t.inputs.extraSavingsNote}</p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">€</span>
          <input
            type="number"
            min={0}
            max={2000}
            step={25}
            value={params.extraSavingsMonthly}
            onChange={e => set('extraSavingsMonthly', Math.max(0, Number(e.target.value)))}
            className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <span className="text-sm text-gray-400 whitespace-nowrap">/mnd</span>
        </div>
        {params.extraSavingsMonthly > 0 && (
          <p className="text-xs text-green-700 mt-1.5">
            = €{Math.round(params.extraSavingsMonthly * 12).toLocaleString('nl-NL')}/jaar
          </p>
        )}
      </div>

      <InfoBox title={t.infoBoxes.extraSavings.title} content={t.infoBoxes.extraSavings.content} />

      <div className="border-t border-gray-100 my-4" />
      <details className="group">
        <summary className="text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer list-none flex items-center justify-between mb-3 hover:text-gray-700">
          <span>{t.inputs.advancedTitle}</span>
          <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
        </summary>

        <SliderInput
          label={t.inputs.franchise}
          tooltip={t.tooltips.franchise}
          value={params.franchise}
          min={10_000} max={25_000} step={100}
          format={euro}
          onChange={v => set('franchise', v)}
        />
        <SliderInput
          label={t.inputs.franchiseGrowth}
          tooltip={t.tooltips.franchiseGrowth}
          value={params.franchiseGrowthRate}
          min={0} max={0.04} step={0.005}
          format={pct}
          onChange={v => set('franchiseGrowthRate', v)}
        />
        <SliderInput
          label={t.inputs.inflation}
          tooltip={t.tooltips.inflation}
          value={params.inflationRate}
          min={0} max={0.06} step={0.005}
          format={pct}
          onChange={v => set('inflationRate', v)}
        />
        <SliderInput
          label={t.inputs.years}
          tooltip="Aantal jaren pensioensopbouw te simuleren. Standaard 30 jaar."
          value={params.years}
          min={5} max={45} step={1}
          format={v => `${v} ${t.inputs.yearsUnit}`}
          onChange={v => set('years', v)}
        />
        <SliderInput
          label="AOW (maand)"
          tooltip={t.incomeComparison.aowNote}
          value={params.aowMonthly}
          min={500} max={2_500} step={50}
          format={euro}
          onChange={v => set('aowMonthly', v)}
        />
      </details>
    </aside>
  )
}
