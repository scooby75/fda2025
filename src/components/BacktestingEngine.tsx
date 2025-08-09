
export default class BacktestingEngine {
  filterGames(strategy: any, gameData: any[]) {
    return gameData.filter(game => {
      // Apply date filters
      if (strategy.start_date && game.date < strategy.start_date) return false;
      if (strategy.end_date && game.date > strategy.end_date) return false;
      
      // Apply league filters
      if (strategy.leagues && strategy.leagues.length > 0) {
        if (!strategy.leagues.includes(game.league)) return false;
      }
      
      // Apply team filters
      if (strategy.home_teams && strategy.home_teams.length > 0) {
        if (!strategy.home_teams.includes(game.home)) return false;
      }
      
      if (strategy.away_teams && strategy.away_teams.length > 0) {
        if (!strategy.away_teams.includes(game.away)) return false;
      }
      
      return true;
    });
  }

  runBacktest(strategy: any, gameData: any[], rankingHomeData: any[] = [], rankingAwayData: any[] = []) {
    const filteredGames = this.filterGames(strategy, gameData);
    
    let totalBets = 0;
    let winningBets = 0;
    let totalProfit = 0;
    let totalOdds = 0;
    const evolutionChart = [];
    const sampleBets = [];

    filteredGames.forEach((game, index) => {
      const odds = this.getOddsForMarket(game, strategy.market);
      
      if (!odds || (strategy.min_odds && odds < strategy.min_odds) || (strategy.max_odds && odds > strategy.max_odds)) {
        return;
      }

      totalBets++;
      totalOdds += odds;

      const betResult = this.getBetResult(game, strategy.market);
      const profit = betResult === 'win' ? (odds - 1) * strategy.unit_stake : -strategy.unit_stake;
      
      if (betResult === 'win') {
        winningBets++;
      }
      
      totalProfit += profit;

      evolutionChart.push({
        bet: totalBets,
        profit: totalProfit
      });

      if (sampleBets.length < 20) {
        sampleBets.push({
          date: new Date(game.date),
          match: `${game.home} vs ${game.away}`,
          score: `${game.goals_h_ft || 0}-${game.goals_a_ft || 0}`,
          odds,
          result: betResult,
          profit
        });
      }
    });

    const hitRate = totalBets > 0 ? (winningBets / totalBets) * 100 : 0;
    const averageOdds = totalBets > 0 ? totalOdds / totalBets : 0;
    const roi = totalBets > 0 ? (totalProfit / (totalBets * strategy.unit_stake)) * 100 : 0;

    return {
      total_bets: totalBets,
      winning_bets: winningBets,
      hit_rate: hitRate,
      average_odds: averageOdds,
      total_profit: totalProfit,
      roi,
      max_winning_streak: 0,
      max_winning_streak_profit: 0,
      max_losing_streak: 0,
      max_losing_streak_loss: 0,
      best_leagues: [],
      worst_leagues: [],
      best_teams: [],
      worst_teams: [],
      common_scores: [],
      evolution_chart: evolutionChart,
      sample_bets: sampleBets
    };
  }

  private getOddsForMarket(game: any, market: string) {
    switch (market) {
      case 'home_win': return game.odd_h_ft;
      case 'draw': return game.odd_d_ft;
      case 'away_win': return game.odd_a_ft;
      case 'over_25': return game.odd_over25_ft;
      case 'under_25': return game.odd_under25_ft;
      case 'btts_yes': return game.odd_btts_yes;
      case 'btts_no': return game.odd_btts_no;
      default: return null;
    }
  }

  private getBetResult(game: any, market: string) {
    const homeGoals = game.goals_h_ft || 0;
    const awayGoals = game.goals_a_ft || 0;
    const totalGoals = homeGoals + awayGoals;

    switch (market) {
      case 'home_win':
        return homeGoals > awayGoals ? 'win' : 'loss';
      case 'draw':
        return homeGoals === awayGoals ? 'win' : 'loss';
      case 'away_win':
        return awayGoals > homeGoals ? 'win' : 'loss';
      case 'over_25':
        return totalGoals > 2.5 ? 'win' : 'loss';
      case 'under_25':
        return totalGoals < 2.5 ? 'win' : 'loss';
      case 'btts_yes':
        return homeGoals > 0 && awayGoals > 0 ? 'win' : 'loss';
      case 'btts_no':
        return homeGoals === 0 || awayGoals === 0 ? 'win' : 'loss';
      default:
        return 'loss';
    }
  }
}
