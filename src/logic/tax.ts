import { TAX_BRACKETS } from '../types'

/**
 * Calculate Dutch Box 1 income tax (inkomstenbelasting + premies volksverzekeringen)
 * for someone below AOW retirement age.
 *
 * The two-bracket system (2024 rates):
 *  - Up to €75,518: 36.97%
 *  - Above €75,518: 49.50%
 */
export function calculateTax(grossIncome: number): number {
  let tax = 0
  let remaining = grossIncome

  const [bracket1, bracket2] = TAX_BRACKETS

  if (remaining <= 0) return 0

  const inBracket1 = Math.min(remaining, bracket1.limit)
  tax += inBracket1 * bracket1.rate
  remaining -= inBracket1

  if (remaining > 0) {
    tax += remaining * bracket2.rate
  }

  return tax
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
