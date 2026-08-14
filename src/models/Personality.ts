export interface Personality {
  teamPlayer: number;      // 0 - 100
  confidence: number;      // 0 - 100
  ambition: number;        // 0 - 100
  loyalty: number;         // 0 - 100
  ego: number;             // 0 - 100
  professionalism: number; // 0 - 100
}

export function createDefaultPersonality(): Personality {
  return {
    teamPlayer: 65,
    confidence: 60,
    ambition: 70,
    loyalty: 60,
    ego: 25,
    professionalism: 70
  };
}

export function getPersonalityArchetype(p: Personality): string {
  if (p.ego >= 75 && p.confidence >= 75) {
    return 'Confident Superstar';
  }
  if (p.professionalism >= 80 && p.teamPlayer >= 75) {
    return 'Uncompromising Professional';
  }
  if (p.loyalty >= 80 && p.teamPlayer >= 70) {
    return 'Loyal Club Icon';
  }
  if (p.ambition >= 75 && p.teamPlayer >= 65) {
    return 'Ambitious Team Player';
  }
  if (p.ego >= 70 && p.ambition >= 70) {
    return 'Maverick Talent';
  }
  if (p.teamPlayer >= 70 && p.ego < 40) {
    return 'Humble Squad Player';
  }
  if (p.confidence >= 70 && p.ambition >= 70) {
    return 'Fearless Competitor';
  }
  return 'Rising Prodigy';
}
