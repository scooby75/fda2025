interface Strategy {
  season?: string | string[];
  start_date?: string;
  end_date?: string;
  leagues?: string[];
  home_teams?: string[];
  away_teams?: string[];
  min_game_week?: number;
  max_game_week?: number;
  min_home_ppg?: number;
  max_home_ppg?: number;
  min_away_ppg?: number;
  max_away_ppg?: number;
  min_home_xg?: number;
  max_home_xg?: number;
  min_away_xg?: number;
  max_away_xg?: number;
  min_shots_on_target_h?: number;
  max_shots_on_target_h?: number;
  min_shots_on_target_a?: number;
  max_shots_on_target_a?: number;
  min_shots_off_target_h?: number;
  max_shots_off_target_h?: number;
  min_shots_off_target_a?: number;
  max_shots_off_target_a?: number;
  min_goals_h_ht?: number;
  max_goals_h_ht?: number;
  min_goals_a_ht?: number;
  max_goals_a_ht?: number;
  min_goals_h_ft?: number;
  max_goals_h_ft?: number;
  min_goals_a_ft?: number;
  max_goals_a_ft?: number;
  min_ranking_home?: number;
  max_ranking_home?: number;
  min_ranking_away?: number;
  max_ranking_away?: number;
  market: string;
  min_odds?: number;
  max_odds?: number;
  min_odds_ft_home_team_win?: number;
  max_odds_ft_home_team_win?: number;
  min_odds_ft_draw?: number;
  max_odds_ft_draw?: number;
  min_odds_ft_away_team_win?: number;
  max_odds_ft_away_team_win?: number;
  min_odds_h_ht?: number;
  max_odds_h_ht?: number;
  min_odds_d_ht?: number;
  max_odds_d_ht?: number;
  min_odds_a_ht?: number;
  max_odds_a_ht?: number;
  min_odds_ft_over15?: number;
  max_odds_ft_over15?: number;
  min_odds_ft_over25?: number;
  max_odds_ft_over25?: number;
  min_odds_ft_over35?: number;
  max_odds_ft_over35?: number;
  min_odds_ft_over45?: number;
  max_odds_ft_over45?: number;
  min_odds_btts_yes?: number;
  max_odds_btts_yes?: number;
  min_odds_btts_no?: number;
  max_odds_btts_no?: number;
  min_odds_under05_ft?: number;
  max_odds_under05_ft?: number;
  min_odds_under15_ft?: number;
  max_odds_under15_ft?: number;
  min_odds_under25_ft?: number;
  max_odds_under25_ft?: number;
  min_odds_under35_ft?: number;
  max_odds_under35_ft?: number;
  min_odds_under45_ft?: number;
  max_odds_under45_ft?: number;
  min_odds_dc_1x?: number;
  max_odds_dc_1x?: number;
  min_odds_dc_12?: number;
  max_odds_dc_12?: number;
  min_odds_dc_x2?: number;
  max_odds_dc_x2?: number;
  unit_stake: number;
}

interface GameData {
  league: string;
  season: number;
  date: string;
  rodada: number;
  home: string;
  away: string;
  goals_h_ht?: number;
  goals_a_ht?: number;
  goals_h_ft?: number;
  goals_a_ft?: number;
  odd_h_ft?: number;
  odd_d_ft?: number;
  odd_a_ft?: number;
  odd_h_ht?: number;
  odd_d_ht?: number;
  odd_a_ht?: number;
  ppg_home_pre?: number;
  ppg_away_pre?: number;
  xg_home_pre?: number;
  xg_away_pre?: number;
  shotsontarget_h?: number;
  shotsontarget_a?: number;
  shotsofftarget_h?: number;
  shotsofftarget_a?: number;
  odd_over15_ft?: number;
  odd_over25_ft?: number;
  odd_over35_ft?: number;
  odd_over45_ft?: number;
  odd_under05_ft?: number;
  odd_under15_ft?: number;
  odd_under25_ft?: number;
  odd_under35_ft?: number;
  odd_under45_ft?: number;
  odd_btts_yes?: number;
  odd_btts_no?: number;
  odd_dc_1x?: number;
  odd_dc_12?: number;
  odd_dc_x2?: number;
}

interface RankingHome {
  league: string;
  season: string;
  home: string;
  ranking_home: number;
}

interface RankingAway {
  league: string;
  season: string;
  away: string;
  ranking_away: number;
}

interface Bet {
  game: GameData;
  odds: number;
  result: 'win' | 'loss' | 'undefined';
  profit: number;
  date: Date;
  match: string;
  score: string;
}

interface LeagueStats {
  profit: number;
  bets: number;
}

interface TeamStats {
  profit: number;
  bets: number;
}

interface Results {
  total_bets: number;
  winning_bets: number;
  hit_rate: number;
  average_odds: number;
  total_profit: number;
  roi: number;
  max_winning_streak: number;
  max_winning_streak_profit: number;
  max_losing_streak: number;
  max_losing_streak_loss: number;
  sample_bets: Bet[];
  best_leagues: Array<{ name: string; profit: number; bets: number; avgProfit: number }>;
  worst_leagues: Array<{ name: string; profit: number; bets: number; avgProfit: number }>;
  best_teams: Array<{ name: string; profit: number; bets: number; avgProfit: number }>;
  worst_teams: Array<{ name: string; profit: number; bets: number; avgProfit: number }>;
  common_scores: Array<{ score: string; count: number; percentage: string }>;
  evolution_chart: Array<{ bet: number; profit: number; roi: number }>;
}

class BacktestingEngine {
  runBacktest(strategy: Strategy, gameData: GameData[], rankingHomeData: RankingHome[], rankingAwayData: RankingAway[]): Results {
    const sortedGameData = [...gameData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const filteredGames = this.filterGames(strategy, sortedGameData, rankingHomeData, rankingAwayData);
    const bets = this.generateBets(strategy, filteredGames);
    const results = this.calculateResults(bets, strategy);
    
    return results;
  }

  filterGames(strategy: Strategy, gameData: GameData[], rankingHomeData: RankingHome[], rankingAwayData: RankingAway[]): GameData[] {
    const isNum = (val: any): val is number => typeof val === 'number';

    // Create lookup maps for performance
    const homeRankingMap = new Map((rankingHomeData || []).map(r => [`${r.league}|${r.season}|${r.home}`, r]));
    const awayRankingMap = new Map((rankingAwayData || []).map(r => [`${r.league}|${r.season}|${r.away}`, r]));

    return gameData.filter(game => {
      // Filtro por temporada - support both array and string
      if (strategy.season) {
        const seasonFilter = Array.isArray(strategy.season) ? strategy.season : [strategy.season];
        if (seasonFilter.length > 0 && !seasonFilter.includes(game.season.toString())) return false;
      }

      // Filtro por data
      if (strategy.start_date) {
        const gameDate = new Date(game.date);
        const startDate = new Date(strategy.start_date);
        startDate.setHours(0, 0, 0, 0);
        if (gameDate < startDate) return false;
      }
      
      if (strategy.end_date) {
        const gameDate = new Date(game.date);
        const endDate = new Date(strategy.end_date);
        endDate.setHours(23, 59, 59, 999); 
        if (gameDate > endDate) return false;
      }

      // Filtro por ligas e times
      if (strategy.leagues?.length && !strategy.leagues.includes(game.league)) return false;
      if (strategy.home_teams?.length && !strategy.home_teams.includes(game.home)) return false;
      if (strategy.away_teams?.length && !strategy.away_teams.includes(game.away)) return false;

      const gameRodada = game.rodada;

      // Filtros numéricos
      if (isNum(strategy.min_game_week) && (!isNum(gameRodada) || gameRodada < strategy.min_game_week)) return false;
      if (isNum(strategy.max_game_week) && (!isNum(gameRodada) || gameRodada > strategy.max_game_week)) return false;
      
      if (isNum(strategy.min_home_ppg) && (!isNum(game.ppg_home_pre) || game.ppg_home_pre < strategy.min_home_ppg)) return false;
      if (isNum(strategy.max_home_ppg) && (!isNum(game.ppg_home_pre) || game.ppg_home_pre > strategy.max_home_ppg)) return false;
      if (isNum(strategy.min_away_ppg) && (!isNum(game.ppg_away_pre) || game.ppg_away_pre < strategy.min_away_ppg)) return false;
      if (isNum(strategy.max_away_ppg) && (!isNum(game.ppg_away_pre) || game.ppg_away_pre > strategy.max_away_ppg)) return false;
      
      if (isNum(strategy.min_home_xg) && (!isNum(game.xg_home_pre) || game.xg_home_pre < strategy.min_home_xg)) return false;
      if (isNum(strategy.max_home_xg) && (!isNum(game.xg_home_pre) || game.xg_home_pre > strategy.max_home_xg)) return false;
      if (isNum(strategy.min_away_xg) && (!isNum(game.xg_away_pre) || game.xg_away_pre < strategy.min_away_xg)) return false;
      if (isNum(strategy.max_away_xg) && (!isNum(game.xg_away_pre) || game.xg_away_pre > strategy.max_away_xg)) return false;

      // Filtros de chutes
      if (isNum(strategy.min_shots_on_target_h) && (!isNum(game.shotsontarget_h) || game.shotsontarget_h < strategy.min_shots_on_target_h)) return false;
      if (isNum(strategy.max_shots_on_target_h) && (!isNum(game.shotsontarget_h) || game.shotsontarget_h > strategy.max_shots_on_target_h)) return false;
      if (isNum(strategy.min_shots_on_target_a) && (!isNum(game.shotsontarget_a) || game.shotsontarget_a < strategy.min_shots_on_target_a)) return false;
      if (isNum(strategy.max_shots_on_target_a) && (!isNum(game.shotsontarget_a) || game.shotsontarget_a > strategy.max_shots_on_target_a)) return false;
      if (isNum(strategy.min_shots_off_target_h) && (!isNum(game.shotsofftarget_h) || game.shotsofftarget_h < strategy.min_shots_off_target_h)) return false;
      if (isNum(strategy.max_shots_off_target_h) && (!isNum(game.shotsofftarget_h) || game.shotsofftarget_h > strategy.max_shots_off_target_h)) return false;
      if (isNum(strategy.min_shots_off_target_a) && (!isNum(game.shotsofftarget_a) || game.shotsofftarget_a < strategy.min_shots_off_target_a)) return false;
      if (isNum(strategy.max_shots_off_target_a) && (!isNum(game.shotsofftarget_a) || game.shotsofftarget_a > strategy.max_shots_off_target_a)) return false;

      // Goal Filters
      if (isNum(strategy.min_goals_h_ht) && (!isNum(game.goals_h_ht) || game.goals_h_ht < strategy.min_goals_h_ht)) return false;
      if (isNum(strategy.max_goals_h_ht) && (!isNum(game.goals_h_ht) || game.goals_h_ht > strategy.max_goals_h_ht)) return false;
      if (isNum(strategy.min_goals_a_ht) && (!isNum(game.goals_a_ht) || game.goals_a_ht < strategy.min_goals_a_ht)) return false;
      if (isNum(strategy.max_goals_a_ht) && (!isNum(game.goals_a_ht) || game.goals_a_ht > strategy.max_goals_a_ht)) return false;
      if (isNum(strategy.min_goals_h_ft) && (!isNum(game.goals_h_ft) || game.goals_h_ft < strategy.min_goals_h_ft)) return false;
      if (isNum(strategy.max_goals_h_ft) && (!isNum(game.goals_h_ft) || game.goals_h_ft > strategy.max_goals_h_ft)) return false;
      if (isNum(strategy.min_goals_a_ft) && (!isNum(game.goals_a_ft) || game.goals_a_ft < strategy.min_goals_a_ft)) return false;
      if (isNum(strategy.max_goals_a_ft) && (!isNum(game.goals_a_ft) || game.goals_a_ft > strategy.max_goals_a_ft)) return false;

      // Ranking filters
      const homeRanking = homeRankingMap.get(`${game.league}|${game.season}|${game.home}`);
      const awayRanking = awayRankingMap.get(`${game.league}|${game.season}|${game.away}`);
      
      if (isNum(strategy.min_ranking_home) && (!homeRanking || !isNum(homeRanking.ranking_home) || homeRanking.ranking_home < strategy.min_ranking_home)) return false;
      if (isNum(strategy.max_ranking_home) && (!homeRanking || !isNum(homeRanking.ranking_home) || homeRanking.ranking_home > strategy.max_ranking_home)) return false;
      if (isNum(strategy.min_ranking_away) && (!awayRanking || !isNum(awayRanking.ranking_away) || awayRanking.ranking_away < strategy.min_ranking_away)) return false;
      if (isNum(strategy.max_ranking_away) && (!awayRanking || !isNum(awayRanking.ranking_away) || awayRanking.ranking_away > strategy.max_ranking_away)) return false;

      // Filtro por odds do mercado principal
      const primaryMarketOdds = this.getOddsForMarket(strategy.market, game);
      if (!isNum(primaryMarketOdds) || primaryMarketOdds === 0) return false; 
      if (isNum(strategy.min_odds) && primaryMarketOdds < strategy.min_odds) return false;
      if (isNum(strategy.max_odds) && primaryMarketOdds > strategy.max_odds) return false;

      // Filtros de Odds Específicas (adicionais)
      if (isNum(strategy.min_odds_ft_home_team_win) && (!isNum(game.odd_h_ft) || game.odd_h_ft < strategy.min_odds_ft_home_team_win)) return false;
      if (isNum(strategy.max_odds_ft_home_team_win) && (!isNum(game.odd_h_ft) || game.odd_h_ft > strategy.max_odds_ft_home_team_win)) return false;
      if (isNum(strategy.min_odds_ft_draw) && (!isNum(game.odd_d_ft) || game.odd_d_ft < strategy.min_odds_ft_draw)) return false;
      if (isNum(strategy.max_odds_ft_draw) && (!isNum(game.odd_d_ft) || game.odd_d_ft > strategy.max_odds_ft_draw)) return false;
      if (isNum(strategy.min_odds_ft_away_team_win) && (!isNum(game.odd_a_ft) || game.odd_a_ft < strategy.min_odds_ft_away_team_win)) return false;
      if (isNum(strategy.max_odds_ft_away_team_win) && (!isNum(game.odd_a_ft) || game.odd_a_ft > strategy.max_odds_ft_away_team_win)) return false;
      
      // New HT Odds filters
      if (isNum(strategy.min_odds_h_ht) && (!isNum(game.odd_h_ht) || game.odd_h_ht < strategy.min_odds_h_ht)) return false;
      if (isNum(strategy.max_odds_h_ht) && (!isNum(game.odd_h_ht) || game.odd_h_ht > strategy.max_odds_h_ht)) return false;
      if (isNum(strategy.min_odds_d_ht) && (!isNum(game.odd_d_ht) || game.odd_d_ht < strategy.min_odds_d_ht)) return false;
      if (isNum(strategy.max_odds_d_ht) && (!isNum(game.odd_d_ht) || game.odd_d_ht > strategy.max_odds_d_ht)) return false;
      if (isNum(strategy.min_odds_a_ht) && (!isNum(game.odd_a_ht) || game.odd_a_ht < strategy.min_odds_a_ht)) return false;
      if (isNum(strategy.max_odds_a_ht) && (!isNum(game.odd_a_ht) || game.odd_a_ht > strategy.max_odds_a_ht)) return false;
      
      if (isNum(strategy.min_odds_ft_over15) && (!isNum(game.odd_over15_ft) || game.odd_over15_ft < strategy.min_odds_ft_over15)) return false;
      if (isNum(strategy.max_odds_ft_over15) && (!isNum(game.odd_over15_ft) || game.odd_over15_ft > strategy.max_odds_ft_over15)) return false;
      if (isNum(strategy.min_odds_ft_over25) && (!isNum(game.odd_over25_ft) || game.odd_over25_ft < strategy.min_odds_ft_over25)) return false;
      if (isNum(strategy.max_odds_ft_over25) && (!isNum(game.odd_over25_ft) || game.odd_over25_ft > strategy.max_odds_ft_over25)) return false;
      if (isNum(strategy.min_odds_ft_over35) && (!isNum(game.odd_over35_ft) || game.odd_over35_ft < strategy.min_odds_ft_over35)) return false;
      if (isNum(strategy.max_odds_ft_over35) && (!isNum(game.odd_over35_ft) || game.odd_over35_ft > strategy.max_odds_ft_over35)) return false;
      if (isNum(strategy.min_odds_ft_over45) && (!isNum(game.odd_over45_ft) || game.odd_over45_ft < strategy.min_odds_ft_over45)) return false;
      if (isNum(strategy.max_odds_ft_over45) && (!isNum(game.odd_over45_ft) || game.odd_over45_ft > strategy.max_odds_ft_over45)) return false;
      if (isNum(strategy.min_odds_btts_yes) && (!isNum(game.odd_btts_yes) || game.odd_btts_yes < strategy.min_odds_btts_yes)) return false;
      if (isNum(strategy.max_odds_btts_yes) && (!isNum(game.odd_btts_yes) || game.odd_btts_yes > strategy.max_odds_btts_yes)) return false;
      if (isNum(strategy.min_odds_btts_no) && (!isNum(game.odd_btts_no) || game.odd_btts_no < strategy.min_odds_btts_no)) return false;
      if (isNum(strategy.max_odds_btts_no) && (!isNum(game.odd_btts_no) || game.odd_btts_no > strategy.max_odds_btts_no)) return false;
      
      // Filtros de Odds Under
      if (isNum(strategy.min_odds_under05_ft) && (!isNum(game.odd_under05_ft) || game.odd_under05_ft < strategy.min_odds_under05_ft)) return false;
      if (isNum(strategy.max_odds_under05_ft) && (!isNum(game.odd_under05_ft) || game.odd_under05_ft > strategy.max_odds_under05_ft)) return false;
      if (isNum(strategy.min_odds_under15_ft) && (!isNum(game.odd_under15_ft) || game.odd_under15_ft < strategy.min_odds_under15_ft)) return false;
      if (isNum(strategy.max_odds_under15_ft) && (!isNum(game.odd_under15_ft) || game.odd_under15_ft > strategy.max_odds_under15_ft)) return false;
      if (isNum(strategy.min_odds_under25_ft) && (!isNum(game.odd_under25_ft) || game.odd_under25_ft < strategy.min_odds_under25_ft)) return false;
      if (isNum(strategy.max_odds_under25_ft) && (!isNum(game.odd_under25_ft) || game.odd_under25_ft > strategy.max_odds_under25_ft)) return false;
      if (isNum(strategy.min_odds_under35_ft) && (!isNum(game.odd_under35_ft) || game.odd_under35_ft < strategy.min_odds_under35_ft)) return false;
      if (isNum(strategy.max_odds_under35_ft) && (!isNum(game.odd_under35_ft) || game.odd_under35_ft > strategy.max_odds_under35_ft)) return false;
      if (isNum(strategy.min_odds_under45_ft) && (!isNum(game.odd_under45_ft) || game.odd_under45_ft < strategy.min_odds_under45_ft)) return false;
      if (isNum(strategy.max_odds_under45_ft) && (!isNum(game.odd_under45_ft) || game.odd_under45_ft > strategy.max_odds_under45_ft)) return false;
      
      // Filtros de Dupla Chance
      if (isNum(strategy.min_odds_dc_1x) && (!isNum(game.odd_dc_1x) || game.odd_dc_1x < strategy.min_odds_dc_1x)) return false;
      if (isNum(strategy.max_odds_dc_1x) && (!isNum(game.odd_dc_1x) || game.odd_dc_1x > strategy.max_odds_dc_1x)) return false;
      if (isNum(strategy.min_odds_dc_12) && (!isNum(game.odd_dc_12) || game.odd_dc_12 < strategy.min_odds_dc_12)) return false;
      if (isNum(strategy.max_odds_dc_12) && (!isNum(game.odd_dc_12) || game.odd_dc_12 > strategy.max_odds_dc_12)) return false;
      if (isNum(strategy.min_odds_dc_x2) && (!isNum(game.odd_dc_x2) || game.odd_dc_x2 < strategy.min_odds_dc_x2)) return false;
      if (isNum(strategy.max_odds_dc_x2) && (!isNum(game.odd_dc_x2) || game.odd_dc_x2 > strategy.max_odds_dc_x2)) return false;

      return true;
    });
  }

  generateBets(strategy: Strategy, games: GameData[]): Bet[] {
    return games.map(game => {
      const betOdds = this.getOddsForMarket(strategy.market, game);
      const result = this.getBetResult(strategy.market, game);
      
      const profit = this.calculateBetProfit(result, betOdds, strategy.unit_stake);

      return {
        game,
        odds: betOdds,
        result,
        profit,
        date: new Date(game.date),
        match: `${game.home} vs ${game.away}`,
        score: `${game.goals_h_ft || 0}-${game.goals_a_ft || 0}`
      };
    });
  }

  getOddsForMarket(market: string, game: GameData): number {
    switch (market) {
      case "home_win":
        return game.odd_h_ft || 0;
      case "draw":
        return game.odd_d_ft || 0;
      case "away_win":
        return game.odd_a_ft || 0;
      case "home_win_ht":
        return game.odd_h_ht || 0;
      case "draw_ht":
        return game.odd_d_ht || 0;
      case "away_win_ht":
        return game.odd_a_ht || 0;
      case "over_15":
        return game.odd_over15_ft || 0;
      case "over_25":
        return game.odd_over25_ft || 0;
      case "under_15":
        return game.odd_under15_ft || 0;
      case "under_25":
        return game.odd_under25_ft || 0;
      case "btts_yes":
        return game.odd_btts_yes || 0;
      case "btts_no":
        return game.odd_btts_no || 0;
      case "dc_1x":
        return game.odd_dc_1x || 0;
      case "dc_12":
        return game.odd_dc_12 || 0;
      case "dc_x2":
        return game.odd_dc_x2 || 0;
      default:
        return 0;
    }
  }

  getBetResult(market: string, game: GameData): 'win' | 'loss' | 'undefined' {
    const homeGoalsFT = game.goals_h_ft;
    const awayGoalsFT = game.goals_a_ft;
    const homeGoalsHT = game.goals_h_ht;
    const awayGoalsHT = game.goals_a_ht;
    
    if (homeGoalsFT == null || awayGoalsFT == null) {
        const ftMarkets = ["home_win", "draw", "away_win",
                           "over_15", "over_25", "under_15", 
                           "under_25", "btts_yes", "btts_no",
                           "dc_1x", "dc_12", "dc_x2"];
        if (ftMarkets.includes(market)) return "undefined";
    }

    const totalGoalsFT = (homeGoalsFT || 0) + (awayGoalsFT || 0);

    switch (market) {
      case "home_win":
        return (homeGoalsFT || 0) > (awayGoalsFT || 0) ? "win" : "loss";
      case "draw":
        return (homeGoalsFT || 0) === (awayGoalsFT || 0) ? "win" : "loss";
      case "away_win":
        return (awayGoalsFT || 0) > (homeGoalsFT || 0) ? "win" : "loss";
      case "home_win_ht":
         if (homeGoalsHT == null || awayGoalsHT == null) return "undefined";
         return homeGoalsHT > awayGoalsHT ? "win" : "loss";
      case "draw_ht":
         if (homeGoalsHT == null || awayGoalsHT == null) return "undefined";
         return homeGoalsHT === awayGoalsHT ? "win" : "loss";
      case "away_win_ht":
         if (homeGoalsHT == null || awayGoalsHT == null) return "undefined";
         return awayGoalsHT > homeGoalsHT ? "win" : "loss";
      case "over_15":
        return totalGoalsFT >= 2 ? "win" : "loss";
      case "over_25":
        return totalGoalsFT >= 3 ? "win" : "loss";
      case "under_15":
        return totalGoalsFT < 2 ? "win" : "loss";
      case "under_25":
        return totalGoalsFT < 3 ? "win" : "loss";
      case "btts_yes":
        return (homeGoalsFT || 0) >= 1 && (awayGoalsFT || 0) >= 1 ? "win" : "loss";
      case "btts_no":
        return (homeGoalsFT || 0) < 1 || (awayGoalsFT || 0) < 1 ? "win" : "loss"; 
      case "dc_1x":
        return (homeGoalsFT || 0) >= (awayGoalsFT || 0) ? "win" : "loss";
      case "dc_12":
        return (homeGoalsFT || 0) !== (awayGoalsFT || 0) ? "win" : "loss";
      case "dc_x2":
        return (awayGoalsFT || 0) >= (homeGoalsFT || 0) ? "win" : "loss";
      default:
        return "loss";
    }
  }

  calculateBetProfit(result: 'win' | 'loss' | 'undefined', odds: number, unitStake: number): number {
    if (result === "undefined") return 0;
    if (!odds || odds === 0) {
        return -unitStake; 
    }
    
    if (result === "win") {
      return (odds - 1) * unitStake;
    } else {
      return -unitStake;
    }
  }

  calculateResults(bets: Bet[], strategy: Strategy): Results {
    const validBets = bets.filter(bet => bet.result !== "undefined" && bet.odds && bet.odds > 0);

    const totalBets = validBets.length;
    const winningBets = validBets.filter(bet => bet.result === "win").length;
    const hitRate = totalBets > 0 ? (winningBets / totalBets) * 100 : 0;
    
    const totalProfit = validBets.reduce((sum, bet) => sum + bet.profit, 0);
    const totalStaked = totalBets * strategy.unit_stake; 
    const roi = totalStaked > 0 ? (totalProfit / totalStaked) * 100 : 0;
    
    const averageOdds = totalBets > 0 
      ? validBets.reduce((sum, bet) => sum + bet.odds, 0) / totalBets
      : 0;

    const streaks = this.calculateStreaks(validBets);
    const analyses = this.generateAnalyses(validBets);
    const evolution = this.calculateEvolution(validBets, strategy.unit_stake);

    const recentSampleBets = [...validBets].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 20);

    return {
      total_bets: totalBets,
      winning_bets: winningBets,
      hit_rate: hitRate,
      average_odds: averageOdds,
      total_profit: totalProfit,
      roi: roi,
      max_winning_streak: streaks.maxWinningStreak,
      max_winning_streak_profit: streaks.maxWinningStreakProfit,
      max_losing_streak: streaks.maxLosingStreak,
      max_losing_streak_loss: streaks.maxLosingStreakLoss,
      sample_bets: recentSampleBets,
      best_leagues: analyses.bestLeagues,
      worst_leagues: analyses.worstLeagues,
      best_teams: analyses.bestTeams,
      worst_teams: analyses.worstTeams,
      common_scores: analyses.commonScores,
      evolution_chart: evolution
    };
  }

  calculateStreaks(bets: Bet[]): {
    maxWinningStreak: number;
    maxWinningStreakProfit: number;
    maxLosingStreak: number;
    maxLosingStreakLoss: number;
  } {
    let maxWinningStreak = 0;
    let maxWinningStreakProfit = 0;
    let maxLosingStreak = 0;
    let maxLosingStreakLoss = 0;
    
    let currentWinningStreak = 0;
    let currentWinningStreakProfit = 0;
    let currentLosingStreak = 0;
    let currentLosingStreakLoss = 0;

    bets.forEach(bet => {
      if (bet.result === "win") {
        currentWinningStreak++;
        currentWinningStreakProfit += bet.profit;
        currentLosingStreak = 0;
        currentLosingStreakLoss = 0;
        
        if (currentWinningStreak > maxWinningStreak) {
          maxWinningStreak = currentWinningStreak;
          maxWinningStreakProfit = currentWinningStreakProfit;
        } else if (currentWinningStreak === maxWinningStreak && currentWinningStreakProfit > maxWinningStreakProfit) {
          maxWinningStreakProfit = currentWinningStreakProfit;
        }
      } else {
        currentLosingStreak++;
        currentLosingStreakLoss += bet.profit;
        currentWinningStreak = 0;
        currentWinningStreakProfit = 0;
        
        if (currentLosingStreak > maxLosingStreak) {
          maxLosingStreak = currentLosingStreak;
          maxLosingStreakLoss = currentLosingStreakLoss;
        } else if (currentLosingStreak === maxLosingStreak && currentLosingStreakLoss < maxLosingStreakLoss) {
           maxLosingStreakLoss = currentLosingStreakLoss;
        }
      }
    });

    return {
      maxWinningStreak,
      maxWinningStreakProfit,
      maxLosingStreak,
      maxLosingStreakLoss
    };
  }

  generateAnalyses(bets: Bet[]): {
    bestLeagues: Array<{ name: string; profit: number; bets: number; avgProfit: number }>;
    worstLeagues: Array<{ name: string; profit: number; bets: number; avgProfit: number }>;
    bestTeams: Array<{ name: string; profit: number; bets: number; avgProfit: number }>;
    worstTeams: Array<{ name: string; profit: number; bets: number; avgProfit: number }>;
    commonScores: Array<{ score: string; count: number; percentage: string }>;
  } {
    const leagueStats: Record<string, LeagueStats> = {};
    const teamStats: Record<string, TeamStats> = {};
    const scoreStats: Record<string, number> = {};

    bets.forEach(bet => {
      const league = bet.game.league;
      const homeTeam = bet.game.home;
      const awayTeam = bet.game.away;
      const score = bet.score;

      if (league) {
        if (!leagueStats[league]) leagueStats[league] = { profit: 0, bets: 0 };
        leagueStats[league].profit += bet.profit;
        leagueStats[league].bets++;
      }

      [homeTeam, awayTeam].forEach(team => {
        if (team) {
          if (!teamStats[team]) teamStats[team] = { profit: 0, bets: 0 };
          teamStats[team].profit += bet.profit;
          teamStats[team].bets++;
        }
      });

      if (score) {
        if (!scoreStats[score]) scoreStats[score] = 0;
        scoreStats[score]++;
      }
    });

    const calculateAvgProfit = (stats: LeagueStats | TeamStats) => stats.bets > 0 ? stats.profit / stats.bets : 0;

    const bestLeagues = Object.entries(leagueStats)
      .filter(([, stats]) => stats.profit > 0)
      .sort(([, a], [, b]) => b.profit - a.profit)
      .slice(0, 10)
      .map(([name, stats]) => ({ name, ...stats, avgProfit: calculateAvgProfit(stats) }));

    const worstLeagues = Object.entries(leagueStats)
      .filter(([, stats]) => stats.profit < 0)
      .sort(([, a], [, b]) => a.profit - b.profit)
      .slice(0, 10)
      .map(([name, stats]) => ({ name, ...stats, avgProfit: calculateAvgProfit(stats) }));

    const bestTeams = Object.entries(teamStats)
      .filter(([, stats]) => stats.profit > 0)
      .sort(([, a], [, b]) => b.profit - a.profit)
      .slice(0, 10)
      .map(([name, stats]) => ({ name, ...stats, avgProfit: calculateAvgProfit(stats) }));

    const worstTeams = Object.entries(teamStats)
      .filter(([, stats]) => stats.profit < 0)
      .sort(([, a], [, b]) => a.profit - b.profit)
      .slice(0, 10)
      .map(([name, stats]) => ({ name, ...stats, avgProfit: calculateAvgProfit(stats) }));

    const commonScores = Object.entries(scoreStats)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([score, count]) => ({
        score,
        count,
        percentage: bets.length > 0 ? ((count / bets.length) * 100).toFixed(1) : "0.0"
      }));

    return { bestLeagues, worstLeagues, bestTeams, worstTeams, commonScores };
  }

  calculateEvolution(bets: Bet[], unitStake: number): Array<{ bet: number; profit: number; roi: number }> {
    let runningProfit = 0;
    return bets.map((bet, index) => {
      runningProfit += bet.profit;
      const currentTotalStake = (index + 1) * unitStake;
      return {
        bet: index + 1,
        profit: runningProfit,
        roi: currentTotalStake > 0 ? ((runningProfit / currentTotalStake) * 100) : 0
      };
    });
  }
}

export default BacktestingEngine;
