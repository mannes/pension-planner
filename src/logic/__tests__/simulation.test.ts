import { describe, it, expect } from 'vitest';
import { runSimulation, toReal, estimateMonthlyPension, ANNUITY_RATE } from '../simulation';
import type { SimParams } from '../../types';

const BASE: SimParams = {
  grossSalary: 60000,
  startingAge: 32,
  salaryGrowthRate: 0.02,
  employerPct: 0.015,
  employeePct: 0.025,
  extraSavingsMonthly: 0,
  franchise: 17545,
  franchiseGrowthRate: 0.015,
  inflationRate: 0.02,
  aowMonthly: 1400,
  aowPartnerStatus: 'single',
  annuityRate: 0.015,
  payoutYears: 20,
};

describe('toReal', () => {
  it('year 0 is unchanged', () => expect(toReal(1000, 0.02, 0)).toBeCloseTo(1000, 2));
  it('deflates by inflation', () => expect(toReal(1000, 0.02, 1)).toBeCloseTo(1000 / 1.02, 2));
  it('compounds over multiple years', () => {
    expect(toReal(1000, 0.02, 10)).toBeCloseTo(1000 / Math.pow(1.02, 10), 2);
  });
  it('zero inflation returns same', () => expect(toReal(500, 0, 5)).toBeCloseTo(500, 2));
  it('handles large inflation', () => {
    expect(toReal(1000, 0.5, 2)).toBeCloseTo(1000 / 2.25, 2);
  });
});

describe('estimateMonthlyPension', () => {
  it('returns 0 for zero capital', () => expect(estimateMonthlyPension(0)).toBe(0));
  it('returns positive for positive capital', () => {
    expect(estimateMonthlyPension(100000)).toBeGreaterThan(0);
  });
  it('larger capital → larger pension', () => {
    expect(estimateMonthlyPension(200000)).toBeGreaterThan(estimateMonthlyPension(100000));
  });
  it('longer payout period → smaller monthly', () => {
    expect(estimateMonthlyPension(100000, ANNUITY_RATE, 20))
      .toBeGreaterThan(estimateMonthlyPension(100000, ANNUITY_RATE, 30));
  });
  it('higher annuity rate → slightly higher pension', () => {
    expect(estimateMonthlyPension(100000, 0.03, 20))
      .toBeGreaterThan(estimateMonthlyPension(100000, 0.01, 20));
  });
  it('negative capital returns 0', () => {
    expect(estimateMonthlyPension(-100)).toBe(0);
  });
});

describe('runSimulation', () => {
  it('returns correct number of years', () => {
    const results = runSimulation(BASE);
    expect(results).toHaveLength(AOW_AGE - BASE.startingAge);
  });

  it('period clamped to minimum 5 years', () => {
    const results = runSimulation({ ...BASE, startingAge: 65 });
    expect(results).toHaveLength(5);
  });

  it('period clamped to maximum 45 years', () => {
    const results = runSimulation({ ...BASE, startingAge: 10 });
    expect(results).toHaveLength(45);
  });

  it('capital grows over time', () => {
    const results = runSimulation(BASE);
    const first = results[0].capital2Normal;
    const last = results[results.length - 1].capital2Normal;
    expect(last).toBeGreaterThan(first);
  });

  it('good scenario > normal > bad', () => {
    const results = runSimulation(BASE);
    const last = results[results.length - 1];
    expect(last.capital2Good).toBeGreaterThan(last.capital2Normal);
    expect(last.capital2Normal).toBeGreaterThan(last.capital2Bad);
  });

  it('year 1 age = startingAge + 1', () => {
    expect(runSimulation(BASE)[0].age).toBe(BASE.startingAge + 1);
  });

  it('salary grows by growth rate', () => {
    const results = runSimulation(BASE);
    expect(results[1].grossSalary).toBeCloseTo(BASE.grossSalary * 1.02, 0);
  });

  it('no extra savings → 3rd pillar capital stays 0', () => {
    const results = runSimulation({ ...BASE, extraSavingsMonthly: 0 });
    const last = results[results.length - 1];
    expect(last.capital3Normal).toBe(0);
  });

  it('with extra savings → 3rd pillar capital grows', () => {
    const results = runSimulation({ ...BASE, extraSavingsMonthly: 200 });
    const last = results[results.length - 1];
    expect(last.capital3Normal).toBeGreaterThan(0);
  });

  it('3rd pillar good > normal > bad', () => {
    const results = runSimulation({ ...BASE, extraSavingsMonthly: 200 });
    const last = results[results.length - 1];
    expect(last.capital3Good).toBeGreaterThan(last.capital3Normal);
    expect(last.capital3Normal).toBeGreaterThan(last.capital3Bad);
  });

  it('pensioengrondslag = salary - franchise for above-franchise salary', () => {
    const results = runSimulation(BASE);
    const y1 = results[0];
    expect(y1.pensioengrondslag).toBeCloseTo(y1.grossSalary - BASE.franchise, 0);
  });

  it('zero contribution rates → capital stays 0', () => {
    const results = runSimulation({ ...BASE, employerPct: 0, employeePct: 0 });
    const last = results[results.length - 1];
    expect(last.capital2Normal).toBe(0);
  });

  it('higher employer% → more capital', () => {
    const low = runSimulation({ ...BASE, employerPct: 0.01 });
    const high = runSimulation({ ...BASE, employerPct: 0.05 });
    const lastLow = low[low.length - 1].capital2Normal;
    const lastHigh = high[high.length - 1].capital2Normal;
    expect(lastHigh).toBeGreaterThan(lastLow);
  });

  it('higher salary → more capital (above franchise)', () => {
    const low = runSimulation({ ...BASE, grossSalary: 30000 });
    const high = runSimulation({ ...BASE, grossSalary: 100000 });
    const lastLow = low[low.length - 1].capital2Normal;
    const lastHigh = high[high.length - 1].capital2Normal;
    expect(lastHigh).toBeGreaterThan(lastLow);
  });

  it('tax saving > 0 when salary above franchise', () => {
    const r = runSimulation(BASE);
    expect(r[0].taxSaving).toBeGreaterThan(0);
  });

  it('extra savings tax saving = extraAnnual * marginal', () => {
    const r = runSimulation({ ...BASE, extraSavingsMonthly: 100, grossSalary: 60000 });
    // At 60k, marginal rate = 37.56% (schijf 2, 2026); extra annual = 1200
    expect(r[0].extraSavingsTaxSaving).toBeCloseTo(1200 * 0.3756, 0);
  });

  it('franchise growth reduces grondslag over time', () => {
    const r = runSimulation({ ...BASE, salaryGrowthRate: 0 }); // no salary growth
    const first = r[0].pensioengrondslag;
    const last = r[r.length - 1].pensioengrondslag;
    expect(last).toBeLessThan(first);
  });

  it('result years are sequential', () => {
    const r = runSimulation(BASE);
    for (let i = 1; i < r.length; i++) {
      expect(r[i].year).toBe(r[i - 1].year + 1);
    }
  });

  it('result ages are sequential', () => {
    const r = runSimulation(BASE);
    for (let i = 1; i < r.length; i++) {
      expect(r[i].age).toBe(r[i - 1].age + 1);
    }
  });

  it('capital compounds correctly year 1→2 (normal)', () => {
    const r = runSimulation(BASE);
    const y1 = r[0];
    const y2 = r[1];
    const expectedContrib = y2.employerContribution + y2.employeeContribution;
    const expected = y1.capital2Normal * 1.05 + expectedContrib;
    expect(y2.capital2Normal).toBeCloseTo(expected, 0);
  });

  it('3rd pillar compounds correctly year 1→2', () => {
    const r = runSimulation({ ...BASE, extraSavingsMonthly: 100 });
    const y1 = r[0];
    const y2 = r[1];
    const expected = y1.capital3Normal * 1.05 + 100 * 12;
    expect(y2.capital3Normal).toBeCloseTo(expected, 0);
  });

  it('very high franchise → pensioengrondslag 0 → no 2nd pillar growth', () => {
    const r = runSimulation({ ...BASE, franchise: 999999 });
    const last = r[r.length - 1];
    expect(last.capital2Normal).toBe(0);
  });

  it('startingAge 66 → 5-year simulation', () => {
    const r = runSimulation({ ...BASE, startingAge: 66 });
    expect(r).toHaveLength(5);
  });
});

// helper used in test
const AOW_AGE = 68;
