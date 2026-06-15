export interface MatchPrediction {
  id: string;
  homeTeam: string;
  homeCode: string;
  homeLogo?: string;
  awayTeam: string;
  awayCode: string;
  awayLogo?: string;
  matchTime: string;
  matchDateIso?: string;
  matchTimeTS?: number;
  groupStr: string;
  status: string;
  homeScoreReal?: number | null;
  awayScoreReal?: number | null;
  winner?: 'home' | 'away' | 'draw' | null;

  predictedHomeScore: number;
  predictedAwayScore: number;
  homeProbability: number;
  awayProbability: number;
  confidence: number;
  analysis: string;
  affiliateUrl: string;
  bookmaker: string;
}

export interface GroupStanding {
  groupId: string;
  groupName: string;
  entries: StandingEntry[];
}

export interface StandingEntry {
  teamId: string;
  teamName: string;
  teamCode: string;
  teamLogo?: string;
  gamesPlayed: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  rank: number;
}
