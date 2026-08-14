export interface Club {
  id: string;
  name: string;
  country: string;
  leagueId: string;
  reputation: number; // 1-100
  stadiumCapacity: number;
  colors: {
    primary: string;
    secondary: string;
  };
  isAcademyOnly: boolean;
}

export interface League {
  id: string;
  name: string;
  country: string;
  tier: number;
}

export const LEAGUES: League[] = [
  { id: 'eng1', name: 'Premier League', country: 'England', tier: 1 },
  { id: 'eng2', name: 'Championship', country: 'England', tier: 2 },
  { id: 'spa1', name: 'La Liga', country: 'Spain', tier: 1 },
  { id: 'ger1', name: 'Bundesliga', country: 'Germany', tier: 1 },
  { id: 'ita1', name: 'Serie A', country: 'Italy', tier: 1 },
  { id: 'fra1', name: 'Ligue 1', country: 'France', tier: 1 }
];

export const CLUBS: Club[] = [
  {
    id: 'ars',
    name: 'Arsenal',
    country: 'England',
    leagueId: 'eng1',
    reputation: 85,
    stadiumCapacity: 60704,
    colors: { primary: '#EF0107', secondary: '#FFFFFF' },
    isAcademyOnly: false
  },
  {
    id: 'ars_acad',
    name: 'Arsenal Academy',
    country: 'England',
    leagueId: 'eng_u21',
    reputation: 40,
    stadiumCapacity: 5000,
    colors: { primary: '#EF0107', secondary: '#FFFFFF' },
    isAcademyOnly: true
  },
  {
    id: 'rma',
    name: 'Real Madrid',
    country: 'Spain',
    leagueId: 'spa1',
    reputation: 95,
    stadiumCapacity: 81044,
    colors: { primary: '#FFFFFF', secondary: '#FEBE10' },
    isAcademyOnly: false
  },
  {
    id: 'dor',
    name: 'Borussia Dortmund',
    country: 'Germany',
    leagueId: 'ger1',
    reputation: 82,
    stadiumCapacity: 81365,
    colors: { primary: '#FDE100', secondary: '#000000' },
    isAcademyOnly: false
  }
];
