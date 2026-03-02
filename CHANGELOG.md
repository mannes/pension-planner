# Changelog

All notable changes to this project will be documented here. Newest entries first.

---

## 2026-03-02

### Added
- **LocalStorage persistence** (opt-in): 💾 toggle in the InputPanel header saves `SimParams` and imported pensioenoverzicht data across sessions. Disabled by default; enabling saves immediately; disabling clears all keys. Merges with `DEFAULT_PARAMS` on load for forward-compatibility.
- **Pensioenoverzicht.nl import**: Upload a JSON export from mijnpensioenoverzicht.nl to include already-accrued pension rights in the income comparison. Shows provider list, total accrued/month, and AOW projection. Parsed entirely in-browser (FileReader API), never sent to any server.
- **AOW single/partner toggle**: Pill toggle ("Alleenstaand / Met partner") in the personal situation section. Selects the correct AOW amount from `TeBereikenAlleenstaand` vs `TeBereikenSamenwonend` in the imported file, or from the manual slider. Auto-syncs when the imported file is loaded or when the toggle changes.
- **First-time guided tour** (6 steps): Welcome → Set situation → Import overview → Nominal/Real → Results → About. Highlights relevant UI elements via `data-guide-step` + CSS pulse. Accessible via "Guided tour" button in header.
- **About & glossary modal**: Full bilingual explanation of pension pillars, key concepts (franchise, pensioengrondslag, jaarruimte, DC vs DB, rekenrente), levers you can pull, what the tool does not do, and privacy information.

### Improved
- **InfoTooltip clipping fixed**: Tooltips now use `position: fixed` with coordinates from `getBoundingClientRect()`, so they are never clipped by the scrollable InputPanel container.
- **InputPanel sticky scroll**: Header (including title + 💾 toggle + mobile expand button) is always visible; content scrolls independently on desktop (`lg:max-h-[calc(100vh-3rem)]`).
- **InputPanel layout**: Salary growth slider moved to Advanced settings; upload section above Advanced; local processing note shown as prominent green 🔒 badge.
- **Mobile InputPanel**: Collapsible with mini summary strip (salary · %/% · age) when closed.
- **Income comparison**: AOW bar label reflects single/partner status; removes "(schatting)" suffix when value comes from imported file.
- **AISlopWarning**: One-time dismissable amber disclaimer banner.

---

## Earlier (initial release)

### Added
- Core pension simulation: 2nd pillar DC model (employer + employee contributions on pensioengrondslag), compounding at 2% / 5% / 8% scenarios
- 3rd pillar: optional extra personal savings, tax-deductible within jaarruimte; tracked separately in results
- Dutch Box 1 income tax (2024/2025): working-age and retirement-age brackets; marginal rate for contributions; lower bracket 1 for pension payouts (no AOW premium)
- Jaarruimte live calculation: 30% × pensioengrondslag − 2nd pillar contributions; shown as inline breakdown card in InputPanel
- Capital → monthly pension via annuity formula (1.5% rekenrente, 20 years)
- Results summary: 3 scenario cards with final capital, deposits, tax savings, estimated monthly pension
- Income comparison: gross pension − retirement tax = net pension; replacement rate gauge (Good ≥ 70% / Moderate 50–69% / Low < 50%); target 70–80%
- Tax leverage panel (year 1): waterfall breakdown + leverage ratio
- Capital chart: 3-scenario line chart over simulation period
- Contribution breakdown: stacked bar chart per year
- Bilingual NL/EN support with language toggle; preference saved in localStorage
- Nominal/Real toggle: all charts and tables switchable; IncomeComparison uses fair reference salary in each mode
- InfoTooltip (?) and collapsible InfoBox help system throughout
