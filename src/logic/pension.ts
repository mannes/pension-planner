import { getMarginalRate } from './tax'

// Maximum pensionable salary (maximaal pensioengevend loon) for jaarruimte calculation (2024/2025)
export const MAX_PENSIOENGEVEND_LOON = 137_800

/**
 * The pensioengrondslag (pension base) is the part of your salary
 * on which pension is accrued. It equals gross salary minus the AOW-franchise.
 *
 * The franchise exists because the government already provides a basic pension
 * (AOW) to everyone. Your employer's pension plan only supplements above that.
 */
export function calcPensioengrondslag(
  grossSalary: number,
  franchise: number
): number {
  return Math.max(0, grossSalary - franchise)
}

export interface ContributionBreakdown {
  pensioengrondslag: number
  employerContribution: number       // employer's share in €
  employeeContributionGross: number  // employee's gross contribution in €
  taxSaving: number                  // tax relief the employee receives
  netEmployeeCost: number            // what the employee actually pays after tax relief
  totalFunded: number                // employer + employee gross (what enters the pension pot)
  marginalTaxRate: number
  leverageRatio: number              // totalFunded / netEmployeeCost
}

export interface JaarruimteResult {
  grossJaarruimte: number      // 30% × premiegrondslag (capped at max pensioengevend loon)
  pillar2Reduction: number     // employer + employee contributions (DC approximation for 6.27 × A)
  availableForThird: number    // max(0, gross − pillar2 reduction)
}

/**
 * Calculate the jaarruimte (annual space) for tax-deductible 3rd-pillar contributions.
 *
 * Formula (post-WTP, from 2024):
 *   Gross jaarruimte = 30% × (min(salary, MAX_PENSIOENGEVEND_LOON) − franchise)
 *   Reduction for 2nd pillar DC plan ≈ total contributions (employer + employee)
 *   Available for 3rd pillar = max(0, gross − reduction)
 *
 * The exact reduction uses 6.27 × Factor_A (annual pension accrual). For DC plans this
 * approximates to total contributions; actual results may differ slightly.
 */
export function calcJaarruimte(
  grossSalary: number,
  franchise: number,
  employerContrib: number,  // employer contribution in € for this year
  employeeContrib: number,  // employee contribution in € for this year
): JaarruimteResult {
  const cappedSalary = Math.min(grossSalary, MAX_PENSIOENGEVEND_LOON)
  const premiegrondslag = Math.max(0, cappedSalary - franchise)
  const grossJaarruimte = 0.30 * premiegrondslag
  const pillar2Reduction = employerContrib + employeeContrib
  const availableForThird = Math.max(0, grossJaarruimte - pillar2Reduction)
  return { grossJaarruimte, pillar2Reduction, availableForThird }
}

/**
 * Calculate the full contribution breakdown for one year.
 *
 * Because pension contributions are deducted from gross salary before income tax
 * is calculated, the employee gets a "tax discount" on their contribution.
 * At a 36.97% marginal rate, a €1,000 contribution only costs €630 net.
 */
export function calcContributions(
  grossSalary: number,
  franchise: number,
  employerPct: number,
  employeePct: number
): ContributionBreakdown {
  const pensioengrondslag = calcPensioengrondslag(grossSalary, franchise)
  const employerContribution = pensioengrondslag * employerPct
  const employeeContributionGross = pensioengrondslag * employeePct
  const marginalTaxRate = getMarginalRate(grossSalary)
  // Use the actual marginal rate: the pension contribution saves exactly
  // marginalRate × contribution in taxes (assuming the contribution fits within
  // one bracket, which is true for most realistic salaries/contributions)
  const taxSaving = employeeContributionGross * marginalTaxRate
  const netEmployeeCost = employeeContributionGross - taxSaving
  const totalFunded = employerContribution + employeeContributionGross
  const leverageRatio = netEmployeeCost > 0 ? totalFunded / netEmployeeCost : 0

  return {
    pensioengrondslag,
    employerContribution,
    employeeContributionGross,
    taxSaving,
    netEmployeeCost,
    totalFunded,
    marginalTaxRate,
    leverageRatio,
  }
}
