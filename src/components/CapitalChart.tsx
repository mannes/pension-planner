import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { useTranslation } from '../context/LanguageContext';
import type { YearlyResult } from '../types';
import { toReal } from '../logic/simulation';

interface CapitalChartProps {
  results: YearlyResult[];
  showReal: boolean;
  inflationRate: number;
}

const fmt = (n: number) =>
  n.toLocaleString('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });

export function CapitalChart({ results, showReal, inflationRate }: CapitalChartProps) {
  const { t } = useTranslation();

  const data = results.map((r) => {
    const factor = showReal ? (v: number) => toReal(v, inflationRate, r.year) : (v: number) => v;
    return {
      age: r.age,
      [t.chart.bad]: Math.round(factor(r.capital2Bad + r.capital3Bad)),
      [t.chart.normal]: Math.round(factor(r.capital2Normal + r.capital3Normal)),
      [t.chart.good]: Math.round(factor(r.capital2Good + r.capital3Good)),
    };
  });

  const midAge = results.length > 0
    ? results[Math.floor(results.length / 2)]?.age
    : undefined;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5" data-guide-step="2">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-800">{t.chart.title}</h2>
        {showReal && (
          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
            {t.real}
          </span>
        )}
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="age"
            label={{ value: t.chart.year, position: 'insideBottom', offset: -2 }}
            tick={{ fontSize: 11 }}
          />
          <YAxis
            tickFormatter={(v) => `€${(v / 1000).toFixed(0)}k`}
            tick={{ fontSize: 11 }}
          />
          <Tooltip
            formatter={(value: number, name: string) => [fmt(value), name]}
            labelFormatter={(label) => `Leeftijd ${label}`}
          />
          <Legend />
          {midAge !== undefined && (
            <ReferenceLine
              x={midAge}
              stroke="#94a3b8"
              strokeDasharray="4 4"
              label={{ value: t.chart.midpoint, position: 'top', fontSize: 10, fill: '#94a3b8' }}
            />
          )}
          <Line
            type="monotone"
            dataKey={t.chart.bad}
            stroke="#ef4444"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey={t.chart.normal}
            stroke="#3b82f6"
            strokeWidth={2.5}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey={t.chart.good}
            stroke="#22c55e"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
