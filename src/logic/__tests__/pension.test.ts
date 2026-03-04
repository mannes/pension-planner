import { describe, it, expect } from 'vitest';
import {
  calcPensioengrondslag,
  calcJaarruimte,
  calcContributions,
} from '../pension';

const FRANCHISE = 17545;

describe('calcPensioengrondslag', () => {
  it('normal salary above franchise', () => {
    expect(calcPensioengrondslag(60000, FRANCHISE)).toBeCloseTo(42455, 0);
  });
  it('salary below franchise returns 0', () => {
    expect(calcPensioengrondslag(10000, FRANCHISE)).toBe(0);
  });
  it('salary exactly at franchise returns 0', () => {
    expect(calcPensioengrondslag(FRANCHISE, FRANCHISE)).toBe(0);
  });
  it('salary just above franchise', () => {
    expect(calcPensioengrondslag(FRANCHISE + 1, FRANCHISE)).toBeCloseTo(1, 1);
  });
  it('high salary', () => {
    expect(calcPensioengrondslag(200000, FRANCHISE)).toBe(200000 - FRANCHISE);
  });
  it('zero salary', () => {
    expect(calcPensioengrondslag(0, FRANCHISE)).toBe(0);
  });
});

describe('calcJaarruimte', () => {
  it('returns positive value for normal inputs', () => {
    const jaarruimte = calcJaarruimte(60000, FRANCHISE, 900, 1500);
    expect(jaarruimte).toBeGreaterThan(0);
  });
  it('capped at MAX_PENSIOENGEVEND_LOON (137800)', () => {
    const highSalary = calcJaarruimte(200000, FRANCHISE, 0, 0);
    const cappedSalary = calcJaarruimte(137800, FRANCHISE, 0, 0);
    expect(highSalary).toBeCloseTo(cappedSalary, 0);
  });
  it('reduces by pillar 2 contributions', () => {
    const without = calcJaarruimte(60000, FRANCHISE, 0, 0);
    const with2nd = calcJaarruimte(60000, FRANCHISE, 900, 1500);
    expect(with2nd).toBeCloseTo(without - 2400, 0);
  });
  it('returns 0 when 2nd pillar exceeds gross space', () => {
    expect(calcJaarruimte(60000, FRANCHISE, 50000, 50000)).toBe(0);
  });
  it('salary below franchise results in 0', () => {
    expect(calcJaarruimte(10000, FRANCHISE, 0, 0)).toBe(0);
  });
  it('exact formula: 30% of capped grondslag', () => {
    const grondslag = Math.min(60000, 137800) - FRANCHISE; // 42455
    const expected = 0.3 * grondslag;
    expect(calcJaarruimte(60000, FRANCHISE, 0, 0)).toBeCloseTo(expected, 0);
  });
});

describe('calcContributions', () => {
  const salary = 60000;
  const franchise = FRANCHISE;
  const empR = 0.015;
  const empE = 0.025;
  const marginal = 0.3697;

  it('pensioengrondslag correct', () => {
    const r = calcContributions(salary, franchise, empR, empE, marginal);
    expect(r.pensioengrondslag).toBeCloseTo(42455, 0);
  });
  it('employer gross = empR * grondslag', () => {
    const r = calcContributions(salary, franchise, empR, empE, marginal);
    expect(r.employerGross).toBeCloseTo(0.015 * 42455, 1);
  });
  it('employee gross = empE * grondslag', () => {
    const r = calcContributions(salary, franchise, empR, empE, marginal);
    expect(r.employeeGross).toBeCloseTo(0.025 * 42455, 1);
  });
  it('tax saving = employeeGross * marginal', () => {
    const r = calcContributions(salary, franchise, empR, empE, marginal);
    expect(r.taxSaving).toBeCloseTo(r.employeeGross * marginal, 2);
  });
  it('net cost = employeeGross - taxSaving', () => {
    const r = calcContributions(salary, franchise, empR, empE, marginal);
    expect(r.netEmployeeCost).toBeCloseTo(r.employeeGross - r.taxSaving, 2);
  });
  it('totalFunded = employer + employee gross', () => {
    const r = calcContributions(salary, franchise, empR, empE, marginal);
    expect(r.totalFunded).toBeCloseTo(r.employerGross + r.employeeGross, 2);
  });
  it('leverageRatio = totalFunded / netCost', () => {
    const r = calcContributions(salary, franchise, empR, empE, marginal);
    expect(r.leverageRatio).toBeCloseTo(r.totalFunded / r.netEmployeeCost, 4);
  });
  it('leverage > 1 because employer contributes and tax saves', () => {
    const r = calcContributions(salary, franchise, empR, empE, marginal);
    expect(r.leverageRatio).toBeGreaterThan(1);
  });
  it('zero franchise contribution pcts → 0 leverage', () => {
    const r = calcContributions(salary, franchise, 0, 0, marginal);
    expect(r.leverageRatio).toBe(0);
    expect(r.totalFunded).toBe(0);
  });
  it('salary below franchise → 0 contributions', () => {
    const r = calcContributions(10000, franchise, empR, empE, marginal);
    expect(r.pensioengrondslag).toBe(0);
    expect(r.employerGross).toBe(0);
    expect(r.employeeGross).toBe(0);
  });
  // Additional tests to reach 27
  it('high tax rate increases tax saving', () => {
    const rLow = calcContributions(salary, franchise, empR, empE, 0.3697);
    const rHigh = calcContributions(salary, franchise, empR, empE, 0.495);
    expect(rHigh.taxSaving).toBeGreaterThan(rLow.taxSaving);
  });
  it('high tax rate reduces net cost', () => {
    const rLow = calcContributions(salary, franchise, empR, empE, 0.3697);
    const rHigh = calcContributions(salary, franchise, empR, empE, 0.495);
    expect(rHigh.netEmployeeCost).toBeLessThan(rLow.netEmployeeCost);
  });
  it('total funded unchanged by tax rate', () => {
    const rLow = calcContributions(salary, franchise, empR, empE, 0.3697);
    const rHigh = calcContributions(salary, franchise, empR, empE, 0.495);
    expect(rHigh.totalFunded).toBeCloseTo(rLow.totalFunded, 2);
  });
  it('employer-only contribution', () => {
    const r = calcContributions(salary, franchise, 0.10, 0, 0.3697);
    expect(r.employeeGross).toBe(0);
    expect(r.taxSaving).toBe(0);
    expect(r.netEmployeeCost).toBe(0);
    expect(r.leverageRatio).toBe(0);
  });
  it('employee-only contribution', () => {
    const r = calcContributions(salary, franchise, 0, 0.10, 0.3697);
    expect(r.employerGross).toBe(0);
    expect(r.leverageRatio).toBeCloseTo(r.totalFunded / r.netEmployeeCost, 4);
  });
  it('zero salary', () => {
    const r = calcContributions(0, franchise, empR, empE, marginal);
    expect(r.pensioengrondslag).toBe(0);
    expect(r.totalFunded).toBe(0);
  });
  it('very high salary', () => {
    const r = calcContributions(300000, franchise, empR, empE, marginal);
    expect(r.pensioengrondslag).toBe(300000 - franchise);
  });
});
