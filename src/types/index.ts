
// Centralized type definitions
export interface TransactionData {
  id: string;
  bankroll_id: string;
  event_name: string;
  event_date: string;
  competition: string;
  strategy_name: string;
  market: string;
  stake: number;
  odds: number;
  result: 'pending' | 'win' | 'loss' | 'void';
  profit: number;
  description: string;
  tags: string[];
  sport: string;
  created_at: string;
  created_date: string;
}

export interface BankrollData {
  id: string;
  name: string;
  initial_balance: number;
  current_balance: number;
  start_date: string;
  is_active: boolean;
  commission_percentage: number;
  currency: string;
}

export interface StrategyData {
  id: number;
  name: string;
  description?: string;
  market: string;
  unit_stake: number;
  min_odds?: number;
  max_odds?: number;
  start_date?: string;
  end_date?: string;
  leagues?: string[];
  home_teams?: string[];
  away_teams?: string[];
  results?: any;
  season?: string | string[];
}

export interface GameDataType {
  id?: string;
  home: string;
  away: string;
  date: string;
  league: string;
  season?: number;
  goals_h_ft?: number;
  goals_a_ft?: number;
  rodada?: number;
  [key: string]: any;
}
