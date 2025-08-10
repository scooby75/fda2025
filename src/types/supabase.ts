
export interface Database {
  public: {
    Tables: {
      strategy: {
        Row: {
          id: number;
          name: string;
          description?: string;
          market?: string;
          unit_stake?: number;
          min_odds?: number;
          max_odds?: number;
          start_date?: string;
          end_date?: string;
          leagues?: string[];
          home_teams?: string[];
          away_teams?: string[];
          results?: any;
          owner_id?: string;
          created_at?: string;
        };
        Insert: {
          name: string;
          description?: string;
          market?: string;
          unit_stake?: number;
          min_odds?: number;
          max_odds?: number;
          start_date?: string;
          end_date?: string;
          leagues?: string[];
          home_teams?: string[];
          away_teams?: string[];
          results?: any;
          owner_id?: string;
        };
        Update: {
          name?: string;
          description?: string;
          market?: string;
          unit_stake?: number;
          min_odds?: number;
          max_odds?: number;
          start_date?: string;
          end_date?: string;
          leagues?: string[];
          home_teams?: string[];
          away_teams?: string[];
          results?: any;
        };
      };
      bankroll: {
        Row: {
          id: number;
          name: string;
          initial_balance: number;
          current_balance: number;
          start_date: string;
          is_active: boolean;
          commission_percentage: number;
          currency: string;
        };
        Insert: {
          name: string;
          initial_balance: number;
          current_balance: number;
          start_date: string;
          is_active?: boolean;
          commission_percentage?: number;
          currency?: string;
        };
        Update: {
          name?: string;
          initial_balance?: number;
          current_balance?: number;
          start_date?: string;
          is_active?: boolean;
          commission_percentage?: number;
          currency?: string;
        };
      };
      bet_transaction: {
        Row: {
          id: number;
          bankroll_id: number;
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
        };
        Insert: {
          bankroll_id: number;
          event_name: string;
          event_date: string;
          competition?: string;
          strategy_name?: string;
          market?: string;
          stake: number;
          odds: number;
          result?: 'pending' | 'win' | 'loss' | 'void';
          profit?: number;
          description?: string;
          tags?: string[];
          sport?: string;
        };
        Update: {
          event_name?: string;
          event_date?: string;
          competition?: string;
          strategy_name?: string;
          market?: string;
          stake?: number;
          odds?: number;
          result?: 'pending' | 'win' | 'loss' | 'void';
          profit?: number;
          description?: string;
          tags?: string[];
          sport?: string;
        };
      };
      [key: string]: any;
    };
  };
}
