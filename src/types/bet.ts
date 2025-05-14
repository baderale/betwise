export type BetType = 'player_prop' | 'team_prop' | 'parlay';

export interface PlayerProp {
  playerName: string;
  statType: 'points' | 'rebounds' | 'assists' | 'pra' | 'threes';
  target: number;
  operator: 'over' | 'under';
}

export interface TeamProp {
  teamName: string;
  type: 'total' | 'spread' | 'moneyline';
  target?: number;
  operator?: 'over' | 'under';
}

export interface Bet {
  type: BetType;
  details: PlayerProp | TeamProp;
  confidence: number;
}

export interface BetSlip {
  id: string;
  imageUrl: string;
  ocrResults: {
    text: string;
    confidence: number;
    verified: boolean;
  };
  bets: Bet[];
  timestamp: number;
} 