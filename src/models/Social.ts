export enum SocialActorType {
  FAN = 'FAN',
  PLAYER = 'PLAYER',
  JOURNALIST = 'JOURNALIST',
  CLUB = 'CLUB',
  PUNTER = 'PUNTER'
}

export interface SocialPost {
  id: string;
  actorType: SocialActorType;
  actorHandle: string;
  actorName: string;
  content: string;
  likes: number;
  retweets: number;
  hashtags: string[];
  timestamp: Date;
}

export interface InterviewOption {
  text: string;
  tone: 'HUMBLE' | 'CONFIDENT' | 'LOYAL' | 'AMBITIOUS' | 'CONTROVERSIAL';
  personalityImpact: Partial<{
    teamPlayer: number;
    confidence: number;
    ambition: number;
    loyalty: number;
    ego: number;
    professionalism: number;
  }>;
  relationshipImpact: {
    managerTrust?: number;
    fanApproval?: number;
    mediaAttention?: number;
  };
}

export interface InterviewQuestion {
  id: string;
  reporterName: string;
  outlet: string;
  text: string;
  options: InterviewOption[];
}
