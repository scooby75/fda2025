// Dixon-Coles Model Implementation
export class DixonColesModel {
  constructor() {
    this.rho = -0.13; // Correlation parameter for low-scoring games
  }

  // Calculate Poisson probability
  poissonProbability(lambda, k) {
    return Math.exp(-lambda) * Math.pow(lambda, k) / this.factorial(k);
  }

  factorial(n) {
    if (n <= 1) return 1;
    return n * this.factorial(n - 1);
  }

  // Dixon-Coles adjustment factor
  tau(x, y, lambda, mu) {
    if (x === 0 && y === 0) {
      return 1 - lambda * mu * this.rho;
    } else if (x === 0 && y === 1) {
      return 1 + lambda * this.rho;
    } else if (x === 1 && y === 0) {
      return 1 + mu * this.rho;
    } else if (x === 1 && y === 1) {
      return 1 - this.rho;
    }
    return 1;
  }

  // Calculate probability of exact score
  calculateScoreProbability(homeGoals, awayGoals, homeRate, awayRate) {
    const poissonHome = this.poissonProbability(homeRate, homeGoals);
    const poissonAway = this.poissonProbability(awayRate, awayGoals);
    const adjustment = this.tau(homeGoals, awayGoals, homeRate, awayRate);
    
    return poissonHome * poissonAway * adjustment;
  }

  // Calculate match outcome probabilities
  calculateMatchProbabilities(homeRate, awayRate) {
    let homeWin = 0;
    let draw = 0;
    let awayWin = 0;

    // Calculate probabilities for scores up to 5-5
    for (let i = 0; i <= 5; i++) {
      for (let j = 0; j <= 5; j++) {
        const prob = this.calculateScoreProbability(i, j, homeRate, awayRate);
        
        if (i > j) {
          homeWin += prob;
        } else if (i === j) {
          draw += prob;
        } else {
          awayWin += prob;
        }
      }
    }

    // Normalize to ensure probabilities sum to 1
    const total = homeWin + draw + awayWin;
    return {
      homeWin: homeWin / total,
      draw: draw / total,
      awayWin: awayWin / total
    };
  }

  // Calculate goals probabilities
  calculateGoalsProbabilities(homeRate, awayRate) {
    let over15 = 0;
    let over25 = 0;
    let over35 = 0;

    // Calculate probabilities for scores up to 5-5
    for (let i = 0; i <= 5; i++) {
      for (let j = 0; j <= 5; j++) {
        const prob = this.calculateScoreProbability(i, j, homeRate, awayRate);
        const totalGoals = i + j;
        
        if (totalGoals >= 2) over15 += prob;
        if (totalGoals >= 3) over25 += prob;
        if (totalGoals >= 4) over35 += prob;
      }
    }

    return {
      over15,
      over25,
      over35,
      under15: 1 - over15,
      under25: 1 - over25,
      under35: 1 - over35
    };
  }

  // Calculate BTTS probability
  calculateBTTSProbability(homeRate, awayRate) {
    let bttsYes = 0;

    // Calculate probabilities for scores up to 5-5
    for (let i = 0; i <= 5; i++) {
      for (let j = 0; j <= 5; j++) {
        const prob = this.calculateScoreProbability(i, j, homeRate, awayRate);
        
        if (i >= 1 && j >= 1) {
          bttsYes += prob;
        }
      }
    }

    return {
      bttsYes,
      bttsNo: 1 - bttsYes
    };
  }

  // Calculate attack and defense rates from recent games
  calculateTeamRates(recentGames, isHome) {
    if (!recentGames || recentGames.length === 0) {
      return { attackRate: 1.3, defenseRate: 1.3 }; // League average fallback
    }

    let goalsFor = 0;
    let goalsAgainst = 0;
    let validGames = 0;

    recentGames.forEach(game => {
      if (game.Goals_H_FT != null && game.Goals_A_FT != null) {
        if (isHome) {
          goalsFor += game.Goals_H_FT;
          goalsAgainst += game.Goals_A_FT;
        } else {
          goalsFor += game.Goals_A_FT;
          goalsAgainst += game.Goals_H_FT;
        }
        validGames++;
      }
    });

    if (validGames === 0) {
      return { attackRate: 1.3, defenseRate: 1.3 };
    }

    const avgGoalsFor = goalsFor / validGames;
    const avgGoalsAgainst = goalsAgainst / validGames;

    return {
      attackRate: Math.max(0.1, avgGoalsFor),
      defenseRate: Math.max(0.1, avgGoalsAgainst)
    };
  }

  // Main function to calculate all probabilities
  calculateH2HInsights(homeRecentGames, awayRecentGames, h2hMatches) {
    // Calculate team rates from recent form
    const homeRates = this.calculateTeamRates(homeRecentGames, true);
    const awayRates = this.calculateTeamRates(awayRecentGames, false);

    // Adjust rates based on H2H history if available
    let homeAttackRate = homeRates.attackRate;
    let awayAttackRate = awayRates.attackRate;

    // Factor in H2H matches for rate adjustment
    if (h2hMatches && h2hMatches.length > 0) {
      const h2hHomeRate = this.calculateTeamRates(h2hMatches, true);
      const h2hAwayRate = this.calculateTeamRates(h2hMatches, false);
      
      // Weighted average: 70% recent form, 30% H2H history
      homeAttackRate = (homeRates.attackRate * 0.7) + (h2hHomeRate.attackRate * 0.3);
      awayAttackRate = (awayRates.attackRate * 0.7) + (h2hAwayRate.attackRate * 0.3);
    }

    // Apply league context (assuming average of 2.6 goals per game)
    const leagueAverage = 1.3;
    homeAttackRate = (homeAttackRate + leagueAverage) / 2;
    awayAttackRate = (awayAttackRate + leagueAverage) / 2;

    // Calculate all probabilities
    const matchProbs = this.calculateMatchProbabilities(homeAttackRate, awayAttackRate);
    const goalsProbs = this.calculateGoalsProbabilities(homeAttackRate, awayAttackRate);
    const bttsProbs = this.calculateBTTSProbability(homeAttackRate, awayAttackRate);

    return {
      match: matchProbs,
      goals: goalsProbs,
      btts: bttsProbs,
      rates: {
        homeAttack: homeAttackRate,
        awayAttack: awayAttackRate
      }
    };
  }

  // Calculate fair odds (100 / probability%)
  calculateFairOdds(probability) {
    return probability > 0 ? (1 / probability) : 999;
  }
}

export default DixonColesModel;