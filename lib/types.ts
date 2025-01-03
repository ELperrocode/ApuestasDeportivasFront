export interface League {
  idLeague: string;
  strLeague: string;
}

export interface Match {
  idEvent: string;
  strEvent: string;
  strHomeTeam: string;
  strAwayTeam: string;
  strLeague: string;
  dateEvent: string;
  strTime: string;
  strHomeTeamBadge: string;
  strAwayTeamBadge: string;
  strThumb: string;
  homeOdds: string;
  drawOdds: string;
  awayOdds: string;
}

export interface Bet {
  id: number;
  userId: number;
  type: string;
  amount: number;
  odds: number;
  selection: string;
  matchId: string;
  potential: number;
  status: 'pending' | 'win' | 'lost';
  date: string;
}

export interface User {
  id: number;
  username: string;
  wallet: number;
}