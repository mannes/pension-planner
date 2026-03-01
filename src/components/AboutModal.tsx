import { useEffect } from "react";
import { useTranslation } from "../context/LanguageContext";

interface Props {
  onClose: () => void;
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-8">
      <h2 className="text-base font-bold text-gray-900 mb-3 pb-1 border-b border-gray-200">
        {title}
      </h2>
      <div className="space-y-2 text-sm text-gray-700 leading-relaxed">
        {children}
      </div>
    </div>
  );
}

function Term({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <span className="font-semibold text-gray-800 w-44 flex-shrink-0">
        {term}
      </span>
      <span className="flex-1">{children}</span>
    </div>
  );
}

function NlContent() {
  return (
    <>
      <Section title="Over deze tool">
        <p>
          De meeste mensen weten niet hoeveel pensioen ze opbouwen, wat het ze
          kost, of wat ze er later mee kunnen verwachten. Die informatie{" "}
          <em>is</em> er — op je loonstrook, in je arbeidscontract, op
          mijnpensioenoverzicht.nl — maar ze is verspreid en moeilijk te
          doorgronden.
        </p>
        <p>
          Deze tool maakt de mechanismen zichtbaar. Speel met de schuifregelaars
          en zie direct:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            Wat legt je werkgever eigenlijk in, en wat kost het jou netto na
            belasting?
          </li>
          <li>
            Hoeveel maakt een hogere of lagere bijdrage uit over 30 jaar dankzij{" "}
            <em>samengestelde interest</em>?
          </li>
          <li>
            Is er ruimte om extra te sparen via een 3e pijler product, en
            hoeveel belastingvoordeel levert dat op?
          </li>
          <li>Wat is je pensioen echt waard na inflatie?</li>
        </ul>
        <p className="text-gray-500 italic mt-2">
          Het doel is inzicht, niet precisie. Deze tool rekent alleen vooruit op
          basis van je huidige situatie. Al opgebouwde rechten uit eerdere jaren
          zijn niet inbegrepen. Raadpleeg{" "}
          <a
            href="https://www.mijnpensioenoverzicht.nl"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            mijnpensioenoverzicht.nl
          </a>{" "}
          voor een prognose op basis van je werkelijke fonds.
        </p>
      </Section>

      <Section title="De drie pensioenpijlers">
        <Term term="1e pijler — AOW">
          De basisvoorziening van de overheid. Iedereen die in Nederland heeft
          gewoond of gewerkt bouwt AOW op. De hoogte hangt af van het aantal
          jaren dat je in Nederland verzekerd bent geweest (opbouw: 2% per jaar,
          max. 50 jaar = 100%). In 2024 is de volledige AOW voor alleenstaanden
          ca. €1.400/mnd bruto.
        </Term>
        <Term term="2e pijler — Werkgeverspensioen">
          Via je werkgever, vaak verplicht in de CAO. Zowel werkgever als
          werknemer leggen een percentage van de pensioengrondslag in. Deze tool
          modelleert een <em>beschikbare premieregeling</em> (DC): er wordt een
          vast bedrag ingelegd en het eindresultaat hangt af van het
          beleggingsrendement.
        </Term>
        <Term term="3e pijler — Eigen spaarpot">
          Vrijwillig, via een lijfrente- of bankspaarproduct. Fiscaal aftrekbaar
          tot aan de jaarruimte. Een goede aanvulling als je pensioenregeling
          minder genereus is, of als je extra zekerheid wilt.
        </Term>
      </Section>

      <Section title="Belangrijke begrippen">
        <Term term="AOW-franchise">
          Het deel van je salaris dat niet meetelt voor pensioenopbouw, omdat de
          AOW dit basisinkomen al dekt. In 2024: ca. €17.545. Alleen het deel{" "}
          <em>boven</em> de franchise (de pensioengrondslag) wordt gebruikt voor
          de berekening van premies.
        </Term>
        <Term term="Pensioengrondslag">
          Brutosalaris minus de AOW-franchise. Dit is de grondslag waarover jij
          en je werkgever premie betalen. Bij een salaris van €60.000 en
          franchise €17.545 is de grondslag €42.455.
        </Term>
        <Term term="Jaarruimte">
          Het maximale bedrag dat je fiscaal voordelig mag inleggen in een 3e
          pijler product. De jaarruimte is ca. 30% van je pensioengrondslag,
          verminderd met wat er al via je werkgever wordt ingelegd. Alles binnen
          de jaarruimte is aftrekbaar van je belastbaar inkomen.
        </Term>
        <Term term="Beschikbare premieregeling (DC)">
          Een pensioenvorm waarbij een vast premiebedrag wordt ingelegd. Het
          uiteindelijke pensioenkapitaal hangt af van het beleggingsrendement —
          onzeker, vandaar de drie scenario's (2%, 5%, 8%). Staat in contrast
          met een <em>uitkeringsovereenkomst</em> (DB), waarbij een vast
          pensioen wordt beloofd ongeacht rendement.
        </Term>
        <Term term="Rekenrente (1,5%)">
          De rente waarmee een opgebouwd kapitaal wordt omgezet naar een
          maandelijks pensioen via een annuïteit. Dit is een conservatief tarief
          dat pensioenfondsen hanteren voor garantieverplichtheden — los van het
          beleggingsrendement. Met 1,5% over 20 jaar levert €100.000 kapitaal
          ca. €480/mnd op.
        </Term>
        <Term term="Nominaal vs. reëel">
          <strong>Nominaal</strong>: toekomstige eurobedragen zoals ze zijn —
          €1.000 over 30 jaar is bij 2% inflatie in koopkracht nog maar €550
          waard. <strong>Reëel</strong>: gecorrigeerd voor inflatie, alles in
          euro's van vandaag. Over een lange horizon maakt dit een enorm
          verschil — zet de schakelaar rechtsboven om beide perspectieven te
          vergelijken.
        </Term>
        <Term term="Marginaal belastingtarief">
          Het belastingtarief dat geldt over je <em>laatste</em> verdiende euro.
          In 2024 zijn er twee schijven: 36,97% t/m €75.518 en 49,50% daarboven.
          Je pensioenpremie wordt van je bruto salaris afgetrokken vóór
          belastingberekening — waardoor je belasting bespaart tegen je
          marginale tarief.
        </Term>
      </Section>

      <Section title="Welke knoppen kun jij draaien?">
        <Term term="Werkgeversbijdrage">
          Staat in je arbeidscontract of CAO. Je kunt er in de meeste gevallen
          niet individueel over onderhandelen, maar het loont wél om te weten
          wat je werkgever bijdraagt — en dit mee te nemen bij het vergelijken
          van jobaanbiedingen.
        </Term>
        <Term term="Eigen bijdrage">
          Staat ook in je arbeidscontract. Soms is er keuzevrijheid (opt-out of
          hoger percentage). Door vroeger en meer in te leggen profiteert je pot
          langer van compounding.
        </Term>
        <Term term="Extra spaarbedrag (3e pijler)">
          Volledig in eigen hand. Lijfrente- of bankspaarproducten zijn
          beschikbaar bij de meeste banken en verzekeraars. Inleg is aftrekbaar
          tot de jaarruimte — de tool berekent die ruimte live op basis van je
          schuifregelaars.
        </Term>
        <Term term="Looptijd (leeftijd)">
          Hoe eerder je begint, hoe groter het effect van samengestelde
          interest. Stel je leeftijd in en zie hoe een start op 28 vs. 38 na 30
          jaar een kapitaalverschil van factor 2 of meer kan opleveren.
        </Term>
      </Section>

      <Section title="Wat deze tool NIET doet">
        <ul className="list-disc pl-5 space-y-1 text-gray-600">
          <li>
            Al opgebouwde pensioenaanspraken uit voorgaande dienstjaren worden
            niet meegenomen
          </li>
          <li>
            Uitkeringsovereenkomsten (DB-regelingen) worden niet gemodelleerd —
            alleen beschikbare premie (DC)
          </li>
          <li>
            Beleggingsrisico en volgorde-van-rendementen effect worden niet
            getoond
          </li>
          <li>Partnerpensioen of nabestaandenpensioen wordt niet berekend</li>
          <li>
            Belastingregels veranderen jaarlijks — deze tool gebruikt
            2024/2025-tarieven
          </li>
        </ul>
      </Section>

      <Section title="Privacy">
        <p>
          Deze tool draait volledig in je browser. Er is geen server, geen
          database en geen analysedienst gekoppeld. De cijfers die je invult
          worden nergens naartoe verstuurd en worden niet opgeslagen buiten je
          eigen apparaat. Alleen je taalvoorkeur en of je de introductie al
          hebt gezien worden lokaal bewaard via localStorage.
        </p>
        <p className="text-gray-500 italic">
          Wees desondanks altijd kritisch bij het invullen van persoonlijke of
          financiële gegevens op websites — ook als een tool claimt niets te
          bewaren. Je hebt geen exacte bedragen nodig: afgeronde of geschatte
          cijfers geven al zinvolle inzichten.
        </p>
      </Section>
    </>
  );
}

function EnContent() {
  return (
    <>
      <Section title="About this tool">
        <p>
          Most people have no idea how their pension actually builds up, what it
          costs them, or what they can realistically expect at retirement. That
          information <em>is</em> available — on your payslip, in your
          employment contract, at mijnpensioenoverzicht.nl — but it's scattered
          and hard to reason about intuitively.
        </p>
        <p>
          This tool makes the mechanics visible. Adjust the sliders and
          immediately see:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            What does your employer actually contribute, and what does it cost
            you net after tax?
          </li>
          <li>
            How much does a higher or lower contribution rate matter over 30
            years due to <em>compound interest</em>?
          </li>
          <li>
            Is there room to save extra via a 3rd-pillar product, and how much
            tax benefit does that generate?
          </li>
          <li>What is your pension actually worth after inflation?</li>
        </ul>
        <p className="text-gray-500 italic mt-2">
          The goal is awareness, not precision. This tool only projects forward
          from your current situation. Pension rights already accrued from past
          years of service are not included. Use{" "}
          <a
            href="https://www.mijnpensioenoverzicht.nl"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            mijnpensioenoverzicht.nl
          </a>{" "}
          for a projection based on your actual fund.
        </p>
      </Section>

      <Section title="The three pension pillars">
        <Term term="1st pillar — AOW">
          The state basic pension. Everyone who has lived or worked in the
          Netherlands accrues AOW rights (2% per year, max. 50 years = 100%). In
          2024 the full single-person AOW is approximately €1,400/month gross.
        </Term>
        <Term term="2nd pillar — Employer pension">
          Via your employer, usually mandatory under collective agreements
          (CAO). Both employer and employee contribute a percentage of the
          pension base. This tool models a <em>defined contribution</em> (DC /
          beschikbare premie) scheme: a fixed amount is contributed and the
          final pot depends on investment returns.
        </Term>
        <Term term="3rd pillar — Personal savings">
          Voluntary, via a personal annuity (lijfrente) or bank savings product
          (banksparen). Tax- deductible up to the annual allowance (jaarruimte).
          A good supplement if your employer scheme is less generous, or if you
          want extra security.
        </Term>
      </Section>

      <Section title="Key concepts">
        <Term term="AOW threshold (franchise)">
          The part of your salary excluded from pension accrual, because AOW
          already covers this basic income. In 2024: approx. €17,545. Only the
          part <em>above</em> the threshold — the pension base — is used to
          calculate contributions.
        </Term>
        <Term term="Pension base (pensioengrondslag)">
          Gross salary minus the AOW threshold. This is the base on which you
          and your employer pay contributions. With a €60,000 salary and
          threshold of €17,545, the pension base is €42,455.
        </Term>
        <Term term="Annual allowance (jaarruimte)">
          The maximum amount you can contribute to a 3rd-pillar product with
          full tax deductibility. Approximately 30% of your pension base,
          reduced by what is already contributed through your employer scheme.
          Everything within the allowance is deductible from taxable income.
        </Term>
        <Term term="Defined contribution (DC)">
          A pension scheme where a fixed premium is paid in. The final pension
          capital depends on investment returns — uncertain, hence the three
          scenarios (2%, 5%, 8%). Contrasts with a<em> defined benefit</em> (DB)
          scheme, which promises a fixed payout regardless of returns.
        </Term>
        <Term term="Annuity rate (rekenrente, 1.5%)">
          The rate used to convert accumulated capital into a monthly pension
          via an annuity formula. This is a conservative rate that pension funds
          use for guaranteed payout obligations — separate from the investment
          return. At 1.5% over 20 years, €100,000 capital yields approximately
          €480/month.
        </Term>
        <Term term="Nominal vs. real">
          <strong>Nominal</strong>: future euro amounts as-is — €1,000 in 30
          years is worth only ~€550 in today's purchasing power at 2% inflation.{" "}
          <strong>Real</strong>: adjusted for inflation, everything in today's
          euros. Over a long horizon this makes an enormous difference — use the
          toggle in the top-right to compare both perspectives.
        </Term>
        <Term term="Marginal tax rate">
          The tax rate on your <em>last</em> euro earned. In 2024 there are two
          brackets: 36.97% up to €75,518, and 49.50% above. Your pension
          contribution is deducted from gross salary before tax is calculated —
          so you save tax at your marginal rate.
        </Term>
      </Section>

      <Section title="What levers can you pull?">
        <Term term="Employer contribution">
          Set in your employment contract or CAO. You usually can't negotiate
          this individually, but it's worth knowing — and factoring in when
          comparing job offers.
        </Term>
        <Term term="Employee contribution">
          Also in your contract. Sometimes there's flexibility (opt-out or
          higher percentage). The earlier and more you contribute, the longer
          compounding works in your favour.
        </Term>
        <Term term="Extra savings (3rd pillar)">
          Entirely up to you. Annuity and bank savings products are available at
          most banks and insurers. Contributions are deductible up to the
          jaarruimte — the tool calculates your available space live as you
          adjust the sliders.
        </Term>
        <Term term="Duration (your age)">
          The earlier you start, the greater the compounding effect. Set your
          age and see how starting at 28 vs. 38 can result in a capital
          difference of 2× or more after 30 years.
        </Term>
      </Section>

      <Section title="What this tool does NOT do">
        <ul className="list-disc pl-5 space-y-1 text-gray-600">
          <li>
            Pension rights already accrued from past years of service are not
            included
          </li>
          <li>
            Defined benefit (DB) schemes are not modelled — only defined
            contribution (DC)
          </li>
          <li>Investment risk and sequence-of-returns effects are not shown</li>
          <li>Partner pension or survivor's pension is not calculated</li>
          <li>Tax rules change annually — this tool uses 2024/2025 rates</li>
        </ul>
      </Section>

      <Section title="Privacy">
        <p>
          This tool runs entirely in your browser. There is no server, no
          database, and no analytics service attached. The numbers you enter
          are never sent anywhere and are not stored outside your own device.
          Only your language preference and whether you've seen the intro are
          saved locally via localStorage.
        </p>
        <p className="text-gray-500 italic">
          That said, always be critical about entering personal or financial
          data on websites — even when a tool claims to store nothing. You
          don't need exact figures: rounded or estimated numbers are enough to
          get meaningful insight.
        </p>
      </Section>
    </>
  );
}

export function AboutModal({ onClose }: Props) {
  const { lang } = useTranslation();

  // Close on Escape
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const title =
    lang === "nl" ? "Over de Pensioenplanner" : "About the Pension Planner";

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="min-h-full flex items-start justify-center p-4 py-8">
        <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-white rounded-t-2xl z-10">
            <h1 className="text-lg font-bold text-gray-900">{title}</h1>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl leading-none p-1"
              aria-label="Sluiten"
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-6">
            {lang === "nl" ? <NlContent /> : <EnContent />}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-100 text-xs text-gray-400 rounded-b-2xl">
            {lang === "nl"
              ? "Gebaseerd op Nederlandse belastingregels en pensioenwetgeving 2024/2025. Educatief hulpmiddel — geen financieel advies."
              : "Based on Dutch tax rules and pension legislation 2024/2025. Educational tool — not financial advice."}
          </div>
        </div>
      </div>
    </div>
  );
}
