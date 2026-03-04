import { describe, it, expect } from 'vitest';
import {
  calculateTax,
  getMarginalRate,
  calculateTaxWithPensionDeduction,
  calcTaxSaving,
  calculateRetirementTax,
} from '../tax';

// 2026 brackets (working age):  schijf 1 t/m €38.883 @ 35.75%
//                                schijf 2 €38.883–€78.426 @ 37.56%
//                                schijf 3 > €78.426 @ 49.50%
// 2026 brackets (retirement):   schijf 1 t/m €38.883 @ 17.85%
//                                schijf 2 €38.883–€78.426 @ 37.56%
//                                schijf 3 > €78.426 @ 49.50%

describe('calculateTax (working age)', () => {
  it('zero income', () => expect(calculateTax(0)).toBe(0));
  it('income fully within schijf 1', () => {
    expect(calculateTax(30000)).toBeCloseTo(30000 * 0.3575, 2);
  });
  it('income exactly at schijf 1 limit', () => {
    expect(calculateTax(38883)).toBeCloseTo(38883 * 0.3575, 2);
  });
  it('income spanning schijf 1 and 2', () => {
    const expected = 38883 * 0.3575 + (60000 - 38883) * 0.3756;
    expect(calculateTax(60000)).toBeCloseTo(expected, 2);
  });
  it('income above schijf 2 limit (into schijf 3)', () => {
    const expected = 38883 * 0.3575 + (78426 - 38883) * 0.3756 + (90000 - 78426) * 0.495;
    expect(calculateTax(90000)).toBeCloseTo(expected, 2);
  });
  it('high income well above all brackets', () => {
    const expected = 38883 * 0.3575 + (78426 - 38883) * 0.3756 + (200000 - 78426) * 0.495;
    expect(calculateTax(200000)).toBeCloseTo(expected, 2);
  });
});

describe('calculateTax (retirement age)', () => {
  it('zero income', () => expect(calculateTax(0, true)).toBe(0));
  it('income fully within schijf 1', () => {
    expect(calculateTax(20000, true)).toBeCloseTo(20000 * 0.1785, 2);
  });
  it('income exactly at schijf 1 limit', () => {
    expect(calculateTax(38883, true)).toBeCloseTo(38883 * 0.1785, 2);
  });
  it('income spanning schijf 1 and 2', () => {
    const expected = 38883 * 0.1785 + (60000 - 38883) * 0.3756;
    expect(calculateTax(60000, true)).toBeCloseTo(expected, 2);
  });
  it('income spanning all three retirement brackets', () => {
    const expected =
      38883 * 0.1785 + (78426 - 38883) * 0.3756 + (100000 - 78426) * 0.495;
    expect(calculateTax(100000, true)).toBeCloseTo(expected, 2);
  });
});

describe('getMarginalRate', () => {
  it('schijf 1 working', () => expect(getMarginalRate(30000)).toBe(0.3575));
  it('schijf 2 working', () => expect(getMarginalRate(60000)).toBe(0.3756));
  it('schijf 3 working', () => expect(getMarginalRate(80000)).toBe(0.495));
  it('at exactly schijf 1 limit working', () => expect(getMarginalRate(38883)).toBe(0.3575));
  it('schijf 1 retirement', () => expect(getMarginalRate(20000, true)).toBe(0.1785));
  it('schijf 2 retirement', () => expect(getMarginalRate(50000, true)).toBe(0.3756));
  it('schijf 3 retirement', () => expect(getMarginalRate(100000, true)).toBe(0.495));
});

describe('calculateTaxWithPensionDeduction', () => {
  it('reduces taxable income by employee contribution', () => {
    const salary = 60000;
    const contribution = 1500;
    const expected = calculateTax(salary - contribution);
    expect(calculateTaxWithPensionDeduction(salary, contribution)).toBeCloseTo(expected, 2);
  });
  it('handles contribution larger than salary gracefully', () => {
    expect(calculateTaxWithPensionDeduction(1000, 2000)).toBe(0);
  });
});

describe('calcTaxSaving', () => {
  it('positive saving for standard inputs (schijf 2 salary)', () => {
    const saving = calcTaxSaving(60000, 1500);
    expect(saving).toBeGreaterThan(0);
    // 60k is in schijf 2 (>38883), marginal rate 37.56%
    expect(saving).toBeCloseTo(1500 * 0.3756, 2);
  });
  it('saving at schijf 1 salary', () => {
    // 30k is in schijf 1, marginal rate 35.75%
    expect(calcTaxSaving(30000, 1000)).toBeCloseTo(1000 * 0.3575, 2);
  });
  it('zero saving when contribution is zero', () => {
    expect(calcTaxSaving(60000, 0)).toBeCloseTo(0, 2);
  });
  it('larger saving for higher-bracket salary', () => {
    const schijf1Saving = calcTaxSaving(30000, 2000);
    const schijf3Saving = calcTaxSaving(100000, 2000);
    expect(schijf3Saving).toBeGreaterThan(schijf1Saving);
  });
});

describe('calculateRetirementTax', () => {
  it('uses retirement bracket (schijf 1)', () => {
    expect(calculateRetirementTax(20000)).toBeCloseTo(20000 * 0.1785, 2);
  });
  it('progressive at higher amounts', () => {
    const low = calculateRetirementTax(30000);
    const high = calculateRetirementTax(60000);
    expect(high / 60000).toBeGreaterThan(low / 30000);
  });
});

describe('calculateTax edge cases', () => {
  it('negative income treated as zero', () => expect(calculateTax(-1000)).toBe(0));
  it('exactly zero retirement', () => expect(calculateTax(0, true)).toBe(0));
  it('schijf 1→2 boundary working (38884)', () => {
    const expected = 38883 * 0.3575 + 1 * 0.3756;
    expect(calculateTax(38884)).toBeCloseTo(expected, 2);
  });
  it('schijf 2→3 boundary working (78427)', () => {
    const expected = 38883 * 0.3575 + (78426 - 38883) * 0.3756 + 1 * 0.495;
    expect(calculateTax(78427)).toBeCloseTo(expected, 2);
  });
  it('schijf 1→2 boundary retirement (38884)', () => {
    const expected = 38883 * 0.1785 + 1 * 0.3756;
    expect(calculateTax(38884, true)).toBeCloseTo(expected, 2);
  });
  it('marginal rate at zero income working', () => {
    expect(getMarginalRate(0)).toBe(0.3575);
  });
  it('marginal rate at zero income retirement', () => {
    expect(getMarginalRate(0, true)).toBe(0.1785);
  });
  it('calcTaxSaving matches schijf 2 marginal rate', () => {
    // 60k salary → schijf 2 → 37.56%
    const saving = calcTaxSaving(60000, 1000);
    expect(saving).toBeCloseTo(1000 * 0.3756, 2);
  });
  it('calcTaxSaving crosses schijf 2→3 boundary', () => {
    // salary 79000 → contribution 1000 → straddles 78426 boundary
    const saving = calcTaxSaving(79000, 1000);
    const expected = calculateTax(79000) - calculateTax(78000);
    expect(saving).toBeCloseTo(expected, 2);
  });
  it('retirement tax zero income', () => {
    expect(calculateRetirementTax(0)).toBe(0);
  });
});
