import { YearlyResult } from '../types'
import { InfoBox } from './InfoBox'
import { useTranslation } from '../context/LanguageContext'

interface Props {
  result: YearlyResult   // year-1 data
  realMode: boolean
}

const euro = (v: number) =>
  v.toLocaleString('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
const pct = (v: number) => `${(v * 100).toFixed(2)}%`

interface RowProps {
  label: string
  value: string
  indent?: boolean
  negative?: boolean
  highlight?: boolean
  subtotal?: boolean
  accent?: string
}

function Row({ label, value, indent, negative, highlight, subtotal, accent }: RowProps) {
  return (
    <div className={`flex justify-between items-center py-1.5 px-3 rounded-md ${
      highlight ? 'bg-blue-600 text-white font-bold' :
      subtotal ? 'bg-gray-50 font-semibold text-gray-800' :
      'text-gray-700'
    }`}>
      <span className={`text-sm ${indent ? 'pl-4 text-gray-500' : ''}`}>{label}</span>
      <span className={`text-sm font-mono tabular-nums ${
        accent ?? (negative ? 'text-red-600' : highlight ? 'text-white' : '')
      }`}>
        {negative ? '− ' : ''}{value}
      </span>
    </div>
  )
}

export function TaxLeveragePanel({ result, realMode }: Props) {
  const { t } = useTranslation()

  const {
    grossSalary,
    franchise,
    pensioengrondslag,
    employerContribution,
    employeeContributionGross,
    taxSaving,
    netEmployeeCost,
    marginalTaxRate,
  } = result

  const totalFunded = employerContribution + employeeContributionGross
  const leverageRatio = netEmployeeCost > 0 ? totalFunded / netEmployeeCost : 0
  const employeePctOfBase = pensioengrondslag > 0 ? employeeContributionGross / pensioengrondslag : 0

  return (
    <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
      <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 mb-1">
        {t.taxPanel.title}
      </h2>
      <p className="text-xs text-gray-500 mb-1">{t.taxPanel.subtitle}</p>
      {realMode && (
        <p className="text-xs text-blue-600 bg-blue-50 rounded-lg px-3 py-1.5 mb-4 inline-block">
          {t.taxPanel.currentYearNote}
        </p>
      )}
      {!realMode && <div className="mb-4" />}

      <div className="space-y-0.5">
        <Row label={t.taxPanel.grossSalary} value={euro(grossSalary)} />
        <Row label={t.taxPanel.minusFranchise} value={euro(franchise)} indent negative />
        <Row label={t.taxPanel.pensionBase} value={euro(pensioengrondslag)} subtotal />

        <div className="h-3" />

        <Row
          label={`${t.taxPanel.employeeContrib} (${pct(employeePctOfBase)})`}
          value={euro(employeeContributionGross)}
        />
        <Row
          label={`${t.taxPanel.taxSavingLabel} (${pct(marginalTaxRate)})`}
          value={euro(taxSaving)}
          indent negative accent="text-green-600"
        />
        <Row label={t.taxPanel.netCost} value={euro(netEmployeeCost)} subtotal />

        <div className="h-3" />

        <Row label={t.taxPanel.employerContrib} value={euro(employerContribution)} accent="text-blue-600" />
        <Row label={t.taxPanel.totalFunded} value={euro(totalFunded)} subtotal />

        <div className="h-3" />

        <div className="rounded-xl bg-blue-600 text-white px-3 py-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold">{t.taxPanel.leverageTitle}</span>
            <span className="text-xl font-bold">{leverageRatio.toFixed(2)}×</span>
          </div>
          <p className="text-xs text-blue-100 mt-1">
            {t.taxPanel.leverageBody(<strong className="text-white">{euro(leverageRatio)}</strong> as unknown as string)}
          </p>
        </div>
      </div>

      <InfoBox title={t.infoBoxes.taxLeverage.title} content={t.infoBoxes.taxLeverage.content} />
      <InfoBox title={t.infoBoxes.pensioengrondslag.title} content={t.infoBoxes.pensioengrondslag.content} />
      <InfoBox title={t.infoBoxes.dutchTax.title} content={t.infoBoxes.dutchTax.content} />
    </section>
  )
}
