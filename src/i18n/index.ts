export type Lang = 'nl' | 'en';

export interface Translations {
  // header
  header: {
    title: string;
    subtitle: string;
    guidedTour: string;
    about: string;
  };
  // general
  nominal: string;
  real: string;
  realToggle: string;
  // input panel
  input: {
    title: string;
    collapse: string;
    expand: string;
    salary: string;
    salaryHelp: string;
    age: string;
    ageHelp: string;
    salaryGrowth: string;
    salaryGrowthHelp: string;
    employerPct: string;
    employerPctHelp: string;
    employeePct: string;
    employeePctHelp: string;
    extraSavings: string;
    extraSavingsHelp: string;
    franchise: string;
    franchiseHelp: string;
    franchiseGrowth: string;
    franchiseGrowthHelp: string;
    inflation: string;
    inflationHelp: string;
    annuityRate: string;
    annuityRateHelp: string;
    payoutYears: string;
    payoutYearsHelp: string;
    aow: string;
    aowHelp: string;
    aowPartner: string;
    aowPartnerSingle: string;
    aowPartnerWith: string;
    advanced: string;
    persist: string;
    persistHelp: string;
    miniSummary: string;
  };
  // jaarruimte
  jaarruimte: {
    title: string;
    maxSpace: string;
    minus2nd: string;
    available: string;
    usage: string;
    remaining: string;
    exceeded: string;
    disclaimer: string;
  };
  // summary table
  summary: {
    title: string;
    bad: string;
    normal: string;
    good: string;
    capital2nd: string;
    capital3rd: string;
    capitalTotal: string;
    deposits2nd: string;
    employerGross: string;
    employeeGross: string;
    taxSaving: string;
    netCost: string;
    deposits3rd: string;
    monthlyPension: string;
    disclaimer: string;
    pillarsNote: string;
  };
  // income comparison
  income: {
    title: string;
    referenceSalary: string;
    pension2nd: string;
    pension3rd: string;
    accrued: string;
    aowLabel: string;
    aowEstimate: string;
    aowFromFile: string;
    grossTotal: string;
    tax: string;
    netPension: string;
    replacementRate: string;
    good: string;
    moderate: string;
    low: string;
    targetNote: string;
  };
  // tax leverage
  tax: {
    title: string;
    grossSalary: string;
    franchise: string;
    pensionBase: string;
    employeeGross: string;
    taxSaving: string;
    netCost: string;
    employer: string;
    totalFunded: string;
    leverageRatio: string;
    extraSavings: string;
    extraTaxBenefit: string;
    extraNetCost: string;
    realModeNote: string;
  };
  // capital chart
  chart: {
    title: string;
    bad: string;
    normal: string;
    good: string;
    capital: string;
    year: string;
    midpoint: string;
  };
  // contribution breakdown
  contrib: {
    title: string;
    employer: string;
    employeeGross: string;
    taxSaving: string;
  };
  // pensioenoverzicht upload
  pensioenoverzicht: {
    title: string;
    uploadButton: string;
    localNote: string;
    successProviders: string;
    successTotal: string;
    successAow: string;
    clear: string;
    error: string;
  };
  // info boxes
  infoBox: {
    readMore: string;
    close: string;
  };
  infoBoxes: {
    pensionBase: { title: string; content: string };
    taxLeverage: { title: string; content: string };
    taxBrackets: { title: string; content: string };
    scenarios: { title: string; content: string };
    aowPillars: { title: string; content: string };
    resultCapital: { title: string; content: string };
    extraSavings: { title: string; content: string };
    retirementCosts: { title: string; content: string };
  };
  // glossary
  glossary: {
    title: string;
    subtitle: string;
    entries: { term: string; definition: string }[];
  };
  // AI slop warning
  slopWarning: {
    text: string;
    dismiss: string;
  };
  // first time guide
  guide: {
    step0Title: string;
    step0Body: string;
    step1Title: string;
    step1Body: string;
    step2Title: string;
    step2Body: string;
    step3Title: string;
    step3Body: string;
    step4Title: string;
    step4Body: string;
    step5Title: string;
    step5Body: string;
    prev: string;
    next: string;
    skip: string;
    finish: string;
    of: string;
  };
}

const nl: Translations = {
  header: {
    title: 'Pensioenplanner',
    subtitle: 'Bereken uw verwacht pensioenkapitaal en inkomen',
    guidedTour: 'Rondleiding',
    about: 'Over',
  },
  nominal: 'Nominaal',
  real: 'Reëel',
  realToggle: 'Toon reële waarden (gecorrigeerd voor inflatie)',
  input: {
    title: 'Instellingen',
    collapse: 'Inklappen',
    expand: 'Uitklappen',
    salary: 'Bruto jaarsalaris',
    salaryHelp: 'Uw huidige bruto jaarsalaris vóór belasting.',
    age: 'Huidige leeftijd',
    ageHelp: 'Uw huidige leeftijd in jaren. De simulatie loopt tot AOW-leeftijd (68).',
    salaryGrowth: 'Jaarlijkse loonstijging',
    salaryGrowthHelp: 'Verwachte jaarlijkse loonstijging als percentage. Gemiddeld ca. 2%.',
    employerPct: 'Werkgeversbijdrage',
    employerPctHelp: 'Werkgeversbijdrage aan pensioen als percentage van de pensioengrondslag.',
    employeePct: 'Werknemersbijdrage',
    employeePctHelp: 'Uw eigen bijdrage aan pensioen als percentage van de pensioengrondslag. Dit is fiscaal aftrekbaar.',
    extraSavings: 'Extra sparen per maand (pijler 3)',
    extraSavingsHelp: 'Maandelijks bedrag dat u extra spaart buiten uw werkgeverspensioen om, bijv. via een bankspaarrekening of lijfrente.',
    franchise: 'Franchise (drempelinkomen)',
    franchiseHelp: 'De franchise is het deel van uw salaris waarover geen pensioen wordt opgebouwd. In 2026 is dit €19.172 (Centraal Aanspreekpunt Pensioenen, V&A 25-008).',
    franchiseGrowth: 'Franchisegroei per jaar',
    franchiseGrowthHelp: 'Verwachte jaarlijkse stijging van de franchise, doorgaans gekoppeld aan loonontwikkeling.',
    inflation: 'Inflatie per jaar',
    inflationHelp: 'Verwachte jaarlijkse inflatie voor het berekenen van reële (koopkrachtcorrected) waarden.',
    annuityRate: 'Rekenrente lijfrente',
    annuityRateHelp: 'De rente waarmee het pensioenkapitaal wordt omgerekend naar een maandelijkse uitkering. Wettelijk maximum is 3%; 1,5% is een voorzichtige standaard.',
    payoutYears: 'Uitkeringsperiode',
    payoutYearsHelp: 'Aantal jaar dat de pensioenuitkering doorloopt na AOW-leeftijd. 20 jaar (tot leeftijd 88) is een gangbare aanname voor lijfrenteberekeningen.',
    aow: 'Verwachte AOW per maand (bruto)',
    aowHelp: 'Uw verwachte bruto AOW-uitkering per maand bij pensionering. Raadpleeg mijnpensioenoverzicht.nl voor een schatting.',
    aowPartner: 'Leefsituatie bij pensioen',
    aowPartnerSingle: 'Alleenstaand',
    aowPartnerWith: 'Met partner',
    advanced: 'Geavanceerde instellingen',
    persist: 'Instellingen opslaan in browser',
    persistHelp: 'Sla uw instellingen op in de browser zodat ze bewaard blijven bij de volgende bezoek.',
    miniSummary: 'Samenvatting',
  },
  jaarruimte: {
    title: 'Jaarruimte (pijler 3)',
    maxSpace: 'Maximale fiscale ruimte (30%)',
    minus2nd: 'Min: Factor A reductie (pijler 2 premies)',
    available: 'Beschikbare jaarruimte',
    usage: 'Uw pijler 3 inleg',
    remaining: 'Resterende ruimte',
    exceeded: 'Overschrijding',
    disclaimer: 'Dit is een indicatieve berekening. Raadpleeg een financieel adviseur voor uw exacte jaarruimte.',
  },
  summary: {
    title: 'Scenario samenvatting bij pensioen',
    bad: 'Pessimistisch (2%)',
    normal: 'Normaal (5%)',
    good: 'Optimistisch (8%)',
    capital2nd: 'Kapitaal pijler 2',
    capital3rd: 'Kapitaal pijler 3',
    capitalTotal: 'Totaal kapitaal',
    deposits2nd: 'Inleg pijler 2',
    employerGross: 'Werkgeversbijdrage',
    employeeGross: 'Werknemersbijdrage',
    taxSaving: 'Belastingvoordeel',
    netCost: 'Netto eigen kosten',
    deposits3rd: 'Inleg pijler 3 (totaal)',
    monthlyPension: 'Geschatte maandelijkse annuïteit',
    disclaimer: 'Geschatte annuïteit o.b.v. 20 jaar uitkering met 1,5% rente. Geen garantie.',
    pillarsNote: 'Pijler 2 = werkgeverspensioen | Pijler 3 = eigen sparen',
  },
  income: {
    title: 'Inkomensvergelijking bij pensioen',
    referenceSalary: 'Huidig bruto salaris (referentie)',
    pension2nd: 'Pijler 2 pensioen (maandelijks)',
    pension3rd: 'Pijler 3 spaarpot (maandelijks)',
    accrued: 'Al opgebouwd (uit overzicht)',
    aowLabel: 'AOW',
    aowEstimate: 'Schatting',
    aowFromFile: 'Uit bestand',
    grossTotal: 'Totaal bruto pensioeninkomen',
    tax: 'Belasting bij pensioen',
    netPension: 'Netto pensioeninkomen',
    replacementRate: 'Vervangingspercentage',
    good: 'Goed (≥70%)',
    moderate: 'Matig (50–70%)',
    low: 'Laag (<50%)',
    targetNote: 'Streefwaarde: 70% van huidig netto inkomen (bron: Pensioenfederatie)',
  },
  tax: {
    title: 'Fiscaal voordeel analyse (jaar 1)',
    grossSalary: 'Bruto salaris',
    franchise: 'Franchise',
    pensionBase: 'Pensioengrondslag',
    employeeGross: 'Werknemersbijdrage (bruto)',
    taxSaving: 'Belastingbesparing',
    netCost: 'Netto eigen kosten',
    employer: 'Werkgeversbijdrage',
    totalFunded: 'Totaal gefinancierd',
    leverageRatio: 'Hefboomwerking',
    extraSavings: 'Extra sparen (pijler 3)',
    extraTaxBenefit: 'Fiscaal voordeel pijler 3',
    extraNetCost: 'Netto kosten extra sparen',
    realModeNote: 'Bedragen zijn nominaal in jaar 1; inflatie heeft hierop geen effect.',
  },
  chart: {
    title: 'Kapitaalopbouw over de tijd',
    bad: 'Pessimistisch',
    normal: 'Normaal',
    good: 'Optimistisch',
    capital: 'Kapitaal',
    year: 'Jaar',
    midpoint: 'Halverwege',
  },
  contrib: {
    title: 'Jaarbijdragen per jaar',
    employer: 'Werkgever',
    employeeGross: 'Werknemer (bruto)',
    taxSaving: 'Belastingvoordeel',
  },
  pensioenoverzicht: {
    title: 'Mijn Pensioenoverzicht importeren',
    uploadButton: 'JSON-bestand uploaden',
    localNote: 'Het bestand wordt alleen lokaal verwerkt en nooit verzonden.',
    successProviders: 'Uitvoerders',
    successTotal: 'Opgebouwd maandelijks',
    successAow: 'AOW schatting',
    clear: 'Verwijderen',
    error: 'Bestand kon niet worden gelezen. Controleer of het een geldig Pensioenoverzicht JSON-bestand is.',
  },
  infoBox: {
    readMore: 'Meer informatie',
    close: 'Sluiten',
  },
  infoBoxes: {
    pensionBase: {
      title: 'Wat is de pensioengrondslag?',
      content: 'De pensioengrondslag is het deel van uw salaris waarover daadwerkelijk pensioen wordt opgebouwd. De franchise wordt hiervan afgetrokken omdat de AOW dat deel al dekt.\n\n**Formule:** bruto salaris − franchise = pensioengrondslag\n\n• Franchise 2026: **€19.172** (Bron: Centraal Aanspreekpunt Pensioenen, V&A 25-008)\n• Voorbeeld: €60.000 salaris → **€40.828** pensioengrondslag\n• Over de franchise bouwt u géén pensioen op via pijler 2\n• Een hoger salaris vergroot de grondslag en dus uw pensioenopbouw',
    },
    taxLeverage: {
      title: 'Hoe werkt de fiscale hefboom?',
      content: 'Pensioenpremies gaan van uw salaris af vóór de belastingberekening. U betaalt dus geen inkomstenbelasting over het deel dat u naar pensioen gaat. Dit maakt pensioenpremies fiscaal aantrekkelijker dan gewoon sparen.\n\n**Hoe de hefboom werkt:**\n• Uw bijdrage is aftrekbaar → u betaalt minder belasting\n• Uw werkgever legt er bovenop bij (gratis geld)\n• Samen gaat er meer in de pot dan u netto betaalt\n\n**Voorbeeld bij 37,56% belastingtarief (schijf 2, 2026):**\n• Bruto werknemersbijdrage: €1.000\n• Belastingbesparing: **€376**\n• Netto kosten: €624\n• Werkgever legt ook bij → totaal kan €1.600+ zijn voor €624 netto',
    },
    taxBrackets: {
      title: 'Nederlandse belastingschijven 2026',
      content: 'Nederland heeft een progressief belastingstelsel: hoe meer u verdient, hoe hoger het tarief. Per 2026 zijn er **drie schijven** voor werkenden.\n\n**Werkende leeftijd (box 1, 2026):**\n• Tot €38.883 → **35,75%**\n• €38.883 – €78.426 → **37,56%**\n• Boven €78.426 → **49,50%**\n\n**Bij pensioen (AOW-leeftijd ≥68, 2026):**\n• Tot €38.883 → **17,85%** (geen AOW-premie meer)\n• €38.883 – €78.426 → **37,56%**\n• Boven €78.426 → **49,50%**\n\nHet lagere starttarief bij pensioen (17,85% vs. 35,75%) is een groot voordeel: over uw eerste €38.883 pensioeninkomen betaalt u bijna de helft minder belasting dan tijdens uw werkzame leven.',
    },
    scenarios: {
      title: 'Wat betekenen de scenario\'s?',
      content: 'De drie scenario\'s geven een bandbreedte van mogelijke uitkomsten. De werkelijkheid is onzeker — beleggingsrendementen schommelen jaar op jaar.\n\n• **Pessimistisch (2%)** — conservatief: laagrentende obligaties, spaarrekeningen. Realistisch bij aanhoudend lage rente.\n• **Normaal (5%)** — gemengde portefeuille (aandelen + obligaties). Historisch gemiddelde op lange termijn.\n• **Optimistisch (8%)** — aandelenzwaar, gunstige marktomstandigheden. Historisch haalbaar, maar niet gegarandeerd.\n\nHet verschil tussen 2% en 8% over 35 jaar is enorm: bij €1.000/jaar inleg groeit dit naar ca. €50k (2%) versus €186k (8%). Start vroeg en kies uw risiconiveau bewust.',
    },
    aowPillars: {
      title: 'De drie pensioenpijlers',
      content: 'Het Nederlandse pensioenstelsel is opgebouwd uit drie lagen (pijlers), die samen uw pensioeninkomen vormen.\n\n**Pijler 1 — AOW (staatspension):**\n• Voor iedereen die in Nederland woont of heeft gewerkt\n• Opbouw: 2% per jaar tussen 15–68 jaar (max 100% na 50 jaar)\n• Hoogte hangt af van woonduur en leefsituatie (alleen/partner)\n\n**Pijler 2 — Werkgeverspensioen:**\n• Via uw werkgever, vaak verplicht\n• Beschikbare-premieregeling (DC): bijdragen belegd, eindkapitaal onzeker\n• Dit is wat deze tool simuleert\n\n**Pijler 3 — Eigen pensioensparen:**\n• Lijfrente of bankspaarrekening\n• Fiscaal aftrekbaar binnen uw jaarruimte\n• Goed om gaten in pijler 2 op te vullen',
    },
    resultCapital: {
      title: 'Hoe wordt het pensioenkapitaal berekend?',
      content: 'Het eindkapitaal wordt berekend met de formule voor samengestelde interest (rente op rente):\n\n**Per jaar:** kapitaal × (1 + rendement) + bijdrage van dat jaar\n\n**Van kapitaal naar maandinkomen:**\n• Annuïteitsrente: **1,5%** (conservatief, zoals pensioenfondsen hanteren)\n• Uitkeringsduur: **20 jaar** (van pensioenleeftijd tot ~87)\n• Dit tarief is bewust lager dan de beleggingsrendementen (2/5/8%) — pensioenfondsen rekenen met gegarandeerde uitkeringsverplichtingen\n\n**Let op:** gebruik het normale scenario (5%) als leidraad. Het pessimistische geeft zekerheid, het optimistische toont potentieel. Opgebouwde rechten bij eerdere werkgevers zijn niet meegenomen tenzij u een bestand importeert.',
    },
    extraSavings: {
      title: 'Waarom extra sparen in pijler 3?',
      content: 'Als uw pijler 2 pensioen onvoldoende is, kunt u zelf aanvullen via fiscaal voordelige producten.\n\n**Geschikte producten:**\n• Lijfrenterekening (bank of verzekeraar)\n• Bankspaarrekening (geblokkeerd tot pensioen)\n\n**Fiscaal voordeel:**\n• Inleg is aftrekbaar van belastbaar inkomen → belastingbesparing nu\n• Uitkering bij pensioen wordt belast (maar vaak tegen lager tarief)\n• Netto voordeel afhankelijk van uw belastingschijf\n\n**Jaarruimte 2026 — formule:**\n• **30% × (min(salaris, €137.800) − franchise) − Factor A reductie**\n• Factor A reductie = voor DC-regelingen: totale pensioenpremies (werkgever + werknemer)\n• Voor DB-regelingen: 6,27 × de jaarlijkse pensioenaangroei (staat op uw pensioenoverzicht)\n• Niet benutte ruimte uit de laatste 10 jaar meenemen als reserveringsruimte\n• Uw exacte jaarruimte berekenen: mijnbelastingdienst.nl',
    },
    retirementCosts: {
      title: 'Hoe veranderen kosten bij pensioen?',
      content: 'Bij pensioen veranderen uw uitgaven sterk. Dat is waarom 70% van uw huidige netto inkomen voor de meeste mensen volstaat.\n\n**Kosten die vaak wegvallen:**\n• Hypotheek: doorgaans afbetaald\n• Pensioenpremies: u spaart niet meer voor pensioen\n• Reiskosten woon-werk\n• Studiekosten kinderen\n• Werkgerelateerde uitgaven (kleding, lunch)\n\n**Kosten die kunnen stijgen:**\n• Zorgkosten en eigen risico\n• Vrije tijd, reizen, hobby\'s\n• Thuiszorg op latere leeftijd\n\nDe **70%-norm** is een vuistregel, geen wet. Uw persoonlijke situatie (hypotheek afgelost, huurder, kinderen) bepaalt wat u werkelijk nodig heeft. Gebruik deze tool als startpunt voor een gesprek met een adviseur.',
    },
  },
  glossary: {
    title: 'Pensioenwoordenboek',
    subtitle: 'Uitleg van alle begrippen die in deze tool worden gebruikt',
    entries: [
      { term: 'AOW (Algemene Ouderdomswet)', definition: 'Het staatspension voor iedereen die in Nederland heeft gewoond of gewerkt.\n\n• Opbouw: **2% per jaar** tussen 15–68 jaar (max. 100% na 50 jaar)\n• Hoogte afhankelijk van leefsituatie (alleenstaand of met partner)\n• Alleenstaand ca. **€1.650/mnd** bruto; met partner ca. **€1.200/mnd** per persoon (2026)\n• Gefinancierd via het omslagstelsel: huidige werkenden betalen voor huidige gepensioneerden' },
      { term: 'Annuïteit', definition: 'Een vaste periodieke uitkering uit een opgespaarde pot kapitaal.\n\n• In deze tool: berekend met **1,5% rente** over **20 jaar** uitkering\n• Dit tarief is bewust conservatief — pensioenfondsen hanteren gegarandeerde verplichtingen\n• Hogere rente of kortere uitkeringsduur → hogere maandelijkse uitkering\n• Alternatief: bankspaaruitkering of beleggingsportefeuille afbouwen' },
      { term: 'Banksparen', definition: 'Een fiscaal voordelig spaarproduct voor pijler 3 pensioen via een bank (geblokkeerde rekening).\n\n• Inleg is aftrekbaar van belastbaar inkomen (binnen jaarruimte)\n• Uitkering bij pensioen wordt belast, doorgaans tegen lager tarief\n• Geblokkeerd tot uw pensioenleeftijd — tussentijds opnemen is niet mogelijk\n• Alternatief voor de klassieke lijfrente via een verzekeraar' },
      { term: 'Belastingschijven (box 1)', definition: 'Nederland hanteert een progressief tarief: meer verdienen = hoger percentage belasting. Vanaf 2026 zijn er **drie schijven** voor werkenden.\n\n**Werkende leeftijd (2026):**\n• Tot €38.883 → **35,75%**\n• €38.883 – €78.426 → **37,56%**\n• Boven €78.426 → **49,50%**\n\n**Bij pensioen (AOW-leeftijd ≥68, 2026):**\n• Tot €38.883 → **17,85%** (geen AOW-premie meer)\n• €38.883 – €78.426 → **37,56%**\n• Boven €78.426 → **49,50%**' },
      { term: 'Beschikbare-premieregeling (DC)', definition: 'Een pensioenregeling waarbij de premie vaststaat, maar het eindkapitaal afhangt van beleggingsrendement.\n\n• Risico ligt bij de deelnemer, niet bij het pensioenfonds\n• Meest voorkomende regeling bij nieuwere pensioencontracten\n• Tegenhanger: uitkeringsovereenkomst (DB), waarbij de uitkering vaststaat\n• Dit is het type regeling dat deze tool simuleert' },
      { term: 'Factor A', definition: 'De Factor A geeft de jaarlijkse pensioenaangroei weer en wordt gebruikt bij het berekenen van de jaarruimte voor pijler 3.\n\n**Hoe Factor A uw jaarruimte beïnvloedt:**\n• De jaarruimteformule vermindert uw aftrekruimte met een "reductie" voor reeds opgebouwde pensioenrechten\n• Zo voorkomt de Belastingdienst dubbele fiscale aftrek\n\n**Drie WTP-regimes:**\n• **Regime A3 (DC vlakke premie, meest voorkomend):** reductie = totale pensioenpremies (werkgever + werknemer)\n• **Regime A1 (uitkeringsovereenkomst/DB):** reductie = **6,27 × Factor A** (staat op uw UPO)\n• **Regime A2 (DC leeftijdsafhankelijk):** herleidingsberekening via Belastingdienst-tabel\n\nVoor de meeste moderne DC-regelingen (WTP Regime A3) zijn de totale premies de reductie — dit is wat deze tool berekent.' },
      { term: 'Fiscale hefboom', definition: 'Pensioenpremies worden afgetrokken vóór belastingberekening, waardoor u minder belasting betaalt.\n\n• Uw bijdrage is aftrekbaar → directe belastingbesparing\n• Werkgever legt er bovenop bij (dat is aanvullend loon)\n• Netto kosten zijn aanzienlijk lager dan de brutopremie\n• Voorbeeld: €1.000 bruto bijdrage bij 37,56% tarief (schijf 2, 2026) → netto slechts **€624**' },
      { term: 'Franchise (drempelinkomen)', definition: 'Het deel van uw salaris waarover **geen** pensioen wordt opgebouwd via pijler 2.\n\n• Franchise 2026: **€19.172** (bron: Centraal Aanspreekpunt Pensioenen, V&A 25-008)\n• De AOW wordt geacht dit deel van uw inkomen bij pensionering te dekken\n• Pensioengrondslag = bruto salaris − franchise\n• Voorbeeld: €60.000 salaris → pensioengrondslag = **€40.828**' },
      { term: 'Jaarruimte', definition: 'De fiscale ruimte om belastingvoordelig extra te sparen voor uw pensioen (pijler 3).\n\n• Formule: **30% × (min(salaris, €137.800) − franchise) − Factor A reductie**\n• Factor A reductie = voor DC-regelingen: totale pensioenpremies; voor DB: 6,27 × jaarlijkse aangroei\n• Niet benutte ruimte uit de afgelopen 10 jaar meenemen als reserveringsruimte\n• Maximum pensioengevend inkomen: **€137.800** (2026)\n• Exacte jaarruimte berekenen via mijnbelastingdienst.nl' },
      { term: 'Lijfrente', definition: 'Een fiscaal voordelig pensioenspaarproduct via een bank of verzekeraar (pijler 3).\n\n• Inleg aftrekbaar van belastbaar inkomen (binnen uw jaarruimte)\n• Uitkering bij pensioen wordt belast (doorgaans lager tarief dan nu)\n• Geblokkeerd tot pensioenleeftijd\n• Kies bewust tussen banksparen (transparant, lagere kosten) en verzekerd product (garantie)' },
      { term: 'Nominaal vs. reëel', definition: 'Twee manieren om geldbedragen in de toekomst uit te drukken.\n\n• **Nominaal**: bedragen in toekomstige euro\'s — de werkelijke geldwaarde\n• **Reëel**: gecorrigeerd voor inflatie — koopkracht uitgedrukt in huidige euro\'s\n• Voorbeeld: €100.000 over 30 jaar bij 2% inflatie → reële waarde **€55.000**\n• Gebruik de toggle rechtsboven om te schakelen tussen nominaal en reëel' },
      { term: 'Pensioengrondslag', definition: 'Het deel van uw salaris waarover wél pensioen wordt opgebouwd.\n\n• Formule: **bruto salaris − franchise**\n• Hogere grondslag = hogere pensioenopbouw\n• Zowel werkgevers- als werknemersbijdragen zijn gebaseerd op de grondslag\n• Voorbeeld: €60.000 − €19.172 = **€40.828** pensioengrondslag (franchise 2026)' },
      { term: 'Pijler 1 — AOW', definition: 'Het staatspension: de basis van elk Nederlands pensioen.\n\n• Recht voor iedereen die in Nederland heeft gewoond of gewerkt\n• Opbouw: 2% per jaar tussen 15–68 jaar (volledig na 50 jaar)\n• Gefinancierd via omslagstelsel (niet gespaard, maar betaald door huidige werkenden)\n• Kijk op mijnpensioenoverzicht.nl voor uw persoonlijke AOW-schatting' },
      { term: 'Pijler 2 — Werkgeverspensioen', definition: 'Collectief pensioen via uw werkgever — de grootste pensioenpijler voor de meeste werknemers.\n\n• Vaak verplicht via cao of pensioenfondsaansluiting\n• Premies van werkgever én werknemer worden belegd\n• Eindkapitaal afhankelijk van rendement (bij DC-regeling)\n• Dit is wat deze tool berekent en simuleert' },
      { term: 'Pijler 3 — Eigen pensioensparen', definition: 'Vrijwillig extra pensioensparen buiten werkgeversverband om.\n\n• Via lijfrenterekening of bankspaarrekening\n• Fiscaal aftrekbaar binnen uw jaarruimte\n• Goed voor het opvullen van gaten in pijler 2\n• Flexibeler dan pijler 2, maar volledige verantwoordelijkheid ligt bij uzelf' },
      { term: 'Rendement', definition: 'Het jaarlijkse beleggingsresultaat als percentage van het belegd kapitaal.\n\n• **Pessimistisch (2%)**: conservatief — laagrentende obligaties of spaarrekeningen\n• **Normaal (5%)**: gemengde portefeuille — historisch gemiddelde op lange termijn\n• **Optimistisch (8%)**: aandelenzwaar — gunstige marktomstandigheden\n• Door **rente-op-rente** heeft een klein renteverschil een enorm effect op lange termijn' },
      { term: 'Vervangingspercentage', definition: 'Uw netto pensioeninkomen uitgedrukt als percentage van uw huidige netto salaris.\n\n• Streefwaarde: **≥70%** (bron: Pensioenfederatie)\n• Lagere kosten bij pensioen (hypotheek afgelost, geen premies, geen reiskosten) maken 70% haalbaar\n• Goed ≥70% · Matig 50–70% · Laag <50%\n• Uw persoonlijke situatie (huurder, kinderen, levensstijl) bepaalt uw werkelijke behoefte' },
    ],
  },
  slopWarning: {
    text: 'Let op: deze tool geeft een indicatieve berekening en is geen financieel advies. Raadpleeg altijd een gecertificeerd financieel adviseur voor persoonlijke adviezen. Belastingregels kunnen wijzigen.',
    dismiss: 'Begrepen',
  },
  guide: {
    step0Title: 'Welkom bij de Pensioenplanner',
    step0Body: 'Deze tool helpt u inzicht te krijgen in uw toekomstige pensioen. We lopen samen de belangrijkste onderdelen door. Klik op "Volgende" om te beginnen.',
    step1Title: 'Stap 1: Uw gegevens invullen',
    step1Body: 'Vul links uw bruto jaarsalaris, leeftijd en de pensioenbijdragen in. Alle velden hebben standaardwaarden; pas ze aan naar uw situatie.',
    step2Title: 'Stap 2: Kapitaalopbouw',
    step2Body: 'De grafiek toont hoe uw pensioenkapitaal groeit over de jaren, voor drie scenario\'s: pessimistisch, normaal en optimistisch.',
    step3Title: 'Stap 3: Fiscaal voordeel',
    step3Body: 'Het fiscale voordeel paneel laat zien hoeveel belasting u bespaart door pensioenpremies af te trekken van uw belastbaar inkomen.',
    step4Title: 'Stap 4: Inkomensvergelijking',
    step4Body: 'De inkomensvergelijking toont uw verwachte pensioeninkomen ten opzichte van uw huidige salaris, inclusief het vervangingspercentage.',
    step5Title: 'Stap 5: Uw pensioenoverzicht',
    step5Body: 'U kunt uw Mijn Pensioenoverzicht JSON-bestand (van mijnpensioenoverzicht.nl) uploaden om uw reeds opgebouwde pensioen mee te nemen in de berekening.',
    prev: 'Vorige',
    next: 'Volgende',
    skip: 'Overslaan',
    finish: 'Klaar',
    of: 'van',
  },
};

const en: Translations = {
  header: {
    title: 'Pension Planner',
    subtitle: 'Calculate your expected pension capital and income',
    guidedTour: 'Guided Tour',
    about: 'About',
  },
  nominal: 'Nominal',
  real: 'Real',
  realToggle: 'Show real values (inflation-adjusted)',
  input: {
    title: 'Settings',
    collapse: 'Collapse',
    expand: 'Expand',
    salary: 'Gross annual salary',
    salaryHelp: 'Your current gross annual salary before tax.',
    age: 'Current age',
    ageHelp: 'Your current age in years. The simulation runs until the state pension age (68).',
    salaryGrowth: 'Annual salary growth',
    salaryGrowthHelp: 'Expected annual salary growth as a percentage. Approximately 2% on average.',
    employerPct: 'Employer contribution',
    employerPctHelp: 'Employer contribution to pension as a percentage of the pension base.',
    employeePct: 'Employee contribution',
    employeePctHelp: 'Your own pension contribution as a percentage of the pension base. This is tax-deductible.',
    extraSavings: 'Extra savings per month (pillar 3)',
    extraSavingsHelp: 'Monthly amount you save additionally outside your employer pension, e.g. via a savings account or annuity.',
    franchise: 'Franchise (threshold income)',
    franchiseHelp: 'The franchise is the part of your salary on which no pension is built up. In 2026 this is €19,172 (source: Centraal Aanspreekpunt Pensioenen, V&A 25-008).',
    franchiseGrowth: 'Franchise growth per year',
    franchiseGrowthHelp: 'Expected annual increase of the franchise, usually linked to wage development.',
    inflation: 'Inflation per year',
    inflationHelp: 'Expected annual inflation for calculating real (purchasing power adjusted) values.',
    annuityRate: 'Annuity rate',
    annuityRateHelp: 'The interest rate used to convert pension capital into a monthly annuity payment. Legal maximum is 3%; 1.5% is a conservative default.',
    payoutYears: 'Payout period',
    payoutYearsHelp: 'Number of years the pension annuity runs after AOW age. 20 years (until age 88) is a common assumption for annuity calculations.',
    aow: 'Expected state pension per month (gross)',
    aowHelp: 'Your expected gross state pension (AOW) per month at retirement. Check mijnpensioenoverzicht.nl for an estimate.',
    aowPartner: 'Living situation at retirement',
    aowPartnerSingle: 'Single',
    aowPartnerWith: 'With partner',
    advanced: 'Advanced settings',
    persist: 'Save settings in browser',
    persistHelp: 'Save your settings in the browser so they are retained on your next visit.',
    miniSummary: 'Summary',
  },
  jaarruimte: {
    title: 'Annual space (pillar 3)',
    maxSpace: 'Maximum fiscal space (30%)',
    minus2nd: 'Minus: Factor A deduction (pillar 2 premiums)',
    available: 'Available annual space',
    usage: 'Your pillar 3 contributions',
    remaining: 'Remaining space',
    exceeded: 'Exceeded',
    disclaimer: 'This is an indicative calculation. Consult a financial advisor for your exact annual space.',
  },
  summary: {
    title: 'Scenario summary at retirement',
    bad: 'Pessimistic (2%)',
    normal: 'Normal (5%)',
    good: 'Optimistic (8%)',
    capital2nd: 'Pillar 2 capital',
    capital3rd: 'Pillar 3 capital',
    capitalTotal: 'Total capital',
    deposits2nd: 'Pillar 2 contributions',
    employerGross: 'Employer contributions',
    employeeGross: 'Employee contributions',
    taxSaving: 'Tax benefit',
    netCost: 'Net own costs',
    deposits3rd: 'Pillar 3 contributions (total)',
    monthlyPension: 'Estimated monthly annuity',
    disclaimer: 'Estimated annuity based on 20-year payout at 1.5% interest. No guarantee.',
    pillarsNote: 'Pillar 2 = employer pension | Pillar 3 = personal savings',
  },
  income: {
    title: 'Income comparison at retirement',
    referenceSalary: 'Current gross salary (reference)',
    pension2nd: 'Pillar 2 pension (monthly)',
    pension3rd: 'Pillar 3 savings pot (monthly)',
    accrued: 'Already accrued (from overview)',
    aowLabel: 'State pension (AOW)',
    aowEstimate: 'Estimate',
    aowFromFile: 'From file',
    grossTotal: 'Total gross pension income',
    tax: 'Tax at retirement',
    netPension: 'Net pension income',
    replacementRate: 'Replacement rate',
    good: 'Good (≥70%)',
    moderate: 'Moderate (50–70%)',
    low: 'Low (<50%)',
    targetNote: 'Target: 70% of current net income (source: Pensioenfederatie)',
  },
  tax: {
    title: 'Tax benefit analysis (year 1)',
    grossSalary: 'Gross salary',
    franchise: 'Franchise',
    pensionBase: 'Pension base',
    employeeGross: 'Employee contribution (gross)',
    taxSaving: 'Tax saving',
    netCost: 'Net own cost',
    employer: 'Employer contribution',
    totalFunded: 'Total funded',
    leverageRatio: 'Leverage ratio',
    extraSavings: 'Extra savings (pillar 3)',
    extraTaxBenefit: 'Tax benefit pillar 3',
    extraNetCost: 'Net cost of extra savings',
    realModeNote: 'Amounts are nominal in year 1; inflation has no effect here.',
  },
  chart: {
    title: 'Capital accumulation over time',
    bad: 'Pessimistic',
    normal: 'Normal',
    good: 'Optimistic',
    capital: 'Capital',
    year: 'Year',
    midpoint: 'Halfway',
  },
  contrib: {
    title: 'Annual contributions per year',
    employer: 'Employer',
    employeeGross: 'Employee (gross)',
    taxSaving: 'Tax benefit',
  },
  pensioenoverzicht: {
    title: 'Import My Pension Overview',
    uploadButton: 'Upload JSON file',
    localNote: 'The file is processed locally only and never transmitted.',
    successProviders: 'Providers',
    successTotal: 'Accrued monthly',
    successAow: 'AOW estimate',
    clear: 'Remove',
    error: 'File could not be read. Check that it is a valid Pension Overview JSON file.',
  },
  infoBox: {
    readMore: 'More information',
    close: 'Close',
  },
  infoBoxes: {
    pensionBase: {
      title: 'What is the pension base?',
      content: 'The pension base is the portion of your salary on which pension is actually accumulated. The franchise is deducted because the state pension (AOW) already covers that part.\n\n**Formula:** gross salary − franchise = pension base\n\n• Franchise 2026: **€19,172** (Source: Centraal Aanspreekpunt Pensioenen, V&A 25-008)\n• Example: €60,000 salary → **€40,828** pension base\n• No pillar 2 pension is built up over the franchise amount\n• A higher salary increases the base and therefore your pension accrual',
    },
    taxLeverage: {
      title: 'How does the tax leverage work?',
      content: 'Pension premiums are deducted from your salary before tax is calculated. You pay no income tax on the portion going to pension. This makes pension contributions more tax-efficient than regular savings.\n\n**How the leverage works:**\n• Your contribution is deductible → you pay less tax\n• Your employer adds their share on top (free money)\n• Together, more goes into the pot than you pay net\n\n**Example at 37.56% tax rate (bracket 2, 2026):**\n• Gross employee contribution: €1,000\n• Tax saving: **€376**\n• Net cost to you: €624\n• Employer also contributes → total can be €1,600+ for €624 net',
    },
    taxBrackets: {
      title: 'Dutch tax brackets 2026',
      content: 'The Netherlands has a progressive tax system: the more you earn, the higher the rate. From 2026 there are **three brackets** for working-age taxpayers.\n\n**Working age (box 1, 2026):**\n• Up to €38,883 → **35.75%**\n• €38,883 – €78,426 → **37.56%**\n• Above €78,426 → **49.50%**\n\n**At retirement (AOW age ≥68, 2026):**\n• Up to €38,883 → **17.85%** (no AOW premium anymore)\n• €38,883 – €78,426 → **37.56%**\n• Above €78,426 → **49.50%**\n\nThe lower first-bracket rate at retirement (17.85% vs. 35.75%) is a major benefit: on your first €38,883 of pension income you pay nearly half the tax rate compared to during your working years.',
    },
    scenarios: {
      title: 'What do the scenarios mean?',
      content: 'The three scenarios give a range of possible outcomes. The future is uncertain — investment returns fluctuate year by year.\n\n• **Pessimistic (2%)** — conservative: low-yield bonds, savings accounts. Realistic in a sustained low-rate environment.\n• **Normal (5%)** — mixed portfolio (equities + bonds). Historical long-term average.\n• **Optimistic (8%)** — equity-heavy, favourable market conditions. Historically achievable, but not guaranteed.\n\nThe difference between 2% and 8% over 35 years is enormous: on €1,000/year contributions, this grows to ~€50k (2%) versus ~€186k (8%). Start early and choose your risk level consciously.',
    },
    aowPillars: {
      title: 'The three pension pillars',
      content: 'The Dutch pension system is built from three layers (pillars) that together form your retirement income.\n\n**Pillar 1 — AOW (state pension):**\n• For everyone who has lived or worked in the Netherlands\n• Accrual: 2% per year between ages 15–68 (max 100% after 50 years)\n• Amount depends on years of residence and living situation (single/partner)\n\n**Pillar 2 — Employer pension:**\n• Through your employer, often mandatory\n• Defined contribution (DC): contributions are invested, final capital is uncertain\n• This is what this tool simulates\n\n**Pillar 3 — Personal pension savings:**\n• Annuity or savings account (banksparen)\n• Tax-deductible within your annual space (jaarruimte)\n• Good for filling gaps in pillar 2 coverage',
    },
    resultCapital: {
      title: 'How is the pension capital calculated?',
      content: 'The final capital is calculated using compound interest (interest on interest):\n\n**Each year:** capital × (1 + return) + that year\'s contribution\n\n**Converting capital to monthly income:**\n• Annuity rate: **1.5%** (conservative, as pension funds use)\n• Payout period: **20 years** (from retirement age to ~87)\n• This rate is deliberately lower than the investment scenarios (2/5/8%) — pension funds price for guaranteed payout obligations\n\n**Note:** use the normal scenario (5%) as your baseline. The pessimistic scenario gives certainty; the optimistic scenario shows potential. Rights accrued at previous employers are not included unless you import a file.',
    },
    extraSavings: {
      title: 'Why save extra in pillar 3?',
      content: 'If your pillar 2 pension is insufficient, you can top it up yourself using tax-advantaged products.\n\n**Suitable products:**\n• Annuity account (bank or insurer)\n• Blocked savings account (banksparen — locked until retirement)\n\n**Tax advantage:**\n• Contributions are deductible from taxable income → tax saving now\n• Payout at retirement is taxed (but often at a lower rate)\n• Net benefit depends on your tax bracket\n\n**Annual space formula (2026):**\n• **30% × (min(salary, €137,800) − franchise) − Factor A deduction**\n• Factor A deduction = for DC schemes: total pension premiums (employer + employee)\n• For DB schemes: 6.27 × annual pension accrual (from your pension statement)\n• Unused space from the past 10 years can be carried forward (reserveringsruimte)\n• Find your exact space at mijnbelastingdienst.nl',
    },
    retirementCosts: {
      title: 'How do costs change at retirement?',
      content: 'At retirement, your expenses change significantly. That\'s why 70% of your current net income is enough for most people.\n\n**Costs that often disappear:**\n• Mortgage: typically paid off\n• Pension premiums: you\'re no longer saving for retirement\n• Commuting costs\n• Children\'s education costs\n• Work-related expenses (clothing, lunch)\n\n**Costs that may increase:**\n• Healthcare costs and deductibles\n• Leisure, travel, hobbies\n• Home care in later years\n\nThe **70% rule** is a guideline, not a law. Your personal situation (mortgage paid off, renter, children) determines what you actually need. Use this tool as a starting point for a conversation with an advisor.',
    },
  },
  glossary: {
    title: 'Pension Dictionary',
    subtitle: 'Explanation of all terms used in this tool',
    entries: [
      { term: 'AOW (State Pension)', definition: 'The Dutch state pension for everyone who has lived or worked in the Netherlands.\n\n• Accrual: **2% per year** between ages 15–68 (max. 100% after 50 years)\n• Amount depends on living situation (single or with partner)\n• Single approx. **€1,650/mo** gross; with partner approx. **€1,200/mo** per person (2026)\n• Funded pay-as-you-go: current workers pay for current retirees' },
      { term: 'Annuity', definition: 'A fixed periodic payment drawn from an accumulated capital pot.\n\n• In this tool: calculated at **1.5% interest** over **20 years**\n• This rate is deliberately conservative — pension funds guarantee their payments\n• Higher interest rate or shorter payout period → higher monthly payment\n• Alternative: drawing down from a savings or investment account' },
      { term: 'Annual space (jaarruimte)', definition: 'The tax-advantaged space to save extra for retirement (pillar 3).\n\n• Formula: **30% × (min(salary, €137,800) − franchise) − Factor A deduction**\n• Factor A deduction = for DC schemes: total pension premiums; for DB: 6.27 × annual accrual\n• Unused space from the past 10 years can be carried forward (reserveringsruimte)\n• Maximum pensionable income: **€137,800** (2026)\n• Find your exact space at mijnbelastingdienst.nl' },
      { term: 'Banksparen (locked savings account)', definition: 'A tax-advantaged savings product for pillar 3 via a bank (blocked account).\n\n• Contributions are deductible from taxable income (within annual space)\n• Payouts at retirement are taxed, usually at a lower rate\n• Locked until retirement age — early withdrawal is not possible\n• Alternative to the classic annuity (lijfrente) via an insurer' },
      { term: 'Defined contribution (DC)', definition: 'A pension scheme with fixed premiums but variable final capital depending on investment returns.\n\n• Risk lies with the participant, not the pension fund\n• Most common in modern pension contracts\n• Opposite: defined benefit (DB), where the payout is fixed\n• This is the type of scheme this tool simulates' },
      { term: 'Factor A', definition: 'Factor A represents the annual pension accrual and is used to calculate your annual space (jaarruimte) for pillar 3 savings.\n\n**How Factor A affects your annual space:**\n• The jaarruimte formula reduces your deductible space by an amount reflecting already-accrued pension rights\n• This prevents the tax authority from granting a double deduction\n\n**Three WTP regimes:**\n• **Regime A3 (DC flat premium — most common):** deduction = total pension premiums (employer + employee)\n• **Regime A1 (defined benefit/DB):** deduction = **6.27 × Factor A** (found on your UPO pension statement)\n• **Regime A2 (DC age-dependent):** recalculation using the tax authority\'s conversion table\n\nFor most modern DC schemes (WTP Regime A3), the total premiums serve as the deduction — this is what this tool calculates.' },
      { term: 'Franchise (threshold)', definition: 'The portion of your salary on which **no** pillar 2 pension is built up.\n\n• Franchise 2026: **€19,172** (source: Centraal Aanspreekpunt Pensioenen, V&A 25-008)\n• The state pension (AOW) is assumed to cover this portion of your income\n• Pension base = gross salary − franchise\n• Example: €60,000 salary → pension base = **€40,828**' },
      { term: 'Nominal vs. real', definition: 'Two ways of expressing future monetary amounts.\n\n• **Nominal**: future euros — the actual currency amount\n• **Real**: inflation-adjusted — purchasing power in today\'s euros\n• Example: €100,000 in 30 years at 2% inflation → real value **€55,000**\n• Use the toggle in the top right to switch between nominal and real views' },
      { term: 'Pension base (pensioengrondslag)', definition: 'The portion of your salary on which pension is actually accumulated.\n\n• Formula: **gross salary − franchise**\n• Higher base = higher pension accrual\n• Both employer and employee contributions are based on the pension base\n• Example: €60,000 − €19,172 = **€40,828** pension base (franchise 2026)' },
      { term: 'Pillar 1 — State pension (AOW)', definition: 'The state pension: the foundation of every Dutch retirement income.\n\n• Right for everyone who has lived or worked in the Netherlands\n• Accrual: 2% per year between ages 15–68 (full after 50 years)\n• Funded pay-as-you-go (not pre-funded, paid by current workers)\n• Check mijnpensioenoverzicht.nl for your personal AOW estimate' },
      { term: 'Pillar 2 — Employer pension', definition: 'Collective pension through your employer — the largest pillar for most employees.\n\n• Often mandatory via collective agreement or pension fund membership\n• Employer and employee premiums are invested together\n• Final capital depends on returns (in DC schemes)\n• This is what this tool calculates and simulates' },
      { term: 'Pillar 3 — Personal savings', definition: 'Voluntary additional pension savings outside of the employer scheme.\n\n• Via annuity account (lijfrente) or blocked savings account (banksparen)\n• Tax-deductible within your annual space (jaarruimte)\n• Good for filling gaps in pillar 2 coverage\n• More flexible than pillar 2, but full responsibility lies with you' },
      { term: 'Replacement rate', definition: 'Your net pension income expressed as a percentage of your current net salary.\n\n• Target: **≥70%** (source: Pensioenfederatie)\n• Lower costs at retirement (mortgage paid off, no premiums, no commuting) make 70% achievable\n• Good ≥70% · Moderate 50–70% · Low <50%\n• Your personal situation (renter, children, lifestyle) determines your actual need' },
      { term: 'Return (rendement)', definition: 'The annual investment result as a percentage of the invested capital.\n\n• **Pessimistic (2%)**: conservative — low-yield bonds or savings accounts\n• **Normal (5%)**: mixed portfolio — historical long-term average\n• **Optimistic (8%)**: equity-heavy — favourable market conditions\n• Due to **compound interest**, a small difference in return has a huge long-term effect' },
      { term: 'Tax brackets (Box 1)', definition: 'The Netherlands uses progressive taxation: earning more means a higher rate. From 2026 there are **three brackets** for working-age taxpayers.\n\n**Working age (2026):**\n• Up to €38,883 → **35.75%**\n• €38,883 – €78,426 → **37.56%**\n• Above €78,426 → **49.50%**\n\n**At retirement (AOW age ≥68, 2026):**\n• Up to €38,883 → **17.85%** (no AOW premium anymore)\n• €38,883 – €78,426 → **37.56%**\n• Above €78,426 → **49.50%**' },
      { term: 'Tax leverage', definition: 'Pension premiums are deducted before tax is calculated, so you pay less income tax.\n\n• Your contribution is deductible → immediate tax saving\n• Employer adds their share on top (additional compensation)\n• Net cost is significantly lower than the gross premium\n• Example: €1,000 gross contribution at 37.56% (bracket 2, 2026) → net cost only **€624**' },
    ],
  },
  slopWarning: {
    text: 'Note: this tool provides an indicative calculation and is not financial advice. Always consult a certified financial advisor for personal advice. Tax rules may change.',
    dismiss: 'Understood',
  },
  guide: {
    step0Title: 'Welcome to the Pension Planner',
    step0Body: 'This tool helps you understand your future pension. We will walk through the main components together. Click "Next" to begin.',
    step1Title: 'Step 1: Enter your details',
    step1Body: 'Enter your gross annual salary, age and pension contributions on the left. All fields have default values; adjust them to your situation.',
    step2Title: 'Step 2: Capital accumulation',
    step2Body: 'The chart shows how your pension capital grows over the years, for three scenarios: pessimistic, normal and optimistic.',
    step3Title: 'Step 3: Tax benefit',
    step3Body: 'The tax benefit panel shows how much tax you save by deducting pension premiums from your taxable income.',
    step4Title: 'Step 4: Income comparison',
    step4Body: 'The income comparison shows your expected pension income compared to your current salary, including the replacement rate.',
    step5Title: 'Step 5: Your pension overview',
    step5Body: 'You can upload your My Pension Overview JSON file (from mijnpensioenoverzicht.nl) to include your already accrued pension in the calculation.',
    prev: 'Previous',
    next: 'Next',
    skip: 'Skip',
    finish: 'Done',
    of: 'of',
  },
};

const translations: Record<Lang, Translations> = { nl, en };

export function getTranslations(lang: Lang): Translations {
  return translations[lang];
}
