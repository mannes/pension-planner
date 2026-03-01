import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer
} from 'recharts'
import { YearlyResult } from '../types'
import { toReal } from '../logic/simulation'
import { useTranslation } from '../context/LanguageContext'

interface Props {
  results: YearlyResult[]
  realMode: boolean
  inflationRate: number
}

const euroK = (v: number) => {
  if (v >= 1000) return `€${(v / 1000).toFixed(0)}k`
  return `€${Math.round(v)}`
}

function CustomTooltip({ active, payload, label }: {
  active?: boolean
  payload?: Array<{ name: string; value: number; fill: string }>
  label?: number
}) {
  if (!active || !payload?.length) return null
  const total = payload.reduce((s, p) => s + p.value, 0)
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-xs min-w-48">
      <p className="font-semibold text-gray-800 mb-1.5">Jaar {label}</p>
      {payload.map(p => (
        <div key={p.name} className="flex justify-between gap-3 mb-0.5">
          <span style={{ color: p.fill }}>{p.name}</span>
          <span className="font-mono" style={{ color: p.fill }}>€{Math.round(p.value).toLocaleString('nl-NL')}</span>
        </div>
      ))}
      <div className="border-t border-gray-200 mt-1.5 pt-1.5 flex justify-between font-semibold text-gray-800">
        <span>Totaal</span>
        <span className="font-mono">€{Math.round(total).toLocaleString('nl-NL')}</span>
      </div>
    </div>
  )
}

export function ContributionBreakdown({ results, realMode, inflationRate }: Props) {
  const { t } = useTranslation()

  const data = results.map(r => {
    const adj = (v: number) => Math.round(realMode ? toReal(v, r.year, inflationRate) : v)
    return {
      year: r.year,
      [t.breakdown.employer]:       adj(r.employerContribution),
      [t.breakdown.employeeGross]:  adj(r.employeeContributionGross),
      [t.breakdown.taxSaving]:      adj(r.taxSaving),
    }
  })

  return (
    <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
      <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 mb-1">
        {t.breakdown.title}
      </h2>
      <p className="text-xs text-gray-500 mb-4">
        {realMode ? t.breakdown.subtitleReal : t.breakdown.subtitleNominal}
      </p>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="year" tick={{ fontSize: 10 }} />
          <YAxis tickFormatter={euroK} tick={{ fontSize: 10 }} width={50} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Bar dataKey={t.breakdown.employer}      stackId="a" fill="#3b82f6" />
          <Bar dataKey={t.breakdown.employeeGross} stackId="a" fill="#8b5cf6" />
          <Bar dataKey={t.breakdown.taxSaving}     stackId="a" fill="#10b981" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-3 grid grid-cols-3 gap-2">
        {[
          { color: 'bg-blue-500',   bg: 'bg-blue-50',   label: t.breakdown.legendEmployer, note: t.breakdown.legendEmployerNote },
          { color: 'bg-purple-500', bg: 'bg-purple-50', label: t.breakdown.legendEmployee, note: t.breakdown.legendEmployeeNote },
          { color: 'bg-green-500',  bg: 'bg-green-50',  label: t.breakdown.legendTax,      note: t.breakdown.legendTaxNote },
        ].map(item => (
          <div key={item.label} className={`rounded-lg ${item.bg} p-2 text-center`}>
            <div className={`w-3 h-3 rounded ${item.color} mx-auto mb-1`} />
            <p className="text-xs text-gray-600 font-medium">{item.label}</p>
            <p className="text-xs text-gray-400">{item.note}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
