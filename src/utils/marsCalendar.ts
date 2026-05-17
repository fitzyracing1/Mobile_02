const SOL_MS = 88775244;

export function getRoverSol(landingDateMs: number, todayMs: number): number {
  return Math.floor((todayMs - landingDateMs) / SOL_MS);
}

function getSolarLongitude(today: Date): number {
  const LS0_REF = new Date('2025-04-18T00:00:00Z').getTime();
  const MARS_YEAR_MS = 686.97 * 24 * 60 * 60 * 1000;
  const elapsed = today.getTime() - LS0_REF;
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

export function getDaysUntilOpposition(today: Date): number {
  const OPPOSITION = new Date('2027-02-19T00:00:00Z').getTime();
  const diffMs = OPPOSITION - today.getTime();
  return Math.ceil(diffMs / (24 * 60 * 60 * 1000));
}
