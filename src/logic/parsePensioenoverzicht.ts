export interface PensioenoverzichtData {
  providers: string[];
  totalAccruedMonthly: number; // gross annual / 12
  aowAlleenstaand: number;
  aowSamenwonend: number | null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parsePensioenoverzicht(json: any): PensioenoverzichtData | null {
  try {
    if (json?.StatusCode !== '000') return null;

    const details = json?.Details;
    const opDetails = details?.OuderdomsPensioenDetails?.OuderdomsPensioen;
    if (!Array.isArray(opDetails)) return null;

    // Find steady-state period (Tot.OuderdomsPensioenEvent === 'Overlijden')
    const steadyState = opDetails.find(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (p: any) => p?.Tot?.OuderdomsPensioenEvent === 'Overlijden'
    );
    if (!steadyState) return null;

    const indicatief: unknown[] = steadyState?.IndicatiefPensioen ?? [];
    const hard: unknown[] = steadyState?.Pensioen ?? [];

    // Sum ALL Opgebouwd entries — no dedup on amount (same provider can have multiple contracts)
    // Dedup only the display provider list
    const seenProviders = new Set<string>();
    let totalAnnual = 0;
    const providers: string[] = [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const entry of [...indicatief, ...hard] as any[]) {
      const opgebouwd = Number(entry?.Opgebouwd ?? 0);
      if (!isNaN(opgebouwd) && opgebouwd > 0) {
        totalAnnual += opgebouwd;
        const provider: string = entry?.PensioenUitvoerder ?? '';
        if (provider && !seenProviders.has(provider)) {
          seenProviders.add(provider);
          providers.push(provider);
        }
      }
    }

    // AOW lives in the steady-state period entry, not at the top-level Details
    const aowDetails = steadyState?.AOW?.AOWDetailsOpbouw;
    const aowAlleenstaand =
      Number(aowDetails?.TeBereikenAlleenstaand ?? 0) / 12;
    const aowSamenwonend = aowDetails?.TeBereikenSamenwonend != null
      ? Number(aowDetails.TeBereikenSamenwonend) / 12
      : null;

    return {
      providers,
      totalAccruedMonthly: totalAnnual / 12,
      aowAlleenstaand,
      aowSamenwonend,
    };
  } catch {
    return null;
  }
}
