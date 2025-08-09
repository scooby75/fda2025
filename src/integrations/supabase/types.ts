export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      bankroll: {
        Row: {
          commission_percentage: number | null
          created_at: string | null
          currency: string
          current_balance: number | null
          id: number
          initial_balance: number
          is_active: boolean | null
          name: string
          owner_id: string | null
          start_date: string
          updated_at: string | null
        }
        Insert: {
          commission_percentage?: number | null
          created_at?: string | null
          currency?: string
          current_balance?: number | null
          id?: number
          initial_balance: number
          is_active?: boolean | null
          name: string
          owner_id?: string | null
          start_date: string
          updated_at?: string | null
        }
        Update: {
          commission_percentage?: number | null
          created_at?: string | null
          currency?: string
          current_balance?: number | null
          id?: number
          initial_balance?: number
          is_active?: boolean | null
          name?: string
          owner_id?: string | null
          start_date?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      bet_transaction: {
        Row: {
          bankroll_id: string
          competition: string | null
          created_at: string | null
          description: string | null
          event_date: string | null
          event_name: string
          id: number
          is_pending: boolean | null
          market: string | null
          odds: number
          owner_id: string | null
          profit: number | null
          result: string | null
          sport: string | null
          stake: number
          strategy_name: string | null
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          bankroll_id: string
          competition?: string | null
          created_at?: string | null
          description?: string | null
          event_date?: string | null
          event_name: string
          id?: number
          is_pending?: boolean | null
          market?: string | null
          odds: number
          owner_id?: string | null
          profit?: number | null
          result?: string | null
          sport?: string | null
          stake: number
          strategy_name?: string | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          bankroll_id?: string
          competition?: string | null
          created_at?: string | null
          description?: string | null
          event_date?: string | null
          event_name?: string
          id?: number
          is_pending?: boolean | null
          market?: string | null
          odds?: number
          owner_id?: string | null
          profit?: number | null
          result?: string | null
          sport?: string | null
          stake?: number
          strategy_name?: string | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      custom_competition: {
        Row: {
          country: string | null
          created_at: string | null
          id: number
          is_active: boolean | null
          name: string
          owner_id: string | null
          sport: string | null
          updated_at: string | null
        }
        Insert: {
          country?: string | null
          created_at?: string | null
          id?: number
          is_active?: boolean | null
          name: string
          owner_id?: string | null
          sport?: string | null
          updated_at?: string | null
        }
        Update: {
          country?: string | null
          created_at?: string | null
          id?: number
          is_active?: boolean | null
          name?: string
          owner_id?: string | null
          sport?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      custom_strategy: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          is_active: boolean | null
          market: string
          name: string
          owner_id: string | null
          sport: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          is_active?: boolean | null
          market: string
          name: string
          owner_id?: string | null
          sport?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          is_active?: boolean | null
          market?: string
          name?: string
          owner_id?: string | null
          sport?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      dailygame: {
        Row: {
          away: string
          created_at: string | null
          date: string
          home: string
          id: number
          league: string
          odd_a_ft: number | null
          odd_a_ht: number | null
          odd_btts_no: number | null
          odd_btts_yes: number | null
          odd_corners_a: number | null
          odd_corners_d: number | null
          odd_corners_h: number | null
          odd_corners_over105: number | null
          odd_corners_over115: number | null
          odd_corners_over75: number | null
          odd_corners_over85: number | null
          odd_corners_over95: number | null
          odd_corners_under105: number | null
          odd_corners_under115: number | null
          odd_corners_under75: number | null
          odd_corners_under85: number | null
          odd_corners_under95: number | null
          odd_d_ft: number | null
          odd_d_ht: number | null
          odd_dc_12: number | null
          odd_dc_1x: number | null
          odd_dc_x2: number | null
          odd_h_ft: number | null
          odd_h_ht: number | null
          odd_over05_ft: number | null
          odd_over05_ht: number | null
          odd_over15_ft: number | null
          odd_over15_ht: number | null
          odd_over25_ft: number | null
          odd_over25_ht: number | null
          odd_under05_ft: number | null
          odd_under05_ht: number | null
          odd_under15_ft: number | null
          odd_under15_ht: number | null
          odd_under25_ft: number | null
          odd_under25_ht: number | null
          owner_id: string | null
          ppg_away: number | null
          ppg_home: number | null
          round: string | null
          time: string
          updated_at: string | null
          xg_away_pre: number | null
          xg_home_pre: number | null
          xg_total_pre: number | null
        }
        Insert: {
          away: string
          created_at?: string | null
          date: string
          home: string
          id?: number
          league: string
          odd_a_ft?: number | null
          odd_a_ht?: number | null
          odd_btts_no?: number | null
          odd_btts_yes?: number | null
          odd_corners_a?: number | null
          odd_corners_d?: number | null
          odd_corners_h?: number | null
          odd_corners_over105?: number | null
          odd_corners_over115?: number | null
          odd_corners_over75?: number | null
          odd_corners_over85?: number | null
          odd_corners_over95?: number | null
          odd_corners_under105?: number | null
          odd_corners_under115?: number | null
          odd_corners_under75?: number | null
          odd_corners_under85?: number | null
          odd_corners_under95?: number | null
          odd_d_ft?: number | null
          odd_d_ht?: number | null
          odd_dc_12?: number | null
          odd_dc_1x?: number | null
          odd_dc_x2?: number | null
          odd_h_ft?: number | null
          odd_h_ht?: number | null
          odd_over05_ft?: number | null
          odd_over05_ht?: number | null
          odd_over15_ft?: number | null
          odd_over15_ht?: number | null
          odd_over25_ft?: number | null
          odd_over25_ht?: number | null
          odd_under05_ft?: number | null
          odd_under05_ht?: number | null
          odd_under15_ft?: number | null
          odd_under15_ht?: number | null
          odd_under25_ft?: number | null
          odd_under25_ht?: number | null
          owner_id?: string | null
          ppg_away?: number | null
          ppg_home?: number | null
          round?: string | null
          time: string
          updated_at?: string | null
          xg_away_pre?: number | null
          xg_home_pre?: number | null
          xg_total_pre?: number | null
        }
        Update: {
          away?: string
          created_at?: string | null
          date?: string
          home?: string
          id?: number
          league?: string
          odd_a_ft?: number | null
          odd_a_ht?: number | null
          odd_btts_no?: number | null
          odd_btts_yes?: number | null
          odd_corners_a?: number | null
          odd_corners_d?: number | null
          odd_corners_h?: number | null
          odd_corners_over105?: number | null
          odd_corners_over115?: number | null
          odd_corners_over75?: number | null
          odd_corners_over85?: number | null
          odd_corners_over95?: number | null
          odd_corners_under105?: number | null
          odd_corners_under115?: number | null
          odd_corners_under75?: number | null
          odd_corners_under85?: number | null
          odd_corners_under95?: number | null
          odd_d_ft?: number | null
          odd_d_ht?: number | null
          odd_dc_12?: number | null
          odd_dc_1x?: number | null
          odd_dc_x2?: number | null
          odd_h_ft?: number | null
          odd_h_ht?: number | null
          odd_over05_ft?: number | null
          odd_over05_ht?: number | null
          odd_over15_ft?: number | null
          odd_over15_ht?: number | null
          odd_over25_ft?: number | null
          odd_over25_ht?: number | null
          odd_under05_ft?: number | null
          odd_under05_ht?: number | null
          odd_under15_ft?: number | null
          odd_under15_ht?: number | null
          odd_under25_ft?: number | null
          odd_under25_ht?: number | null
          owner_id?: string | null
          ppg_away?: number | null
          ppg_home?: number | null
          round?: string | null
          time?: string
          updated_at?: string | null
          xg_away_pre?: number | null
          xg_home_pre?: number | null
          xg_total_pre?: number | null
        }
        Relationships: []
      }
      gamedata: {
        Row: {
          away: string | null
          corners_a_ft: number | null
          corners_h_ft: number | null
          date: string | null
          goals_a_ft: number | null
          goals_a_ht: number | null
          goals_a_minutes: number[] | null
          goals_h_ft: number | null
          goals_h_ht: number | null
          goals_h_minutes: number[] | null
          home: string | null
          id_jogo: number
          league: string | null
          odd_a_ft: number | null
          odd_a_ht: number | null
          odd_btts_no: number | null
          odd_btts_yes: number | null
          odd_corners_a: number | null
          odd_corners_d: number | null
          odd_corners_h: number | null
          odd_corners_over105: number | null
          odd_corners_over115: number | null
          odd_corners_over75: number | null
          odd_corners_over85: number | null
          odd_corners_over95: number | null
          odd_corners_under105: number | null
          odd_corners_under115: number | null
          odd_corners_under75: number | null
          odd_corners_under85: number | null
          odd_corners_under95: number | null
          odd_d_ft: number | null
          odd_d_ht: number | null
          odd_dc_12: number | null
          odd_dc_1x: number | null
          odd_dc_x2: number | null
          odd_h_ft: number | null
          odd_h_ht: number | null
          odd_over05_ft: number | null
          odd_over05_ht: number | null
          odd_over15_ft: number | null
          odd_over15_ht: number | null
          odd_over25_ft: number | null
          odd_over25_ht: number | null
          odd_under05_ft: number | null
          odd_under05_ht: number | null
          odd_under15_ft: number | null
          odd_under15_ht: number | null
          odd_under25_ft: number | null
          odd_under25_ht: number | null
          ppg_away: number | null
          ppg_away_pre: number | null
          ppg_home: number | null
          ppg_home_pre: number | null
          rodada: number | null
          season: number | null
          shots_a: number | null
          shots_h: number | null
          shotsofftarget_a: number | null
          shotsofftarget_h: number | null
          shotsontarget_a: number | null
          shotsontarget_h: number | null
          totalcorners_ft: number | null
          totalgoals_ft: number | null
          totalgoals_ht: number | null
          xg_away_pre: number | null
          xg_home_pre: number | null
          xg_total_pre: number | null
        }
        Insert: {
          away?: string | null
          corners_a_ft?: number | null
          corners_h_ft?: number | null
          date?: string | null
          goals_a_ft?: number | null
          goals_a_ht?: number | null
          goals_a_minutes?: number[] | null
          goals_h_ft?: number | null
          goals_h_ht?: number | null
          goals_h_minutes?: number[] | null
          home?: string | null
          id_jogo: number
          league?: string | null
          odd_a_ft?: number | null
          odd_a_ht?: number | null
          odd_btts_no?: number | null
          odd_btts_yes?: number | null
          odd_corners_a?: number | null
          odd_corners_d?: number | null
          odd_corners_h?: number | null
          odd_corners_over105?: number | null
          odd_corners_over115?: number | null
          odd_corners_over75?: number | null
          odd_corners_over85?: number | null
          odd_corners_over95?: number | null
          odd_corners_under105?: number | null
          odd_corners_under115?: number | null
          odd_corners_under75?: number | null
          odd_corners_under85?: number | null
          odd_corners_under95?: number | null
          odd_d_ft?: number | null
          odd_d_ht?: number | null
          odd_dc_12?: number | null
          odd_dc_1x?: number | null
          odd_dc_x2?: number | null
          odd_h_ft?: number | null
          odd_h_ht?: number | null
          odd_over05_ft?: number | null
          odd_over05_ht?: number | null
          odd_over15_ft?: number | null
          odd_over15_ht?: number | null
          odd_over25_ft?: number | null
          odd_over25_ht?: number | null
          odd_under05_ft?: number | null
          odd_under05_ht?: number | null
          odd_under15_ft?: number | null
          odd_under15_ht?: number | null
          odd_under25_ft?: number | null
          odd_under25_ht?: number | null
          ppg_away?: number | null
          ppg_away_pre?: number | null
          ppg_home?: number | null
          ppg_home_pre?: number | null
          rodada?: number | null
          season?: number | null
          shots_a?: number | null
          shots_h?: number | null
          shotsofftarget_a?: number | null
          shotsofftarget_h?: number | null
          shotsontarget_a?: number | null
          shotsontarget_h?: number | null
          totalcorners_ft?: number | null
          totalgoals_ft?: number | null
          totalgoals_ht?: number | null
          xg_away_pre?: number | null
          xg_home_pre?: number | null
          xg_total_pre?: number | null
        }
        Update: {
          away?: string | null
          corners_a_ft?: number | null
          corners_h_ft?: number | null
          date?: string | null
          goals_a_ft?: number | null
          goals_a_ht?: number | null
          goals_a_minutes?: number[] | null
          goals_h_ft?: number | null
          goals_h_ht?: number | null
          goals_h_minutes?: number[] | null
          home?: string | null
          id_jogo?: number
          league?: string | null
          odd_a_ft?: number | null
          odd_a_ht?: number | null
          odd_btts_no?: number | null
          odd_btts_yes?: number | null
          odd_corners_a?: number | null
          odd_corners_d?: number | null
          odd_corners_h?: number | null
          odd_corners_over105?: number | null
          odd_corners_over115?: number | null
          odd_corners_over75?: number | null
          odd_corners_over85?: number | null
          odd_corners_over95?: number | null
          odd_corners_under105?: number | null
          odd_corners_under115?: number | null
          odd_corners_under75?: number | null
          odd_corners_under85?: number | null
          odd_corners_under95?: number | null
          odd_d_ft?: number | null
          odd_d_ht?: number | null
          odd_dc_12?: number | null
          odd_dc_1x?: number | null
          odd_dc_x2?: number | null
          odd_h_ft?: number | null
          odd_h_ht?: number | null
          odd_over05_ft?: number | null
          odd_over05_ht?: number | null
          odd_over15_ft?: number | null
          odd_over15_ht?: number | null
          odd_over25_ft?: number | null
          odd_over25_ht?: number | null
          odd_under05_ft?: number | null
          odd_under05_ht?: number | null
          odd_under15_ft?: number | null
          odd_under15_ht?: number | null
          odd_under25_ft?: number | null
          odd_under25_ht?: number | null
          ppg_away?: number | null
          ppg_away_pre?: number | null
          ppg_home?: number | null
          ppg_home_pre?: number | null
          rodada?: number | null
          season?: number | null
          shots_a?: number | null
          shots_h?: number | null
          shotsofftarget_a?: number | null
          shotsofftarget_h?: number | null
          shotsontarget_a?: number | null
          shotsontarget_h?: number | null
          totalcorners_ft?: number | null
          totalgoals_ft?: number | null
          totalgoals_ht?: number | null
          xg_away_pre?: number | null
          xg_home_pre?: number | null
          xg_total_pre?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"] | null
          status: Database["public"]["Enums"]["user_status"] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          role?: Database["public"]["Enums"]["user_role"] | null
          status?: Database["public"]["Enums"]["user_status"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"] | null
          status?: Database["public"]["Enums"]["user_status"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      rankingaway: {
        Row: {
          away: string
          created_at: string | null
          draw: number
          goal_difference_away: number
          id: number
          league: string
          loss: number
          points_away: number
          ranking_away: number
          season: string
          updated_at: string | null
          win: number
        }
        Insert: {
          away: string
          created_at?: string | null
          draw?: number
          goal_difference_away?: number
          id?: number
          league: string
          loss?: number
          points_away?: number
          ranking_away: number
          season: string
          updated_at?: string | null
          win?: number
        }
        Update: {
          away?: string
          created_at?: string | null
          draw?: number
          goal_difference_away?: number
          id?: number
          league?: string
          loss?: number
          points_away?: number
          ranking_away?: number
          season?: string
          updated_at?: string | null
          win?: number
        }
        Relationships: []
      }
      rankinghome: {
        Row: {
          created_at: string | null
          draw: number
          goal_difference_home: number
          home: string
          id: number
          league: string
          loss: number
          points_home: number
          ranking_home: number
          season: string
          updated_at: string | null
          win: number
        }
        Insert: {
          created_at?: string | null
          draw: number
          goal_difference_home: number
          home: string
          id?: number
          league: string
          loss: number
          points_home: number
          ranking_home: number
          season: string
          updated_at?: string | null
          win: number
        }
        Update: {
          created_at?: string | null
          draw?: number
          goal_difference_home?: number
          home?: string
          id?: number
          league?: string
          loss?: number
          points_home?: number
          ranking_home?: number
          season?: string
          updated_at?: string | null
          win?: number
        }
        Relationships: []
      }
      strategy: {
        Row: {
          average_odds: number | null
          away_teams: string[] | null
          best_leagues: string[] | null
          best_teams: string[] | null
          common_scores: string[] | null
          created_at: string | null
          description: string | null
          end_date: string | null
          evolution_chart: Json[] | null
          hit_rate: number | null
          home_teams: string[] | null
          id: number
          leagues: string[] | null
          market: string
          max_away_ppg: number | null
          max_away_xg: number | null
          max_game_week: number | null
          max_goals_a_ft: number | null
          max_goals_a_ht: number | null
          max_goals_h_ft: number | null
          max_goals_h_ht: number | null
          max_home_ppg: number | null
          max_home_xg: number | null
          max_losing_streak: number | null
          max_losing_streak_loss: number | null
          max_odds: number | null
          max_odds_a_ht: number | null
          max_odds_btts_no: number | null
          max_odds_btts_yes: number | null
          max_odds_d_ht: number | null
          max_odds_dc_12: number | null
          max_odds_dc_1x: number | null
          max_odds_dc_x2: number | null
          max_odds_ft_away_team_win: number | null
          max_odds_ft_draw: number | null
          max_odds_ft_home_team_win: number | null
          max_odds_ft_over15: number | null
          max_odds_ft_over25: number | null
          max_odds_ft_over35: number | null
          max_odds_ft_over45: number | null
          max_odds_h_ht: number | null
          max_odds_under05_ft: number | null
          max_odds_under15_ft: number | null
          max_odds_under25_ft: number | null
          max_odds_under35_ft: number | null
          max_odds_under45_ft: number | null
          max_shots_off_target_a: number | null
          max_shots_off_target_h: number | null
          max_shots_on_target_a: number | null
          max_shots_on_target_h: number | null
          max_winning_streak: number | null
          max_winning_streak_profit: number | null
          min_away_ppg: number | null
          min_away_xg: number | null
          min_game_week: number | null
          min_goals_a_ft: number | null
          min_goals_a_ht: number | null
          min_goals_h_ft: number | null
          min_goals_h_ht: number | null
          min_home_ppg: number | null
          min_home_xg: number | null
          min_odds: number | null
          min_odds_a_ht: number | null
          min_odds_btts_no: number | null
          min_odds_btts_yes: number | null
          min_odds_d_ht: number | null
          min_odds_dc_12: number | null
          min_odds_dc_1x: number | null
          min_odds_dc_x2: number | null
          min_odds_ft_away_team_win: number | null
          min_odds_ft_draw: number | null
          min_odds_ft_home_team_win: number | null
          min_odds_ft_over15: number | null
          min_odds_ft_over25: number | null
          min_odds_ft_over35: number | null
          min_odds_ft_over45: number | null
          min_odds_h_ht: number | null
          min_odds_under05_ft: number | null
          min_odds_under15_ft: number | null
          min_odds_under25_ft: number | null
          min_odds_under35_ft: number | null
          min_odds_under45_ft: number | null
          min_shots_off_target_a: number | null
          min_shots_off_target_h: number | null
          min_shots_on_target_a: number | null
          min_shots_on_target_h: number | null
          name: string
          owner_id: string
          results: Json | null
          roi: number | null
          sample_bets: Json[] | null
          start_date: string | null
          total_bets: number | null
          total_profit: number | null
          unit_stake: number
          updated_at: string | null
          winning_bets: number | null
          worst_leagues: string[] | null
          worst_teams: string[] | null
        }
        Insert: {
          average_odds?: number | null
          away_teams?: string[] | null
          best_leagues?: string[] | null
          best_teams?: string[] | null
          common_scores?: string[] | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          evolution_chart?: Json[] | null
          hit_rate?: number | null
          home_teams?: string[] | null
          id?: number
          leagues?: string[] | null
          market: string
          max_away_ppg?: number | null
          max_away_xg?: number | null
          max_game_week?: number | null
          max_goals_a_ft?: number | null
          max_goals_a_ht?: number | null
          max_goals_h_ft?: number | null
          max_goals_h_ht?: number | null
          max_home_ppg?: number | null
          max_home_xg?: number | null
          max_losing_streak?: number | null
          max_losing_streak_loss?: number | null
          max_odds?: number | null
          max_odds_a_ht?: number | null
          max_odds_btts_no?: number | null
          max_odds_btts_yes?: number | null
          max_odds_d_ht?: number | null
          max_odds_dc_12?: number | null
          max_odds_dc_1x?: number | null
          max_odds_dc_x2?: number | null
          max_odds_ft_away_team_win?: number | null
          max_odds_ft_draw?: number | null
          max_odds_ft_home_team_win?: number | null
          max_odds_ft_over15?: number | null
          max_odds_ft_over25?: number | null
          max_odds_ft_over35?: number | null
          max_odds_ft_over45?: number | null
          max_odds_h_ht?: number | null
          max_odds_under05_ft?: number | null
          max_odds_under15_ft?: number | null
          max_odds_under25_ft?: number | null
          max_odds_under35_ft?: number | null
          max_odds_under45_ft?: number | null
          max_shots_off_target_a?: number | null
          max_shots_off_target_h?: number | null
          max_shots_on_target_a?: number | null
          max_shots_on_target_h?: number | null
          max_winning_streak?: number | null
          max_winning_streak_profit?: number | null
          min_away_ppg?: number | null
          min_away_xg?: number | null
          min_game_week?: number | null
          min_goals_a_ft?: number | null
          min_goals_a_ht?: number | null
          min_goals_h_ft?: number | null
          min_goals_h_ht?: number | null
          min_home_ppg?: number | null
          min_home_xg?: number | null
          min_odds?: number | null
          min_odds_a_ht?: number | null
          min_odds_btts_no?: number | null
          min_odds_btts_yes?: number | null
          min_odds_d_ht?: number | null
          min_odds_dc_12?: number | null
          min_odds_dc_1x?: number | null
          min_odds_dc_x2?: number | null
          min_odds_ft_away_team_win?: number | null
          min_odds_ft_draw?: number | null
          min_odds_ft_home_team_win?: number | null
          min_odds_ft_over15?: number | null
          min_odds_ft_over25?: number | null
          min_odds_ft_over35?: number | null
          min_odds_ft_over45?: number | null
          min_odds_h_ht?: number | null
          min_odds_under05_ft?: number | null
          min_odds_under15_ft?: number | null
          min_odds_under25_ft?: number | null
          min_odds_under35_ft?: number | null
          min_odds_under45_ft?: number | null
          min_shots_off_target_a?: number | null
          min_shots_off_target_h?: number | null
          min_shots_on_target_a?: number | null
          min_shots_on_target_h?: number | null
          name: string
          owner_id?: string
          results?: Json | null
          roi?: number | null
          sample_bets?: Json[] | null
          start_date?: string | null
          total_bets?: number | null
          total_profit?: number | null
          unit_stake: number
          updated_at?: string | null
          winning_bets?: number | null
          worst_leagues?: string[] | null
          worst_teams?: string[] | null
        }
        Update: {
          average_odds?: number | null
          away_teams?: string[] | null
          best_leagues?: string[] | null
          best_teams?: string[] | null
          common_scores?: string[] | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          evolution_chart?: Json[] | null
          hit_rate?: number | null
          home_teams?: string[] | null
          id?: number
          leagues?: string[] | null
          market?: string
          max_away_ppg?: number | null
          max_away_xg?: number | null
          max_game_week?: number | null
          max_goals_a_ft?: number | null
          max_goals_a_ht?: number | null
          max_goals_h_ft?: number | null
          max_goals_h_ht?: number | null
          max_home_ppg?: number | null
          max_home_xg?: number | null
          max_losing_streak?: number | null
          max_losing_streak_loss?: number | null
          max_odds?: number | null
          max_odds_a_ht?: number | null
          max_odds_btts_no?: number | null
          max_odds_btts_yes?: number | null
          max_odds_d_ht?: number | null
          max_odds_dc_12?: number | null
          max_odds_dc_1x?: number | null
          max_odds_dc_x2?: number | null
          max_odds_ft_away_team_win?: number | null
          max_odds_ft_draw?: number | null
          max_odds_ft_home_team_win?: number | null
          max_odds_ft_over15?: number | null
          max_odds_ft_over25?: number | null
          max_odds_ft_over35?: number | null
          max_odds_ft_over45?: number | null
          max_odds_h_ht?: number | null
          max_odds_under05_ft?: number | null
          max_odds_under15_ft?: number | null
          max_odds_under25_ft?: number | null
          max_odds_under35_ft?: number | null
          max_odds_under45_ft?: number | null
          max_shots_off_target_a?: number | null
          max_shots_off_target_h?: number | null
          max_shots_on_target_a?: number | null
          max_shots_on_target_h?: number | null
          max_winning_streak?: number | null
          max_winning_streak_profit?: number | null
          min_away_ppg?: number | null
          min_away_xg?: number | null
          min_game_week?: number | null
          min_goals_a_ft?: number | null
          min_goals_a_ht?: number | null
          min_goals_h_ft?: number | null
          min_goals_h_ht?: number | null
          min_home_ppg?: number | null
          min_home_xg?: number | null
          min_odds?: number | null
          min_odds_a_ht?: number | null
          min_odds_btts_no?: number | null
          min_odds_btts_yes?: number | null
          min_odds_d_ht?: number | null
          min_odds_dc_12?: number | null
          min_odds_dc_1x?: number | null
          min_odds_dc_x2?: number | null
          min_odds_ft_away_team_win?: number | null
          min_odds_ft_draw?: number | null
          min_odds_ft_home_team_win?: number | null
          min_odds_ft_over15?: number | null
          min_odds_ft_over25?: number | null
          min_odds_ft_over35?: number | null
          min_odds_ft_over45?: number | null
          min_odds_h_ht?: number | null
          min_odds_under05_ft?: number | null
          min_odds_under15_ft?: number | null
          min_odds_under25_ft?: number | null
          min_odds_under35_ft?: number | null
          min_odds_under45_ft?: number | null
          min_shots_off_target_a?: number | null
          min_shots_off_target_h?: number | null
          min_shots_on_target_a?: number | null
          min_shots_on_target_h?: number | null
          name?: string
          owner_id?: string
          results?: Json | null
          roi?: number | null
          sample_bets?: Json[] | null
          start_date?: string | null
          total_bets?: number | null
          total_profit?: number | null
          unit_stake?: number
          updated_at?: string | null
          winning_bets?: number | null
          worst_leagues?: string[] | null
          worst_teams?: string[] | null
        }
        Relationships: []
      }
      telegram_notification: {
        Row: {
          bot_token: string | null
          created_at: string | null
          fallback_email: string | null
          games_sent_count: number | null
          id: number
          is_active: boolean | null
          last_sent_date: string | null
          notification_preferences: Json
          owner_id: string | null
          sent_games: Json[] | null
          strategy_id: string
          strategy_name: string
          telegram_chat_id: string
          updated_at: string | null
        }
        Insert: {
          bot_token?: string | null
          created_at?: string | null
          fallback_email?: string | null
          games_sent_count?: number | null
          id?: number
          is_active?: boolean | null
          last_sent_date?: string | null
          notification_preferences?: Json
          owner_id?: string | null
          sent_games?: Json[] | null
          strategy_id: string
          strategy_name: string
          telegram_chat_id: string
          updated_at?: string | null
        }
        Update: {
          bot_token?: string | null
          created_at?: string | null
          fallback_email?: string | null
          games_sent_count?: number | null
          id?: number
          is_active?: boolean | null
          last_sent_date?: string | null
          notification_preferences?: Json
          owner_id?: string | null
          sent_games?: Json[] | null
          strategy_id?: string
          strategy_name?: string
          telegram_chat_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      update_logs: {
        Row: {
          completed_at: string | null
          error_details: string | null
          id: string
          message: string | null
          started_at: string | null
          status: string
        }
        Insert: {
          completed_at?: string | null
          error_details?: string | null
          id?: string
          message?: string | null
          started_at?: string | null
          status: string
        }
        Update: {
          completed_at?: string | null
          error_details?: string | null
          id?: string
          message?: string | null
          started_at?: string | null
          status?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      is_user_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      list_cron_jobs: {
        Args: Record<PropertyKey, never>
        Returns: {
          jobid: number
          schedule: string
          command: string
          nodename: string
          nodeport: number
          database: string
          username: string
          active: boolean
          jobname: string
        }[]
      }
      trigger_data_update: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      user_role: "admin" | "user"
      user_status: "pending" | "approved" | "blocked"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["admin", "user"],
      user_status: ["pending", "approved", "blocked"],
    },
  },
} as const
