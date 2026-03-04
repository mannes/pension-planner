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
  - 2026 franchise: €19,172 (Centraal Aanspreekpunt Pensioenen, V&A 25-008)
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

### Pensioenoverzicht.nl Import (optional)

Users can upload a JSON export from [mijnpensioenoverzicht.nl](https://www.mijnpensioenoverzicht.nl) to include already-accrued pension rights from past and current employers alongside the simulated future contributions. The file is parsed entirely in the browser (FileReader API, no server).

**Parser logic** (`src/logic/parsePensioenoverzicht.ts`):
- Validates `StatusCode === "000"`
- Finds the "steady state" period in `Details.OuderdomsPensioenDetails.OuderdomsPensioen` where `Tot.OuderdomsPensioenEvent === "Overlijden"` (age 68 → death, the most complete snapshot)
- Sums `Opgebouwd` (already accrued) from all `IndicatiefPensioen[]` (DC) and `Pensioen[]` (hard DB) entries — deduped by `PensioenUitvoerder`
- Extracts `AOW.AOWDetailsOpbouw.TeBereikenAlleenstaand` and `TeBereikenSamenwonend` for AOW auto-fill
- Returns `null` for invalid files

**On import:**
- `aowMonthly` slider is **automatically updated** using the user's current `aowPartnerStatus`:
  - `'single'`: uses `TeBereikenAlleenstaand / 12`
  - `'partner'`: uses `TeBereikenSamenwonend / 12` (falls back to alleenstaand if absent)
- Changing the single/partner toggle after import also updates `aowMonthly` from the file (handled in `handleParamsChange` in `App.tsx`)
- No double-counting: `Opgebouwd` = past accrual; the simulation only projects future contributions

**No double-counting**: `Opgebouwd` values represent what's already locked in from past contributions. The simulation independently models only future contributions. These are additive.

**UX** (upload section at bottom of InputPanel, above Advanced settings):
- Button triggers hidden `<input type="file" accept=".json">`; local processing note shown in a prominent green badge (🔒)
- On success: shows summary card with provider list, total accrued/month, AOW projection note for the selected living situation, clear button
- On failure: inline error message
- Bilingual via `t.pensioenoverzicht.*`

### Tax Leverage Effect

- Employee pension contributions are deducted from **bruto (gross) salary before income tax**
- Net cost to employee: `net_cost = employee_contribution * (1 - marginal_tax_rate)`
- Visualization shows: gross contribution → tax saving → net cost → employer contribution → total funded → leverage ratio

### Dutch Income Tax (Box 1, 2026 rates)

**Working age (below AOW-leeftijd):**

From 2026, three brackets apply for working-age taxpayers:

| Bracket | Income range          | Rate   |
|---------|-----------------------|--------|
| 1       | €0 – €38,883          | 35.75% |
| 2       | €38,883 – €78,426     | 37.56% |
| 3       | > €78,426             | 49.50% |

Marginal rate = rate of highest bracket reached. Pension contributions reduce taxable income.

**Pension age (at or above AOW-leeftijd, ≥68):**

AOW recipients no longer pay the AOW premium (~17.9%), so bracket 1 is reduced:

| Bracket | Income range          | Rate   |
|---------|-----------------------|--------|
| 1       | €0 – €38,883          | 17.85% |
| 2       | €38,883 – €78,426     | 37.56% |
| 3       | > €78,426             | 49.50% |

These retirement-age rates are used when converting accumulated capital to net pension income.

### Pension Payout and Annuity Conversion

Capital-to-pension conversion uses a **separate conservative annuity rate (1.5%)**, distinct from the investment return scenarios (2/5/8%). Pension funds use an actuarial "rekenrente" based on guaranteed payout obligations, not equity returns. Using the investment return rate would overestimate the monthly pension by ~40%.

Formula: `PMT = capital × r / (1 − (1 + r)^−n)` over 20 years at `r = 1.5%/year`.

This tool only projects future contributions by default. Users can optionally import a JSON export from mijnpensioenoverzicht.nl to include already-accrued pension rights in the income comparison (see below).

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
| Simulation period       | 36 years      | Derived from age; AOW age = 68                                 |
| Salary growth rate      | 2%/year       | Annual raise                                                   |
| Employer contribution % | 1.5%          | % of pensioengrondslag                                         |
| Employee contribution % | 2.5%          | % of pensioengrondslag                                         |
| Extra savings/month     | €0            | 3rd pillar; tax-deductible at marginal rate                    |
| AOW franchise           | €19,172       | 2026 value (Centraal Aanspreekpunt Pensioenen, V&A 25-008)    |
| Franchise growth rate   | 1.5%/year     | Approximate CPI-linked growth                                  |
| Inflation rate          | 2%/year       | Used for real-value toggle                                     |
| AOW monthly (gross)     | €1,650        | Approx. alleenstaand Jan 2026 (SVB); retirement tax applied    |
| AOW partner status      | `'single'`    | `'single'` (alleenstaand) or `'partner'` (samenwonend); affects AOW amount; auto-fills from imported file |
| Return scenarios        | 2% / 5% / 8% | Bad / Normal / Good (accumulation only)                        |
| Annuity rate            | 1.5%          | Fixed; used for capital → monthly pension                      |

---

## Output / Visualizations

Content area card order (top to bottom):
1. **Results Summary**
2. Income Comparison
3. Tax Leverage
4. Contribution Breakdown
5. Capital Chart
6. Pension Glossary

### 1. Results Summary (first card)
- 3 scenario cards: bad / normal / good
- Per card (colored gradient header — rose / blue / emerald):
  - Hero: estimated monthly pension (large white text)
  - Capital progress bar relative to best scenario
  - Final 2nd pillar capital, final 3rd pillar capital (if any)
  - **2nd pillar deposits**: total employer+employee gross, total tax savings, net cost to employee
  - **3rd pillar deposits** (if configured): one combined row (total deposited), tax savings, net cost
- Mobile: segmented control (3-button pill) to select Bad / Normal / Good; only selected card shown
- Desktop (`md+`): all 3 cards in a grid
- Disclaimer notes: accumulation vs payout rate distinction
- Blue note: "Pillar 2 = employer pension | Pillar 3 = personal savings"
- Expandable InfoBox: capital calculation explanation

### 2. Income Comparison
- Reference salary depends on mode:
  - **Nominal mode**: final simulation year's net salary (both salary and pension in future €s → fair ratio)
  - **Real mode**: year-1 net salary (both deflated to today's €s → fair ratio)
- Per pillar (gross bruto amounts):
  - 2nd pillar monthly pension (normal scenario, at 1.5% annuity rate)
  - 3rd pillar monthly pension (normal scenario, if configured)
  - **Already-accrued pension** (amber bar, if pensioenoverzicht.nl file imported): `alreadyAccruedAnnual / 12`, real-adjusted if in real mode
  - **AOW** (gross, adjustable via slider; auto-filled from imported file using the selected `aowPartnerStatus`):
    - Label: "AOW-uitkering (alleenstaand/samenwonend)" based on selected status
    - Without imported file: label appends "(schatting)"
    - With imported file: label is clean (no "schatting"); bar note says "Uit mijnpensioenoverzicht.nl (prognose)"
- Gross total → minus retirement-age Box 1 tax (17.85%/37.56%/49.50%) → **net monthly pension**
- Replacement rate = net pension / net reference salary (net/net comparison)
- Gauge visualization with status: Good (≥70%) / Moderate (50–69%) / Low (<50%)
- Target shown on gauge: 70–80%
- Expandable InfoBox at bottom: "Why is a lower replacement rate often fine?" — lists costs that typically fall away at retirement (mortgage paid off, no student debt, children independent, no pension contributions, fewer work costs, lower tax rate); also notes upside spending (travel, hobbies) and rising healthcare; bilingual NL/EN via `infoBoxes.retirementCosts`

### 3. Tax Leverage Panel (year 1 snapshot)
- Waterfall breakdown: gross salary → minus franchise → pension base → employee gross → tax saving → net cost → employer → total funded
- 3rd pillar section (if configured): extra savings → tax benefit → net cost
- Leverage ratio: total funded / net employee cost; body text shows `euro(leverageRatio)` as plain string
- When real mode is active: note explaining year-1 values are in current euros (not affected by toggle)
- Expandable InfoBoxes: tax leverage, pensioengrondslag, Dutch tax brackets

### 4. Contribution Breakdown
- Stacked bar chart: employer / employee gross / tax saving per year
- Always shows full simulation period (no range selector)

### 5. Capital Chart (last card)
- Line chart: 3 scenarios over full simulation period
- Nominal / Real toggle applies
- Midpoint reference line

### 6. Pension Glossary
- Collapsible card (collapsed by default)
- Header: title, subtitle, term count badge
- When open: all entries shown at once (no accordion) — term as bold heading, definition below
- 17 terms in NL; 16 terms in EN (alphabetical within each language)
- Definition format: mini-markdown (`**bold**`, `• bullets`, `\n\n` paragraphs)
- Fully bilingual via `t.glossary.title / subtitle / entries[]`
- Terms covered: AOW, Annuïteit, Banksparen, Belastingschijven, DC-regeling, Factor A, Fiscale hefboom, Franchise, Jaarruimte, Lijfrente, Nominaal vs. reëel, Pensioengrondslag, Pijler 1/2/3, Rendement, Vervangingspercentage

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

### Mobile UX

**InputPanel (settings sidebar):**
- Sticky handled directly on the `<aside>` element: `sticky top-0 z-30 lg:sticky lg:top-6 lg:z-10`; max-height `max-h-[100dvh] lg:max-h-[calc(100vh-3rem)]` with `flex flex-col` + internal scroll on content div
- On mobile: collapsed by default with an "▼ Aanpassen / Adjust" toggle button in the header
- When collapsed: shows a mini summary strip (salary · employer%/employee% · age) so current values are always visible
- When expanded: full settings visible, header remains sticky
- On desktop (`lg+`): sticky at `top-6` with height matching that offset; internal overflow-y-auto ensures scrollability without full-page scroll

**SummaryTable (results card):**
- On mobile: segmented control (3-button pill) to select Bad / Normal / Good scenario; only the selected card is shown
- Default selected: Normal scenario
- On desktop (`md+`): all 3 scenario cards shown in grid as before

**InfoBox expand/collapse labels:**
- "Lees meer" / "Sluiten" come from `t.infoBox.readMore` / `t.infoBox.close` — fully translated NL/EN

### Educational Help System
1. **InfoTooltip** — outlined `i` badge on every input label; click/hover opens arrow-caret popover with blue fill when open
2. **InfoBox** — collapsible panel with animated `max-height` transition and rotating chevron `▾`; content uses mini-markdown renderer
3. **GlossaryPanel** — standalone card at bottom of page with all 15–16 terms fully expanded when opened

Mini-markdown format used in InfoBox and Glossary content:
- `\n\n` → paragraph break
- `• text` lines → bullet list (`<ul>` with `•` marker span)
- `**text**` → `<strong>`

Key InfoBoxes (all bilingual NL/EN):
- Pensioengrondslag / Pension base
- Tax leverage: why gross salary matters
- Dutch tax brackets (Box 1, working age + retirement age)
- Return scenarios explained
- AOW and the three pillars
- Capital calculation (2nd pillar only, annuity conversion)
- 3rd pillar / extra savings explained
- Retirement cost changes (why 70% suffices)

### AI Slop Warning
- Amber banner at top of page
- One-time, dismisses permanently via localStorage (`pension-planner-disclaimer-seen`)
- Warns: tool is AI-generated ("Claude Slop"), for indication only, verify with pension fund / advisor

### LocalStorage Persistence (opt-in)
- 💾 toggle in the InputPanel header, always visible
- **Off by default** — no data is persisted unless the user explicitly enables it
- When enabled (`pension-planner-persist = 'true'`):
  - `SimParams` saved to `pension-planner-params` on every slider/input change
  - `PensioenoverzichtData` saved to `pension-planner-overview` when a file is loaded or cleared
  - On page load: params merged with `DEFAULT_PARAMS` (schema-safe for future fields); overview parsed and restored
- When disabled: all three keys removed from localStorage immediately
- Always browser-local; nothing is sent to any server

### First-Time Interactive Guide
- **Mobile**: full-width bottom sheet (`fixed bottom-0 left-0 right-0 rounded-t-2xl`)
- **Desktop (sm+)**: corner panel (`sm:bottom-6 sm:right-6 sm:w-80 sm:rounded-2xl`)
- Triggered on first visit (localStorage flag: `pension-planner-guide-seen`)
- **6 steps**: Welcome → Set your situation → Import overview → Nominal vs Real → Reading the results → About & glossary
- On each step: highlights the relevant UI element via `data-guide-step` attribute + CSS pulse animation (`.guide-highlighted`)
- Element scrolled into view smoothly on step change; highlights cleaned up on guide close
- Progress bar + step dots (clickable)
- Skip button, prev/next navigation
- Re-triggerable via "Guided tour" button in header

**Step → element mapping:**

| Step | Highlights element (`data-guide-step`) |
|------|----------------------------------------|
| 0 — Welcome              | none                        |
| 1 — Set situation        | `salary`                    |
| 2 — Import overview      | `pensioenoverzicht-upload`  |
| 3 — Nominal vs Real      | `real-toggle`               |
| 4 — Results              | `results`                   |
| 5 — About & glossary     | `about-button`              |

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
9. **Past accrual optional** — tool projects forward from current contributions only; users can import a mijnpensioenoverzicht.nl JSON export to add already-accrued rights to the income comparison; no double-counting (`Opgebouwd` = past, simulation = future)

---

## Testing

Automated test suite using **Vitest** (`npm test`), covering all pure logic functions.

| File | Tests | Coverage |
|------|-------|----------|
| `src/logic/__tests__/tax.test.ts` | 36 | `calculateTax`, `getMarginalRate`, `calculateTaxWithPensionDeduction`, `calcTaxSaving`, `calculateRetirementTax` |
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
    │   ├── simulation.ts         # Career engine (2nd + 3rd pillar), toReal, ANNUITY_RATE, estimateMonthlyPension
    │   ├── parsePensioenoverzicht.ts  # Parses mijnpensioenoverzicht.nl JSON export
    │   └── __tests__/
    │       ├── tax.test.ts
    │       ├── pension.test.ts
    │       └── simulation.test.ts
    └── components/
        ├── InfoTooltip.tsx       # (?) hover popover
        ├── InfoBox.tsx           # Collapsible deep-dive explanation panel
        ├── AISlopWarning.tsx     # One-time dismissable amber disclaimer
        ├── FirstTimeGuide.tsx    # 6-step guide; bottom sheet on mobile, corner panel on desktop
        ├── InputPanel.tsx        # Sliders + extra savings + PensioenoverzichtUpload at bottom
        ├── PensioenoverzichtUpload.tsx  # File upload UI for pensioenoverzicht.nl JSON
        ├── SummaryTable.tsx      # Results (first card): gradient scenario cards, mobile segmented control
        ├── IncomeComparisonPanel.tsx  # Gross→net pension, retirement tax, replacement rate gauge
        ├── TaxLeveragePanel.tsx  # Year-1 waterfall + leverage ratio callout
        ├── ContributionBreakdown.tsx  # Stacked bar, full period always shown
        ├── CapitalChart.tsx      # Line chart: 3 scenarios over time (last chart card)
        └── GlossaryPanel.tsx     # Collapsible dictionary: 15–16 terms, all shown when open
```
