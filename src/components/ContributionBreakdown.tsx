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
import { useTranslation } from '../context/LanguageContext';
import type { YearlyResult } from '../types';

interface ContributionBreakdownProps {
  results: YearlyResult[];
}

const fmt = (n: number) =>
  n.toLocaleString('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });

export function ContributionBreakdown({ results }: ContributionBreakdownProps) {
  const { t } = useTranslation();

  // Show every 5 years to reduce clutter
  const data = results
    .filter((_, i) => i % 5 === 0 || i === results.length - 1)
    .map((r) => ({
      age: r.age,
      [t.contrib.employer]: Math.round(r.employerContribution),
      [t.contrib.employeeGross]: Math.round(r.employeeContribution),
      [t.contrib.taxSaving]: Math.round(r.taxSaving),
    }));

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
      <h2 className="font-semibold text-gray-800 mb-4">{t.contrib.title}</h2>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="age" tick={{ fontSize: 11 }} />
          <YAxis tickFormatter={(v) => `€${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
          <Tooltip formatter={(value: number, name: string) => [fmt(value), name]} labelFormatter={(l) => `Leeftijd ${l}`} />
          <Legend />
          <Bar dataKey={t.contrib.employer} stackId="a" fill="#3b82f6" />
          <Bar dataKey={t.contrib.employeeGross} stackId="a" fill="#93c5fd" />
          <Bar dataKey={t.contrib.taxSaving} stackId="a" fill="#bbf7d0" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
