import { useState } from 'react';
import { useTranslation } from '../context/LanguageContext';
import { InfoTooltip } from './InfoTooltip';
import { PensioenoverzichtUpload } from './PensioenoverzichtUpload';
import { calcJaarruimte } from '../logic/pension';
import type { SimParams } from '../types';
import type { PensioenoverzichtData } from '../logic/parsePensioenoverzicht';

interface InputPanelProps {
  params: SimParams;
  onChange: (params: SimParams) => void;
  persist: boolean;
  onPersistChange: (v: boolean) => void;
  pensioenoverzicht: PensioenoverzichtData | null;
  onPensioenoverzichtData: (data: PensioenoverzichtData | null) => void;
}

const fmt = (n: number) =>
  n.toLocaleString('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });

function pct(v: number) {
  return (v * 100).toFixed(1) + '%';
}

interface SliderRowProps {
  label: string;
  help: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
  displayValue: string;
  minLabel: string;
  maxLabel: string;
  accent?: string;
}

function SliderRow({ label, help, min, max, step, value, onChange, displayValue, minLabel, maxLabel, accent = 'accent-blue-600' }: SliderRowProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-0.5">
          {label}
          <InfoTooltip content={help} />
        </label>
        <span className={`text-sm font-bold px-2 py-0.5 rounded-lg bg-blue-50 text-blue-700 tabular-nums`}>
          {displayValue}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`w-full h-1.5 rounded-full appearance-none bg-gray-200 cursor-pointer ${accent}`}
      />
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  );
}

export function InputPanel({
  params,
  onChange,
  persist,
  onPersistChange,
  pensioenoverzicht,
  onPensioenoverzichtData,
}: InputPanelProps) {
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  function set<K extends keyof SimParams>(key: K, value: SimParams[K]) {
    onChange({ ...params, [key]: value });
  }

  const y1EmployerC = params.employerPct * Math.max(0, params.grossSalary - params.franchise);
  const y1EmployeeC = params.employeePct * Math.max(0, params.grossSalary - params.franchise);
  const jaarruimte = calcJaarruimte(params.grossSalary, params.franchise, y1EmployerC, y1EmployeeC);
  const extraAnnual = params.extraSavingsMonthly * 12;
  const jaarruimteRemaining = jaarruimte - extraAnnual;
  const simYears = Math.max(5, Math.min(45, 68 - params.startingAge));

  return (
    <aside
      className="bg-white border border-gray-200 rounded-2xl shadow-sm sticky top-0 z-30 lg:sticky lg:top-6 lg:z-10 max-h-[100dvh] lg:max-h-[calc(100vh-3rem)] flex flex-col"
      data-guide-step="salary"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 flex-shrink-0">
        <div>
          <h2 className="font-semibold text-gray-800 text-sm">{t.input.title}</h2>
          {collapsed && (
            <p className="text-xs text-gray-400 mt-0.5">
              {fmt(params.grossSalary)} · {pct(params.employerPct + params.employeePct)} · {params.startingAge}jr
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* Persist: disk icon + mini toggle */}
          <button
            type="button"
            title={t.input.persistHelp}
            onClick={() => onPersistChange(!persist)}
            className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <span className={`text-base leading-none ${persist ? 'opacity-100' : 'opacity-30'}`}>💾</span>
            <div className={`relative w-7 h-4 rounded-full transition-colors duration-200 ${persist ? 'bg-blue-500' : 'bg-gray-300'}`}>
              <span className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white shadow transition-transform duration-200 ${persist ? 'translate-x-3' : 'translate-x-0'}`} />
            </div>
          </button>
          {/* Collapse icon */}
          <button
            type="button"
            title={collapsed ? t.input.expand : t.input.collapse}
            onClick={() => setCollapsed((v) => !v)}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors text-sm"
          >
            {collapsed ? '▼' : '▲'}
          </button>
        </div>
      </div>

      {!collapsed && (
        <div className="overflow-y-auto flex-1 p-4 space-y-5">
          {/* Sim period badge */}
          <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl px-3 py-2 text-xs">
            <span className="text-2xl">📅</span>
            <div>
              <span className="font-semibold text-blue-800">{simYears} jaar</span>
              <span className="text-blue-500"> simulatieperiode</span>
              <p className="text-blue-400">tot AOW-leeftijd (68 jr)</p>
            </div>
          </div>

          {/* Salary */}
          <SliderRow
            label={t.input.salary}
            help={t.input.salaryHelp}
            min={20000} max={200000} step={1000}
            value={params.grossSalary}
            onChange={(v) => set('grossSalary', v)}
            displayValue={fmt(params.grossSalary)}
            minLabel="€20k" maxLabel="€200k"
          />

          {/* Age */}
          <SliderRow
            label={t.input.age}
            help={t.input.ageHelp}
            min={18} max={66} step={1}
            value={params.startingAge}
            onChange={(v) => set('startingAge', v)}
            displayValue={`${params.startingAge} jr`}
            minLabel="18" maxLabel="66"
          />

          {/* Contributions */}
          <div className="bg-gray-50 rounded-xl p-3 space-y-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Bijdragen</p>
            <SliderRow
              label={t.input.employerPct}
              help={t.input.employerPctHelp}
              min={0} max={0.25} step={0.001}
              value={params.employerPct}
              onChange={(v) => set('employerPct', v)}
              displayValue={pct(params.employerPct)}
              minLabel="0%" maxLabel="25%"
            />
            <SliderRow
              label={t.input.employeePct}
              help={t.input.employeePctHelp}
              min={0} max={0.15} step={0.001}
              value={params.employeePct}
              onChange={(v) => set('employeePct', v)}
              displayValue={pct(params.employeePct)}
              minLabel="0%" maxLabel="15%"
            />
            <div className="flex justify-between text-xs pt-1 border-t border-gray-200">
              <span className="text-gray-500">Totale bijdrage</span>
              <span className="font-bold text-gray-800">{pct(params.employerPct + params.employeePct)}</span>
            </div>
          </div>

          {/* Extra savings */}
          <SliderRow
            label={t.input.extraSavings}
            help={t.input.extraSavingsHelp}
            min={0} max={1000} step={10}
            value={params.extraSavingsMonthly}
            onChange={(v) => set('extraSavingsMonthly', v)}
            displayValue={`${fmt(params.extraSavingsMonthly)}/mnd`}
            minLabel="€0" maxLabel="€1.000"
          />

          {/* Jaarruimte card */}
          <div className={`rounded-xl p-3 text-xs border ${jaarruimteRemaining < 0 && extraAnnual > 0 ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'}`}>
            <p className="font-semibold text-emerald-800 mb-2">{t.jaarruimte.title}</p>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-500">{t.jaarruimte.maxSpace}</span>
                <span className="font-medium">{fmt(jaarruimte + y1EmployerC + y1EmployeeC)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">{t.jaarruimte.minus2nd}</span>
                <span>−{fmt(y1EmployerC + y1EmployeeC)}</span>
              </div>
              <div className="flex justify-between font-semibold border-t border-emerald-200 pt-1">
                <span>{t.jaarruimte.available}</span>
                <span className="text-emerald-700">{fmt(jaarruimte)}</span>
              </div>
              {extraAnnual > 0 && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t.jaarruimte.usage}</span>
                    <span>−{fmt(extraAnnual)}</span>
                  </div>
                  <div className={`flex justify-between font-semibold border-t border-emerald-200 pt-1 ${jaarruimteRemaining < 0 ? 'text-red-600' : 'text-emerald-700'}`}>
                    <span>{jaarruimteRemaining < 0 ? t.jaarruimte.exceeded : t.jaarruimte.remaining}</span>
                    <span>{fmt(Math.abs(jaarruimteRemaining))}</span>
                  </div>
                </>
              )}
            </div>
            <p className="mt-2 text-gray-400 italic">{t.jaarruimte.disclaimer}</p>
          </div>

          {/* AOW */}
          <div className="bg-sky-50 rounded-xl p-3 space-y-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">AOW</p>
            <SliderRow
              label={t.input.aow}
              help={t.input.aowHelp}
              min={0} max={2500} step={50}
              value={params.aowMonthly}
              onChange={(v) => set('aowMonthly', v)}
              displayValue={`${fmt(params.aowMonthly)}/mnd`}
              minLabel="€0" maxLabel="€2.500"
            />
            <div>
              <p className="text-xs font-medium text-gray-700 mb-1.5">{t.input.aowPartner}</p>
              <div className="flex gap-1 bg-white rounded-lg p-1 border border-sky-200">
                {(['single', 'partner'] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => set('aowPartnerStatus', s)}
                    className={`flex-1 text-xs py-1 rounded-md font-medium transition-all ${
                      params.aowPartnerStatus === s
                        ? 'bg-sky-500 text-white shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {s === 'single' ? t.input.aowPartnerSingle : t.input.aowPartnerWith}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Advanced settings */}
          <div>
            <button
              type="button"
              onClick={() => setShowAdvanced((v) => !v)}
              className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1 w-full py-1"
            >
              <span className="flex-1 text-left">{t.input.advanced}</span>
              <span>{showAdvanced ? '▲' : '▼'}</span>
            </button>
            {showAdvanced && (
              <div className="mt-3 bg-gray-50 rounded-xl p-3 space-y-4">
                <SliderRow
                  label={t.input.salaryGrowth}
                  help={t.input.salaryGrowthHelp}
                  min={0} max={0.08} step={0.001}
                  value={params.salaryGrowthRate}
                  onChange={(v) => set('salaryGrowthRate', v)}
                  displayValue={pct(params.salaryGrowthRate)}
                  minLabel="0%" maxLabel="8%"
                />
                <SliderRow
                  label={t.input.franchise}
                  help={t.input.franchiseHelp}
                  min={10000} max={30000} step={100}
                  value={params.franchise}
                  onChange={(v) => set('franchise', v)}
                  displayValue={fmt(params.franchise)}
                  minLabel="€10k" maxLabel="€30k"
                />
                <SliderRow
                  label={t.input.franchiseGrowth}
                  help={t.input.franchiseGrowthHelp}
                  min={0} max={0.04} step={0.001}
                  value={params.franchiseGrowthRate}
                  onChange={(v) => set('franchiseGrowthRate', v)}
                  displayValue={pct(params.franchiseGrowthRate)}
                  minLabel="0%" maxLabel="4%"
                />
                <SliderRow
                  label={t.input.inflation}
                  help={t.input.inflationHelp}
                  min={0} max={0.06} step={0.001}
                  value={params.inflationRate}
                  onChange={(v) => set('inflationRate', v)}
                  displayValue={pct(params.inflationRate)}
                  minLabel="0%" maxLabel="6%"
                />
                <SliderRow
                  label={t.input.annuityRate}
                  help={t.input.annuityRateHelp}
                  min={0.005} max={0.04} step={0.0005}
                  value={params.annuityRate}
                  onChange={(v) => set('annuityRate', v)}
                  displayValue={pct(params.annuityRate)}
                  minLabel="0,5%" maxLabel="4%"
                />
                <SliderRow
                  label={t.input.payoutYears}
                  help={t.input.payoutYearsHelp}
                  min={10} max={40} step={1}
                  value={params.payoutYears}
                  onChange={(v) => set('payoutYears', v)}
                  displayValue={`${params.payoutYears} jr`}
                  minLabel="10" maxLabel="40"
                />
              </div>
            )}
          </div>

          {/* Pensioenoverzicht upload */}
          <PensioenoverzichtUpload
            data={pensioenoverzicht}
            onData={onPensioenoverzichtData}
            error={uploadError}
            onError={setUploadError}
          />

        </div>
      )}
    </aside>
  );
}
