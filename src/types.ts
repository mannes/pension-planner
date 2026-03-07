export interface SimParams {
  grossSalary: number;
  startingAge: number;
  salaryGrowthRate: number;
  employerPct: number;
  employeePct: number;
  extraSavingsMonthly: number;
  franchise: number;
  franchiseGrowthRate: number;
  inflationRate: number;
  aowMonthly: number;
  aowPartnerStatus: 'single' | 'partner';
  annuityRate: number;
  payoutYears: number;
}

export interface YearlyResult {
  year: number;
  age: number;
  grossSalary: number;
  pensioengrondslag: number;
  employerContribution: number;
  employeeContribution: number;
  taxSaving: number;
  extraSavingsGross: number;
  extraSavingsTaxSaving: number;
  capital2Bad: number;
  capital2Normal: number;
  capital2Good: number;
  capital3Bad: number;
  capital3Normal: number;
  capital3Good: number;
}

export const AOW_AGE = 68;
/** AOW franchise per 1 january 2026 (Centraal Aanspreekpunt Pensioenen, V&A 25-008) */
export const FRANCHISE_2026 = 19172;
export const MAX_PENSIOENGEVEND_LOON = 137800;

export const DEFAULT_PARAMS: SimParams = {
  grossSalary: 60000,
  startingAge: 32,
  salaryGrowthRate: 0.02,
  employerPct: 0.1,
  employeePct: 0.05,
  extraSavingsMonthly: 0,
  franchise: FRANCHISE_2026,
  franchiseGrowthRate: 0.015,
  inflationRate: 0.02,
  aowMonthly: 1650, // alleenstaand, approx. Jan 2026 (SVB)
  aowPartnerStatus: 'single',
  annuityRate: 0.015,
  payoutYears: 20,
};

/**
 * Box 1 – working age (≤66) – 2026
 * Source: Belastingdienst, box-1 tarieven 2026
 *   Schijf 1: t/m €38.883 → 35,75%
 *   Schijf 2: €38.883 – €78.426 → 37,56%
 *   Schijf 3: > €78.426 → 49,50%
 */
export const TAX_BRACKETS_WORKING = [
  { limit: 38883, rate: 0.3575 },
  { limit: 78426, rate: 0.3756 },
  { limit: Infinity, rate: 0.495 },
];

/**
 * Box 1 – AOW-gerechtigden (≥68) – 2026
 * No AOW-premium on schijf 1 → 17,85% instead of 35,75%.
 * Schijf 2 and 3 unchanged vs. working age.
 */
export const TAX_BRACKETS_RETIREMENT = [
  { limit: 38883, rate: 0.1785 },
  { limit: 78426, rate: 0.3756 },
  { limit: Infinity, rate: 0.495 },
];
