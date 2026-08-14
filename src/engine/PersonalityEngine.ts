import { Player } from '../models/Player';
import { Personality, getPersonalityArchetype } from '../models/Personality';
import { InterviewOption } from '../models/Social';

export interface ManagerStyle {
  name: string;
  preferredTrait: keyof Personality;
  dislikedTrait: keyof Personality;
  strictness: number; // 1 to 5
}

export class PersonalityEngine {
  /**
   * Applies personality impacts from interview choices or events
   */
  static applyPersonalityShift(
    player: Player,
    impact: Partial<Personality>
  ): void {
    for (const [trait, delta] of Object.entries(impact)) {
      const key = trait as keyof Personality;
      if (typeof delta === 'number' && key in player.personality) {
        player.personality[key] = Math.max(0, Math.min(100, player.personality[key] + delta));
      }
    }
  }

  /**
   * Updates manager trust based on player's choice and manager's tactical/cultural philosophy
   */
  static evaluateManagerReaction(
    player: Player,
    option: InterviewOption,
    managerStyle?: ManagerStyle
  ): { managerTrustDelta: number; feedback: string } {
    let trustDelta = option.relationshipImpact.managerTrust ?? 0;
    let feedback = '';

    // If manager has specific style preferences
    if (managerStyle) {
      if (option.personalityImpact[managerStyle.dislikedTrait] && (option.personalityImpact[managerStyle.dislikedTrait]! > 0)) {
        trustDelta -= 2;
        feedback = `${managerStyle.name} disliked the emphasis on ${managerStyle.dislikedTrait}.`;
      }
      if (option.personalityImpact[managerStyle.preferredTrait] && (option.personalityImpact[managerStyle.preferredTrait]! > 0)) {
        trustDelta += 2;
        feedback = `${managerStyle.name} appreciated your ${managerStyle.preferredTrait}.`;
      }
    }

    player.managerTrust = Math.max(0, Math.min(100, player.managerTrust + trustDelta));

    return { managerTrustDelta: trustDelta, feedback };
  }

  /**
   * Returns player's current personality archetype description
   */
  static getArchetype(player: Player): string {
    return getPersonalityArchetype(player.personality);
  }
}
