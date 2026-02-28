import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, ReferenceLine
} from 'recharts'
import { YearlyResult } from '../types'
import { toReal } from '../logic/simulation'
import { InfoBox } from './InfoBox'
import { InfoTooltip } from './InfoTooltip'
import { useTranslation } from '../context/LanguageContext'

interface Props {
  results: YearlyResult[]
  realMode: boolean
  inflationRate: number
}

const euroK = (v: number) => `€${(v / 1_000).toFixed(0)}k`

function formatEuro(v: number) {
  if (v >= 1_000_000) return `€${(v / 1_000_000).toFixed(2)}M`
  if (v >= 1_000) return `€${(v / 1_000).toFixed(0)}k`
  return `€${v.toFixed(0)}`
}

function CustomTooltip({ active, payload, label }: {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
  label?: number
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-xs">
      <p className="font-semibold text-gray-800 mb-1.5">Jaar {label}</p>
      {payload.map(p => (
        <div key={p.name} className="flex justify-between gap-4 mb-0.5">
          <span style={{ color: p.color }}>{p.name}</span>
          <span className="font-mono font-semibold" style={{ color: p.color }}>
            {formatEuro(p.value)}
          </span>
        </div>
      ))}
    </div>
  )
}

export function CapitalChart({ results, realMode, inflationRate }: Props) {
  const { t } = useTranslation()

  const data = results.map(r => ({
    year: r.year,
    [t.capitalChart.bad]:    Math.round(realMode ? toReal(r.capitalBad,    r.year, inflationRate) : r.capitalBad),
    [t.capitalChart.normal]: Math.round(realMode ? toReal(r.capitalNormal, r.year, inflationRate) : r.capitalNormal),
    [t.capitalChart.good]:   Math.round(realMode ? toReal(r.capitalGood,   r.year, inflationRate) : r.capitalGood),
  }))

  const midYear = Math.round(results.length / 2)

  return (
    <section data-guide-step="capital-chart" className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-1">
        <h2 className="text-base font-bold text-gray-900">{t.capitalChart.title}</h2>
        <InfoTooltip text={t.tooltips.nominalVsReal} />
      </div>
      <p className="text-xs text-gray-500 mb-4">
        {realMode ? t.capitalChart.subtitleReal : t.capitalChart.subtitleNominal}
      </p>

      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="year"
            tick={{ fontSize: 11 }}
            label={{ value: t.capitalChart.yearLabel, position: 'insideBottom', offset: -2, fontSize: 11 }}
          />
          <YAxis tickFormatter={euroK} tick={{ fontSize: 11 }} width={55} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
            formatter={(value) => <span className="text-gray-700">{value}</span>}
          />
          <Line type="monotone" dataKey={t.capitalChart.bad}
            stroke="#94a3b8" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
          <Line type="monotone" dataKey={t.capitalChart.normal}
            stroke="#3b82f6" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
          <Line type="monotone" dataKey={t.capitalChart.good}
            stroke="#10b981" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
          {midYear > 0 && midYear < results.length && (
            <ReferenceLine x={midYear} stroke="#e2e8f0" strokeDasharray="4 2"
              label={{ value: `${midYear}j`, fontSize: 10, fill: '#94a3b8' }} />
          )}
        </LineChart>
      </ResponsiveContainer>

      <InfoBox title={t.infoBoxes.returnScenarios.title} content={t.infoBoxes.returnScenarios.content} />
    </section>
  )
}
