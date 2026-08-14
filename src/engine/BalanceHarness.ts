import { Player, PlayerGenerator, Position } from '../models/Player';
import { MatchEngine } from '../engine/MatchEngine';
import { CLUBS } from '../data/FootballDatabase';

export type PlayerArchetype = 'AVERAGE' | 'HIGH_POTENTIAL' | 'LOW_POTENTIAL' | 'ELITE' | 'INJURY_PRONE' | 'LATE_BLOOMER';

export interface CareerMetrics {
  archetype: PlayerArchetype;
  startAge: number;
  endAge: number;
  debutAge: number | null;
  breakthroughAge: number | null;
  peakOvr: number;
  finalOvr: number;
  potentialRealizedPercent: number;
  appearances: number;
  goals: number;
  assists: number;
  transfersCount: number;
  maxMarketValue: number;
  injuryCount: number;
  totalDaysInjured: number;
  finalManagerTrust: number;
  avgMatchRating: number;
  retirementAge: number;
  trophyCount: number;
  reached80Plus: boolean;
  reached85Plus: boolean;
  reached90Plus: boolean;
  isWorldClass: boolean;
  failedToEstablish: boolean;
}

export interface SimulationSummary {
  totalCareersRun: number;
  archetypeBreakdown: Record<PlayerArchetype, number>;
  avgPeakOvr: number;
  avgRetirementAge: number;
  avgGoals: number;
  avgAppearances: number;
  pctReached80: number;
  pctReached85: number;
  pctReached90: number;
  pctFailed: number;
  avgTransfers: number;
  avgInjuries: number;
  detectedAnomalies: string[];
}

export class BalanceHarness {
  /**
   * Generates a player tailored to a specific archetype for balance simulation
   */
  static generateArchetypePlayer(archetype: PlayerArchetype): Player {
    const player = PlayerGenerator.createNewPlayer('Simulation Player', Position.ST, 'England', 'Arsenal');
    
    switch (archetype) {
      case 'AVERAGE':
        player.overall = 45;
        player.potential = 68;
        break;
      case 'HIGH_POTENTIAL':
        player.overall = 52;
        player.potential = 84;
        break;
      case 'LOW_POTENTIAL':
        player.overall = 42;
        player.potential = 60;
        break;
      case 'ELITE':
        player.overall = 60;
        player.potential = 94;
        break;
      case 'INJURY_PRONE':
        player.overall = 48;
        player.potential = 80;
        break;
      case 'LATE_BLOOMER':
        player.overall = 40;
        player.potential = 82;
        break;
    }

    return player;
  }

  /**
   * Simulates a single career from age 16 to retirement or max age 36
   */
  static simulateCareer(archetype: PlayerArchetype, seedMultiplier: number = 1): CareerMetrics {
    let player = BalanceHarness.generateArchetypePlayer(archetype);
    const startAge = 16;
    let currentAge = startAge;
    const retirementAge = archetype === 'LATE_BLOOMER' ? 35 : (32 + Math.floor(Math.random() * 5));

    let debutAge: number | null = null;
    let breakthroughAge: number | null = null;
    let peakOvr = player.overall;
    let appearances = 0;
    let goals = 0;
    let assists = 0;
    let transfersCount = 0;
    let maxMarketValue = player.marketValue;
    let injuryCount = 0;
    let totalDaysInjured = 0;
    let trophyCount = 0;
    let totalRatingsSum = 0;
    let ratingCount = 0;

    const club = CLUBS[0];

    while (currentAge < retirementAge) {
      // Simulate matches per season (approx 35-50 matches depending on age & squad status)
      const matchesPerSeason = currentAge === 16 ? 15 : (currentAge <= 19 ? 28 : 45);

      for (let m = 0; m < matchesPerSeason; m++) {
        // Debut logic
        if (debutAge === null && (currentAge >= 17 || (currentAge === 16 && player.overall >= 50))) {
          debutAge = currentAge;
        }

        // Injury check
        const injuryChance = archetype === 'INJURY_PRONE' ? 0.08 : 0.02;
        if (Math.random() < injuryChance) {
          injuryCount++;
          const duration = Math.floor(Math.random() * 45) + 5; // 5 to 50 days
          totalDaysInjured += duration;
        }

        // Match simulation using frozen MatchEngine
        const matchResult = MatchEngine.simulateMatch(
          club.name,
          'Opponent FC',
          player,
          debutAge !== null && currentAge >= 18,
          60
        );

        appearances++;
        const matchGoals = matchResult.playerRating >= 8.0 && Math.random() < 0.3 ? 1 : 0;
        const matchAssists = matchResult.playerRating >= 7.5 && Math.random() < 0.25 ? 1 : 0;
        goals += matchGoals;
        assists += matchAssists;

        totalRatingsSum += matchResult.playerRating;
        ratingCount++;

        // Development progression
        const growthRate = archetype === 'LATE_BLOOMER' && currentAge >= 23 ? 1.8 : (player.overall < player.potential ? 0.4 : 0.05);
        if (Math.random() < 0.15 && player.overall < player.potential) {
          player.overall = Math.min(99, player.overall + (Math.random() < growthRate ? 1 : 0));
        }

        if (player.overall > peakOvr) {
          peakOvr = player.overall;
        }

        // Breakthrough logic
        if (breakthroughAge === null && player.overall >= 75) {
          breakthroughAge = currentAge;
        }

        // Market value update
        player.marketValue = Math.floor(player.overall * player.overall * 15000);
        if (player.marketValue > maxMarketValue) {
          maxMarketValue = player.marketValue;
        }

        // Transfer check for elite/high performers
        if (currentAge >= 21 && player.overall >= 80 && Math.random() < 0.03) {
          transfersCount++;
          trophyCount += Math.random() < 0.2 ? 1 : 0;
        }
      }

      currentAge++;
      player.age = currentAge;
    }

    const finalOvr = player.overall;
    const potentialSpan = player.potential - 40; // baseline 40
    const realizedSpan = finalOvr - 40;
    const potentialRealizedPercent = potentialSpan > 0 ? Math.min(100, Math.max(0, (realizedSpan / potentialSpan) * 100)) : 50;

    const avgMatchRating = ratingCount > 0 ? totalRatingsSum / ratingCount : 6.0;
    const isWorldClass = finalOvr >= 88;
    const failedToEstablish = finalOvr < 65 && appearances < 50;

    return {
      archetype,
      startAge,
      endAge: currentAge,
      debutAge,
      breakthroughAge,
      peakOvr,
      finalOvr,
      potentialRealizedPercent,
      appearances,
      goals,
      assists,
      transfersCount,
      maxMarketValue,
      injuryCount,
      totalDaysInjured,
      finalManagerTrust: player.managerTrust,
      avgMatchRating,
      retirementAge: currentAge,
      trophyCount,
      reached80Plus: peakOvr >= 80,
      reached85Plus: peakOvr >= 85,
      reached90Plus: peakOvr >= 90,
      isWorldClass,
      failedToEstablish
    };
  }

  /**
   * Runs batch simulations across multiple archetypes and aggregates metrics
   */
  static runBatchSimulations(countPerArchetype: number = 50): { metrics: CareerMetrics[]; summary: SimulationSummary } {
    const archetypes: PlayerArchetype[] = ['AVERAGE', 'HIGH_POTENTIAL', 'LOW_POTENTIAL', 'ELITE', 'INJURY_PRONE', 'LATE_BLOOMER'];
    const metrics: CareerMetrics[] = [];
    const archetypeBreakdown: Record<PlayerArchetype, number> = {
      AVERAGE: 0,
      HIGH_POTENTIAL: 0,
      LOW_POTENTIAL: 0,
      ELITE: 0,
      INJURY_PRONE: 0,
      LATE_BLOOMER: 0
    };

    for (const arch of archetypes) {
      for (let i = 0; i < countPerArchetype; i++) {
        const result = BalanceHarness.simulateCareer(arch, i + 1);
        metrics.push(result);
        archetypeBreakdown[arch]++;
      }
    }

    const totalCareersRun = metrics.length;
    const avgPeakOvr = metrics.reduce((acc, m) => acc + m.peakOvr, 0) / totalCareersRun;
    const avgRetirementAge = metrics.reduce((acc, m) => acc + m.retirementAge, 0) / totalCareersRun;
    const avgGoals = metrics.reduce((acc, m) => acc + m.goals, 0) / totalCareersRun;
    const avgAppearances = metrics.reduce((acc, m) => acc + m.appearances, 0) / totalCareersRun;
    const pctReached80 = (metrics.filter(m => m.reached80Plus).length / totalCareersRun) * 100;
    const pctReached85 = (metrics.filter(m => m.reached85Plus).length / totalCareersRun) * 100;
    const pctReached90 = (metrics.filter(m => m.reached90Plus).length / totalCareersRun) * 100;
    const pctFailed = (metrics.filter(m => m.failedToEstablish).length / totalCareersRun) * 100;
    const avgTransfers = metrics.reduce((acc, m) => acc + m.transfersCount, 0) / totalCareersRun;
    const avgInjuries = metrics.reduce((acc, m) => acc + m.injuryCount, 0) / totalCareersRun;

    const detectedAnomalies: string[] = [];
    if (pctReached90 > 25) {
      detectedAnomalies.push('High percentage of players reaching 90+ OVR (>25%). Growth curve may be too generous.');
    }
    if (avgInjuries > 15) {
      detectedAnomalies.push('Injury frequency appears elevated across standard archetypes.');
    }
    if (pctFailed < 5) {
      detectedAnomalies.push('Failure rate is unusually low (<5%). Low potential prospects should struggle more.');
    }

    const summary: SimulationSummary = {
      totalCareersRun,
      archetypeBreakdown,
      avgPeakOvr,
      avgRetirementAge,
      avgGoals,
      avgAppearances,
      pctReached80,
      pctReached85,
      pctReached90,
      pctFailed,
      avgTransfers,
      avgInjuries,
      detectedAnomalies
    };

    return { metrics, summary };
  }
}
