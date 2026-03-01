# Nederlandse Pensioenplanner

An interactive, educational tool to simulate Dutch pension (pensioen) build-up over a career. Bilingual NL/EN.

**[→ Open the tool](https://mannes.github.io/pension-planner/)**

---

## Why this exists

Most people in the Netherlands have no idea how their pension actually works — how much is being contributed, what the tax advantage is, or what they can realistically expect at retirement. The information *is* available (on your payslip, in your employment contract, at mijnpensioenoverzicht.nl), but it's scattered and hard to reason about intuitively.

This tool makes the mechanics visible:
- What does the employer actually put in, and what does it cost *you* after tax?
- How does the AOW-franchise reduce your pension base?
- What does your accumulated pot convert to as monthly income at 67?
- How does 2% vs 8% annual return change the outcome over 35 years?
- Is there room to top up via a 3rd-pillar product (lijfrente/banksparen), and how much?

---

## What it models

- **2nd pillar** (werkgeverspensioen): employer + employee contributions on the pensioengrondslag (gross salary minus AOW-franchise), compounding at 2% / 5% / 8% scenarios
- **3rd pillar** (lijfrente/banksparen): optional extra monthly savings, tax-deductible within jaarruimte
- **Dutch Box 1 income tax** (2024/2025 rates): marginal rate applied to contributions and savings; lower retirement-age rates applied to pension payouts
- **AOW** state pension: included in the income replacement calculation
- **Jaarruimte**: live calculation of the maximum tax-deductible 3rd-pillar contribution space (post-WTP formula, from 2024)
- **Replacement rate**: net pension income vs net working salary — the key metric for retirement adequacy (target: 70–80%)

### What it does NOT model
- Pension rights already accrued from past years of service (only future contributions)
- Defined-benefit (DB/uitkeringsovereenkomst) schemes — only DC (beschikbare premie)
- Investment risk / sequence-of-returns risk
- Partner AOW or partner pension products

Use [mijnpensioenoverzicht.nl](https://www.mijnpensioenoverzicht.nl) for a projection based on your actual fund.

---

## Tech stack

| | |
|---|---|
| Framework | React 18 + TypeScript |
| Build | Vite 6 |
| Styling | Tailwind CSS 3 |
| Charts | Recharts 2 |
| Tests | Vitest 4 (90 tests) |
| Deployment | GitHub Pages via GitHub Actions |

All logic runs in-browser. No backend, no data collection.

---

## Development

```bash
npm install
npm run dev      # start dev server
npm test         # run test suite (vitest)
npm run build    # production build
```

Tests cover all pure logic functions: tax brackets, pensioengrondslag, jaarruimte, simulation engine, annuity conversion.

---

## Disclaimer

This is an AI-assisted educational tool ("Claude Slop"). Calculations are indicative and simplified. Tax rules and pension legislation can change. Always verify your own situation with your pension fund or a certified financial advisor.
