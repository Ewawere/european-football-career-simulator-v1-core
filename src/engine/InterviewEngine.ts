import { Player } from '../models/Player';
import { InterviewQuestion, InterviewOption } from '../models/Social';
import { PersonalityEngine } from './PersonalityEngine';

export class InterviewEngine {
  /**
   * Generates a post-match interview based on player performance and event significance
   */
  static generateInterview(player: Player, isTrophyWin: boolean = false): InterviewQuestion {
    if (isTrophyWin) {
      return {
        id: `interview-${Date.now()}`,
        reporterName: 'Geoff Shreeves',
        outlet: 'Sky Sports',
        text: `How does it feel to score the winner and win your first major trophy tonight, ${player.name}?`,
        options: [
          {
            text: "The team made it possible. I'm just happy to contribute.",
            tone: 'HUMBLE',
            personalityImpact: { teamPlayer: 4, professionalism: 2, ego: -2 },
            relationshipImpact: { managerTrust: 4, fanApproval: 3, mediaAttention: 1 }
          },
          {
            text: "I knew I was going to score. This is what big players do.",
            tone: 'CONFIDENT',
            personalityImpact: { confidence: 5, ego: 4, ambition: 2 },
            relationshipImpact: { managerTrust: 1, fanApproval: 4, mediaAttention: 5 }
          },
          {
            text: "I’m just happy to do this for Arsenal and our incredible fans.",
            tone: 'LOYAL',
            personalityImpact: { loyalty: 5, teamPlayer: 2 },
            relationshipImpact: { managerTrust: 3, fanApproval: 6, mediaAttention: 2 }
          },
          {
            text: "This is just the beginning. I want to win everything.",
            tone: 'AMBITIOUS',
            personalityImpact: { ambition: 5, confidence: 3, ego: 2 },
            relationshipImpact: { managerTrust: 3, fanApproval: 4, mediaAttention: 4 }
          }
        ]
      };
    }

    return {
      id: `interview-${Date.now()}`,
      reporterName: 'David Ornstein',
      outlet: 'The Athletic',
      text: `Strong performance out there today. What is your focus for the rest of the season?`,
      options: [
        {
          text: "Just keeping my head down, working hard in training every single day.",
          tone: 'HUMBLE',
          personalityImpact: { professionalism: 4, teamPlayer: 2 },
          relationshipImpact: { managerTrust: 3, fanApproval: 2 }
        },
        {
          text: "I want to be the main man and lead this team to silverware.",
          tone: 'AMBITIOUS',
          personalityImpact: { ambition: 4, confidence: 3, ego: 2 },
          relationshipImpact: { managerTrust: 1, fanApproval: 3, mediaAttention: 3 }
        }
      ]
    };
  }

  /**
   * Applies the chosen interview option to player's personality and club relationships
   */
  static applyInterviewChoice(player: Player, option: InterviewOption): { feedback: string } {
    PersonalityEngine.applyPersonalityShift(player, option.personalityImpact);

    const trustDelta = option.relationshipImpact.managerTrust ?? 0;
    player.managerTrust = Math.max(0, Math.min(100, player.managerTrust + trustDelta));

    return {
      feedback: `Response noted. Personality updated. Manager Trust changed by ${trustDelta > 0 ? '+' : ''}${trustDelta}.`
    };
  }
}
