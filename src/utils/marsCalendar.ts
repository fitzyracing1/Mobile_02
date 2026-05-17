/**
 * Mars calendar utilities for the "Live on Mars" section.
 *
 * Sol duration: 88775244 ms (24h 37m 22.663s — one Martian solar day)
 *
 * Martian season is derived from solar longitude (Ls):
 *   - Reference: Ls = 0° (northern vernal equinox) occurred ~April 18, 2025
 *   - Mars tropical year ≈ 686.97 Earth days
 */

const SOL_MS = 88775244; // milliseconds per Martian sol

/** How many sols have elapsed since a rover landed / was deployed. */
export function getRoverSol(landingDateMs: number, todayMs: number): number {
  return Math.floor((todayMs - landingDateMs) / SOL_MS);
}

/** Approximate solar longitude (Ls, 0–360°) for a given Earth date. */
function getSolarLongitude(today: Date): number {
  // Reference: Ls = 0 on ~April 18, 2025
  const LS0_REF = new Date('2025-04-18T00:00:00Z').getTime();
  const MARS_YEAR_MS = 686.97 * 24 * 60 * 60 * 1000; // ms per Mars year

  const elapsed = today.getTime() - LS0_REF;
  // Normalise to [0, 1) fraction of Mars year
  const fraction = ((elapsed % MARS_YEAR_MS) + MARS_YEAR_MS) % MARS_YEAR_MS / MARS_YEAR_MS;
  return fraction * 360;
}

export interface MartianSeason {
  season: string;
  ls: number;
  description: string;
}

export function getMartianSeason(today: Date): MartianSeason {
  const ls = getSolarLongitude(today);
  const lsRounded = Math.round(ls);

  let season: string;
  let description: string;

  if (ls < 90) {
    season = 'Northern Spring / Southern Autumn';
    description = 'CO₂ southern polar cap sublimating; dust activity increasing near the equator.';
  } else if (ls < 180) {
    season = 'Northern Summer / Southern Winter';
    description = 'Mars is near aphelion; northern hemisphere is mild and relatively dust-free.';
  } else if (ls < 270) {
    season = 'Northern Autumn / Southern Spring';
    description = 'Perihelion approach triggers global dust storm season in the south.';
  } else {
    season = 'Northern Winter / Southern Summer';
    description = 'Mars near perihelion; southern dust storms can grow planet-wide.';
  }

  return { season, ls: lsRounded, description };
}

/** Days until the next Mars opposition on Feb 19, 2027. */
export function getDaysUntilOpposition(today: Date): number {
  const OPPOSITION = new Date('2027-02-19T00:00:00Z').getTime();
  const diffMs = OPPOSITION - today.getTime();
  return Math.ceil(diffMs / (24 * 60 * 60 * 1000));
}
