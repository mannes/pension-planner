import { useTranslation } from '../context/LanguageContext';
import { InfoBox } from './InfoBox';
import { calcContributions } from '../logic/pension';
import { getMarginalRate } from '../logic/tax';
import type { SimParams } from '../types';

interface TaxLeveragePanelProps {
  params: SimParams;
}

const fmt = (n: number) =>
  n.toLocaleString('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });

interface WaterfallRowProps {
  label: string;
  value: number;
  maxValue: number;
  variant?: 'default' | 'deduct' | 'subtotal' | 'positive' | 'total';
  indent?: boolean;
}

function WaterfallRow({ label, value, maxValue, variant = 'default', indent }: WaterfallRowProps) {
  const barPct = maxValue > 0 ? Math.min(100, Math.abs(value) / maxValue * 100) : 0;

  const colors: Record<NonNullable<WaterfallRowProps['variant']>, { bar: string; text: string; bg: string }> = {
    default:   { bar: 'bg-blue-400',    text: 'text-gray-700',   bg: '' },
    deduct:    { bar: 'bg-red-300',     text: 'text-red-600',    bg: '' },
    subtotal:  { bar: 'bg-gray-300',    text: 'text-gray-700',   bg: 'bg-gray-50' },
    positive:  { bar: 'bg-emerald-400', text: 'text-emerald-600', bg: '' },
    total:     { bar: 'bg-blue-600',    text: 'text-blue-700 font-bold', bg: 'bg-blue-50' },
  };

  const c = colors[variant];

  return (
    <div className={`py-1.5 px-2 rounded-lg ${c.bg} ${indent ? 'ml-4' : ''}`}>
      <div className="flex justify-between items-center text-xs mb-1">
        <span className="text-gray-600">{label}</span>
        <span className={`font-semibold ${c.text}`}>
          {variant === 'deduct' ? '−' : ''}{fmt(Math.abs(value))}
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
        <div
          className={`h-full rounded-full ${c.bar} transition-all duration-500`}
          style={{ width: `${barPct}%` }}
        />
      </div>
    </div>
  );
}

export function TaxLeveragePanel({ params }: TaxLeveragePanelProps) {
  const { t } = useTranslation();

  const marginal = getMarginalRate(params.grossSalary);
  const contrib = calcContributions(
    params.grossSalary,
    params.franchise,
    params.employerPct,
    params.employeePct,
    marginal
  );

  const extraAnnual = params.extraSavingsMonthly * 12;
  const extraTaxBenefit = extraAnnual * marginal;
  const extraNetCost = extraAnnual - extraTaxBenefit;

  const maxValue = Math.max(params.grossSalary, contrib.totalFunded);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5" data-guide-step="3">
      <h2 className="font-semibold text-gray-800 mb-4 text-base">{t.tax.title}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Waterfall */}
        <div className="space-y-1">
          <WaterfallRow label={t.tax.grossSalary}  value={params.grossSalary}        maxValue={maxValue} variant="default" />
          <WaterfallRow label={t.tax.franchise}     value={params.franchise}          maxValue={maxValue} variant="deduct"  indent />
          <WaterfallRow label={t.tax.pensionBase}   value={contrib.pensioengrondslag} maxValue={maxValue} variant="subtotal" />
          <div className="h-px bg-gray-100 my-1" />
          <WaterfallRow label={t.tax.employeeGross} value={contrib.employeeGross}     maxValue={maxValue} variant="default" />
          <WaterfallRow label={t.tax.taxSaving}     value={contrib.taxSaving}         maxValue={maxValue} variant="positive" indent />
          <WaterfallRow label={t.tax.netCost}       value={contrib.netEmployeeCost}   maxValue={maxValue} variant="subtotal" />
          <div className="h-px bg-gray-100 my-1" />
          <WaterfallRow label={t.tax.employer}      value={contrib.employerGross}     maxValue={maxValue} variant="positive" />
          <WaterfallRow label={t.tax.totalFunded}   value={contrib.totalFunded}       maxValue={maxValue} variant="total" />
        </div>

        {/* Leverage callout + 3rd pillar */}
        <div className="space-y-4">
          {/* Leverage ratio badge */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 text-white">
            <p className="text-xs text-blue-200 mb-1">{t.tax.leverageRatio}</p>
            <p className="text-4xl font-bold">
              {contrib.leverageRatio > 0 ? contrib.leverageRatio.toFixed(2) : '—'}
              <span className="text-lg font-normal text-blue-200">×</span>
            </p>
            <p className="text-xs text-blue-200 mt-2 leading-relaxed">
              Voor elke €1 netto bijdrage gaat{' '}
              {contrib.leverageRatio > 0 ? contrib.leverageRatio.toFixed(2) : '0'}×
              {' '}naar uw pensioen.
            </p>
          </div>

          {/* Marginal rate badge */}
          <div className="bg-gray-50 rounded-xl p-3 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Marginaal tarief</span>
              <span className="font-bold text-gray-800">{(marginal * 100).toFixed(2)}%</span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-gray-500">Netto kosten werknemer</span>
              <span className="font-semibold text-gray-700">{fmt(contrib.netEmployeeCost)}/jr</span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-emerald-600">Belastingbesparing</span>
              <span className="font-semibold text-emerald-600">{fmt(contrib.taxSaving)}/jr</span>
            </div>
          </div>

          {/* 3rd pillar section */}
          {extraAnnual > 0 && (
            <div className="border border-violet-200 rounded-xl p-3 space-y-1">
              <p className="text-xs font-semibold text-violet-700 mb-2">
                {t.tax.extraSavings}: {fmt(params.extraSavingsMonthly)}/mnd
              </p>
              <WaterfallRow label={t.tax.extraTaxBenefit} value={extraTaxBenefit} maxValue={extraAnnual} variant="positive" indent />
              <WaterfallRow label={t.tax.extraNetCost}    value={extraNetCost}    maxValue={extraAnnual} variant="total" />
            </div>
          )}

          <p className="text-xs text-gray-400 italic">{t.tax.realModeNote}</p>
        </div>
      </div>

      <InfoBox title={t.infoBoxes.taxLeverage.title}  content={t.infoBoxes.taxLeverage.content} />
      <InfoBox title={t.infoBoxes.taxBrackets.title}  content={t.infoBoxes.taxBrackets.content} />
      <InfoBox title={t.infoBoxes.pensionBase.title}  content={t.infoBoxes.pensionBase.content} />
    </div>
  );
}
