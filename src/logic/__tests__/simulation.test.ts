import { describe, it, expect } from 'vitest'
import { runSimulation, toReal, estimateMonthlyPension } from '../simulation'
import { SimParams, RETURN_RATES } from '../../types'

// Use explicit test params — never depends on DEFAULT_PARAMS so tests won't
// break when defaults change.
const PARAMS: SimParams = {
  startingSalary: 60_000,
  salaryGrowthRate: 0.02,
  employerPct: 0.10,
  employeePct: 0.05,
  extraSavingsMonthly: 0,
  franchise: 17_545,
  franchiseGrowthRate: 0.015,
  inflationRate: 0.02,
  years: 10,
  aowMonthly: 1_400,
}

// ─── runSimulation ────────────────────────────────────────────────────────────

describe('runSimulation', () => {
  const results = runSimulation(PARAMS)

  it('produces one result per year', () => {
    expect(results.length).toBe(PARAMS.years)
  })

  it('year numbers are sequential 1…N', () => {
    results.forEach((r, i) => expect(r.year).toBe(i + 1))
  })

  it('year-1 capital equals the year-1 contribution (no prior capital to compound)', () => {
    // Formula: capital = 0 * (1 + rate) + contribution = contribution
    const y1 = results[0]
    expect(y1.capitalNormal).toBeCloseTo(y1.totalAnnualContribution, 6)
    expect(y1.capitalBad).toBeCloseTo(y1.totalAnnualContribution, 6)
    expect(y1.capitalGood).toBeCloseTo(y1.totalAnnualContribution, 6)
  })

  it('year-2 capital: year-1 capital compounds then year-2 contribution is added', () => {
    const y1 = results[0]
    const y2 = results[1]
    const expected = y1.capitalNormal * (1 + RETURN_RATES.normal) + y2.totalAnnualContribution
    expect(y2.capitalNormal).toBeCloseTo(expected, 4)
  })

  it('capital is strictly increasing each year', () => {
    for (let i = 1; i < results.length; i++) {
      expect(results[i].capitalNormal).toBeGreaterThan(results[i - 1].capitalNormal)
      expect(results[i].capitalBad).toBeGreaterThan(results[i - 1].capitalBad)
      expect(results[i].capitalGood).toBeGreaterThan(results[i - 1].capitalGood)
    }
  })

  it('all three scenarios are equal in year 1 (no prior capital to compound)', () => {
    const y1 = results[0]
    expect(y1.capitalGood).toBe(y1.capitalNormal)
    expect(y1.capitalNormal).toBe(y1.capitalBad)
  })

  it('good scenario capital exceeds normal, which exceeds bad, from year 2 onward', () => {
    // Year 1 is identical across scenarios (no prior capital); divergence starts year 2
    results.slice(1).forEach(r => {
      expect(r.capitalGood).toBeGreaterThan(r.capitalNormal)
      expect(r.capitalNormal).toBeGreaterThan(r.capitalBad)
    })
  })

  it('salary grows at the specified rate each year', () => {
    results.forEach((r, i) => {
      const expected = PARAMS.startingSalary * Math.pow(1 + PARAMS.salaryGrowthRate, i)
      expect(r.grossSalary).toBeCloseTo(expected, 4)
    })
  })

  it('franchise grows at the specified rate each year', () => {
    results.forEach((r, i) => {
      const expected = PARAMS.franchise * Math.pow(1 + PARAMS.franchiseGrowthRate, i)
      expect(r.franchise).toBeCloseTo(expected, 4)
    })
  })

  it('pensioengrondslag = max(0, salary − franchise) each year', () => {
    results.forEach(r => {
      const expected = Math.max(0, r.grossSalary - r.franchise)
      expect(r.pensioengrondslag).toBeCloseTo(expected, 6)
    })
  })

  it('totalAnnualContribution = employer + employee gross', () => {
    results.forEach(r => {
      expect(r.totalAnnualContribution).toBeCloseTo(
        r.employerContribution + r.employeeContributionGross, 6
      )
    })
  })

  it('taxSaving = employeeGross × marginalRate', () => {
    results.forEach(r => {
      expect(r.taxSaving).toBeCloseTo(r.employeeContributionGross * r.marginalTaxRate, 6)
    })
  })

  it('netEmployeeCost = employeeGross − taxSaving', () => {
    results.forEach(r => {
      expect(r.netEmployeeCost).toBeCloseTo(r.employeeContributionGross - r.taxSaving, 6)
    })
  })

  describe('3rd pillar with extraSavingsMonthly = 0', () => {
    it('3rd pillar capital is 0 every year when no extra savings', () => {
      results.forEach(r => {
        expect(r.capitalBadThird).toBe(0)
        expect(r.capitalNormalThird).toBe(0)
        expect(r.capitalGoodThird).toBe(0)
        expect(r.extraSavingsAnnual).toBe(0)
      })
    })
  })

  describe('3rd pillar with extraSavingsMonthly = 200', () => {
    const results3 = runSimulation({ ...PARAMS, extraSavingsMonthly: 200 })
    const annualExtra = 200 * 12

    it('extraSavingsAnnual is monthly × 12 every year', () => {
      results3.forEach(r => expect(r.extraSavingsAnnual).toBeCloseTo(annualExtra, 6))
    })

    it('year-1 third-pillar capital equals annual extra (no prior capital)', () => {
      expect(results3[0].capitalNormalThird).toBeCloseTo(annualExtra, 6)
    })

    it('3rd pillar capital grows each year', () => {
      for (let i = 1; i < results3.length; i++) {
        expect(results3[i].capitalNormalThird).toBeGreaterThan(results3[i - 1].capitalNormalThird)
      }
    })

    it('3rd-pillar good exceeds normal, which exceeds bad, from year 2 onward', () => {
      results3.slice(1).forEach(r => {
        expect(r.capitalGoodThird).toBeGreaterThan(r.capitalNormalThird)
        expect(r.capitalNormalThird).toBeGreaterThan(r.capitalBadThird)
      })
    })

    it('tax benefit = annual extra × marginal rate', () => {
      results3.forEach(r => {
        expect(r.extraSavingsTaxBenefit).toBeCloseTo(annualExtra * r.marginalTaxRate, 6)
      })
    })

    it('net cost = annual extra − tax benefit', () => {
      results3.forEach(r => {
        expect(r.extraSavingsNetCost).toBeCloseTo(r.extraSavingsAnnual - r.extraSavingsTaxBenefit, 6)
      })
    })

    it('2nd pillar capital is unaffected by 3rd pillar savings', () => {
      results3.forEach((r, i) => {
        expect(r.capitalNormal).toBeCloseTo(results[i].capitalNormal, 4)
      })
    })
  })

  describe('edge case: salary below franchise', () => {
    const lowParams = { ...PARAMS, startingSalary: 10_000, salaryGrowthRate: 0 }
    const lowResults = runSimulation(lowParams)

    it('pensioengrondslag is 0 when salary is below franchise', () => {
      expect(lowResults[0].pensioengrondslag).toBe(0)
    })

    it('no employer or employee contributions when pensioengrondslag is 0', () => {
      expect(lowResults[0].totalAnnualContribution).toBe(0)
      expect(lowResults[0].capitalNormal).toBe(0)
    })
  })
})

// ─── toReal ──────────────────────────────────────────────────────────────────

describe('toReal', () => {
  it('year 0 leaves value unchanged (no inflation yet)', () => {
    expect(toReal(1_000, 0, 0.02)).toBe(1_000)
  })

  it('correctly deflates by one year of inflation', () => {
    expect(toReal(1_000, 1, 0.02)).toBeCloseTo(1_000 / 1.02, 8)
  })

  it('correctly deflates by ten years of compound inflation', () => {
    expect(toReal(1_000, 10, 0.02)).toBeCloseTo(1_000 / Math.pow(1.02, 10), 8)
  })

  it('real value is always less than nominal for positive inflation and year > 0', () => {
    expect(toReal(1_000, 5, 0.02)).toBeLessThan(1_000)
    expect(toReal(1_000, 30, 0.03)).toBeLessThan(1_000)
  })

  it('zero inflation rate leaves value unchanged at any year', () => {
    expect(toReal(1_000, 30, 0)).toBe(1_000)
  })

  it('larger year means smaller real value (same inflation)', () => {
    expect(toReal(1_000, 20, 0.02)).toBeLessThan(toReal(1_000, 10, 0.02))
  })
})

// ─── estimateMonthlyPension ──────────────────────────────────────────────────

describe('estimateMonthlyPension', () => {
  it('returns a positive value for positive capital', () => {
    expect(estimateMonthlyPension(300_000, 0.05)).toBeGreaterThan(0)
  })

  it('larger capital yields proportionally larger monthly pension', () => {
    const m1 = estimateMonthlyPension(300_000, 0.05)
    const m2 = estimateMonthlyPension(600_000, 0.05)
    // Annuity is linear in PV → doubling capital doubles pension
    expect(m2).toBeCloseTo(m1 * 2, 6)
  })

  it('zero return rate: monthly = capital / (20 × 12)', () => {
    const capital = 240_000
    expect(estimateMonthlyPension(capital, 0)).toBeCloseTo(capital / 240, 6)
  })

  it('higher return rate yields higher monthly pension for same capital', () => {
    // With positive return, annuity payments can be higher
    const m_low  = estimateMonthlyPension(300_000, 0.01)
    const m_high = estimateMonthlyPension(300_000, 0.08)
    expect(m_high).toBeGreaterThan(m_low)
  })

  it('payout over 20 years at 0% return does not exceed capital (sanity check)', () => {
    const capital = 300_000
    const monthly = estimateMonthlyPension(capital, 0)
    expect(monthly * 240).toBeCloseTo(capital, 4)
  })
})
