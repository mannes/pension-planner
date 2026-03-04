import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { estimateMonthlyPension, toReal } from '../logic/simulation';
import { AOW_AGE } from '../types';
import type { YearlyResult } from '../types';

interface AnnuityChartProps {
  results: YearlyResult[];
  selectedScenario: 'bad' | 'normal' | 'good';
  showReal: boolean;
  inflationRate: number;
  annuityRate: number;
  payoutYears: number;
}

const fmt = (n: number) =>
  n.toLocaleString('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });

function buildAnnuityData(capital: number, annuityRate: number, payoutYears: number) {
  if (capital <= 0) return [];
  const P = estimateMonthlyPension(capital, annuityRate, payoutYears);
  const r = annuityRate / 12;
  let balance = capital;
  return Array.from({ length: payoutYears }, (_, i) => {
    let yearInterest = 0;
    let yearPrincipal = 0;
    for (let m = 0; m < 12; m++) {
      const interest = balance * r;
      const principal = P - interest;
      yearInterest += interest;
      yearPrincipal += principal;
      balance -= principal;
    }
    return {
      age: AOW_AGE + i,
      interest: Math.round(yearInterest),
      principal: Math.round(yearPrincipal),
    };
  });
}

function buildLinearData(capital: number, annuityRate: number, payoutYears: number) {
  if (capital <= 0) return [];
  const yearlyPrincipal = capital / payoutYears;
  let balance = capital;
  return Array.from({ length: payoutYears }, (_, i) => {
    const interest = balance * annuityRate;
    balance -= yearlyPrincipal;
    return {
      age: AOW_AGE + i,
      principal: Math.round(yearlyPrincipal),
      interest: Math.round(interest),
    };
  });
}

interface CustomTooltipProps {
  active?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any[];
  label?: number;
  mode: 'annuity' | 'linear';
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const interest: number = payload.find((p) => p.name === 'Rente')?.value ?? 0;
  const principal: number = payload.find((p) => p.name === 'Opname uit vermogen')?.value ?? 0;
  const total = interest + principal;
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3 text-xs min-w-[180px]">
      <p className="font-semibold text-gray-700 mb-2">Leeftijd {label}</p>
      <div className="space-y-1">
        <div className="flex justify-between gap-4">
          <span className="text-gray-500">Jaarlijkse uitkering</span>
          <span className="font-bold text-gray-800">{fmt(total)}</span>
        </div>
        {interest > 0 && (
          <>
            <div className="flex justify-between gap-4 pl-2">
              <span className="text-emerald-600">Waarvan rente</span>
              <span className="text-emerald-700">{fmt(interest)}</span>
            </div>
            <div className="flex justify-between gap-4 pl-2">
              <span className="text-blue-600">Waarvan opname</span>
              <span className="text-blue-700">{fmt(principal)}</span>
            </div>
          </>
        )}
        <div className="flex justify-between gap-4 border-t border-gray-100 pt-1 mt-1">
          <span className="text-gray-400">Per maand</span>
          <span className="font-medium text-gray-700">{fmt(Math.round(total / 12))}</span>
        </div>
      </div>
    </div>
  );
}

const SCENARIO_LABELS: Record<'bad' | 'normal' | 'good', string> = {
  bad: 'Pessimistisch (2%)',
  normal: 'Gemiddeld (5%)',
  good: 'Optimistisch (8%)',
};

export function AnnuityChart({ results, selectedScenario, showReal, inflationRate, annuityRate, payoutYears }: AnnuityChartProps) {
  const [mode, setMode] = useState<'annuity' | 'linear'>('annuity');

  if (results.length === 0) return null;

  const last = results[results.length - 1];
  const years = results.length;
  const real = showReal ? (v: number) => toReal(v, inflationRate, years) : (v: number) => v;

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
  const capital = cap2 + cap3;

  const data = mode === 'annuity' ? buildAnnuityData(capital, annuityRate, payoutYears) : buildLinearData(capital, annuityRate, payoutYears);
  const annuityMonthly = Math.round(estimateMonthlyPension(capital, annuityRate, payoutYears));
  const linearYearlyPrincipal = capital / payoutYears;
  const linearYear1Monthly = Math.round((linearYearlyPrincipal + capital * annuityRate) / 12);
  const linearLastYearMonthly = Math.round((linearYearlyPrincipal + linearYearlyPrincipal * annuityRate) / 12);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-1">
        <div>
          <h2 className="font-semibold text-gray-800 text-base">Uitkeringsfase (20 jaar)</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Scenario: {SCENARIO_LABELS[selectedScenario]} · Startkapitaal {fmt(Math.round(capital))}
          </p>
        </div>
        {/* Mode toggle */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
          {(['annuity', 'linear'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-all ${
                mode === m ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {m === 'annuity' ? 'Lijfrente' : 'Lineair'}
            </button>
          ))}
        </div>
      </div>

      {/* Monthly payout callout */}
      <div className="flex gap-3 mb-4 mt-3">
        <div className={`flex-1 rounded-xl px-3 py-2 text-xs ${mode === 'annuity' ? 'bg-blue-50 border border-blue-100' : 'bg-gray-50 border border-gray-200'}`}>
          <p className="text-gray-500 mb-0.5">Maandelijkse uitkering (lijfrente)</p>
          <p className="text-xl font-bold text-blue-700">{fmt(annuityMonthly)}<span className="text-xs font-normal text-blue-400">/mnd</span></p>
          <p className="text-gray-400 mt-0.5">Vast bedrag, {(annuityRate * 100).toFixed(2).replace('.', ',')}% rekenrente · {payoutYears} jr</p>
        </div>
        <div className={`flex-1 rounded-xl px-3 py-2 text-xs ${mode === 'linear' ? 'bg-gray-100 border border-gray-300' : 'bg-gray-50 border border-gray-200'}`}>
          <p className="text-gray-500 mb-0.5">Maandelijkse uitkering (lineair)</p>
          <p className="text-xl font-bold text-gray-600">
            {fmt(linearYear1Monthly)}<span className="text-xs font-normal text-gray-400"> → {fmt(linearLastYearMonthly)}/mnd</span>
          </p>
          <p className="text-gray-400 mt-0.5">Dalend, {(annuityRate * 100).toFixed(2).replace('.', ',')}% op resterend vermogen · {payoutYears} jr</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="age"
            tick={{ fontSize: 11 }}
            label={{ value: 'Leeftijd', position: 'insideBottom', offset: -2, fontSize: 11 }}
          />
          <YAxis
            tickFormatter={(v) => `€${(v / 1000).toFixed(0)}k`}
            tick={{ fontSize: 11 }}
          />
          <Tooltip content={(props) => <CustomTooltip {...props} mode={mode} />} />
          <Legend />
          <Bar dataKey="principal" name="Opname uit vermogen" stackId="a" fill="#3b82f6" />
          <Bar dataKey="interest" name="Rente" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      {mode === 'annuity' && (
        <p className="text-xs text-gray-400 mt-3 italic">
          Bij een lijfrente is de totale maandelijkse uitkering constant. In de beginjaren bestaat een groter deel uit rente op het nog aanwezige vermogen; later neemt het vermogensdeel toe. Bij {(annuityRate * 100).toFixed(2).replace('.', ',')}% rekenrente is het kapitaal na {payoutYears} jaar volledig opgemaakt.
        </p>
      )}
      {mode === 'linear' && (
        <p className="text-xs text-gray-400 mt-3 italic">
          Bij lineaire onttrekking wordt elk jaar een vast bedrag aan vermogen opgenomen (kapitaal ÷ {payoutYears}). Op het resterende vermogen wordt dezelfde rekenrente ({(annuityRate * 100).toFixed(2).replace('.', ',')}%) vergoed, waardoor de rentecomponent elk jaar daalt. De totale uitkering is daarmee het hoogst in het eerste jaar en neemt daarna geleidelijk af.
        </p>
      )}
    </div>
  );
}
