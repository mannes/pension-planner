import { describe, it, expect } from 'vitest'
import { calculateTax, getMarginalRate, calculateTaxWithPensionDeduction, calcTaxSaving, calculateRetirementTax } from '../tax'

// ─── Known bracket constants ────────────────────────────────────────────────
const BRACKET1_LIMIT = 75_518
const RATE1 = 0.3697
const RATE2 = 0.4950

// ─── calculateTax ────────────────────────────────────────────────────────────

describe('calculateTax', () => {
  it('returns 0 for zero income', () => {
    expect(calculateTax(0)).toBe(0)
  })

  it('returns 0 for negative income', () => {
    expect(calculateTax(-1000)).toBe(0)
  })

  it('applies bracket-1 rate for income entirely within bracket 1', () => {
    const income = 50_000
    expect(calculateTax(income)).toBeCloseTo(income * RATE1, 4)
  })

  it('is correct exactly at the bracket-1 boundary (€75,518)', () => {
    expect(calculateTax(BRACKET1_LIMIT)).toBeCloseTo(BRACKET1_LIMIT * RATE1, 4)
  })

  it('applies both brackets for income above €75,518', () => {
    const income = 100_000
    const expected = BRACKET1_LIMIT * RATE1 + (income - BRACKET1_LIMIT) * RATE2
    expect(calculateTax(income)).toBeCloseTo(expected, 4)
  })

  it('taxes are strictly positive for any positive income', () => {
    expect(calculateTax(1)).toBeGreaterThan(0)
    expect(calculateTax(30_000)).toBeGreaterThan(0)
    expect(calculateTax(200_000)).toBeGreaterThan(0)
  })

  it('tax is monotonically increasing with income', () => {
    const incomes = [10_000, 30_000, 50_000, 75_518, 75_519, 100_000, 200_000]
    for (let i = 1; i < incomes.length; i++) {
      expect(calculateTax(incomes[i])).toBeGreaterThan(calculateTax(incomes[i - 1]))
    }
  })

  it('effective rate never exceeds the top marginal rate', () => {
    const income = 500_000
    expect(calculateTax(income) / income).toBeLessThan(RATE2)
  })
})

// ─── getMarginalRate ─────────────────────────────────────────────────────────

describe('getMarginalRate', () => {
  it('returns 36.97% for income below the bracket boundary', () => {
    expect(getMarginalRate(30_000)).toBe(RATE1)
  })

  it('returns 36.97% exactly at €75,518 (boundary is inclusive to bracket 1)', () => {
    expect(getMarginalRate(BRACKET1_LIMIT)).toBe(RATE1)
  })

  it('returns 49.50% for income one euro above the boundary', () => {
    expect(getMarginalRate(BRACKET1_LIMIT + 1)).toBe(RATE2)
  })

  it('returns 49.50% for high incomes', () => {
    expect(getMarginalRate(200_000)).toBe(RATE2)
  })
})

// ─── calculateTaxWithPensionDeduction ────────────────────────────────────────

describe('calculateTaxWithPensionDeduction', () => {
  it('returns less tax than without pension deduction', () => {
    const income = 50_000
    const contribution = 2_000
    expect(calculateTaxWithPensionDeduction(income, contribution))
      .toBeLessThan(calculateTax(income))
  })

  it('with zero contribution equals calculateTax', () => {
    const income = 50_000
    expect(calculateTaxWithPensionDeduction(income, 0)).toBeCloseTo(calculateTax(income), 6)
  })

  it('contribution larger than income floors at 0 taxable income', () => {
    // No negative taxes
    expect(calculateTaxWithPensionDeduction(10_000, 50_000)).toBe(0)
  })

  it('handles bracket-crossing contribution correctly', () => {
    // Income at 80k (bracket 2), large contribution brings it into bracket 1
    const income = 80_000
    const contribution = 10_000          // taxable → 70_000 (fully in bracket 1)
    const expected = calculateTax(70_000)
    expect(calculateTaxWithPensionDeduction(income, contribution)).toBeCloseTo(expected, 4)
  })
})

// ─── calcTaxSaving ───────────────────────────────────────────────────────────

describe('calcTaxSaving', () => {
  it('returns 0 for zero contribution', () => {
    expect(calcTaxSaving(50_000, 0)).toBeCloseTo(0, 6)
  })

  it('equals contribution × marginal rate for same-bracket contribution', () => {
    // Income 50k, contribution 1k → stays entirely within bracket 1
    const saving = calcTaxSaving(50_000, 1_000)
    expect(saving).toBeCloseTo(1_000 * RATE1, 4)
  })

  it('equals contribution × bracket-2 rate when income is well above bracket limit', () => {
    // Income 100k, small contribution → entirely taxed at bracket-2 rate
    const saving = calcTaxSaving(100_000, 1_000)
    expect(saving).toBeCloseTo(1_000 * RATE2, 4)
  })

  it('is always positive for positive contribution and income', () => {
    expect(calcTaxSaving(40_000, 500)).toBeGreaterThan(0)
    expect(calcTaxSaving(90_000, 500)).toBeGreaterThan(0)
  })

  it('cannot exceed the contribution itself (no negative net cost)', () => {
    const contribution = 5_000
    const saving = calcTaxSaving(50_000, contribution)
    expect(saving).toBeLessThan(contribution)
  })
})

// ─── calculateRetirementTax ───────────────────────────────────────────────────

describe('calculateRetirementTax', () => {
  const PENSION_RATE1 = 0.1907  // bracket 1a up to €40,021
  const PENSION_RATE2 = 0.3697  // bracket 1b up to €75,518
  const PENSION_RATE3 = 0.4950  // bracket 2 above €75,518
  const SPLIT = 40_021           // approx 2024 threshold

  it('returns 0 for zero income', () => {
    expect(calculateRetirementTax(0)).toBe(0)
  })

  it('returns 0 for negative income', () => {
    expect(calculateRetirementTax(-1000)).toBe(0)
  })

  it('applies 19.07% rate for income entirely within the first pension bracket', () => {
    const income = 20_000
    expect(calculateRetirementTax(income)).toBeCloseTo(income * PENSION_RATE1, 4)
  })

  it('is correct exactly at the first pension bracket boundary (~€40,021)', () => {
    expect(calculateRetirementTax(SPLIT)).toBeCloseTo(SPLIT * PENSION_RATE1, 4)
  })

  it('applies two brackets correctly for income between €40,021 and €75,518', () => {
    const income = 60_000
    const expected = SPLIT * PENSION_RATE1 + (income - SPLIT) * PENSION_RATE2
    expect(calculateRetirementTax(income)).toBeCloseTo(expected, 4)
  })

  it('applies all three brackets correctly for income above €75,518', () => {
    const income = 100_000
    const top = 75_518
    const expected = SPLIT * PENSION_RATE1 + (top - SPLIT) * PENSION_RATE2 + (income - top) * PENSION_RATE3
    expect(calculateRetirementTax(income)).toBeCloseTo(expected, 4)
  })

  it('retirement tax is strictly lower than working-age tax for the same income (in bracket 1)', () => {
    const income = 30_000
    expect(calculateRetirementTax(income)).toBeLessThan(calculateTax(income))
  })

  it('tax is monotonically increasing with income', () => {
    const incomes = [10_000, 30_000, 40_021, 50_000, 75_518, 100_000, 200_000]
    for (let i = 1; i < incomes.length; i++) {
      expect(calculateRetirementTax(incomes[i])).toBeGreaterThan(calculateRetirementTax(incomes[i - 1]))
    }
  })
})
