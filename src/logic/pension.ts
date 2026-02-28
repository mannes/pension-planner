import { getMarginalRate } from './tax'

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
