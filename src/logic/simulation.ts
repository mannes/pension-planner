import { SimParams, YearlyResult, RETURN_RATES } from '../types'
import { calcContributions } from './pension'
import { getMarginalRate } from './tax'

/**
 * Run the full 30-year pension simulation.
 *
 * Each year:
 * 1. Salary grows by salaryGrowthRate
 * 2. Franchise grows by franchiseGrowthRate
 * 3. Contributions are calculated on the pensioengrondslag
 * 4. Accumulated capital earns the annual return, then this year's contribution is added
 *
 * Capital formula:  capital[y] = (capital[y-1] + contribution[y]) * (1 + returnRate)
 * (Contribution is added at start of year, then grows for the year)
 */
export function runSimulation(params: SimParams): YearlyResult[] {
  const {
    startingSalary,
    salaryGrowthRate,
    employerPct,
    employeePct,
    extraSavingsMonthly,
    franchise,
    franchiseGrowthRate,
    years,
  } = params

  const results: YearlyResult[] = []
  let capitalBad = 0
  let capitalNormal = 0
  let capitalGood = 0
  let capitalBadThird = 0
  let capitalNormalThird = 0
  let capitalGoodThird = 0

  for (let y = 1; y <= years; y++) {
    const grossSalary = startingSalary * Math.pow(1 + salaryGrowthRate, y - 1)
    const currentFranchise = franchise * Math.pow(1 + franchiseGrowthRate, y - 1)
    const marginalRate = getMarginalRate(grossSalary)

    const breakdown = calcContributions(
      grossSalary,
      currentFranchise,
      employerPct,
      employeePct
    )

    const totalContribution = breakdown.totalFunded

    // 3rd pillar: extra personal savings (monthly → annual)
    const extraAnnual = extraSavingsMonthly * 12
    const extraTaxBenefit = extraAnnual * marginalRate  // simplified: full deduction at marginal rate
    const extraNetCost = extraAnnual - extraTaxBenefit

    // Compound growth for 2nd pillar
    capitalBad    = capitalBad    * (1 + RETURN_RATES.bad)    + totalContribution
    capitalNormal = capitalNormal * (1 + RETURN_RATES.normal) + totalContribution
    capitalGood   = capitalGood   * (1 + RETURN_RATES.good)   + totalContribution

    // Compound growth for 3rd pillar
    capitalBadThird    = capitalBadThird    * (1 + RETURN_RATES.bad)    + extraAnnual
    capitalNormalThird = capitalNormalThird * (1 + RETURN_RATES.normal) + extraAnnual
    capitalGoodThird   = capitalGoodThird   * (1 + RETURN_RATES.good)   + extraAnnual

    results.push({
      year: y,
      grossSalary,
      pensioengrondslag: breakdown.pensioengrondslag,
      franchise: currentFranchise,
      marginalTaxRate: marginalRate,
      employerContribution: breakdown.employerContribution,
      employeeContributionGross: breakdown.employeeContributionGross,
      taxSaving: breakdown.taxSaving,
      netEmployeeCost: breakdown.netEmployeeCost,
      totalAnnualContribution: totalContribution,
      extraSavingsAnnual: extraAnnual,
      extraSavingsTaxBenefit: extraTaxBenefit,
      extraSavingsNetCost: extraNetCost,
      capitalBad,
      capitalNormal,
      capitalGood,
      capitalBadThird,
      capitalNormalThird,
      capitalGoodThird,
    })
  }

  return results
}

/**
 * Adjust a nominal value to real (inflation-adjusted) purchasing power.
 * referenceYear = 0 means year 1 = slight adjustment, year 30 = significant.
 */
export function toReal(nominalValue: number, year: number, inflationRate: number): number {
  return nominalValue / Math.pow(1 + inflationRate, year)
}

/**
 * Estimate a rough monthly pension payout assuming the capital is spread over 20 years
 * with the same return rate continuing during drawdown.
 * This is a simplified annuity calculation.
 */
export function estimateMonthlyPension(capital: number, annualReturn: number): number {
  const years = 20
  const monthlyRate = annualReturn / 12
  const n = years * 12
  if (monthlyRate === 0) return capital / n
  // Standard annuity formula: PMT = PV * r / (1 - (1+r)^-n)
  return capital * monthlyRate / (1 - Math.pow(1 + monthlyRate, -n))
}
