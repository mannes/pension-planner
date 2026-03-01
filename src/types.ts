export const AOW_AGE = 67

export interface SimParams {
  startingSalary: number        // Annual gross salary at year 0 (€)
  startingAge: number           // Current age; years = AOW_AGE − startingAge (clamped 5–45)
  salaryGrowthRate: number      // Annual salary increase, decimal (e.g. 0.02)
  employerPct: number           // Employer contribution % of pensioengrondslag
  employeePct: number           // Employee contribution % of pensioengrondslag
  extraSavingsMonthly: number   // 3rd pillar: extra personal monthly savings (€)
  franchise: number             // AOW-franchise (€), excluded from pension base
  franchiseGrowthRate: number   // Annual franchise increase (approx CPI-linked)
  inflationRate: number         // For real-value conversion
  years: number                 // Simulation period (derived: AOW_AGE − startingAge)
  aowMonthly: number            // Estimated AOW monthly payout (for income comparison)
}

export interface YearlyResult {
  year: number
  grossSalary: number
  pensioengrondslag: number
  franchise: number
  marginalTaxRate: number
  // 2nd pillar (employer scheme)
  employerContribution: number
  employeeContributionGross: number
  taxSaving: number             // employee contribution × marginal tax rate
  netEmployeeCost: number       // employeeContributionGross - taxSaving
  totalAnnualContribution: number
  // 3rd pillar (extra personal savings)
  extraSavingsAnnual: number
  extraSavingsTaxBenefit: number
  extraSavingsNetCost: number
  // Accumulated 2nd pillar capital (end of year, compound)
  capitalBad: number            // 2% return
  capitalNormal: number         // 5% return
  capitalGood: number           // 8% return
  // Accumulated 3rd pillar capital
  capitalBadThird: number
  capitalNormalThird: number
  capitalGoodThird: number
}

export const RETURN_RATES = {
  bad: 0.02,
  normal: 0.05,
  good: 0.08,
} as const

export type ReturnScenario = keyof typeof RETURN_RATES

export const DEFAULT_PARAMS: SimParams = {
  startingSalary: 60_000,
  startingAge: 32,             // → 35 years until AOW at 67
  salaryGrowthRate: 0.02,
  employerPct: 0.10,
  employeePct: 0.05,
  extraSavingsMonthly: 0,
  franchise: 17_545,
  franchiseGrowthRate: 0.015,
  inflationRate: 0.02,
  years: 35,
  aowMonthly: 1_400,
}

// Dutch Box 1 income tax brackets (2024/2025 rates, below AOW age)
export const TAX_BRACKETS = [
  { limit: 75_518, rate: 0.3697, label: 'Schijf 1 (t/m €75.518)' },
  { limit: Infinity, rate: 0.4950, label: 'Schijf 2 (boven €75.518)' },
] as const
