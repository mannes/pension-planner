import { SimParams, YearlyResult, AOW_AGE } from '../types';
import { getMarginalRate } from './tax';
import { calcPensioengrondslag } from './pension';

export const ANNUITY_RATE = 0.015;
const SCENARIOS = { bad: 0.02, normal: 0.05, good: 0.08 };

export function toReal(nominal: number, inflationRate: number, years: number): number {
  return nominal / Math.pow(1 + inflationRate, years);
}

export function estimateMonthlyPension(
  capital: number,
  annuityRate: number = ANNUITY_RATE,
  years: number = 20
): number {
  if (capital <= 0) return 0;
  const r = annuityRate / 12;
  const n = years * 12;
  return (capital * r) / (1 - Math.pow(1 + r, -n));
}

export function runSimulation(params: SimParams): YearlyResult[] {
  const {
    grossSalary,
    startingAge,
    salaryGrowthRate,
    employerPct,
    employeePct,
    extraSavingsMonthly,
    franchise,
    franchiseGrowthRate,
    inflationRate: _inflationRate,
  } = params;

  void _inflationRate;

  const years = Math.max(5, Math.min(45, AOW_AGE - startingAge));
  const results: YearlyResult[] = [];

  let cap2Bad = 0, cap2Normal = 0, cap2Good = 0;
  let cap3Bad = 0, cap3Normal = 0, cap3Good = 0;

  for (let y = 0; y < years; y++) {
    const salary = grossSalary * Math.pow(1 + salaryGrowthRate, y);
    const currentFranchise = franchise * Math.pow(1 + franchiseGrowthRate, y);
    const grondslag = calcPensioengrondslag(salary, currentFranchise);

    const employerC = employerPct * grondslag;
    const employeeC = employeePct * grondslag;
    const marginal = getMarginalRate(salary);
    const taxSaving = employeeC * marginal;

    const extraAnnual = extraSavingsMonthly * 12;
    const extraTaxSaving = extraAnnual * marginal;

    // Compound prior capital, then add contributions
    cap2Bad = cap2Bad * (1 + SCENARIOS.bad) + (employerC + employeeC);
    cap2Normal = cap2Normal * (1 + SCENARIOS.normal) + (employerC + employeeC);
    cap2Good = cap2Good * (1 + SCENARIOS.good) + (employerC + employeeC);

    cap3Bad = cap3Bad * (1 + SCENARIOS.bad) + extraAnnual;
    cap3Normal = cap3Normal * (1 + SCENARIOS.normal) + extraAnnual;
    cap3Good = cap3Good * (1 + SCENARIOS.good) + extraAnnual;

    results.push({
      year: y + 1,
      age: startingAge + y + 1,
      grossSalary: salary,
      pensioengrondslag: grondslag,
      employerContribution: employerC,
      employeeContribution: employeeC,
      taxSaving,
      extraSavingsGross: extraAnnual,
      extraSavingsTaxSaving: extraTaxSaving,
      capital2Bad: cap2Bad,
      capital2Normal: cap2Normal,
      capital2Good: cap2Good,
      capital3Bad: cap3Bad,
      capital3Normal: cap3Normal,
      capital3Good: cap3Good,
    });
  }

  return results;
}
