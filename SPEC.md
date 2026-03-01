# Dutch Pension Planner — Project Specification

## Overview

An educational, interactive browser tool to simulate and compare pension capital build-up over a career under Dutch pension rules. The primary goal is **awareness** — making Dutch pension mechanics understandable for people who don't actively engage with their pension. Supports bilingual NL/EN use.

---

## Core Concepts

### Pension Contribution Structure

- **Employer contribution**: a percentage of *pensionable salary* (pensioengrondslag)
- **Employee contribution**: a percentage of *pensionable salary*
- **Pensionable salary** (pensioengrondslag): gross salary minus the *franchise*
  - The franchise (AOW-franchise) is the amount excluded from pension accrual because the Dutch state pension (AOW) covers it
  - 2024 franchise: ~€17,545 (update annually)
  - `pensioengrondslag = max(0, bruto_jaarsalaris - franchise)`
- Total annual contribution = `(employer_pct + employee_pct) * pensioengrondslag`

### 3rd Pillar — Extra Personal Savings

- User can input a monthly extra savings amount (lijfrente / banksparen)
- Tax-deductible at marginal rate (simplified; actual limit is the jaarruimte)
- Tracked separately from 2nd pillar capital; shown alongside in results
- Included in income comparison and monthly pension estimate

### Jaarruimte (Annual Space)

The jaarruimte is the maximum amount that can be contributed to a 3rd-pillar product with full tax deductibility (post-WTP formula, from 2024):

```
Gross jaarruimte = 30% × min(grossSalary, MAX_PENSIOENGEVEND_LOON=€137,800) − franchise)
Pillar-2 reduction ≈ employer contributions + employee contributions (DC approximation)
Available for 3rd pillar = max(0, gross jaarruimte − pillar-2 reduction)
```

Displayed as a compact breakdown card in the InputPanel, directly below the extra savings input. Updates live as salary and contribution sliders change. Shows:
- Max space (30% × pensioengrondslag, capped)
- Minus 2nd pillar contributions
- = Available for 3rd pillar
- If extra savings > 0: current 3rd pillar usage and remaining space (or "limit exceeded" in red)

Note: the exact formula uses `6.27 × Factor_A` (formal pension accrual). For DC plans this approximates to total contributions; a disclaimer note directs users to the Belastingdienst for their exact jaarruimte.

### Tax Leverage Effect

- Employee pension contributions are deducted from **bruto (gross) salary before income tax**
- Net cost to employee: `net_cost = employee_contribution * (1 - marginal_tax_rate)`
- Visualization shows: gross contribution → tax saving → net cost → employer contribution → total funded → leverage ratio

### Dutch Income Tax (Box 1, 2024 rates)

**Working age (below AOW-leeftijd):**

| Bracket | Income range    | Rate   |
|---------|-----------------|--------|
| 1       | €0 – €75,518    | 36.97% |
| 2       | > €75,518       | 49.50% |

Marginal rate = rate of highest bracket reached. Pension contributions reduce taxable income.

**Pension age (at or above AOW-leeftijd):**

AOW recipients no longer pay the AOW premium (~17.9%), so bracket 1 is split:

| Bracket | Income range          | Rate   |
|---------|-----------------------|--------|
| 1a      | €0 – ~€40,021         | 19.07% |
| 1b      | ~€40,021 – €75,518    | 36.97% |
| 2       | > €75,518             | 49.50% |

These retirement-age rates are used when converting accumulated capital to net pension income.

### Pension Payout and Annuity Conversion

Capital-to-pension conversion uses a **separate conservative annuity rate (1.5%)**, distinct from the investment return scenarios (2/5/8%). Pension funds use an actuarial "rekenrente" based on guaranteed payout obligations, not equity returns. Using the investment return rate would overestimate the monthly pension by ~40%.

Formula: `PMT = capital × r / (1 − (1 + r)^−n)` over 20 years at `r = 1.5%/year`.

This tool only projects future contributions — already-accrued pension rights from past years of service are not included. Use [mijnpensioenoverzicht.nl](https://www.mijnpensioenoverzicht.nl) for your actual prognosis.

---

## Interest / Return Scenarios

| Scenario | Annual Return | Description                                      |
|----------|---------------|--------------------------------------------------|
| Bad      | 2%            | Conservative / low-yield environment             |
| Normal   | 5%            | Historical average mixed portfolio               |
| Good     | 8%            | Equity-heavy portfolio in favourable markets     |

Compounding formula: `capital[year] = capital[year-1] * (1 + rate) + contribution[year]`
(Prior capital compounds first; contribution is added at year-end.)

---

## Simulation Parameters

| Parameter               | Default       | Notes                                                          |
|-------------------------|---------------|----------------------------------------------------------------|
| Starting gross salary   | €60,000       | Annual bruto salary at year 0                                  |
| Starting age            | 32            | Simulation period = max(5, min(45, AOW_AGE − startingAge))    |
| Simulation period       | 35 years      | Derived from age; AOW age = 67                                 |
| Salary growth rate      | 2%/year       | Annual raise                                                   |
| Employer contribution % | 1.5%          | % of pensioengrondslag                                         |
| Employee contribution % | 2.5%          | % of pensioengrondslag                                         |
| Extra savings/month     | €0            | 3rd pillar; tax-deductible at marginal rate                    |
| AOW franchise           | €17,545       | Updated annually by government                                 |
| Franchise growth rate   | 1.5%/year     | Approximate CPI-linked growth                                  |
| Inflation rate          | 2%/year       | Used for real-value toggle                                     |
| AOW monthly (gross)     | €1,400        | Gross bruto; retirement tax applied on top                     |
| Return scenarios        | 2% / 5% / 8% | Bad / Normal / Good (accumulation only)                        |
| Annuity rate            | 1.5%          | Fixed; used for capital → monthly pension                      |

---

## Output / Visualizations

### 1. Results Summary (prominent, at top)
- 3 scenario cards: bad / normal / good
- Per card:
  - Final 2nd pillar capital (big number), final 3rd pillar capital (if any), combined total
  - **2nd pillar deposits**: total employer+employee gross, total tax savings, net cost to employee
  - **3rd pillar deposits** (if configured): total deposited, tax savings, net cost — shown separately so user can see full input picture
  - Estimated monthly pension (using 1.5% annuity rate on combined capital)
- Disclaimer notes: accumulation vs payout rate distinction; already-accrued rights not included; link to mijnpensioenoverzicht.nl
- Blue note: "This is 2nd pillar only — AOW and 3rd pillar come on top"
- Expandable InfoBox: "AOW & the 3 pillars"

### 2. Income Comparison
- Reference salary depends on mode:
  - **Nominal mode**: final simulation year's net salary (both salary and pension in future €s → fair ratio)
  - **Real mode**: year-1 net salary (both deflated to today's €s → fair ratio)
- Per pillar (gross bruto amounts):
  - 2nd pillar monthly pension (normal scenario, at 1.5% annuity rate)
  - 3rd pillar monthly pension (normal scenario, if configured)
  - AOW estimate (gross, adjustable via slider)
- Gross total → minus retirement-age Box 1 tax (19.07%/36.97%/49.50%) → **net monthly pension**
- Replacement rate = net pension / net reference salary (net/net comparison)
- Gauge visualization with status: Good (≥70%) / Moderate (50–69%) / Low (<50%)
- Target shown on gauge: 70–80%

### 3. Tax Leverage Panel (year 1 snapshot)
- Waterfall breakdown: gross salary → minus franchise → pension base → employee gross → tax saving → net cost → employer → total funded
- 3rd pillar section (if configured): extra savings → tax benefit → net cost
- Leverage ratio: total funded / net employee cost; body text shows `euro(leverageRatio)` as plain string
- When real mode is active: note explaining year-1 values are in current euros (not affected by toggle)
- Expandable InfoBoxes: tax leverage, pensioengrondslag, Dutch tax brackets

### 4. Capital Chart
- Line chart: 3 scenarios over full simulation period
- Nominal / Real toggle applies
- Midpoint reference line

### 5. Contribution Breakdown
- Stacked bar chart: employer / employee gross / tax saving per year
- Always shows full simulation period (no range selector)

---

## UX Features

### Bilingual Support (NL / EN)
- Language toggle in header: 🇳🇱 NL / 🇬🇧 EN
- Preference stored in localStorage
- All UI text, tooltips, and InfoBox content translated
- Default language: Dutch

### Nominal / Real Toggle
- Global toggle in header (`data-guide-step="real-toggle"` for guide highlighting)
- Switches all charts and summary tables between nominal euros and real (inflation-adjusted) euros
- Inflation rate adjustable in advanced settings
- TaxLeveragePanel: unaffected (year-1 values are always "now"); shows explanatory note in real mode
- IncomeComparisonPanel: reference salary switches between final-year (nominal) and year-1 (real) — both comparisons are fair within their respective mode

### Educational Help System
1. **InfoTooltip** — `(?)` icon on every input label, hover/click popover
2. **InfoBox** — collapsible deeper explanation panels at relevant sections

Key InfoBoxes:
- Pensioengrondslag / Pension base
- Tax leverage: why gross salary matters
- Dutch tax brackets (Box 1, working age)
- Return scenarios explained
- AOW and the three pillars
- What's in the result capital (2nd pillar only)
- 3rd pillar / extra savings explained

### AI Slop Warning
- Amber banner at top of page
- One-time, dismisses permanently via localStorage (`pension-planner-disclaimer-seen`)
- Warns: tool is AI-generated ("Claude Slop"), for indication only, verify with pension fund / advisor

### First-Time Interactive Guide
- **Mobile**: full-width bottom sheet (`fixed bottom-0 left-0 right-0 rounded-t-2xl`)
- **Desktop (sm+)**: corner panel (`sm:bottom-6 sm:right-6 sm:w-80 sm:rounded-2xl`)
- Triggered on first visit (localStorage flag: `pension-planner-guide-seen`)
- **4 steps**: Welcome → Set your situation → Nominal vs Real → Reading the results
- On each step: highlights the relevant UI element via `data-guide-step` attribute + CSS pulse animation (`.guide-highlighted`)
- Element scrolled into view smoothly on step change; highlights cleaned up on guide close
- Progress bar + step dots (clickable)
- Skip button, prev/next navigation
- Re-triggerable via "Guided tour" button in header

**Step → element mapping:**

| Step | Highlights element (`data-guide-step`) |
|------|----------------------------------------|
| 0 — Welcome         | none            |
| 1 — Set situation   | `salary`        |
| 2 — Nominal vs Real | `real-toggle`   |
| 3 — Results         | `results`       |

---

## Key Dutch Pension Rules Applied

1. **Defined contribution (beschikbare premieregeling)** — DC model, not DB
2. **Contribution based on pensioengrondslag**, not full salary
3. **AOW-franchise** reduces the contribution base
4. **Tax-exempt accumulation**: pot grows tax-free; tax paid on withdrawal
5. **3rd pillar** (lijfrente/banksparen): tax-deductible within jaarruimte; jaarruimte calculated and displayed live (30% × pensioengrondslag − 2nd-pillar contributions)
6. **Pension payouts are taxed** as Box 1 income at retirement-age rates (lower bracket 1 because AOW premium no longer applies)
7. **Annuity conversion uses conservative rekenrente** (1.5%), not the investment return rate
8. **Pension wealth is not liquid** — no early withdrawal modeled
9. **Past accrual not modeled** — tool only projects forward from current contributions

---

## Testing

Automated test suite using **Vitest** (`npm test`), covering all pure logic functions.

| File | Tests | Coverage |
|------|-------|----------|
| `src/logic/__tests__/tax.test.ts` | 29 | `calculateTax`, `getMarginalRate`, `calculateTaxWithPensionDeduction`, `calcTaxSaving`, `calculateRetirementTax` |
| `src/logic/__tests__/pension.test.ts` | 27 | `calcPensioengrondslag`, `calcJaarruimte`, `calcContributions` |
| `src/logic/__tests__/simulation.test.ts` | 34 | `runSimulation` (2nd + 3rd pillar, edge cases), `toReal`, `estimateMonthlyPension` |
| **Total** | **90** | |

Tests use explicit parameters (never `DEFAULT_PARAMS`) so they won't break when defaults change.

---

## Tech Stack

| Layer         | Technology                          |
|---------------|-------------------------------------|
| Framework     | React 18 + TypeScript               |
| Build         | Vite 6                              |
| Charting      | Recharts 2                          |
| Styling       | Tailwind CSS 3                      |
| State         | React `useState` + `useMemo`        |
| i18n          | Custom context + typed translations |
| Testing       | Vitest 4                            |
| Persistence   | `localStorage` only                 |
| Deployment    | GitHub Pages via GitHub Actions     |

---

## Deployment

### GitHub Actions (`.github/workflows/deploy.yml`)
- Triggers on push to `main` and manually via workflow_dispatch
- Steps: install → **run tests** (fails fast if any test fails) → build → upload artifact → deploy
- Sets `VITE_BASE_PATH=/<repo-name>/` so asset paths are correct on Pages
- Uploads `dist/` as Pages artifact

**One-time setup required in GitHub repo settings:**
- Settings → Pages → Source: **GitHub Actions**

---

## File Structure

```
pension-planner/
├── .github/
│   └── workflows/
│       └── deploy.yml            # Build + deploy to GitHub Pages (tests run first)
├── SPEC.md                       # This file
├── index.html
├── package.json
├── vite.config.ts                # base path from VITE_BASE_PATH env var
├── vitest.config.ts              # Vitest test configuration
├── tailwind.config.js
├── postcss.config.js
├── tsconfig*.json
└── src/
    ├── main.tsx
    ├── index.css                 # Tailwind base + range slider + .guide-highlighted animation
    ├── App.tsx                   # Root: language context, layout, guide, warning
    ├── types.ts                  # SimParams, YearlyResult, defaults, TAX_BRACKETS
    ├── i18n/
    │   └── index.ts              # Bilingual translations (NL + EN), typed
    ├── context/
    │   └── LanguageContext.tsx   # Language state + useTranslation hook
    ├── logic/
    │   ├── tax.ts                # Box 1 tax (working age + retirement age), marginal rate
    │   ├── pension.ts            # Pensioengrondslag, contribution breakdown
    │   ├── simulation.ts        # Career engine (2nd + 3rd pillar), toReal, ANNUITY_RATE, estimateMonthlyPension
    │   └── __tests__/
    │       ├── tax.test.ts
    │       ├── pension.test.ts
    │       └── simulation.test.ts
    └── components/
        ├── InfoTooltip.tsx       # (?) hover popover
        ├── InfoBox.tsx           # Collapsible deep-dive explanation panel
        ├── AISlopWarning.tsx     # One-time dismissable amber disclaimer
        ├── FirstTimeGuide.tsx    # 4-step guide; bottom sheet on mobile, corner panel on desktop
        ├── InputPanel.tsx        # Sliders + extra savings input (data-guide-step attrs)
        ├── SummaryTable.tsx      # Results at top (2nd + 3rd pillar, 3 scenarios)
        ├── TaxLeveragePanel.tsx  # Year-1 waterfall + leverage ratio
        ├── IncomeComparisonPanel.tsx  # Gross→net pension, retirement tax, replacement rate
        ├── CapitalChart.tsx      # Line chart: 3 scenarios over time
        └── ContributionBreakdown.tsx  # Stacked bar, full period always shown
```
