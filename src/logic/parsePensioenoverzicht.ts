import { PensioenoverzichtData, PensioenoverzichtProvider } from '../types'

// Minimal types matching the mijnpensioenoverzicht.nl JSON export format
interface PensionEntry {
  TeBereiken?: number
  Opgebouwd?: number
  PensioenUitvoerder?: string
}

interface AowDetailsOpbouw {
  TeBereikenSamenwonend?: number
  OpgebouwdSamenwonend?: number
  TeBereikenAlleenstaand?: number
  OpgebouwdAlleenstaand?: number
}

interface OuderdomsPensioenPeriod {
  Van?: { Leeftijd?: { Jaren?: number }; OuderdomsPensioenEvent?: string }
  Tot?: { Leeftijd?: { Jaren?: number }; OuderdomsPensioenEvent?: string }
  IndicatiefPensioen?: PensionEntry[]
  Pensioen?: PensionEntry[]
  AOW?: { AOWDetailsOpbouw?: AowDetailsOpbouw }
}

interface PensioenoverzichtJson {
  StatusCode?: string
  TijdstipAanmakenBericht?: string
  Details?: {
    OuderdomsPensioenDetails?: {
      OuderdomsPensioen?: OuderdomsPensioenPeriod[]
    }
  }
}

/**
 * Parse a mijnpensioenoverzicht.nl JSON export and extract the key data needed
 * for integrating already-accrued pension into the simulation.
 *
 * Returns null if the file does not appear to be a valid pensioenoverzicht export.
 */
export function parsePensioenoverzicht(raw: unknown): PensioenoverzichtData | null {
  if (!raw || typeof raw !== 'object') return null

  const json = raw as PensioenoverzichtJson

  if (json.StatusCode !== '000') return null

  const periods = json.Details?.OuderdomsPensioenDetails?.OuderdomsPensioen
  if (!Array.isArray(periods) || periods.length === 0) return null

  // Find the "steady state" period: Tot.OuderdomsPensioenEvent === "Overlijden"
  // This is the lifelong period starting at ~68 and is the most complete snapshot.
  const steadyPeriod = periods.find(p => p.Tot?.OuderdomsPensioenEvent === 'Overlijden')
    ?? periods[periods.length - 1]  // fallback: last period

  const providerMap = new Map<string, PensioenoverzichtProvider>()

  // Process DC (indicatief) pension entries
  for (const entry of steadyPeriod.IndicatiefPensioen ?? []) {
    const name = entry.PensioenUitvoerder ?? 'Onbekend'
    const opgebouwd = entry.Opgebouwd ?? 0
    const teBereiken = entry.TeBereiken ?? 0

    if (providerMap.has(name)) {
      const existing = providerMap.get(name)!
      existing.opgebouwdAnnual += opgebouwd
      existing.teBereikenAnnual += teBereiken
    } else {
      providerMap.set(name, { name, opgebouwdAnnual: opgebouwd, teBereikenAnnual: teBereiken, isIndicatief: true })
    }
  }

  // Process DB (hard) pension entries — merge by provider name if already seen
  for (const entry of steadyPeriod.Pensioen ?? []) {
    const name = entry.PensioenUitvoerder ?? 'Onbekend'
    const opgebouwd = entry.Opgebouwd ?? 0
    const teBereiken = entry.TeBereiken ?? 0

    if (providerMap.has(name)) {
      const existing = providerMap.get(name)!
      existing.opgebouwdAnnual += opgebouwd
      existing.teBereikenAnnual += teBereiken
    } else {
      providerMap.set(name, { name, opgebouwdAnnual: opgebouwd, teBereikenAnnual: teBereiken, isIndicatief: false })
    }
  }

  const providers = Array.from(providerMap.values()).filter(p => p.opgebouwdAnnual > 0 || p.teBereikenAnnual > 0)
  const alreadyAccruedAnnual = providers.reduce((sum, p) => sum + p.opgebouwdAnnual, 0)

  // AOW data: look for it in any period that has it (usually the 68+ periods)
  let aowTeBereikenAlleenstaand: number | null = null
  let aowTeBereikenSamenwonend: number | null = null

  for (const period of periods) {
    const aow = period.AOW?.AOWDetailsOpbouw
    if (aow?.TeBereikenAlleenstaand) {
      aowTeBereikenAlleenstaand = aow.TeBereikenAlleenstaand
      aowTeBereikenSamenwonend = aow.TeBereikenSamenwonend ?? null
      break
    }
  }

  const standPer = json.TijdstipAanmakenBericht
    ? new Date(json.TijdstipAanmakenBericht).toLocaleDateString('nl-NL')
    : ''

  return {
    providers,
    alreadyAccruedAnnual,
    aowTeBereikenAlleenstaand,
    aowTeBereikenSamenwonend,
    standPer,
  }
}
