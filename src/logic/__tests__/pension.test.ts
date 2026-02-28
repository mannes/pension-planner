import { describe, it, expect } from 'vitest'
import { calcPensioengrondslag, calcContributions } from '../pension'

const FRANCHISE = 17_545
const RATE1 = 0.3697   // marginal rate for income below €75,518

// ─── calcPensioengrondslag ───────────────────────────────────────────────────

describe('calcPensioengrondslag', () => {
  it('subtracts franchise from salary', () => {
    expect(calcPensioengrondslag(45_000, FRANCHISE)).toBe(45_000 - FRANCHISE)
  })

  it('floors at 0 when salary is below franchise', () => {
    expect(calcPensioengrondslag(10_000, FRANCHISE)).toBe(0)
  })

  it('is exactly 0 when salary equals franchise', () => {
    expect(calcPensioengrondslag(FRANCHISE, FRANCHISE)).toBe(0)
  })

  it('returns correct value for salary one euro above franchise', () => {
    expect(calcPensioengrondslag(FRANCHISE + 1, FRANCHISE)).toBe(1)
  })

  it('is never negative', () => {
    expect(calcPensioengrondslag(0, FRANCHISE)).toBeGreaterThanOrEqual(0)
    expect(calcPensioengrondslag(1_000, FRANCHISE)).toBeGreaterThanOrEqual(0)
  })
})

// ─── calcContributions ───────────────────────────────────────────────────────

describe('calcContributions', () => {
  const salary = 45_000
  const base   = 45_000 - FRANCHISE  // = 27_455

  describe('with 10% employer / 5% employee (salary in bracket 1)', () => {
    const r = calcContributions(salary, FRANCHISE, 0.10, 0.05)

    it('pensioengrondslag is salary minus franchise', () => {
      expect(r.pensioengrondslag).toBe(base)
    })

    it('employer contribution = employerPct × base', () => {
      expect(r.employerContribution).toBeCloseTo(base * 0.10, 6)
    })

    it('employee gross contribution = employeePct × base', () => {
      expect(r.employeeContributionGross).toBeCloseTo(base * 0.05, 6)
    })

    it('marginal tax rate is bracket-1 rate for this salary', () => {
      expect(r.marginalTaxRate).toBe(RATE1)
    })

    it('tax saving = employee gross × marginal rate', () => {
      expect(r.taxSaving).toBeCloseTo(r.employeeContributionGross * RATE1, 6)
    })

    it('net employee cost = employee gross − tax saving', () => {
      expect(r.netEmployeeCost).toBeCloseTo(r.employeeContributionGross - r.taxSaving, 6)
    })

    it('total funded = employer + employee gross', () => {
      expect(r.totalFunded).toBeCloseTo(r.employerContribution + r.employeeContributionGross, 6)
    })

    it('leverage ratio = totalFunded / netEmployeeCost', () => {
      const expected = r.totalFunded / r.netEmployeeCost
      expect(r.leverageRatio).toBeCloseTo(expected, 6)
    })

    it('leverage ratio is greater than 1 when employer contributes', () => {
      expect(r.leverageRatio).toBeGreaterThan(1)
    })

    it('net cost is less than the gross employee contribution', () => {
      expect(r.netEmployeeCost).toBeLessThan(r.employeeContributionGross)
    })
  })

  describe('edge cases', () => {
    it('zero percentages yield zero contributions', () => {
      const r = calcContributions(salary, FRANCHISE, 0, 0)
      expect(r.employerContribution).toBe(0)
      expect(r.employeeContributionGross).toBe(0)
      expect(r.taxSaving).toBe(0)
      expect(r.netEmployeeCost).toBe(0)
      expect(r.totalFunded).toBe(0)
    })

    it('salary below franchise: all contribution values are 0', () => {
      const r = calcContributions(10_000, FRANCHISE, 0.10, 0.05)
      expect(r.pensioengrondslag).toBe(0)
      expect(r.employerContribution).toBe(0)
      expect(r.employeeContributionGross).toBe(0)
      expect(r.totalFunded).toBe(0)
    })

    it('high salary (bracket 2) uses 49.50% marginal rate', () => {
      const r = calcContributions(100_000, FRANCHISE, 0.10, 0.05)
      expect(r.marginalTaxRate).toBe(0.4950)
      expect(r.taxSaving).toBeCloseTo(r.employeeContributionGross * 0.4950, 6)
    })

    it('employee-only (no employer) leverage ratio equals 1/(1 - marginalRate)', () => {
      const r = calcContributions(salary, FRANCHISE, 0, 0.05)
      // leverage = totalFunded / netCost = employeeGross / (employeeGross * (1 - rate))
      // = 1 / (1 - rate)
      const expected = 1 / (1 - RATE1)
      expect(r.leverageRatio).toBeCloseTo(expected, 4)
    })
  })
})
