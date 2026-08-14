import { Player } from '../models/Player';

export interface MatchEvent {
  minute: number;
  type: 'GOAL' | 'CARD' | 'SUB' | 'CHANCE' | 'INVOLVEMENT';
  description: string;
  isPlayerInvolved: boolean;
}

export interface MatchResult {
  homeScore: number;
  awayScore: number;
  events: MatchEvent[];
  playerRating: number;
  minutesPlayed: number;
}

export class MatchEngine {
  static simulateMatch(
    homeTeamName: string,
    awayTeamName: string,
    player: Player,
    isPlayerStarting: boolean,
    startMinute: number = 0
  ): MatchResult {
    let homeScore = 0;
    let awayScore = 0;
    const events: MatchEvent[] = [];
    let playerRating = 6.0;
    let minutesPlayed = 0;

    for (let minute = 1; minute <= 95; minute++) {
      const isPlayerOnPitch = isPlayerStarting ? minute >= startMinute : minute >= 60; // Simple sub logic
      
      if (isPlayerOnPitch) minutesPlayed++;

      // Random event generation
      const rng = Math.random();
      
      if (rng < 0.02) { // Scoring chance
        const scoringTeam = Math.random() > 0.5 ? 'home' : 'away';
        const isGoal = Math.random() > 0.7;
        
        if (isGoal) {
          if (scoringTeam === 'home') homeScore++;
          else awayScore++;
          
          events.push({
            minute,
            type: 'GOAL',
            description: `GOAL! ${scoringTeam === 'home' ? homeTeamName : awayTeamName} scores!`,
            isPlayerInvolved: isPlayerOnPitch && Math.random() > 0.8
          });
        }
      }

      // Trigger Player Involvement
      if (isPlayerOnPitch && Math.random() < 0.05) {
        events.push({
          minute,
          type: 'INVOLVEMENT',
          description: `Key moment: ${player.name} has the ball in a dangerous position.`,
          isPlayerInvolved: true
        });
        
        // Performance impact (simulated for now)
        const performance = Math.random();
        if (performance > 0.7) playerRating += 0.2;
        if (performance < 0.3) playerRating -= 0.1;
      }
    }

    return {
      homeScore,
      awayScore,
      events,
      playerRating: Math.min(10, Math.max(0, playerRating)),
      minutesPlayed
    };
  }
}
