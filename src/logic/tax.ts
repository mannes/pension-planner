import { TAX_BRACKETS_WORKING, TAX_BRACKETS_RETIREMENT } from '../types';

export function calculateTax(income: number, retirement = false): number {
  const brackets = retirement ? TAX_BRACKETS_RETIREMENT : TAX_BRACKETS_WORKING;
  let tax = 0;
  let prev = 0;
  for (const { limit, rate } of brackets) {
    if (income <= prev) break;
    tax += (Math.min(income, limit) - prev) * rate;
    prev = limit;
  }
  return tax;
}

export function getMarginalRate(income: number, retirement = false): number {
  const brackets = retirement ? TAX_BRACKETS_RETIREMENT : TAX_BRACKETS_WORKING;
  let prev = 0;
  for (const { limit, rate } of brackets) {
    if (income <= limit) return rate;
    prev = limit;
    void prev;
  }
  return brackets[brackets.length - 1].rate;
}

export function calculateTaxWithPensionDeduction(
  grossSalary: number,
  employeeContribution: number
): number {
  return calculateTax(Math.max(0, grossSalary - employeeContribution));
}

export function calcTaxSaving(
  grossSalary: number,
  employeeContribution: number
): number {
  return (
    calculateTax(grossSalary) -
    calculateTaxWithPensionDeduction(grossSalary, employeeContribution)
  );
}

export function calculateRetirementTax(annualPension: number): number {
  return calculateTax(annualPension, true);
}
