import { describe, it, expect } from 'vitest'
import { calcPensioengrondslag, calcContributions, calcJaarruimte, MAX_PENSIOENGEVEND_LOON } from '../pension'

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

// ─── calcJaarruimte ───────────────────────────────────────────────────────────

describe('calcJaarruimte', () => {
  const salary = 45_000
  const base   = salary - FRANCHISE   // 27_455
  const grossJaarruimte = 0.30 * base // 8_236.5

  it('grossJaarruimte = 30% of pensioengrondslag', () => {
    const r = calcJaarruimte(salary, FRANCHISE, 0, 0)
    expect(r.grossJaarruimte).toBeCloseTo(grossJaarruimte, 6)
  })

  it('pillar2Reduction equals sum of employer and employee contributions', () => {
    const employer = 1_000
    const employee = 500
    const r = calcJaarruimte(salary, FRANCHISE, employer, employee)
    expect(r.pillar2Reduction).toBe(1_500)
  })

  it('availableForThird = grossJaarruimte − pillar2Reduction', () => {
    const employer = 1_000
    const employee = 500
    const r = calcJaarruimte(salary, FRANCHISE, employer, employee)
    expect(r.availableForThird).toBeCloseTo(grossJaarruimte - 1_500, 6)
  })

  it('availableForThird is 0 when 2nd pillar fills the full jaarruimte', () => {
    const r = calcJaarruimte(salary, FRANCHISE, grossJaarruimte, 0)
    expect(r.availableForThird).toBe(0)
  })

  it('availableForThird never goes negative when 2nd pillar exceeds the cap', () => {
    const r = calcJaarruimte(salary, FRANCHISE, 50_000, 0)
    expect(r.availableForThird).toBe(0)
  })

  it('salary below franchise yields zero jaarruimte', () => {
    const r = calcJaarruimte(10_000, FRANCHISE, 0, 0)
    expect(r.grossJaarruimte).toBe(0)
    expect(r.availableForThird).toBe(0)
  })

  it('salary above MAX_PENSIOENGEVEND_LOON is capped', () => {
    const highSalary = 200_000
    const expected = 0.30 * (MAX_PENSIOENGEVEND_LOON - FRANCHISE)
    const r = calcJaarruimte(highSalary, FRANCHISE, 0, 0)
    expect(r.grossJaarruimte).toBeCloseTo(expected, 6)
  })

  it('salary exactly at MAX_PENSIOENGEVEND_LOON is not further capped', () => {
    const r = calcJaarruimte(MAX_PENSIOENGEVEND_LOON, FRANCHISE, 0, 0)
    const expected = 0.30 * (MAX_PENSIOENGEVEND_LOON - FRANCHISE)
    expect(r.grossJaarruimte).toBeCloseTo(expected, 6)
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
