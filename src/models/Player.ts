import { Personality, createDefaultPersonality } from './Personality';

export type Position = 'GK' | 'CB' | 'LB' | 'RB' | 'CDM' | 'CM' | 'CAM' | 'LW' | 'RW' | 'ST';

export interface Attributes {
  // Technical
  finishing: number;
  passing: number;
  dribbling: number;
  ballControl: number;
  tackling: number;
  crossing: number;
  
  // Physical
  pace: number;
  acceleration: number;
  strength: number;
  stamina: number;
  agility: number;
  
  // Mental
  positioning: number;
  vision: number;
  composure: number;
  decisions: number;
}

export interface PlayerAppearance {
  seed: string;
  skinTone: number;
  hairStyle: string;
  hairColor: string;
  height: number; // in cm
  weight: number; // in kg
  eyeColor: string;
}

export interface ScoutInterest {
  clubId: string;
  clubName: string;
  interestPercent: number; // 0 to 100
}

export interface Player {
  id: string;
  name: string;
  age: number;
  nationality: string;
  position: Position;
  preferredFoot: 'Left' | 'Right' | 'Both';
  overall: number;
  potential: number;
  attributes: Attributes;
  appearance: PlayerAppearance;
  clubId: string | null;
  clubName?: string;
  reputation: number; // 0 to 100
  marketValue: number; // in Euros
  personality: Personality;
  managerTrust: number; // 0 to 100
  scoutInterests: ScoutInterest[];
}

export class PlayerGenerator {
  static generateAppearance(seed: string): PlayerAppearance {
    const hash = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    return {
      seed,
      skinTone: (hash % 10),
      hairStyle: `style_${(hash % 20)}`,
      hairColor: ['black', 'brown', 'blonde', 'red'][(hash % 4)],
      height: 170 + (hash % 30),
      weight: 65 + (hash % 25),
      eyeColor: ['brown', 'blue', 'green', 'hazel'][(hash % 4)]
    };
  }

  static createNewPlayer(name: string, position: Position, nationality: string, clubName: string = 'Arsenal'): Player {
    const seed = Math.random().toString(36).substring(7);
    const appearance = this.generateAppearance(seed);
    
    const baseAttr = 40 + Math.floor(Math.random() * 20);
    
    return {
      id: `plr-${Math.random().toString(36).substring(2, 9)}`,
      name,
      age: 16,
      nationality,
      position,
      preferredFoot: Math.random() > 0.8 ? 'Left' : 'Right',
      overall: baseAttr,
      potential: baseAttr + 20 + Math.floor(Math.random() * 20),
      appearance,
      clubId: 'ars',
      clubName,
      reputation: 15,
      marketValue: 500000,
      personality: createDefaultPersonality(),
      managerTrust: 50,
      scoutInterests: [
        { clubId: 'dor', clubName: 'Borussia Dortmund', interestPercent: 40 }
      ],
      attributes: {
        finishing: baseAttr,
        passing: baseAttr,
        dribbling: baseAttr,
        ballControl: baseAttr,
        tackling: baseAttr,
        crossing: baseAttr,
        pace: baseAttr,
        acceleration: baseAttr,
        strength: baseAttr,
        stamina: baseAttr,
        agility: baseAttr,
        positioning: baseAttr,
        vision: baseAttr,
        composure: baseAttr,
        decisions: baseAttr
      }
    };
  }
}
