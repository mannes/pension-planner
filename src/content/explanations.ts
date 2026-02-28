/**
 * All educational/help text for the pension planner.
 * Kept in one place so content can be reviewed and updated independently of UI code.
 */

export const TOOLTIPS = {
  startingSalary: 'Je huidige bruto jaarsalaris. Dit is het bedrag vóór aftrek van belasting en pensioenpremie.',

  salaryGrowthRate: 'Jaarlijkse loonstijging in procenten. Denk aan CAO-verhogingen of promoties. 2% is historisch een realistische schatting voor een gemiddelde carrière.',

  employerPct: 'Het percentage van je pensioengrondslag dat jouw werkgever in jouw pensioenpot stort. Dit staat in je arbeidscontract of cao. In Nederland varieert dit van 5% tot 25% afhankelijk van de sector.',

  employeePct: 'Het percentage van je pensioengrondslag dat jij zelf maandelijks bijdraagt. Dit wordt ingehouden op je brutosalaris, vóór berekening van inkomstenbelasting — waardoor je minder belasting betaalt.',

  franchise: 'De AOW-franchise is het deel van je salaris dat niet meetelt voor pensioenopbouw, omdat de overheid via de AOW al een basispensioen biedt. In 2024 is dit €17.545. Pensioenpremie wordt alleen berekend over het bedrag bóven de franchise.',

  franchiseGrowthRate: 'De franchise stijgt jaarlijks mee met de inflatie (gekoppeld aan het minimumloon). Standaard ~1,5% per jaar.',

  inflationRate: 'Jaarlijkse geldontwaarding. Bij 2% inflatie is €1.000 over 10 jaar nog maar €820 waard in koopkracht. Gebruik de schakelaar "Nominaal / Reëel" om het verschil te zien.',

  returnBad: '2% per jaar — vergelijkbaar met een conservatief pensioenfonds of obligatieportefeuille in een laagrenteklimaat.',
  returnNormal: '5% per jaar — het historisch gemiddelde rendement van een gemengde portefeuille (aandelen + obligaties) over lange termijn.',
  returnGood: '8% per jaar — vergelijkbaar met een aandelenportefeuille in gunstige marktomstandigheden (denk aan een S&P 500 indexfonds over de periode 1990–2020).',

  nominalVsReal: 'Nominaal toont de absolute eurobedragen. Reëel corrigeert voor inflatie en toont de koopkracht in euro\'s van vandaag. Over 30 jaar maakt dit een groot verschil!',

  leverageRatio: 'De hefboomverhouding laat zien hoeveel er in jouw pensioenpot wordt gestort voor elke netto euro die jij zelf betaalt. Hoger = betere deal voor jou.',
} as const

export const INFO_BOXES = {
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

Je pensioenpremie wordt ingehouden op je **brutosalaris**, nog vóórdat de belastingdienst zijn deel berekent. Dit heeft een groot effect:

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

- **Slecht (2%/jaar):** Conservatief — vergelijkbaar met staatsobligaties of een defensief fonds. Kan voorkomen bij langdurig lage rente of slechte beursjaren.

- **Normaal (5%/jaar):** Historisch gemiddelde van een gemengde portefeuille (60% aandelen, 40% obligaties). Dit is wat veel pensioenfondsen als verwacht rendement hanteren.

- **Goed (8%/jaar):** Aandelenlastig fonds in een gunstige periode. Het langetermijngemiddelde van de wereldaandelenmarkt (bijv. MSCI World) ligt historisch rond de 7–9% nominaal.

**Let op:** Dit zijn nominale rendementen, vóór inflatie. In reële termen liggen ze 2% lager.

Het verschil tussen 2% en 8% over 30 jaar is enorm — zie de grafiek. Dit illustreert het belang van het beleggingsbeleid van je pensioenfonds.`,
  },

  aow: {
    title: 'Pensioen en AOW: twee pijlers',
    content: `Het Nederlandse pensioenstelsel kent drie pijlers:

**1e pijler — AOW (Algemene Ouderdomswet)**
Staatspensioen voor iedereen die in Nederland heeft gewoond/gewerkt. Hoogte: circa €1.400/maand (alleenstaand) of €960/persoon (samenwonend) in 2024. Gefinancierd via omslagstelstel (huidige werkenden betalen voor huidige gepensioneerden).

**2e pijler — Werkgeverspensioen**
Het pensioen dat je via je werk opbouwt — dit is waar deze tool over gaat. Beschikbaar premieregeling (DC): je bouwt een persoonlijk kapitaal op dat bij pensionering wordt omgezet naar een uitkering.

**3e pijler — Persoonlijke voorzieningen**
Lijfrentes, banksparen, eigen beleggingen. Vrijwillig en fiscaal gunstig.

**Uitkeringsfase:** Bij pensionering wordt je opgebouwde kapitaal omgezet naar een maandelijkse uitkering. De hoogte hangt af van de rentestand op dat moment. Dit is een aparte berekening — de "schatting maandelijks pensioen" onderaan is een ruwe indicatie.`,
  },
} as const
