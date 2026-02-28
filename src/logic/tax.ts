import { TAX_BRACKETS } from '../types'

/**
 * Dutch Box 1 income tax brackets for people at or above AOW retirement age (2024).
 *
 * AOW recipients no longer pay the AOW premium (17.9%), so bracket 1 is split:
 *  - Up to €40,021:          19.07%  (36.97% − 17.9% AOW premium)
 *  - €40,021 to €75,518:    36.97%  (full bracket-1 rate, premiums other than AOW)
 *  - Above €75,518:          49.50%
 *
 * The €40,021 threshold is approximate and updated annually by the Dutch government.
 */
export const PENSION_AGE_TAX_BRACKETS = [
  { limit: 40_021,   rate: 0.1907, label: 'Schijf 1a AOW-leeftijd (t/m ~€40.021)' },
  { limit: 75_518,   rate: 0.3697, label: 'Schijf 1b AOW-leeftijd (€40.021–€75.518)' },
  { limit: Infinity, rate: 0.4950, label: 'Schijf 2 AOW-leeftijd (boven €75.518)' },
] as const

/**
 * Apply a progressive bracket table to a gross income.
 * Limits are absolute (cumulative), e.g. limit=40_021 means "up to €40,021 total".
 */
function applyBrackets(
  grossIncome: number,
  brackets: ReadonlyArray<{ limit: number; rate: number }>,
): number {
  if (grossIncome <= 0) return 0
  let tax = 0
  let remaining = grossIncome
  let prevLimit = 0
  for (const bracket of brackets) {
    if (remaining <= 0) break
    const width = bracket.limit === Infinity ? remaining : bracket.limit - prevLimit
    const inBracket = Math.min(remaining, width)
    tax += inBracket * bracket.rate
    remaining -= inBracket
    prevLimit = bracket.limit
  }
  return tax
}

/**
 * Calculate Dutch Box 1 income tax (inkomstenbelasting + premies volksverzekeringen)
 * for someone below AOW retirement age.
 *
 * The two-bracket system (2024 rates):
 *  - Up to €75,518: 36.97%
 *  - Above €75,518: 49.50%
 */
export function calculateTax(grossIncome: number): number {
  return applyBrackets(grossIncome, TAX_BRACKETS)
}

/**
 * Calculate Dutch Box 1 income tax for someone at or above AOW retirement age.
 * Pension payouts (2nd pillar, 3rd pillar) and AOW are all taxed as Box 1 income,
 * but at reduced rates because AOW recipients no longer pay the AOW premium.
 */
export function calculateRetirementTax(grossPension: number): number {
  return applyBrackets(grossPension, PENSION_AGE_TAX_BRACKETS)
}

/**
 * Returns the marginal tax rate for the given gross income.
 * Used to calculate the tax saving on pension contributions.
 */
export function getMarginalRate(grossIncome: number): number {
  return grossIncome > TAX_BRACKETS[0].limit
    ? TAX_BRACKETS[1].rate
    : TAX_BRACKETS[0].rate
}

/**
 * Calculate tax after deducting the pension contribution from taxable income.
 * Pension employee contributions reduce Box 1 taxable income.
 */
export function calculateTaxWithPensionDeduction(
  grossIncome: number,
  employeeContribution: number
): number {
  const taxableIncome = Math.max(0, grossIncome - employeeContribution)
  return calculateTax(taxableIncome)
}

/**
 * The monetary tax benefit of making an employee pension contribution.
 * = tax without contribution - tax with contribution
 */
export function calcTaxSaving(
  grossIncome: number,
  employeeContribution: number
): number {
  const taxWithout = calculateTax(grossIncome)
  const taxWith = calculateTaxWithPensionDeduction(grossIncome, employeeContribution)
  return taxWithout - taxWith
}
