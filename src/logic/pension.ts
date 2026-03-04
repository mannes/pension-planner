import { MAX_PENSIOENGEVEND_LOON } from '../types';

export function calcPensioengrondslag(
  grossSalary: number,
  franchise: number
): number {
  return Math.max(0, grossSalary - franchise);
}

export function calcJaarruimte(
  grossSalary: number,
  franchise: number,
  employerContribution: number,
  employeeContribution: number
): number {
  const cappedSalary = Math.min(grossSalary, MAX_PENSIOENGEVEND_LOON);
  const grondslagCapped = Math.max(0, cappedSalary - franchise);
  const grossSpace = 0.3 * grondslagCapped;
  const pillar2 = employerContribution + employeeContribution;
  return Math.max(0, grossSpace - pillar2);
}

export interface ContributionBreakdown {
  pensioengrondslag: number;
  employerGross: number;
  employeeGross: number;
  taxSaving: number;
  netEmployeeCost: number;
  totalFunded: number;
  leverageRatio: number;
}

export function calcContributions(
  grossSalary: number,
  franchise: number,
  employerPct: number,
  employeePct: number,
  marginalTaxRate: number
): ContributionBreakdown {
  const pensioengrondslag = calcPensioengrondslag(grossSalary, franchise);
  const employerGross = employerPct * pensioengrondslag;
  const employeeGross = employeePct * pensioengrondslag;
  const taxSaving = employeeGross * marginalTaxRate;
  const netEmployeeCost = employeeGross - taxSaving;
  const totalFunded = employerGross + employeeGross;
  const leverageRatio = netEmployeeCost > 0 ? totalFunded / netEmployeeCost : 0;
  return {
    pensioengrondslag,
    employerGross,
    employeeGross,
    taxSaving,
    netEmployeeCost,
    totalFunded,
    leverageRatio,
  };
}
