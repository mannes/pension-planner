export type Language = 'nl' | 'en'

export interface InfoBoxContent { title: string; content: string }

export interface Translations {
  header: {
    title: string
    tagline: string
    whyTool: string
    nominal: string
    real: string
    inflationNote: string
    guideButton: string
  }
  inputs: {
    sectionTitle: string
    salary: string
    salaryGrowth: string
    premiesTitle: string
    employerPct: string
    employeePct: string
    extraSavings: string
    extraSavingsNote: string
    advancedTitle: string
    franchise: string
    franchiseGrowth: string
    inflation: string
    years: string
    yearsUnit: string
  }
  tooltips: {
    salary: string
    salaryGrowth: string
    employerPct: string
    employeePct: string
    extraSavings: string
    franchise: string
    franchiseGrowth: string
    inflation: string
    nominalVsReal: string
    leverageRatio: string
  }
  taxPanel: {
    title: string
    subtitle: string
    grossSalary: string
    minusFranchise: string
    pensionBase: string
    employeeContrib: string
    taxSavingLabel: string
    netCost: string
    employerContrib: string
    totalFunded: string
    leverageTitle: string
    leverageBody: (amount: string) => string
    currentYearNote: string   // shown when realMode is active
  }
  capitalChart: {
    title: string
    subtitleNominal: string
    subtitleReal: string
    yearLabel: string
    bad: string
    normal: string
    good: string
  }
  breakdown: {
    title: string
    subtitleNominal: string
    subtitleReal: string
    showYear: string
    to: string
    employer: string
    employeeGross: string
    taxSaving: string
    legendEmployer: string
    legendEmployee: string
    legendTax: string
    legendEmployerNote: string
    legendEmployeeNote: string
    legendTaxNote: string
  }
  summary: {
    title: (years: number) => string
    subtitleNominal: string
    subtitleReal: string
    endCapital: string
    totalDeposited: string
    totalTaxSavings: string
    yourNetCost: string
    monthlyPension: string
    perMonth: string
    badLabel: string
    normalLabel: string
    goodLabel: string
    ratePerYear: string
    disclaimer: string
    pillarsNote: string
  }
  incomeComparison: {
    title: string
    subtitle: string
    currentNetMonthly: string
    pillar2: string
    pillar3: string
    pillar3None: string
    aow: string
    aowNote: string
    grossNote: string         // "(bruto)" shown next to each pillar bar
    pensionTaxLabel: string   // tax deduction row label
    pensionTaxNote: string    // short explanation of reduced retirement rate
    netTotalLabel: string     // net monthly pension (after retirement tax)
    totalMonthly: string      // kept for compatibility
    replacementRate: string
    targetNote: string
    statusGood: string
    statusModerate: string
    statusLow: string
    statusGoodNote: string
    statusModerateNote: string
    statusLowNote: string
    scenarioLabel: string
    normalScenario: string
    nominalWarningTitle: string
    nominalWarningBody: string
  }
  warning: {
    title: string
    body: string
    dismiss: string
  }
  guide: {
    welcome: { title: string; body: string }
    step1: { title: string; body: string }
    step2: { title: string; body: string }
    step3: { title: string; body: string }
    step4: { title: string; body: string }
    step5: { title: string; body: string }
    prevBtn: string
    nextBtn: string
    finishBtn: string
    skipBtn: string
    stepOf: (current: number, total: number) => string
  }
  infoBoxes: {
    pensioengrondslag: InfoBoxContent
    taxLeverage: InfoBoxContent
    dutchTax: InfoBoxContent
    returnScenarios: InfoBoxContent
    aow: InfoBoxContent
    pillars: InfoBoxContent
    extraSavings: InfoBoxContent
  }
  footer: string
}

// ─── Dutch ──────────────────────────────────────────────────────────────────

const nl: Translations = {
  header: {
    title: '🏦 Nederlandse Pensioenplanner',
    tagline: 'Begrijp hoe je pensioen groeit — en wat het je echt kost',
    whyTool: 'Veel mensen denken niet na over pensioen totdat het te laat is. Speel met de schuifregelaars en ontdek hoe kleine veranderingen in werkgeversbijdrage, loonstijging of rendement na 30 jaar een enorm verschil maken — en waarom pensioenopbouw via je brutosalaris één van de slimste financiële keuzes is die je kunt maken.',
    nominal: 'Nominaal',
    real: 'Reëel',
    inflationNote: '(gecorrigeerd voor inflatie)',
    guideButton: 'Rondleiding',
  },
  inputs: {
    sectionTitle: '⚙️ Jouw situatie',
    salary: 'Bruto jaarsalaris',
    salaryGrowth: 'Jaarlijkse loonstijging',
    premiesTitle: 'Pensioenpremies',
    employerPct: 'Werkgeversbijdrage',
    employeePct: 'Werknemersbijdrage',
    extraSavings: 'Extra eigen spaarbedrag/mnd',
    extraSavingsNote: 'Via lijfrente of banksparen (3e pijler)',
    advancedTitle: 'Geavanceerde instellingen',
    franchise: 'AOW-franchise',
    franchiseGrowth: 'Franchise-stijging p/j',
    inflation: 'Inflatie',
    years: 'Looptijd',
    yearsUnit: 'jaar',
  },
  tooltips: {
    salary: 'Je huidige bruto jaarsalaris. Dit is het bedrag vóór aftrek van belasting en pensioenpremie.',
    salaryGrowth: 'Jaarlijkse loonstijging in procenten. Denk aan CAO-verhogingen of promoties. 2% is historisch een realistische schatting voor een gemiddelde carrière.',
    employerPct: 'Het percentage van je pensioengrondslag dat jouw werkgever in jouw pensioenpot stort. Dit staat in je arbeidscontract of cao. In Nederland varieert dit van 5% tot 25% afhankelijk van de sector.',
    employeePct: 'Het percentage van je pensioengrondslag dat jij zelf maandelijks bijdraagt. Dit wordt ingehouden op je brutosalaris, vóór berekening van inkomstenbelasting — waardoor je minder belasting betaalt.',
    extraSavings: 'Bedrag dat je maandelijks extra inlegt via een eigen pensioenproduct (lijfrente of banksparen). Dit is fiscaal aftrekbaar binnen je jaarruimte — je krijgt een deel terug via de belastingdienst.',
    franchise: 'De AOW-franchise is het deel van je salaris dat niet meetelt voor pensioenopbouw, omdat de overheid via de AOW al een basispensioen biedt. In 2024 is dit €17.545.',
    franchiseGrowth: 'De franchise stijgt jaarlijks mee met de inflatie (gekoppeld aan het minimumloon). Standaard ~1,5% per jaar.',
    inflation: 'Jaarlijkse geldontwaarding. Bij 2% inflatie is €1.000 over 10 jaar nog maar €820 waard in koopkracht.',
    nominalVsReal: 'Nominaal toont de absolute eurobedragen. Reëel corrigeert voor inflatie en toont de koopkracht in euro\'s van vandaag. Over 30 jaar maakt dit een groot verschil!',
    leverageRatio: 'De hefboomverhouding laat zien hoeveel er in jouw pensioenpot wordt gestort voor elke netto euro die jij zelf betaalt.',
  },
  taxPanel: {
    title: '💡 Belastingvoordeel — jaar 1',
    subtitle: 'Zo werkt de hefboom van pensioen voor jouw situatie',
    grossSalary: 'Bruto jaarsalaris',
    minusFranchise: 'Minus AOW-franchise',
    pensionBase: '= Pensioengrondslag',
    employeeContrib: 'Jouw bijdrage bruto',
    taxSavingLabel: 'Belastingbesparing',
    netCost: '= Jouw netto kosten',
    employerContrib: 'Werkgeversbijdrage',
    totalFunded: 'Totaal naar pensioenpot',
    leverageTitle: 'Hefboomverhouding',
    leverageBody: (amount) => `Voor elke netto euro die jij betaalt, gaat ${amount} naar jouw pensioen.`,
    currentYearNote: '📍 Toont jaar-1 bedragen in huidige euro\'s — niet beïnvloed door de inflatie-schakelaar.',
  },
  capitalChart: {
    title: '📈 Pensioenkapitaal over de tijd',
    subtitleNominal: 'Opgebouwd pensioenkapitaal per jaar voor drie rendementsscenario\'s — nominale euro\'s',
    subtitleReal: 'Opgebouwd pensioenkapitaal per jaar voor drie rendementsscenario\'s — in euro\'s van vandaag (reëel)',
    yearLabel: 'Jaar',
    bad: 'Slecht (2%)',
    normal: 'Normaal (5%)',
    good: 'Goed (8%)',
  },
  breakdown: {
    title: '📊 Jaarlijkse bijdrage-opbouw',
    subtitleNominal: 'Hoe elke euro naar je pensioen gaat: werkgever, jijzelf en het belastingvoordeel',
    subtitleReal: 'Hoe elke euro naar je pensioen gaat — reëel (euro\'s van vandaag)',
    showYear: 'Toon jaar',
    to: 't/m',
    employer: 'Werkgever',
    employeeGross: 'Werknemer (bruto)',
    taxSaving: 'Belastingbesparing',
    legendEmployer: 'Werkgever',
    legendEmployee: 'Werknemer bruto',
    legendTax: 'Belastingbesparing',
    legendEmployerNote: 'Gratis voor jou',
    legendEmployeeNote: 'Vóór belastingkorting',
    legendTaxNote: 'Korting via belastingdienst',
  },
  summary: {
    title: (y) => `🏁 Eindresultaat na ${y} jaar`,
    subtitleNominal: 'Vergelijking van drie rendementsscenario\'s — nominaal',
    subtitleReal: 'Vergelijking van drie rendementsscenario\'s — reëel (euro\'s van vandaag)',
    endCapital: 'Eindkapitaal (2e pijler)',
    totalDeposited: 'Totaal ingelegd bruto',
    totalTaxSavings: 'Belastingbesparing totaal',
    yourNetCost: 'Jouw netto kosten',
    monthlyPension: 'Geschat maandpensioen ≈',
    perMonth: '/mnd',
    badLabel: 'Slecht scenario',
    normalLabel: 'Normaal scenario',
    goodLabel: 'Goed scenario',
    ratePerYear: '%/jaar',
    disclaimer: 'Het geschatte maandpensioen is een ruwe indicatie. Kapitaalopbouw gebruikt het gekozen rendement (2/5/8%); de omzetting naar maandpensioen gebruikt een vaste rekenrente van 1,5% over 20 jaar — conform conservatieve pensioenfondspraktijk, los van het beleggingsrendement. Dit hulpmiddel rekent alleen vooruit: al opgebouwde rechten uit eerdere jaren zijn niet inbegrepen. Raadpleeg mijnpensioenoverzicht.nl voor een prognose op basis van jouw werkelijke fonds.',
    pillarsNote: 'Dit eindkapitaal is uitsluitend je 2e pijler pensioen (via werkgever + eigen bijdrage). De AOW (~€1.400/mnd alleenstaand) en eventuele eigen spaarpot (3e pijler) komen hier nog bovenop. Zie "Inkomensvergelijking" hieronder voor het totaalplaatje.',
  },
  incomeComparison: {
    title: '⚖️ Pensioen vs. huidig inkomen',
    subtitle: 'Hoeveel van je huidige netto inkomen vervangt je pensioen?',
    currentNetMonthly: 'Huidig netto maandinkomen',
    pillar2: '2e pijler (werkgeverspensioen)',
    pillar3: '3e pijler (eigen spaarpot)',
    pillar3None: 'Geen extra spaarbedrag ingesteld',
    aow: 'AOW-uitkering (bruto schatting)',
    aowNote: '~€1.400/mnd alleenstaand bruto (2024). Stel in via schuifregelaar.',
    grossNote: '(bruto)',
    pensionTaxLabel: 'Belasting (AOW-leeftijdstarief)',
    pensionTaxNote: 'AOW-gerechtigden betalen geen AOW-premie meer (~17,9%). Schijf 1 is daardoor ~19,07% i.p.v. 36,97%.',
    netTotalLabel: 'Netto maandpensioen',
    totalMonthly: 'Totaal bruto pensioen',
    replacementRate: 'Vervangingsratio (netto/netto)',
    targetNote: 'Doel: 70–80% van je netto inkomen',
    statusGood: 'Goed',
    statusModerate: 'Matig',
    statusLow: 'Laag',
    statusGoodNote: 'Je pensioen vervangt een gezond deel van je inkomen.',
    statusModerateNote: 'Je pensioen dekt een deel van je inkomen. Overweeg extra sparen.',
    statusLowNote: 'Je pensioen vervangt minder dan de helft van je inkomen. Extra sparen is sterk aan te raden.',
    scenarioLabel: 'Scenario',
    normalScenario: 'Normaal (5%)',
    nominalWarningTitle: 'Let op: nominale vergelijking',
    nominalWarningBody: 'Toekomstige pensioenbedragen zijn in euro\'s van jaar N (opgepompt door inflatie), je huidig inkomen is in euro\'s van nu. Dit maakt de vervangingsratio misleidend hoog. Schakel naar "Reëel" voor een eerlijke vergelijking.',
  },
  warning: {
    title: '⚠️ Informatief hulpmiddel — geen financieel advies',
    body: 'Dit is een AI-gegenereerd hulpmiddel ("Claude Slop"). De berekeningen zijn bedoeld als indicatie en vereenvoudigen de werkelijkheid. Verifieer altijd je eigen situatie bij je pensioenfonds of een erkend financieel adviseur. Belastingregels en pensioenwetgeving kunnen wijzigen.',
    dismiss: 'Begrepen, sluit melding',
  },
  guide: {
    welcome: {
      title: 'Welkom bij de Pensioenplanner!',
      body: 'Dit hulpmiddel laat je zien hoe je pensioen opbouwt en wat het je echt kost — rekening houdend met Nederlandse belastingregels. We geven je een korte rondleiding door de instellingen.',
    },
    step1: {
      title: '1. Jouw brutosalaris',
      body: 'Stel je huidige bruto jaarsalaris in met de schuifregelaar links. Dit vind je op je loonstrook of in je arbeidscontract. Brutosalaris is het bedrag vóór belasting en inhoudingen.',
    },
    step2: {
      title: '2. Je pensioenregeling',
      body: 'Werkgever en werknemer betalen elk een percentage van je pensioengrondslag (brutosalaris minus AOW-franchise). Kijk in je arbeidscontract of cao-regeling voor de exacte percentages. Weet je het niet? Vraag het aan je HR-afdeling of kijk op MijnPensioenoverzicht.nl.',
    },
    step3: {
      title: '3. Extra eigen sparen (optioneel)',
      body: 'Naast je werkgeverspensioen kun je zelf extra sparen via een lijfrente of bankspaarproduct. Dit is fiscaal aftrekbaar binnen je jaarruimte — je krijgt een deel terug van de belastingdienst. Stel het maandbedrag in als je dit doet.',
    },
    step4: {
      title: '4. Lees de resultaten',
      body: 'De resultaten bovenaan tonen je geschatte eindkapitaal en maandpensioen. De "Belastingvoordeel"-sectie laat zien wat de pensioenopbouw je echt kost na belastingteruggave. Gebruik de schakelaar "Nominaal / Reëel" om te zien wat je pensioen echt waard is na inflatie.',
    },
    step5: {
      title: '5. Vergelijk scenario\'s',
      body: 'Het rendement op je pensioenpot is onzeker. Drie scenario\'s laten de bandbreedte zien: slecht (2%), normaal (5%) en goed (8%) per jaar. Gebruik dit om je verwachtingen realistisch bij te stellen — én om te zien dat zelfs het slechte scenario significant pensioenkapitaal oplevert.',
    },
    prevBtn: '← Vorige',
    nextBtn: 'Volgende →',
    finishBtn: 'Start met plannen',
    skipBtn: 'Rondleiding overslaan',
    stepOf: (c, t) => `Stap ${c} van ${t}`,
  },
  infoBoxes: {
    pensioengrondslag: {
      title: 'Wat is de pensioengrondslag?',
      content: `De pensioengrondslag (ook wel pensioenbasis) is het deel van je salaris waarover pensioen wordt opgebouwd. Het is **niet je volledige salaris**.

De formule is:
> **Pensioengrondslag = Brutosalaris − AOW-franchise**

De **AOW-franchise** (in 2024: €17.545) wordt afgetrokken omdat de overheid via de AOW al een basispensioen uitkeert. Jouw werkgever hoeft alleen het deel bóven dit bedrag aan te vullen.

**Voorbeeld bij €45.000 brutosalaris:**
- Brutosalaris: €45.000
- Minus franchise: − €17.545
- **Pensioengrondslag: €27.455**

Pensioenpremies van werkgever en werknemer worden berekend als percentage van dit lagere bedrag.`,
    },
    taxLeverage: {
      title: 'De belastingvoordeel: pensioenpremie vóór belasting',
      content: `Dit is één van de grootste financiële voordelen die veel Nederlanders niet kennen.

Je pensioenpremie wordt ingehouden op je **brutosalaris**, nog vóórdat de belastingdienst zijn deel berekent.

**Stel: je verdient €45.000 en betaalt €1.373 pensioenpremie (5%)**

Zonder pensioenaftrek betaal je belasting over €45.000.
Met pensioenaftrek betaal je belasting over €43.627.

Bij een marginaal tarief van **36,97%** scheelt dat:
> €1.373 × 36,97% = **€508 minder belasting per jaar**

Je netto kosten zijn dan slechts **€865**, terwijl er €1.373 bruto naar je pensioen gaat.

En dan telt de werkgeversbijdrage er nog bij op — je krijgt in dit voorbeeld €2.746 van je werkgever erbij. **Totaal naar pensioen: €4.119, jouw netto kosten: €865.**

Dit is de hefboomwerking van pensioen.`,
    },
    dutchTax: {
      title: 'Hoe werkt de Nederlandse inkomstenbelasting (Box 1)?',
      content: `Nederland heeft een progressief belastingstelsel. Hoe meer je verdient, hoe hoger het percentage over het meerdere. Voor mensen onder de AOW-leeftijd gelden twee schijven (2024):

| Schijf | Inkomen | Tarief |
|--------|---------|--------|
| Schijf 1 | t/m €75.518 | 36,97% |
| Schijf 2 | boven €75.518 | 49,50% |

In schijf 1 zit ook de premie voor volksverzekeringen (AOW, ANW, Wlz).

**Marginaal tarief** is het tarief over de laatste euro die je verdient — en daarmee ook het tarief waartegen je pensioenpremie wordt afgetrokken.

Als je bijv. €50.000 verdient, is je marginale tarief 36,97%. Verdien je €80.000, dan is je marginale tarief 49,50% — en dat maakt de belastingbesparing op pensioen nóg groter.`,
    },
    returnScenarios: {
      title: 'Wat zijn de rendementsscenario\'s?',
      content: `Pensioenkapitaal wordt belegd. Het rendement is onzeker en hangt af van hoe het fonds belegt.

- **Slecht (2%/jaar):** Conservatief — vergelijkbaar met staatsobligaties of een defensief fonds.

- **Normaal (5%/jaar):** Historisch gemiddelde van een gemengde portefeuille (60% aandelen, 40% obligaties).

- **Goed (8%/jaar):** Aandelenlastig fonds in een gunstige periode. Historisch gemiddelde van de wereldaandelenmarkt.

**Let op:** Dit zijn nominale rendementen, vóór inflatie. In reële termen liggen ze 2% lager.

Het verschil tussen 2% en 8% over 30 jaar is enorm — zie de grafiek. Dit illustreert het belang van het beleggingsbeleid van je pensioenfonds.`,
    },
    aow: {
      title: 'Pensioen en AOW: twee pijlers',
      content: `Het Nederlandse pensioenstelsel kent drie pijlers:

**1e pijler — AOW (Algemene Ouderdomswet)**
Staatspensioen voor iedereen die in Nederland heeft gewoond/gewerkt. Hoogte: circa €1.400/maand (alleenstaand) of €960/persoon (samenwonend) in 2024.

**2e pijler — Werkgeverspensioen**
Het pensioen dat je via je werk opbouwt — dit is waar de hoofdberekening over gaat. Beschikbare premieregeling (DC): je bouwt een persoonlijk kapitaal op dat bij pensionering wordt omgezet naar een uitkering.

**3e pijler — Persoonlijke voorzieningen**
Lijfrentes, banksparen, eigen beleggingen. Vrijwillig en fiscaal gunstig.

De "Inkomensvergelijking" laat zien hoe alle drie optellen.`,
    },
    pillars: {
      title: 'Wat zit er in dit eindkapitaal?',
      content: `**Dit eindkapitaal is alleen je 2e pijler** — het pensioen dat je via je werkgever opbouwt (werkgeversbijdrage + eigen bijdrage).

Niet inbegrepen:
- **AOW (1e pijler):** Iedereen die in Nederland woont/werkt bouwt AOW op. Dit is circa €1.400/mnd voor alleenstaanden in 2024. Dit komt bovenop je werkgeverspensioen.
- **3e pijler:** Als je extra spaart via een eigen lijfrente of bankspaarproduct, is dat een aparte pot. Je kunt dit invoeren via het invoerveld "Extra eigen spaarbedrag".

De "Inkomensvergelijking" hieronder toont het gecombineerde plaatje van alle pijlers.`,
    },
    extraSavings: {
      title: 'Extra pensioensparen: de 3e pijler',
      content: `Naast je werkgeverspensioen kun je zelf extra sparen voor je pensioen via een **lijfrente** of **bankspaarproduct** (de zogenoemde 3e pijler).

**Fiscaal voordeel:**
Net als bij je werknemersbijdrage zijn extra pensioeninlagen aftrekbaar van je belastbaar inkomen — mits je binnen je **jaarruimte** blijft. De jaarruimte is het maximum bedrag dat je fiscaal voordelig mag inleggen.

Vereenvoudigde jaarruimte-formule:
> 30% × (vorig jaar inkomen − franchise) − 6,27 × A-factor

In de praktijk: voor de meeste mensen die geen volledig pensioen via hun werkgever hebben, is er ruimte om extra af te trekken.

**Let op:** Dit hulpmiddel berekent het belastingvoordeel vereenvoudigd (marginale tarief × inleg). Raadpleeg de Belastingdienst of een adviseur voor jouw exacte jaarruimte.`,
    },
  },
  footer: 'Gebaseerd op Nederlandse belastingregels en pensioenwetgeving 2024/2025. Dit is een educatief hulpmiddel — geen financieel advies. Raadpleeg een financieel adviseur voor persoonlijk advies.',
}

// ─── English ─────────────────────────────────────────────────────────────────

const en: Translations = {
  header: {
    title: '🏦 Dutch Pension Planner',
    tagline: 'Understand how your pension grows — and what it really costs you',
    whyTool: 'Many people don\'t think about their pension until it\'s too late. Play with the sliders and discover how small changes in employer contribution, salary growth, or investment return can make an enormous difference after 30 years — and why building pension through your gross salary is one of the smartest financial choices you can make.',
    nominal: 'Nominal',
    real: 'Real',
    inflationNote: '(adjusted for inflation)',
    guideButton: 'Guided tour',
  },
  inputs: {
    sectionTitle: '⚙️ Your situation',
    salary: 'Gross annual salary',
    salaryGrowth: 'Annual salary growth',
    premiesTitle: 'Pension contributions',
    employerPct: 'Employer contribution',
    employeePct: 'Employee contribution',
    extraSavings: 'Extra personal savings/month',
    extraSavingsNote: 'Via annuity or bank savings (3rd pillar)',
    advancedTitle: 'Advanced settings',
    franchise: 'AOW threshold (franchise)',
    franchiseGrowth: 'Threshold growth p/yr',
    inflation: 'Inflation',
    years: 'Duration',
    yearsUnit: 'years',
  },
  tooltips: {
    salary: 'Your current gross annual salary. This is the amount before tax and pension deductions — find it on your payslip.',
    salaryGrowth: 'Annual salary increase as a percentage. Think collective agreement raises or promotions. 2% is a historically realistic average for a typical career.',
    employerPct: 'The percentage of your pension base that your employer deposits into your pension pot. This is in your employment contract or collective agreement (cao). In the Netherlands this ranges from 5% to 25% depending on the sector.',
    employeePct: 'The percentage of your pension base that you contribute monthly yourself. This is deducted from your gross salary before income tax is calculated — so you pay less tax.',
    extraSavings: 'Amount you save monthly through your own pension product (annuity or bank savings). This is tax-deductible within your annual space (jaarruimte) — you get part of it back from the tax authority.',
    franchise: 'The AOW threshold (franchise) is the part of your salary excluded from pension accrual, because the government already provides a basic state pension (AOW). In 2024 this is €17,545.',
    franchiseGrowth: 'The threshold rises annually with inflation (linked to the minimum wage). Default ~1.5% per year.',
    inflation: 'Annual purchasing power erosion. At 2% inflation, €1,000 is only worth €820 in purchasing power after 10 years.',
    nominalVsReal: 'Nominal shows absolute euro amounts. Real adjusts for inflation and shows purchasing power in today\'s euros. Over 30 years this makes a huge difference!',
    leverageRatio: 'The leverage ratio shows how much goes into your pension pot for every net euro you actually pay yourself.',
  },
  taxPanel: {
    title: '💡 Tax benefit — year 1',
    subtitle: 'How the pension leverage works in your situation',
    grossSalary: 'Gross annual salary',
    minusFranchise: 'Minus AOW threshold',
    pensionBase: '= Pension base',
    employeeContrib: 'Your contribution (gross)',
    taxSavingLabel: 'Tax saving',
    netCost: '= Your net cost',
    employerContrib: 'Employer contribution',
    totalFunded: 'Total to pension pot',
    leverageTitle: 'Leverage ratio',
    leverageBody: (amount) => `For every net euro you pay, ${amount} goes into your pension.`,
    currentYearNote: '📍 Shows year-1 amounts in current euros — not affected by the inflation toggle.',
  },
  capitalChart: {
    title: '📈 Pension capital over time',
    subtitleNominal: 'Accumulated pension capital per year for three return scenarios — nominal euros',
    subtitleReal: 'Accumulated pension capital per year for three return scenarios — in today\'s euros (real)',
    yearLabel: 'Year',
    bad: 'Poor (2%)',
    normal: 'Average (5%)',
    good: 'Good (8%)',
  },
  breakdown: {
    title: '📊 Annual contribution build-up',
    subtitleNominal: 'How every euro goes to your pension: employer, yourself, and the tax benefit',
    subtitleReal: 'How every euro goes to your pension — real (today\'s euros)',
    showYear: 'Show year',
    to: 'to',
    employer: 'Employer',
    employeeGross: 'Employee (gross)',
    taxSaving: 'Tax saving',
    legendEmployer: 'Employer',
    legendEmployee: 'Employee gross',
    legendTax: 'Tax saving',
    legendEmployerNote: 'Free for you',
    legendEmployeeNote: 'Before tax relief',
    legendTaxNote: 'Via tax authority',
  },
  summary: {
    title: (y) => `🏁 Final result after ${y} years`,
    subtitleNominal: 'Comparison of three return scenarios — nominal',
    subtitleReal: 'Comparison of three return scenarios — real (today\'s euros)',
    endCapital: 'Final capital (2nd pillar)',
    totalDeposited: 'Total deposited (gross)',
    totalTaxSavings: 'Total tax savings',
    yourNetCost: 'Your net cost',
    monthlyPension: 'Est. monthly pension ≈',
    perMonth: '/month',
    badLabel: 'Poor scenario',
    normalLabel: 'Average scenario',
    goodLabel: 'Good scenario',
    ratePerYear: '%/year',
    disclaimer: 'The estimated monthly pension is a rough indication. Capital accumulation uses the selected return rate (2/5/8%); conversion to monthly pension uses a fixed annuity rate of 1.5% over 20 years — in line with conservative pension fund practice, separate from the investment return. This tool only projects forward: pension rights already accrued from past years of service are not included. Check mijnpensioenoverzicht.nl for a projection from your actual fund.',
    pillarsNote: 'This capital is your 2nd pillar pension only (employer + employee contributions). AOW (~€1,400/month single) and any personal savings (3rd pillar) are on top of this. See "Income Comparison" below for the full picture.',
  },
  incomeComparison: {
    title: '⚖️ Pension vs. current income',
    subtitle: 'How much of your current net income does your pension replace?',
    currentNetMonthly: 'Current net monthly income',
    pillar2: '2nd pillar (employer pension)',
    pillar3: '3rd pillar (personal savings)',
    pillar3None: 'No extra savings configured',
    aow: 'AOW state pension (gross estimate)',
    aowNote: '~€1,400/month single gross (2024). Adjust via slider if your situation differs.',
    grossNote: '(gross)',
    pensionTaxLabel: 'Tax (retirement-age rate)',
    pensionTaxNote: 'AOW recipients no longer pay the AOW premium (~17.9%), so bracket 1 drops from 36.97% to ~19.07%.',
    netTotalLabel: 'Net monthly pension',
    totalMonthly: 'Total gross pension',
    replacementRate: 'Replacement rate (net/net)',
    targetNote: 'Target: 70–80% of net income',
    statusGood: 'Good',
    statusModerate: 'Moderate',
    statusLow: 'Low',
    statusGoodNote: 'Your pension replaces a healthy portion of your income.',
    statusModerateNote: 'Your pension covers part of your income. Consider saving extra.',
    statusLowNote: 'Your pension replaces less than half your income. Additional saving is strongly recommended.',
    scenarioLabel: 'Scenario',
    normalScenario: 'Average (5%)',
    nominalWarningTitle: 'Note: nominal comparison',
    nominalWarningBody: 'Future pension amounts are in year-N euros (inflated), while your current income is in today\'s euros. This makes the replacement rate misleadingly high. Switch to "Real" for a fair comparison.',
  },
  warning: {
    title: '⚠️ Informational tool — not financial advice',
    body: 'This is an AI-generated tool ("Claude Slop"). Calculations are indicative only and simplify reality. Always verify your own situation with your pension fund or a certified financial advisor. Tax rules and pension legislation can change.',
    dismiss: 'Got it, close this notice',
  },
  guide: {
    welcome: {
      title: 'Welcome to the Pension Planner!',
      body: 'This tool shows you how your Dutch pension builds up and what it really costs you — taking Dutch tax rules into account. Let\'s take a quick tour through the settings.',
    },
    step1: {
      title: '1. Your gross salary',
      body: 'Set your current gross annual salary using the slider on the left. You\'ll find this on your payslip (loonstrook) or in your employment contract. Gross salary is the amount before tax and deductions.',
    },
    step2: {
      title: '2. Your pension deal',
      body: 'Both employer and employee pay a percentage of your pension base. Check your employment contract or collective agreement (cao) for the exact percentages. Not sure? Ask your HR department or check MijnPensioenoverzicht.nl.',
    },
    step3: {
      title: '3. Extra personal savings (optional)',
      body: 'On top of your employer pension, you can save extra via a personal annuity (lijfrente) or bank savings product — the "3rd pillar". This is tax-deductible within your annual allowance (jaarruimte). Enter the monthly amount if applicable.',
    },
    step4: {
      title: '4. Reading the results',
      body: 'The results at the top show your estimated final capital and monthly pension. The "Tax benefit" section shows what pension accrual actually costs you after tax relief. Use the "Nominal / Real" toggle to see what your pension is worth in today\'s purchasing power.',
    },
    step5: {
      title: '5. Compare scenarios',
      body: 'Investment return on your pension pot is uncertain. Three scenarios show the range: poor (2%), average (5%), and good (8%) per year. Use this to set realistic expectations — and to see that even the poor scenario produces significant pension capital.',
    },
    prevBtn: '← Back',
    nextBtn: 'Next →',
    finishBtn: 'Start planning',
    skipBtn: 'Skip tour',
    stepOf: (c, t) => `Step ${c} of ${t}`,
  },
  infoBoxes: {
    pensioengrondslag: {
      title: 'What is the pension base?',
      content: `The pension base (pensioengrondslag) is the part of your salary that counts for pension accrual. It is **not your full salary**.

The formula is:
> **Pension base = Gross salary − AOW threshold (franchise)**

The **AOW threshold** (€17,545 in 2024) is deducted because the Dutch state already provides a basic pension (AOW) to everyone. Your employer's pension only supplements income above this threshold.

**Example with €45,000 gross salary:**
- Gross salary: €45,000
- Minus threshold: − €17,545
- **Pension base: €27,455**

Both employer and employee contributions are calculated as a percentage of this lower amount.`,
    },
    taxLeverage: {
      title: 'The tax advantage: pension contributions before tax',
      content: `This is one of the biggest financial benefits that many people don't know about.

Your pension contribution is deducted from your **gross salary** before income tax is calculated. This has a significant effect:

**Example: earning €45,000, paying €1,373 pension contribution (5%)**

Without pension deduction, you pay tax on €45,000.
With pension deduction, you pay tax on €43,627.

At a marginal rate of **36.97%**, that saves:
> €1,373 × 36.97% = **€508 less tax per year**

Your net cost is only **€865**, while €1,373 gross goes to your pension.

And your employer's contribution is added on top — in this example €2,746 from your employer. **Total to pension: €4,119, your net cost: €865.**

This is the leverage effect of pension savings.`,
    },
    dutchTax: {
      title: 'How does Dutch income tax (Box 1) work?',
      content: `The Netherlands has a progressive tax system. The more you earn, the higher the rate on the excess. Two brackets apply for people below AOW retirement age (2024):

| Bracket | Income | Rate |
|---------|--------|------|
| Bracket 1 | Up to €75,518 | 36.97% |
| Bracket 2 | Above €75,518 | 49.50% |

Bracket 1 also includes national insurance premiums (AOW, ANW, Wlz).

**Marginal rate** is the rate on your last euro earned — and therefore the rate at which your pension contribution is deducted.

If you earn €50,000, your marginal rate is 36.97%. If you earn €80,000, your marginal rate is 49.50% — making the tax saving on pension even larger.`,
    },
    returnScenarios: {
      title: 'What are the return scenarios?',
      content: `Pension capital is invested. The return is uncertain and depends on how the fund invests.

- **Poor (2%/year):** Conservative — comparable to government bonds or a defensive fund in a low-rate environment.

- **Average (5%/year):** Historical average of a balanced portfolio (60% equities, 40% bonds). This is what many pension funds use as expected return.

- **Good (8%/year):** Equity-heavy fund in a favourable period. The long-term historical average of global equity markets (e.g. MSCI World) is around 7–9% nominal.

**Note:** These are nominal returns, before inflation. In real terms they are about 2% lower.

The difference between 2% and 8% over 30 years is enormous — see the chart. This illustrates the importance of your pension fund's investment policy.`,
    },
    aow: {
      title: 'Pension and AOW: the three pillars',
      content: `The Dutch pension system has three pillars:

**1st pillar — AOW (General Old Age Pensions Act)**
State pension for everyone who has lived/worked in the Netherlands. Amount: approximately €1,400/month (single) or €960/person (couple) in 2024.

**2nd pillar — Employer pension**
The pension you build through work — this is what the main calculation is about. Defined contribution (DC): you build personal capital that is converted to a payout at retirement.

**3rd pillar — Personal provisions**
Annuities, bank savings, own investments. Voluntary and tax-advantaged.

The "Income Comparison" panel shows how all three add up.`,
    },
    pillars: {
      title: 'What does this final capital include?',
      content: `**This final capital is your 2nd pillar only** — the pension you build through your employer (employer contribution + your own contribution).

Not included:
- **AOW (1st pillar):** Everyone living/working in the Netherlands accrues AOW. This is approximately €1,400/month for singles in 2024. This comes on top of your employer pension.
- **3rd pillar:** If you save extra via your own annuity or bank savings product, that is a separate pot. You can enter it via the "Extra personal savings" field.

The "Income Comparison" panel below shows the combined picture of all pillars.`,
    },
    extraSavings: {
      title: 'Extra pension savings: the 3rd pillar',
      content: `On top of your employer pension, you can save extra for retirement via an **annuity** (lijfrente) or **bank savings product** (banksparen) — the so-called 3rd pillar.

**Tax benefit:**
Just like your employee contribution, extra pension deposits are deductible from your taxable income — provided you stay within your **annual space** (jaarruimte). The jaarruimte is the maximum amount you can save with tax benefit.

Simplified jaarruimte formula:
> 30% × (previous year income − threshold) − 6.27 × A-factor

In practice: most people who don't have a full employer pension have room to deduct extra savings.

**Note:** This tool calculates the tax benefit in a simplified way (marginal rate × contribution). Consult the Dutch Tax Authority or an advisor for your exact annual space.`,
    },
  },
  footer: 'Based on Dutch tax rules and pension legislation 2024/2025. This is an educational tool — not financial advice. Consult a financial advisor for personal advice.',
}

export const translations: Record<Language, Translations> = { nl, en }
